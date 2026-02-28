'use client';

import type { Step2Data, VisaType, RangeType, SectorType } from '../types';
import { VISA_CONFIGS, RENEWAL_LIMIT_REASONS, RENEWAL_CRITERIA_OPTIONS, getSectorList, WORKPLACE_RANGE_OPTIONS, JOB_RANGE_OPTIONS } from '../types';

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
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

const RENEWAL_TYPE_LABELS: Record<string, string> = {
  auto: '自動更新',
  possible: '更新する場合があり得る',
  no: '更新なし',
  other: 'その他',
};

/* ── Max end date: min(Labor Standards Act §14 3yr, visa-type limit) ── */
const VISA_MAX_YEARS: Record<VisaType, number | null> = {
  ikusei: 3,
  tokutei1: 1,
  tokutei2: null, // no visa limit → labor law 3yr
  ginou_jisshu: 3,
};

function calcMaxEndDate(contractStart: string, visaType: VisaType): string | undefined {
  if (!contractStart) return undefined;
  const start = new Date(contractStart);
  if (isNaN(start.getTime())) return undefined;

  // Labor Standards Act §14: max 3 years for general workers
  const laborLawMax = new Date(start);
  laborLawMax.setFullYear(laborLawMax.getFullYear() + 3);

  const visaYears = VISA_MAX_YEARS[visaType];
  if (visaYears === null) {
    return laborLawMax.toISOString().slice(0, 10);
  }

  const visaMax = new Date(start);
  visaMax.setFullYear(visaMax.getFullYear() + visaYears);

  const finalMax = visaMax < laborLawMax ? visaMax : laborLawMax;
  return finalMax.toISOString().slice(0, 10);
}

function getMaxDateLabel(visaType: VisaType): string {
  const visaYears = VISA_MAX_YEARS[visaType];
  if (visaYears === null) {
    return '労基法第14条により最長3年';
  }
  if (visaYears >= 3) {
    return '労基法第14条により最長3年';
  }
  const visaLabel = VISA_CONFIGS[visaType].label;
  return `${visaLabel}：1契約最長${visaYears}年（労基法上限3年）`;
}

