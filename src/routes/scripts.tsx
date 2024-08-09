import { FastifyInstance } from 'fastify'
import fs from 'fs/promises'
import path from 'path'

export default function (
  app: FastifyInstance,
  _: any,
  done: (err?: Error) => void,
) {
  app.get('/alpine.js', async (_, res) => {
    const alpinePath = path.resolve('node_modules/alpinejs/dist/cdn.min.js')
    const contents = await fs.readFile(alpinePath, 'utf-8')
    res.header('Cache-Control', 'public, max-age=86400')
    return res.type('application/javascript').send(contents)
  })
  done()
}
