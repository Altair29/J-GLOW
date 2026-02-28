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
    slug: 'why-workers-leave',
    title: '外国人材が辞める本当の理由——在留資格別に見る離職の構造',
    file: 'docs/article_why_workers_leave.html',
  },
  {
    slug: 'fair-wage-guide',
    title: '外国人材の給与設定ガイド——同等待遇の義務と定着につながる昇給設計の実務',
    file: 'docs/article_fair_wage_guide.html',
  },
  {
    slug: 'career-ikusei-tokutei',
    title: '育成就労から特定技能1号・2号、そして永住へ——企業が伴走するキャリア支援の全体像と実務',
    file: 'docs/article_career_ikusei.html',
  },
];

function extractContent(html) {
  // Extract <style> from <head>
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const styleBlock = styleMatch ? `<style>${styleMatch[1]}</style>\n` : '';

  // Extract content between <body> and </body>
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
