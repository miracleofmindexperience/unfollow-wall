"""
Unfollow Wall — realtime backend.

Replaces the old Supabase project (which was torn down after the free tier
paused it). Same job, three moving parts:

  * SQLite for the cards, so a wall refresh or a container restart mid-session
    doesn't lose what the room already submitted.
  * A WebSocket per room, so cards land on the projected wall the instant a
    phone submits.
  * /health, so the wall can tell the host the backend is awake *before* a
    session instead of failing silently while people scan.

Rooms are ephemeral: anything older than ROOM_TTL_HOURS is swept on write.
No personal data is stored — just the free-text card.
"""

import os
import sqlite3
import threading
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = os.environ.get("DB_PATH", "unfollow.db")
MAX_LENGTH = int(os.environ.get("MAX_LENGTH", "80"))
MAX_PER_ROOM = int(os.environ.get("MAX_PER_ROOM", "500"))
ROOM_TTL_HOURS = int(os.environ.get("ROOM_TTL_HOURS", "24"))

_db_lock = threading.Lock()
_db = sqlite3.connect(DB_PATH, check_same_thread=False)
_db.row_factory = sqlite3.Row


def _init_db() -> None:
    with _db_lock:
        _db.execute(
            """
            create table if not exists submissions (
              id         text primary key,
              room       text not null,
              text       text not null,
              created_at text not null
            )
            """
        )
        _db.execute(
            "create index if not exists submissions_room_idx on submissions (room, created_at)"
        )
        _db.commit()


def _sweep_old() -> None:
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=ROOM_TTL_HOURS)).isoformat()
    with _db_lock:
        _db.execute("delete from submissions where created_at < ?", (cutoff,))
        _db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _init_db()
    _sweep_old()
    yield


app = FastAPI(title="Unfollow Wall", lifespan=lifespan)

# The wall and the phone page are served from GitHub Pages (and opened from
# file:// during local testing), so the origin varies. Nothing here is
# sensitive or authenticated — anyone with the room code can already post.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Submission(BaseModel):
    text: str


# ---- Realtime fan-out -------------------------------------------------------

class Rooms:
    """Live WebSocket connections, grouped by room code."""

    def __init__(self) -> None:
        self._conns: dict[str, set[WebSocket]] = {}

    async def join(self, room: str, ws: WebSocket) -> None:
        await ws.accept()
        self._conns.setdefault(room, set()).add(ws)

    def leave(self, room: str, ws: WebSocket) -> None:
        peers = self._conns.get(room)
        if peers:
            peers.discard(ws)
            if not peers:
                self._conns.pop(room, None)

    async def broadcast(self, room: str, message: dict) -> None:
        dead = []
        for ws in list(self._conns.get(room, ())):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.leave(room, ws)

    def count(self) -> int:
        return sum(len(v) for v in self._conns.values())


rooms = Rooms()


# ---- Routes -----------------------------------------------------------------

@app.get("/health")
def health():
    with _db_lock:
        total = _db.execute("select count(*) as n from submissions").fetchone()["n"]
    return {"ok": True, "cards": total, "listeners": rooms.count()}


@app.get("/rooms/{room}/submissions")
def list_submissions(room: str):
    room = room.upper()
    with _db_lock:
        rows = _db.execute(
            "select id, text from submissions where room = ? order by created_at asc",
            (room,),
        ).fetchall()
    return {"submissions": [dict(r) for r in rows]}


@app.post("/rooms/{room}/submissions", status_code=201)
async def add_submission(room: str, body: Submission):
    room = room.upper()
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Empty submission")
    if len(text) > MAX_LENGTH:
        raise HTTPException(400, f"Too long (max {MAX_LENGTH} characters)")

    with _db_lock:
        n = _db.execute(
            "select count(*) as n from submissions where room = ?", (room,)
        ).fetchone()["n"]
    if n >= MAX_PER_ROOM:
        raise HTTPException(429, "This wall is full")

    item = {"id": str(uuid.uuid4()), "text": text}
    with _db_lock:
        _db.execute(
            "insert into submissions (id, room, text, created_at) values (?,?,?,?)",
            (item["id"], room, text, datetime.now(timezone.utc).isoformat()),
        )
        _db.commit()

    await rooms.broadcast(room, {"type": "new", "item": item})
    return item


@app.delete("/rooms/{room}/submissions")
async def clear_room(room: str):
    room = room.upper()
    with _db_lock:
        _db.execute("delete from submissions where room = ?", (room,))
        _db.commit()
    _sweep_old()
    await rooms.broadcast(room, {"type": "clear"})
    return {"ok": True}


@app.websocket("/ws/{room}")
async def ws_room(ws: WebSocket, room: str):
    room = room.upper()
    await rooms.join(room, ws)
    try:
        while True:
            # The client never sends anything meaningful; this keeps the socket
            # open and lets us notice a disconnect.
            await ws.receive_text()
    except WebSocketDisconnect:
        rooms.leave(room, ws)
    except Exception:
        rooms.leave(room, ws)
