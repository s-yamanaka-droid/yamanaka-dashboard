begin;

alter table public.brain_stats enable row level security;

drop policy if exists brain_stats_public_metrics_select on public.brain_stats;
create policy brain_stats_public_metrics_select
  on public.brain_stats
  for select
  to anon, authenticated
  using (true);

revoke select on table public.brain_stats from public, anon, authenticated;
grant select (
  date, recorded_at, ceo_knowledge, cso_knowledge, patterns, skills,
  today_processed, today_success, today_failed
) on table public.brain_stats to anon, authenticated;

create or replace view public.public_brain_stats
with (security_invoker = true, security_barrier = true)
as
select
  date, recorded_at, ceo_knowledge, cso_knowledge, patterns, skills,
  today_processed, today_success, today_failed
from public.brain_stats;

revoke all on table public.public_brain_stats from public, anon, authenticated;
grant select on table public.public_brain_stats to anon, authenticated;

notify pgrst, 'reload schema';

commit;
