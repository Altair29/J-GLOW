'use client';

import type { Step1Data } from '../types';
import { sanitizeName, sanitizeAddress } from '../types';

interface Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  showErrors?: boolean;
  errors?: string[];
}

function RequiredBadge() {
  return (
    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
      必須
    </span>
  );
}

function ErrorMsg({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-red-500 mt-1">{text}</p>;
}

export default function Step1CompanyWorker({ data, onChange, showErrors = false, errors = [] }: Props) {
  const set = (key: keyof Step1Data, value: string) =>
    onChange({ ...data, [key]: value });

  const hasErr = (key: string) => showErrors && errors.includes(key);

  const inputCls = (key: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none ${
      hasErr(key) ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-8">
      {/* Worker info */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4 flex items-center">
          労働者情報
          <RequiredBadge />
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div data-error={hasErr('worker_name') || undefined}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              氏名
            </label>
            <input
              type="text"
              value={data.worker_name}
              onChange={(e) => set('worker_name', sanitizeName(e.target.value))}
              className={inputCls('worker_name')}
              placeholder="例：グエン　ヴァン　アン"
            />
            <ErrorMsg show={hasErr('worker_name')} text="労働者氏名を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              発行日
            </label>
            <input
              type="date"
              value={data.issue_date}
              onChange={(e) => set('issue_date', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Company info */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          会社情報
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div data-error={hasErr('company_name') || undefined}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会社名
              <span className="text-xs text-gray-400 ml-1">（日本語）</span>
              <RequiredBadge />
            </label>
            <input
              type="text"
              value={data.company_name}
              onChange={(e) => set('company_name', sanitizeName(e.target.value))}
              className={inputCls('company_name')}
              placeholder="例：株式会社サンプル"
            />
            <ErrorMsg show={hasErr('company_name')} text="会社名を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会社名
              <span className="text-xs text-gray-400 ml-1">（Romaji）</span>
            </label>
            <input
              type="text"
              value={data.company_name_romaji}
              onChange={(e) => set('company_name_romaji', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="e.g. J-GLOW Co., Ltd."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div data-error={hasErr('company_address') || undefined}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
              <RequiredBadge />
            </label>
            <input
              type="text"
              value={data.company_address}
              onChange={(e) => set('company_address', sanitizeAddress(e.target.value))}
              className={inputCls('company_address')}
              placeholder="例：東京都千代田区..."
            />
            <ErrorMsg show={hasErr('company_address')} text="住所を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
              <span className="text-xs text-gray-400 ml-1">（Romaji）</span>
            </label>
            <input
              type="text"
              value={data.company_address_romaji}
              onChange={(e) => set('company_address_romaji', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="e.g. Chiyoda-ku, Tokyo..."
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            電話番号
          </label>
          <input
            type="tel"
            value={data.company_phone}
            onChange={(e) => set('company_phone', e.target.value)}
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
            placeholder="03-1234-5678"
          />
        </div>
      </section>

      {/* Employer */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          使用者氏名
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div data-error={hasErr('employer_name') || undefined}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              使用者氏名
              <span className="text-xs text-gray-400 ml-1">（日本語）</span>
              <RequiredBadge />
            </label>
            <input
              type="text"
              value={data.employer_name}
              onChange={(e) => set('employer_name', sanitizeName(e.target.value))}
              className={inputCls('employer_name')}
              placeholder="例：代表取締役 田中太郎"
            />
            <ErrorMsg show={hasErr('employer_name')} text="使用者氏名を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              使用者氏名
              <span className="text-xs text-gray-400 ml-1">（Romaji）</span>
            </label>
            <input
              type="text"
              value={data.employer_name_romaji}
              onChange={(e) => set('employer_name_romaji', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="e.g. CEO Taro Tanaka"
            />
          </div>
        </div>
      </section>

      {/* Consultation desk */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          相談窓口
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            任意
          </span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              部署名
            </label>
            <input
              type="text"
              value={data.consultation_department}
              onChange={(e) => set('consultation_department', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="例：人事部"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              担当者名
            </label>
            <input
              type="text"
              value={data.consultation_contact_person}
              onChange={(e) => set('consultation_contact_person', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="例：山田花子"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            連絡先
          </label>
          <input
            type="text"
            value={data.consultation_contact_info}
            onChange={(e) => set('consultation_contact_info', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
            placeholder="例：03-1234-5678"
          />
        </div>
      </section>
    </div>
  );
}
