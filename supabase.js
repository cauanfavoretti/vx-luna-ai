const { createClient } = supabase;

window.__supabase__ = createClient(
  window.__SUPABASE_URL__,
  window.__SUPABASE_ANON_KEY__
);
