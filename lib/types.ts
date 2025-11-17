/**
 * API Response Types
 */

import { Restaurant, MenuCategory, MenuItem, OpeningHour } from '@prisma/client'

// API Response Wrappers
export interface ApiResponse<T> {
  data: T
  success: boolean
}

export interface ApiErrorResponse {
  error: string
  statusCode: number
  details?: unknown
}

// Extended Types with Relations
export type RestaurantWithRelations = Restaurant & {
  openingHours: OpeningHour[]
  menuCategories: MenuCategoryWithItems[]
}

export type MenuCategoryWithItems = MenuCategory & {
  menuItems: MenuItem[]
}

// API Request Types
export interface CreateCategoryRequest {
  restaurantId: number
  slug: string
  type: 'food' | 'drink'
  order?: number
  name_tr: string
  name_en?: string | null
  description_tr?: string | null
  description_en?: string | null
  icon?: string | null
  isVisible?: boolean
}

export interface UpdateCategoryRequest {
  slug?: string
  type?: 'food' | 'drink'
  order?: number
  name_tr?: string
  name_en?: string | null
  description_tr?: string | null
  description_en?: string | null
  icon?: string | null
  isVisible?: boolean
}

export interface CreateMenuItemRequest {
  categoryId: number
  order?: number
  name_tr: string
  name_en?: string | null
  description_tr?: string | null
  description_en?: string | null
  price: number
  currency?: string
  isPopular?: boolean
  isNew?: boolean
  isSpicy?: boolean
  isVegan?: boolean
  allergens?: string
  imageUrl?: string | null
  isVisible?: boolean
}

export interface UpdateMenuItemRequest {
  order?: number
  name_tr?: string
  name_en?: string | null
  description_tr?: string | null
  description_en?: string | null
  price?: number
  currency?: string
  isPopular?: boolean
  isNew?: boolean
  isSpicy?: boolean
  isVegan?: boolean
  allergens?: string
  imageUrl?: string | null
  isVisible?: boolean
}

export interface UpdateRestaurantRequest {
  name?: string
  slug?: string
  description?: string | null
  logoUrl?: string | null
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  phone?: string | null
  address?: string | null
  instagram?: string | null
  wifiName?: string | null
  wifiPassword?: string | null
  languageDefault?: 'tr' | 'en'
  supportedLanguages?: string
}

// Frontend Types
export type Language = 'tr' | 'en'

export interface MenuFilters {
  category?: string
  type?: 'food' | 'drink'
  search?: string
}

// Prisma re-exports for convenience
export type { Restaurant, MenuCategory, MenuItem, OpeningHour }
