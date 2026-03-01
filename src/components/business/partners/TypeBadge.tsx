import { PARTNER_TYPE_CONFIG } from '@/lib/partners-config';
import type { PartnerType } from '@/types/database';

export function TypeBadge({ type }: { type: PartnerType }) {
  const cfg = PARTNER_TYPE_CONFIG[type];
  return (
    <span
      style={{ background: cfg.bgAccent, color: cfg.color }}
      className="px-2.5 py-0.5 rounded text-[11px] font-bold whitespace-nowrap"
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}
