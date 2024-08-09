import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function getSellerImageById(id: string) {
  return prisma.seller.findFirst({
    where: {
      id,
    },
    select: {
      profile: { select: { imageURL: true } },
      name: true,
    },
  })
}

export async function getSellerById(
  options: {
    id: string
    select?: Prisma.SellerSelect
    include?: Prisma.SellerInclude
  },
) {
  return prisma.seller.findFirst({
    where: { id: options.id, status: {not: 'Blocked'} },
    ...(options.select ? { select: options.select } : { include: options.include } as any)
  })
}
