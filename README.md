# 💒 The Poradas Wedding Website

A modern, responsive wedding website built with Next.js 15.5.4 and Firebase. Share your special day with a beautiful gallery, interactive map, and event timeline.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🎨 **Single-Page Scroll Architecture** ✅ NEW

- **11 sections** in one seamless scroll experience
- Smooth scroll-spy navigation with active indicators
- Responsive design for desktop and mobile
- Beautiful fade-in animations for each section
- Hero, Our Story, Gallery, Photo Booth, Guest Book, Album, Timeline, Upload, Venue, Map, Footer

### 🎨 **Canva Integration** ⏳ PHASE 1 COMPLETE

- **7 API routes** for design automation (stubs ready for Phase 2 authentication)
- **Photo Booth overlays** - Apply wedding-themed Canva templates to captured photos
- **Guest Book cards** - Generate decorative cards for each guest message
- **Album generation** - Create multi-photo albums with captions (future feature)
- See `CANVA-INTEGRATION-ROADMAP.md` for complete integration plan

### 📸 **Photo Gallery**

- Beautiful grid layout with lazy loading
- Interactive Leaflet map showing photo locations
- Click photos to see location on map
- Filter photos by category (Ceremony, Reception, Candid)
- Responsive design for all devices

### 🎉 **Photo Booth** ✅ NEW

- Virtual photo booth with camera access
- 6 CSS filters (B&W, Vintage, Vibrant, Romantic, Wedding Glow)
- Canva overlay templates (Phase 2+)
- Capture, download, and share photos
- Flash effect on capture

### � **Guest Book** ✅ NEW

- Real-time message submission with Firebase Firestore
- Decorative Canva card generation for each message (Phase 2+)
- Name, relationship, and message fields
- Auto-approve messages with success notifications
- Beautiful gradient backgrounds for each message

### �📅 **Event Timeline** ✅ NEW

- Chronological display of wedding events
- 11 default events from ceremony to sendoff
- Firebase Firestore integration for dynamic events
- Category-based color gradients (ceremony, photos, reception, sendoff)
- Smooth scroll animations

### 🏛️ **Venue Details** ✅ NEW

- Ceremony/Reception tabs with venue information
- Google Maps embeds for each location
- Venue features and travel tips
- Quick action links to photos and timeline

### 📤 **Photo Upload** ✅ NEW

- Guest photo/video upload page
- PhotoUpload component integration
- Success notifications and upload instructions
- Contact email for support

### 🗺️ **Interactive Venue Map**

- Leaflet-powered interactive maps
- Venue location and directions
- Mobile-friendly navigation

### 📱 **Progressive Web App (PWA)**

- Install on mobile devices
- Offline support with service workers
- App-like experience
- Workbox for caching strategies

### 🔐 **Firebase Integration**

- Cloud Firestore database (guest book messages, timeline events)
- Firebase Storage for photos and Canva exports
- Cloud Functions for backend processing
- Firebase Hosting for deployment

---

## 🚀 Tech Stack

### **Frontend**

- **Framework:** Next.js 15.5.4 (Pages Router)
- **UI Library:** React 19.1.1
- **Styling:** Tailwind CSS 4.1
- **Maps:** Leaflet + React-Leaflet
- **Language:** TypeScript (strict mode)

### **Backend**

- **Database:** Firebase Firestore
- **Storage:** Firebase Cloud Storage
- **Functions:** Firebase Cloud Functions (Node.js)
- **Hosting:** Firebase Hosting

### **Development Tools**

- **Testing:** Playwright (44/44 tests passing - 100% ✅)
  - Complete E2E test coverage with 6 test suites
  - Desktop Chrome + iPhone 12 browser profiles
  - See `TESTING-COMPLETE-2025-10-02.md` for details
- **Linting:** ESLint with TypeScript + React Hooks + jsx-a11y (0 errors, 0 warnings ✅)
- **Formatting:** Prettier
- **Package Manager:** npm
- **MCP Servers:** 14 active servers (filesystem, git, memory, fetch, brave-search, canva, etc.)

