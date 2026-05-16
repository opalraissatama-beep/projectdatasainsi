from __future__ import annotations

import re

import pandas as pd


PATTERNS = {
    "has_script": re.compile(r"<\s*script", re.IGNORECASE),
    "has_sql_union": re.compile(r"union\s+select", re.IGNORECASE),
    "has_sql_comment": re.compile(r"--|/\*|\*/", re.IGNORECASE),
    "has_or_equals": re.compile(r"'\s*or\s*1=1", re.IGNORECASE),
    "has_event_handler": re.compile(r"on\w+\s*=", re.IGNORECASE),
    "has_quotes": re.compile(r"['\"]"),
}


def extract_security_features(series: pd.Series) -> list[list[float]]:
    features: list[list[float]] = []
    for text in series.fillna("").astype(str):
        lower_text = text.lower()
        features.append(
            [
                float(len(text)),
                float(sum(text.count(symbol) for symbol in ["'", '"', "<", ">", ";"])),
                float(any(pattern.search(text) for pattern in PATTERNS.values())),
                float("script" in lower_text),
                float("select" in lower_text and "from" in lower_text),
                float("drop table" in lower_text),
                float("alert(" in lower_text),
                float(text.count(" ")),
            ]
        )
    return features
