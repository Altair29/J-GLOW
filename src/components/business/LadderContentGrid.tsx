'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

type ContentStatus = 'published' | 'coming';
type ContentType = 'article' | 'checklist';
type StageId = 'stage1' | 'stage2' | 'stage3' | 'stage4';

interface LadderContent {
  id: string;
  stage: StageId;
  type: ContentType;
  status: ContentStatus;
  title: string;
  description: string;
  href: string;
}

const CONTENTS: LadderContent[] = [
  {
    id: 'ojt',
    stage: 'stage1',
    type: 'article',
    status: 'published',
    title: '最初の3ヶ月で差がつく！受入れOJT設計チェックリスト',
    description:
      '入国直後に企業が整えるべき環境と、モチベーションを下げない関わり方をチェックリスト形式で解説。',
    href: '/business/existing-users/ladder/ojt-design-first-3months',
  },
  {
    id: 'arrival',
    stage: 'stage1',
    type: 'checklist',
    status: 'published',
    title: '受入れ準備チェックリスト──入国前から最初の1週間でやること全部',
    description:
      '入国前後に必要な手続きと環境整備を抜け漏れなく確認できるリスト。宿舎・書類・各種手続きの抜け漏れを防ぎます。',
    href: '/business/existing-users/ladder/arrival-checklist',
  },
  {
    id: 'roadmap',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '特定技能移行を見据えた日本語・技能ロードマップ（在籍2年目向け）',
    description:
      '2年目に入ったスタッフに対して企業が設計すべき学習計画と、試験対策のタイミングを解説。',
    href: '/business/existing-users/ladder/tokutei-roadmap-3years',
  },
  {
    id: 'exam',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '特定技能2号試験 合格率を上げる「企業の関わり方」',
    description:
      '試験対策を個人任せにしている企業が多い中、合格率の高い企業が共通してやっていること。',
    href: '/business/existing-users/ladder/exam-support',
  },
  {
    id: 'tokutei1-exam',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '特定技能1号試験 合格率を上げる「企業の関わり方」',
    description:
      '育成就労・技能実習から特定技能1号に移行するための試験を、企業としてどうサポートするか。',
    href: '/business/existing-users/ladder/exam-support-1go',
  },
  {
    id: 'visa-change',
    stage: 'stage3',
    type: 'checklist',
    status: 'published',
    title: '在留資格変更申請 企業が準備する書類チェックリスト',
    description:
      '特定技能1号への在留資格変更申請で企業側が準備すべき書類を試験ルート・修了免除ルート別に一覧化。',
    href: '/business/existing-users/ladder/documents-checklist',
  },
  {
    id: 'retention',
    stage: 'stage4',
    type: 'article',
    status: 'published',
    title: '特定技能2号になったスタッフを「中核人材」にする評価・処遇の整え方',
    description:
      '長期雇用を前提に、日本人スタッフと同等の評価制度や処遇設計を整える方法。',
    href: '/business/existing-users/ladder/core-talent-management',
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
  article: '📄 記事',
  checklist: '📋 チェックリスト',
};

type TabKey = 'all' | StageId;

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'stage1', label: 'Stage 1' },
  { key: 'stage2', label: 'Stage 2' },
  { key: 'stage3', label: 'Stage 3' },
  { key: 'stage4', label: 'Stage 4' },
];

export function LadderContentGrid() {
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
            外国人材のキャリアラダー段階に合わせて、企業担当者・監理団体スタッフが使えるコンテンツを揃えています。
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
          {/* 診断ツールカード（常時表示・フル幅） */}
          <Link
            href="/business/existing-users/ladder/checker"
            className="md:col-span-3 group block rounded-2xl border-2 p-6 md:p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{
              backgroundColor: 'rgba(26,47,94,0.04)',
              borderColor: 'rgba(26,47,94,0.20)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{
                    backgroundColor: 'rgba(201,168,76,0.12)',
                    color: '#c9a84c',
                  }}
                >
                  <Search size={11} />
                  診断ツール
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  特定技能 移行チェッカー
                </h3>
                <p className="text-sm text-gray-500">
                  現在の在留資格・日本語レベルを入力するだけで、移行までの残りステップが分かります。
                </p>
              </div>
              <div className="flex gap-4 shrink-0">
                {[
                  { v: '3分', l: '所要時間' },
                  { v: '5問', l: '設問数' },
                  { v: '無料', l: '費用' },
                ].map((m) => (
                  <div key={m.l} className="text-center">
                    <p
                      className="font-[family-name:var(--font-number)] text-lg font-bold"
                      style={{ color: '#1a2f5e' }}
                    >
                      {m.v}
                    </p>
                    <p className="text-[10px] text-gray-400">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          {/* 通常カード */}
          {filtered.map((content) => {
            const isComing = content.status === 'coming';
            const color = stageColors[content.stage];

            const cardInner = (
              <>
                {/* カラーバー */}
                <div
                  className="h-[3px] rounded-t-2xl"
                  style={{ backgroundColor: color }}
                />
                <div className="p-6">
                  {/* タイプバッジ */}
                  <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mb-3">
                    {typeLabels[content.type]}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {content.description}
                  </p>

                  {/* フッター */}
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
