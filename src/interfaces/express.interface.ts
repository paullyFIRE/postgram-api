export {}

declare global {
  interface ParsedToken {
    iss: string
    sub: string
    aud: string | string[]
    iat: number
    exp: number
    azp: string
    scope: string
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: ParsedToken
    }
  }
}