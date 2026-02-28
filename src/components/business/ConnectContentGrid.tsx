'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ContentStatus = 'published' | 'coming';
type ContentType = 'article' | 'checklist';
type StageId = 'stage1' | 'stage2' | 'stage3' | 'stage4';

interface ConnectContent {
  id: string;
  stage: StageId;
  type: ContentType;
  status: ContentStatus;
  title: string;
  description: string;
  href: string;
}

const CONTENTS: ConnectContent[] = [
  {
    id: 'yes-problem',
    stage: 'stage1',
    type: 'article',
    status: 'published',
    title: '「はい」は理解のサインではない──東南アジア人材の返事が意味すること',
    description:
      '「わかった？」と聞くと「はい」と返ってくる。しかし数日後、まったく違うやり方で仕事をしている。この構造的な問題を解説。',
    href: '/business/existing-users/connect/yes-problem',
  },
  {
    id: 'plain-japanese',
    stage: 'stage1',
    type: 'article',
    status: 'published',
    title: '外国人に伝わる日本語の話し方──指揮命令者のための「やさしい日本語」実践ガイド',
    description:
      'オノマトペ、敬語、婉曲表現。外国人スタッフに伝わらない日本語の特徴と、伝わる話し方の具体的テクニック。',
    href: '/business/existing-users/connect/plain-japanese-guide',
  },
  {
    id: 'critical-manual',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '絶対に知っておくべきことは全部マニュアルに書く──「入社時必須情報」設計の考え方',
    description:
      '安全ルール・緊急連絡先・就業規則。「口頭で説明した」で終わらせず、マニュアルとして残す方法。',
    href: '/business/existing-users/connect/critical-info-manual',
  },
  {
    id: 'visual-instruction',
    stage: 'stage2',
    type: 'article',
    status: 'published',
    title: '読まなくてもわかる現場指示書の作り方──ビジュアル化7つの原則',
    description:
      '写真・◯×・数字・フローチャート。文字に頼らず伝える指示書設計の7つの原則を解説。',
    href: '/business/existing-users/connect/visual-instruction-design',
  },
  {
    id: 'cultural-gap',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '現場でよく起きる日本人×外国人の誤解パターン5選と対処法',
    description:
      '時間感覚、報連相、5S、曖昧な指示、Noと言えない文化。よくある5つの誤解パターンと具体的な対処法。',
    href: '/business/existing-users/connect/cultural-gap-patterns',
  },
  {
    id: 'mentor-system',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: 'メンター制度の設計・運用マニュアル──机上の制度で終わらせないために',
    description:
      '「担当者を決めました」で終わっていませんか。機能するメンター制度の設計・運用・評価の3段階を解説。',
    href: '/business/existing-users/connect/mentor-system-design',
  },
  {
    id: 'japanese-support',
    stage: 'stage3',
    type: 'article',
    status: 'published',
    title: '会社として日本語学習を支援するための実務ガイド（費用・時間・教材・助成金）',
    description:
      '業務時間内の学習支援、地域の日本語教室、オンラインサービス。活用できる助成金情報も含めた実務ガイド。',
    href: '/business/existing-users/connect/japanese-learning-support',
  },
  {
    id: 'psychological-safety',
    stage: 'stage4',
    type: 'article',
    status: 'published',
    title: '外国人材が「わかりません」と言える職場の作り方──心理的安全性の実践論',
    description:
      '「わからない」と言えない職場は危険です。心理的安全性を高める5つの行動と、定着率向上への道筋。',
    href: '/business/existing-users/connect/psychological-safety',
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

export function ConnectContentGrid() {
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
            外国人材とのコミュニケーション改善を段階的に進めるためのコンテンツを揃えています。
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
