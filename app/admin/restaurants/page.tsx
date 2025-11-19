import { prisma } from '@/lib/prisma'
import RestaurantList from './RestaurantList'

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      _count: {
        select: {
          menuCategories: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return <RestaurantList initialRestaurants={restaurants} />
}
