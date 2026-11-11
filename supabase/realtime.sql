-- ════════════════════════════════════════════════════════════════════════════
-- Live updates (Supabase Realtime / websockets) — run once in SQL Editor.
-- Safe to re-run.
--
-- After this:
--   • Public pages refresh by themselves when an admin publishes/edits content.
--   • The admin panel shows new contact messages instantly (toast + badge),
--     and lists update when another admin makes changes.
-- Visitors still only receive changes they're allowed to read (RLS applies).
-- ════════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['events', 'blogs', 'markets', 'market_members', 'site_content', 'inquiries', 'subscribers'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- Check: should list all 7 tables
select tablename from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' order by 1;
