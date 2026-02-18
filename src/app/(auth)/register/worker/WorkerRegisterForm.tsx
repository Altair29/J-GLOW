'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Input, Button, Alert } from '@/components/shared';

type Props = {
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export function WorkerRegisterForm({ texts, theme }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError(texts.error_password_mismatch || 'パスワードが一致しません');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError(texts.error_password_short || 'パスワードは8文字以上');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'worker', display_name: displayName || email.split('@')[0] } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-md w-full text-center space-y-6">
        <Alert variant="success">
          <h2 className="font-bold mb-2">{texts.success_title || 'Registration email sent'}</h2>
          <p>We sent a confirmation email to {email}. Please click the link to complete registration.</p>
        </Alert>
        <Link href="/login" className="hover:opacity-80" style={{ color: theme['--wkr-primary'] || '#059669' }}>
          Go to Login / ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">J-GLOW</h1>
        <h2 className="mt-4 text-xl text-gray-600">{texts.heading || 'Register / 新規登録'}</h2>
        <p className="mt-2 text-sm text-gray-500">{texts.subheading || ''}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleRegister}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input label={texts.name_label || 'Name / 名前'} type="text" value={displayName}
          onChange={(e) => setDisplayName(e.target.value)} />
        <Input label={texts.email_label || 'Email / メールアドレス'} type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
        <Input label={texts.password_label || 'Password / パスワード'} type="password" required minLength={8}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label={texts.confirm_label || 'Confirm Password'} type="password" required minLength={8}
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <Button type="submit" loading={loading} themeColor={theme['--wkr-primary'] || '#059669'} size="lg" className="w-full">
          {loading ? (texts.submit_loading || 'Registering...') : (texts.submit_button || 'Create Account')}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {texts.has_account || 'Already have an account?'}{' '}
        <Link href="/login" className="font-medium" style={{ color: theme['--wkr-primary'] || '#059669' }}>
          Login / ログイン
        </Link>
      </p>
    </div>
  );
}
