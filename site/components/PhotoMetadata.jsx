import { useEffect, useState } from 'react';
import * as exifr from 'exifr';

/**
 * PhotoMetadata Component
 * Displays EXIF metadata from photos (date, location, camera info)
 * 
 * @param {string} imageUrl - URL of the image to extract EXIF from
 * @param {string} className - Additional CSS classes
 */
export default function PhotoMetadata({ imageUrl, className = '' }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const extractMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse EXIF data from image
        const exif = await exifr.parse(imageUrl, {
          tiff: true,
          exif: true,
          gps: true,
          interop: true,
        });

        if (exif) {
          setMetadata({
            dateTaken: exif.DateTimeOriginal || exif.DateTime,
            camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : null,
            lens: exif.LensModel,
            focalLength: exif.FocalLength,
            aperture: exif.FNumber,
            iso: exif.ISO,
            shutterSpeed: exif.ExposureTime,
            latitude: exif.latitude,
            longitude: exif.longitude,
            altitude: exif.GPSAltitude,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('[PhotoMetadata] Error extracting EXIF:', err);
        setError('Unable to read photo metadata');
        setLoading(false);
      }
    };

    extractMetadata();
  }, [imageUrl]);

  if (loading) {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        <p>Loading metadata...</p>
      </div>
    );
  }

  if (error || !metadata) {
    return null; // Don't show error, just hide component
  }

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Photo Details
      </h4>

      {metadata.dateTaken && (
        <div className="flex items-start gap-2 text-gray-300">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <span className="text-gray-400">Taken:</span>{' '}
            {new Date(metadata.dateTaken).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}

      {metadata.camera && (
        <div className="flex items-start gap-2 text-gray-300">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <span className="text-gray-400">Camera:</span> {metadata.camera}
          </div>
        </div>
      )}

      {metadata.lens && (
        <div className="flex items-start gap-2 text-gray-300">
          <span className="text-gray-400">Lens:</span> {metadata.lens}
        </div>
      )}

      {(metadata.focalLength || metadata.aperture || metadata.iso || metadata.shutterSpeed) && (
        <div className="flex flex-wrap gap-3 text-gray-300 pt-1">
          {metadata.focalLength && (
            <span>
              <span className="text-gray-400">Focal:</span> {metadata.focalLength}mm
            </span>
          )}
          {metadata.aperture && (
            <span>
              <span className="text-gray-400">f/</span>{metadata.aperture}
            </span>
          )}
          {metadata.iso && (
            <span>
              <span className="text-gray-400">ISO</span> {metadata.iso}
            </span>
          )}
          {metadata.shutterSpeed && (
            <span>
              <span className="text-gray-400">Shutter:</span> {formatShutterSpeed(metadata.shutterSpeed)}
            </span>
          )}
        </div>
      )}

      {(metadata.latitude && metadata.longitude) && (
        <div className="flex items-start gap-2 text-gray-300">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <span className="text-gray-400">Location:</span>{' '}
            <a
              href={`https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {metadata.latitude.toFixed(6)}, {metadata.longitude.toFixed(6)}
            </a>
            {metadata.altitude && (
              <span className="ml-2 text-xs">
                ({metadata.altitude.toFixed(1)}m altitude)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format shutter speed for display
 */
function formatShutterSpeed(speed) {
  if (speed >= 1) {
    return `${speed}s`;
  }
  return `1/${Math.round(1 / speed)}s`;
}
