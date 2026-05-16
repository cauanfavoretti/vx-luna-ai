-- Execute este script no SQL Editor do Supabase (Dashboard > SQL Editor)
-- ─── PLAYBOOKS (histórico de gerados) ───────────────────────────────────────

create table if not exists playbooks (
  id          text        primary key,
  title       text        not null,
  empresa     text,
  html        text        not null,
  word_count  integer,
  sections    jsonb       default '[]'::jsonb,
  created_at  timestamptz default now()
);

alter table playbooks enable row level security;

create policy "allow all" on playbooks
  for all using (true) with check (true);

-- ─── SNAPSHOTS ───────────────────────────────────────────────────────────────

create table if not exists playbook_snapshots (
  id          text        primary key,
  name        text        not null,
  empresa     text,
  html        text        not null,
  size        integer,
  sections    jsonb       default '[]'::jsonb,
  created_at  timestamptz default now(),
  imported_at timestamptz
);

-- Permite leitura e escrita pública (ajuste com RLS se tiver autenticação)
alter table playbook_snapshots enable row level security;

create policy "allow all" on playbook_snapshots
  for all using (true) with check (true);
