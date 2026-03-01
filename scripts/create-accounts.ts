/**
 * テストアカウント + editorアカウント 一括作成スクリプト
 *
 * 使い方:
 *   npx tsx scripts/create-accounts.ts
 *
 * 必要な環境変数 (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 環境変数が不足しています: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type AccountDef = {
  email: string;
  password: string;
  role: 'business' | 'worker' | 'editor';
  display_name: string;
};

const accounts: AccountDef[] = [
  // テストアカウント (business × 3)
  { email: 'test-biz-01@j-glow.test', password: 'JGlow#Test2025!', role: 'business', display_name: 'テスト企業01' },
  { email: 'test-biz-02@j-glow.test', password: 'JGlow#Test2025!', role: 'business', display_name: 'テスト企業02' },
  { email: 'test-biz-03@j-glow.test', password: 'JGlow#Test2025!', role: 'business', display_name: 'テスト企業03' },
  // テストアカウント (worker × 1)
  { email: 'test-worker-01@j-glow.test', password: 'JGlow#Test2025!', role: 'worker', display_name: 'テストワーカー01' },
  // editorアカウント × 2
  { email: 'editor-01@j-glow.jp', password: 'JGlow#Editor2025@01', role: 'editor', display_name: 'エディター01' },
  { email: 'editor-02@j-glow.jp', password: 'JGlow#Editor2025@02', role: 'editor', display_name: 'エディター02' },
];

async function createAccount(acct: AccountDef): Promise<void> {
  const label = `${acct.role.padEnd(8)} ${acct.email}`;

  // 既存ユーザーチェック（メールで検索）
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === acct.email);
  if (existing) {
    console.log(`⏭️  ${label} — 既存ユーザー（スキップ）`);
    return;
  }

  // ユーザー作成（メール確認不要）
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: acct.email,
    password: acct.password,
    email_confirm: true,
  });

  if (authError) {
    console.error(`❌ ${label} — Auth作成失敗: ${authError.message}`);
    return;
  }

  const userId = authData.user.id;

  // profiles に upsert
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    role: acct.role,
    display_name: acct.display_name,
    is_active: true,
  }, { onConflict: 'id' });

  if (profileError) {
    console.error(`❌ ${label} — Profile作成失敗: ${profileError.message}`);
    return;
  }

  console.log(`✅ ${label} — 作成完了 (${userId})`);
}

async function main() {
  console.log('=== J-GLOW アカウント一括作成 ===\n');

  for (const acct of accounts) {
    await createAccount(acct);
  }

  console.log('\n=== 完了 ===');
}

main().catch(console.error);
