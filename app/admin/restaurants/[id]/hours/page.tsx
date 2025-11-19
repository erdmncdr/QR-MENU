import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import OpeningHoursManager from './OpeningHoursManager'

export default async function OpeningHoursPage({ params }: { params: { id: string } }) {
  const restaurantId = parseInt(params.id)

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      openingHours: {
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href={`/admin/restaurants/${restaurantId}`}>
          <Button type="button" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Çalışma Saatleri
        </h1>
        <p className="text-gray-600">
          {restaurant.name} için açılış-kapanış saatlerini ayarlayın
        </p>
      </div>

      <OpeningHoursManager
        restaurantId={restaurant.id}
        initialHours={restaurant.openingHours}
      />
    </div>
  )
}
