# Changelog — Unfollow Wall

A real-time, projectable digital version of the Miracle of Mind "Unfollow Wall" activity.
Notable changes are listed newest first.

---

## 2026-06-23

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
