import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'TRY'): string {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(price)
}

export function getDayName(dayOfWeek: number, lang: 'tr' | 'en' = 'tr'): string {
  const daysTr = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (lang === 'en') {
    return daysEn[dayOfWeek] || ''
  }
  return daysTr[dayOfWeek] || ''
}

export function getTodayOpeningHours(openingHours: any[]) {
  const today = new Date().getDay()
  return openingHours.find((h) => h.dayOfWeek === today)
}

export function parseAllergens(allergens: string): string[] {
  if (!allergens) return []
  return allergens.split(',').filter(Boolean)
}

export function getAllergenLabel(allergen: string, lang: 'tr' | 'en' = 'tr'): string {
  const labels: Record<string, { tr: string; en: string }> = {
    gluten: { tr: 'Glüten', en: 'Gluten' },
    milk: { tr: 'Süt', en: 'Milk' },
    eggs: { tr: 'Yumurta', en: 'Eggs' },
    fish: { tr: 'Balık', en: 'Fish' },
    shellfish: { tr: 'Kabuklu Deniz Ürünleri', en: 'Shellfish' },
    nuts: { tr: 'Fındık/Ceviz', en: 'Nuts' },
    peanuts: { tr: 'Yer Fıstığı', en: 'Peanuts' },
    soy: { tr: 'Soya', en: 'Soy' },
    sulfites: { tr: 'Sülfitler', en: 'Sulfites' },
  }

  return labels[allergen]?.[lang] || allergen
}
