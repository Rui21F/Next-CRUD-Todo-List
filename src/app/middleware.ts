import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './src/app/api/auth/[...nextauth]/route';

export async function middleware(request: Request) {
  const session = await getServerSession(request, authOptions);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check user's authorization based on their roles or permissions
  if (!hasAccess(session.user)) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/[...remult]'],
};

function hasAccess(user: any) {
  // Implement your authorization logic here
  return user.role === 'admin';
}