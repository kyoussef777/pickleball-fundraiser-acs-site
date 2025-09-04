import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { InputValidator, RateLimiter } from '@/lib/security'
import { getClientIP } from '@/lib/utils'

// GET /api/participants - Get all participants (Admin only in production)
export async function GET() {
  try {
    // In production, this should check admin authentication
    const participants = await prisma.participant.findMany({
      orderBy: { registrationDate: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        skillLevel: true,
        dietaryRestrictions: true,
        donationCompleted: true,
        registrationDate: true,
        updatedAt: true
      }
    })
    return NextResponse.json(participants)
  } catch (error: unknown) {
    console.error('Participants GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}

// POST /api/participants - Create new participant
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting: 5 registrations per IP per hour
    if (!RateLimiter.isAllowed(`participant_${clientIP}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const data = await request.json()
    
    // Validate and sanitize all inputs
    const firstName = InputValidator.validateName(data.firstName)
    const lastName = InputValidator.validateName(data.lastName)
    const email = InputValidator.validateEmail(data.email)
    const phone = InputValidator.validatePhone(data.phone)
    const skillLevel = InputValidator.validateSkillLevel(data.skillLevel)
    const dietaryRestrictions = data.dietaryRestrictions 
      ? InputValidator.sanitizeString(data.dietaryRestrictions, 500)
      : null
    
    // Additional validation
    if (!firstName || !lastName || !email || !phone || !skillLevel) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 })
    }

    const participant = await prisma.participant.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        skillLevel,
        dietaryRestrictions,
        donationCompleted: false
      }
    })

    // Don't return sensitive data
    const { id, registrationDate } = participant
    
    return NextResponse.json({ 
      success: true, 
      participant: { id, registrationDate }
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error('Participants POST error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Handle Prisma unique constraint errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 
        'meta' in error && error.meta && typeof error.meta === 'object' && 
        'target' in error.meta && Array.isArray(error.meta.target) && 
        error.meta.target.includes('email')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 })
  }
}

// PUT /api/participants - Update participant
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    const participant = await prisma.participant.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(participant)
  } catch (error: unknown) {
    console.error('Participants PUT error:', error)
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 })
  }
}

// DELETE /api/participants - Delete participant
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.participant.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Participants DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 })
  }
}