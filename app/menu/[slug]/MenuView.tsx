'use client'

import { useState, useEffect } from 'react'
import {
  MapPin,
  Phone,
  Instagram,
  Wifi,
  Clock,
  Flame,
  Leaf,
  Sparkles,
  TrendingUp,
  Languages
} from 'lucide-react'
import Image from 'next/image'
import { formatPrice, getDayName, getTodayOpeningHours, parseAllergens, getAllergenLabel } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

type Language = 'tr' | 'en'

interface Restaurant {
  id: number
  name: string
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
  openingHours: OpeningHour[]
  menuCategories: MenuCategory[]
}

interface OpeningHour {
  id: number
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}

interface MenuCategory {
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

interface MenuItem {
  id: number
  order: number
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
}

export default function MenuView({ restaurant }: { restaurant: Restaurant }) {
  const [lang, setLang] = useState<Language>('tr')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const getName = (item: { name_tr: string; name_en: string | null }) => {
    return lang === 'en' && item.name_en ? item.name_en : item.name_tr
  }

  const getDescription = (item: { description_tr: string | null; description_en: string | null }) => {
    return lang === 'en' && item.description_en ? item.description_en : item.description_tr
  }

  const todayHours = getTodayOpeningHours(restaurant.openingHours)

  const scrollToCategory = (categorySlug: string) => {
    setActiveCategory(categorySlug)
    if (categorySlug === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(`category-${categorySlug}`)
      if (element) {
        const offset = 120
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' })
      }
    }
  }

  const foodCategories = restaurant.menuCategories.filter(c => c.type === 'food')
  const drinkCategories = restaurant.menuCategories.filter(c => c.type === 'drink')

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      style={{
        '--primary-color': restaurant.primaryColor,
        '--secondary-color': restaurant.secondaryColor,
        '--accent-color': restaurant.accentColor,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {restaurant.logoUrl ? (
                <Image
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: restaurant.primaryColor }}
                >
                  {restaurant.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
                {todayHours && !todayHours.isClosed && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {todayHours.openTime} - {todayHours.closeTime}
                  </p>
                )}
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="font-medium text-sm">{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurant.address && (
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {lang === 'tr' ? 'Adres' : 'Address'}
                  </h3>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                </div>
              </div>
            </Card>
          )}

          {restaurant.phone && (
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {lang === 'tr' ? 'Telefon' : 'Phone'}
                  </h3>
                  <a href={`tel:${restaurant.phone}`} className="text-sm text-blue-600 hover:underline">
                    {restaurant.phone}
                  </a>
                </div>
              </div>
            </Card>
          )}

          {restaurant.instagram && (
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Instagram className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Instagram</h3>
                  <a
                    href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {restaurant.instagram}
                  </a>
                </div>
              </div>
            </Card>
          )}

          {restaurant.wifiName && (
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <Wifi className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">WiFi</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{lang === 'tr' ? 'Ağ' : 'Network'}:</span> {restaurant.wifiName}
                  </p>
                  {restaurant.wifiPassword && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{lang === 'tr' ? 'Şifre' : 'Password'}:</span> {restaurant.wifiPassword}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[73px] bg-white shadow-sm z-40 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            <CategoryPill
              label={lang === 'tr' ? 'Tümü' : 'All'}
              active={activeCategory === 'all'}
              onClick={() => scrollToCategory('all')}
              color={restaurant.primaryColor}
            />
            {foodCategories.length > 0 && (
              <CategoryPill
                label={lang === 'tr' ? 'Yemek' : 'Food'}
                active={activeCategory === 'food'}
                onClick={() => scrollToCategory(foodCategories[0].slug)}
                color={restaurant.primaryColor}
              />
            )}
            {drinkCategories.length > 0 && (
              <CategoryPill
                label={lang === 'tr' ? 'İçecek' : 'Drinks'}
                active={activeCategory === 'drink'}
                onClick={() => scrollToCategory(drinkCategories[0].slug)}
                color={restaurant.primaryColor}
              />
            )}
            <div className="h-6 w-px bg-gray-300 mx-2" />
            {restaurant.menuCategories.map((category) => (
              <CategoryPill
                key={category.id}
                label={getName(category)}
                active={activeCategory === category.slug}
                onClick={() => scrollToCategory(category.slug)}
                color={restaurant.primaryColor}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Categories */}
      <main className="container mx-auto px-4 py-8">
        {restaurant.menuCategories.map((category) => (
          <section key={category.id} id={`category-${category.slug}`} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {getName(category)}
              </h2>
              {getDescription(category) && (
                <p className="text-gray-600">{getDescription(category)}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  primaryColor={restaurant.primaryColor}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

function CategoryPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      style={active ? { backgroundColor: color } : {}}
    >
      {label}
    </button>
  )
}

function MenuItemCard({
  item,
  lang,
  primaryColor,
}: {
  item: MenuItem
  lang: Language
  primaryColor: string
}) {
  const getName = (item: { name_tr: string; name_en: string | null }) => {
    return lang === 'en' && item.name_en ? item.name_en : item.name_tr
  }

  const getDescription = (item: { description_tr: string | null; description_en: string | null }) => {
    return lang === 'en' && item.description_en ? item.description_en : item.description_tr
  }

  const allergens = parseAllergens(item.allergens)

  return (
    <Card hover className="overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{getName(item)}</h3>
            <span className="text-lg font-bold text-gray-900 ml-4 whitespace-nowrap">
              {formatPrice(item.price, item.currency)}
            </span>
          </div>

          {getDescription(item) && (
            <p className="text-sm text-gray-600 mb-3">{getDescription(item)}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {item.isPopular && (
              <Badge
                icon={<TrendingUp className="w-3 h-3" />}
                label={lang === 'tr' ? 'Çok Satan' : 'Popular'}
                color="#F59E0B"
              />
            )}
            {item.isNew && (
              <Badge
                icon={<Sparkles className="w-3 h-3" />}
                label={lang === 'tr' ? 'Yeni' : 'New'}
                color={primaryColor}
              />
            )}
            {item.isSpicy && (
              <Badge
                icon={<Flame className="w-3 h-3" />}
                label={lang === 'tr' ? 'Acı' : 'Spicy'}
                color="#EF4444"
              />
            )}
            {item.isVegan && (
              <Badge
                icon={<Leaf className="w-3 h-3" />}
                label={lang === 'tr' ? 'Vegan' : 'Vegan'}
                color="#10B981"
              />
            )}
          </div>

          {allergens.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-medium">{lang === 'tr' ? 'Alerjenler' : 'Allergens'}:</span>{' '}
                {allergens.map((a) => getAllergenLabel(a, lang)).join(', ')}
              </p>
            </div>
          )}
        </div>

        {item.imageUrl && (
          <div className="w-32 h-32 flex-shrink-0 relative">
            <Image
              src={item.imageUrl}
              alt={getName(item)}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

function Badge({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <span
      className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {icon}
      <span>{label}</span>
    </span>
  )
}
