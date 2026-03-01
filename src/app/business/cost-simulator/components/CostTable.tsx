'use client';

import type { CostBreakdown } from '../lib/types';

type Props = {
  breakdowns: CostBreakdown[];
  headcount: number;
};

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function RangeCell({ min, max }: { min: number; max: number }) {
  if (min === 0 && max === 0) return <span className="text-gray-400">—</span>;
  if (min === max) return <span>{formatYen(min)}</span>;
  return (
    <span>
      {formatYen(min)} 〜 {formatYen(max)}
    </span>
  );
}

function Section({
  title,
  items,
  total,
  bgColor,
}: {
  title: string;
  items: { key: string; label: string; min: number; max: number }[];
  total: { min: number; max: number };
  bgColor: string;
}) {
  return (
    <>
      <tr className={bgColor}>
        <td colSpan={2} className="px-4 py-2 font-bold text-sm text-[#1a2f5e]">
          {title}
        </td>
      </tr>
      {items.map((item) => (
        <tr key={item.key} className="border-b border-gray-100">
          <td className="px-4 py-2 text-sm text-gray-700 pl-8">{item.label}</td>
          <td className="px-4 py-2 text-sm text-right font-mono">
            <RangeCell min={item.min} max={item.max} />
          </td>
        </tr>
      ))}
      <tr className="border-b-2 border-gray-200">
        <td className="px-4 py-2 text-sm font-bold text-gray-700 pl-8">小計</td>
        <td className="px-4 py-2 text-sm text-right font-mono font-bold">
          <RangeCell min={total.min} max={total.max} />
        </td>
      </tr>
    </>
  );
}

export function CostTable({ breakdowns, headcount }: Props) {
  if (breakdowns.length === 0) return null;

  // 単一 vs 比較表示
  const isComparison = breakdowns.length > 1;

  if (isComparison) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#1a2f5e]">コスト比較</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a2f5e] text-white">
                <th className="px-4 py-3 text-left w-1/4">項目</th>
                {breakdowns.map((b) => (
                  <th key={b.visaType} className="px-4 py-3 text-right">
                    {b.visaLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 初期費用 */}
              <tr className="bg-blue-50">
                <td className="px-4 py-2 font-bold" colSpan={1 + breakdowns.length}>
                  初期費用（1人あたり）
                </td>
              </tr>
              {breakdowns[0].initialItems.map((item, i) => (
                <tr key={item.key} className="border-b border-gray-100">
                  <td className="px-4 py-2 text-gray-700 pl-6">{item.label}</td>
                  {breakdowns.map((b) => (
                    <td key={b.visaType} className="px-4 py-2 text-right font-mono">
                      <RangeCell
                        min={b.initialItems[i]?.min ?? 0}
                        max={b.initialItems[i]?.max ?? 0}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b-2 border-gray-200 font-bold">
                <td className="px-4 py-2 pl-6">初期費用 小計</td>
                {breakdowns.map((b) => (
                  <td key={b.visaType} className="px-4 py-2 text-right font-mono">
                    <RangeCell min={b.initialTotal.min} max={b.initialTotal.max} />
                  </td>
                ))}
              </tr>

              {/* 月次費用 */}
              <tr className="bg-green-50">
                <td className="px-4 py-2 font-bold" colSpan={1 + breakdowns.length}>
                  月次費用（1人あたり）
                </td>
              </tr>
              {breakdowns[0].monthlyItems.map((item, i) => (
                <tr key={item.key} className="border-b border-gray-100">
                  <td className="px-4 py-2 text-gray-700 pl-6">{item.label}</td>
                  {breakdowns.map((b) => (
                    <td key={b.visaType} className="px-4 py-2 text-right font-mono">
                      <RangeCell
                        min={b.monthlyItems[i]?.min ?? 0}
                        max={b.monthlyItems[i]?.max ?? 0}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b-2 border-gray-200 font-bold">
                <td className="px-4 py-2 pl-6">月次費用 小計</td>
                {breakdowns.map((b) => (
                  <td key={b.visaType} className="px-4 py-2 text-right font-mono">
                    <RangeCell min={b.monthlyTotal.min} max={b.monthlyTotal.max} />
                  </td>
                ))}
              </tr>

              {/* 3年間総コスト */}
              <tr className="bg-[#1a2f5e]/5 font-bold text-[#1a2f5e]">
                <td className="px-4 py-3">3年間総コスト（{headcount}人）</td>
                {breakdowns.map((b) => (
                  <td key={b.visaType} className="px-4 py-3 text-right font-mono text-lg">
                    <RangeCell min={b.threeYearTotal.min} max={b.threeYearTotal.max} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 単一表示
  const b = breakdowns[0];
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#1a2f5e]">コスト内訳 — {b.visaLabel}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a2f5e] text-white">
              <th className="px-4 py-3 text-left text-sm">項目</th>
              <th className="px-4 py-3 text-right text-sm">金額（1人あたり）</th>
            </tr>
          </thead>
          <tbody>
            <Section title="初期費用" items={b.initialItems} total={b.initialTotal} bgColor="bg-blue-50" />
            <Section title="月次費用" items={b.monthlyItems} total={b.monthlyTotal} bgColor="bg-green-50" />
            <Section title="リスクコスト" items={b.riskItems} total={b.riskTotal} bgColor="bg-orange-50" />
            <tr className="bg-[#1a2f5e]/5 font-bold text-[#1a2f5e]">
              <td className="px-4 py-3">3年間総コスト（{headcount}人）</td>
              <td className="px-4 py-3 text-right font-mono text-lg">
                <RangeCell min={b.threeYearTotal.min} max={b.threeYearTotal.max} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
