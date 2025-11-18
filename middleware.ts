import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, getClientIdentifier } from './lib/rate-limit'

export function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = getClientIdentifier(request)

    // Different limits for different endpoints
    const isWriteOperation = ['POST', 'PUT', 'DELETE'].includes(request.method)

    const result = rateLimit(identifier, {
      limit: isWriteOperation ? 20 : 60, // Stricter limits for mutations
      window: 60 // 1 minute window
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: result.reset
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.reset),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset)
          }
        }
      )
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', String(result.limit))
    response.headers.set('X-RateLimit-Remaining', String(result.remaining))
    response.headers.set('X-RateLimit-Reset', String(result.reset))

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
