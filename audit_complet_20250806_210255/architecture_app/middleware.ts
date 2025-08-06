import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes API messages
  if (pathname.startsWith('/api/messages')) {
    // Pour l'instant, on simule l'auth avec un header simple
    // Dans un vrai projet, vérifier JWT ou session NextAuth
    const userId = request.headers.get('X-User-ID') || 
                  request.nextUrl.searchParams.get('userId') ||
                  'test-client-123'; // Fallback pour dev

    if (!userId) {
      return NextResponse.json({ 
        error: 'Non autorisé',
        message: 'Authentification requise' 
      }, { status: 401 });
    }

    // Ajouter l'userId aux headers pour les API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Protéger les pages dashboard
  if (pathname.startsWith('/dashboard')) {
    // Simulation vérification session
    // En production: vérifier NextAuth session ou JWT
    const isAuthenticated = true; // À remplacer par vraie logique auth

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/messages/:path*',
    '/dashboard/:path*'
  ]
};
