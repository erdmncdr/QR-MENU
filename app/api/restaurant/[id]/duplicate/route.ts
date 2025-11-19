import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { idParamSchema, formatZodErrors } from '@/lib/validations'

export async function POST(
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

    // Get original restaurant with all data
    const original = await prisma.restaurant.findUnique({
      where: { id: paramValidation.data.id },
      include: {
        openingHours: true,
        menuCategories: {
          include: {
            menuItems: true,
          },
        },
      },
    })

    if (!original) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Generate unique slug
    let newSlug = `${original.slug}-kopya`
    let counter = 1
    while (await prisma.restaurant.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${original.slug}-kopya-${counter}`
      counter++
    }

    // Duplicate restaurant with all relations
    const duplicate = await prisma.restaurant.create({
      data: {
        name: `${original.name} (Kopya)`,
        slug: newSlug,
        description: original.description,
        logoUrl: original.logoUrl,
        primaryColor: original.primaryColor,
        secondaryColor: original.secondaryColor,
        accentColor: original.accentColor,
        phone: original.phone,
        address: original.address,
        instagram: original.instagram,
        wifiName: original.wifiName,
        wifiPassword: original.wifiPassword,
        languageDefault: original.languageDefault,
        supportedLanguages: original.supportedLanguages,
        openingHours: {
          create: original.openingHours.map(oh => ({
            dayOfWeek: oh.dayOfWeek,
            openTime: oh.openTime,
            closeTime: oh.closeTime,
            isClosed: oh.isClosed,
          })),
        },
        menuCategories: {
          create: original.menuCategories.map(cat => ({
            slug: cat.slug,
            type: cat.type,
            order: cat.order,
            name_tr: cat.name_tr,
            name_en: cat.name_en,
            description_tr: cat.description_tr,
            description_en: cat.description_en,
            isVisible: cat.isVisible,
            icon: cat.icon,
            menuItems: {
              create: cat.menuItems.map(item => ({
                order: item.order,
                name_tr: item.name_tr,
                name_en: item.name_en,
                description_tr: item.description_tr,
                description_en: item.description_en,
                price: item.price,
                currency: item.currency,
                isPopular: item.isPopular,
                isNew: item.isNew,
                isSpicy: item.isSpicy,
                isVegan: item.isVegan,
                allergens: item.allergens,
                imageUrl: item.imageUrl,
                isVisible: item.isVisible,
              })),
            },
          })),
        },
      },
      include: {
        _count: {
          select: {
            menuCategories: true,
          },
        },
      },
    })

    return NextResponse.json(duplicate, { status: 201 })
  } catch (error) {
    console.error('Error duplicating restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate restaurant' },
      { status: 500 }
    )
  }
}
