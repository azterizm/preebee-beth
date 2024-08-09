import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import resourceRoutes from './resource'
import scriptRoutes from './scripts'
import sellerRotues from './seller'
import productRoutes from './products'
import reviewsRoutes from './reviews'
import authRoutes from './auth'
import cartRoutes from './cart'
import favouriteRoutes from './favourite'
import checkoutRoutes from './checkout'
import ordersRoutes from './orders'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.register(scriptRoutes, { prefix: '/' })
  app.register(resourceRoutes, { prefix: '/' })

  app.register(productRoutes, { prefix: '/' })
  app.register(sellerRotues, { prefix: '/seller' })
  app.register(reviewsRoutes, { prefix: '/reviews' })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(cartRoutes, { prefix: '/cart' })
  app.register(favouriteRoutes, { prefix: '/favourite' })
  app.register(checkoutRoutes, { prefix: '/checkout' })
  app.register(ordersRoutes, { prefix: '/orders' })

  done()
}
