import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyFormBody from '@fastify/formbody'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifySession from "@mgcrea/fastify-session"
import { FastifyInstance } from 'fastify'
import path from 'path'

export default function(
  app: FastifyInstance,
) {
  const sessionSecret = process.env.SESSION_SECRET
  if (!sessionSecret) throw new Error('SESSION_SECRET must be set')
  app.register(fastifyCors, { origin: true })
  app.register(fastifyStatic, {
    root: path.resolve('public'),
    maxAge: process.env.NODE_ENV === 'development' ? 0 : 3e5,
  })
  app.register(fastifyFormBody)
  app.register(fastifyCookie)
  app.register(fastifySession, {
    cookieName: 'session-eyes',
    secret: sessionSecret,
    cookie: {
      maxAge: 2.592e8,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
   saveUninitialized: false,
  })
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 2e7,
      files: 8,
    },
    attachFieldsToBody: true,
  })
}
