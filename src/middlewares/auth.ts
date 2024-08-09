import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../config/db'

export async function userMustNotBeBlocked(
  req: FastifyRequest,
  res: FastifyReply,
  done: () => void,
) {
  const user = req.user
  if (!user) return res.redirect('/auth/login')
  const instance = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: { blocked: true },
  })
  if (instance?.blocked) {
    logoutUser(req)
    return res.redirect('/auth/login')
  }
  done()
}

export async function authenticationSetupMiddleware(app: FastifyInstance) {
  app.decorateRequest('user', null)
  app.addHook('preHandler', async (req, _ ) => {
   const userId = req.session.get('user_id')
   const user = typeof userId !== 'string' ? null : await prisma.user.findUnique({
     where: { id: userId },
     select: {
       id: true, name: true, profile: { select: { imageURL: true } }
     }
   }).catch(_ => null)
   if (user) {
     req.user = user as any
   }
  })
}

export function logoutUser(req: FastifyRequest) {
  req.session.set('user_id', null)
}
