# Next Steps After Migration

## Immediate Actions

### 1. Install Dependencies
```bash
cd mailg-next
npm install
```

### 2. Verify Environment Setup
Ensure `.dev.vars` file exists with required variables:
```
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=your_domain
MAILGUN_SIGNING_KEY=your_signing_key
```

### 3. Test Locally
```bash
npm run dev
# Visit http://localhost:3000
```

## Testing Checklist

- [ ] Home page redirects to `/inbox`
- [ ] Sidebar navigation works (Inbox, Starred, Sent, Drafts, Trash)
- [ ] Email list displays correctly
- [ ] Clicking email opens detail view
- [ ] Back button works in email detail
- [ ] Settings page loads and tabs work
- [ ] Compose window opens/closes/minimizes
- [ ] Search functionality works
- [ ] Star/unstar emails works
- [ ] Mark read/unread works
- [ ] Delete email works
- [ ] API endpoints respond correctly

## API Testing

### Test Email List
```bash
curl http://localhost:3000/api/emails
```

### Test Email Detail
```bash
curl http://localhost:3000/api/emails/message-id-here
```

### Test Webhook
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "from=test@example.com&subject=Test&body-plain=Test"
```

## Database Setup

Ensure D1 database is configured with required tables:

```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT UNIQUE NOT NULL,
  `from` TEXT,
  `to` TEXT,
  subject TEXT,
  sender TEXT,
  recipient TEXT,
  body_plain TEXT,
  body_html TEXT,
  stripped_text TEXT,
  stripped_html TEXT,
  stripped_signature TEXT,
  date TEXT,
  token TEXT,
  timestamp INTEGER,
  signature TEXT,
  message_headers TEXT,
  variables TEXT,
  received_at TEXT
);

CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT NOT NULL,
  r2_key TEXT,
  filename TEXT,
  content_type TEXT,
  size INTEGER,
  FOREIGN KEY (message_id) REFERENCES emails(message_id)
);

CREATE TABLE temp_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## R2 Bucket Setup

Ensure R2 bucket is configured:
- Bucket name: `misc` (or update in code)
- Binding name: `ATTACHMENTS`
- Public access: Configure as needed for your use case

## Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
npm run deploy
```

### Preview Deployment
```bash
npm run preview
```

## Monitoring & Debugging

### Enable Debug Logging
Add to API routes:
```typescript
console.log('Debug info:', data);
```

View logs:
```bash
npm run dev
# Logs appear in terminal
```

### Check Cloudflare Logs
```bash
wrangler tail
```

## Performance Optimization

1. **Image Optimization**
   - Replace `<img>` with Next.js `<Image>` component
   - Add `alt` text to all images

2. **Code Splitting**
   - Already handled by Next.js automatically
   - Use dynamic imports for large components if needed

3. **Caching**
   - Configure cache headers in API routes
   - Use Next.js built-in caching

4. **Database Queries**
   - Add indexes to frequently queried columns
   - Consider query optimization

## Security Considerations

1. **Environment Variables**
   - Never commit `.dev.vars` to git
   - Use Cloudflare secrets for production

2. **API Security**
   - Validate all inputs
   - Implement rate limiting if needed
   - Use HTTPS in production

3. **CORS**
   - Configure if needed for cross-origin requests
   - Add appropriate headers in API routes

4. **Authentication**
   - Consider adding user authentication
   - Implement session management if needed

## Known Limitations & Future Improvements

### Current Limitations
- Email read/unread status not persisted (stored in memory)
- Star/favorite status not persisted
- No user authentication
- No email sending from UI (compose window is UI-only)

### Recommended Improvements
1. Add database persistence for email metadata
2. Implement user authentication
3. Add email sending functionality
4. Implement email search with full-text search
5. Add email threading/conversations
6. Implement email labels/tags
7. Add email forwarding
8. Implement email templates

## Rollback Plan

If issues occur, you can revert to the original React version:

```bash
cd ../mailg
npm install
npm run dev
```

The original React app remains unchanged in the `mailg` directory.

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **D1 Database**: https://developers.cloudflare.com/d1/
- **R2 Storage**: https://developers.cloudflare.com/r2/
- **OpenNext**: https://opennext.js.org/

## Migration Completion Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Local development server running
- [ ] All pages accessible
- [ ] API endpoints working
- [ ] Database connected
- [ ] R2 storage connected
- [ ] Tests passing
- [ ] Build successful
- [ ] Deployment successful
- [ ] Production environment verified

## Questions or Issues?

Refer to:
1. `MIGRATION_SUMMARY.md` - Overview of changes
2. `MIGRATION_GUIDE.md` - Code pattern changes
3. Next.js documentation
4. Cloudflare documentation
