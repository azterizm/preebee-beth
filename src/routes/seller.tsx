import { FastifyInstance } from 'fastify'
import _ from 'lodash'
import {
  countTotalProductsBySellerId,
  getProductById,
  getProductsBySellerId,
} from '../models/product'
import { getSellerById } from '../models/seller'
import SellerPage from '../pages/SellerPage'
import ProductsListContainer from '../components/ProductsListContainer'
import ProductCard from '../components/Product'
import { categories } from '../constants/api'

export default function(
  app: FastifyInstance,
  _: any,
  done: (err?: Error) => void,
) {
  app.post<{
    Body: {
      category: string
      subcategory: string
      priceMin: string
      priceMax: string
      sortBy: string
    }
    Params: {
      id: string
    }
  }>('/:id/products', {
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

    const products = await getProductsBySellerId(
      req.params.id,
      0,
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
        <p class='mt-16 text-center'>
          No products found.
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

  app.get<{
    Querystring: {
      previousProductId?: string
    }
    Params: {
      id: string
    }
  }>('/:id', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          previousProductId: { type: 'string' },
        },
      },
      response: { 200: { type: 'string' } },
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (req, res) => {
    const previousProductId = req.query.previousProductId
    const previousProduct = !previousProductId
      ? undefined
      : await getProductById(previousProductId, {
        title: true,
        subCategory: true,
        category: true,
      })

    const seller = await getSellerById({
      id: req.params.id,
      include: {
        profile: { select: { imageURL: true } },
        social: { select: { link: true, platform: true } },
      },
    })

    if (!seller) return res.status(404).send('Not found')

    const products = await getProductsBySellerId(
      seller.id,
    )

    const total = await countTotalProductsBySellerId(seller.id)

    res.type('text/html').send(
      <SellerPage
        total={total}
        previousProduct={previousProduct as any}
        products={products as any}
        seller={seller as any}
      />,
    )
  })

  done()
}
