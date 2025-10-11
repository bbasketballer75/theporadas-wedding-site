/**
 * Video Embedding Component
 * Support for YouTube and Vimeo videos with responsive iframe
 */

import { useState } from 'react';

export default function VideoEmbed({ url, title = 'Wedding Video', autoplay = false }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Parse video URL and get embed URL
  const getEmbedUrl = () => {
    if (!url) return null;

    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}${autoplay ? '?autoplay=1' : ''}`;
    }

    // Vimeo patterns
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}${autoplay ? '?autoplay=1' : ''}`;
    }

    // Already an embed URL
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
      return url;
    }

    return null;
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="video-error">
        <p>Invalid video URL. Please provide a YouTube or Vimeo link.</p>
        <style jsx>{`
          .video-error {
            background: #fee;
            color: #c00;
            padding: 2rem;
            border-radius: 0.5rem;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="video-embed">
      {!isLoaded && (
        <div className="video-placeholder">
          <div className="play-button">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="video-title">{title}</div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        className={`video-iframe ${isLoaded ? 'loaded' : ''}`}
      />

      <style jsx>{`
        .video-embed {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          background: #000;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .video-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          z-index: 1;
        }

        .play-button {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .play-button svg {
          width: 3rem;
          height: 3rem;
          margin-left: 0.5rem;
        }

        .video-title {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          padding: 0 2rem;
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .video-iframe.loaded {
          opacity: 1;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .play-button {
            width: 4rem;
            height: 4rem;
          }

          .play-button svg {
            width: 2rem;
            height: 2rem;
          }

          .video-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Video Gallery Component
 * Display multiple embedded videos in a grid
 */
export function VideoGallery({ videos = [] }) {
  return (
    <div className="video-gallery">
      <h2 className="gallery-title">Wedding Videos</h2>
      <div className="videos-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <VideoEmbed url={video.url} title={video.title || `Video ${index + 1}`} />
            {video.description && (
              <p className="video-description">{video.description}</p>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .video-gallery {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .gallery-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 3rem;
        }

        .video-item {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .video-description {
          color: #4b5563;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 768px) {
          .videos-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .gallery-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Extract video ID from URL (utility function)
 */
export function getVideoId(url) {
  if (!url) return null;

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) return { platform: 'youtube', id: youtubeMatch[1] };

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) return { platform: 'vimeo', id: vimeoMatch[3] };

  return null;
}

/**
 * Get video thumbnail (utility function)
 */
export function getVideoThumbnail(url) {
  const video = getVideoId(url);
  if (!video) return null;

  if (video.platform === 'youtube') {
    return `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  }

  // Vimeo requires API call, return placeholder
  return '/images/video-placeholder.jpg';
}
