# Component Integration Guide

## POST-WEDDING Photo/Video Sharing Features

This guide shows how to integrate all 25 improvement components into your wedding website.

## Quick Integration Checklist

### Phase 1: Quick Wins ✅ COMPLETE
- [x] #23 Vercel Analytics - Already integrated in `_app.js`
- [x] #8 Bundle Analyzer - Run `npm run build:analyze`
- [x] #25 Sitemap - Auto-generates on build via `postbuild` script
- [x] #19 Environment Validation - Already imported in `_app.js`
- [x] #11 React Compiler - Enabled in `next.config.js`

### Phase 2: Media Features ✅ COMPLETE
All components created, ready for page integration:

#### 1. Download All Photos
```jsx
import DownloadAllPhotos from '@/components/DownloadAllPhotos';

<DownloadAllPhotos photos={galleryPhotos} />
```

#### 2. Gallery Search/Filter
```jsx
import GallerySearch from '@/components/GallerySearch';

const [filteredPhotos, setFilteredPhotos] = useState(allPhotos);

<GallerySearch 
  photos={allPhotos} 
  onFilteredPhotos={setFilteredPhotos} 
/>
```

#### 3. Photo Slideshow
```jsx
import PhotoSlideshow from '@/components/PhotoSlideshow';

const [showSlideshow, setShowSlideshow] = useState(false);
const [startIndex, setStartIndex] = useState(0);

{showSlideshow && (
  <PhotoSlideshow
    photos={photos}
    startIndex={startIndex}
    onClose={() => setShowSlideshow(false)}
  />
)}
```

#### 4. Video Chapters
```jsx
import VideoChapters from '@/components/VideoChapters';

const chapters = [
  { title: 'Pre-Ceremony', time: 0, description: 'Getting ready' },
  { title: 'Ceremony', time: 300, description: 'Wedding ceremony' },
  { title: 'Reception', time: 2700, description: 'Dinner and celebration' },
  // ... more chapters
];

<VideoChapters videoSrc="/videos/wedding-full.mp4" chapters={chapters} />
```

### Phase 3: Performance ✅ COMPLETE

#### 5. Dynamic Imports
```jsx
// In pages/gallery.js
import dynamic from 'next/dynamic';

const ImageGallery = dynamic(() => import('@/components/ImageGallery'), {
  loading: () => <div className="loading-skeleton">Loading gallery...</div>,
});

const DownloadAllPhotos = dynamic(() => import('@/components/DownloadAllPhotos'), {
  ssr: false, // JSZip is client-only
});
```

#### 6. Progressive Image Loading
```jsx
import { ProgressiveFirebaseImage } from '@/components/ProgressiveImage';

<ProgressiveFirebaseImage
  src={photo.url}
  alt={photo.name}
/>
```

### Phase 4: Engagement ✅ COMPLETE

#### 7. Social Sharing
```jsx
import SocialShare from '@/components/SocialShare';

<SocialShare
  url={`https://theporadas.com/gallery/${photo.id}`}
  title="The Poradas Wedding - Beautiful Moment"
  description="Check out this photo from our wedding!"
  imageUrl={photo.url}
/>
```

#### 8. Photo Comments
```jsx
import PhotoComments from '@/components/PhotoComments';

<PhotoComments photoId={photo.id} />
```

#### 9. Favorite Photos
```jsx
import FavoritePhotos, { FavoriteButton } from '@/components/FavoritePhotos';

// Full favorites page
<FavoritePhotos photos={allPhotos} />

// Or individual favorite button on each photo
<FavoriteButton photoId={photo.id} />
```

#### 10. Upload Progress
```jsx
import UploadProgress, { useUploadProgress } from '@/components/UploadProgress';

const { uploads, addUpload, updateProgress, setSuccess, setError } = useUploadProgress();

// Start upload
const uploadId = Date.now().toString();
addUpload(uploadId, file.name, file.size);

// Update progress (0-100)
uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    updateProgress(uploadId, progress);
  },
  (error) => setError(uploadId, error.message),
  () => setSuccess(uploadId)
);

// Render progress toasts
<UploadProgress uploads={uploads} />
```

### Phase 5: Quality (Remaining)

#### 11. Video Embedding ✅ COMPLETE
```jsx
import VideoEmbed, { VideoGallery } from '@/components/VideoEmbed';

// Single video
<VideoEmbed 
  url="https://www.youtube.com/watch?v=VIDEO_ID" 
  title="Our Wedding Day"
/>

// Multiple videos
<VideoGallery videos={[
  { url: 'https://youtu.be/...', title: 'Ceremony', description: '...' },
  { url: 'https://vimeo.com/...', title: 'Reception', description: '...' },
]} />
```

## Page Integration Examples

### Gallery Page (`pages/gallery.js`)
```jsx
import { useState } from 'react';
import dynamic from 'next/dynamic';
import GallerySearch from '@/components/GallerySearch';
import { ProgressiveFirebaseImage } from '@/components/ProgressiveImage';
import { FavoriteButton } from '@/components/FavoritePhotos';
import SocialShare from '@/components/SocialShare';

const DownloadAllPhotos = dynamic(() => import('@/components/DownloadAllPhotos'), { ssr: false });
const PhotoSlideshow = dynamic(() => import('@/components/PhotoSlideshow'), { ssr: false });
const PhotoComments = dynamic(() => import('@/components/PhotoComments'));

