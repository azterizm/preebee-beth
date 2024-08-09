import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Button from '../components/Button'
import CartItem from '../components/CartItem'
import { redis } from '../config/db'
import { getProductInIds } from '../models/product'
import { handleStringNumber } from '../utils/api'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.post<{
    Params: { id: string }
    Body: { quantity: string[] | string | number }
  }>('/add/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },

      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req, res) => {
    const user = req.user
    const productId = req.params.id

    const alreadyInCart = await redis.hexists(
      `cart:${user?.id || req.ip}`,
      productId,
    )
    if (alreadyInCart) {
      await redis.hdel(`cart:${user?.id || req.ip}`, productId)
      return res.type('text/html').send(
        <form
          hx-post={`/cart/add/${productId}`}
          hx-swap='outerHTML'
          hx-indicator='.loader'
          hx-include='#quantity-input'
          {...{
            'hx-on::after-request': 'htmx.trigger("#cart" ,\'cartChange\')',
          }}
        >
          <Button class='w-full block h-full flex items-center justify-end gap-2 relative'>
            <img src='/icons/cart.svg' class='w-icon block' />
            <span class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block'>
              Add to cart
            </span>
            <span class='loader htmx-indicator'></span>
          </Button>
        </form>,
      )
    }

    const quantity = handleStringNumber(
      Array.isArray(req.body.quantity)
        ? req.body.quantity.length ? req.body.quantity[0] : '1'
        : req.body.quantity,
    )
    await redis.hset(`cart:${user?.id || req.ip}`, productId, quantity)
    return res.type('text/html').send(
      <form
        hx-post={`/cart/add/${productId}`}
        hx-swap='outerHTML'
        hx-indicator='.loader'
        hx-include='#quantity-input'
        {...{
          'hx-on::after-request': 'htmx.trigger("#cart" ,\'cartChange\')',
        }}
      >
        <Button class='w-full block h-full flex items-center justify-end gap-2 relative'>
          <img src='/icons/check.svg' class='w-icon block' />
          <span class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block'>
            Added to cart
          </span>
          <span class='loader htmx-indicator'></span>
        </Button>
      </form>,
    )
  })

  app.get('/list', async (req, res) => {
    const user = req.user
    const cart = await redis.hgetall(`cart:${user?.id || req.ip}`)
    const products = await getProductInIds(
      Object.keys(cart),
    )
    return res.type(
      'text/html',
    ).send(
      <div class='flex flex-col w-full h-full'>
        <div class='w-full flex items-center justify-between'>
          {products.length
            ? (
              <form
                hx-post='/cart/clear'
                hx-swap='outerHTML'
                hx-indicator='.loader'
                {...{
                  'hx-on::after-request':
                    'htmx.trigger("#cart" ,\'cartChange\')',
                }}
              >
                <Button>Clear cart</Button>
              </form>
            )
            : null}
          <div
            style='margin-right:calc(1rem + 12px);'
            class='flex items-center'
          >
            <div class='mr-8 lg:hidden'>
              <Button x-on:click='cartOpen=false'>Close</Button>
            </div>
            <div>
              <h1 class='text-primary text-3xl'>Cart</h1>
              <p class='uppercase font-bold'>
                {products.length} item{products.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <span class='loader htmx-indicator'></span>
        <div class='my-8 space-y-4 overflow-y-auto overflow-x-hidden flex-1'>
          {products
            .map((product) => (
              <CartItem
                product={product}
                cart={cart}
              />
            ))
            .join('')}
        </div>
        <Button
          href='/checkout'
          class='text-center bg-secondary text-black w-full'
        >
          checkout
        </Button>
      </div>,
    )
  })

  app.post('/clear', async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/auth/login?redirect=' + req.url)
    await redis.del(`cart:${user?.id || req.ip}`)
    return res.type('text/html').send(
      <div />,
    )
  })

  app.post<{
    Params: { id: string }
    Body: { quantity: string[] | string | number }
  }>(
    '/update_quantity/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'string',
          },
        },
      },
    },
    async (req) => {
      const user = req.user
      const productId = req.params.id
      const quantity = handleStringNumber(
        Array.isArray(req.body.quantity)
          ? req.body.quantity.length ? req.body.quantity[0] : '1'
          : req.body.quantity,
      )
      if (quantity <= 0) {
        await redis.hdel(`cart:${user?.id || req.ip}`, productId)
        return 'ok'
      }
      await redis.hset(`cart:${user?.id || req.ip}`, productId, quantity)
      return 'ok'
    },
  )

  app.post('/restore', async (req) => {
    const user = req.user
    if (!user) return 'ok'
    const cart = await redis.hgetall(`cart:${req.ip}`)
    await redis.del(`cart:${req.ip}`)
    await redis.del(`cart:${user.id}`)
    await redis.hmset(`cart:${user.id}`, cart)
    return 'ok'
  })

  app.post<{
    Params: { productId: string }
    Body: { quantity: string[] | string | number }
  }>('/buy_now/:productId', {
    schema: {
      params: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req, res) => {
    const user = req.user
    const productId = req.params.productId
    const quantity = handleStringNumber(
      Array.isArray(req.body.quantity)
        ? req.body.quantity.length ? req.body.quantity[0] : '1'
        : req.body.quantity,
    )
    await redis.hset(`cart:${user?.id || req.ip}`, productId, quantity)
    res.header('hx-redirect', '/checkout')
    return 'ok'
  })

  done()
}
