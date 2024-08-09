import { Redis } from 'ioredis'
import RedisStore from 'connect-redis'
import { PrismaClient } from '@prisma/client'

export const redis = new Redis()
export const prisma = new PrismaClient()
export const redisSessionStore = new RedisStore({ client: redis })
