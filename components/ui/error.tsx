import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  message?: string
}

export function Error({ message = 'Something went wrong' }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
      <AlertTriangle className="h-8 w-8 mb-2" />
      <p>{message}</p>
    </div>
  )
}

