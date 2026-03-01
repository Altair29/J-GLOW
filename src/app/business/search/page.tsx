import { createClient } from '@/lib/supabase/server';
import { SiteSearch } from './SiteSearch';

export const metadata = {
  title: 'サイト検索 | J-GLOW',
  description: 'ツール・ガイド・パートナー・記事をまとめて検索できます',
};

type SearchItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  tags: string[];
};

// 静的データ（ツール・パートナー）
const STATIC_ITEMS: SearchItem[] = [
  // ツール
  { id: 'tool-1', category: 'ツール', title: '外国人採用ナビゲーター', description: 'ビザ種別・業種・コストを一括シミュレーション。採用計画の第一歩に。', path: '/business/navigator', icon: '🧮', tags: ['コスト', 'シミュレーター', '計画'] },
  { id: 'tool-2', category: 'ツール', title: '労働条件通知書 生成ツール', description: '8言語対応。入管庁様式準拠の通知書をウィザード形式で作成・PDF出力。', path: '/business/tools/labor-notice', icon: '📄', tags: ['労働条件', 'PDF', '8言語', '育成就労', '特定技能'] },
  { id: 'tool-3', category: 'ツール', title: '現場指示書ビルダー', description: '安全・緊急・日常ルールを6言語で作成。印刷対応2カラムレイアウト。', path: '/business/existing-users/connect/templates', icon: '📋', tags: ['現場', '多言語', '安全', '指示書'] },
  { id: 'tool-4', category: 'ツール', title: '特定技能移行チェッカー', description: '5問のウィザードで技能実習生→特定技能への移行可否を診断。', path: '/business/existing-users/ladder/checker', icon: '✅', tags: ['特定技能', '移行', 'チェック', '技能実習'] },
  { id: 'tool-5', category: 'ツール', title: '外国人雇用 適正診断', description: '会社の状況をヒアリングし、最適な外国人雇用の進め方を提案。', path: '/business/diagnosis', icon: '🔍', tags: ['診断', '適正', 'はじめて'] },
  // ガイド
  { id: 'guide-1', category: 'ガイド', title: 'はじめての外国人雇用 完全ガイド', description: '採用検討から入社まで7ステップで解説。初めての企業向け入門ガイド。', path: '/business/hiring-guide', icon: '📘', tags: ['はじめて', '採用', 'ステップ', '入門'] },
  { id: 'guide-2', category: 'ガイド', title: '育成就労ロードマップ', description: '2027年4月施行の新制度。移行スケジュールと企業の対応事項を網羅。', path: '/business/roadmap', icon: '🗺️', tags: ['育成就労', '2027', '移行', 'ロードマップ'] },
  { id: 'guide-3', category: 'ガイド', title: '外国人スタッフ活用ハブ', description: '雇用中企業向けのキャリアパス・スキルアップ・在留資格変更の情報集約。', path: '/business/existing-users', icon: '👥', tags: ['活用', 'キャリア', '在留資格', '既存雇用'] },
  { id: 'guide-4', category: 'ガイド', title: '19分野 業種別解説', description: '製造・建設・介護など全19分野の受入れ要件・送出国・コストを解説。', path: '/business/articles', icon: '🏭', tags: ['業種', '分野', '製造', '建設', '介護', '農業'] },
  { id: 'guide-5', category: 'ガイド', title: '助成金情報', description: '外国人雇用に活用できる国・自治体の助成金・補助金をまとめて確認。', path: '/business/subsidies', icon: '💰', tags: ['助成金', '補助金', 'コスト削減'] },
  // パートナー
  { id: 'partner-1', category: 'パートナー', title: '監理団体を探す', description: '全国の監理団体をエリア・業種・ビザ種別でフィルタリング検索。', path: '/business/partners?type=監理団体', icon: '🏢', tags: ['監理団体', '技能実習', '育成就労', '検索'] },
  { id: 'partner-2', category: 'パートナー', title: '行政書士を探す', description: 'ビザ申請・在留資格変更手続きを支援する行政書士を全国から検索。', path: '/business/partners?type=行政書士', icon: '⚖️', tags: ['行政書士', 'ビザ申請', '在留資格'] },
  { id: 'partner-3', category: 'パートナー', title: '登録支援機関を探す', description: '特定技能外国人の生活・就労支援を担う登録支援機関を検索。', path: '/business/partners?type=登録支援機関', icon: '🤝', tags: ['登録支援機関', '特定技能', '生活支援'] },
];

export default async function SearchPage() {
  const supabase = await createClient();

  // 記事データを動的取得
  const [blogResult, editorialResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, title, excerpt, slug, category')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('editorial_articles')
      .select('id, title, body, slug, category')
      .eq('published', true)
      .limit(50),
  ]);

  const blogItems: SearchItem[] = (blogResult.data || []).map(post => ({
    id: `blog-${post.id}`,
    category: '記事',
    title: post.title,
    description: post.excerpt || post.title,
    path: `/business/articles/${post.slug}`,
    icon: '📝',
    tags: [post.category || '記事'].filter(Boolean),
  }));

  const editorialItems: SearchItem[] = (editorialResult.data || []).map(article => ({
    id: `editorial-${article.id}`,
    category: '記事',
    title: article.title,
    description: article.body ? article.body.slice(0, 80).replace(/<[^>]*>/g, '') + '...' : article.title,
    path: `/business/blog/${article.slug}`,
    icon: '📝',
    tags: [article.category || '記事'].filter(Boolean),
  }));

  const allItems = [...STATIC_ITEMS, ...blogItems, ...editorialItems];

  return <SiteSearch items={allItems} />;
}
