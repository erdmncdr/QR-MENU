/**
 * Client-side configuration
 * These values are safe to use in client components
 */
export const clientConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

/**
 * Get the full menu URL for a restaurant
 */
export function getMenuUrl(slug: string): string {
  return `${clientConfig.appUrl}/menu/${slug}`
}
