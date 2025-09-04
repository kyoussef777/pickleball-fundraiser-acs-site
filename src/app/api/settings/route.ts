import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { InputValidator, RateLimiter } from '@/lib/security'
import { getClientIP } from '@/lib/utils'

// GET /api/settings - Get event settings (public)
export async function GET() {
  try {
    let settings = await prisma.eventSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        eventDate: true,
        eventTime: true,
        venue: true,
        acsLink: true,
        venmoHandle: true,
        maxParticipants: true,
        registrationOpen: true,
        updatedAt: true
      }
    })

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          eventDate: new Date('2024-09-27'),
          eventTime: '5:00 PM - 10:00 PM',
          venue: 'Pickleball HQ, New Jersey',
          acsLink: 'https://www.cancer.org/involved/donate.html',
          venmoHandle: '@EventOrganizer',
          maxParticipants: 64,
          registrationOpen: true
        },
        select: {
          id: true,
          eventDate: true,
          eventTime: true,
          venue: true,
          acsLink: true,
          venmoHandle: true,
          maxParticipants: true,
          registrationOpen: true,
          updatedAt: true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error: unknown) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/settings - Update event settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting: 10 settings updates per IP per hour (admin only)
    if (!RateLimiter.isAllowed(`settings_${clientIP}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many settings update attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const data = await request.json()
    
    // Validate and sanitize all inputs
    const eventDate = InputValidator.validateDate(data.eventDate)
    const eventTime = InputValidator.sanitizeString(data.eventTime, 50)
    const venue = InputValidator.sanitizeString(data.venue, 200)
    const acsLink = InputValidator.validateUrl(data.acsLink)
    const venmoHandle = InputValidator.sanitizeString(data.venmoHandle, 50)
    const maxParticipants = InputValidator.validateNumber(data.maxParticipants, 1, 1000)
    const registrationOpen = InputValidator.validateBoolean(data.registrationOpen)
    
    // Additional validation
    if (!eventDate || !eventTime || !venue || !acsLink || !venmoHandle) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 })
    }
    
    // Get existing settings or create new ones
    let settings = await prisma.eventSettings.findFirst()
    
    const settingsData = {
      eventDate: new Date(eventDate),
      eventTime,
      venue,
      acsLink,
      venmoHandle,
      maxParticipants,
      registrationOpen
    }
    
    if (settings) {
      settings = await prisma.eventSettings.update({
        where: { id: settings.id },
        data: settingsData
      })
    } else {
      settings = await prisma.eventSettings.create({
        data: settingsData
      })
    }

    return NextResponse.json(settings)
  } catch (error: unknown) {
    console.error('Settings PUT error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}