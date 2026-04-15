import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'
import { AuthService, type AuthResponse, type SafeUser } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import type { JwtUser } from './strategies/jwt.strategy'
import type { RefreshJwtUser } from './strategies/jwt-refresh.strategy'

interface OAuthCallbackUser {
  user: SafeUser
  accessToken: string
  refreshToken: string
}

// 7-day cookie expiry in ms
const REFRESH_COOKIE_TTL = 7 * 24 * 60 * 60 * 1000

function setRefreshCookie(res: Response, token: string): void {
  res.cookie('habitforge_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_COOKIE_TTL,
    path: '/',
  })
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie('habitforge_refresh', { path: '/' })
}

@Throttle({ default: { limit: 10, ttl: 60000 } })
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Register ──────────────────────────────────────────────────────

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponse, 'refreshToken'>> {
    const result = await this.authService.register(dto)
    setRefreshCookie(res, result.refreshToken)
    const { refreshToken: _, ...response } = result
    return response
  }

  // ── Login ─────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponse, 'refreshToken'>> {
    const result = await this.authService.login(dto)
    setRefreshCookie(res, result.refreshToken)
    const { refreshToken: _, ...response } = result
    return response
  }

  // ── Logout ────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user: JwtUser },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const rawToken =
      (req.cookies as Record<string, string> | undefined)?.['habitforge_refresh']
    await this.authService.logout(req.user.userId, rawToken)
    clearRefreshCookie(res)
    return { message: 'Logged out successfully' }
  }

  // ── Refresh ───────────────────────────────────────────────────────

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request & { user: RefreshJwtUser },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.refreshToken(
      req.user.userId,
      req.user.refreshToken,
    )
    setRefreshCookie(res, tokens.refreshToken)
    return { accessToken: tokens.accessToken }
  }

  // ── Forgot Password ───────────────────────────────────────────────

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto.email)
  }

  // ── Reset Password ────────────────────────────────────────────────

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword)
  }

  // ── Current User ──────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @Req() req: Request & { user: JwtUser },
  ): Promise<SafeUser> {
    return this.authService.getProfile(req.user.userId)
  }

  // ── Google OAuth ──────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
    // Redirects to Google — handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: OAuthCallbackUser },
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = req.user
    setRefreshCookie(res, refreshToken)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
  }

  // ── GitHub OAuth ──────────────────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth(): void {
    // Redirects to GitHub — handled by Passport
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: Request & { user: OAuthCallbackUser },
    @Res() res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = req.user
    setRefreshCookie(res, refreshToken)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`)
  }
}
