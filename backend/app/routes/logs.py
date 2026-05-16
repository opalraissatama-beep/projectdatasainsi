from __future__ import annotations

from fastapi import APIRouter

from app.database.database import get_connection


router = APIRouter(tags=["logs"])


@router.get("/logs")
def logs(limit: int = 50) -> dict:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, timestamp, text, prediction, confidence, status, blocked, source
            FROM attack_logs
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return {"items": [dict(row) for row in rows]}
