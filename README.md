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
| `config.js` | All settings: Supabase keys, timer, examples, closing lines, prompts |
| `supabase-setup.sql` | One-time database setup — run in Supabase SQL Editor |

## One-time setup
1. In your Supabase project: **SQL Editor → New query →** paste `supabase-setup.sql` → **Run**.
2. **Project Settings → API**, copy the **Project URL** and **anon public key**.
3. Paste both into `config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
4. Deploy the folder anywhere static (GitHub Pages recommended) so phones can open the submit URL.

## Running a session
1. Open `index.html` on the TV, press **F** for fullscreen.
2. The room shows a **QR code + 4-letter code**. Participants scan → type → submit.
3. Cards fly onto the wall in real time. Press **T** to start the 5-minute timer (optional).
4. When ready, press **U** (or **Unfollow All**) → cards dissolve → closing message appears.
5. Hand off to the facilitator (introduce Sadhguru + the Miracle of Mind meditation).
6. Press **N** for a **New session** (clears the wall, fresh room code) for the next group.

### Host keyboard shortcuts
`T` timer · `U` / `Space` unfollow all · `N` new session · `F` fullscreen
(Controls also appear at the bottom when you move the mouse, and stay hidden on projection otherwise.)

## Notes
- The anon key is safe to expose in the browser; access is limited by the RLS policies
  in `supabase-setup.sql`. No personal data is collected — just the free-text card.
- Supabase free projects pause after ~1 week idle. **Open the Supabase dashboard before a
  session** to make sure the project is awake.
- Local testing: open `index.html` in one browser tab and `submit.html?room=XXXX` in another
  to simulate a phone. For real phones, the site must be deployed to a public URL.
