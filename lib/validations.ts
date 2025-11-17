import { z } from 'zod'

/**
 * Validation schemas for API requests
 */

// Category schemas
export const createCategorySchema = z.object({
  restaurantId: z.number().int().positive(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  type: z.enum(['food', 'drink']),
  order: z.number().int().nonnegative().default(0),
  name_tr: z.string().min(1).max(200),
  name_en: z.string().max(200).nullable().optional(),
  description_tr: z.string().max(500).nullable().optional(),
  description_en: z.string().max(500).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  isVisible: z.boolean().default(true),
})

export const updateCategorySchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  type: z.enum(['food', 'drink']).optional(),
  order: z.number().int().nonnegative().optional(),
  name_tr: z.string().min(1).max(200).optional(),
  name_en: z.string().max(200).nullable().optional(),
  description_tr: z.string().max(500).nullable().optional(),
  description_en: z.string().max(500).nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  isVisible: z.boolean().optional(),
})

// Menu Item schemas
export const createMenuItemSchema = z.object({
  categoryId: z.number().int().positive(),
  order: z.number().int().nonnegative().default(0),
  name_tr: z.string().min(1).max(200),
  name_en: z.string().max(200).nullable().optional(),
  description_tr: z.string().max(1000).nullable().optional(),
  description_en: z.string().max(1000).nullable().optional(),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default('TRY'),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  allergens: z.string().max(500).default(''),
  imageUrl: z.string().url().nullable().optional(),
  isVisible: z.boolean().default(true),
})

export const updateMenuItemSchema = z.object({
  order: z.number().int().nonnegative().optional(),
  name_tr: z.string().min(1).max(200).optional(),
  name_en: z.string().max(200).nullable().optional(),
  description_tr: z.string().max(1000).nullable().optional(),
  description_en: z.string().max(1000).nullable().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  allergens: z.string().max(500).optional(),
  imageUrl: z.string().url().nullable().optional(),
  isVisible: z.boolean().optional(),
})

// Restaurant schemas
export const updateRestaurantSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(1000).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  phone: z.string().max(20).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  instagram: z.string().max(50).nullable().optional(),
  wifiName: z.string().max(100).nullable().optional(),
  wifiPassword: z.string().max(100).nullable().optional(),
  languageDefault: z.enum(['tr', 'en']).optional(),
  supportedLanguages: z.string().optional(),
})

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
})

// Query parameter validation
export const restaurantIdQuerySchema = z.object({
  restaurantId: z.string().regex(/^\d+$/, 'Restaurant ID must be a number').transform(Number),
})

export const categoryIdQuerySchema = z.object({
  categoryId: z.string().regex(/^\d+$/, 'Category ID must be a number').transform(Number),
})

/**
 * Validation error response type
 */
export type ValidationError = {
  field: string
  message: string
}

/**
 * Format Zod errors to user-friendly format
 */
export function formatZodErrors(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
}
