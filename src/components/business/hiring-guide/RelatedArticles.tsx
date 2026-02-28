import type { RelatedArticle } from '@/lib/hiring-guide-data';

interface Props {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: Props) {
  const visibleArticles = articles.filter((a) => a.slug !== "");

  if (visibleArticles.length === 0) return null;

  return (
    <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        関連記事
      </p>
      <ul className="space-y-2">
        {visibleArticles.map((article) => (
          <li key={article.slug}>
            <a
              href={`/business/articles/${article.slug}`}
              data-article-slug={article.slug}
              className="inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-light)] hover:underline"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
