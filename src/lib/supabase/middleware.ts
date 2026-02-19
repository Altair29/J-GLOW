import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getHomePath } from '@/lib/utils/routing';

// リダイレクト除外パス（未ログインでもアクセス可）
// 認証ルートは /login, /register/*, /callback にあり
// /business/* や /worker/* 配下には存在しないため現在は空
const PUBLIC_PATHS: string[] = [];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 公開パスはスキップ
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return supabaseResponse;
  }

  // ========================================
  // /admin/* — adminロール必須
  // ========================================
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = getHomePath(profile?.role ?? '');
      return NextResponse.redirect(url);
    }
  }

  // ========================================
  // /business/* — businessロール必須（/business 自体はランディング公開）
  // ========================================
  if (pathname.startsWith('/business/')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'business') {
      const url = request.nextUrl.clone();
      url.pathname = getHomePath(profile?.role ?? '');
      return NextResponse.redirect(url);
    }
  }

  // ========================================
  // /worker/* — workerロール必須（/worker 自体はランディング公開）
  // ========================================
  if (pathname.startsWith('/worker/')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'worker') {
      const url = request.nextUrl.clone();
      url.pathname = getHomePath(profile?.role ?? '');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
