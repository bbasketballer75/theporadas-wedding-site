import Head from 'next/head';
import { useState } from 'react';

import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import PhotoUpload from '../components/PhotoUpload';

export default function UploadPage() {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadComplete = () => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 5000);
  };

  return (
    <PageTransition>
      <Head>
        <title>Share Your Memories | Austin & Jordyn</title>
        <meta name="description" content="Share your photos and videos from our special day" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">
              Share Your Memories
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Help us relive our special day by sharing your photos and videos. Every moment
              captured is a treasure we&rsquo;ll cherish forever.
            </p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-8 p-6 bg-gradient-sage-blush rounded-2xl shadow-lg animate-fade-in">
              <div className="flex items-center justify-center text-white">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-lg font-semibold">
                  Thank you! Your memories have been uploaded successfully! 🎉
                </span>
              </div>
            </div>
          )}

          {/* Upload Component */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in">
            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </div>

          {/* Instructions */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display text-sage mb-2">Photos & Videos</h3>
              <p className="text-gray-600 text-sm">
                Upload any photos or videos from the wedding. All formats supported!
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blush"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display text-blush mb-2">Auto-Optimized</h3>
              <p className="text-gray-600 text-sm">
                Files are automatically compressed and optimized for fast loading.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-mint/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-display text-sage mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                Your uploads are secure and only shared with wedding guests.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Questions or having trouble uploading?{' '}
              <a
                href="mailto:austin@theporadas.com"
                className="text-sage hover:text-sage/80 font-semibold underline"
              >
                Contact us
              </a>
            </p>
            <p className="text-sm text-gray-500">
              💡 Tip: Videos may take a few minutes to process after uploading
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
