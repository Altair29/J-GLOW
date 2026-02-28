import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SLUGS = [
  'ikuseshuro-article-001',
  'ikuseshuro-article-003',
  'ikuseshuro-article-004',
  'ikuseshuro-article-009',
  'ikuseshuro-article-010',
  'ikuseshuro-article-012',
];

async function main() {
  console.log('=== 記事修正スクリプト ===\n');

  // Fetch all target articles
  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select('id, slug, body')
    .in('slug', SLUGS);

  if (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }

  if (!articles || articles.length === 0) {
    console.error('No articles found!');
    process.exit(1);
  }

  console.log(`Found ${articles.length} articles:\n`);
  for (const a of articles) {
    console.log(`  - ${a.slug} (id=${a.id}, body length=${a.body?.length || 0})`);
  }
  console.log('');

  for (const article of articles) {
    let body = article.body;
    const slug = article.slug;
    let changed = false;

    // ─── Article 001 ───
    if (slug === 'ikuseshuro-article-001') {
      // Remove broken image
      if (body.includes('![育成就労制度のキャリアパス全体像](figures/article_001_career_path.svg)')) {
        // Replace "全体像は以下のとおりです。\n\n![...]\n\n" with "全体像は次のとおりです。\n\n"
        body = body.replace(
          /キャリアパスの全体像は以下のとおりです。\s*\n\s*\n\s*!\[育成就労制度のキャリアパス全体像\]\(figures\/article_001_career_path\.svg\)\s*\n/,
          'キャリアパスの全体像は次のとおりです。\n'
        );
        // Fallback: just remove the image line
        body = body.replace(/!\[育成就労制度のキャリアパス全体像\]\(figures\/article_001_career_path\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed career_path image`);
      }
    }

    // ─── Article 003 ───
    if (slug === 'ikuseshuro-article-003') {
      // Remove broken image
      if (body.includes('![育成就労17分野 受入れ見込み数](figures/article_003_sectors.svg)')) {
        body = body.replace(/!\[育成就労17分野 受入れ見込み数\]\(figures\/article_003_sectors\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed sectors image`);
      }

      // Remove the simple 17-field list table (keep the detailed one with numbers)
      // Pattern: "**【育成就労制度 対象17分野一覧】**" followed by a table until double newline
      const simpleTablePattern = /\*\*【育成就労制度 対象17分野一覧】\*\*\s*\n\s*\n\| No\. \| 分野名 \|\s*\n\| ---[\s\S]*?(?=\n\n)/;
      if (simpleTablePattern.test(body)) {
        body = body.replace(simpleTablePattern, '');
        changed = true;
        console.log(`[${slug}] Removed simple 17-field table`);
      }

      // Fix the transition text after removing the table
      // Make sure the paragraph flows naturally into the detailed table
      const oldTransition = '閣議決定「育成就労制度の対象分野等について」により、以下の**17分野**が対象として決定されています。';
      const newTransition = '閣議決定「育成就労制度の対象分野等について」により、**17分野**が対象として決定されています。';
      if (body.includes(oldTransition)) {
        body = body.replace(oldTransition, newTransition);
        changed = true;
        console.log(`[${slug}] Fixed transition text`);
      }

      // Add bridge text if not present
      const bridgeText = '各分野の詳細と受入れ見込み数は以下のとおりです。';
      // Check if there's a gap between the intro paragraph and the detailed table
      // Look for the pattern where the intro ends and the detailed table section starts
      if (!body.includes(bridgeText)) {
        // Try to insert bridge text before the detailed table heading
        const detailedTablePattern = /(\n)(##+ .*受入れ見込み数|##+ .*分野別)/;
        if (detailedTablePattern.test(body)) {
          body = body.replace(detailedTablePattern, `\n\n${bridgeText}\n$1$2`);
          changed = true;
          console.log(`[${slug}] Added bridge text`);
        }
      }
    }

    // ─── Article 004 ───
    if (slug === 'ikuseshuro-article-004') {
      if (body.includes('![転籍の要件と手続きの流れ](figures/article_004_transfer_flow.svg)')) {
        body = body.replace(/!\[転籍の要件と手続きの流れ\]\(figures\/article_004_transfer_flow\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed transfer_flow image`);
      }
    }

    // ─── Article 009 ───
    if (slug === 'ikuseshuro-article-009') {
      // Remove broken image
      if (body.includes('![監理支援機関 許可申請モデルスケジュール](figures/article_009_schedule.svg)')) {
        body = body.replace(/!\[監理支援機関 許可申請モデルスケジュール\]\(figures\/article_009_schedule\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed schedule image`);
      }

      // Convert terminal-style code block to table
      const codeBlockPattern = /```\s*\n2026年後半〜2027年初頭\s*：施行日前の許可申請受付（改正法附則第5条）\s*\n2027年1月〜3月頃\s*：審査期間\s*\n2027年4月1日\s*：施行日。許可取得済みの機関が監理支援機関として事業開始\s*\n```/;
      if (codeBlockPattern.test(body)) {
        const tableReplacement = `| 時期 | 内容 |\n| --- | --- |\n| 2026年後半〜2027年初頭 | 施行日前の許可申請受付（改正法附則第5条） |\n| 2027年1月〜3月頃 | 審査期間 |\n| 2027年4月1日 | 施行日。許可取得済みの機関が監理支援機関として事業開始 |`;
        body = body.replace(codeBlockPattern, tableReplacement);
        changed = true;
        console.log(`[${slug}] Converted code block to table`);
      }
    }

    // ─── Article 010 ───
    if (slug === 'ikuseshuro-article-010') {
      // Remove first broken image and merge text
      if (body.includes('![特定技能1号への移行に必要な3つの要件](figures/article_010_transition.svg)')) {
        // Merge "以下のようになります。\n\n![...]\n\nつまり、" into "育成就労はキャリアの..."
        body = body.replace(
          /制度全体のキャリアパスを整理すると、以下のようになります。\s*\n\s*\n\s*!\[特定技能1号への移行に必要な3つの要件\]\(figures\/article_010_transition\.svg\)\s*\n\s*\nつまり、育成就労は/,
          '制度全体のキャリアパスを整理すると、育成就労は'
        );
        // Fallback: just remove the image
        body = body.replace(/!\[特定技能1号への移行に必要な3つの要件\]\(figures\/article_010_transition\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed transition image`);
      }

      // Remove second broken image
      if (body.includes('![在留資格変更申請の流れ](figures/article_010_shinsei_flow.svg)')) {
        body = body.replace(/!\[在留資格変更申請の流れ\]\(figures\/article_010_shinsei_flow\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed shinsei_flow image`);
      }
    }

    // ─── Article 012 ───
    if (slug === 'ikuseshuro-article-012') {
      if (body.includes('![育成就労の費用構造](figures/article_012_cost.svg)')) {
        body = body.replace(/!\[育成就労の費用構造\]\(figures\/article_012_cost\.svg\)\s*\n?/g, '');
        changed = true;
        console.log(`[${slug}] Removed cost image`);
      }

      // Check for duplicate text "以下では、それぞれの費用項目を具体的に見ていきます。"
      const dupePattern = /以下では、それぞれの費用項目を具体的に見ていきます。\s*\n\s*\n\s*以下では、それぞれの費用項目を具体的に見ていきます。/;
      if (dupePattern.test(body)) {
        body = body.replace(dupePattern, '以下では、それぞれの費用項目を具体的に見ていきます。');
        changed = true;
        console.log(`[${slug}] Removed duplicate paragraph`);
      }
    }

    // Clean up excessive blank lines (3+ consecutive newlines → 2)
    body = body.replace(/\n{3,}/g, '\n\n');

    if (changed) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ body })
        .eq('id', article.id);

      if (updateError) {
        console.error(`[${slug}] Update error:`, updateError.message);
      } else {
        console.log(`[${slug}] ✅ Updated successfully`);
      }
    } else {
      console.log(`[${slug}] No changes needed (patterns not found)`);
    }
  }

  console.log('\n=== 完了 ===');
}

main().catch(console.error);
