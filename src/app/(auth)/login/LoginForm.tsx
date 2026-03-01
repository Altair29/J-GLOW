'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, Alert } from '@/components/shared';
import { getHomePath } from '@/lib/utils/routing';

type Props = {
  texts: Record<string, string>;
  bizTheme: Record<string, string>;
  wkrTheme: Record<string, string>;
};

export function LoginForm({ texts, bizTheme, wkrTheme }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(texts.error_invalid || 'メールアドレスまたはパスワードが正しくありません');
        return;
      }

      // セッション確立を確認（クッキー書き込み完了待ち）
      await supabase.auth.getSession();

      // redirectTo パラメータがあればそこへ飛ばす
      const redirectTo = searchParams.get('redirectTo');
      if (redirectTo && redirectTo.startsWith('/')) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      // ロール別にリダイレクト先を決定
      let role = data.user?.user_metadata?.role || '';

      if (!role) {
        try {
          const { data: p } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user!.id)
            .single();
          role = p?.role || '';
        } catch (err) {
          console.error('[LoginForm] profile fetch error:', err);
        }
      }

      const destination = role ? getHomePath(role) : '/';
      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error('[LoginForm] unexpected error:', err);
      setError('予期しないエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">J-GLOW</h1>
        <h2 className="mt-4 text-xl text-gray-600">{texts.heading || 'ログイン'}</h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && <Alert variant="error">{error}</Alert>}

        <div className="space-y-4">
          <Input
            label={texts.email_label || 'メールアドレス'}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
          <Input
            label={texts.password_label || 'パスワード'}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          themeColor="#2563eb"
          size="lg"
          className="w-full"
        >
          {loading ? (texts.submit_loading || 'ログイン中...') : (texts.submit_button || 'ログイン')}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>{texts.no_account || 'アカウントをお持ちでない方：'}</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register/business"
            className="font-medium hover:opacity-80"
            style={{ color: bizTheme['--biz-primary'] || '#1d4ed8' }}
          >
            {texts.register_business || '企業として登録'}
          </Link>
          <Link
            href="/register/worker"
            className="font-medium hover:opacity-80"
            style={{ color: wkrTheme['--wkr-primary'] || '#059669' }}
          >
            {texts.register_worker || '個人として登録'}
          </Link>
        </div>
      </div>
    </div>
  );
}
