import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { InputValidator, RateLimiter } from '@/lib/security'
import { getClientIP } from '@/lib/utils'

// GET /api/sponsors - Get all active sponsors
export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [
        { tier: 'desc' }, // PLATINUM first, then GOLD
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        website: true,
        tier: true,
        logoUrl: true,
        description: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return NextResponse.json(sponsors)
  } catch (error: unknown) {
    console.error('Sponsors GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
  }
}

// POST /api/sponsors - Create new sponsor (Admin only)
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting: 5 sponsor creations per IP per hour (admin only)
    if (!RateLimiter.isAllowed(`sponsor_${clientIP}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many sponsor creation attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const data = await request.json()
    
    // Validate and sanitize all inputs
    const name = InputValidator.sanitizeString(data.name, 100)
    const tier = InputValidator.validateSponsorTier(data.tier)
    
    // Optional fields
    const website = data.website ? InputValidator.validateUrl(data.website) : null
    const logoUrl = data.logoUrl ? InputValidator.validateUrl(data.logoUrl) : null
    const description = data.description 
      ? InputValidator.sanitizeString(data.description, 500)
      : null
    const sortOrder = data.sortOrder 
      ? InputValidator.validateNumber(data.sortOrder, 0, 999)
      : 0
    
    // Additional validation
    if (!name || name.length < 1 || !tier) {
      return NextResponse.json({ error: 'Name and tier are required' }, { status: 400 })
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        website,
        tier: tier.toUpperCase() as 'GOLD' | 'PLATINUM',
        logoUrl,
        description,
        sortOrder
      }
    })

    return NextResponse.json(sponsor, { status: 201 })
  } catch (error: unknown) {
    console.error('Sponsors POST error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
  }
}

// PUT /api/sponsors - Update sponsor (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 })
    }
    
    // Sanitize update data if provided
    const sanitizedData: Record<string, string | number | boolean> = {}
    if (updateData.name) sanitizedData.name = InputValidator.sanitizeString(updateData.name, 100)
    if (updateData.tier) sanitizedData.tier = InputValidator.validateSponsorTier(updateData.tier).toUpperCase() as 'GOLD' | 'PLATINUM'
    if (updateData.website) sanitizedData.website = InputValidator.validateUrl(updateData.website)
    if (updateData.logoUrl) sanitizedData.logoUrl = InputValidator.validateUrl(updateData.logoUrl)
    if (updateData.description) sanitizedData.description = InputValidator.sanitizeString(updateData.description, 500)
    if (updateData.sortOrder !== undefined) sanitizedData.sortOrder = InputValidator.validateNumber(updateData.sortOrder, 0, 999)
    if (updateData.isActive !== undefined) sanitizedData.isActive = InputValidator.validateBoolean(updateData.isActive)
    
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: sanitizedData
    })

    return NextResponse.json(sponsor)
  } catch (error: unknown) {
    console.error('Sponsors PUT error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
  }
}

// DELETE /api/sponsors - Delete sponsor (Admin only - soft delete by setting isActive = false)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 })
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