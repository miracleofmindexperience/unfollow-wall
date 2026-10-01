# Changelog — Unfollow Wall

A real-time, projectable digital version of the Miracle of Mind "Unfollow Wall" activity.
Notable changes are listed newest first.

---

## 2026-10-01

### Logo back on the closing page, line enlarged
**File:** `index.html`
**Requested by:** Lavanya (Isha) — wants the Miracle of Mind logo on the closing page,
with more space above it and a larger line.
**Change:** The centred logo is back beneath the closing line. The line grew from
`clamp(34px,4.4vw,58px)` to `clamp(42px,5.6vw,74px)` (~72px on a 720p screen, up from
~56px), the gap between line and logo went from 38px to 66px, and the logo is slightly
larger at `clamp(58px,7.4vw,102px)`. The rest of the wall chrome stays hidden, so the
screen holds the line and the logo only — matching Lavanya's original request.

### The close was briefly just the line, on an empty screen
**Files:** `index.html`, `config.js`
**Change:** The centred Miracle of Mind logo that followed the closing line is gone, and
the wall's own chrome — title, QR badge, corner logo, hint — now fades out with the cards.
After **Unfollow All** the screen holds one line and nothing else, ready for the handoff
to the facilitator. Host controls still appear on mouse move for **New session**.

### Closing sequence cut to one line
**Files:** `index.html`, `config.js`
**Requested by:** Lavanya (Isha), 2026-10-01 — "remove all the text and keep only
'If only it were that easy.' and the MoM logo after we clear the wall."
**Change:** The three-beat close is gone. After **Unfollow All** scatters the cards the
wall now shows a single line — "If only it were that easy." — followed by the Miracle of
Mind logo, and nothing else. Dropped "What if it actually is?" and "Let's experience"
along with their markup and styles; `CLOSING` in `config.js` is now a single `line`.
The logo follows at 2.6s instead of 7.1s, since there are no longer two beats to wait on.

---

## 2026-08-20

### Backend moved off Supabase to Railway — the QR was dead because the database was gone
**Files:** `backend/` (new), `api.js` (new), `config.js`, `index.html`, `submit.html`, `supabase-setup.sql` (removed)
**Reported as:** "scanning the QR code isn't working."
**Cause:** The QR and both pages were fine. The Supabase project
(`aocxxqxeayitffqkxegh.supabase.co`) no longer existed — the hostname didn't even
resolve. Free-tier projects pause when idle and are eventually torn down, and the
wall hadn't run since 2026-06-23. Phones reached the submit page, hit "Unfollow it",
and got "Couldn't send."
**Change:** Replaced Supabase with a small FastAPI service on Railway (`backend/main.py`)
— SQLite for the cards, a WebSocket per room for realtime, and a `/health` endpoint.
Railway services don't idle out, so this failure mode is gone. `config.js` now holds a
single `API_BASE`; the new `api.js` is the shared client for both pages.

### Wall warns the host when the backend is unreachable
**File:** `index.html`, `api.js`
**Change:** The wall pings `/health` on load and watches the WebSocket. If the backend
can't be reached, a red bar across the top says so — with a **Retry** button — instead of
the wall sitting there looking normal while the room scans and gets errors. This is the
check that would have caught the failure above before a session, not during one.
**Also:** the live feed now reconnects on its own (exponential backoff, capped at 15s), so
a brief wifi drop mid-session no longer silently stops cards from arriving.

### New session no longer races itself
**File:** `index.html`
**Change:** Clearing a room broadcasts a reload to every open wall. "New session" now
stores the fresh room code *before* clearing, so that reload can't land back on the code
being retired.

### Docs: host shortcuts corrected
**File:** `README.md`
**Change:** The shortcut list said `T` for a 5-minute timer; it's `S` for a 1-minute
collection window, with `R` to reveal early.

---

## 2026-06-23

### Timer — labeled MIN / SEC
**File:** `index.html`
**Change:** The countdown now shows small "MIN" and "SEC" labels beneath the two numbers (e.g. `1 : 00`), so it's no longer ambiguous whether it's minutes or hours.

### Session code persists across refreshes
**File:** `index.html`
**Change:** The room/session code (and therefore the QR) no longer changes when the wall is refreshed. It is generated once on first open, stored in `localStorage`, and only changes when **New session** is clicked. This prevents orphaning anyone who already scanned. A `?room=` in the URL still overrides.

### QR code — larger & scannable from across the room
**File:** `index.html`
**Change:** During the collection phase the join QR is now large (up to ~300px, rendered at high resolution) so people can scan it off a projected TV/screen. The moment **Reveal now** / timer-end / **Unfollow All** fires, the QR smoothly shrinks to a small corner badge, freeing the wall for submissions.

### QR caption simplified
**File:** `index.html`
**Change:** Removed the "Join & add yours" label, the room code, and the URL line. Only the caption **"Scan to add what you'd like to unfollow"** remains, directly beneath the QR.

### Timer — clock icon
**File:** `index.html`
**Change:** Added a small clock icon next to the countdown. Icon and number turn red together in the final 10 seconds.

### Layout — no QR/example overlap
**File:** `index.html`
**Change:** While the big QR is showing, the wall reserves a right-side gutter so the example cards never sit under the QR or its caption. The gutter is released after the reveal.

---

## 2026-06-22

### Deployment moved to dedicated account
**Change:** Project now lives at `miracleofmindexperience/unfollow-wall` → https://miracleofmindexperience.github.io/unfollow-wall/ (its own GitHub account and Supabase project).

### Arrow redrawn to match the official poster
**File:** `index.html`
**Change:** The "I'm Unfollowing…" arrow is now a tall curved stroke that bulges right and hooks into a bold arrowhead pointing down-left, matching the printed Unfollow Wall poster. Fixed earlier clipping (SVG `overflow:visible`).

---

## 2026-06-21

### Collect-then-reveal flow
**File:** `index.html`, `config.js`
**Change:** Submissions are hidden during a 1-minute collection window (shows example teaser tags, countdown, and a live "N added" counter). At 0:00 (or **Reveal now**) all submissions fly in with a staggered cascade. **Unfollow All** flashes each card red then scatters them outward into the starfield, ending on the closing message.

### Closing sequence
**File:** `index.html`, `config.js`
**Change:** Three-beat close — "If only it were that easy to let go." → "What if it actually is?" → "Let's experience" followed by the Miracle of Mind logo.

### Miracle of Mind branding
**Files:** `index.html`, `submit.html`
**Change:** Adopted MoM look: black starfield, red (`#ec1c2d`) "UNFOLLOW WALL" title, white uppercase tag cards, Trirong + Inter fonts, and the official Miracle of Mind logo. Matches the official 36×46in poster.

### Initial build
**Files:** `index.html`, `submit.html`, `config.js`, `supabase-setup.sql`, `README.md`
**Change:** Real-time wall (projected) + phone submit page, synced via Supabase Realtime. QR-based room join, host controls (timer, reveal, unfollow all, new session, fullscreen).
