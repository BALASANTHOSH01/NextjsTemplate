import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import { authOptions } from '../[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const secret = authenticator.generateSecret()
  await prisma.user.update({
    where: { id: user.id },
    data: { mfaSecret: secret, mfaEnabled: true }
  })

  const otpauth = authenticator.keyuri(user.email!, 'NextJS Template', secret)
  const qr = await qrcode.toDataURL(otpauth)

  return NextResponse.json({ qr, secret })
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { mfaSecret: null, mfaEnabled: false }
  })

  return NextResponse.json({ message: 'MFA disabled' })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const { token } = await request.json()
  const isValid = authenticator.verify({ token, secret: user.mfaSecret! })

  if (isValid) {
    return NextResponse.json({ message: 'Token is valid' })
  } else {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 })
  }
}

