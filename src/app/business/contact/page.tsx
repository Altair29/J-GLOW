'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const INQUIRY_TYPES = [
  '外国人雇用についての相談',
  '監理団体・行政書士への相談',
  'コストシミュレーターについて',
  '労働条件通知書ツールについて',
  '現場指示書ビルダーについて',
  'パートナー掲載について',
  'その他',
];

const COMPANY_SIZES = ['1〜9名', '10〜49名', '50〜99名', '100名以上'];

const EXPERIENCE_OPTIONS = [
  '外国人雇用は初めて',
  '現在雇用中（1〜5名）',
  '現在雇用中（6名以上）',
  '過去に雇用経験あり',
];

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{
      display: 'block',
      fontSize: '13px',
      fontWeight: 600,
      color: '#1a2f5e',
      marginBottom: '6px',
      letterSpacing: '0.3px',
    }}>
      {children}
      {required && (
        <span style={{
          marginLeft: '6px',
          background: '#dc3545',
          color: '#fff',
          fontSize: '10px',
          padding: '1px 6px',
          borderRadius: '3px',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}>必須</span>
      )}
    </label>
  );
}

function InputField({
  label, required, type = 'text', placeholder, value, onChange, rows,
}: {
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: focused ? '2px solid #1a2f5e' : '1.5px solid #d0dce8',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.15s, box-shadow 0.15s',
    boxShadow: focused ? '0 0 0 3px rgba(26,47,94,0.08)' : 'none',
    background: '#fff',
    fontFamily: 'inherit',
    resize: rows ? 'vertical' : undefined,
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <FormLabel required={required}>{label}</FormLabel>
      {rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}

function SelectField({
  label, required, options, value, onChange, placeholder,
}: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '20px' }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '11px 36px 11px 14px',
            border: focused ? '2px solid #1a2f5e' : '1.5px solid #d0dce8',
            borderRadius: '8px',
            fontSize: '14px',
            color: value ? '#333' : '#aaa',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fff',
            cursor: 'pointer',
            appearance: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(26,47,94,0.08)' : 'none',
            transition: 'border 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
        >
          <option value="">{placeholder || '選択してください'}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)',
          color: '#666', fontSize: '12px', pointerEvents: 'none',
        }}>▼</span>
      </div>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '32px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: i < current ? '#1a2f5e' : i === current ? 'linear-gradient(135deg, #1a2f5e, #2a4f8e)' : '#e8eef6',
            color: i <= current ? '#fff' : '#aaa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700,
            boxShadow: i === current ? '0 2px 12px rgba(26,47,94,0.3)' : 'none',
            transition: 'all 0.3s',
            position: 'relative',
          }}>
            {i < current ? '✓' : i + 1}
            {i === current && (
              <div style={{
                position: 'absolute', inset: '-3px',
                borderRadius: '50%',
                border: '2px solid rgba(26,47,94,0.3)',
              }} />
            )}
          </div>
          {i < total - 1 && (
            <div style={{
              width: '48px', height: '2px',
              background: i < current ? '#1a2f5e' : '#e8eef6',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

type FormData = {
  inquiryType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  companySize: string;
  experience: string;
  message: string;
  privacy: boolean;
};

const initialForm: FormData = {
  inquiryType: '',
  companyName: '',
  name: '',
  email: '',
  phone: '',
  companySize: '',
  experience: '',
  message: '',
  privacy: false,
};

export default function ContactPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>(initialForm);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const canNext0 = form.inquiryType && form.companyName && form.name && form.email;
  const canNext1 = form.companySize && form.experience;
  const canSubmit = form.message && form.privacy && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('contact_inquiries').insert({
        inquiry_type: form.inquiryType,
        company_name: form.companyName,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        company_size: form.companySize,
        experience: form.experience,
        message: form.message,
      });
      if (insertError) {
        setError('送信に失敗しました。時間をおいて再度お試しください。');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
        background: '#f4f7fb', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '48px 40px', maxWidth: '480px', width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 32px rgba(26,47,94,0.1)',
        }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '28px', color: '#fff',
          }}>✓</div>
          <h2 style={{ color: '#1a2f5e', fontSize: '20px', fontWeight: 700, margin: '0 0 12px' }}>
            お問い合わせを受け付けました
          </h2>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, margin: '0 0 8px' }}>
            担当者より1〜2営業日以内にご連絡いたします。
          </p>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 32px' }}>
            確認メールを <strong style={{ color: '#1a2f5e' }}>{form.email}</strong> に送信しました。
          </p>
          <div style={{
            background: '#f4f7fb', borderRadius: '10px',
            padding: '16px 20px', marginBottom: '28px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>お問い合わせ種別</div>
            <div style={{ fontSize: '14px', color: '#1a2f5e', fontWeight: 600 }}>{form.inquiryType}</div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm(initialForm); }}
            style={{
              background: '#e8eef6', color: '#1a2f5e',
              border: 'none', borderRadius: '8px',
              padding: '12px 24px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            別の問い合わせをする
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      background: '#f4f7fb', minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2f5e 0%, #0d1f42 100%)',
        padding: '36px 24px 28px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(201,168,76,0.2)',
          color: '#c9a84c',
          padding: '4px 14px', borderRadius: '20px',
          fontSize: '11px', fontWeight: 600, letterSpacing: '1px',
          marginBottom: '10px',
        }}>J-GLOW サポート</div>
        <h1 style={{
          color: '#fff', margin: '0 0 6px',
          fontSize: '22px', fontWeight: 700,
        }}>お問い合わせ</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '13px' }}>
          専門スタッフが1〜2営業日以内にご返信します
        </p>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 16px' }}>
        <StepIndicator current={step} total={3} />

        {/* Step labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: '28px', padding: '0 4px',
        }}>
          {['基本情報', '会社情報', 'お問い合わせ内容'].map((label, i) => (
            <span key={i} style={{
              fontSize: '11px',
              color: i === step ? '#1a2f5e' : '#aaa',
              fontWeight: i === step ? 700 : 400,
              flex: 1, textAlign: 'center',
            }}>{label}</span>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: '14px',
          padding: '32px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          {/* Step 0 */}
          {step === 0 && (
            <div>
              <SelectField
                label="お問い合わせ種別"
                required
                options={INQUIRY_TYPES}
                value={form.inquiryType}
                onChange={set('inquiryType')}
                placeholder="選択してください"
              />
              <InputField
                label="会社名・法人名"
                required
                placeholder="例：株式会社グローバル製造"
                value={form.companyName}
                onChange={set('companyName')}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="担当者名"
                    required
                    placeholder="例：山田 太郎"
                    value={form.name}
                    onChange={set('name')}
                  />
                </div>
              </div>
              <InputField
                label="メールアドレス"
                required
                type="email"
                placeholder="example@company.co.jp"
                value={form.email}
                onChange={set('email')}
              />
              <InputField
                label="電話番号"
                type="tel"
                placeholder="例：03-1234-5678"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <SelectField
                label="従業員数"
                required
                options={COMPANY_SIZES}
                value={form.companySize}
                onChange={set('companySize')}
              />
              <div style={{ marginBottom: '20px' }}>
                <FormLabel required>外国人雇用の経験</FormLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <label key={opt} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px',
                      border: form.experience === opt ? '2px solid #1a2f5e' : '1.5px solid #e0e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: form.experience === opt ? '#f0f4ff' : '#fff',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: '18px', height: '18px',
                        borderRadius: '50%',
                        border: form.experience === opt ? '5px solid #1a2f5e' : '2px solid #ccc',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }} />
                      <input
                        type="radio"
                        value={opt}
                        checked={form.experience === opt}
                        onChange={set('experience')}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '13px', color: form.experience === opt ? '#1a2f5e' : '#444', fontWeight: form.experience === opt ? 600 : 400 }}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <InputField
                label="お問い合わせ内容"
                required
                rows={6}
                placeholder="ご質問・ご要望をできるだけ詳しくご記入ください。"
                value={form.message}
                onChange={set('message')}
              />

              <div style={{
                background: '#f8fafc', borderRadius: '8px',
                padding: '16px', marginBottom: '20px',
                border: '1px solid #e8eef6',
              }}>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
                  <strong style={{ color: '#1a2f5e' }}>プライバシーポリシーについて</strong><br />
                  入力いただいた個人情報は、お問い合わせへの回答および関連サービスのご案内にのみ使用します。
                  第三者への提供は行いません。
                </div>
              </div>

              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                cursor: 'pointer',
              }}>
                <div
                  onClick={() => setForm(f => ({ ...f, privacy: !f.privacy }))}
                  style={{
                    width: '20px', height: '20px',
                    border: form.privacy ? 'none' : '2px solid #ccc',
                    borderRadius: '4px',
                    background: form.privacy ? '#1a2f5e' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, cursor: 'pointer',
                    marginTop: '1px',
                    transition: 'all 0.15s',
                  }}
                >
                  {form.privacy && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>
                  プライバシーポリシーに同意する
                  <span style={{ color: '#dc3545', marginLeft: '4px', fontSize: '11px', fontWeight: 700 }}>必須</span>
                </span>
              </label>

              {error && (
                <div style={{
                  marginTop: '16px', padding: '12px 16px',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '8px', color: '#dc2626', fontSize: '13px',
                }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: '20px', gap: '12px',
        }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                background: '#fff', color: '#1a2f5e',
                border: '1.5px solid #d0dce8', borderRadius: '8px',
                padding: '12px 24px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              ← 戻る
            </button>
          ) : <div />}

          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 ? !canNext0 : !canNext1}
              style={{
                background: (step === 0 ? canNext0 : canNext1)
                  ? 'linear-gradient(135deg, #1a2f5e, #2a4f8e)'
                  : '#d0dce8',
                color: '#fff', border: 'none',
                borderRadius: '8px', padding: '12px 28px',
                fontSize: '14px', fontWeight: 600,
                cursor: (step === 0 ? canNext0 : canNext1) ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                background: canSubmit
                  ? 'linear-gradient(135deg, #c9a84c, #f0d080)'
                  : '#d0dce8',
                color: canSubmit ? '#1a2f5e' : '#999',
                border: 'none', borderRadius: '8px',
                padding: '12px 28px', fontSize: '14px',
                fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              {loading ? '送信中...' : '送信する ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
