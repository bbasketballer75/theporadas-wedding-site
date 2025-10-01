# 💒 The Poradas Wedding Website

A modern, responsive wedding website built with Next.js 15.5.4 and Firebase. Share your special day with a beautiful gallery, interactive map, and event timeline.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange?logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 📸 **Photo Gallery**
- Beautiful grid layout with lazy loading
- Interactive Leaflet map showing photo locations
- Click photos to see location on map
- Responsive design for all devices

### 📅 **Event Timeline**
- Chronological display of wedding events
- Elegant card-based design
- Smooth scroll animations

### 🗺️ **Interactive Venue Map**
- Leaflet-powered interactive maps
- Venue location and directions
- Mobile-friendly navigation

### 📱 **Progressive Web App (PWA)**
- Install on mobile devices
- Offline support
- App-like experience

### 🔐 **Firebase Integration**
- Cloud Firestore database
- Firebase Storage for photos
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
- **Testing:** Playwright (84/90 tests passing - 93%)
- **Linting:** ESLint with TypeScript
- **Formatting:** Prettier
- **Package Manager:** npm

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

Server runs at: **http://localhost:3000**

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

## 🐛 Troubleshooting

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
