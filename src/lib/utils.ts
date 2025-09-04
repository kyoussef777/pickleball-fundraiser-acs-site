import { NextRequest } from 'next/server'

export function getClientIP(request: NextRequest): string {
  return (request as NextRequest & { ip?: string }).ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown'
}