import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware to block common WordPress probe requests.
 * These automated scans waste resources and pollute logs.
 * Returns cached 404 responses at the edge (no origin request).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block WordPress admin probes
  if (
    pathname.startsWith('/wp-admin') ||
    pathname.startsWith('/wp-login.php') ||
    pathname.startsWith('/xmlrpc.php') ||
    pathname.startsWith('/wp-content') ||
    pathname.startsWith('/wp-includes')
  ) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/wp-admin/:path*',
    '/wp-login.php',
    '/xmlrpc.php',
    '/wp-content/:path*',
    '/wp-includes/:path*',
  ],
};
