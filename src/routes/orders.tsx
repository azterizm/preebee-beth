import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { redis } from '../config/db'
import { getUserOrders } from '../models/order'
import Orders from '../pages/Order/Orders'
import { handleStringNumber } from '../utils/api'

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
  }, async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/auth/login?redirect=' + req.url)
    const orders = await getUserOrders(user.id)
    await redis.set(`order:${user.id}`, '0')
    return res.type(
      'text/html; charset=utf-8',
    ).send(
      <Orders data={orders} />,
    )
  })

  app.get('/count', {
    schema: {
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req) => {
    const user = req.user
    const emptyResponse = <div class='hidden' />
    if (!user) return emptyResponse
    const orderLength = handleStringNumber(
      await redis.get(`order:${user.id}`) || '0',
    )
    if (orderLength <= 0) return emptyResponse
    return (
      <span class='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
        {orderLength}
      </span>
    )
  })
  done()
}
