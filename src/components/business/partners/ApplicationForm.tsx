'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PARTNER_TYPE_CONFIG, TIER_CONFIG, FORM_FIELDS } from '@/lib/partners-config';
import { TierBadge } from './TierBadge';
import type { PartnerType, PlanTier } from '@/types/database';

const DS = {
  navy: '#0f1f45',
  navyLight: '#1a2f5e',
  gold: '#c9a84c',
  text: '#1a1f2e',
  textMid: '#4a5568',
  textLight: '#718096',
  border: '#dce4ef',
};

function FormField({ field }: { field: { id: string; label: string; type: string; placeholder?: string; options?: readonly string[]; required: boolean } }) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    border: `1.5px solid ${DS.border}`, borderRadius: '8px',
    fontSize: '13px', color: DS.text, outline: 'none',
    background: '#fff', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px',
    fontSize: '13px', fontWeight: 600, color: DS.navyLight,
  };

  if (field.type === 'select') return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: '#e53e3e', marginLeft: '2px' }}>*</span>}
      </label>
      <select style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="">選択してください</option>
        {field.options?.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (field.type === 'multicheck') return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: '#e53e3e', marginLeft: '2px' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {field.options?.map(o => (
          <label key={o} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: '#f4f7fb', border: `1px solid ${DS.border}`,
            borderRadius: '6px', padding: '6px 10px',
            fontSize: '12px', cursor: 'pointer', fontWeight: 500,
          }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: '#e53e3e', marginLeft: '2px' }}>*</span>}
      </label>
      <input type={field.type} placeholder={field.placeholder} style={inputStyle} />
    </div>
  );
}

