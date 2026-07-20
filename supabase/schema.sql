-- 不動産管理アプリ用の物件テーブル
-- Supabaseダッシュボードの SQL Editor でこのファイルの内容を実行してください

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  -- 物件を登録したユーザー(auth.usersのid)。ユーザー削除時は物件も削除する
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null,
  area text not null,
  layout text not null,
  created_at timestamptz not null default now()
);

-- user_idでの絞り込みを高速化するためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- RLS(行レベルセキュリティ)を有効化する
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
create policy "Users can view their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のuser_idでのみ物件を登録できる
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
