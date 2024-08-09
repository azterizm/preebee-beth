import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function getAllAvailableProducts(skip = 0) {
  return prisma.product.findMany({
    where: {
      status: 'Available',
      stockAcquired: {
        gt: 0,
      },
      price: {
        gt: 0,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      title: true,
      id: true,
      averageReview: true,
      price: true,
    },
    take: 15,
    skip,
  })
}

export async function getProductInIds(
  ids: string[],
  select?: Prisma.ProductSelect,
  where?: Prisma.ProductWhereInput,
  orderBy?: Prisma.ProductOrderByWithRelationInput,
) {
  return prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
      status: 'Available',
      seller: { status: 'Active' },
      stockAcquired: {
        gt: 0,
      },
      price: {
        gt: 0,
      },
      ...where,
    },
    select: select || {
      title: true,
      id: true,
      price: true,
      stockAcquired: true,
    },
    orderBy: orderBy || {
      createdAt: 'desc',
    },
  })
}

export function getProductImageById(id: string, productId: string) {
  return prisma.productImage.findFirst({
    where: { id, productId },
    select: { data: true },
  })
}

export function getProductMainImageById(id: string) {
  return prisma.product.findFirst({
    where: { id },
    select: { mainImage: true },
  })
}

export async function getProductById(
  id: string,
  select?: Prisma.ProductSelect,
) {
  return prisma.product.findFirst({
    where: {
      id,
      status: 'Available',
      stockAcquired: {
        gt: 0,
      },
      price: {
        gt: 0,
      },
      seller: { status: 'Active' },
    },
    select,
  })
}

export async function getProductsBySellerId(
  sellerId: string,
  skip?: number,
  where?: Prisma.ProductWhereInput,
  orderBy?: Prisma.ProductOrderByWithRelationInput,
) {
  return prisma.product.findMany({
    where: {
      sellerId,
      seller: { status: 'Active' },
      status: 'Available',
      stockAcquired: {
        gt: 0,
      },
      price: {
        gt: 0,
      },
      ...where,
    },
    select: {
      title: true,
      id: true,
      averageReview: true,
      price: true,
    },
    orderBy: orderBy || {
      createdAt: 'desc',
    },
    skip,
  })
}

export async function countTotalProductsBySellerId(sellerId: string) {
  return prisma.product.count({
    where: {
      sellerId,
      status: 'Available',
      seller: { status: 'Active' },
      stockAcquired: {
        gt: 0,
      },
      price: {
        gt: 0,
      },
    },
  })
}

export async function updateProductStockById(
  id: string,
  stocksToRemove: number,
) {
  return prisma.product.update({
    where: { id },
    data: {
      stockAcquired: {
        decrement: stocksToRemove,
      },
    },
  })
}
