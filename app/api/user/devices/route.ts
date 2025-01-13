import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const devices = await prisma.session.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      userAgent: true,
      lastActive: true,
      createdAt: true,
    },
  })

  return NextResponse.json(devices)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { deviceId } = await request.json()

  await prisma.session.delete({
    where: { id: deviceId },
  })

  return NextResponse.json({ message: 'Device removed successfully' })
}

