import Head from 'next/head';
import { useEffect, useState } from 'react';
import PhotoUpload from '../components/PhotoUpload';
import Skeleton from '../components/Skeleton';
import VideoPlayer from '../components/VideoPlayer';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate loading photos
    setTimeout(() => {
      setPhotos([
        {
          id: '1',
          originalPath: 'https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg',
          thumbnailPath: 'https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg',
          contentType: 'image/jpeg',
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    }, 500);

    // Check authentication (mock for now)
    setIsAuthenticated(true);
  }, []);

  const handleUploadComplete = (newPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <>
      <Head>
        <title>Photo Gallery - The Poradas Wedding</title>
        <meta name="description" content="Share and view photos from our wedding celebration" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-mint via-blush to-cream py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-6xl font-bold text-sage mb-4">Photo Gallery</h1>
            <p className="font-body text-xl text-blush">
              Share your favorite moments from our special day
            </p>
          </div>

          {/* Video Player Section */}
          <div className="mb-16">
            <h2 className="font-display text-4xl text-sage text-center mb-6">Wedding Video</h2>
            <VideoPlayer videoId="dQw4w9WgXcQ" title="Our Wedding Day" />
          </div>

          {/* Photo Upload Section */}
          {isAuthenticated && (
            <div className="mb-12">
              <PhotoUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={(error) => console.error(error)}
              />
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <Skeleton className="w-full h-64" />
                <Skeleton className="w-full h-64" />
                <Skeleton className="w-full h-64" />
                <Skeleton className="w-full h-64" />
              </>
            ) : (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    src={photo.thumbnailPath}
                    alt="Wedding photo"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>
              ))
            )}
          </div>

          {photos.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="font-body text-2xl text-sage">
                No photos yet. Be the first to share a memory!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
