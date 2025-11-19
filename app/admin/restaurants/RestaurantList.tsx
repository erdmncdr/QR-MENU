'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Plus, Edit, Trash2, Copy, QrCode, Eye, Building2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Restaurant = {
  id: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  primaryColor: string
  phone: string | null
  address: string | null
  createdAt: string
  _count?: {
    menuCategories: number
  }
}

export default function RestaurantList({ initialRestaurants }: { initialRestaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants)
  const [isCreating, setIsCreating] = useState(false)

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" restoranını silmek istediğinizden emin misiniz? Tüm menü verileri silinecektir!`)) {
      return
    }

    const toastId = toast.loading('Restoran siliniyor...')

    try {
      const response = await fetch(`/api/restaurant/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Restoran silinemedi')
      }

      setRestaurants(restaurants.filter(r => r.id !== id))
      toast.success('Restoran başarıyla silindi', { id: toastId })
    } catch (error) {
      console.error('Error deleting restaurant:', error)
      toast.error(error instanceof Error ? error.message : 'Restoran silinemedi', { id: toastId })
    }
  }

  const handleDuplicate = async (id: number, name: string) => {
    const toastId = toast.loading('Restoran kopyalanıyor...')

    try {
      const response = await fetch(`/api/restaurant/${id}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Restoran kopyalanamadı')
      }

      const newRestaurant = await response.json()
      setRestaurants([...restaurants, newRestaurant])
      toast.success('Restoran başarıyla kopyalandı', { id: toastId })
    } catch (error) {
      console.error('Error duplicating restaurant:', error)
      toast.error(error instanceof Error ? error.message : 'Restoran kopyalanamadı', { id: toastId })
    }
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Restoranlarım</h1>
          <p className="text-gray-600">
            Tüm restoranlarınızı buradan yönetin
          </p>
        </div>
        <Link href="/admin/restaurants/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Restoran
          </Button>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Henüz restoran eklemediniz
          </h2>
          <p className="text-gray-600 mb-6">
            İlk restoranınızı oluşturun ve QR menünüzü kullanmaya başlayın
          </p>
          <Link href="/admin/restaurants/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              İlk Restoranı Oluştur
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <div
                className="h-24 bg-gradient-to-br from-red-500 to-red-600"
                style={{ backgroundColor: restaurant.primaryColor }}
              />

              <CardContent className="p-6 -mt-12">
                {restaurant.logoUrl ? (
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-white mb-4">
                    <img
                      src={restaurant.logoUrl}
                      alt={restaurant.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-bold mb-4"
                    style={{ backgroundColor: restaurant.primaryColor }}
                  >
                    {restaurant.name.charAt(0)}
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>

                {restaurant.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                )}

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {restaurant.phone && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📞</span>
                      {restaurant.phone}
                    </div>
                  )}
                  {restaurant.address && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📍</span>
                      {restaurant.address.substring(0, 40)}...
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="font-medium mr-2">📋</span>
                    {restaurant._count?.menuCategories || 0} kategori
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/menu/${restaurant.slug}`} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Görüntüle
                    </Button>
                  </Link>

                  <Link href={`/admin/restaurants/${restaurant.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(restaurant.id, restaurant.name)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(restaurant.id, restaurant.name)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
