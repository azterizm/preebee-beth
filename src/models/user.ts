import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export function createUser(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profile: { select: { imageURL: true } },
    },
  })
}

export function getUserById(id: string, select?: Prisma.UserSelect) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: { select: { imageURL: true } },
      ...select,
    },
  })
}

export function getUserByProviderId(providerId: string, select?: Prisma.UserSelect) {
  return prisma.user.findFirst({
    where: {
      providerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profile: { select: { imageURL: true } },
      ...select,
    },
  })
}
