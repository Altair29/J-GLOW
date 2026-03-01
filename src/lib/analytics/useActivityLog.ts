'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('jglow_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('jglow_session_id', sid);
  }
  return sid;
}

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export type EventType =
  | 'page_view'
  | 'tool_use'
  | 'tool_complete'
  | 'click'
  | 'form_submit'
  | 'article_read';

export interface LogPayload {
  eventType: EventType;
  eventName: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
}

export function useActivityLog() {
  const supabase = createClient();

  const log = useCallback(
    async (payload: LogPayload) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        await supabase.from('activity_logs').insert({
          user_id: user?.id ?? null,
          session_id: getSessionId(),
          user_type: user ? 'member' : 'guest',
          event_type: payload.eventType,
          event_name: payload.eventName,
          page_path: payload.pagePath ?? window.location.pathname,
          metadata: payload.metadata ?? {},
          device_type: getDeviceType(),
          referrer: document.referrer || null,
        });
      } catch (e) {
        console.warn('Activity log failed:', e);
      }
    },
    [supabase],
  );

  return { log };
}
