'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Admin panel error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bir Hata Oluştu
          </h2>

          <p className="text-gray-600 mb-6">
            Admin panelinde bir sorun oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
              <p className="text-sm font-mono text-red-900 break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
            >
              Tekrar Dene
            </Button>

            <Button
              onClick={() => window.location.href = '/admin'}
              variant="outline"
              className="w-full"
            >
              Dashboard'a Dön
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="w-full"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
