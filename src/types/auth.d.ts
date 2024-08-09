import { AuthUser } from './api'

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser
  }

  interface SessionData {
  }
}

