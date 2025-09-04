// Security utilities for input validation and sanitization

export class InputValidator {
  static sanitizeString(input: unknown, maxLength = 255): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string')
    }
    
    // Remove potential XSS characters and limit length
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .substring(0, maxLength)
      .trim()
  }

  static validateEmail(email: unknown): string {
    if (typeof email !== 'string') {
      throw new Error('Email must be a string')
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sanitizedEmail = this.sanitizeString(email, 100).toLowerCase()
    
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error('Invalid email format')
    }
    
    return sanitizedEmail
  }

  static validatePhone(phone: unknown): string {
    if (typeof phone !== 'string') {
      throw new Error('Phone must be a string')
    }
    
    // Allow only numbers, spaces, dashes, parentheses, and plus sign
    const phoneRegex = /^[\d\s\-\(\)\+]+$/
    const sanitizedPhone = this.sanitizeString(phone, 20)
    
    if (!phoneRegex.test(sanitizedPhone) || sanitizedPhone.length < 10) {
      throw new Error('Invalid phone format')
    }
    
    return sanitizedPhone
  }

  static validateName(name: unknown): string {
    if (typeof name !== 'string') {
      throw new Error('Name must be a string')
    }
    
    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/
    const sanitizedName = this.sanitizeString(name, 50)
    
    if (!nameRegex.test(sanitizedName) || sanitizedName.length < 1) {
      throw new Error('Invalid name format')
    }
    
    return sanitizedName
  }

  static validateArray(arr: unknown, maxItems = 10): string[] {
    if (!Array.isArray(arr)) {
      throw new Error('Input must be an array')
    }
    
    if (arr.length > maxItems) {
      throw new Error(`Array cannot exceed ${maxItems} items`)
    }
    
    return arr.map(item => this.sanitizeString(item, 100))
  }

  static validateSkillLevel(skillLevel: unknown): string {
    const validSkills = ['beginner', 'intermediate', 'advanced', 'expert', 'first-time']
    const sanitized = this.sanitizeString(skillLevel, 20).toLowerCase()
    
    if (!validSkills.includes(sanitized)) {
      throw new Error('Invalid skill level')
    }
    
    return sanitized
  }

  static validateSponsorTier(tier: unknown): string {
    const validTiers = ['gold', 'platinum']
    const sanitized = this.sanitizeString(tier, 20).toLowerCase()
    
    if (!validTiers.includes(sanitized)) {
      throw new Error('Invalid sponsor tier')
    }
    
    return sanitized
  }

  static validateUrl(url: unknown): string {
    if (typeof url !== 'string') {
      throw new Error('URL must be a string')
    }
    
    try {
      const parsedUrl = new URL(url)
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid URL protocol')
      }
      
      return parsedUrl.toString()
    } catch (error) {
      throw new Error('Invalid URL format')
    }
  }

  static validateDate(date: unknown): string {
    if (typeof date !== 'string') {
      throw new Error('Date must be a string')
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD')
    }
    
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date')
    }
    
    return date
  }

  static validateBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value
    }
    
    if (typeof value === 'string') {
      const lower = value.toLowerCase()
      if (lower === 'true') return true
      if (lower === 'false') return false
    }
    
    throw new Error('Invalid boolean value')
  }

  static validateNumber(num: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
    const parsed = typeof num === 'string' ? parseInt(num, 10) : num
    
    if (typeof parsed !== 'number' || isNaN(parsed)) {
      throw new Error('Invalid number')
    }
    
    if (parsed < min || parsed > max) {
      throw new Error(`Number must be between ${min} and ${max}`)
    }
    
    return parsed
  }
}

// Rate limiting utility
export class RateLimiter {
  private static requests = new Map<string, { count: number; timestamp: number }>()
  
  static isAllowed(
    key: string, 
    maxRequests = 10, 
    windowMs = 60000 // 1 minute
  ): boolean {
    const now = Date.now()
    const record = this.requests.get(key)
    
    if (!record || now - record.timestamp > windowMs) {
      this.requests.set(key, { count: 1, timestamp: now })
      return true
    }
    
    if (record.count >= maxRequests) {
      return false
    }
    
    record.count++
    return true
  }
  
  static cleanup(): void {
    const now = Date.now()
    const windowMs = 60000
    
    for (const [key, record] of this.requests.entries()) {
      if (now - record.timestamp > windowMs) {
        this.requests.delete(key)
      }
    }
  }
}

// Clean up rate limiter periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    RateLimiter.cleanup()
  }, 5 * 60 * 1000) // Clean up every 5 minutes
}