export default function GalleryPage({ photos }) {
  const [filteredPhotos, setFilteredPhotos] = useState(photos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);

  return (
    <div className="gallery-page">
      <h1>Wedding Photo Gallery</h1>
      
      <GallerySearch photos={photos} onFilteredPhotos={setFilteredPhotos} />
      
      <DownloadAllPhotos photos={filteredPhotos} />
      
      <div className="gallery-grid">
        {filteredPhotos.map((photo, index) => (
          <div key={photo.id} className="photo-card">
            <ProgressiveFirebaseImage
              src={photo.url}
              alt={photo.name}
              onClick={() => {
                setSelectedPhoto(photo);
                setShowSlideshow(true);
              }}
            />
            <FavoriteButton photoId={photo.id} />
          </div>
        ))}
      </div>

      {showSlideshow && (
        <PhotoSlideshow
          photos={filteredPhotos}
          startIndex={filteredPhotos.findIndex(p => p.id === selectedPhoto.id)}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      {selectedPhoto && (
        <div className="photo-details">
          <SocialShare
            url={`https://theporadas.com/gallery/${selectedPhoto.id}`}
            title={`The Poradas Wedding - ${selectedPhoto.name}`}
            description="Check out this photo from our wedding!"
            imageUrl={selectedPhoto.url}
          />
          <PhotoComments photoId={selectedPhoto.id} />
        </div>
      )}
    </div>
  );
}
```

### Video Page (`pages/video.js`)
```jsx
import VideoChapters from '@/components/VideoChapters';
import VideoEmbed, { VideoGallery } from '@/components/VideoEmbed';

export default function VideoPage() {
  const mainVideo = '/videos/wedding-full.mp4';
  
  const chapters = [
    { title: 'Pre-Ceremony', time: 0, description: 'Getting ready and arrival' },
    { title: 'Ceremony', time: 300, description: 'Wedding ceremony' },
    { title: 'Cocktail Hour', time: 1800, description: 'Drinks and mingling' },
    { title: 'Reception', time: 2700, description: 'Dinner and celebration' },
    { title: 'First Dance', time: 4200, description: 'Our first dance' },
    { title: 'Speeches', time: 4800, description: 'Toasts from friends and family' },
    { title: 'Party', time: 6000, description: 'Dancing and celebration' },
  ];

  const extraVideos = [
    { url: 'https://youtu.be/...', title: 'Ceremony Highlights', description: 'Best moments from the ceremony' },
    { url: 'https://vimeo.com/...', title: 'Reception Party', description: 'Dance floor fun' },
  ];

  return (
    <div className="video-page">
      <h1>Our Wedding Video</h1>
      
      <VideoChapters videoSrc={mainVideo} chapters={chapters} />
      
      {extraVideos.length > 0 && (
        <>
          <h2 style={{ marginTop: '4rem' }}>More Videos</h2>
          <VideoGallery videos={extraVideos} />
        </>
      )}
    </div>
  );
}
```

### Upload Page (`pages/upload.js`)
```jsx
import { useState } from 'react';
import UploadProgress, { useUploadProgress } from '@/components/UploadProgress';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function UploadPage() {
  const { uploads, addUpload, updateProgress, setSuccess, setError } = useUploadProgress();

  const handleFileUpload = async (file) => {
    const uploadId = Date.now().toString();
    addUpload(uploadId, file.name, file.size);

    const storageRef = ref(storage, `guest-photos/${uploadId}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        updateProgress(uploadId, progress);
      },
      (error) => {
        setError(uploadId, error.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setSuccess(uploadId);
        // Save to Firestore...
      }
    );
  };

  return (
    <div className="upload-page">
      <h1>Share Your Photos</h1>
      {/* File upload UI */}
      <UploadProgress uploads={uploads} />
    </div>
  );
}
```

## Next Steps (Remaining Improvements)

### 1. Font Loading Optimization (#12)
Already using `next/font` in `_app.js`. Further optimization:
- Add `preload` to critical fonts
- Subset fonts to only needed characters
- Add font-display: swap (already set)

### 2. CDN Optimization (#13)
Configure in `next.config.js`:
```js
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
    },
  ],
},
```

### 3. Photo Metadata (#7)
Add EXIF data extraction using `exif-js` or `exifr`:
```js
import exifr from 'exifr';

const metadata = await exifr.parse(file);
// Display: metadata.DateTimeOriginal, metadata.GPSLatitude, etc.
```

### 4. Guest Photo Wall (#18)
Use Masonry layout with `react-masonry-css`:
```jsx
import Masonry from 'react-masonry-css';

<Masonry
  breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
  className="masonry-grid"
  columnClassName="masonry-column"
>
  {photos.map(photo => <PhotoCard key={photo.id} photo={photo} />)}
</Masonry>
```

### 5. Husky Pre-commit (#20)
```bash
npm install --save-dev husky lint-staged
npx husky init
```

### 6. TypeScript Interfaces (#21)
Add to existing components or create `types/index.ts`

### 7. VS Code Snippets (#22)
Create `.vscode/snippets.code-snippets`

### 8. Structured Data (#24)
Add to `_app.js` or page-level:
```jsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "The Poradas Wedding",
  "startDate": "2025-05-10",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Wedding Venue Name"
  }
})}
</script>
```

## Performance Testing

Run these commands to verify improvements:

```bash
# Bundle size analysis
npm run build:analyze

# Lighthouse audit
npx lighthouse https://theporadas.com --view

# Check sitemap
curl https://theporadas.com/sitemap.xml
```

## Firestore Rules for Comments

Add to `firestore.rules`:
```
match /photos/{photoId}/comments/{commentId} {
  allow read: if true;
  allow create: if request.auth != null || request.resource.data.userName is string;
  allow update, delete: if false;
}
```

## Environment Variables Reminder

All 7 Firebase variables already configured in Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

---

**Progress: 16/25 improvements completed (64%)**
**Remaining: 9 improvements (font loading, CDN, metadata, photo wall, Husky, TypeScript, snippets, structured data, video player optimization)**
