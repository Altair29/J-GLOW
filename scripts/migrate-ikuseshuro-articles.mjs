import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const importDir = resolve('/mnt/c/Users/takak/ikuseshuro-content');

const supabase = createClient(
  'https://tckwizynvfiqezjrcedk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const AUTHOR_ID = '7bb78a5a-da02-469f-b81c-5d9243b52397';

// Parse YAML-like frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      meta[kv[1]] = val;
    }
  }
  return { meta, body: match[2] };
}

// Industry slug mapping (user-specified)
const INDUSTRY_SLUGS = {
  'kaigo': 'kaigo',
  'kogyo': 'kogyo',
  'nogyo': 'nogyo',
  'inshoku': 'inshoku',
  'kensetsu': 'kensetsu',
  'biru': 'biru',
  'zosen': 'zosen',
  'jidosha_seib': 'jidosha-seib',
  'koku': 'koku',
  'shukuhaku': 'shukuhaku',
  'gyogyo': 'gyogyo',
  'gaishoku': 'gaishoku',
  'jidosha_unso': 'jidosha-unso',
  'tetsudo': 'tetsudo',
  'ringyo': 'ringyo',
  'mokuzai': 'mokuzai',
  'linen': 'linen',
  'butsuryu': 'butsuryu',
  'shigen': 'shigen',
};

async function ensureCategories() {
  const categories = [
    { slug: 'ikuseshuro', name: '育成就労制度' },
    { slug: 'industry-guide', name: '分野別ガイド' },
  ];
  for (const cat of categories) {
    const { error } = await supabase
      .from('blog_categories')
      .upsert({ slug: cat.slug, name: cat.name }, { onConflict: 'slug' });
    if (error) console.error(`Category upsert error (${cat.slug}):`, error.message);
  }
  // Fetch IDs
  const { data } = await supabase.from('blog_categories').select('id, slug');
  const map = {};
  for (const row of data) map[row.slug] = row.id;
  return map;
}

async function main() {
  console.log('=== 育成就労記事コンテンツ移行 ===\n');

  const categoryMap = await ensureCategories();
  console.log('Categories:', categoryMap);

  const articles = [];

  // 1. Regular articles (article_001 ~ article_015)
  for (let i = 1; i <= 15; i++) {
    const num = String(i).padStart(3, '0');
    const filePath = resolve(importDir, `drafts/article_${num}.md`);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      articles.push({
        slug: `ikuseshuro-article-${num}`,
        title: meta.title || `article_${num}`,
        body: body.trim(),
        category_id: categoryMap['ikuseshuro'],
        status: 'published',
      });
    } catch (e) {
      console.error(`Skip article_${num}: ${e.message}`);
    }
  }

  // 2. Special articles
  for (const num of ['001', '002']) {
    const filePath = resolve(importDir, `drafts/article_special_${num}.md`);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      articles.push({
        slug: `ikuseshuro-special-${num}`,
        title: meta.title || `special_${num}`,
        body: body.trim(),
        category_id: categoryMap['ikuseshuro'],
        status: 'published',
        is_pinned: true,
      });
    } catch (e) {
      console.error(`Skip special_${num}: ${e.message}`);
    }
  }

  // 3. Industry guides (19 files)
  const industryDir = resolve(importDir, 'industry/drafts');
  const industryFiles = readdirSync(industryDir).filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md');
  for (const file of industryFiles) {
    const key = basename(file, '.md');
    const slug = INDUSTRY_SLUGS[key];
    if (!slug) {
      console.warn(`No slug mapping for industry file: ${file}`);
      continue;
    }
    const filePath = resolve(industryDir, file);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      articles.push({
        slug: slug,
        title: meta.title || key,
        body: body.trim(),
        category_id: categoryMap['industry-guide'],
        status: 'published',
      });
    } catch (e) {
      console.error(`Skip industry ${key}: ${e.message}`);
    }
  }

  console.log(`\nTotal articles to insert: ${articles.length}\n`);

  // Insert/upsert all articles
  let success = 0;
  let failed = 0;
  for (const article of articles) {
    const { error } = await supabase
      .from('blog_posts')
      .upsert({
        slug: article.slug,
        title: article.title,
        body: article.body,
        category_id: article.category_id,
        author_id: AUTHOR_ID,
        status: article.status,
        is_pinned: article.is_pinned || false,
        published_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`FAIL [${article.slug}]: ${error.message}`);
      failed++;
    } else {
      console.log(`OK   [${article.slug}] ${article.title.slice(0, 50)}`);
      success++;
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${success} / 失敗: ${failed} / 合計: ${articles.length}`);
}

main().catch(console.error);
