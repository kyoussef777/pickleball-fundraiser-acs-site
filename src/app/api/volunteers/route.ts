import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/volunteers - Get all volunteers
export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { registrationDate: 'desc' }
    })
    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('Volunteers GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
  }
}

// POST /api/volunteers - Create new volunteer
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const volunteer = await prisma.volunteer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        availability: data.availability,
        roles: data.roles,
        experience: data.experience || null,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        additionalInfo: data.additionalInfo || null
      }
    })

    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.error('Volunteers POST error:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
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
    
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error('Volunteers PUT error:', error)
    return NextResponse.json({ error: 'Failed to update volunteer' }, { status: 500 })
  }
}

// DELETE /api/volunteers - Delete volunteer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.volunteer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Volunteers DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete volunteer' }, { status: 500 })
  }
}