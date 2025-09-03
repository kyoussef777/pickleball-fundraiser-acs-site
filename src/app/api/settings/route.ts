import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/settings - Get event settings
export async function GET() {
  try {
    let settings = await prisma.eventSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
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
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error: unknown) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/settings - Update event settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Get existing settings or create new ones
    let settings = await prisma.eventSettings.findFirst()
    
    if (settings) {
      settings = await prisma.eventSettings.update({
        where: { id: settings.id },
        data: {
          eventDate: new Date(data.eventDate),
          eventTime: data.eventTime,
          venue: data.venue,
          acsLink: data.acsLink,
          venmoHandle: data.venmoHandle,
          maxParticipants: parseInt(data.maxParticipants),
          registrationOpen: data.registrationOpen
        }
      })
    } else {
      settings = await prisma.eventSettings.create({
        data: {
          eventDate: new Date(data.eventDate),
          eventTime: data.eventTime,
          venue: data.venue,
          acsLink: data.acsLink,
          venmoHandle: data.venmoHandle,
          maxParticipants: parseInt(data.maxParticipants),
          registrationOpen: data.registrationOpen
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error: unknown) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}