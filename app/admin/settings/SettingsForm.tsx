'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import QRCodeDisplay from '../QRCodeDisplay'
import { Save } from 'lucide-react'

type Restaurant = {
  id: number
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  phone: string | null
  address: string | null
  instagram: string | null
  wifiName: string | null
  wifiPassword: string | null
  languageDefault: string
  supportedLanguages: string
}

export default function SettingsForm({ initialData }: { initialData: Restaurant }) {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch(`/api/restaurant/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSaveMessage('Ayarlar başarıyla kaydedildi!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Kayıt sırasında bir hata oluştu.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveMessage('Kayıt sırasında bir hata oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${formData.slug}`

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restoran Ayarları</h1>
        <p className="text-gray-600">
          Restoran bilgilerinizi ve görünüm ayarlarınızı düzenleyin
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Temel Bilgiler</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restoran Adı
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Menü URL: /menu/{formData.slug}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
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
                  value={formData.phone || ''}
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
                  value={formData.instagram || ''}
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
                value={formData.address || ''}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* WiFi Info */}
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
                  value={formData.wifiName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="text"
                  name="wifiPassword"
                  value={formData.wifiPassword || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Colors */}
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, secondaryColor: e.target.value }))
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, accentColor: e.target.value }))
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">QR Kod</h2>
          </CardHeader>
          <CardContent>
            <QRCodeDisplay menuUrl={menuUrl} restaurantName={formData.name} />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saveMessage && (
              <p
                className={`text-sm ${
                  saveMessage.includes('başarıyla')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </div>
      </div>
    </form>
  )
}
