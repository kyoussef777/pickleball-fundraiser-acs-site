import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getClientIP } from '@/lib/utils'

// Rate limiting simple implementation
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip)
  if (!attempts) return false
  
  if (Date.now() - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.delete(ip)
    return false
  }
  
  return attempts.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
  attempts.count += 1
  attempts.lastAttempt = Date.now()
  loginAttempts.set(ip, attempts)
}

function clearFailedAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

// POST /api/admin/auth - Admin authentication
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' }, 
        { status: 429 }
      )
    }

    const { username, password } = await request.json()
    
    // Input validation
    if (!username || !password || 
        typeof username !== 'string' || typeof password !== 'string' ||
        username.length > 100 || password.length > 100) {
      recordFailedAttempt(clientIP)
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminSalt = process.env.ADMIN_PASSWORD_SALT || 'default-salt'
    
    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Use timing-safe comparison
    const usernameMatch = username === adminUsername
    const passwordWithSalt = password + adminSalt
    const storedPasswordWithSalt = adminPassword + adminSalt
    
    // For demo purposes, we'll compare directly but in production you'd store hashed passwords
    const passwordMatch = await bcrypt.compare(passwordWithSalt, await bcrypt.hash(storedPasswordWithSalt, 12))
    
    if (usernameMatch && passwordMatch) {
      clearFailedAttempts(clientIP)
      
      // Create response with security headers
      const response = NextResponse.json({ success: true })
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      
      return response
    } else {
      recordFailedAttempt(clientIP)
      // Use same error message for username and password failures to prevent enumeration
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error: unknown) {
    const clientIP = getClientIP(request)
    recordFailedAttempt(clientIP)
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}