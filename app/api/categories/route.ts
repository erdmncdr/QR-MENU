import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  restaurantIdQuerySchema,
  createCategorySchema,
  formatZodErrors
} from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validation = restaurantIdQuerySchema.safeParse(searchParams)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const { restaurantId } = validation.data

    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        menuItems: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createCategorySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const category = await prisma.menuCategory.create({
      data: validation.data,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
