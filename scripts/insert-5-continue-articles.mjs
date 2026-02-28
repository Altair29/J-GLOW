import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const supabase = createClient(
  'https://tckwizynvfiqezjrcedk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const AUTHOR_ID = '7bb78a5a-da02-469f-b81c-5d9243b52397';

const articles = [
  {
    slug: 'position-upgrade',
    title: '外国人スタッフの職種変更・昇格設計——在留資格の壁を越えるポジション戦略',
    file: 'docs/article_position_upgrade.html',
    excerpt: '在留資格別の昇格制約と、法的リスクを回避しながら効果的な昇格設計を組み立てる方法を解説。',
  },
  {
    slug: 'career-gijinkoku',
    title: '「技術・人文知識・国際業務」への転換——特定技能からオフィスワークへのルートと企業メリット',
    file: 'docs/article_career_gijinkoku.html',
    excerpt: '特定技能から技人国への在留資格変更の条件・手続き・企業メリットを実務的に解説。',
  },
  {
    slug: 'career-student',
    title: '外国人スタッフの進学・留学ビザへの転換——企業が支援できることと法的な注意点',
    file: 'docs/article_career_student.html',
    excerpt: '外国人スタッフの進学支援と「卒業後に戻ってきてもらう」ための仕組みを解説。',
  },
  {
    slug: 'visa-renewal-compliance',
    title: '在留資格更新と会社の義務——更新漏れゼロを実現するスケジュール管理',
    file: 'docs/article_visa_renewal.html',
    excerpt: '在留資格の更新手続きを6ヶ月前からのカウントダウン形式で解説。不許可パターンと防止策も。',
  },
  {
    slug: 'compliance-violations',
    title: '外国人雇用のコンプライアンス違反——知らなかったでは済まない罰則と防止策',
    file: 'docs/article_compliance_violations.html',
    excerpt: '不法就労助長罪から届出漏れまで、違反類型別の罰則と予防体制の構築方法を解説。',
  },
];

function extractContent(html) {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const styleBlock = styleMatch ? `<style>${styleMatch[1]}</style>\n` : '';
  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';
  return styleBlock + bodyContent;
}

async function main() {
  for (const article of articles) {
    const filePath = resolve(root, article.file);
    const html = readFileSync(filePath, 'utf-8');
    const body = extractContent(html);

    console.log(`Upserting: ${article.slug} (body length: ${body.length})`);

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          slug: article.slug,
          title: article.title,
          body,
          excerpt: article.excerpt,
          status: 'published',
          author_id: AUTHOR_ID,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('slug, title, status');

    if (error) {
      console.error(`ERROR [${article.slug}]:`, error.message);
    } else {
      console.log(`OK [${article.slug}]:`, data);
    }
  }
}

main().catch(console.error);
