import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { redis } from '../config/db'
import Favourites from '../pages/Favourites'
import { getProductInIds } from '../models/product'
import { categories } from '../constants/api'
import ProductsListContainer from '../components/ProductsListContainer'
import ProductCard from '../components/Product'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get('/', {
    schema: {
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (_, res) => {
    return res.type('text/html').send(
      <Favourites />,
    )
  })
  app.post<{
    Params: { id: string }
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
  }, async (req) => {
    const userId = req.user?.id || req.ip
    const isFavourite = await redis.sismember(
      `favourite:${userId}`,
      req.params.id,
    )
    if (isFavourite) await redis.srem(`favourite:${userId}`, req.params.id)
    else await redis.sadd(`favourite:${userId}`, req.params.id)
    return 'ok'
  })

  app.post<{
    Body: {
      category: string
      subcategory: string
      priceMin: string
      priceMax: string
      sortBy: string
    }
  }>('/products', {
    schema: {
      body: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          subcategory: { type: 'string' },
          priceMin: { type: 'string' },
          priceMax: { type: 'string' },
          sortBy: { type: 'string' },
        },
        required: ['category', 'subcategory', 'priceMin', 'priceMax', 'sortBy'],
      },
    },
  }, async (req, res) => {
    const {
      category,
      subcategory,
      priceMin,
      priceMax,
      sortBy,
    } = req.body

    const categoryIndex = isNaN(parseInt(category))
      ? undefined
      : parseInt(category)

    const userId = req.user?.id || req.ip
    const favouritesId = await redis.smembers(`favourite:${userId}`)

    const products = await getProductInIds(
      favouritesId,
      {
        id: true,
        title: true,
        price: true,
        averageReview: true,
      },
      {
        category: !categoryIndex ? undefined : categories[categoryIndex],
        subCategory: subcategory || undefined,
        price: {
          gte: isNaN(parseInt(priceMin)) ? 0 : parseInt(priceMin),
          lte: isNaN(parseInt(priceMax)) ? undefined : parseInt(priceMax),
        },
      },
      sortBy
        ? sortBy === 'recent'
          ? { createdAt: 'desc' }
          : sortBy === 'price'
          ? { price: 'asc' }
          : sortBy === 'review'
          ? { averageReview: 'desc' }
          : { createdAt: 'desc' }
        : { createdAt: 'desc' },
    )

    if (!products.length) {
      return res.type('text/html').send(
        <p class='mx-auto my-16 text-center max-w-md'>
          No products found. Go ahead and remember to press that heart icon on
          the right side of the product card to add it to your favourites!
        </p>,
      )
    }
    return res.type('text/html').send(
      <ProductsListContainer className='my-8'>
        {products.map((product) => (
          <ProductCard
            price={product.price}
            to={'/product/' + product.id}
            title={product.title}
            stars={product.averageReview}
            imageSrc={'/product_main_image/' + product.id}
          />
        ))}
      </ProductsListContainer>,
    )
  })

  done()
}
