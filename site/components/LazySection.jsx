/**
 * LazySection - Wrapper for lazy-loading sections with Suspense
 * Implements React.lazy() + Intersection Observer for optimal performance
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import LoadingSkeleton from './LoadingSkeleton';

export default function LazySection({ importFunc, fallback, threshold = 0.1, ...props }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);
  const LazyComponent = lazy(importFunc);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '200px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <Suspense fallback={fallback || <LoadingSkeleton />}>
          <LazyComponent {...props} />
        </Suspense>
      ) : (
        fallback || <LoadingSkeleton />
      )}
    </div>
  );
}