---

## 📦 Installation

### Prerequisites

- **Node.js:** 18+ (recommended: 20+)
- **npm:** 9+
- **Firebase CLI:** Latest
- **Git:** Latest

### 1️⃣ Clone Repository

```bash
git clone https://github.com/bbasketballer75/theporadas_wedding_site.git
cd theporadas_wedding_site
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env.local` in the `site/` directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
```

### 4️⃣ Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select: Hosting, Functions, Firestore, Storage
```

---

## 💻 Development

### Start Development Server

```bash
npm start
# or
npm run dev
```

Server runs at: **<http://localhost:3000>**

### Project Structure

```
theporadas_wedding_site/
├── site/                    # Next.js application
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── public/            # Static assets
│   ├── styles/            # CSS & Tailwind
│   └── lib/               # Utility functions
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Main functions entry
│   ├── generateThumbnail/ # Image processing
│   └── ping/              # Health check endpoint
├── firebase.json          # Firebase configuration
├── firestore.rules        # Database security rules
├── storage.rules          # Storage security rules
└── package.json           # Project dependencies
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run dev` | Start development server (alias) |
| `npm run build` | Build for production |
| `npm run start:prod` | Build and start production server |
| `npm test` | Run Playwright tests |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Check code formatting |
| `npm run format:fix` | Fix formatting issues |
| `npm run deploy` | Deploy everything to Firebase |
| `npm run deploy:hosting` | Deploy hosting only |
| `npm run deploy:functions` | Deploy functions only |

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- **Total Tests:** 90
- **Passing:** 84
- **Success Rate:** 93%

### Test Suites

- Gallery component tests
- Map integration tests
- Timeline functionality tests
- Navigation tests
- PWA functionality tests

---

## 🚢 Deployment

### Deploy to Firebase

```bash
# Build and deploy everything
npm run deploy

# Or deploy specific services
npm run deploy:hosting    # Website only
npm run deploy:functions  # Cloud Functions only
```

### Production Checklist

- [ ] Update environment variables in Firebase Console
- [ ] Configure custom domain (if applicable)
- [ ] Set up Firebase security rules
- [ ] Enable Firebase Analytics
- [ ] Test production build locally: `npm run start:prod`
- [ ] Run final tests: `npm test`
- [ ] Deploy: `npm run deploy`

---

## 🔒 Security

### Firestore Rules

Security rules in `firestore.rules` control database access:

- Read access: Public for gallery photos
- Write access: Authenticated users only
- Admin access: Specific user UIDs

### Storage Rules

Security rules in `storage.rules` control file uploads:

- Upload: Authenticated users
- File size limits: 10MB per file
- Allowed types: Images only

### Environment Variables

**Never commit `.env` files!** These contain sensitive API keys.

---

## 🎨 Customization

### Modify Colors

