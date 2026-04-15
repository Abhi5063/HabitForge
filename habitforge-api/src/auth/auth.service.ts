import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from '../mail/mail.service'
import * as bcrypt from 'bcrypt'
import { createHash, randomInt } from 'crypto'
import type { User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SafeUser {
  id: string
  email: string
  username: string
  displayName: string
  avatarEmoji: string
  totalXP: number
  currentLevel: number
  longestStreak: number
  isPublic: boolean
  showOnLeaderboard: boolean
  timezone: string
  createdAt: Date
}

export interface OAuthProfile {
  providerId: string
  email: string
  displayName: string
  avatarEmoji: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: SafeUser
}

function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarEmoji: user.avatarEmoji,
    totalXP: user.totalXP,
    currentLevel: user.currentLevel,
    longestStreak: user.longestStreak,
    isPublic: user.isPublic,
    showOnLeaderboard: user.showOnLeaderboard,
    timezone: user.timezone,
    createdAt: user.createdAt,
  }
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  // ── Private Helpers ─────────────────────────────────────────────

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  // ── Token Generation ─────────────────────────────────────────────

  async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload = { sub: userId, email }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES', '7d') as any,
      }),
    ])

    // Store SHA-256 hash of refresh token (never store plaintext)
    const tokenHash = this.hashToken(refreshToken)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    })

    return { accessToken, refreshToken }
  }

  // ── Register ─────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check uniqueness
    const [emailExists, usernameExists] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      this.prisma.user.findUnique({ where: { username: dto.username } }),
    ])

    if (emailExists) {
      throw new ConflictException('An account with this email already exists')
    }
    if (usernameExists) {
      throw new ConflictException('Username is already taken')
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        displayName: dto.displayName,
        passwordHash,
        avatarEmoji: '🔥',
      },
    })

    // Send welcome email (non-blocking)
    void this.mail.sendWelcomeEmail(user.email, user.displayName)

    const tokens = await this.generateTokens(user.id, user.email)

    return { ...tokens, user: toSafeUser(user) }
  }

  // ── Login ────────────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'This account uses OAuth. Please sign in with Google or GitHub.',
      )
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const tokens = await this.generateTokens(user.id, user.email)
    return { ...tokens, user: toSafeUser(user) }
  }

  // ── Refresh Token (rotation) ─────────────────────────────────────

  async refreshToken(
    userId: string,
    rawRefreshToken: string,
  ): Promise<AuthTokens> {
    const tokenHash = this.hashToken(rawRefreshToken)

    // Find and delete the current refresh token (one-time use)
    const existing = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
      include: { user: { select: { email: true } } },
    })

    if (!existing) {
      // Possible token reuse attack — revoke ALL tokens for this user
      await this.prisma.refreshToken.deleteMany({ where: { userId } })
      throw new UnauthorizedException('Refresh token is invalid or expired')
    }

    // Delete the used token before issuing new one
    await this.prisma.refreshToken.delete({ where: { id: existing.id } })

    return this.generateTokens(userId, existing.user.email)
  }

  // ── Logout ────────────────────────────────────────────────────────

  async logout(userId: string, rawRefreshToken?: string): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken)
      await this.prisma.refreshToken.deleteMany({
        where: { userId, tokenHash },
      })
    } else {
      // Logout from all devices
      await this.prisma.refreshToken.deleteMany({ where: { userId } })
    }
  }

  // ── Forgot Password ───────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Always return success to prevent email enumeration
    const genericResponse = {
      message:
        'If an account exists with this email, you will receive a reset code shortly.',
    }

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return genericResponse

    // Generate 6-digit OTP
    const otp = String(randomInt(100000, 999999))
    const otpHash = this.hashToken(otp)

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    // Invalidate previous OTPs for this email
    await this.prisma.passwordResetOTP.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    await this.prisma.passwordResetOTP.create({
      data: { email, otpHash, expiresAt },
    })

    // Send email (non-blocking)
    void this.mail.sendPasswordResetOTP(email, otp)

    return genericResponse
  }

  // ── Reset Password ────────────────────────────────────────────────

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const otpHash = this.hashToken(otp)

    const otpRecord = await this.prisma.passwordResetOTP.findFirst({
      where: {
        email,
        otpHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP')
    }

    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP')
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update password, mark OTP as used, revoke all refresh tokens atomically
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.passwordResetOTP.update({
        where: { id: otpRecord.id },
        data: { used: true },
      }),
      this.prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
    ])

    return { message: 'Password reset successfully. Please sign in with your new password.' }
  }

  // ── OAuth: Find or Create User ────────────────────────────────────

  async validateOrCreateOAuthUser(
    profile: OAuthProfile,
    provider: 'google' | 'github',
  ): Promise<AuthResponse> {
    const providerIdField = provider === 'google' ? 'googleId' : 'githubId'

    // 1. Look up by provider ID
    let user = await this.prisma.user.findFirst({
      where: { [providerIdField]: profile.providerId },
    })

    if (user) {
      const tokens = await this.generateTokens(user.id, user.email)
      return { ...tokens, user: toSafeUser(user) }
    }

    // 2. Look up by email — link the OAuth provider to existing account
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
    })

    if (existingByEmail) {
      user = await this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: { [providerIdField]: profile.providerId },
      })
      const tokens = await this.generateTokens(user.id, user.email)
      return { ...tokens, user: toSafeUser(user) }
    }

    // 3. Create brand new user
    const baseUsername = profile.email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 18)
    const username = `${baseUsername}_${String(randomInt(100, 999))}`

    user = await this.prisma.user.create({
      data: {
        email: profile.email,
        username,
        displayName: profile.displayName,
        avatarEmoji: profile.avatarEmoji,
        [providerIdField]: profile.providerId,
      },
    })

    void this.mail.sendWelcomeEmail(user.email, user.displayName)

    const tokens = await this.generateTokens(user.id, user.email)
    return { ...tokens, user: toSafeUser(user) }
  }

  // ── Get Profile ───────────────────────────────────────────────────

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException('User not found')
    return toSafeUser(user)
  }
}