export default function ApplicationForm() {
  const [selectedType, setSelectedType] = useState<PartnerType>('kanri');
  const router = useRouter();
  const typeField = PARTNER_TYPE_CONFIG[selectedType];
  const typeFields = FORM_FIELDS[selectedType] || [];

  const handleSubmit = () => {
    router.push('/business/partners/apply/complete');
  };

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      {/* フォームヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1f45, #1a2f5e)',
        padding: '24px 28px',
      }}>
        <div style={{
          color: DS.gold, fontSize: '11px', fontWeight: 700,
          letterSpacing: '2px', marginBottom: '6px',
        }}>掲載申し込みフォーム</div>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 800 }}>
          J-GLOWパートナーに登録する
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.65)', margin: '6px 0 0', fontSize: '12px' }}>
          審査後、最短3営業日で掲載開始。初期審査費 ¥30,000〜
        </p>
      </div>

      <div style={{ padding: '24px 28px' }}>

        {/* STEP 1: 種別選択 */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)',
              borderRadius: '50%', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, flexShrink: 0,
            }}>1</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: '14px' }}>
              種別を選択してください
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(Object.entries(PARTNER_TYPE_CONFIG) as [PartnerType, typeof PARTNER_TYPE_CONFIG[PartnerType]][]).map(([id, cfg]) => (
              <button
                key={id}
                onClick={() => setSelectedType(id)}
                style={{
                  padding: '10px 16px',
                  border: selectedType === id
                    ? `2px solid ${cfg.color}`
                    : `1.5px solid ${DS.border}`,
                  borderRadius: '10px',
                  background: selectedType === id ? cfg.bgAccent : '#fff',
                  color: selectedType === id ? cfg.color : DS.textMid,
                  cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: '10px', padding: '10px 14px',
            background: typeField.bgAccent,
            borderRadius: '8px', fontSize: '12px',
            color: typeField.color, fontWeight: 600,
          }}>
            {typeField.icon} {typeField.label}を選択中 — この種別に合わせた入力項目が表示されます
          </div>
        </div>

        {/* STEP 2: 共通情報 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)',
              borderRadius: '50%', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, flexShrink: 0,
            }}>2</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: '14px' }}>基本情報</span>
          </div>
          {FORM_FIELDS.common.map(f => <FormField key={f.id} field={f} />)}
        </div>

        {/* STEP 3: 種別固有情報 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              background: `linear-gradient(135deg, ${typeField.color}, ${typeField.color}aa)`,
              borderRadius: '50%', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, flexShrink: 0,
            }}>3</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: '14px' }}>
              {typeField.label}固有の情報
            </span>
          </div>
          <div style={{
            background: typeField.bgAccent,
            borderRadius: '10px', padding: '16px',
            marginBottom: '16px',
          }}>
            {typeFields.map(f => <FormField key={f.id} field={f} />)}
          </div>
        </div>

        {/* STEP 4: PR・自由記述 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
              borderRadius: '50%', color: '#1a2f5e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, flexShrink: 0,
            }}>4</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: '14px' }}>
              PRポイント・自己紹介
            </span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: DS.navyLight }}>
              キャッチコピー（40文字以内） <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <input type="text" placeholder="例: 愛知・東海エリア製造業15年の実績。育成就労移行支援に特化。" style={{
              width: '100%', padding: '10px 12px',
              border: `1.5px solid ${DS.border}`, borderRadius: '8px',
              fontSize: '13px', color: DS.text, outline: 'none',
              background: '#fff', boxSizing: 'border-box',
            }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: DS.navyLight }}>
              詳細説明（200文字以内） <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <textarea rows={4} placeholder="強みや実績、対応できる企業の規模や業種など、企業が知りたい情報を具体的に記載してください。" style={{
              width: '100%', padding: '10px 12px',
              border: `1.5px solid ${DS.border}`, borderRadius: '8px',
              fontSize: '13px', color: DS.text, outline: 'none',
              background: '#fff', boxSizing: 'border-box',
              fontFamily: 'inherit', resize: 'vertical',
            }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: DS.navyLight }}>
              強みタグ（自由入力、カンマ区切りで最大6個）
            </label>
            <input type="text" placeholder="例: 送出機関直結, 日本語教育, 全国対応, スピード対応" style={{
              width: '100%', padding: '10px 12px',
              border: `1.5px solid ${DS.border}`, borderRadius: '8px',
              fontSize: '13px', color: DS.text, outline: 'none',
              background: '#fff', boxSizing: 'border-box',
            }} />
          </div>
        </div>

        {/* STEP 5: プラン選択 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
              borderRadius: '50%', color: '#1a2f5e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, flexShrink: 0,
            }}>5</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: '14px' }}>
              掲載プランを選択
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(Object.entries(TIER_CONFIG) as [PlanTier, typeof TIER_CONFIG[PlanTier]][]).map(([key, cfg]) => (
              <label key={key} style={{
                flex: '1 1 160px',
                border: `2px solid ${cfg.borderColor}`,
                borderRadius: '10px',
                padding: '14px',
                cursor: 'pointer',
                background: key === 'platinum' ? '#f0f4ff' : key === 'gold' ? '#fffbec' : '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <input type="radio" name="plan" value={key} defaultChecked={key === 'regular'} />
                  <TierBadge tier={key} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: DS.navy, marginBottom: '2px' }}>
                  {cfg.label}プラン
                </div>
                <div style={{ fontSize: '12px', color: cfg.color, fontWeight: 700 }}>
                  {cfg.price}
                </div>
                <div style={{ fontSize: '11px', color: DS.textLight, marginTop: '6px', lineHeight: 1.5 }}>
                  {key === 'platinum' && '最上部固定表示・バナー枠・優先問い合わせ'}
                  {key === 'gold' && 'スポンサーセクション優先・強調カード表示'}
                  {key === 'regular' && '通常リスト掲載・基本情報表示'}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)',
            color: '#fff', border: 'none',
            borderRadius: '10px', padding: '15px',
            fontSize: '15px', fontWeight: 800, cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          申し込み内容を送信する →
        </button>
        <p style={{
          textAlign: 'center', color: DS.textLight,
          fontSize: '11px', marginTop: '10px',
        }}>
          送信後、担当者から3営業日以内にご連絡いたします。審査費のご案内も合わせて送付します。
        </p>
      </div>
    </div>
  );
}
