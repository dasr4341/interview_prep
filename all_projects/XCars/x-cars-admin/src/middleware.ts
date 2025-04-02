import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken__admin')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/cars/:path*',
    '/dashboard/dealers/:path*',
  ],
};
