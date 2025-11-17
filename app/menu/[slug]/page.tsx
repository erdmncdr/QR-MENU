import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MenuView from './MenuView'

export default async function MenuPage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      openingHours: {
        orderBy: { dayOfWeek: 'asc' },
      },
      menuCategories: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
        include: {
          menuItems: {
            where: { isVisible: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  return <MenuView restaurant={restaurant} />
}