export default function Step2Contract({ data, onChange, showErrors = false, errors = [] }: Props) {
  const set = <K extends keyof Step2Data>(key: K, value: Step2Data[K]) =>
    onChange({ ...data, [key]: value });

  const handleVisaChange = (visa: VisaType) => {
    const config = VISA_CONFIGS[visa];
    // Check if current sector exists in the new visa's sector list
    const newSectors = getSectorList(visa);
    const sectorStillValid = data.tokutei_sector && newSectors.some((s) => s.value === data.tokutei_sector);
    onChange({
      ...data,
      visa_type: visa,
      contract_type: config.contractDefault,
      contract_max_period: config.maxPeriod,
      transfer_clause: config.showTransferClause ? data.transfer_clause : false,
      tokutei_sector: sectorStillValid ? data.tokutei_sector : '',
      tokutei_job_category: sectorStillValid ? data.tokutei_job_category : '',
    });
  };

  const visaConfig = VISA_CONFIGS[data.visa_type];
  const showTransfer = visaConfig.showTransferClause;

  const hasErr = (key: string) => showErrors && errors.includes(key);

  const inputCls = (key: string, base?: string) =>
    `${base ?? 'w-full'} rounded-lg border px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none ${
      hasErr(key) ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
    }`;

  const maxEndDate = data.contract_type === 'fixed'
    ? calcMaxEndDate(data.contract_start, data.visa_type)
    : undefined;

  return (
    <div className="space-y-8">
      {/* Visa Type */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          在留資格
          <RequiredBadge />
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(VISA_CONFIGS) as VisaType[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => handleVisaChange(v)}
              className={`text-left px-4 py-3 rounded-lg border transition text-sm ${
                data.visa_type === v
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 ring-1 ring-[#1a2f5e]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{VISA_CONFIGS[v].label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                最大契約期間: {VISA_CONFIGS[v].maxPeriod}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* B-3: Visa loss consent */}
      <section className="p-4 rounded-xl border border-[#1a2f5e]/20 bg-[#1a2f5e]/5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.visa_loss_consent}
            onChange={(e) => set('visa_loss_consent', e.target.checked)}
            className="accent-[#1a2f5e] mt-0.5 rounded"
          />
          <span className="text-sm text-gray-700">
            在留資格が取り消された場合・更新不許可となった場合は
            自動退職となる条項（第1条）が本書面に挿入されることに同意します
          </span>
        </label>
      </section>

      {/* Entry date */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          入国予定日
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            任意
          </span>
        </h3>
        <input
          type="date"
          value={data.entry_date}
          onChange={(e) => set('entry_date', e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">※ 来日前の方は入国予定日を入力してください</p>
      </section>

      {/* Sector & job category (all visa types) */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          分野・業務区分
          <RequiredBadge />
        </h3>
        <div className="space-y-4">
          <div data-error={hasErr('tokutei_sector') || undefined}>
            <label className="block text-sm font-medium text-gray-700 mb-1">分野</label>
            <select
              value={data.tokutei_sector}
              onChange={(e) => set('tokutei_sector', e.target.value as SectorType | '')}
              className={inputCls('tokutei_sector')}
            >
              <option value="">分野を選択してください</option>
              {getSectorList(data.visa_type).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ErrorMsg show={hasErr('tokutei_sector')} text="分野を選択してください" />
          </div>
          {data.tokutei_sector && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業務区分</label>
              <input
                type="text"
                value={data.tokutei_job_category}
                onChange={(e) => set('tokutei_job_category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="例：溶接"
              />
            </div>
          )}
        </div>
      </section>

      {/* Contract Period */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          契約期間
          <RequiredBadge />
        </h3>

        {/* Contract type */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => set('contract_type', 'fixed')}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              data.contract_type === 'fixed'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            期間の定めあり
          </button>
          <button
            type="button"
            onClick={() => set('contract_type', 'indefinite')}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              data.contract_type === 'indefinite'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            期間の定めなし
          </button>
        </div>

        {/* Max period (readonly) */}
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
          <span className="font-medium text-amber-800">最大契約期間: </span>
          <span className="text-amber-900 font-bold">{data.contract_max_period}</span>
        </div>

        {/* Start / End dates */}
        {data.contract_type === 'fixed' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div data-error={hasErr('contract_start') || undefined}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約開始日
                </label>
                <input
                  type="date"
                  value={data.contract_start}
                  onChange={(e) => set('contract_start', e.target.value)}
                  className={inputCls('contract_start')}
                />
                <ErrorMsg show={hasErr('contract_start')} text="契約開始日を入力してください" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  契約終了日
                </label>
                <input
                  type="date"
                  value={data.contract_end}
                  onChange={(e) => set('contract_end', e.target.value)}
                  min={data.contract_start || undefined}
                  max={maxEndDate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
              </div>
            </div>
            {/* Max date info */}
            {data.contract_start && (
              <p className="text-xs text-gray-500 mt-2">
                ※ {getMaxDateLabel(data.visa_type)}
                {maxEndDate && `（最長: ${maxEndDate}）`}
              </p>
            )}
          </>
        )}
      </section>

      {/* Renewal */}
      {data.contract_type === 'fixed' && (
        <section>
          <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
            契約更新
          </h3>
          <div className="space-y-2 mb-4">
            {(['auto', 'possible', 'no', 'other'] as const).map((rt) => (
              <label key={rt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="renewal_type"
                  checked={data.renewal_type === rt}
                  onChange={() => {
                    // Clear criteria when switching to auto or no (they don't need criteria)
                    if (rt === 'auto' || rt === 'no') {
                      onChange({
                        ...data,
                        renewal_type: rt,
                        renewal_criteria_items: [],
                        renewal_criteria_text: '',
                        renewal_criteria_other: '',
                      });
                    } else {
                      set('renewal_type', rt);
                    }
                  }}
                  className="accent-[#1a2f5e]"
                />
                <span className="text-sm">{RENEWAL_TYPE_LABELS[rt]}</span>
              </label>
            ))}
          </div>
          {data.renewal_type === 'other' && (
            <input
              type="text"
              value={data.renewal_other_text}
              onChange={(e) => set('renewal_other_text', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4 focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="その他の条件を記入"
            />
          )}

          {/* Renewal criteria (checkboxes) — hidden for 'auto' (no criteria needed) and 'no' */}
          {(data.renewal_type === 'possible' || data.renewal_type === 'other') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                更新基準（複数選択可）
              </label>
              <div className="space-y-2">
                {RENEWAL_CRITERIA_OPTIONS.map((item) => {
                  const checked = data.renewal_criteria_items.includes(item);
                  return (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? data.renewal_criteria_items.filter((i) => i !== item)
                            : [...data.renewal_criteria_items, item];
                          onChange({ ...data, renewal_criteria_items: next, renewal_criteria_text: next.join('、') });
                        }}
                        className="accent-[#1a2f5e] rounded"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  );
                })}
                {/* その他 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.renewal_criteria_other !== '' || data.renewal_criteria_items.includes('その他')}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        const next = data.renewal_criteria_items.filter((i) => i !== 'その他');
                        onChange({
                          ...data,
                          renewal_criteria_items: next,
                          renewal_criteria_other: '',
                          renewal_criteria_text: next.join('、'),
                        });
                      } else {
                        const next = [...data.renewal_criteria_items, 'その他'];
                        onChange({
                          ...data,
                          renewal_criteria_items: next,
                          renewal_criteria_text: next.join('、'),
                        });
                      }
                    }}
                    className="accent-[#1a2f5e] rounded"
                  />
                  <span className="text-sm">その他</span>
                </label>
                {data.renewal_criteria_items.includes('その他') && (
                  <input
                    type="text"
                    value={data.renewal_criteria_other}
                    onChange={(e) => {
                      const otherText = e.target.value;
                      const items = data.renewal_criteria_items;
                      const textItems = items.map((i) => i === 'その他' && otherText ? `その他（${otherText}）` : i);
                      onChange({
                        ...data,
                        renewal_criteria_other: otherText,
                        renewal_criteria_text: textItems.join('、'),
                      });
                    }}
                    className="w-full ml-6 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                    placeholder="その他の基準を入力"
                  />
                )}
              </div>
            </div>
          )}

          {/* Renewal limit */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              更新上限
              <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
                2024年改正
              </span>
            </p>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={!data.renewal_limit_has}
                  onChange={() => set('renewal_limit_has', false)}
                  className="accent-[#1a2f5e]"
                />
                上限なし
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={data.renewal_limit_has}
                  onChange={() => set('renewal_limit_has', true)}
                  className="accent-[#1a2f5e]"
                />
                あり
              </label>
            </div>
            {data.renewal_limit_has && (
              <>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <input
                      type="number"
                      value={data.renewal_limit_times}
                      onChange={(e) => set('renewal_limit_times', e.target.value)}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#1a2f5e] outline-none"
                    />
                    <span>回まで</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <input
                      type="number"
                      value={data.renewal_limit_years}
                      onChange={(e) => set('renewal_limit_years', e.target.value)}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-[#1a2f5e] outline-none"
                    />
                    <span>年まで</span>
                  </div>
                </div>

                {/* B-1: Renewal limit reason */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    更新上限を設ける理由
                    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
                      義務
                    </span>
                  </label>
                  <select
                    value={data.renewal_limit_reason}
                    onChange={(e) => set('renewal_limit_reason', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                  >
                    <option value="">理由を選択してください</option>
                    {RENEWAL_LIMIT_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  {data.renewal_limit_reason === 'custom' && (
                    <input
                      type="text"
                      value={data.renewal_limit_reason_text}
                      onChange={(e) => set('renewal_limit_reason_text', e.target.value)}
                      className="w-full mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                      placeholder="理由を入力"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Transfer clause */}
      {showTransfer && (
        <section className="p-4 rounded-lg border border-blue-200 bg-blue-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.transfer_clause}
              onChange={(e) => set('transfer_clause', e.target.checked)}
              className="accent-[#1a2f5e] mt-0.5 rounded"
            />
            <div className="text-sm">
              <div className="font-medium text-[#1a2f5e]">転籍条項</div>
              <div className="text-gray-600 mt-0.5">転籍を認める</div>
            </div>
          </label>
        </section>
      )}

      {/* A-1: Workplace with radio buttons */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          就業場所
          <RequiredBadge />
        </h3>
        <div className="space-y-4">
          <div data-error={hasErr('workplace_initial') || undefined}>
            <input
              type="text"
              value={data.workplace_initial}
              onChange={(e) => set('workplace_initial', e.target.value)}
              className={inputCls('workplace_initial')}
              placeholder="例：本社工場（東京都...）"
            />
            <ErrorMsg show={hasErr('workplace_initial')} text="就業場所を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              就業場所の変更の範囲
            </label>
            <div className="space-y-2 mb-2">
              {WORKPLACE_RANGE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workplace_range_type"
                    checked={data.workplace_change_range_type === opt.value}
                    onChange={() => set('workplace_change_range_type', opt.value)}
                    className="accent-[#1a2f5e]"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {data.workplace_change_range_type === 'custom' && (
              <input
                type="text"
                value={data.workplace_change_range}
                onChange={(e) => set('workplace_change_range', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="変更の範囲を入力"
              />
            )}
          </div>
        </div>
      </section>

      {/* A-1: Job Description with radio buttons */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          業務内容
          <RequiredBadge />
        </h3>
        <div className="space-y-4">
          <div data-error={hasErr('job_description_initial') || undefined}>
            <textarea
              value={data.job_description_initial}
              onChange={(e) => set('job_description_initial', e.target.value)}
              rows={3}
              className={`${inputCls('job_description_initial')} resize-y`}
              placeholder="例：製造ラインにおける組立・検品作業"
            />
            <ErrorMsg show={hasErr('job_description_initial')} text="業務内容を入力してください" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              業務内容の変更の範囲
            </label>
            <div className="space-y-2 mb-2">
              {JOB_RANGE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="job_range_type"
                    checked={data.job_description_change_range_type === opt.value}
                    onChange={() => set('job_description_change_range_type', opt.value)}
                    className="accent-[#1a2f5e]"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {data.job_description_change_range_type === 'custom' && (
              <textarea
                value={data.job_description_change_range}
                onChange={(e) => set('job_description_change_range', e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none resize-y"
                placeholder="変更の範囲を入力"
              />
            )}
          </div>
        </div>
      </section>

      {/* Indefinite conversion warning */}
      {data.contract_type === 'fixed' && data.contract_end && (data.visa_type === 'ginou_jisshu' || data.visa_type === 'tokutei1') && (
        <section className="p-3 rounded-lg bg-yellow-50 border border-yellow-300">
          <p className="text-xs text-yellow-800">
            有期労働契約の更新を重ねた場合、通算5年を超えた時点で無期転換申込権が発生します（労働契約法第18条）。
          </p>
        </section>
      )}
    </div>
  );
}
