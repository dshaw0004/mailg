# Migration Guide: React to Next.js

## Quick Reference

### Navigation Changes

**React Router (Old)**
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/inbox');
navigate(-1); // Go back
```

**Next.js (New)**
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/inbox');
router.back(); // Go back
```

### Link Components

**React Router (Old)**
```tsx
import { NavLink } from 'react-router-dom';

<NavLink to="/inbox" className={({ isActive }) => isActive ? 'active' : ''}>
  Inbox
</NavLink>
```

**Next.js (New)**
```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pathname = usePathname();
const isActive = pathname.startsWith('/inbox');

<Link href="/inbox" className={isActive ? 'active' : ''}>
  Inbox
</Link>
```

### Route Parameters

**React Router (Old)**
```tsx
import { useParams } from 'react-router-dom';

const { id } = useParams();
```

**Next.js (New)**
```tsx
// In page component
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// In client component with useRouter
import { useSearchParams } from 'next/navigation';
// Or pass as prop from page component
```

### API Routes

**Cloudflare Workers (Old)**
```typescript
export const config = {
  path: "/api/emails",
};

export const onRequest = [handler];
```

**Next.js (New)**
```typescript
export async function GET(request: NextRequest) {
  // Handle GET
}

export async function POST(request: NextRequest) {
  // Handle POST
}
```

### Client Components

All interactive components need `"use client"` directive:

```tsx
"use client";

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState('');
  // ...
}
```

### Environment Variables

**Cloudflare (Old)**
```typescript
interface Env {
  DB: D1Database;
  ATTACHMENTS: R2Bucket;
}

const env = context.env as Env;
```

**Next.js (New)**
```typescript
interface Env {
  DB: D1Database;
  ATTACHMENTS: R2Bucket;
}

const env = process.env as any as Env;
```

## File Structure Mapping

| Old Path | New Path | Notes |
|----------|----------|-------|
| `src/pages/Mailbox.tsx` | `src/components/pages/Mailbox.tsx` | Now a client component |
| `src/pages/MailDetail.tsx` | `src/components/pages/MailDetail.tsx` | Now a client component |
| `src/pages/Settings.tsx` | `src/components/pages/Settings.tsx` | Now a client component |
| `functions/api/emails.ts` | `src/app/api/emails/route.ts` | API route handler |
| `functions/webhook.ts` | `src/app/api/webhook/route.ts` | Webhook handler |
| App routing | `src/app/[folder]/page.tsx` | Dynamic folder route |
| Mail detail route | `src/app/mail/[id]/page.tsx` | Dynamic mail ID route |

## Common Patterns

### Fetching Data

```tsx
// Client component
"use client";

import { useEffect, useState } from 'react';

export default function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/emails')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{/* render data */}</div>;
}
```

### Handling Forms

```tsx
"use client";

import { useState } from 'react';

export default function Form() {
  const [formData, setFormData] = useState({ to: '', subject: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    // Handle result
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Dynamic Routes

```tsx
// src/app/mail/[id]/page.tsx
"use client";

export default function MailPage({ params }: { params: { id: string } }) {
  return <MailDetail id={params.id} />;
}
```

## Deployment

### Local Development
```bash
npm run dev
# App runs on http://localhost:3000
```

### Build & Deploy to Cloudflare
```bash
npm run build
npm run deploy
```

## Troubleshooting

### Issue: "useRouter is not available in server components"
**Solution:** Add `"use client"` directive at the top of the file

### Issue: "Cannot find module '@/components'"
**Solution:** Check `tsconfig.json` has path aliases configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: API route not found
**Solution:** Ensure file is in `src/app/api/` directory with correct naming:
- `route.ts` for `/api/endpoint`
- `[param]/route.ts` for `/api/endpoint/value`
- `[...slug]/route.ts` for catch-all routes

## Performance Tips

1. Use `"use client"` only where needed (interactive components)
2. Keep server components for data fetching when possible
3. Use Next.js Image component for images
4. Leverage automatic code splitting
5. Use dynamic imports for large components

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
