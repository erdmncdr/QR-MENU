'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type MenuItem = {
  id: number
  name_tr: string
  name_en: string | null
  description_tr: string | null
  description_en: string | null
  price: number
  currency: string
  isPopular: boolean
  isNew: boolean
  isSpicy: boolean
  isVegan: boolean
  allergens: string
  imageUrl: string | null
  isVisible: boolean
  order: number
}

type MenuCategory = {
  id: number
  slug: string
  type: string
  order: number
  name_tr: string
  name_en: string | null
  description_tr: string | null
  description_en: string | null
  isVisible: boolean
  icon: string | null
  menuItems: MenuItem[]
}

type Restaurant = {
  id: number
  name: string
  menuCategories: MenuCategory[]
}

export default function MenuEditor({ initialData }: { initialData: Restaurant }) {
  const [categories, setCategories] = useState(initialData.menuCategories)
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(
    initialData.menuCategories[0] || null
  )
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const handleToggleCategoryVisibility = async (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !category.isVisible }),
      })

      if (response.ok) {
        setCategories(
          categories.map((c) =>
            c.id === categoryId ? { ...c, isVisible: !c.isVisible } : c
          )
        )
      }
    } catch (error) {
      console.error('Error toggling category visibility:', error)
    }
  }

  const handleToggleItemVisibility = async (itemId: number) => {
    if (!selectedCategory) return

    const item = selectedCategory.menuItems.find((i) => i.id === itemId)
    if (!item) return

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      })

      if (response.ok) {
        setCategories(
          categories.map((c) =>
            c.id === selectedCategory.id
              ? {
                  ...c,
                  menuItems: c.menuItems.map((i) =>
                    i.id === itemId ? { ...i, isVisible: !i.isVisible } : i
                  ),
                }
              : c
          )
        )
        setSelectedCategory({
          ...selectedCategory,
          menuItems: selectedCategory.menuItems.map((i) =>
            i.id === itemId ? { ...i, isVisible: !i.isVisible } : i
          ),
        })
      }
    } catch (error) {
      console.error('Error toggling item visibility:', error)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedCategory) return
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(
          categories.map((c) =>
            c.id === selectedCategory.id
              ? {
                  ...c,
                  menuItems: c.menuItems.filter((i) => i.id !== itemId),
                }
              : c
          )
        )
        setSelectedCategory({
          ...selectedCategory,
          menuItems: selectedCategory.menuItems.filter((i) => i.id !== itemId),
        })
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menü Yönetimi</h1>
        <p className="text-gray-600">
          Kategorilerinizi ve ürünlerinizi buradan yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1 p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Kategoriler</h2>
            <Button size="sm" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'bg-red-100 text-red-900'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{category.name_tr}</h3>
                    <p className="text-xs text-gray-600">
                      {category.menuItems.length} ürün
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleCategoryVisibility(category.id)
                    }}
                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                  >
                    {category.isVisible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Items List */}
        <div className="lg:col-span-3">
          {selectedCategory ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory.name_tr}
                  </h2>
                  <p className="text-gray-600">
                    {selectedCategory.menuItems.length} ürün
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Ürün
                </Button>
              </div>

              <div className="space-y-3">
                {selectedCategory.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name_tr}
                        </h3>
                        {item.isPopular && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                            Popüler
                          </span>
                        )}
                        {item.isNew && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            Yeni
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Acı
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Vegan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {item.description_tr}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleItemVisibility(item.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        {item.isVisible ? (
                          <Eye className="w-5 h-5 text-green-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedCategory.menuItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Bu kategoride henüz ürün bulunmuyor
                    </p>
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Ürünü Ekle
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-gray-600">Lütfen bir kategori seçin</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
