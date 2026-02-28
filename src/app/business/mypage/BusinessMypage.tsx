'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Building2, Crown, User, BarChart3, Bookmark,
  Lock, ClipboardList, Briefcase, Bell,
} from 'lucide-react';
import { BUSINESS_TYPE_LABELS } from '@/types/database';
import type {
  BusinessProfile, BusinessType, Plan, UserScore,
  Bookmark as BookmarkType, Notification,
} from '@/types/database';

type Props = {
  businessProfile: BusinessProfile;
  plan: Plan;
  scores: UserScore[];
  bookmarks: BookmarkType[];
  notifications: Notification[];
};

const SCORE_CATEGORY_LABELS: Record<string, { label: string; href: string }> = {
  diagnosis: { label: '適正診断', href: '/business/diagnosis' },
  simulation: { label: 'シミュレーション', href: '/business/simulation' },
  jp_test: { label: '日本語テスト', href: '#' },
};

const BOOKMARK_TYPE_LABELS: Record<string, string> = {
  article: '記事',
  job: '求人',
  resource: 'リソース',
};

export function BusinessMypage({ businessProfile: bp, plan, scores, bookmarks, notifications: initNotifs }: Props) {
  const bType = bp.business_type as BusinessType | null;
  const isOrgType = bType === 'supervisory' || bType === 'support';
  const router = useRouter();

  const [notifications, setNotifications] = useState(initNotifs);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (notif: Notification) => {
    if (notif.is_read) {
      // 既読なら遷移のみ
      if (notif.link_url) router.push(notif.link_url);
      return;
    }

    // 既読に更新
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notif.id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
    );

    if (notif.link_url) router.push(notif.link_url);
  };

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-12"
        style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <Building2 size={28} className="text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white mb-1 truncate">
                {bp.company_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {bType && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/90">
                    {BUSINESS_TYPE_LABELS[bType]}
                  </span>
                )}
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={
                    plan === 'premium'
                      ? { backgroundColor: '#c9a84c', color: '#1a2f5e' }
                      : { backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }
                  }
                >
                  {plan === 'premium' ? (
                    <span className="flex items-center gap-1"><Crown size={12} /> Premium</span>
                  ) : 'Free'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {bp.contact_name}
                </span>
                {bp.industry && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {bp.industry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* お知らせ */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} style={{ color: '#1a2f5e' }} />
            お知らせ
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          {notifications.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-3"
                >
                  {/* 未読ドット */}
                  <span className="mt-1.5 shrink-0">
                    {!n.is_read ? (
                      <span className="block w-2 h-2 rounded-full bg-red-500" />
                    ) : (
                      <span className="block w-2 h-2 rounded-full bg-transparent" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm truncate ${!n.is_read ? 'font-bold text-gray-900' : 'font-normal text-gray-700'}`}>
                        {n.title}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(n.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>
                    {n.link_url && (
                      <span className="text-xs mt-1 inline-block" style={{ color: '#1a2f5e' }}>
                        詳しく見る →
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">お知らせはまだありません</p>
            </div>
          )}
        </section>

        {/* 診断・シミュレーション結果 */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} style={{ color: '#1a2f5e' }} />
            診断・シミュレーション結果
          </h2>
          {scores.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scores.map((s) => {
                const cat = SCORE_CATEGORY_LABELS[s.category] || {
                  label: s.category,
                  href: '#',
                };
                return (
                  <Link
                    key={s.id}
                    href={cat.href}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {cat.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(s.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: '#1a2f5e' }}>
                      {s.score !== null ? s.score : '—'}
                      {s.max_score !== null && (
                        <span className="text-sm font-normal text-gray-400"> / {s.max_score}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">まだ結果がありません</p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/business/diagnosis"
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white"
                  style={{ backgroundColor: '#1a2f5e' }}
                >
                  適正診断を受ける
                </Link>
                <Link
                  href="/business/simulation"
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  シミュレーション
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* 保存済み記事 */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bookmark size={20} style={{ color: '#1a2f5e' }} />
            保存済み
          </h2>
          {bookmarks.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y">
              {bookmarks.map((bm) => (
                <div key={bm.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mr-2">
                      {BOOKMARK_TYPE_LABELS[bm.content_type] || bm.content_type}
                    </span>
                    <span className="text-sm text-gray-700">{bm.content_id}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(bm.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">保存した記事はまだありません</p>
            </div>
          )}
        </section>

        {/* 将来機能プレースホルダー */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-gray-400" />
            近日公開
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {isOrgType ? (
              <>
                <PlaceholderCard
                  icon={ClipboardList}
                  title="加盟企業管理"
                  desc="受入れ企業の一覧管理・進捗トラッキング"
                />
                <PlaceholderCard
                  icon={BarChart3}
                  title="支援実績ダッシュボード"
                  desc="支援件数・在留資格別の統計"
                />
              </>
            ) : (
              <>
                <PlaceholderCard
                  icon={Briefcase}
                  title="求人掲載"
                  desc="外国人材向けの求人を掲載・管理"
                />
                <PlaceholderCard
                  icon={ClipboardList}
                  title="雇用管理"
                  desc="在留資格の更新時期アラート・在籍状況の管理"
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Building2;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 opacity-60">
      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mb-3">
        <Icon size={20} className="text-gray-400" />
      </div>
      <h3 className="font-bold text-gray-600 mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
      <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 text-gray-500">
        近日公開
      </span>
    </div>
  );
}
