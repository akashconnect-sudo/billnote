import { Injectable, Logger } from '@nestjs/common'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import nodemailer from 'nodemailer'

export type MailPayload = {
  to: string
  subject: string
  text: string
  html: string
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  private provider(): 'ses' | 'smtp' | 'console' {
    const configured = (process.env.EMAIL_PROVIDER ?? '').toLowerCase()
    if (configured === 'ses' || configured === 'smtp' || configured === 'console') {
      return configured
    }
    // Prefer explicit SMTP; do not auto-pick SES from DynamoDB AWS keys.
    if (process.env.SMTP_HOST) return 'smtp'
    return 'console'
  }

  private fromAddress(): string {
    return process.env.EMAIL_FROM ?? 'BILLNOTE <noreply@notebill.duckdns.org>'
  }

  async send(payload: MailPayload): Promise<{ delivered: boolean; provider: string }> {
    const provider = this.provider()
    if (provider === 'console') {
      this.logger.warn(
        `EMAIL_PROVIDER=console — OTP email to ${payload.to}:\n${payload.text}`,
      )
      return { delivered: false, provider }
    }

    if (provider === 'smtp') {
      const host = process.env.SMTP_HOST
      if (!host) throw new Error('SMTP_HOST is required when EMAIL_PROVIDER=smtp')
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      })
      await transporter.sendMail({
        from: this.fromAddress(),
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      })
      return { delivered: true, provider }
    }

    const region = process.env.AWS_REGION ?? 'ap-south-1'
    const client = new SESv2Client({ region })
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: this.fromAddress(),
        Destination: { ToAddresses: [payload.to] },
        Content: {
          Simple: {
            Subject: { Data: payload.subject, Charset: 'UTF-8' },
            Body: {
              Text: { Data: payload.text, Charset: 'UTF-8' },
              Html: { Data: payload.html, Charset: 'UTF-8' },
            },
          },
        },
      }),
    )
    return { delivered: true, provider: 'ses' }
  }
}
