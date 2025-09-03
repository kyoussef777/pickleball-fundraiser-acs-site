import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/participants - Get all participants
export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { registrationDate: 'desc' }
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
    const data = await request.json()
    
    const participant = await prisma.participant.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        skillLevel: data.skillLevel,
        dietaryRestrictions: data.dietaryRestrictions || null,
        donationCompleted: false
      }
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error: unknown) {
    console.error('Participants POST error:', error)
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