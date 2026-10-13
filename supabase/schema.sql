-- Startline database setup for Supabase.
-- Run this once in your project: Dashboard > SQL Editor > New query > paste > Run.
-- It is safe to run again.
--
-- Everything a person saves is one row per document in public.docs, keyed by
-- their user id and a path such as "desk/tasks/t1" or "account/saves/s1".
-- Row-level security makes every row readable and writable only by the
-- account that owns it.

create table if not exists public.docs (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  path       text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, path),
  constraint docs_path_ok check (char_length(path) between 1 and 300),
  constraint docs_size_ok check (pg_column_size(data) <= 1000000)
);

alter table public.docs enable row level security;

drop policy if exists "Read your own documents" on public.docs;
drop policy if exists "Add your own documents" on public.docs;
drop policy if exists "Change your own documents" on public.docs;
drop policy if exists "Delete your own documents" on public.docs;
create policy "Read your own documents" on public.docs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add your own documents" on public.docs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Change your own documents" on public.docs
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete your own documents" on public.docs
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on table public.docs from anon;
grant select, insert, update, delete on table public.docs to authenticated;

-- Keep updated_at current; the app uses it to notice changes from your other devices.
create or replace function public.docs_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Cap how much one account can store (25,000 documents), so nobody can fill the database.
create or replace function public.docs_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (select 1 from public.docs where user_id = new.user_id and path = new.path)
     and (select count(*) from public.docs where user_id = new.user_id) >= 25000 then
    raise exception 'Storage limit reached' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before update on public.docs
  for each row execute function public.docs_touch();
drop trigger if exists docs_limit on public.docs;
create trigger docs_limit before insert on public.docs
  for each row execute function public.docs_limit();

-- "Delete my account" in the app: removes the signed-in person's sign-in and,
-- through the foreign key above, every document they saved.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'Not signed in' using errcode = '42501';
  end if;
  delete from public.docs where user_id = me;
  delete from auth.users where id = me;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Anonymous feedback and check-ins from the app. Anyone can add one; nobody
-- can read them through the API (read them in Dashboard > Table Editor).
-- No user id or email is stored.
create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind       text not null check (kind in ('feedback', 'checkin')),
  model      text check (char_length(model) <= 20),
  day        int check (day between 0 and 400),
  answer     text check (char_length(answer) <= 20),
  message    text check (char_length(message) <= 2000)
);
alter table public.feedback enable row level security;
drop policy if exists "Anyone can send feedback" on public.feedback;
create policy "Anyone can send feedback" on public.feedback for insert to anon, authenticated with check (true);
revoke all on table public.feedback from anon, authenticated;
grant insert on table public.feedback to anon, authenticated;
