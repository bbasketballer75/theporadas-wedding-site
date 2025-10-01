/**
 * Skeleton Component
 * Loading placeholder with pulse animation
 * 2025 Best Practice: Better loading states and skeleton screens
 *
 * @param {string} className - Size and shape classes
 * @param {string} variant - Shape variant: 'rectangular', 'circular', 'text'
 */
export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full aspect-square',
    text: 'rounded h-4 w-full',
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-mint/30 via-cream/50 to-blush/30 bg-[length:200%_100%] ${variants[variant]} ${className}`}
      style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s infinite',
      }}
      aria-label="Loading..."
      role="status"
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
