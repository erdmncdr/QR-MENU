import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { idParamSchema, formatZodErrors } from '@/lib/validations'
import { z } from 'zod'

const openingHourSchema = z.object({
  id: z.number(),
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  isClosed: z.boolean(),
})

const updateHoursSchema = z.object({
  hours: z.array(openingHourSchema),
})

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
    const bodyValidation = updateHoursSchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(bodyValidation.error) },
        { status: 400 }
      )
    }

    // Update each opening hour
    await Promise.all(
      bodyValidation.data.hours.map(hour =>
        prisma.openingHour.update({
          where: { id: hour.id },
          data: {
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isClosed: hour.isClosed,
          },
        })
      )
    )

    // Fetch updated hours
    const updatedHours = await prisma.openingHour.findMany({
      where: { restaurantId: paramValidation.data.id },
      orderBy: { dayOfWeek: 'asc' },
    })

    return NextResponse.json(updatedHours)
  } catch (error) {
    console.error('Error updating opening hours:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update opening hours' },
      { status: 500 }
    )
  }
}
