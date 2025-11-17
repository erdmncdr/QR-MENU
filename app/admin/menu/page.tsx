import { prisma } from '@/lib/prisma'
import MenuEditor from './MenuEditor'

export default async function MenuManagementPage() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: 1 },
    include: {
      menuCategories: {
        orderBy: { order: 'asc' },
        include: {
          menuItems: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h2>
        <p className="text-gray-600">Lütfen seed scriptini çalıştırın.</p>
      </div>
    )
  }

  return <MenuEditor initialData={restaurant} />
}
