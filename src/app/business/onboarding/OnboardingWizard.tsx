'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Building2, ShieldCheck, Users, Briefcase } from 'lucide-react';
import type { BusinessType } from '@/types/database';

type Props = {
  userId: string;
  existing: {
    companyName: string;
    contactName: string;
    industry: string;
  };
};

const TYPES: {
  value: BusinessType;
  label: string;
  desc: string;
  icon: typeof Building2;
}[] = [
  {
    value: 'supervisory',
    label: '監理団体',
    desc: '技能実習・育成就労の監理業務を行う組合・団体',
    icon: ShieldCheck,
  },
  {
    value: 'support',
    label: '登録支援機関',
    desc: '特定技能外国人の支援計画を受託する機関',
    icon: Users,
  },
  {
    value: 'accepting_existing',
    label: '受入れ企業（経験あり）',
    desc: '既に外国人材を雇用している企業',
    icon: Building2,
  },
  {
    value: 'accepting_new',
    label: '採用検討中の企業',
    desc: 'これから外国人材の採用を検討している企業',
    icon: Briefcase,
  },
];

export function OnboardingWizard({ userId, existing }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<BusinessType | null>(null);
  const [companyName, setCompanyName] = useState(existing.companyName);
  const [contactName, setContactName] = useState(existing.contactName);
  const [industry, setIndustry] = useState(existing.industry);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!selectedType) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!companyName.trim() || !contactName.trim()) {
      setError('会社名と担当者名は必須です');
      return;
    }
    setError('');
    setSaving(true);

    const supabase = createClient();
    const { error: err } = await supabase
      .from('business_profiles')
      .upsert({
        id: userId,
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        industry: industry.trim() || null,
        business_type: selectedType,
      }, { onConflict: 'id' });

    if (err) {
      setError('保存に失敗しました。もう一度お試しください。');
      setSaving(false);
      return;
    }

    router.push('/business/mypage');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* プログレス */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={
                  step >= s
                    ? { backgroundColor: '#1a2f5e', color: '#fff' }
                    : { backgroundColor: '#e5e7eb', color: '#9ca3af' }
                }
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className="w-16 h-0.5 transition-all"
                  style={{ backgroundColor: step > 1 ? '#1a2f5e' : '#e5e7eb' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: タイプ選択 */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              あなたの組織について教えてください
            </h1>
            <p className="text-gray-500 text-center mb-8">
              最適な情報をお届けするために選択してください
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {TYPES.map((t) => {
                const Icon = t.icon;
                const active = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    className="text-left p-5 rounded-xl border-2 transition-all"
                    style={
                      active
                        ? { borderColor: '#c9a84c', backgroundColor: '#fdfbf5' }
                        : { borderColor: '#e5e7eb', backgroundColor: '#fff' }
                    }
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={
                        active
                          ? { backgroundColor: '#c9a84c', color: '#fff' }
                          : { backgroundColor: '#f1f5f9', color: '#64748b' }
                      }
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{t.label}</h3>
                    <p className="text-sm text-gray-500">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!selectedType}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-px"
                style={{ backgroundColor: '#1a2f5e' }}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 会社情報 */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              基本情報を入力してください
            </h1>
            <p className="text-gray-500 text-center mb-8">
              あとから変更できます
            </p>

            <div className="space-y-5 max-w-md mx-auto mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  会社名 / 団体名 <span className="text-red-500">*</span>
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e]"
                  placeholder="株式会社〇〇"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  担当者名 <span className="text-red-500">*</span>
                </label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e]"
                  placeholder="山田 太郎"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  業種（任意）
                </label>
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e]"
                  placeholder="製造業、介護、建設業 など"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center mb-4">{error}</p>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-lg font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 hover:shadow-lg hover:-translate-y-px"
                style={{ backgroundColor: '#1a2f5e' }}
              >
                {saving ? '保存中...' : '設定を完了する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
