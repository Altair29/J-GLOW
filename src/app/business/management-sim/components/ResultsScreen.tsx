'use client';

import Link from 'next/link';
import type { MsimGauges, KeyMoment, Grade, SetupConfig } from '../lib/types';
import { GRADE_CONFIG, CATEGORY_CONFIG, GAUGE_CONFIG, INDUSTRY_LABELS, VISA_LABELS } from '../lib/constants';
import { formatCurrency, extractLearningPoints } from '../lib/engine';

type Props = {
  gauges: MsimGauges;
  grade: Grade;
  keyMoments: KeyMoment[];
  totalMonths: number;
  setup: SetupConfig;
  onReset: () => void;
  userId: string | null;
};

export default function ResultsScreen({ gauges, grade, keyMoments, totalMonths, setup, onReset }: Props) {
  const gradeInfo = GRADE_CONFIG[grade];
  const learningPoints = extractLearningPoints(keyMoments);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* グレードヘッダー */}
      <div
        className="text-center rounded-2xl p-8 mb-8"
        style={{ background: gradeInfo.bgColor }}
      >
        <div className="text-sm font-bold text-gray-500 mb-2">{totalMonths}ヶ月の経営を完了！</div>
        <div
          className="text-6xl font-black mb-3"
          style={{ color: gradeInfo.color }}
        >
          {grade}
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">{gradeInfo.label}</h1>
        <p className="text-sm text-gray-600">{gradeInfo.description}</p>
      </div>

      {/* セットアップサマリー */}
      <div className="flex justify-center gap-3 mb-6">
        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-gray-600">
          {INDUSTRY_LABELS[setup.industry]}
        </span>
        <span className="px-3 py-1 bg-blue-50 rounded-full text-xs font-bold text-blue-700">
          {VISA_LABELS[setup.visaType]}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
          {setup.companySize}人企業
        </span>
      </div>

      {/* 最終ゲージ */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">最終ステータス</h3>
        <div className="grid grid-cols-5 gap-3">
          {(['funds', 'compliance', 'morale', 'productivity', 'retention'] as const).map((key) => {
            const cfg = GAUGE_CONFIG[key];
            const value = gauges[key];
            return (
              <div key={key} className="text-center">
                <div className="text-xl mb-1">{cfg.icon}</div>
                <div className="text-lg font-bold text-gray-800">
                  {key === 'funds' ? formatCurrency(value) : value}
                </div>
                <div className="text-xs text-gray-400">{cfg.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Momentsタイムライン */}
      {keyMoments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">判断のタイムライン</h3>
          <div className="relative pl-6">
            {/* タイムラインの縦線 */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

            <div className="space-y-4">
              {keyMoments.map((moment, i) => {
                const cat = CATEGORY_CONFIG[moment.category];
                // ネット効果の判定
                const netEffect =
                  moment.gaugeDelta.compliance_delta +
                  moment.gaugeDelta.morale_delta +
                  moment.gaugeDelta.productivity_delta +
                  moment.gaugeDelta.retention_delta;
                const isGood = netEffect > 0;

                return (
                  <div key={i} className="relative">
                    {/* タイムラインドット */}
                    <div
                      className={`absolute -left-4 w-4 h-4 rounded-full border-2 border-white ${
                        isGood ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-gray-400 flex-shrink-0 mt-0.5 w-6">
                        {moment.month}月
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                            style={{ backgroundColor: cat.bgColor, color: cat.color }}
                          >
                            {cat.label}
                          </span>
                          <span className="text-sm font-bold text-gray-700">{moment.scenarioTitle}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          → {moment.choiceLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 学習ポイント */}
      {learningPoints.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-4">
            <span>💡</span> 学びのまとめ
          </h3>
          <ul className="space-y-3">
            {learningPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-900 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-[#1a2f5e] text-white text-sm font-bold hover:bg-[#15254d] transition-colors shadow-md"
        >
          もう一度プレイする
        </button>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/business/partners"
            className="block text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            パートナー検索
          </Link>
          <Link
            href="/business/cost-simulator"
            className="block text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            コストシミュレーター
          </Link>
          <Link
            href="/business/contact"
            className="block text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            相談する
          </Link>
        </div>
      </div>
    </div>
  );
}
