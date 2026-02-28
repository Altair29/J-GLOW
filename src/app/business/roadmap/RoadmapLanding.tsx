'use client';

import { useState } from 'react';
import Link from 'next/link';
import CountdownSection from '@/components/business/roadmap/CountdownSection';
import TimelineSection from '@/components/business/roadmap/TimelineSection';
import PracticalTimelineSection from '@/components/business/roadmap/PracticalTimelineSection';
import ChecklistSection from '@/components/business/roadmap/ChecklistSection';
import {
  TARGET_DATE,
  TARGET_LABEL,
  TARGET_DISPLAY,
  milestones,
  initialChecklist,
} from '@/components/business/roadmap/data';

// ── 型定義 ──

type PersonaFilter = 'all' | 'kanri' | 'existing' | 'new';

interface ArticlePost {
  id: number;
  slug: string;
  title: string;
  categoryId: number;
  isPinned: boolean;
  publishedAt: string | null;
  tags: string[];
}

// ── ペルソナ設定 ──

const PERSONA_TABS: { key: PersonaFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'kanri', label: '監理団体' },
  { key: 'existing', label: '既存受入れ企業' },
  { key: 'new', label: '採用検討中の企業' },
];

const PERSONA_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  kanri: { bg: '#1a2f5e', text: '#ffffff' },
  existing: { bg: '#2d5a9e', text: '#ffffff' },
  new: { bg: '#4a7ec7', text: '#ffffff' },
};

const PERSONA_LABELS: Record<string, string> = {
  kanri: '監理団体',
  existing: '既存受入れ企業',
  new: '採用検討中の企業',
};

// slug → ペルソナの直接マッピング
const SLUG_PERSONA_MAP: Record<string, PersonaFilter[]> = {
  'ikuseshuro-special-001': ['kanri', 'existing', 'new'],
  'ikuseshuro-special-002': ['kanri', 'existing', 'new'],
  'ikuseshuro-article-001': ['kanri', 'existing', 'new'],
  'ikuseshuro-article-002': ['kanri'],
  'ikuseshuro-article-003': ['kanri'],
  'ikuseshuro-article-004': ['kanri'],
  'ikuseshuro-article-005': ['kanri', 'existing'],
  'ikuseshuro-article-006': ['existing', 'new'],
  'ikuseshuro-article-007': ['existing', 'new'],
  'ikuseshuro-article-008': ['kanri', 'existing'],
  'ikuseshuro-article-009': ['kanri'],
  'ikuseshuro-article-010': ['existing', 'new'],
  'ikuseshuro-article-011': ['existing', 'new'],
  'ikuseshuro-article-012': ['kanri', 'existing'],
  'ikuseshuro-article-013': ['kanri'],
  'ikuseshuro-article-014': ['kanri', 'existing'],
  'ikuseshuro-article-015': ['existing', 'new'],
};

// タグ名 → ペルソナ
const TAG_PERSONA_MAP: Record<string, PersonaFilter> = {
  '監理団体': 'kanri',
  '既存受入れ企業': 'existing',
  '採用検討中': 'new',
};

function getPostPersonas(post: ArticlePost): PersonaFilter[] {
  // 1. slug直接マッピング
  if (SLUG_PERSONA_MAP[post.slug]) return SLUG_PERSONA_MAP[post.slug];
  // 2. タグベース
  const fromTags = post.tags
    .map((t) => TAG_PERSONA_MAP[t])
    .filter(Boolean);
  if (fromTags.length > 0) return fromTags;
  // 3. デフォルト: 全タブに表示
  return ['kanri', 'existing', 'new'];
}

function matchesPersona(post: ArticlePost, filter: PersonaFilter): boolean {
  if (filter === 'all') return true;
  return getPostPersonas(post).includes(filter);
}

// ── トップナビ ──

const NAV_LINKS = [
  { label: '記事一覧', href: '#articles' },
  { label: '運用要領', href: '/business/articles/ikuseshuro-special-001' },
  { label: '制度概要', href: '/business/articles/ikuseshuro-article-001' },
  { label: 'お問い合わせ', href: '/business/partners' },
];

// ── コンポーネント ──

// ダッシュボード用ペルソナ型
type DashboardPersona = '管理団体' | '受入企業';

