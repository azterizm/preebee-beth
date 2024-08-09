import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { prisma, redis } from '../config/db'
import { createOrder } from '../models/order'
import { getProductById, updateProductStockById } from '../models/product'
import { getUserById } from '../models/user'
import Checkout from '../pages/Checkout'
import OrderPlaced from '../pages/Order/OrderPlaced'
import { getIPInformation } from '../utils/ip'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get('/', async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/auth/login?redirect=' + req.url)

    const cartItems = await getUserCartItems({
      userId: user.id,
      includeShippingCost: true,
      ip: req.ip,
    })

    if (!cartItems.length) {
      await redis.del(`cart:${user.id}`)
      return res.redirect('/')
    }

    const instance = await getUserById(user.id)

    if (!instance) return res.redirect('/auth/login')

    const checkoutInfo = await prisma.user.findFirst({
      where: { id: user.id },
      select: {
        addressName: true,
        address: true,
        city: true,
        province: true,
        phone: true,
      },
    })

    return res.type('text/html').send(
      <Checkout
        cartItems={cartItems || []}
        email={instance?.email || ''}
        name={checkoutInfo?.addressName || ''}
        address={checkoutInfo?.address || ''}
        city={checkoutInfo?.city || ''}
        province={checkoutInfo?.province || ''}
        phone={checkoutInfo?.phone || ''}
      />,
    )
  })

  app.post<{
    Body: {
      name?: string
      address?: string
      city?: string
      province?: string
      phone?: string
    }
  }>('/order', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          province: { type: 'string' },
          phone: { type: 'string' },
        },
        required: [],
      },
    },
  }, async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/auth/login?redirect=' + req.url)
    const cartInfo = await redis.hgetall(`cart:${user.id}`)
    const cartItems = await getUserCartItems({
      userId: user.id,
      includeShippingCost: true,
      ip: req.ip,
    })
    const amount = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    ) + cartItems.reduce(
      (acc, item) => acc + (item.shippingCost || 0),
      0,
    )
    const [order, _, products] = await Promise.all(
      [
        createOrder({
          userId: user.id,
          productsOrdered: {
            create: Object.entries(cartInfo).map(([id, quantity]) => ({
              productId: id,
              quantity: parseInt(quantity),
              amount: (
                (
                  cartItems.find((r) => r.id === id)?.price!
                ) * parseInt(quantity)
              ) +
                cartItems.find((r) => r.id === id)?.shippingCost!,
            })),
          },
          paymentStatus: 'Done',
          amount,
        }),
        req.body.name && req.body.address && req.body.city &&
          req.body.province && req.body.phone
          ? prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              addressName: req.body.name,
              address: req.body.address,
              city: req.body.city,
              province: req.body.province,
              phone: req.body.phone,
            },
          })
          : null,
        Promise.all(
          Object.entries(cartInfo).map(([id, quantity]) =>
            updateProductStockById(id, parseInt(quantity))
          ),
        ),
        redis.del(`cart:${user.id}`),
        redis.incr(`order:${user.id}`),
      ],
    )

    const sellersId = products.map((r) => r.sellerId).filter((v, i, a) =>
      a.indexOf(v) === i
    )
    await Promise.all(sellersId.map((r) => redis.incr(`to_process:${r}`)))

    return res.redirect(`/checkout/order/${order.id}`)
  })

  app.get<{
    Params: {
      id: string
    }
  }>('/order/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
  }, async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      select: {
        productsOrdered: {
          select: {
            quantity: true,
            product: {
              select: {
                title: true,
                id: true,
                price: true,
              },
            },
          },
        },
      },
    })

    if (!order) return res.redirect('/')
    return res.type('text/html').send(
      <OrderPlaced
        data={order.productsOrdered.map((r) => ({
          id: r.product.id,
          title: r.product.title,
          quantity: r.quantity,
          price: r.product.price,
        }))}
      />,
    )
  })

  app.post('/reset', async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/auth/login?redirect=' + req.url)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        addressName: null,
        address: null,
        city: null,
        province: null,
        phone: null,
      },
    })

    return res.redirect('/checkout')
  })
  done()
}

async function getUserCartItems(data: {
  userId: string
  includeShippingCost?: boolean
  ip?: string
}) {
  const cart = await redis.hgetall(`cart:${data.userId}`)
  const ip = await getIPInformation(data.ip || '')
  if (!Object.keys(cart).length) return []

  const cartItems = await Promise.all(
    Object.entries(cart).map(async ([id, quantity]) => {
      const item = await getProductById(id, {
        title: true,
        price: true,
        seller: !data.includeShippingCost ? false : {
          select: {
            shippingCosts: {
              where: {
                city: ip.city,
              },
            },
          },
        },
      })
      if (!item) return null
      return {
        id,
        name: item.title,
        price: item.price,
        quantity: parseInt(quantity),
        shippingCost: !data.includeShippingCost
          ? undefined
          : (item as any).seller?.shippingCosts[0]?.cost || 0,
      }
    }).filter(Boolean),
  ).then((r) => r.filter(Boolean))

  return cartItems as {
    id: string
    name: string
    price: number
    quantity: number
    shippingCost?: number
  }[]
}
