import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { InputValidator, RateLimiter } from '@/lib/security'

function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}

// GET /api/volunteers - Get all volunteers (Admin only in production)
export async function GET(request: NextRequest) {
  try {
    // In production, this should check admin authentication
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { registrationDate: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        availability: true,
        roles: true,
        experience: true,
        registrationDate: true,
        updatedAt: true
      }
    })
    return NextResponse.json(volunteers)
  } catch (error: unknown) {
    console.error('Volunteers GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
  }
}

// POST /api/volunteers - Create new volunteer
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting: 3 volunteer registrations per IP per hour
    if (!RateLimiter.isAllowed(`volunteer_${clientIP}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many volunteer registration attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const data = await request.json()
    
    // Validate and sanitize all inputs
    const firstName = InputValidator.validateName(data.firstName)
    const lastName = InputValidator.validateName(data.lastName)
    const email = InputValidator.validateEmail(data.email)
    const phone = InputValidator.validatePhone(data.phone)
    
    // Validate arrays
    const availability = InputValidator.validateArray(data.availability, 7) // Max 7 days
    const roles = InputValidator.validateArray(data.roles, 5) // Max 5 roles
    
    // Optional fields
    const experience = data.experience 
      ? InputValidator.sanitizeString(data.experience, 500)
      : null
    const additionalInfo = data.additionalInfo 
      ? InputValidator.sanitizeString(data.additionalInfo, 1000)
      : null
    
    // Additional validation
    if (!firstName || !lastName || !email || !phone || 
        !availability || availability.length === 0 || !roles || roles.length === 0) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 })
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        availability,
        roles,
        experience,
        additionalInfo
      }
    })

    // Don't return sensitive data
    const { id, registrationDate, updatedAt, ...safeVolunteer } = volunteer
    
    return NextResponse.json({ 
      success: true, 
      volunteer: { id, registrationDate }
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error('Volunteers POST error:', error)
    
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
    
    return NextResponse.json({ error: 'Failed to create volunteer' }, { status: 500 })
  }
}

// PUT /api/volunteers - Update volunteer
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 })
    }
    
    // Sanitize update data if provided
    const sanitizedData: any = {}
    if (updateData.firstName) sanitizedData.firstName = InputValidator.validateName(updateData.firstName)
    if (updateData.lastName) sanitizedData.lastName = InputValidator.validateName(updateData.lastName)
    if (updateData.email) sanitizedData.email = InputValidator.validateEmail(updateData.email)
    if (updateData.phone) sanitizedData.phone = InputValidator.validatePhone(updateData.phone)
    if (updateData.availability) sanitizedData.availability = InputValidator.validateArray(updateData.availability, 7)
    if (updateData.roles) sanitizedData.roles = InputValidator.validateArray(updateData.roles, 5)
    if (updateData.experience) sanitizedData.experience = InputValidator.sanitizeString(updateData.experience, 500)
    if (updateData.additionalInfo) sanitizedData.additionalInfo = InputValidator.sanitizeString(updateData.additionalInfo, 1000)
    
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: sanitizedData
    })

    return NextResponse.json(volunteer)
  } catch (error: unknown) {
    console.error('Volunteers PUT error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update volunteer' }, { status: 500 })
  }
}

// DELETE /api/volunteers - Delete volunteer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 })
    }

    await prisma.volunteer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Volunteers DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 })
  }
}