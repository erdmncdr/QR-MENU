import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  idParamSchema,
  updateRestaurantSchema,
  formatZodErrors
} from '@/lib/validations'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const paramValidation = idParamSchema.safeParse(params)
    if (!paramValidation.success) {
      return NextResponse.json(
        { error: 'Invalid ID', details: formatZodErrors(paramValidation.error) },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: paramValidation.data.id },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const paramValidation = idParamSchema.safeParse(params)
    if (!paramValidation.success) {
      return NextResponse.json(
        { error: 'Invalid ID', details: formatZodErrors(paramValidation.error) },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate request body
    const bodyValidation = updateRestaurantSchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(bodyValidation.error) },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: paramValidation.data.id },
      data: bodyValidation.data,
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error updating restaurant:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const paramValidation = idParamSchema.safeParse(params)
    if (!paramValidation.success) {
      return NextResponse.json(
        { error: 'Invalid ID', details: formatZodErrors(paramValidation.error) },
        { status: 400 }
      )
    }

    // Delete restaurant (cascades to categories, items, opening hours)
    await prisma.restaurant.delete({
      where: { id: paramValidation.data.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
}
