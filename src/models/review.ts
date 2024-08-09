import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function createReview(data: Prisma.ReviewUncheckedCreateInput) {
  return prisma.review.create({ data })
}

export async function countReviewByProductId(productId: string) {
  return prisma.review.count({ where: { productId } })
}

export async function getAllReviewsByProductId(
  productId: string,
  select?: Prisma.ReviewSelect,
  paginate?: {
    skip?: number
    take?: number
  },
) {
  return prisma.review.findMany({
    where: { productId },
    select,
    ...paginate,
  })
}

export async function getReviewById(id: string) {
  return prisma.review.findFirst({
    where: { id },
  })
}

export async function deleteReviewById(id: string, userId: string) {
  return prisma.review.delete({ where: { id, userId } })
}
