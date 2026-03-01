-- 問い合わせテーブル
create table if not exists contact_inquiries (
  id           uuid primary key default gen_random_uuid(),
  inquiry_type text not null,
  company_name text not null,
  name         text not null,
  email        text not null,
  phone        text,
  company_size text,
  experience   text,
  message      text not null,
  status       text not null default 'new',   -- new / in_progress / done
  created_at   timestamptz not null default now()
);

-- RLS: admin のみ参照可能、INSERT は全員可
alter table contact_inquiries enable row level security;

create policy "anyone can insert"
  on contact_inquiries for insert
  with check (true);

create policy "admin can select"
  on contact_inquiries for select
  using (is_admin());

create policy "admin can update"
  on contact_inquiries for update
  using (is_admin());

-- 管理サイドバーにリンク追加
insert into navigation_items (section, label, href, icon, sort_order, is_active)
values ('admin_sidebar', '問い合わせ管理', '/admin/contact', 'MessageSquare', 90, true)
on conflict do nothing;
