import crypto from 'crypto';
import { FastifyRequest } from "fastify";
import { oauth2Client } from "../config/api";

export async function initGoogleAuthUrl(req: FastifyRequest) {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.set('state', state)
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: ['email', 'profile'],
    include_granted_scopes: true,
    state
  })
  return authUrl
}


