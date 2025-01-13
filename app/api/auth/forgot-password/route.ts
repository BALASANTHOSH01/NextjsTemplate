import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { sendPasswordResetEmail } from '@/lib/email'

const prisma = new PrismaClient()

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: 'If a user with this email exists, a password reset link has been sent.' })
    }

    const resetToken = Math.random().toString(36).substr(2, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires: new Date(Date.now() + 3600000) }, // Token expires in 1 hour
    })

    await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({ message: 'If a user with this email exists, a password reset link has been sent.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

