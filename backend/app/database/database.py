from __future__ import annotations

import sqlite3
from datetime import datetime, timedelta, timezone
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "logs.db"


def init_db() -> None:
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS attack_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                text TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                status TEXT NOT NULL,
                blocked INTEGER NOT NULL,
                source TEXT NOT NULL
            )
            """
        )
        existing_count = connection.execute("SELECT COUNT(*) AS value FROM attack_logs").fetchone()["value"]
        if existing_count < 8:
            seed_demo_logs(connection)
        connection.commit()


def seed_demo_logs(connection: sqlite3.Connection) -> None:
    now = datetime.now(timezone.utc)
    demo_rows = [
        (now - timedelta(minutes=18), "Hello admin", "Normal", 0.99, "allowed", 0, "protected"),
        (now - timedelta(minutes=15), "<script>alert('xss')</script>", "XSS", 0.99, "blocked", 1, "protected"),
        (now - timedelta(minutes=13), "' OR 1=1 --", "SQLi", 0.98, "blocked", 1, "protected"),
        (now - timedelta(minutes=11), "SELECT * FROM users WHERE id = 1", "SQLi", 0.91, "blocked", 1, "protected"),
        (now - timedelta(minutes=9), "Customer support ticket update", "Normal", 0.97, "allowed", 0, "protected"),
        (now - timedelta(minutes=7), "<img src=x onerror=alert('xss')>", "XSS", 0.96, "blocked", 1, "protected"),
        (now - timedelta(minutes=5), "Order status inquiry", "Normal", 0.98, "allowed", 0, "protected"),
        (now - timedelta(minutes=3), "UNION SELECT username, password FROM accounts", "SQLi", 0.97, "blocked", 1, "protected"),
    ]

    connection.executemany(
        """
        INSERT INTO attack_logs (timestamp, text, prediction, confidence, status, blocked, source)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (timestamp.isoformat(), text, prediction, confidence, status, blocked, source)
            for timestamp, text, prediction, confidence, status, blocked, source in demo_rows
        ],
    )


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()
