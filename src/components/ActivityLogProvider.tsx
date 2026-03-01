'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActivityLog } from '@/lib/analytics/useActivityLog';

export function ActivityLogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { log } = useActivityLog();

  useEffect(() => {
    log({
      eventType: 'page_view',
      eventName: 'page_view',
      pagePath: pathname,
    });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
