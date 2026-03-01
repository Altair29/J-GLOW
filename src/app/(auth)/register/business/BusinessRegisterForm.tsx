'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Input, Button, Alert } from '@/components/shared';

type Props = {
  texts: Record<string, string>;
  theme: Record<string, string>;
};

const BLOCKED_DOMAINS = new Set([
  'gmail.com', 'yahoo.co.jp', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'outlook.jp', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'mail.com',
  'live.com', 'msn.com', 'googlemail.com', 'ymail.com', 'protonmail.com',
  'proton.me', 'zoho.com', 'gmx.com', 'gmx.net',
]);

export function BusinessRegisterForm({ texts, theme }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [organization, setOrganization] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError(texts.error_password_mismatch || 'パスワードが一致しません');
        return;
      }
      if (password.length < 8) {
        setError(texts.error_password_short || 'パスワードは8文字以上で設定してください');
        return;
      }

      // クライアント側フリーメール判定（即座にエラー表示）
      const domain = email.split('@')[1]?.toLowerCase();
      if (!domain || BLOCKED_DOMAINS.has(domain)) {
        setError(texts.error_freemail || 'フリーメールアドレスでは企業登録できません。会社のメールアドレスをご利用ください。');
        return;
      }

      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'business',
            display_name: displayName,
            organization,
            privacy_agreed_at: new Date().toISOString(),
            privacy_policy_version: '2026-03-01',
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message;
        if (msg.includes('already registered')) {
          setError('このメールアドレスは既に登録されています。ログインページからお試しください。');
        } else if (msg.includes('rate limit') || msg.includes('too many')) {
          setError('リクエストが多すぎます。しばらく時間をおいてから再度お試しください。');
        } else if (msg.includes('invalid') && msg.includes('email')) {
          setError('メールアドレスの形式が正しくありません。');
        } else {
          setError(`登録に失敗しました: ${msg}`);
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error('[BusinessRegisterForm] unexpected error:', err);
      setError('予期しないエラーが発生しました。ネットワーク接続を確認の上、再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md w-full text-center space-y-6">
        <Alert variant="success">
          <h2 className="font-bold mb-2">{texts.success_title || '登録確認メールを送信しました'}</h2>
          <p>{email} に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。</p>
        </Alert>
        <Link href="/login" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>
          ログインページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">J-GLOW</h1>
        <h2 className="mt-4 text-xl text-gray-600">{texts.heading || '企業アカウント登録'}</h2>
        <p className="mt-2 text-sm text-gray-500">{texts.subheading || ''}</p>
      </div>

      <Alert variant="warning">{texts.domain_notice || ''}</Alert>

      <form className="mt-6 space-y-5" onSubmit={handleRegister}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input label={texts.org_label || '組織名'} type="text" required value={organization}
          onChange={(e) => setOrganization(e.target.value)} placeholder="株式会社〇〇" />
        <Input label={texts.name_label || '担当者名'} type="text" required value={displayName}
          onChange={(e) => setDisplayName(e.target.value)} placeholder="山田 太郎" />
        <Input label={texts.email_label || 'メールアドレス'} type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="yamada@company.co.jp" />
        <Input label={texts.password_label || 'パスワード（8文字以上）'} type="password" required minLength={8}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label={texts.confirm_label || 'パスワード（確認）'} type="password" required minLength={8}
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">
            <Link href="/privacy-policy" target="_blank" className="underline font-medium" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>
              プライバシーポリシー
            </Link>
            に同意する（必須）
          </span>
        </label>

        <Button type="submit" loading={loading} disabled={!privacyAgreed} themeColor={theme['--biz-primary'] || '#1a2f5e'} size="lg" className="w-full">
          {loading ? (texts.submit_loading || '登録処理中...') : (texts.submit_button || '企業アカウントを作成')}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {texts.has_account || '既にアカウントをお持ちですか？'}{' '}
        <Link href="/login" className="font-medium" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>
          ログイン
        </Link>
      </p>
    </div>
  );
}
