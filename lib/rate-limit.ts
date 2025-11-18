/**
 * Simple in-memory rate limiter
 * For production, use Redis or Upstash
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the time window
   * @default 10
   */
  limit?: number

  /**
   * Time window in seconds
   * @default 60
   */
  window?: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param options - Rate limit configuration
 * @returns Rate limit result
 *
 * @example
 * ```ts
 * const result = rateLimit('192.168.1.1', { limit: 10, window: 60 })
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     { status: 429, headers: { 'Retry-After': String(result.reset) } }
 *   )
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 10, window = 60 } = options
  const now = Date.now()
  const windowMs = window * 1000

  const key = `${identifier}:${Math.floor(now / windowMs)}`

  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs
    }
  }

  store[key].count++

  const remaining = Math.max(0, limit - store[key].count)
  const reset = Math.ceil((store[key].resetTime - now) / 1000)

  return {
    success: store[key].count <= limit,
    limit,
    remaining,
    reset
  }
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (proxy/CDN)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  // In production with authentication, use user ID instead
  return 'anonymous'
}
