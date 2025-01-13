import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { permissions: true } } }
  })

  if (!user) return false

  return user.roles.some(role => 
    role.permissions.some(permission => permission.name === permissionName)
  )
}

export async function assignRole(userId: string, roleName: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { roles: { connect: { name: roleName } } }
  })
}

export async function removeRole(userId: string, roleName: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { roles: { disconnect: { name: roleName } } }
  })
}

