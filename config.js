// ============================================================
//  Unfollow Wall — configuration
//  Edit the values below. No build step; just save and reload.
// ============================================================

window.UNFOLLOW_CONFIG = {

  // --- Supabase (required) -------------------------------------------------
  // Project Settings > API.  The anon key is safe to expose in the browser;
  // access is controlled by the Row Level Security policies in
  // supabase-setup.sql.
  SUPABASE_URL:      "https://aocxxqxeayitffqkxegh.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvY3h4cXhlYXlpdGZmcWt4ZWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDM2MTYsImV4cCI6MjA5NzYxOTYxNn0.vcsle0SKhUwt_quToJh_xJkxFABw7qn0yyia1wkr9vI",

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