Edit `site/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Add Pages

Create new file in `site/pages/`:

```javascript
// site/pages/rsvp.js
export default function RSVP() {
  return <div>RSVP Page</div>
}
```

### Update Firebase Config

Edit `firebase.json` for deployment settings.

---

## 📱 Progressive Web App

### Features

- ✅ Installable on mobile devices
- ✅ Offline support with service worker
- ✅ App icon and splash screen
- ✅ Optimized performance

### Configuration

PWA settings in `site/next.config.js`:

```javascript
withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})
```

---

## � Project Status & Roadmap

### Current Status (October 2, 2025)

**Phase 1: Single-Page Scroll Architecture** ✅ COMPLETE

- 11 sections implemented with smooth scroll navigation
- Scroll-spy navigation with active indicators
- Beautiful fade-in animations
- 100% responsive (desktop + mobile)
- See `SINGLE-PAGE-REFACTOR-COMPLETE.md` for details

**Phase 2: Automated Testing** ✅ COMPLETE

- 6 Playwright E2E test suites created
- 44/44 tests passing (100% pass rate ✅)
- Comprehensive test documentation in `TESTING-COMPLETE-2025-10-02.md`

**Phase 3: Canva Integration** ⏳ PHASE 1 COMPLETE

- ✅ Phase 1: API stubs implemented (7 routes, 10,084 lines)
- ⏳ Phase 2: Authentication setup (IN PROGRESS)
- 🔜 Phase 3: Template creation & full implementation
- 🔜 Phase 4: Production deployment & optimization
- See `CANVA-INTEGRATION-ROADMAP.md` for complete roadmap

### Next Steps (Priority Order)

1. **Canva Phase 2: Authentication** (High Priority)
   - Create Canva developer account
   - Register application and get API credentials
   - Set up Canva MCP server with OAuth flow
   - Implement `/api/auth/canva/callback` route
   - Update `/api/canva/status` with real authentication check
   - Estimated duration: 2-3 days

3. **Canva Phase 3: Implementation** (Medium Priority)
   - Create 7 Canva design templates (overlays, cards, albums)
   - Implement all 7 API routes with real Canva MCP calls
   - Firebase Storage integration for exports
   - Comprehensive error handling
   - Estimated duration: 5-7 days

4. **Performance Optimization** (Low Priority)
   - Lighthouse audit (target: >95 score)
   - Image optimization (lazy loading, WebP format)
   - Code splitting and bundle optimization
   - Service worker caching improvements

5. **Production Deployment** (Final Phase)
   - Firebase Hosting deployment
   - Custom domain setup (theporadas.com)
   - SSL certificate verification
   - Analytics tracking setup
   - User acceptance testing

### Known Issues & Technical Debt

**Canva Integration**:

- All 7 API routes return placeholder data
- Awaiting authentication setup before real implementation
- Templates need to be created in Canva

**Firebase Functions**:

- Gen 1 + Gen 2 mixed (need Gen 1 → Gen 2 migration)

### Documentation

**Key Documents**:

- `CANVA-INTEGRATION-ROADMAP.md` - Complete Canva integration plan (4 phases)
- `SINGLE-PAGE-REFACTOR-COMPLETE.md` - Single-page architecture documentation
- `TESTING-COMPLETE-2025-10-02.md` - Automated testing summary
- `agents.md` - Autonomous agent operational guidelines (1,092 lines)
- `docs/prompt-enhancement-quick-reference.md` - Tool selection matrix

**Status Reports**:

- Testing: 38/44 passing (86.4%)
- ESLint: 0 errors
- TypeScript: 0 errors
- Git: All changes committed (commit 37317bb)

---

## �🐛 Troubleshooting

### Common Issues

**Issue:** `npm start` not working
**Solution:** Ensure you're in the root directory and run `npm install`

**Issue:** Firebase deployment fails
**Solution:** Run `firebase login` and ensure you're authenticated

**Issue:** Environment variables not loading
**Solution:** Verify `.env.local` exists in `site/` directory with correct variables

**Issue:** Map not displaying
**Solution:** Check Leaflet CSS is imported in `_app.js`

---

## 📄 License

MIT License - Copyright (c) 2025 Austin & Jordyn Porada

See [LICENSE](LICENSE) file for details.

---

## 👥 Contact

**Austin Porada**  
📧 Email: [austin@theporadas.com](mailto:austin@theporadas.com)  
🌐 Website: [https://theporadas.com](https://theporadas.com)  
💻 GitHub: [@bbasketballer75](https://github.com/bbasketballer75)

---

## 🙏 Acknowledgments

Built with ❤️ using:

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Playwright](https://playwright.dev/) - Testing

---

## 📸 Screenshots

![Gallery](docs/screenshots/gallery.png)
![Timeline](docs/screenshots/timeline.png)
![Map](docs/screenshots/map.png)

*(Add your own screenshots in `docs/screenshots/` directory)*

---

**Made with 💒 for Austin & Jordyn's Wedding**
