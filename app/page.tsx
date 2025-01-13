import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Next.js 15 Template
      </h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        A comprehensive template with authentication, database integration,
        file uploads, and more.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login" className="text-lg">
            Get Started
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="https://github.com/BALASANTHOSH01/NextjsTemplate" target="_blank" rel="noopener noreferrer" className="text-lg">
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>
  )
}