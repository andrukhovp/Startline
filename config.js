// Startline settings. Fill these in to turn on accounts (see README.md, "Turn on accounts").
// Leave them empty and Startline still works: everyone's work is saved in their own browser.
// The anon key is meant to be public; row-level security in supabase/schema.sql keeps each account's data private.
window.STARTLINE_CONFIG = {
  supabaseUrl: "",       // e.g. "https://abcdefghijklmnop.supabase.co"
  supabaseAnonKey: "",   // Project Settings > API Keys: the "anon" / publishable key (never the service_role or secret key)
  googleSignIn: false,   // true after you turn on the Google provider in Supabase
};
