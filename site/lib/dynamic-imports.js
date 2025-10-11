/**
 * Dynamic Import Example Components
 * Usage guide for lazy loading heavy components
 */

// Usage in pages:
// import dynamic from 'next/dynamic';
//
// const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
//   loading: () => <div className="loading-skeleton">Loading video player...</div>,
//   ssr: false,
// });
//
// const ImageGallery = dynamic(() => import('@/components/ImageGallery'), {
//   loading: () => <div className="loading-skeleton">Loading gallery...</div>,
// });
//
// const PhotoUpload = dynamic(() => import('@/components/PhotoUpload'), {
//   loading: () => <div className="loading-skeleton">Loading uploader...</div>,
// });

export const dynamicImportExamples = {
    videoPlayer: {
        component: 'VideoPlayer',
        import: "const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false });",
        reason: 'Heavy media player with controls',
    },
    imageGallery: {
        component: 'ImageGallery',
        import: "const ImageGallery = dynamic(() => import('@/components/ImageGallery'));",
        reason: 'Large component with image processing',
    },
    photoUpload: {
        component: 'PhotoUpload',
        import: "const PhotoUpload = dynamic(() => import('@/components/PhotoUpload'), { ssr: false });",
        reason: 'File upload requires browser APIs',
    },
    downloadAllPhotos: {
        component: 'DownloadAllPhotos',
        import:
            "const DownloadAllPhotos = dynamic(() => import('@/components/DownloadAllPhotos'), { ssr: false });",
        reason: 'JSZip library is large (70KB+)',
    },
    photoSlideshow: {
        component: 'PhotoSlideshow',
        import:
            "const PhotoSlideshow = dynamic(() => import('@/components/PhotoSlideshow'), { ssr: false });",
        reason: 'Fullscreen overlay not needed immediately',
    },
    videoChapters: {
        component: 'VideoChapters',
        import: "const VideoChapters = dynamic(() => import('@/components/VideoChapters'));",
        reason: 'Interactive video controls can be lazy loaded',
    },
};

// Loading skeleton styles
export const loadingSkeletonStyles = `
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s ease-in-out infinite;
    border-radius: 0.5rem;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 1.1rem;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
