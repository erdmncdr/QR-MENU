import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { UtensilsCrossed, Settings, Package, List } from 'lucide-react'
import QRCodeDisplay from './QRCodeDisplay'

export default async function AdminDashboard() {
  // Get demo restaurant (id: 1)
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: 1 },
    include: {
      menuCategories: {
        include: {
          menuItems: true,
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

  const totalCategories = restaurant.menuCategories.length
  const totalItems = restaurant.menuCategories.reduce(
    (sum, cat) => sum + cat.menuItems.length,
    0
  )
  const visibleItems = restaurant.menuCategories.reduce(
    (sum, cat) => sum + cat.menuItems.filter((item) => item.isVisible).length,
    0
  )

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurant.slug}`

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz, {restaurant.name} yönetim paneline</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<List className="w-6 h-6" />}
          label="Toplam Kategori"
          value={totalCategories.toString()}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Package className="w-6 h-6" />}
          label="Toplam Ürün"
          value={totalItems.toString()}
          color="bg-green-500"
        />
        <StatCard
          icon={<UtensilsCrossed className="w-6 h-6" />}
          label="Aktif Ürün"
          value={visibleItems.toString()}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Settings className="w-6 h-6" />}
          label="Durum"
          value="Aktif"
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions & QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Hızlı İşlemler</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/menu">
              <Button variant="outline" className="w-full justify-start">
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Menüyü Düzenle
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-5 h-5 mr-2" />
                Restoran Ayarları
              </Button>
            </Link>
            <Link href={`/menu/${restaurant.slug}`} target="_blank">
              <Button variant="outline" className="w-full justify-start">
                Menüyü Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">QR Kodunuz</h2>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay menuUrl={menuUrl} restaurantName={restaurant.name} />
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">Kategorileriniz</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {restaurant.menuCategories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name_tr}</h3>
                  <p className="text-sm text-gray-600">
                    {category.menuItems.length} ürün
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.isVisible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category.isVisible ? 'Aktif' : 'Gizli'}
                </span>
              </div>
            ))}
          </div>
          {restaurant.menuCategories.length > 5 && (
            <div className="mt-4 text-center">
              <Link href="/admin/menu">
                <Button variant="outline" size="sm">
                  Tüm Kategorileri Gör ({restaurant.menuCategories.length})
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
