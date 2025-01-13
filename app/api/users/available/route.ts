import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const checkUserSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = checkUserSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    
    return NextResponse.json({ available: !user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

