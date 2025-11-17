import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = parseInt(params.id)

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const restaurantId = parseInt(params.id)

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: body,
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 })
  }
}
