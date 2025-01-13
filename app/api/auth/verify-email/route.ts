import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { sendVerificationEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email } = await request.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 400 })
    }

    const verificationToken = Math.random().toString(36).substr(2, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    })

    await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json({ message: 'Verification email sent' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

