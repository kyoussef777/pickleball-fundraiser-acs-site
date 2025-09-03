import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/content - Get all content blocks or by key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (key) {
      // Get specific content block by key
      const content = await prisma.contentBlock.findUnique({
        where: { key }
      })
      return NextResponse.json(content)
    } else {
      // Get all content blocks
      const contents = await prisma.contentBlock.findMany({
        where: { isActive: true },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'asc' }
        ]
      })
      return NextResponse.json(contents)
    }
  } catch (error) {
    console.error('Content GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST /api/content - Create new content block
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const content = await prisma.contentBlock.create({
      data: {
        key: data.key,
        title: data.title,
        content: data.content,
        contentType: data.contentType || 'html',
        sortOrder: data.sortOrder || 0
      }
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Content POST error:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('key')) {
      return NextResponse.json({ error: 'Content key already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

// PUT /api/content - Update content block
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    const content = await prisma.contentBlock.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Content PUT error:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// DELETE /api/content - Delete content block
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.contentBlock.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}