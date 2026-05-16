from __future__ import annotations

import re

from fastapi import APIRouter

from app.ai_engine.detector import detector
from app.models.schemas import DetectionResponse, PredictRequest, VulnerableRequest
from app.services.log_service import save_log


router = APIRouter(tags=["detection"])


def _build_exposed_data(text: str) -> list[str]:
    lower_text = text.lower()

    if any(token in lower_text for token in ["<script", "javascript:", "onerror=", "onload="]):
        payload_preview = text.strip().replace("\n", " ")[:120]
        alert_match = re.search(r"alert\((.*?)\)", text, re.IGNORECASE)
        alert_value = alert_match.group(1) if alert_match else "demo"
        return [
            f"payload: {payload_preview}",
            f"executed: alert({alert_value})",
            "session_user: demo_admin",
            "email: demo_admin@corp.local",
            "role: administrator",
        ]

    if any(token in lower_text for token in ["' or 1=1", '" or 1=1', "union select", "drop table", "--"]):
        select_match = re.search(r"select\s+(.*?)\s+from", lower_text, re.IGNORECASE)
        requested_columns = [
            column.strip()
            for column in select_match.group(1).split(",")
        ] if select_match else []

        exposed_data = [
            "user_id: 1042",
            "username: demo_admin",
        ]

        if not requested_columns:
            exposed_data.extend([
                "email: demo_admin@corp.local",
                "password_hash: ******",
                "last_login: 2026-05-15T08:30:00Z",
            ])
            return exposed_data

        field_map = {
            "id": "user_id: 1042",
            "user_id": "user_id: 1042",
            "username": "username: demo_admin",
            "email": "email: demo_admin@corp.local",
            "password": "password_hash: ******",
            "password_hash": "password_hash: ******",
            "role": "role: administrator",
            "created_at": "created_at: 2024-11-02T10:12:00Z",
            "last_login": "last_login: 2026-05-15T08:30:00Z",
            "token": "session_token: masked-demo-token",
        }

        for column in requested_columns:
            exposed_data.append(field_map.get(column, f"{column}: [demo value]"))

        return exposed_data

    if "login" in lower_text:
        username_match = re.search(r"username\s*=\s*([^&\s]+)", text, re.IGNORECASE)
        username = username_match.group(1) if username_match else "demo_admin"
        return [
            f"username: {username}",
            "email: demo_admin@corp.local",
            "role: administrator",
            "last_login: 2026-05-15T08:30:00Z",
        ]

    if "search" in lower_text:
        query_match = re.search(r"query\s*=\s*(.+)$", text, re.IGNORECASE)
        query = query_match.group(1).strip() if query_match else text.strip()
        return [
            f"search_query: {query}",
            "matched_article: security update",
            "published_by: editor_team",
        ]

    if "comment" in lower_text:
        comment_match = re.search(r"text\s*=\s*(.+)$", text, re.IGNORECASE)
        comment_text = comment_match.group(1).strip() if comment_match else text.strip()
        return [
            f"comment: {comment_text}",
            "posted_by: demo_admin",
            "status: published",
        ]

    return [
        "No sensitive data exposed.",
    ]


def _format_status(label: str, confidence: float) -> tuple[str, bool, str]:
    blocked = label in {"XSS", "SQLi"} and confidence > 0.8
    if blocked:
        return "blocked", True, "Potential attack detected"
    return "allowed", False, "Request allowed"


@router.post("/predict", response_model=DetectionResponse)
def predict(payload: PredictRequest) -> DetectionResponse:
    result = detector.predict(payload.text)
    status, blocked, message = _format_status(result.label, result.confidence)
    save_log(payload.text, result.label, result.confidence, status, blocked, payload.source)
    return DetectionResponse(
        status=status,
        prediction=result.label,
        confidence=result.confidence,
        message=message if blocked else None,
        blocked=blocked,
    )


@router.post("/vulnerable")
def vulnerable(payload: VulnerableRequest) -> dict:
    lower_text = payload.text.lower()
    if any(token in lower_text for token in ["<script", "javascript:", "onerror=", "onload="]):
        result = {
            "status": "allowed",
            "message": "⚠ Payload lolos. Data yang tampil menyesuaikan input.",
            "prediction": "XSS",
            "simulatedData": _build_exposed_data(payload.text),
        }
    elif any(token in lower_text for token in ["' or 1=1", '" or 1=1', "union select", "drop table", "--"]):
        result = {
            "status": "allowed",
            "message": "⚠ Request lolos. Data yang tampil menyesuaikan input.",
            "prediction": "SQLi",
            "simulatedData": _build_exposed_data(payload.text),
        }
    else:
        result = {
            "status": "allowed",
            "message": "Input rendered without protection",
            "prediction": "Normal",
            "simulatedData": _build_exposed_data(payload.text),
        }

    save_log(payload.text, result["prediction"], 0.0, "unprotected", False, "vulnerable")
    return result
