interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--muted-foreground)]" aria-label="パンくずリスト">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-[var(--subtle)]">/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-[var(--primary)] hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-[var(--foreground)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
