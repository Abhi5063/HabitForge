import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-github2'
import { AuthService } from '../auth.service'

interface GitHubProfile {
  id: string
  displayName: string
  username: string
  emails?: Array<{ value: string }>
  photos?: Array<{ value: string }>
}

type DoneCallback = (error: Error | null, user?: unknown) => void

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: `${config.get<string>('API_URL', 'http://localhost:4000')}/auth/github/callback`,
      scope: ['user:email'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GitHubProfile,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const primaryEmail =
        profile.emails?.[0]?.value ?? `${profile.id}@github.oauth`
      const displayName =
        profile.displayName ?? profile.username ?? 'User'

      const { user, accessToken, refreshToken } =
        await this.authService.validateOrCreateOAuthUser(
          {
            providerId: profile.id,
            email: primaryEmail,
            displayName,
            avatarEmoji: '⚡',
          },
          'github',
        )

      done(null, { user, accessToken, refreshToken })
    } catch (error) {
      done(error as Error)
    }
  }
}
