'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ContentStatus = 'published' | 'coming';
type ContentType = 'article' | 'checklist';
type StageId = 'stage1' | 'stage2' | 'stage3' | 'stage4';

interface ContinueContent {
  id: string;
  stage: StageId;
  type: ContentType;
  status: ContentStatus;
  title: string;
  description: string;
  href: string;
}

const CONTENTS: ContinueContent[] = [
  {
    id: 'why-leave',
    stage: 'stage1',
    type: 'article',
    status: 'published',
    title: '外国人材が辞める本当の理由——在留資格別に見る離職の構造',
    description:
      '「給与が安い」だけではない。在留資格ごとに異なる離職要因を構造的に分析し、対策の優先順位を明確にします。',
    href: '/business/existing-users/continue/why-workers-leave',
  },
  {
    id: 'fair-wage',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '外国人材の給与設定ガイド——同等待遇の義務と昇給設計の実務',
    description:
      '最低賃金の遵守だけでは不十分。法的義務と定着投資の両面から、在留資格変更タイミングに合わせた昇給設計を解説。',
    href: '/business/existing-users/continue/fair-wage-guide',
  },
  {
    id: 'position',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '技能が上がったらポジションも上げる——外国人材の評価制度・等級制度の作り方',
    description:
      '「頑張っているのに評価されない」は最大の離職動機。4段階の等級制度設計とキャリアアッププランの作り方。',
    href: '/business/existing-users/continue/position-upgrade',
  },
  {
    id: 'career-ikusei',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '育成就労から特定技能1号・2号、そして永住へ——企業が伴走するキャリア支援の実務',
    description:
      '育成就労→特定技能1号→2号→永住。企業がリーダー職・日本語支援・試験サポートを整えることが最も効果的な定着戦略。',
    href: '/business/existing-users/continue/career-ikusei-tokutei',
  },
  {
    id: 'career-gijinkoku',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '技術・人文知識・国際業務の外国人材を長期定着させる——更新・昇格・永住への道筋',
    description:
      '高度外国人材の定着には在留資格の適正管理・明確なキャリアパス・永住への伴走が重要。',
    href: '/business/existing-users/continue/career-gijinkoku',
  },
  {
    id: 'career-student',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '留学生を卒業後に正社員として定着させる——在留資格切替えから長期雇用までの実務',
    description:
      '内定を出すのがゴールではない。卒業後の在留資格変更手続きから職場適応まで、企業主導の支援を解説。',
    href: '/business/existing-users/continue/career-student',
  },
  {
    id: 'visa-renewal',
    stage: 'stage4',
    type: 'article',
    status: 'published',
    title: '外国人材の在留資格 更新・変更 実務チェックリスト——期限切れ・不許可を防ぐ管理術',
    description:
      '「うっかり期限切れ」は不法就労助長罪の対象。年間管理カレンダーと内部チェックリストで組織的に防ぐ方法。',
    href: '/business/existing-users/continue/visa-renewal-compliance',
  },
  {
    id: 'compliance',
    stage: 'stage4',
    type: 'article',
    status: 'published',
    title: 'よくある違反パターンと行政指導を受けないための対策——外国人雇用コンプライアンス完全ガイド',
    description:
      '違反の多くは「知らなかった」から起きる。よくある7つの違反パターンと具体的な防止策をまとめたガイド。',
    href: '/business/existing-users/continue/compliance-violations',
  },
];

const stageColors: Record<StageId, string> = {
  stage1: '#4a90c4',
  stage2: '#2d6ea8',
  stage3: '#1a4f8c',
  stage4: '#c9a84c',
};

const stageLabels: Record<StageId, string> = {
  stage1: 'Stage 1',
  stage2: 'Stage 2',
  stage3: 'Stage 3',
  stage4: 'Stage 4',
};

const typeLabels: Record<ContentType, string> = {
  article: '\uD83D\uDCC4 記事',
  checklist: '\uD83D\uDCCB チェックリスト',
};

type TabKey = 'all' | StageId;

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'stage1', label: 'Stage 1' },
  { key: 'stage2', label: 'Stage 2' },
  { key: 'stage3', label: 'Stage 3' },
  { key: 'stage4', label: 'Stage 4' },
];

export function ContinueContentGrid() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered =
    activeTab === 'all'
      ? CONTENTS
      : CONTENTS.filter((c) => c.stage === activeTab);

  return (
    <section
      id="contents"
      className="py-16 md:py-20"
      style={{ backgroundColor: '#f7f8fb' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* 見出し */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#c9a84c' }}
          >
            Contents
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            ステージ別コンテンツ
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            外国人材の定着と制度対応を段階的に進めるためのコンテンツを揃えています。
          </p>
        </div>

        {/* タブナビ */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
              style={
                activeTab === tab.key
                  ? { backgroundColor: '#1a2f5e', color: '#fff' }
                  : { backgroundColor: '#e2e8f0', color: '#64748b' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* グリッド */}
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((content) => {
            const isComing = content.status === 'coming';
            const color = stageColors[content.stage];

            const cardInner = (
              <>
                <div
                  className="h-[3px] rounded-t-2xl"
                  style={{ backgroundColor: color }}
                />
                <div className="p-6">
                  <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mb-3">
                    {typeLabels[content.type]}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {content.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color }}
                    >
                      {stageLabels[content.stage]}
                    </span>
                    {isComing ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400">
                        準備中
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                        style={{ color: '#1a2f5e' }}
                      >
                        詳しく見る
                        <ArrowRight size={13} />
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            if (isComing) {
              return (
                <div
                  key={content.id}
                  className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden opacity-50 cursor-default"
                >
                  {cardInner}
                </div>
              );
            }

            return (
              <Link
                key={content.id}
                href={content.href}
                className="group block bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-300 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {cardInner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