export default function RoadmapLanding({
  posts,
}: {
  posts: ArticlePost[];
}) {
  const [persona, setPersona] = useState<PersonaFilter>('all');
  const [dashPersona, setDashPersona] = useState<DashboardPersona>('管理団体');

  // 修正3: special-002 をピン留めセクションから除外
  const pinnedPosts = posts.filter(
    (p) => p.isPinned && p.slug !== 'ikuseshuro-special-002'
  );

  // special-002 を取得
  const special002 = posts.find((p) => p.slug === 'ikuseshuro-special-002');

  // 通常記事（非ピン + special-002 以外）
  const normalPosts = posts.filter(
    (p) => !p.isPinned && p.slug !== 'ikuseshuro-special-002'
  );

  const filteredNormal = normalPosts.filter((p) => matchesPersona(p, persona));

  // 修正3: special-002 を3番目（index 2）に挿入
  const mainPostsRaw = filteredNormal.slice(0, 9);
  const mainPosts = special002
    ? [
        ...mainPostsRaw.slice(0, 2),
        special002,
        ...mainPostsRaw.slice(2, 8), // 合計9件に収まるよう8件目まで
      ]
    : mainPostsRaw;
  const extraPosts = filteredNormal.slice(special002 ? 8 : 9, special002 ? 14 : 15);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. トップナビゲーションバー */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-6 h-12 overflow-x-auto text-sm">
          <span className="font-bold text-[#1a2f5e] shrink-0">育成就労ロードマップ</span>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 text-gray-600 hover:text-[#1a2f5e] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* 2. ヒーローセクション */}
      <section
        className="py-16 sm:py-20 text-white"
        style={{
          background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-blue-200 mb-6">
            <Link href="/business" className="hover:text-white">
              企業向けトップ
            </Link>
            <span className="mx-2">&gt;</span>
            <span>育成就労ロードマップ</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            育成就労制度の実務情報を、
            <br className="hidden sm:block" />
            わかりやすく届ける。
          </h1>
          <p className="mt-4 text-blue-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            2027年4月の制度開始に向けて、監理団体・受入企業それぞれの立場で「今、何をすべきか」を記事・スケジュール・チェックリストで整理しています。
          </p>

          {/* カウントダウン */}
          <div className="mt-8">
            <CountdownSection
              targetDate={TARGET_DATE}
              targetLabel={TARGET_LABEL}
              targetDisplay={TARGET_DISPLAY}
            />
          </div>
        </div>
      </section>

      {/* 3. ピン留め記事セクション */}
      {pinnedPosts.length > 0 && (
        <section style={{ backgroundColor: '#f8fafc' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <div
              className="inline-block text-xs font-bold px-3 py-1 rounded mb-4"
              style={{ backgroundColor: '#c9a84c', color: '#ffffff' }}
            >
              制度開始前に必読
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pinnedPosts.map((post) => {
                const isSpecial001 = post.slug === 'ikuseshuro-special-001';

                if (isSpecial001) {
                  return (
                    <Link
                      key={post.slug}
                      href={`/business/articles/${post.slug}`}
                      className="relative block rounded-xl p-6 hover:shadow-lg transition-shadow group sm:col-span-2"
                      style={{
                        border: '3px solid #c9a84c',
                        backgroundColor: '#fdf8ee',
                      }}
                    >
                      {/* 右上の最重要バッジ */}
                      <span
                        className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded"
                        style={{ backgroundColor: '#c9a84c', color: '#ffffff' }}
                      >
                        ★ 最重要
                      </span>
                      <span
                        className="inline-block text-xs font-bold px-3 py-1 rounded mb-3"
                        style={{ backgroundColor: '#c9a84c', color: '#ffffff' }}
                      >
                        SPECIAL
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1a2f5e] leading-snug group-hover:underline pr-24">
                        {post.title}
                      </h3>
                      <span
                        className="inline-block mt-4 text-sm font-bold px-5 py-2 rounded-lg transition-opacity group-hover:opacity-90"
                        style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
                      >
                        記事を読む →
                      </span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={post.slug}
                    href={`/business/articles/${post.slug}`}
                    className="block rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow group"
                  >
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-3"
                      style={{ backgroundColor: '#c9a84c', color: '#ffffff' }}
                    >
                      SPECIAL
                    </span>
                    <h3 className="text-base font-bold text-[#1a2f5e] leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. ペルソナフィルタータブ */}
      <section id="articles" className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-2">
          <h2 className="text-lg font-bold text-[#1a2f5e] mb-6">
            あなたの立場に合った記事を探す
          </h2>
          <div className="flex flex-wrap gap-2">
            {PERSONA_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPersona(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  persona === tab.key
                    ? 'bg-[#1a2f5e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. まずはここから読んでください */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-6">
          <div
            className="rounded-lg px-4 py-2 mb-6 inline-block"
            style={{ backgroundColor: '#1a2f5e' }}
          >
            <h3 className="text-sm font-bold text-white">
              まずはここから読んでください
            </h3>
          </div>

          {mainPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              該当する記事がありません。「すべて」タブをお試しください。
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. あわせて読みたい記事 */}
      {extraPosts.length > 0 && (
        <section
          className="border-t border-gray-200"
          style={{ backgroundColor: '#f8fafc' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-lg font-bold text-[#1a2f5e] mb-6">
              あわせて読みたい記事
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {extraPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. 育成就労制度 準備スケジュール */}
      <section className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-bold text-[#1a2f5e] mb-1 pb-2 border-b-2 border-[#c9a84c] inline-block">
            育成就労制度 準備スケジュール
          </h2>

          {/* ダッシュボード用ペルソナ切替トグル */}
          <div className="mt-6 flex gap-2">
            {([
              { key: '管理団体' as DashboardPersona, label: '管理団体' },
              { key: '受入企業' as DashboardPersona, label: '受入企業' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDashPersona(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  dashPersona === tab.key
                    ? 'bg-[#1a2f5e] text-white'
                    : 'bg-white text-[#1a2f5e] border-2 border-[#1a2f5e] hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            {/* タイムライン: 管理団体選択時のみ */}
            {dashPersona === '管理団体' && (
              <TimelineSection milestones={milestones} />
            )}

            {/* 実務スケジュール */}
            <PracticalTimelineSection persona={dashPersona} />

            {/* チェックリスト: 管理団体選択時のみ */}
            {dashPersona === '管理団体' && (
              <ChecklistSection
                initialItems={initialChecklist}
                persona={dashPersona}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── 記事カード ──

function ArticleCard({ post }: { post: ArticlePost }) {
  const personas = getPostPersonas(post);

  return (
    <Link
      href={`/business/articles/${post.slug}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow group"
    >
      {/* ペルソナバッジ */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {personas.map((p) => {
          const style = PERSONA_BADGE_STYLES[p];
          if (!style) return null;
          return (
            <span
              key={p}
              className="inline-block text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {PERSONA_LABELS[p]}
            </span>
          );
        })}
      </div>

      {/* タイトル */}
      <h4 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:underline">
        {post.title}
      </h4>

      {/* タグ */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <span className="block mt-3 text-xs font-semibold text-[#1a2f5e] group-hover:underline">
        記事を読む →
      </span>
    </Link>
  );
}
