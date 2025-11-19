import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/validations'

const createRestaurantSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  instagram: z.string().max(50).optional(),
  wifiName: z.string().max(100).optional(),
  wifiPassword: z.string().max(100).optional(),
  languageDefault: z.enum(['tr', 'en']),
  supportedLanguages: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createRestaurantSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.restaurant.findUnique({
      where: { slug: validation.data.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu URL zaten kullanılıyor. Farklı bir URL deneyin.' },
        { status: 409 }
      )
    }

    // Create restaurant with default opening hours
    const restaurant = await prisma.restaurant.create({
      data: {
        ...validation.data,
        openingHours: {
          create: [
            { dayOfWeek: 0, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Sunday
            { dayOfWeek: 1, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Monday
            { dayOfWeek: 2, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Tuesday
            { dayOfWeek: 3, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Wednesday
            { dayOfWeek: 4, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Thursday
            { dayOfWeek: 5, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Friday
            { dayOfWeek: 6, openTime: '09:00', closeTime: '23:00', isClosed: false }, // Saturday
          ],
        },
      },
      include: {
        openingHours: true,
      },
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Error creating restaurant:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
