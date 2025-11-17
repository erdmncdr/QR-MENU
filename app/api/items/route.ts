import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  categoryIdQuerySchema,
  createMenuItemSchema,
  formatZodErrors
} from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validation = categoryIdQuerySchema.safeParse(searchParams)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const { categoryId } = validation.data

    const items = await prisma.menuItem.findMany({
      where: { categoryId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createMenuItemSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const item = await prisma.menuItem.create({
      data: validation.data,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
