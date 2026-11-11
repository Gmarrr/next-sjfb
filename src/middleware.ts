import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Keeps the admin session fresh and sends signed-out visitors from /admin to the login page.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPublicAdminPath = path.startsWith('/admin/login') || path.startsWith('/admin/forgot-password') || path.startsWith('/admin/auth/');

  if (!user && !isPublicAdminPath) {
    const login = request.nextUrl.clone();
    login.pathname = '/admin/login';
    login.search = path !== '/admin' ? `?next=${encodeURIComponent(path)}` : '';
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = { matcher: ['/admin/:path*'] };
