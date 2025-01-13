# Next.js 15 Template

A comprehensive Next.js 15 template with authentication, database integration, role-based access control, and more.

## Table of Contents

1. [Features](#features)
   - [Authentication](#authentication)
   - [Database Integration](#database-integration)
   - [Email Functionality](#email-functionality)
   - [Real-time Features](#real-time-features)
   - [File Uploads](#file-uploads)
   - [UI and Performance](#ui-and-performance)

2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables Setup](#environment-variables-setup)

3. [Directory Structure](#directory-structure)
   - [App Directory](#app-directory)
   - [Components](#components)
   - [Library](#library)
   - [Prisma](#prisma)
   - [Public Assets](#public-assets)

4. [Core Functionalities](#core-functionalities)
   - [Authentication](#authentication-1)
     - [Login](#login)
     - [Registration](#registration)
     - [Password Reset](#password-reset)
   - [User Management](#user-management)
     - [User Roles](#user-roles)
     - [Profile Management](#profile-management)
     - [Admin Dashboard](#admin-dashboard)
   - [File Uploads](#file-uploads-1)
     - [Implementation Details](#implementation-details)
   - [Email Features](#email-features)
     - [Configuration](#configuration)
     - [Templates](#templates)

5. [Development Guide](#development-guide)
   - [Adding New Features](#adding-new-features)
   - [Database Operations](#database-operations)
   - [Authentication Implementation](#authentication-implementation)

6. [Deployment](#deployment)
   - [Build Process](#build-process)
   - [Production Server](#production-server)

7. [Project Guidelines](#project-guidelines)
   - [Development Standards](#development-standards)
     - [Naming Convention](#naming-convention)
     - [Code Organization](#code-organization)
     - [Code Review](#code-review)
     - [Commit Messages](#commit-messages)
   - [License and Usage Terms](#license-and-usage-terms)
     - [License Information](#license-information)
     - [Usage Restrictions](#usage-restrictions)

## Features

- 🔐 Authentication (NextAuth.js)
  - Email/Password
  - OAuth (Google, GitHub, etc.)
  - Role-based access control (Admin/User)
- 📦 Database Integration (Prisma + PostgreSQL)
- 📧 Email functionality
- 🔄 Real-time features
- 📁 File uploads
- 🎨 Modern UI with Tailwind CSS
- 🚀 Performance optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- SMTP server for emails

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BALASANTHOSH01/NextjsTemplate.git
cd nextjs15-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
APPLE_ID="your-apple-id"
APPLE_SECRET="your-apple-secret"

# Email (for sending verification emails)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email-server-user"
EMAIL_SERVER_PASSWORD="your-email-server-password"
EMAIL_FROM="noreply@example.com"

# File Storage
STORAGE_PROVIDER="s3" # or "gcs" or "firebase"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"

# Redis (for caching)
REDIS_URL="redis://username:password@localhost:6379"

# Socket.IO
SOCKET_SERVER_URL="http://localhost:3000"

```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Directory Structure

- `app/`: Next.js 15 app directory
  - `api/`: API routes
  - `auth/`: Authentication-related pages
  - `dashboard/`: Dashboard pages
  - `(auth)/`: Authentication layout group
- `components/`: Reusable React components
  - `ui/`: UI components
- `lib/`: Utility functions and configurations
- `prisma/`: Database schema and migrations
- `public/`: Static assets

## Core Functionalities

### Authentication

1. **Login**: 
   - Route: `/login`
   - Component: `app/login/page.tsx`
   - Features: Email/Password, OAuth providers

2. **Registration**:
   - Route: `/register`
   - Component: `app/register/page.tsx`
   - Features: Email verification, password validation

3. **Password Reset**:
   - Routes: `/forgot-password`, `/reset-password`
   - API: `app/api/auth/forgot-password`, `app/api/auth/reset-password`

### User Management

1. **User Roles**:
   - Admin: Full access to all features
   - User: Limited to own data
   - Guest: Public access only

2. **Profile Management**:
   - Route: `/dashboard/profile`
   - Features: Update profile, change password

3. **Admin Dashboard**:
   - Route: `/dashboard/admin`
   - Features: User management, system settings

### File Uploads

1. **Implementation**:
   - API: `app/api/upload/route.ts`
   - Storage: AWS S3/Google Cloud Storage
   - Features: Multi-file upload, progress tracking

### Email Features

1. **Configuration**:
   - Setup: `lib/email.ts`
   - Provider: SMTP/SendGrid/Amazon SES

2. **Templates**:
   - Welcome email
   - Password reset
   - Email verification

## Development Guide

### Adding New Features

1. **Create new API route**:
```typescript
// app/api/your-feature/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Your logic here
  return NextResponse.json({ data: 'your data' })
}
```

2. **Create new page**:
```typescript
// app/your-feature/page.tsx
export default function YourFeature() {
  return (
    <div>
      <h1>Your Feature</h1>
    </div>
  )
}
```

### Database Operations

1. **Create new model**:
```prisma
// prisma/schema.prisma
model YourModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  // Add your fields
}
```

2. **Generate migration**:
```bash
npx prisma migrate dev --name add_your_model
```

### Authentication

1. **Protect API routes**:
```typescript
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  // Your logic here
}
```

2. **Protect pages**:
```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return <div>Protected Content</div>
}
```

## Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm start
```

# Project Guidelines

## Development Standards

### 1. Naming Convention
All code, files, directories, and components should follow a consistent naming convention for clarity and organization.

### 2. Code Organization
Maintain a well-structured and organized codebase for readability and ease of maintenance.

### 3. Code Review and Quality Check
Perform thorough checks before committing or pushing code to ensure quality standards are met.

### 4. Commit Messages
Use clear and descriptive commit messages following the format: `<scope>: <short description>`

**Examples:**
- `fix: resolve authentication error`
- `feat: add user registration functionality`
- `test: validate session handling`

## License and Usage Terms

### License
This project is licensed under the MIT License.

### Usage Restrictions
- **Unauthorized Use**: The code cannot be used, distributed, or modified without explicit consent from the author.
- **External Usage**: Any external usage (e.g., deployment, publication) requires prior permission from the author at all times.
