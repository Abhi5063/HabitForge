import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly logger = new Logger(MailService.name)
  private readonly fromAddress: string

  constructor(private readonly config: ConfigService) {
    this.fromAddress = `HabitForge <${this.config.get<string>('SMTP_USER', 'noreply@habitforge.app')}>`

    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    })
  }

  async sendPasswordResetOTP(to: string, otp: string): Promise<void> {
    const subject = 'Your HabitForge Password Reset Code'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: 'DM Sans', Arial, sans-serif; background: #0A0A0A; color: #FFFFFF; margin: 0; padding: 0; }
          .container { max-width: 480px; margin: 40px auto; background: #141414; border-radius: 16px; overflow: hidden; border: 1px solid #2A2A2A; }
          .header { background: linear-gradient(135deg, #FF6B00, #FFD700); padding: 32px 40px; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #fff; letter-spacing: 0.04em; }
          .body { padding: 36px 40px; }
          .otp-box { background: #1E1E1E; border: 1px solid #3A3A3A; border-radius: 12px; text-align: center; padding: 28px; margin: 24px 0; }
          .otp { font-size: 48px; font-weight: 700; letter-spacing: 12px; color: #FFD700; font-family: monospace; }
          .expiry { font-size: 14px; color: #A3A3A3; margin-top: 12px; }
          .footer { padding: 20px 40px; font-size: 13px; color: #6B6B6B; border-top: 1px solid #2A2A2A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>🔥 HABITFORGE</h1></div>
          <div class="body">
            <p style="font-size:16px;color:#FFFFFF;margin:0 0 8px;">Password Reset Request</p>
            <p style="font-size:14px;color:#A3A3A3;">Use the code below to reset your password. It expires in <strong style="color:#FF6B00;">15 minutes</strong>.</p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
              <div class="expiry">Valid for 15 minutes</div>
            </div>
            <p style="font-size:13px;color:#6B6B6B;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} HabitForge. All rights reserved.</div>
        </div>
      </body>
      </html>
    `

    try {
      await this.transporter.sendMail({ from: this.fromAddress, to, subject, html })
      this.logger.log(`Password reset OTP sent to ${to}`)
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}`, error)
      // Don't throw — silently fail to prevent email enumeration
    }
  }

  async sendWelcomeEmail(to: string, displayName: string): Promise<void> {
    const subject = 'Welcome to HabitForge 🔥'
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;background:#0A0A0A;color:#FFFFFF;margin:0;padding:0;">
        <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;overflow:hidden;border:1px solid #2A2A2A;">
          <div style="background:linear-gradient(135deg,#FF6B00,#FFD700);padding:32px 40px;">
            <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;">🔥 HABITFORGE</h1>
          </div>
          <div style="padding:36px 40px;">
            <h2 style="color:#FFD700;margin:0 0 12px;">Welcome, ${displayName}! 🎉</h2>
            <p style="color:#A3A3A3;font-size:15px;">You've joined thousands of habit builders. Start your first habit today and earn your first XP!</p>
            <div style="margin:24px 0;padding:20px;background:#1E1E1E;border-radius:12px;border-left:4px solid #FF6B00;">
              <p style="color:#FFFFFF;margin:0;font-weight:600;">🌱 Create your first habit → earn the "First Step" badge</p>
            </div>
          </div>
          <div style="padding:20px 40px;font-size:13px;color:#6B6B6B;border-top:1px solid #2A2A2A;">© ${new Date().getFullYear()} HabitForge.</div>
        </div>
      </body>
      </html>
    `
    try {
      await this.transporter.sendMail({ from: this.fromAddress, to, subject, html })
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error)
    }
  }
}
