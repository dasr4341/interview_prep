import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  if (!token) {
    const currentUrl = req.headers.get('next-url') || '/';
    const loginUrl = new URL(currentUrl, req.url);
    loginUrl.searchParams.set('redirected', 'true');
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
