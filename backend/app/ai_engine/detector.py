from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import warnings
import re

import joblib
import pandas as pd
import scipy.sparse as sp

from app.ai_engine.feature_extractor import extract_security_features


MODEL_PATH = Path(__file__).resolve().parents[3] / "sentinel_ai_engine_v2.pkl"


@dataclass
class DetectionResult:
    label: str
    confidence: float
    probs: dict[str, float]


class Detector:
    def __init__(self) -> None:
        self.engine = None
        self.model = None
        self.tfidf = None
        self.label_encoder = None
        self._load_engine()

    def _load_engine(self) -> None:
        if not MODEL_PATH.exists():
            return

        try:
            self.engine = joblib.load(MODEL_PATH)
        except Exception:
            self.engine = None
            return

        self.model = self.engine.get("model")
        self.tfidf = self.engine.get("tfidf")
        self.label_encoder = self.engine.get("label_encoder")

    def _heuristic_predict(self, text: str) -> DetectionResult:
        lower_text = text.lower()
        score_map = {
            "XSS": 0.0,
            "SQLi": 0.0,
            "Normal": 0.0,
        }

        if any(token in lower_text for token in ["<script", "javascript:", "onerror=", "onload="]):
            score_map["XSS"] += 0.95
        if any(token in lower_text for token in ["' or 1=1", '" or 1=1', "union select", "drop table", "--"]):
            score_map["SQLi"] += 0.95
        if score_map["XSS"] == 0.0 and score_map["SQLi"] == 0.0:
            score_map["Normal"] = 0.99
        else:
            score_map["Normal"] = 0.05

        label = max(score_map, key=score_map.get)
        confidence = score_map[label]
        return DetectionResult(label=label, confidence=confidence, probs=score_map)

    def _has_attack_signals(self, text: str) -> bool:
        lower_text = text.lower()
        signatures = [
            r"<\s*script",
            r"javascript:",
            r"onerror\s*=",
            r"onload\s*=",
            r"'\s*or\s*1=1",
            r'"\s*or\s*1=1',
            r"union\s+select",
            r"drop\s+table",
            r"--",
        ]
        return any(re.search(pattern, lower_text, re.IGNORECASE) for pattern in signatures)

    def predict(self, text: str) -> DetectionResult:
        if not self._has_attack_signals(text):
            return DetectionResult(
                label="Normal",
                confidence=0.99,
                probs={"Normal": 0.99, "SQLi": 0.005, "XSS": 0.005},
            )

        if not self.model or not self.tfidf or not self.label_encoder:
            return self._heuristic_predict(text)

        tfidf_vec = self.tfidf.transform([text])
        manual_vec = extract_security_features(pd.Series([text]))
        combined = sp.hstack([tfidf_vec, sp.csr_matrix(manual_vec)])
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", message="X does not have valid feature names*", category=UserWarning)
            probs = self.model.predict_proba(combined)[0]
        classes = list(self.label_encoder.classes_)
        label = classes[int(probs.argmax())]
        confidence = float(probs.max())
        return DetectionResult(
            label=label,
            confidence=confidence,
            probs=dict(zip(classes, [float(value) for value in probs.tolist()])),
        )


detector = Detector()
