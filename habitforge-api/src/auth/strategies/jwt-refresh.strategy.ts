import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { createHash } from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'

export interface RefreshJwtPayload {
  sub: string
  email: string
}

export interface RefreshJwtUser {
  userId: string
  email: string
  refreshToken: string
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try httpOnly cookie
        (req: Request) => {
          return (req?.cookies as Record<string, string> | undefined)?.[
            'habitforge_refresh'
          ] ?? null
        },
        // Fall back to Authorization header with "Refresh " prefix
        ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: RefreshJwtPayload): Promise<RefreshJwtUser> {
    const rawToken =
      (req?.cookies as Record<string, string> | undefined)?.['habitforge_refresh'] ??
      req.headers.authorization?.replace(/^Refresh\s+/i, '') ??
      ''

    if (!rawToken) {
      throw new UnauthorizedException('Refresh token missing')
    }

    const tokenHash = createHash('sha256').update(rawToken).digest('hex')

    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    })

    if (!stored) {
      throw new UnauthorizedException('Refresh token expired or revoked')
    }

    return { userId: payload.sub, email: payload.email, refreshToken: rawToken }
  }
}
