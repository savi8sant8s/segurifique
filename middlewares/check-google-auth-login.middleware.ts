import { OAuth2Client } from 'google-auth-library'
import { NextApiResponse, NextApiRequest } from 'next'
import {
  BadRequestException,
  createMiddlewareDecorator,
  NextFunction,
  UnauthorizedException,
} from 'next-api-decorators'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

export const CheckGoogleAuthLogin = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
    const bearer = req.headers.authorization
    if (!bearer) {
      throw new BadRequestException('Not defined credentials')
    }
    const token = bearer.split(' ')[1]
    try {
        await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        })        
        next()
    }
    catch (error) {
        throw new UnauthorizedException('Invalid credentials')
    }
  }
)
