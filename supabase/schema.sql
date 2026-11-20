-- Kör denna SQL i Supabase SQL Editor för att skapa tabellerna för Leonida Companion

create extension if not exists "pgcrypto";

-- 1. Patch Notes
create table if not exists public.patches (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  title text not null,
  release_date date not null default current_date,
  platforms text[] not null default '{ps5,xbox}',
  file_size_ps5 text,
  file_size_xbox text,
  summary text,
  official_notes text[] not null default '{}',
  community_discoveries text[] not null default '{}',
  is_hotfix boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Kartmarkörer (officiella + användarens egna kopplade till device_id)
create table if not exists public.markers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  region text not null,
  description text,
  x numeric not null,
  y numeric not null,
  image_url text,
  reward text,
  is_custom boolean not null default false,
  device_id text,
  created_at timestamptz not null default now()
);

-- 3. Användarens progress (checklista & hittade markörer) utan inloggning via device_id
create table if not exists public.user_progress (
  device_id text primary key,
  completed_checklist_ids text[] not null default '{}',
  found_marker_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 4. Web Push-prenumerationer
create table if not exists public.push_subscriptions (
  device_id text primary key,
  platform text not null check (platform in ('ps5', 'xbox', 'both')),
  endpoint text not null,
  subscription_json jsonb not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Aktivera RLS (Row Level Security)
alter table public.patches enable row level security;
alter table public.markers enable row level security;
alter table public.user_progress enable row level security;
alter table public.push_subscriptions enable row level security;

-- Enkla policyer för publik läsning och enhetsbaserad skrivning (utan auth)
create policy "Public read patches" on public.patches for select using (true);
create policy "Public insert patches" on public.patches for insert with check (true);

create policy "Public read markers" on public.markers for select using (true);
create policy "Public insert custom markers" on public.markers for insert with check (is_custom = true);
create policy "Delete own custom markers" on public.markers for delete using (is_custom = true);

create policy "Upsert own user_progress" on public.user_progress for all using (true) with check (true);
create policy "Upsert own push_subscriptions" on public.push_subscriptions for all using (true) with check (true);
