import { Review as ReviewT } from '@prisma/client'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Review from '../components/products/Review'
import { prisma } from '../config/db'
import {
  countReviewByProductId,
  createReview,
  deleteReviewById,
  getAllReviewsByProductId,
} from '../models/review'
import { findAverage } from '../utils/data'
import { handleStringNumber } from '../utils/api'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.post<{
    Params: {
      id: string
    }
    Body: {
      cursor?: string
    }
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          cursor: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req, res) => {
    const cursor = handleStringNumber(req.body.cursor)

    const reviewsCount = await countReviewByProductId(req.params.id)

    const reviews = await getAllReviewsByProductId(req.params.id, {
      createdAt: true,
      content: true,
      stars: true,
      user: { select: { name: true, id: true } },
      id: true,
    }, {
      take: 10,
      skip: handleStringNumber(cursor) || 0,
    }) as (ReviewT & { user: { name: string; id: string } })[]

    if (!reviews?.length) {
      return res.type('text/html').send(
        <div class='space-y-4 mt-4' id='reviews_content'>
          <p class='mt-4'>Be first to review this product.</p>,
          <form
            hx-target='#reviews_content'
            hx-swap='outerHTML'
            hx-post={`/reviews/${req.params.id}`}
            class='join mt-8'
            id='reviews_pagination'
          >
          </form>
        </div>,
      )
    }

    return res.type('text/html').send(
      <div
        class='space-y-4 mt-4'
        id='reviews_content'
      >
        {reviews.map((r) => (
          <Review
            rating={r.stars}
            date={r.createdAt}
            comment={r.content}
            by={r.user.name || 'Unknown'}
            canDelete={r.user.id === req.user?.id}
            id={r.id}
          />
        ))}
        <form
          hx-target='#reviews_content'
          hx-swap='outerHTML'
          hx-post={`/reviews/${req.params.id}`}
          class='join mt-8'
          id='reviews_pagination'
        >
          {cursor
            ? (
              <button
                class='btn join-item'
                name='cursor'
                value={(handleStringNumber(cursor) - 10).toString()}
              >
                <img
                  src='/icons/arrow-right.svg'
                  alt='back icon'
                  class='rotate-180'
                  width='20'
                />
                Previous
              </button>
            )
            : null}
          {reviewsCount > (handleStringNumber(cursor) || 0) + 10
            ? (
              <button
                name='cursor'
                value={(handleStringNumber(cursor) + 10).toString()}
                class='btn join-item'
              >
                Next
                <img
                  src='/icons/arrow-right.svg'
                  alt='forward icon'
                  width='20'
                />
              </button>
            )
            : null}
        </form>
      </div>,
    )
  })

  app.post<{
    Body: {
      productId: string
      stars: number
      content?: string
    }
  }>('/new', {
    schema: {
      body: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          stars: { type: 'number' },
          content: { type: 'string' },
        },
        required: ['productId', 'stars'],
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req, res) => {
    const user = req.user
    if (!user) {
      return res.type('text/html').send(
        <span>
          You need to be logged in to post a review.
        </span>,
      )
    }
    const review = await createReview({
      content: req.body.content || '',
      stars: req.body.stars,
      productId: req.body.productId,
      userId: user.id,
    })

    await updateAverageReviews(req.body.productId)

    return res.type('text/html').send(
      <Review
        rating={req.body.stars}
        date={new Date()}
        comment={req.body.content || ''}
        by={user.name}
        canDelete
        id={review.id}
      />,
    )
  })

  app.delete<{
    Params: {
      id: string
    }
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req, res) => {
    const user = req.user
    if (!user) {
      return res.type('text/html').send(
        <span>
          You need to be logged in to delete a review.
        </span>,
      )
    }
    const review = await deleteReviewById(
      req.params.id,
      user?.id,
    )
    await updateAverageReviews(review.productId)
    return res.type('text/html').send(
      <Review
        id={review.id}
        rating={review.stars}
        date={review.createdAt}
        comment={review.content}
        by={user.name}
        isDeleted
      />,
    )
  })

  done()
}

export async function updateAverageReviews(productId: string) {
  const allReviews = await getAllReviewsByProductId(productId, {
    stars: true,
  })

  const averageReview = findAverage(allReviews.map((r) => r.stars))

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageReview,
    },
  })
}
