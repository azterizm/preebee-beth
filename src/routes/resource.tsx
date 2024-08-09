import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { getProductImageById, getProductMainImageById } from '../models/product'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.get<{
    Params: {
      id: string
      productId: string
    }
  }>('/product_image/:id/:productId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
        },
        required: ['id', 'productId'],
      },
      response: {
        200: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }, async (req, res) => {
    const productImage = await getProductImageById(
      req.params.id,
      req.params.productId,
    )
    if (!productImage) return res.status(404).send()
    res.header('Cache-Control', 'public, max-age=300')
    return res.send(productImage.data)
  })

  app.get<{
    Params: {
      id: string
    }
  }>('/product_main_image/:id', {
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
          format: 'binary',
        },
      },
    },
  }, async (req, res) => {
    const productImage = await getProductMainImageById(req.params.id)
    if (!productImage) return res.status(404).send()
    res.header('Cache-Control', 'public, max-age=300')
    return res.send(productImage.mainImage)
  })

  done()
}
