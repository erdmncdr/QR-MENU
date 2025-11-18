# Authentication Implementation Plan

## 🎯 Overview

This document outlines the step-by-step plan to add authentication and authorization to the QR Menu system.

**Estimated Time:** 2-3 days
**Priority:** CRITICAL ⚠️
**Complexity:** Medium

---

## 🏗️ Architecture Decision

### Recommended: NextAuth.js

**Why NextAuth.js?**
- ✅ Built for Next.js (perfect integration)
- ✅ Supports multiple providers (Email, Google, GitHub, etc.)
- ✅ Session management built-in
- ✅ TypeScript support
- ✅ Database adapter for Prisma
- ✅ Free and open-source

**Alternatives Considered:**
- **Clerk:** Easier but paid service
- **Auth0:** Enterprise-grade but overkill
- **Supabase Auth:** Good but requires Supabase database

---

## 📦 Implementation Steps

### Phase 1: Setup (2 hours)

#### 1.1 Install Dependencies

```bash
npm install next-auth @next-auth/prisma-adapter
npm install --save-dev @types/next-auth
```

#### 1.2 Update Environment Variables

Add to `.env`:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-minimum-32-characters

# Email Provider (for passwordless login)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

### Phase 2: Database Schema (1 hour)

#### 2.1 Update Prisma Schema

Add to `prisma/schema.prisma`:

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user") // "user", "admin", "owner"
  restaurantId  Int?      // Which restaurant they manage

  accounts      Account[]
  sessions      Session[]
  restaurant    Restaurant? @relation(fields: [restaurantId], references: [id])

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// Update Restaurant model
model Restaurant {
  // ... existing fields ...
  users User[]
}
```

#### 2.2 Run Migration

```bash
npx prisma migrate dev --name add_auth
npx prisma generate
```

---

### Phase 3: NextAuth Configuration (2 hours)

#### 3.1 Create API Route

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.restaurantId = user.restaurantId
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 3.2 Create Auth Context

Create `lib/auth.ts`:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}
```

---

### Phase 4: Login Pages (3 hours)

#### 4.1 Sign In Page

Create `app/auth/signin/page.tsx`:

```typescript
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await signIn('email', {
      email,
      callbackUrl: '/admin',
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          QR Menu Admin Girişi
        </h1>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              E-posta Adresiniz
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Giriş Linki Gönder'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            Google ile Giriş Yap
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

---

### Phase 5: Protect Routes (4 hours)

#### 5.1 Update Middleware

Update `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit, getClientIdentifier } from './lib/rate-limit'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Check if user has admin role
    if (token.role !== 'admin' && token.role !== 'owner') {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
    }
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip auth routes
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    // Require authentication for mutating operations
    const isWriteOperation = ['POST', 'PUT', 'DELETE'].includes(request.method)

    if (isWriteOperation && !token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const identifier = token?.email || getClientIdentifier(request)
    const result = rateLimit(identifier, {
      limit: isWriteOperation ? 20 : 60,
      window: 60
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
```

#### 5.2 Protect API Routes

Update each API route to check session:

```typescript
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Check authentication
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user owns this restaurant
  if (user.restaurantId !== restaurantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ... rest of the code
}
```

---

### Phase 6: Update Admin Layout (1 hour)

#### 6.1 Add Session Provider

Update `app/admin/layout.tsx`:

```typescript
import { SessionProvider } from '@/components/SessionProvider'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <SessionProvider session={session}>
      {/* ... existing layout code ... */}

      {/* Add user menu */}
      <UserMenu user={session?.user} />

      {children}
    </SessionProvider>
  )
}
```

#### 6.2 Create User Menu Component

```typescript
'use client'

import { signOut } from 'next-auth/react'
import { User } from 'next-auth'

export function UserMenu({ user }: { user?: User }) {
  if (!user) return null

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">{user.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-sm text-red-600 hover:underline"
      >
        Çıkış Yap
      </button>
    </div>
  )
}
```

---

### Phase 7: CSRF Protection (2 hours)

#### 7.1 Install Dependencies

```bash
npm install csrf
```

#### 7.2 Add CSRF Middleware

Create `lib/csrf.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import csrf from 'csrf'

const tokens = new csrf()
const secret = process.env.CSRF_SECRET!

export function generateCsrfToken(): string {
  return tokens.create(secret)
}

export function verifyCsrfToken(token: string): boolean {
  return tokens.verify(secret, token)
}

export function csrfProtection(request: NextRequest): NextResponse | null {
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token')

    if (!csrfToken || !verifyCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
  }

  return null
}
```

#### 7.3 Update API Routes

```typescript
import { csrfProtection } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  // Check CSRF
  const csrfError = csrfProtection(request)
  if (csrfError) return csrfError

  // ... rest of the code
}
```

---

### Phase 8: Testing (2 hours)

#### 8.1 Manual Testing Checklist

- [ ] Sign in with email works
- [ ] Sign in with Google works
- [ ] Session persists across page reloads
- [ ] Unauthenticated users redirected to login
- [ ] Admin pages only accessible to admins
- [ ] API endpoints reject unauthorized requests
- [ ] Sign out works correctly
- [ ] CSRF tokens validated

#### 8.2 Automated Tests

Create `__tests__/auth.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('Authentication', () => {
  it('should redirect unauthenticated users', async () => {
    // Test implementation
  })

  it('should allow authenticated users', async () => {
    // Test implementation
  })

  it('should validate CSRF tokens', async () => {
    // Test implementation
  })
})
```

---

## 🔐 Security Considerations

### Password Storage
- ❌ Never store plain text passwords
- ✅ Use bcrypt with high cost factor
- ✅ NextAuth handles this automatically

### Session Management
- ✅ Use httpOnly cookies
- ✅ Set secure flag in production
- ✅ Implement session timeout
- ✅ Rotate session tokens

### API Security
- ✅ Validate all inputs
- ✅ Check user permissions
- ✅ Log security events
- ✅ Rate limit API requests

---

## 📊 Post-Implementation Checklist

After implementing authentication:

- [ ] All admin routes protected
- [ ] All API routes check authentication
- [ ] CSRF protection on all mutations
- [ ] Session management working
- [ ] User can sign in/out
- [ ] Password reset works
- [ ] Email verification works (optional)
- [ ] Role-based access control
- [ ] Security headers configured
- [ ] Audit logs implemented
- [ ] Error handling for auth failures
- [ ] Documentation updated

---

## 🚀 Deployment Notes

### Environment Variables (Production)

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-new-secret-for-production>
EMAIL_SERVER=smtp://production-smtp
DATABASE_URL=postgresql://production-db
```

### Database

- Ensure migrations run before deployment
- Back up database before auth changes
- Test with production-like data

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Email Provider Setup](https://next-auth.js.org/providers/email)
- [Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## ⏱️ Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Setup dependencies | 2 hours |
| 2 | Database schema | 1 hour |
| 3 | NextAuth config | 2 hours |
| 4 | Login pages | 3 hours |
| 5 | Protect routes | 4 hours |
| 6 | Admin layout | 1 hour |
| 7 | CSRF protection | 2 hours |
| 8 | Testing | 2 hours |
| **TOTAL** | | **17 hours (~2-3 days)** |

---

**Status:** Not Started
**Assigned To:** TBD
**Next Step:** Install dependencies and update environment variables
