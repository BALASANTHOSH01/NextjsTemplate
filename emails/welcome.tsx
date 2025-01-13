import { Html } from '@react-email/html'
import { Button } from '@react-email/button'

interface WelcomeEmailProps {
  name: string
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <h1>Welcome, {name}!</h1>
      <p>We're excited to have you on board.</p>
      <Button href="https://yourapp.com/dashboard">
        Get Started
      </Button>
    </Html>
  )
}

