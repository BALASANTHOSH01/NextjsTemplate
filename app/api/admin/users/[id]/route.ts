import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendEmail } from '@/lib/email'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(user)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.delete({
    where: { id: params.id },
  })

  // Send email notification
  await sendEmail({
    to: user.email,
    subject: 'Your account has been deleted',
    template: 'account-deleted',
    data: { name: user.name }
  })

  return NextResponse.json({ message: 'User deleted successfully' })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await request.json()
  if (action === 'block') {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { blocked: true },
    })
    return NextResponse.json(user)
  } else if (action === 'unblock') {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { blocked: false },
    })
    return NextResponse.json(user)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

