import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  idParamSchema,
  updateCategorySchema,
  formatZodErrors
} from '@/lib/validations'
import { z } from 'zod'

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
    const bodyValidation = updateCategorySchema.safeParse(body)
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(bodyValidation.error) },
        { status: 400 }
      )
    }

    const category = await prisma.menuCategory.update({
      where: { id: paramValidation.data.id },
      data: bodyValidation.data,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodErrors(error) },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
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

    await prisma.menuCategory.delete({
      where: { id: paramValidation.data.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
