'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Restaurant = {
  id?: number
  name: string
  slug: string
  description: string
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  phone: string
  address: string
  instagram: string
  wifiName: string
  wifiPassword: string
  languageDefault: string
  supportedLanguages: string
}

export default function RestaurantForm({ initialData }: { initialData?: Partial<Restaurant> }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    primaryColor: '#DC2626',
    secondaryColor: '#991B1B',
    accentColor: '#F87171',
    phone: '',
    address: '',
    instagram: '',
    wifiName: '',
    wifiPassword: '',
    languageDefault: 'tr',
    supportedLanguages: 'tr,en',
    ...initialData,
  })

  const isEdit = !!initialData?.id

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === 'name' && !isEdit) {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const toastId = toast.loading(isEdit ? 'Restoran güncelleniyor...' : 'Restoran oluşturuluyor...')

    try {
      const url = isEdit ? `/api/restaurant/${initialData?.id}` : '/api/restaurant'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'İşlem başarısız')
      }

      const restaurant = await response.json()

      toast.success(isEdit ? 'Restoran güncellendi!' : 'Restoran oluşturuldu!', { id: toastId })

      // Redirect to restaurants list or settings page
      if (isEdit) {
        router.push(`/admin/restaurants/${restaurant.id}`)
      } else {
        router.push('/admin/restaurants')
      }
    } catch (error) {
      console.error('Error saving restaurant:', error)
      toast.error(error instanceof Error ? error.message : 'İşlem başarısız', { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <Link href="/admin/restaurants">
          <Button type="button" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Temel Bilgiler */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Temel Bilgiler</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restoran Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  placeholder="Örn: Lezzet Durağı Cafe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (Slug) *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  pattern="[a-z0-9-]+"
                  placeholder="lezzet-duragi-cafe"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Menü URL: /menu/{formData.slug || 'restoran-adi'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Restoranınız hakkında kısa bir açıklama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* İletişim Bilgileri */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+90 212 555 0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="@restoraniniz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tam adresiniz"
              />
            </div>
          </CardContent>
        </Card>

        {/* WiFi Bilgileri */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">WiFi Bilgileri</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ağ Adı
                </label>
                <input
                  type="text"
                  name="wifiName"
                  value={formData.wifiName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="WiFi_Adi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="text"
                  name="wifiPassword"
                  value={formData.wifiPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="********"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tema Renkleri */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Tema Renkleri</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Renk
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İkincil Renk
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vurgu Renk
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dil Ayarları */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Dil Ayarları</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Dil
                </label>
                <select
                  name="languageDefault"
                  value={formData.languageDefault}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desteklenen Diller
                </label>
                <input
                  type="text"
                  name="supportedLanguages"
                  value={formData.supportedLanguages}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="tr,en"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Virgülle ayırarak yazın: tr,en
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kaydet Butonu */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/admin/restaurants">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Restoran Oluştur'}
          </Button>
        </div>
      </div>
    </form>
  )
}
