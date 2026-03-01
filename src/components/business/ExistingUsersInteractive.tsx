'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Target,
  Handshake,
  BarChart3,
  MessageSquareX,
  TrendingDown,
  FileQuestion,
  UserMinus,
  EyeOff,
  CircleDollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FadeUp, FadeUpGroup } from '@/components/common/FadeUp';

/* ========================================
   マッピング定義
   ======================================== */
const CARD_AXIS_MAP: Record<string, { axisId: string; label: string; emoji: string; color: string }> = {
  '01': { axisId: 'axis-connect', label: 'つなぐ', emoji: '🤝', color: '#0e4d3a' },
  '02': { axisId: 'axis-ladder', label: '育てる', emoji: '🎯', color: '#1a2f5e' },
  '03': { axisId: 'axis-decide', label: '続ける・判断する', emoji: '📊', color: '#3d1a1a' },
  '04': { axisId: 'axis-ladder', label: '育てる', emoji: '🎯', color: '#1a2f5e' },
  '05': { axisId: 'axis-decide', label: '続ける・判断する', emoji: '📊', color: '#3d1a1a' },
  '06': { axisId: 'axis-decide', label: '続ける・判断する', emoji: '📊', color: '#3d1a1a' },
};

/* ========================================
   ペインカード データ
   ======================================== */
type PainCard = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
  emphasis: string;
};

const painCards: PainCard[] = [
  {
    num: '01',
    icon: MessageSquareX,
    title: '指示が伝わらない',
    body: '日本語での業務指示が正確に伝わらず、作業ミスや手戻りが頻発。通訳を介しても現場のニュアンスが抜ける。',
    emphasis: '現場の生産性が30%低下するケースも',
  },
  {
    num: '02',
    icon: TrendingDown,
    title: '仕事は覚えたが「やる気」が見えない',
    body: '技術は身についたのにモチベーションが低下。将来のキャリアパスが見えず、惰性で働いている様子。',
    emphasis: '離職の兆候は半年前から現れています',
  },
  {
    num: '03',
    icon: FileQuestion,
    title: '在留資格の切替・更新が複雑',
    body: '特定技能への移行や育成就労の新制度対応など、手続きが煩雑で何から手をつければいいかわからない。',
    emphasis: '更新漏れは不法就労助長罪の対象に',
  },
  {
    num: '04',
    icon: UserMinus,
    title: 'せっかく育てても定着しない',
    body: '在留期間の満了や待遇面の不満で離職。教育コストが積み上がるばかりで、人材が資産にならない。',
    emphasis: '1人あたりの育成コストは平均80〜120万円',
  },
  {
    num: '05',
    icon: EyeOff,
    title: '管理体制が属人的で見えない',
    body: '監理団体やエージェントに任せきりで、自社の受入れ状況やコンプライアンスの実態を把握できていない。',
    emphasis: '担当者の退職で全てが止まるリスク',
  },
  {
    num: '06',
    icon: CircleDollarSign,
    title: '制度変更でコストがどう変わるか不安',
    body: '法改正や制度変更のたびにコスト構造がどう変わるのか試算できない。動くに動けない状態。',
    emphasis: '2027年の育成就労制度で大幅変更予定',
  },
];

/* ========================================
   ソリューション軸 データ
   ======================================== */
type SolutionAxis = {
  id: string;
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
    id: 'axis-ladder',
    icon: Target,
    emoji: '🎯',
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
    id: 'axis-connect',
    icon: Handshake,
    emoji: '🤝',
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
    id: 'axis-decide',
    icon: BarChart3,
    emoji: '📊',
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

/* ========================================
   メインコンポーネント
   ======================================== */
export function ExistingUsersInteractive() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [highlightedAxis, setHighlightedAxis] = useState<string | null>(null);

  function handleCardClick(axisId: string) {
    setHighlightedAxis(axisId);

    setTimeout(() => {
      document.getElementById(axisId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);

    setTimeout(() => {
      setHighlightedAxis(null);
    }, 2500);
  }

  return (
    <>
      {/* ========================================
          ペインカード（お悩み共感）
          ======================================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#c9a84c' }}
              >
                Common Pain Points
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                こんなお悩み、ありませんか？
              </h2>
              <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
                外国人材を受け入れている企業が共通して抱える課題です
              </p>
            </div>
          </FadeUp>

          <FadeUpGroup stagger={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {painCards.map((card) => {
              const Icon = card.icon;
              const mapping = CARD_AXIS_MAP[card.num];
              return (
                <div
                  key={card.num}
                  className="bg-slate-50 rounded-xl p-6 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  onMouseEnter={() => setHoveredCard(card.num)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(mapping.axisId)}
                >
                  {/* 番号 + アイコン */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-3xl font-black tracking-tight"
                      style={{ color: '#1a2f5e', opacity: 0.15 }}
                    >
                      {card.num}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#eef2ff' }}
                    >
                      <Icon size={20} strokeWidth={1.8} style={{ color: '#1a2f5e' }} />
                    </div>
                  </div>

                  {/* ホバー時バッジ（固定高さで確保） */}
                  <div className="h-8 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg shadow-md transition-opacity duration-200 ${
                        hoveredCard === card.num ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ backgroundColor: mapping.color }}
                    >
                      {mapping.emoji} {mapping.label} で解決 →
                    </span>
                  </div>

                  {/* タイトル */}
                  <h3 className="font-bold mb-2" style={{ color: '#1a2f5e' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-2">
                    {card.body}
                  </p>
                  <p className="text-xs font-bold" style={{ color: '#c9a84c' }}>
                    {card.emphasis}
                  </p>
                </div>
              );
            })}
          </FadeUpGroup>
        </div>
      </section>

      {/* ========================================
          ソリューションマップ（3軸カード）
          ======================================== */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: '#f7f8fb' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <FadeUp>
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
          </FadeUp>

          <FadeUpGroup stagger={0.12} className="grid md:grid-cols-3 gap-6">
            {axes.map((axis) => {
              const Icon = axis.icon;
              const style = accentStyles[axis.accent];
              const isHighlighted = highlightedAxis === axis.id;
              return (
                <Link
                  key={axis.id}
                  id={axis.id}
                  href={axis.href}
                  className={`group block bg-white rounded-2xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${style.border} ${
                    isHighlighted ? 'ring-4 ring-offset-2 ring-[#c9a84c]' : ''
                  }`}
                >
                  {/* ハイライトバナー */}
                  {isHighlighted && (
                    <div
                      className="text-xs font-bold text-center py-1.5"
                      style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
                    >
                      ⬆ クリックした課題の解決策です
                    </div>
                  )}

                  <div className="p-7">
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
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-60 group-hover:opacity-100 group-hover:gap-2.5 transition-all"
                      style={{ color: style.iconColor }}
                    >
                      詳しく見る
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </FadeUpGroup>
        </div>
      </section>
    </>
  );
}
