# Unfollow Wall — digital version

A real-time, projectable version of the Miracle of Mind "Unfollow Wall" activity.
Participants submit what they'd like to "unfollow" from their phones; cards appear
live on the projected screen so the room sees they're not alone. The host then taps
**Unfollow All**, everything dissolves, and a closing line segues into the meditation.

Built for small, ad-hoc settings (e.g. 5–10 people in a living room, projecting on a TV)
where setting up a physical board and booth isn't practical.

## Files
| File | Purpose |
|------|---------|
| `index.html` | **The Wall** — open this on the TV / projector |
| `submit.html` | **Phone page** — participants reach it by scanning the QR on the wall |
| `config.js` | All settings: backend URL, timer, examples, closing lines, prompts |
| `api.js` | Small client for the backend (fetch + WebSocket), shared by both pages |
| `backend/` | The realtime API (FastAPI + SQLite), deployed on Railway |

## How it's wired
The two pages are static and live on GitHub Pages. They talk to a small FastAPI
service on Railway that stores the cards and pushes them to the wall over a
WebSocket.

- **Wall / phone:** https://miracleofmindexperience.github.io/unfollow-wall/
- **Backend:** https://unfollow-wall-production.up.railway.app (`/health` says if it's awake)

Nothing here needs a key — the 4-letter room code is the only thing separating
one wall from another, and no personal data is stored.

## Changing the backend URL
Set `API_BASE` in `config.js`, then push. If you ever redeploy the API to a new
Railway domain, that one line is the only change needed.

## Running a session
1. Open `index.html` on the TV, press **F** for fullscreen.
2. The room shows a **QR code + 4-letter code**. Participants scan → type → submit.
3. Press **S** to start the collection timer (1 min by default — `TIMER_MINUTES` in `config.js`).
   Submissions stay hidden and the counter ticks up; at 0:00 they all fly onto the wall.
   Press **R** to reveal early.
4. When ready, press **U** (or **Unfollow All**) → cards dissolve → closing message appears.
5. Hand off to the facilitator (introduce Sadhguru + the Miracle of Mind meditation).
6. Press **N** for a **New session** (clears the wall, fresh room code) for the next group.

### Host keyboard shortcuts
`S` / `Space` start timer · `R` reveal now · `U` unfollow all · `N` new session · `F` fullscreen
(Controls also appear at the bottom when you move the mouse, and stay hidden on projection otherwise.)

## Notes
- **If the wall can't reach the backend it says so**, in a red bar across the top, with a
  Retry button. If you see that bar, phones cannot submit — fix it before the room scans.
- No personal data is collected — just the free-text card. Rooms are swept after 24 hours.
- Local testing: open `index.html` in one browser tab and `submit.html?room=XXXX` in another
  to simulate a phone. For real phones, the site must be deployed to a public URL.

## Running the backend locally
```bash
cd backend
python3 -m venv venv
venv/bin/python3 -m pip install -r requirements.txt
venv/bin/python3 -m uvicorn main:app --port 8898
```
Then point `API_BASE` in `config.js` at `http://127.0.0.1:8898` while you test.

## Deploying the backend
```bash
cd backend
railway up --service unfollow-wall
```
