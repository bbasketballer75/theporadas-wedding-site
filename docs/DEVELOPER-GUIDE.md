# Developer Guide - The Poradas Wedding Site

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/bbasketballer75/theporadas-wedding-site.git
cd theporadas-wedding-site

# Install dependencies
cd site
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server (with Turbopack)
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
wedding-website/
├── site/                    # Next.js application
│   ├── components/          # React components
│   │   ├── sections/        # Page sections (Hero, Gallery, Video, etc.)
│   │   ├── admin/           # Admin dashboard components
│   │   └── ...              # Shared components (Lightbox, PhotoUpload, etc.)
│   ├── pages/               # Next.js pages and API routes
│   │   ├── api/             # API endpoints (Canva, Firebase operations)
│   │   ├── _app.js          # App wrapper with fonts and analytics
│   │   ├── _document.js     # HTML document with CSP and meta tags
│   │   └── index.js         # Homepage
│   ├── lib/                 # Utility libraries
│   │   ├── firebase.js      # Firebase client initialization
│   │   ├── analytics.js     # Firebase Analytics events
│   │   ├── imageCompression.js  # Image optimization
│   │   ├── imagePrefetch.js     # Intelligent prefetching
│   │   ├── apiCache.js      # API response caching
│   │   └── rateLimit.js     # API rate limiting
│   ├── styles/              # Global CSS and Tailwind
│   ├── public/              # Static assets (icons, manifest, robots.txt)
│   └── utils/               # Helper functions (Canva auth, etc.)
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
├── githooks/                # Git hooks (pre-commit, pre-push)
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── firestore.indexes.json   # Firestore indexes
```

## 🛠️ Development Workflow

### 1. Install VS Code Extensions (Recommended)

Open `.vscode/extensions.json` for full list. Key extensions:

- **Core**: ESLint, Prettier, TypeScript
- **React/Next.js**: React snippets, Tailwind IntelliSense
- **Firebase**: VSFire, DBCode
- **AI**: GitHub Copilot, MCP extensions
- **Quality**: Error Lens, Import Cost, Playwright

### 2. Configure Git Hooks

```bash
# Set up pre-commit and pre-push hooks
git config core.hooksPath githooks
chmod +x githooks/pre-commit
chmod +x githooks/pre-push
```

**Pre-commit**: Lints staged files (ESLint, TypeScript type checking)  
**Pre-push**: Verifies Next.js config and webpack injection

### 3. Development Commands

```bash
# Development server (Turbopack - 5x faster)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Verify Next.js config (no webpack injection)
npm run verify:next-config
```

### 4. Firebase Commands

```bash
# Log in to Firebase
firebase login

# Deploy to Firebase Hosting
npm run deploy

# Start Firebase emulators (Firestore, Storage, Functions)
firebase emulators:start

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

## 🎨 Component Guidelines

### Component Structure

```jsx
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 * @returns {JSX.Element} Component
 */
export default function MyComponent({ title }) {
  // 1. State declarations
  const [state, setState] = useState(initialValue);

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 4. Render
  return (
    <div className="component-class">
      {/* JSX */}
    </div>
  );
}
```

### Styling Best Practices

- **Use Tailwind classes** for 90% of styling
- **Custom CSS** only for complex animations or global styles
- **Responsive design**: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Animations**: Use `transform` and `opacity` only (GPU-accelerated)
- **Colors**: Use design system variables (sage, blush, gold, ivory)

```jsx
// ✅ Good: Tailwind + responsive
<div className="flex flex-col md:flex-row gap-4 p-6 bg-ivory">

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### Performance Best Practices

1. **Lazy Load Components**: Use `dynamic()` for large components
2. **Image Optimization**: Always use Next/Image component
3. **Prefetch Adjacent Images**: Use `imagePrefetch` utility for galleries
4. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
5. **Error Boundaries**: Wrap sections in `<SectionErrorBoundary>`

## 🔐 Security

### Environment Variables

Never commit `.env` files. Use `.env.example` as template:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
...

# Canva Integration
CANVA_CLIENT_ID=your_client_id
CANVA_CLIENT_SECRET=your_client_secret
```

### Firestore Security Rules

- **Gallery uploads**: Public read, authenticated write (guest uploads)
- **Guestbook messages**: Public read/write with validation
- **Moderation**: Admin-only access (future feature)
- **Test collections**: Blocked in production

### API Rate Limiting

All API routes use `rateLimit` middleware:

```javascript
import { rateLimitMiddleware } from '../lib/rateLimit';

export default rateLimitMiddleware(handler, {
  maxRequests: 60, // 60 requests
  windowMs: 60000, // per minute
});
```

## 📊 Analytics

### Firebase Analytics Events

Tracked events (see `lib/analytics.js`):

- `page_view`: Page navigation
- `photo_upload`: Guest photo uploads
- `gallery_download`: ZIP download
- `guestbook_submission`: Guestbook message (conversion)
- `video_chapter_click`: Video chapter navigation (engagement)
- `social_share`: Social sharing (conversion)
- `pwa_install`: PWA install prompt (conversion)

### Web Vitals Monitoring

Automatic tracking of Core Web Vitals:

- **LCP** (Largest Contentful Paint): Target <2.5s
- **FID** (First Input Delay): Target <100ms
- **CLS** (Cumulative Layout Shift): Target <0.1
- **FCP** (First Contentful Paint): Target <1.8s
- **TTFB** (Time to First Byte): Target <800ms
- **INP** (Interaction to Next Paint): Target <200ms

## 🧪 Testing

### Unit Tests

```bash
# Run Jest unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test
npx playwright test scroll-spy.spec.js

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## 🚢 Deployment

### Automatic Deployment (Vercel)

Every push to `main` branch triggers automatic deployment:

1. Build Next.js application
2. Run pre-push checks (Next.js config, webpack audit)
3. Deploy to Vercel
4. Update production URL: https://wedding-website-sepia-ten.vercel.app

### Manual Deployment (Firebase)

```bash
# Build and deploy to Firebase Hosting
npm run deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules,storage:rules
firebase deploy --only firestore:indexes
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [GitHub Copilot](https://github.com/features/copilot)

## 🐛 Troubleshooting

### Common Issues

**1. `npx` PowerShell errors**

Use `npx.cmd` instead:

```bash
npx.cmd playwright test
```

**2. Firebase authentication errors**

Re-login:

```bash
firebase login --reauth
```

**3. Turbopack webpack warning**

Verify config:

```bash
npm run verify:next-config
```

**4. Port 3000 already in use**

Kill process:

```bash
npx kill-port 3000
```

**5. Module not found errors**

Clear cache and reinstall:

```bash
rm -rf node_modules .next
npm install
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with descriptive commits
3. Run tests: `npm test && npm run test:e2e`
4. Push and create pull request
5. Wait for CI/CD checks to pass

### Commit Message Format

```
feat: Add photo sharing feature
fix: Resolve lightbox navigation bug
docs: Update API documentation
style: Format code with Prettier
refactor: Simplify image upload logic
test: Add E2E tests for guestbook
chore: Update dependencies
```

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by Austin Porada for The Poradas Wedding**
