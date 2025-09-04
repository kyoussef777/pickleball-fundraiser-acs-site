import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { InputValidator, RateLimiter } from '@/lib/security'
import { getClientIP } from '@/lib/utils'

// GET /api/content - Get all content blocks or by key (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (key) {
      // Validate key parameter
      const sanitizedKey = InputValidator.sanitizeString(key, 100)
      
      // Get specific content block by key
      const content = await prisma.contentBlock.findUnique({
        where: { key: sanitizedKey },
        select: {
          id: true,
          key: true,
          title: true,
          content: true,
          contentType: true,
          sortOrder: true,
          isActive: true,
          updatedAt: true
        }
      })
      return NextResponse.json(content)
    } else {
      // Get all active content blocks
      const contents = await prisma.contentBlock.findMany({
        where: { isActive: true },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'asc' }
        ],
        select: {
          id: true,
          key: true,
          title: true,
          content: true,
          contentType: true,
          sortOrder: true,
          isActive: true,
          updatedAt: true
        }
      })
      return NextResponse.json(contents)
    }
  } catch (error: unknown) {
    console.error('Content GET error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// POST /api/content - Create new content block (Admin only)
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Rate limiting: 5 content creations per IP per hour (admin only)
    if (!RateLimiter.isAllowed(`content_${clientIP}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many content creation attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const data = await request.json()
    
    // Validate and sanitize all inputs
    const key = InputValidator.sanitizeString(data.key, 50)
    const title = InputValidator.sanitizeString(data.title, 200)
    const content = InputValidator.sanitizeString(data.content, 10000) // Allow longer content
    const contentType = data.contentType ? InputValidator.sanitizeString(data.contentType, 20) : 'html'
    const sortOrder = data.sortOrder !== undefined ? InputValidator.validateNumber(data.sortOrder, 0, 999) : 0
    
    // Additional validation
    if (!key || !title || !content) {
      return NextResponse.json({ error: 'Key, title, and content are required' }, { status: 400 })
    }
    
    // Validate content type
    const validContentTypes = ['html', 'markdown', 'text']
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const contentBlock = await prisma.contentBlock.create({
      data: {
        key,
        title,
        content,
        contentType,
        sortOrder
      }
    })

    return NextResponse.json(contentBlock, { status: 201 })
  } catch (error: unknown) {
    console.error('Content POST error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    // Handle unique constraint errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 
        'meta' in error && error.meta && typeof error.meta === 'object' && 
        'target' in error.meta && Array.isArray(error.meta.target) && 
        error.meta.target.includes('key')) {
      return NextResponse.json({ error: 'Content key already exists' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

// PUT /api/content - Update content block (Admin only)
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
    if (updateData.key) sanitizedData.key = InputValidator.sanitizeString(updateData.key, 50)
    if (updateData.title) sanitizedData.title = InputValidator.sanitizeString(updateData.title, 200)
    if (updateData.content) sanitizedData.content = InputValidator.sanitizeString(updateData.content, 10000)
    if (updateData.contentType) {
      const contentType = InputValidator.sanitizeString(updateData.contentType, 20)
      const validContentTypes = ['html', 'markdown', 'text']
      if (!validContentTypes.includes(contentType)) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
      }
      sanitizedData.contentType = contentType
    }
    if (updateData.sortOrder !== undefined) sanitizedData.sortOrder = InputValidator.validateNumber(updateData.sortOrder, 0, 999)
    if (updateData.isActive !== undefined) sanitizedData.isActive = InputValidator.validateBoolean(updateData.isActive)
    
    const content = await prisma.contentBlock.update({
      where: { id },
      data: sanitizedData
    })

    return NextResponse.json(content)
  } catch (error: unknown) {
    console.error('Content PUT error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// DELETE /api/content - Delete content block (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid ID required' }, { status: 400 })
    }

    await prisma.contentBlock.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Content DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}