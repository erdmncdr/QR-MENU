import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RestaurantForm from '../RestaurantForm'

export default async function EditRestaurantPage({ params }: { params: { id: string } }) {
  const restaurantId = parseInt(params.id)

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  })

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restoran Düzenle</h1>
        <p className="text-gray-600">
          {restaurant.name} restoranının bilgilerini güncelleyin
        </p>
      </div>

      <RestaurantForm initialData={restaurant} />
    </div>
  )
}
