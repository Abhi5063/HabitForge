import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20'
import { AuthService } from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get<string>('API_URL', 'http://localhost:4000')}/auth/google/callback`,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const primaryEmail = profile.emails?.[0]?.value ?? `${profile.id}@google.oauth`
      const displayName = profile.displayName ?? profile.name?.givenName ?? 'User'

      const { user, accessToken, refreshToken } =
        await this.authService.validateOrCreateOAuthUser(
          {
            providerId: profile.id,
            email: primaryEmail,
            displayName,
            avatarEmoji: '🔥',
          },
          'google',
        )

      done(null, { user, accessToken, refreshToken })
    } catch (error) {
      done(error as Error, false)
    }
  }
}
