import { TIER_CONFIG } from '@/lib/partners-config';
import type { PlanTier } from '@/types/database';

export function TierBadge({ tier }: { tier: PlanTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
      className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap font-mono"
    >
      {cfg.badge}
    </span>
  );
}
