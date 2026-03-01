import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getHomePath } from '@/lib/utils/routing';

// ログイン必須パス（これ以外の /business/* /worker/* はゲスト公開）
const AUTH_REQUIRED_PATHS = [
  '/business/mypage',
  '/business/onboarding',
  '/business/tools/labor-notice',
  '/worker/mypage',
  '/admin',
];

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

  // ログイン必須パスに該当しなければスキップ（ゲスト公開）
  const matched = AUTH_REQUIRED_PATHS.find((p) => pathname.startsWith(p));
  if (!matched) {
    return supabaseResponse;
  }

  // ========================================
  // 未ログイン → ログインページへリダイレクト
  // ========================================
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // ========================================
  // ロール取得
  // ========================================
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? '';

  // ========================================
  // /admin/* — admin または editor ロール
  // ========================================
  if (pathname.startsWith('/admin')) {
    if (role === 'admin') {
      // admin: 全パス許可
    } else if (role === 'editor') {
      // editor: /admin と /admin/blog/* のみ許可
      const editorAllowed =
        pathname === '/admin' || pathname.startsWith('/admin/blog');
      if (!editorAllowed) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    } else {
      // その他: ホームにリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // ========================================
  // /business/onboarding — businessロール必須
  // ========================================
  if (pathname.startsWith('/business/onboarding') && role !== 'business') {
    const url = request.nextUrl.clone();
    url.pathname = getHomePath(role);
    return NextResponse.redirect(url);
  }

  // ========================================
  // /business/mypage/* — businessロール必須
  // ========================================
  if (pathname.startsWith('/business/mypage') && role !== 'business') {
    const url = request.nextUrl.clone();
    url.pathname = getHomePath(role);
    return NextResponse.redirect(url);
  }

  // ========================================
  // /worker/mypage/* — workerロール必須
  // ========================================
  if (pathname.startsWith('/worker/mypage') && role !== 'worker') {
    const url = request.nextUrl.clone();
    url.pathname = getHomePath(role);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
