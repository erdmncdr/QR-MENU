'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Save, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { getDayName } from '@/lib/utils'

type OpeningHour = {
  id: number
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}

export default function OpeningHoursManager({
  restaurantId,
  initialHours
}: {
  restaurantId: number
  initialHours: OpeningHour[]
}) {
  const [hours, setHours] = useState(initialHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek))
  const [isSaving, setIsSaving] = useState(false)

  const handleToggleClosed = (dayOfWeek: number) => {
    setHours(hours.map(h =>
      h.dayOfWeek === dayOfWeek ? { ...h, isClosed: !h.isClosed } : h
    ))
  }

  const handleTimeChange = (dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setHours(hours.map(h =>
      h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const toastId = toast.loading('Çalışma saatleri kaydediliyor...')

    try {
      const response = await fetch(`/api/restaurant/${restaurantId}/hours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Kayıt başarısız')
      }

      toast.success('Çalışma saatleri güncellendi!', { id: toastId })
    } catch (error) {
      console.error('Error saving hours:', error)
      toast.error(error instanceof Error ? error.message : 'Kayıt başarısız', { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyToAll = (dayOfWeek: number) => {
    const source = hours.find(h => h.dayOfWeek === dayOfWeek)
    if (!source || source.isClosed) return

    if (confirm(`${getDayName(dayOfWeek)} saatlerini tüm günlere kopyalamak istediğinizden emin misiniz?`)) {
      setHours(hours.map(h => ({
        ...h,
        openTime: source.openTime,
        closeTime: source.closeTime,
        isClosed: false,
      })))
    }
  }

  const handleSetWeekdayHours = () => {
    setHours(hours.map(h => {
      // Monday to Friday (1-5)
      if (h.dayOfWeek >= 1 && h.dayOfWeek <= 5) {
        return { ...h, openTime: '09:00', closeTime: '18:00', isClosed: false }
      }
      // Weekend (0, 6)
      return { ...h, openTime: '10:00', closeTime: '16:00', isClosed: false }
    }))
    toast.success('Hafta içi/hafta sonu saatleri ayarlandı')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Çalışma Saatleri</h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleSetWeekdayHours}>
              Hızlı Ayarla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hours.map((hour) => (
              <div
                key={hour.dayOfWeek}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-28 flex items-center">
                  <input
                    type="checkbox"
                    checked={!hour.isClosed}
                    onChange={() => handleToggleClosed(hour.dayOfWeek)}
                    className="mr-2"
                  />
                  <span className="font-medium text-gray-900">
                    {getDayName(hour.dayOfWeek, 'tr')}
                  </span>
                </div>

                {hour.isClosed ? (
                  <div className="flex-1 text-gray-500 italic">Kapalı</div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hour.openTime}
                        onChange={(e) => handleTimeChange(hour.dayOfWeek, 'openTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <span className="text-gray-600">-</span>
                      <input
                        type="time"
                        value={hour.closeTime}
                        onChange={(e) => handleTimeChange(hour.dayOfWeek, 'closeTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToAll(hour.dayOfWeek)}
                    >
                      Tüm günlere kopyala
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </div>
  )
}
