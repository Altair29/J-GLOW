'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type FormData = {
  company: string;
  name: string;
  email: string;
  type: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INQUIRY_TYPES = [
  '外国人雇用についての相談',
  '掲載・広告について',
  'サービス・機能について',
  '取材・メディア',
  'その他',
];

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'お名前を入力してください';
  if (!form.email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '正しいメールアドレスを入力してください';
  }
  if (!form.message.trim()) {
    errors.message = 'お問い合わせ内容を入力してください';
  } else if (form.message.trim().length < 20) {
    errors.message = '20文字以上で入力してください';
  }
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    company: '',
    name: '',
    email: '',
    type: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_inquiries').insert({
        company_name: form.company.trim() || null,
        name: form.name.trim(),
        email: form.email.trim(),
        inquiry_type: form.type || 'その他',
        message: form.message.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      setSubmitError('送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #d0dce8',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#333',
    background: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a2f5e',
    marginBottom: '6px',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '4px',
  };

  return (
    <div
      style={{
        fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
        background: '#f4f7fb',
        minHeight: '100vh',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a2f5e 0%, #0d1f42 100%)',
          padding: '32px 24px 28px',
          textAlign: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            color: '#c9a84c',
            fontWeight: 700,
            fontSize: '20px',
            textDecoration: 'none',
            letterSpacing: '1px',
          }}
        >
          J-GLOW
        </Link>
        <h1
          style={{
            color: '#fff',
            margin: '12px 0 0',
            fontSize: '22px',
            fontWeight: 700,
          }}
        >
          お問い合わせ
        </h1>
      </div>

      {/* コンテンツ */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 16px 64px' }}>
        {submitted ? (
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              border: '1.5px solid #d0dce8',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a2f5e',
                marginBottom: '12px',
              }}
            >
              送信完了
            </h2>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8 }}>
              お問い合わせありがとうございます。
              <br />
              内容を確認のうえ、3営業日以内にご連絡いたします。
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginTop: '28px',
                padding: '10px 28px',
                background: '#1a2f5e',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              トップページへ戻る
            </Link>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: 1.8,
                marginBottom: '28px',
                textAlign: 'center',
              }}
            >
              J-GLOWへのご質問・ご相談はこちらからお送りください。
            </p>

            {submitError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#dc2626',
                  marginBottom: '20px',
                }}
              >
                {submitError}
              </div>
            )}

            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '28px 24px',
                border: '1.5px solid #d0dce8',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 会社名・団体名 */}
                <div>
                  <label style={labelStyle}>
                    会社名・団体名
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 400, marginLeft: '8px' }}>
                      任意
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                    placeholder="株式会社〇〇"
                    style={inputStyle}
                  />
                </div>

                {/* お問い合わせ種別 */}
                <div>
                  <label style={labelStyle}>
                    お問い合わせ種別
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 400, marginLeft: '8px' }}>
                      任意
                    </span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => set('type', e.target.value)}
                    style={{
                      ...inputStyle,
                      color: form.type ? '#333' : '#999',
                      appearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M2 4l4 4 4-4'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '36px',
                    }}
                  >
                    <option value="">
                      選択してください
                    </option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* お名前 */}
                <div>
                  <label style={labelStyle}>
                    お名前
                    <span style={{ fontSize: '11px', color: '#dc2626', marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="山田 太郎"
                    style={{
                      ...inputStyle,
                      borderColor: errors.name ? '#dc2626' : '#d0dce8',
                    }}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>

                {/* メールアドレス */}
                <div>
                  <label style={labelStyle}>
                    メールアドレス
                    <span style={{ fontSize: '11px', color: '#dc2626', marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="example@company.co.jp"
                    style={{
                      ...inputStyle,
                      borderColor: errors.email ? '#dc2626' : '#d0dce8',
                    }}
                  />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>

                {/* お問い合わせ内容 */}
                <div>
                  <label style={labelStyle}>
                    お問い合わせ内容
                    <span style={{ fontSize: '11px', color: '#dc2626', marginLeft: '4px' }}>*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="お問い合わせ内容をご記入ください（20文字以上）"
                    rows={5}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '120px',
                      borderColor: errors.message ? '#dc2626' : '#d0dce8',
                    }}
                  />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                </div>
              </div>

              {/* 送信ボタン */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '28px',
                  padding: '14px',
                  background: submitting ? '#94a3b8' : '#1a2f5e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {submitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
