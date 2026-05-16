from __future__ import annotations

from fastapi import APIRouter

from app.database.database import get_connection


router = APIRouter(tags=["stats"])


@router.get("/stats")
def stats() -> dict:
    with get_connection() as connection:
        total = connection.execute("SELECT COUNT(*) AS value FROM attack_logs").fetchone()["value"]
        blocked = connection.execute("SELECT COUNT(*) AS value FROM attack_logs WHERE blocked = 1").fetchone()["value"]
        xss = connection.execute("SELECT COUNT(*) AS value FROM attack_logs WHERE prediction = 'XSS'").fetchone()["value"]
        sqli = connection.execute("SELECT COUNT(*) AS value FROM attack_logs WHERE prediction = 'SQLi'").fetchone()["value"]
        normal = connection.execute("SELECT COUNT(*) AS value FROM attack_logs WHERE prediction = 'Normal'").fetchone()["value"]
        rows = connection.execute(
            """
            SELECT timestamp, prediction, confidence, status, blocked
            FROM attack_logs
            ORDER BY id DESC
            LIMIT 12
            """
        ).fetchall()

    average_confidence = 0.0
    if total:
        with get_connection() as connection:
            average_confidence = connection.execute(
                "SELECT COALESCE(AVG(confidence), 0.0) AS value FROM attack_logs"
            ).fetchone()["value"]

    return {
        "totalAttacks": total,
        "blockedRequests": blocked,
        "xssCount": xss,
        "sqliCount": sqli,
        "normalTraffic": normal,
        "averageConfidence": round(float(average_confidence), 4),
        "timeline": [dict(row) for row in rows],
        "systemStatus": "protected" if blocked else "monitoring",
    }
