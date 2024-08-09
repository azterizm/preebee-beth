import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function createOrder(data: Prisma.OrderUncheckedCreateInput) {
  return prisma.order.create({
    data,
  })
}

export async function updateOrder(
  where: Prisma.OrderWhereUniqueInput,
  data: Prisma.OrderUncheckedUpdateInput,
) {
  return prisma.order.update({
    where,
    data,
  })
}

export async function deleteOrder(where: Prisma.OrderWhereUniqueInput) {
  return prisma.order.delete({
    where,
  })
}

export async function getOrder(
  where: Prisma.OrderWhereUniqueInput,
  select?: Prisma.OrderSelect,
) {
  return prisma.order.findUnique({
    where,
    select,
  })
}

export async function getOrders(params: {
  skip?: number
  take?: number
  cursor?: Prisma.OrderWhereUniqueInput
  where?: Prisma.OrderWhereInput
  orderBy?: Prisma.OrderOrderByWithRelationInput
  select?: Prisma.OrderSelect
}) {
  const { select, skip, take, cursor, where, orderBy } = params
  return prisma.order.findMany({
    skip,
    take,
    cursor,
    where,
    orderBy,
    select,
  })
}
export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: {
      userId: userId,
    },
    select: {
      paymentStatus: true,
      createdAt: true,
      reason: true,
      productsOrdered: {
        select: {
          packageStatus: true,
          quantity: true,
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              sellerId:true,
            },
          },
          reason:true
        },
      },
      amount:true
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
