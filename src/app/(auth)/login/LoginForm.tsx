'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, Alert } from '@/components/shared';

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
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(texts.error_invalid || 'メールアドレスまたはパスワードが正しくありません');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
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
