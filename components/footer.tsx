'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function Footer() {
  const { data: session } = useSession()

  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-900">
                Register
              </Link>
            </>
          )}
        </nav>
        <p className="mt-4 text-center text-gray-500">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

