import { FastifyInstance, FastifyPluginOptions, FastifyReply } from 'fastify'
import { google } from 'googleapis'
import slugify from 'slugify'
import uniqid from 'uniqid'
import { oauth2Client } from '../config/api'
import { redis } from '../config/db'
import { logoutUser } from '../middlewares/auth'
import { initGoogleAuthUrl } from '../middlewares/google'
import { createUser, getUserById, getUserByProviderId } from '../models/user'
import Login from '../pages/Login'
import Profile from '../pages/Profile'

export default function(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get('/login', async (req, res) => {
    const user = req.user
    if (user) {
      return res.redirect('/')
    }
    const hasItemsInCart = await redis.exists(`cart:${req.ip}`)
    const error = (req as any).query?.error
    return res.type('text/html').send(
      <Login error={error} hasItemsInCart={hasItemsInCart} />,
    )
  })

  app.get('/logout', async (req, res) => {
    logoutUser(req)
    res.redirect('/auth/login')
  })

  app.get('/profile', async (req, res) => {
    const user = req.user
    if (!user) {
      return res.redirect('/auth/login')
    }
    const instance = await getUserById(user.id)
    if (!instance) {
      logoutUser(req)
      return res.redirect('/auth/login')
    }
    return res.type('text/html').send(
      <Profile data={instance} />,
    )
  })

  app.get(
    '/google',
    async (req, res) => {
      const url = await initGoogleAuthUrl(req)
      return res.redirect(url)
    }
  )
  app.get(
    '/google/callback',
    async (req, res) => {
      const { state, code } = req.query as Record<string, string>
      if (!code) {
        return redirectToLoginWithError(res, "Could not login. Try again.")
      }
      if (!state || state !== req.session.get('state')) {
        return redirectToLoginWithError(res, "State mismatched.")
      }
      const { tokens } = await oauth2Client.getToken(code)
      if (!tokens.access_token) {
        return redirectToLoginWithError(res, "Could not login. Try again.")
      }
      oauth2Client.setCredentials(tokens)
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' })

      const info = await oauth2.userinfo.get()
      const { name, email, picture, id } = info.data
      if (!name || !email || !picture || !id) {
        return redirectToLoginWithError(res, "Profile not complete. Please complete your Google account with all information then try again.")
      }
      req.session.set('state', null)
      let user = await getUserByProviderId(id)
      if (user?.blocked) return redirectToLoginWithError(res, "You have been blocked. Please contact the staff.")
      if (user) {
        req.session.set('user_id', user.id)
        return res.redirect('/')
      }

      user = await createUser({
        providerId: id,
        name,
        providerName: 'google',
        email,
        profile: { create: { imageURL: picture } },
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        id: uniqid(slugify(name, { trim: true, lower: true })),
      }) as any

      req.session.set('user_id', user!.id)

      res.redirect('/')
    },
  )
  app.get('/header_user', async (req, res) => {
    const user = req.user
    if (!user) {
      return res.type('text/html').send(
        <a
          href='/auth/login'
          class='bg-button px-6 py-2 rounded-lg uppercase font-semibold hover:brightness-90'
        >
          Login
        </a>,
      )
    }
    return res.type('text/html').send(
      <a href='/auth/profile' class='tooltip' data-tip='Profile'>
        <img
          src={user.profile.imageURL}
          width='24'
          height='24'
          alt='User'
          class='rounded-full'
        />
      </a>,
    )
  })
  done()
}

function redirectToLoginWithError(res: FastifyReply, error: string) {
  return res.redirect('/auth/login?error=' + encodeURIComponent(error))
}
