import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function MenuNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Restoran Bulunamadı
        </h2>
        <p className="text-gray-600 mb-8">
          Bu slug ile bir restoran menüsü bulunamadı.
        </p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  )
}
