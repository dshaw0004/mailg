# React to Next.js Migration Summary

## Overview
Successfully migrated the Mailg email client from a React + Vite + React Router application to a Next.js application with API routes replacing Cloudflare Workers functions.

## Key Changes

### 1. Routing Migration
**Before (React Router):**
- Used `react-router-dom` with `<Routes>` and `<Route>` components
- Client-side routing with `useNavigate()` hook
- App.tsx contained all route definitions

**After (Next.js):**
- File-based routing in `/src/app` directory
- Routes automatically generated from file structure
- Dynamic routes using `[param]` syntax
- Server-side rendering with client components where needed

### 2. Page Structure
Created new page components in the app directory:

```
src/app/
├── page.tsx                    # Root page (redirects to /inbox)
├── [folder]/page.tsx           # Dynamic folder route (inbox, sent, drafts, etc.)
├── mail/[id]/page.tsx          # Email detail page
├── settings/page.tsx           # Settings page
└── api/                        # API routes
    ├── emails/route.ts         # GET/POST emails
    ├── emails/[id]/route.ts    # GET email by ID
    ├── attachments/[...key]/route.ts  # GET attachment
    └── webhook/route.ts        # POST webhook
```

### 3. Component Updates
All components updated to use Next.js patterns:

- **Header.tsx**: Changed from `useNavigate()` to `useRouter()` from `next/navigation`
- **Sidebar.tsx**: Changed from `NavLink` to Next.js `Link` component, `useLocation()` to `usePathname()`
- **Layout.tsx**: Added `"use client"` directive for client-side rendering
- **ComposeWindow.tsx**: Added `"use client"` directive
- **Page Components**: Moved to `src/components/pages/` and wrapped with `"use client"` directive

### 4. API Routes
Converted Cloudflare Workers functions to Next.js API routes:

**Emails API** (`/api/emails`):
- GET: List all emails with attachment count
- POST: Send email via Mailgun

**Email Detail API** (`/api/emails/[id]`):
- GET: Fetch specific email with attachments

**Attachments API** (`/api/attachments/[...key]`):
- GET: Download attachment from R2 storage
- Uses catch-all route for nested paths

**Webhook API** (`/api/webhook`):
- POST: Receive emails from Mailgun
- Verifies HMAC-SHA256 signature
- Stores email in D1 database
- Uploads attachments to R2

### 5. Context & State Management
- **MailContext.tsx**: Added `"use client"` directive, updated imports to use `@/` aliases
- All hooks remain the same (useState, useEffect, useCallback, useContext)
- API calls remain unchanged (fetch to `/api/` endpoints)

### 6. Dependencies
**Removed:**
- `react-router-dom` (no longer needed)

**Already Present:**
- `next` (16.2.3)
- `react` (19.1.5)
- `react-dom` (19.1.5)
- `clsx` (2.1.1)
- `lucide-react` (1.8.0)
- `@opennextjs/cloudflare` (1.19.1)

### 7. Path Aliases
Using `@/` path aliases for cleaner imports:
- `@/components` → `src/components`
- `@/context` → `src/context`
- `@/utils` → `src/utils`

## File Structure

```
mailg-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with MailProvider
│   │   ├── page.tsx                # Home page (redirect)
│   │   ├── [folder]/page.tsx       # Mailbox page
│   │   ├── mail/[id]/page.tsx      # Email detail page
│   │   ├── settings/page.tsx       # Settings page
│   │   ├── globals.css             # Global styles
│   │   └── api/
│   │       ├── emails/route.ts
│   │       ├── emails/[id]/route.ts
│   │       ├── attachments/[...key]/route.ts
│   │       └── webhook/route.ts
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ComposeWindow.tsx
│   │   └── pages/
│   │       ├── Mailbox.tsx
│   │       ├── MailDetail.tsx
│   │       └── Settings.tsx
│   ├── context/
│   │   └── MailContext.tsx
│   └── utils/
│       ├── helpers.ts
│       └── mailHelpers.ts
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── package.json
├── next.config.ts
├── tsconfig.json
└── wrangler.jsonc
```

## Migration Checklist

✅ Removed React Router dependencies
✅ Created Next.js page structure
✅ Converted API routes from Cloudflare Workers to Next.js handlers
✅ Updated all navigation to use Next.js routing
✅ Added "use client" directives where needed
✅ Updated imports to use path aliases
✅ Maintained all UI components unchanged
✅ Preserved all business logic
✅ Kept Cloudflare integration (D1, R2, Wrangler)

## Running the Application

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Deploy to Cloudflare
npm run deploy
```

## Notes

- All frontend UI remains identical to the original React version
- API endpoints are now served from Next.js instead of Cloudflare Workers
- The application still uses Cloudflare D1 for database and R2 for file storage
- Environment variables are configured via `.dev.vars` and Cloudflare settings
- The migration maintains full feature parity with the original application
