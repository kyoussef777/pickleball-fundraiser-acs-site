import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/sponsors - Get all active sponsors
export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [
        { tier: 'desc' }, // PLATINUM first, then GOLD
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    return NextResponse.json(sponsors)
  } catch (error: unknown) {
    console.error('Sponsors GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
  }
}

// POST /api/sponsors - Create new sponsor
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const sponsor = await prisma.sponsor.create({
      data: {
        name: data.name,
        website: data.website || null,
        tier: data.tier.toUpperCase(), // Ensure uppercase for enum
        logoUrl: data.logoUrl || null,
        description: data.description || null,
        sortOrder: data.sortOrder || 0
      }
    })

    return NextResponse.json(sponsor, { status: 201 })
  } catch (error: unknown) {
    console.error('Sponsors POST error:', error)
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
  }
}

// PUT /api/sponsors - Update sponsor
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    if (updateData.tier) {
      updateData.tier = updateData.tier.toUpperCase()
    }
    
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(sponsor)
  } catch (error: unknown) {
    console.error('Sponsors PUT error:', error)
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
  }
}

// DELETE /api/sponsors - Delete sponsor (soft delete by setting isActive = false)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // Soft delete - just mark as inactive
    await prisma.sponsor.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Sponsors DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
  }
}