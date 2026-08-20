// ============================================================
//  Unfollow Wall — configuration
//  Edit the values below. No build step; just save and reload.
// ============================================================

window.UNFOLLOW_CONFIG = {

  // --- Backend (required) --------------------------------------------------
  // The realtime API that holds the cards and pushes them to the wall.
  // Deployed on Railway (see backend/main.py). No key needed — the room code
  // is the only thing gating a wall, and nothing personal is stored.
  API_BASE: "https://unfollow-wall-production.up.railway.app",

  // --- Submission window ---------------------------------------------------
  TIMER_MINUTES: 1,          // collection window; submissions reveal when it ends
  MAX_LENGTH:    80,         // max characters per submission

  // --- Starter example cards (seeded on screen, not stored in the database)
  // These greet the room so the wall is never empty. They wipe with the rest.
  EXAMPLES: [
    "Expectations",
    "Comparison",
    "Overthinking",
  ],

  // --- Closing sequence (shown after "Unfollow All") -----------------------
  // Three beats fade in one after another, then the wall is ready to reset.
  CLOSING: {
    line1: "If only it were that easy to let go.",
    line2: "What if it actually is?",
    line3: "Let's experience",   // followed by the Miracle of Mind logo on the wall
  },

  // Alternate closing lines (swap into CLOSING above if you prefer):
  //   "What if your mind could feel this light too?"
  //   "Creating space from all of this is simpler than you think."

  // --- Prompt shown on the phone submit page -------------------------------
  SUBMIT_PROMPT: "What would you like to unfollow today?",
  SUBMIT_HINT:   "Stress, overthinking, pressure… anything that's been on repeat.",
};
