from __future__ import annotations

from datetime import datetime, timezone

from app.database.database import get_connection


def save_log(text: str, prediction: str, confidence: float, status: str, blocked: bool, source: str) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO attack_logs (timestamp, text, prediction, confidence, status, blocked, source)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (timestamp, text, prediction, confidence, status, int(blocked), source),
        )
        connection.commit()
