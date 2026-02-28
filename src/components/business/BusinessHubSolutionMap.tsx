import Link from 'next/link';
import { ArrowRight, Target, Handshake, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SolutionAxis = {
  icon: LucideIcon;
  emoji: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  accent: 'navy' | 'gold' | 'blend';
};

const axes: SolutionAxis[] = [
  {
    icon: Target,
    emoji: '\uD83C\uDFAF',
    label: '育てる',
    title: 'スキルアップ支援',
    description:
      '外国人材を次の在留資格・ポジションへステップアップさせるための学習設計と進捗管理。',
    features: [
      '日本語レベルに合わせた段階的カリキュラム',
      '試験対策コンテンツの提供',
      '在留資格ごとの必要スキルマッピング',
    ],
    href: '/business/existing-users/ladder',
    accent: 'navy',
  },
  {
    icon: Handshake,
    emoji: '\uD83E\uDD1D',
    label: 'つなぐ',
    title: 'コミュニケーション改善',
    description:
      '現場の言葉の壁を減らし、日本人スタッフと外国人材が協力できる職場をつくる。',
    features: [
      '多言語マニュアル・指示書テンプレート',
      '文化理解ワークショップの設計',
      'メンター制度の導入サポート',
    ],
    href: '/business/existing-users/connect',
    accent: 'gold',
  },
  {
    icon: BarChart3,
    emoji: '\uD83D\uDCCA',
    label: '続ける・判断する',
    title: '定着と制度対応',
    description:
      '人材の定着率を上げながら、制度変更への対応判断に必要なデータを揃える。',
    features: [
      '離職リスクの早期検知',
      '在留資格変更・更新のコスト試算',
      'コンプライアンスチェックリスト',
    ],
    href: '/business/existing-users/continue',
    accent: 'blend',
  },
];

const accentStyles = {
  navy: {
    iconBg: 'rgba(26, 47, 94, 0.08)',
    iconColor: '#1a2f5e',
    border: 'border-[#1a2f5e]/10 hover:border-[#1a2f5e]/30',
    tagBg: '#eef1f7',
    tagColor: '#1a2f5e',
  },
  gold: {
    iconBg: 'rgba(201, 168, 76, 0.10)',
    iconColor: '#c9a84c',
    border: 'border-[#c9a84c]/15 hover:border-[#c9a84c]/40',
    tagBg: '#fdf8ee',
    tagColor: '#8a7530',
  },
  blend: {
    iconBg: 'rgba(26, 47, 94, 0.06)',
    iconColor: '#2d4a7a',
    border: 'border-gray-200 hover:border-[#1a2f5e]/25',
    tagBg: '#edf0f6',
    tagColor: '#2d4a7a',
  },
};

export function BusinessHubSolutionMap() {
  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: '#f7f8fb' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#c9a84c' }}
          >
            Solution Map
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            3つの軸で課題を解決
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            育てる・つなぐ・続ける。それぞれの課題に最適なアプローチを提供します。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {axes.map((axis) => {
            const Icon = axis.icon;
            const style = accentStyles[axis.accent];
            return (
              <Link
                key={axis.label}
                href={axis.href}
                className={`group block bg-white rounded-2xl border-2 ${style.border} p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* ヘッダー */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: style.iconBg }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      style={{ color: style.iconColor }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: style.tagBg,
                        color: style.tagColor,
                      }}
                    >
                      {axis.emoji} {axis.label}
                    </span>
                  </div>
                </div>

                {/* コンテンツ */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {axis.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {axis.description}
                </p>

                {/* 特徴リスト */}
                <ul className="space-y-2 mb-6">
                  {axis.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span
                        className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: style.iconColor }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-60 group-hover:opacity-100 group-hover:gap-2.5 transition-all"
                  style={{ color: style.iconColor }}
                >
                  詳しく見る
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
