import { PrismaClient } from '@prisma/client'
import { sendEmail } from './email'

const prisma = new PrismaClient()

export async function createNotification(userId: string, message: string, type: string) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    },
  })

  // Send real-time notification if WebSocket is set up
  if (global.io) {
    global.io.to(userId).emit('new-notification', notification)
  }

  // Send email notification
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user && user.email) {
    await sendEmail(user.email, 'New Notification', message)
  }

  return notification
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  })
}

