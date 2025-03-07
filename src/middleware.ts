import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add performance monitoring headers
  const response = NextResponse.next()
  response.headers.set('x-rpc-latency', '0')
  
  return response
}

export const config = {
  matcher: '/api/:path*',
}