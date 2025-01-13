import { Html } from '@react-email/html'
import { Button } from '@react-email/button'

interface PasswordResetEmailProps {
  resetUrl: string
}

export default function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <h1>Reset Your Password</h1>
      <p>Click the button below to reset your password:</p>
      <Button href={resetUrl}>
        Reset Password
      </Button>
      <p>If you didn't request this, please ignore this email.</p>
    </Html>
  )
}

