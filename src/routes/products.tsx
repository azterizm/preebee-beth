import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import ProductCard from '../components/Product'
import ProductsListContainer from '../components/ProductsListContainer'
import { prisma, redis } from '../config/db'
import {
    hairCareCategories,
    makeupCategories,
    skinCareCategories,
} from '../constants/api'
import { getProductById } from '../models/product'
import { countReviewByProductId } from '../models/review'
import Categories from '../pages/Categories'
import ProductPage from '../pages/ProductPage'
import Products from '../pages/Products'
import { handleStringNumber } from '../utils/api'
import { getIPInformation } from '../utils/ip'

export default function(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.get(
    '/',
    {
      schema: {
        response: { 200: { type: 'string' } },
      },
    },
    async (_, res) => {
      return res.type('text/html').send(<Products />)
    },
  )

  app.get<{ Params: { id: string } }>('/product/:id', async (req, res) => {
    const id = req.params.id
    if (!id) return res.redirect(300, '/')
    const product = await getProductById(id, {
      id: true,
      title: true,
      stockAcquired: true,
      category: true,
      subCategory: true,
      price: true,
      averageReview: true,
      description: true,
      images: {
        select: {
          id: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          profile: { select: { imageURL: true } },
          social: {
            select: {
              platform: true,
              link: true,
            },
          },
        },
      },
      ingredients: {
        select: {
          name: true,
        },
      },
      suitableFor: {
        select: {
          key: true,
          value: true,
        },
      },
    })

    if (!product) return res.redirect(300, '/')

    const reviewsCount = await countReviewByProductId(product.id)
    const user = req.user
    const isProductInCart = await redis.hexists(
      `cart:${user?.id || req.ip}`,
      product.id,
    )
    const isFavorite = await redis.sismember(
      `favourite:${user?.id || req.ip}`,
      product.id,
    )

    const recommendedProducts = await prisma.$queryRawUnsafe<
      Array<{
        id: string
        title: string
        price: number
        averageReview: number
      }>
    >(`SELECT id, title, price, averageReview FROM Product WHERE category = '${product.category}' AND id != '${product.id}' AND status = 'Available' AND stockAcquired > 0 AND price > 0 ORDER BY rand() LIMIT 4;`)

    return res.type('text/html').send(
      <ProductPage
        reviewsCount={reviewsCount}
        data={product as any}
        recommendedProducts={recommendedProducts}
        user={user}
        isProductInCart={Boolean(isProductInCart)}
        isFavorite={Boolean(isFavorite)}
      />,
    )
  })

  app.get('/category', (_, res) => {
    return res.type('text/html').send(<Categories />)
  })

  app.get<{
    Params: {
      category: string
    }
    Querystring: {
      subCategory?: string
    }
  }>('/category/:category', {
    schema: {
      response: { 200: { type: 'string' } },
      params: {
        type: 'object',
        properties: {
          category: { type: 'string' },
        },
        required: ['category'],
      },
      querystring: {
        type: 'object',
        properties: {
          subCategory: { type: 'string' },
        },
      },
    },
  }, async (req, res) => {
    const category = req.params.category
    const categories = category === 'makeup'
      ? makeupCategories
      : category === 'skin_care'
        ? skinCareCategories
        : hairCareCategories
    return res.type('text/html').send(
      <Products
        subCategories={categories as any}
        category={category}
        subCategory={req.query.subCategory}
      />,
    )
  })

  app.post<{
    Body: {
      category?: string
      subCategory?: string
      cursor?: number
    }
  }>('/products_query', {
    schema: {
      response: {
        200: {
          type: 'string',
        },
      },
      body: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          subCategory: { type: 'string' },
          cursor: { type: 'number' },
        },
      },
    },
  }, async (req, res) => {
    const ipInfo = await getIPInformation(req.ip)
    const take = 12
    const { category, subCategory, cursor } = req.body
    const products = await prisma.product.findMany({
      where: {
        category: !category ? undefined : category,
        subCategory: !subCategory ? undefined : subCategory,
        status: 'Available',
        stockAcquired: { gt: 0 },
        price: { gt: 0 },
        seller: {
          status: 'Active',
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: cursor,
      take,
      select: {
        id: true,
        title: true,
        price: true,
        averageReview: true,
      },
    })

    let productsLength = 0

    productsLength = handleStringNumber(
      await redis.get(`productsLength:${category}:${subCategory}`),
    )

    if (!productsLength) {
      productsLength = await prisma.product.count({
        where: {
          category: !category ? undefined : category,
          subCategory: !subCategory ? undefined : subCategory,
          status: 'Available',
          stockAcquired: { gt: 0 },
          price: { gt: 0 },
          seller: {
            status: 'Active',
          },
        },
      })
      await redis.setex(
        `productsLength:${category}:${subCategory}`,
        60 * 60 * 24,
        productsLength.toString(),
      )
    }

    const content = (
      <>
        {products.map((product) => (
          <ProductCard
            price={product.price}
            title={product.title}
            to={`/product/${product.id}`}
            stars={product.averageReview}
            imageSrc={'/product_main_image/' + product.id}
          />
        ))}
        {(cursor || 0) + take < productsLength && (
          <div
            hx-post='/products_query'
            hx-target='this'
            hx-swap='outerHTML'
            hx-trigger='revealed'
            hx-vals={JSON.stringify({
              category: category || '',
              subCategory: subCategory || '',
              cursor: cursor ? cursor + take : take,
            })}
          />
        )}
      </>
    )

    if (!cursor && !products.length) {
      return res.type(`text/html`).send(
        <div class='flex flex-col items-center justify-center h-64 text-center'>
          <span class='text-2xl font-medium'>No products found</span>
          <span class='text-lg mt-2'>Try another category</span>
        </div>,
      )
    }

    if (!cursor) {
      return res.type(`text/html`).send(
        <ProductsListContainer>
          {content}
        </ProductsListContainer>,
      )
    }

    return res.type(`text/html`).send(content)
  })

  done()
}
