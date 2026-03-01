'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';
import { getHomePath } from '@/lib/utils/routing';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) console.error('[useAuth] profile fetch error:', error);
        if (mounted && data) setProfile(data);
      } catch (err) {
        console.error('[useAuth] profile fetch exception:', err);
      }
    };

    // 1. マウント時に getSession() で初期セッションを即座に取得
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[useAuth] getSession error:', error);
          return;
        }
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error('[useAuth] initSession exception:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    // 2. onAuthStateChange で後続の状態変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    // 安全策：3秒後も loading なら強制解除
    const timer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
    } catch {
      // エラーでもUI側はすでにクリア済みなので続行
    }
  };

  const redirectToHome = () => {
    if (profile) {
      router.push(getHomePath(profile.role));
    }
  };

  return { user, profile, loading, signOut, redirectToHome, getHomePath };
}
