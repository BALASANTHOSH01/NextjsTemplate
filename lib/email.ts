import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/welcome'
import PasswordResetEmail from '@/emails/password-reset'
import VerificationEmail from '@/emails/verification'
import AccountDeletedEmail from '@/emails/account-deleted'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

type EmailTemplate = 'welcome' | 'password-reset' | 'verification' | 'account-deleted'

interface SendEmailProps {
  to: string
  subject: string
  template: EmailTemplate
  data?: Record<string, any>
}

export async function sendEmail({ to, subject, template, data }: SendEmailProps) {
  const templates = {
    welcome: WelcomeEmail,
    'password-reset': PasswordResetEmail,
    verification: VerificationEmail,
    'account-deleted': AccountDeletedEmail,
  }

  const Template = templates[template]
  const html = render(<Template {...data} />)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
}

