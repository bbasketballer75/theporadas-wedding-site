/**
 * Web Vitals Reporting Utility
 * Tracks Core Web Vitals (CWV) and sends to analytics
 *
 * Core Web Vitals (2025 targets):
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - FCP (First Contentful Paint): < 1.8s
 * - TTFB (Time to First Byte): < 0.8s
 * - INP (Interaction to Next Paint): < 200ms
 *
 * Usage in _app.js:
 * import { reportWebVitals } from '../lib/reportWebVitals';
 * export function reportWebVitals(metric) {
 *   reportWebVitals(metric);
 * }
 */

/**
 * Send metric to analytics service
 * @param {Object} metric - Web Vitals metric
 */
function sendToAnalytics(metric) {
  const { name, value, id, rating } = metric;

  // Log to console in development with color coding
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      good: '\x1b[32m', // green
      'needs-improvement': '\x1b[33m', // yellow
      poor: '\x1b[31m', // red
      reset: '\x1b[0m',
    };
    const color = colors[rating] || colors.reset;
    console.log(
      `${color}[Web Vitals] ${name}:${colors.reset}`,
      {
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        unit: name === 'CLS' ? 'score × 1000' : 'ms',
        rating,
        id: id.substring(0, 8),
      }
    );
  }

  // Send to Google Analytics (GA4)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
      metric_rating: rating,
      page_path: window.location.pathname,
    });
  }

  // Send to Firebase Analytics
  if (typeof window !== 'undefined' && window.firebase?.analytics) {
    window.firebase.analytics().logEvent('web_vitals', {
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_id: id,
      metric_rating: rating,
      page_path: window.location.pathname,
    });
  }

  // Send to Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: 'Web Vitals',
      data: {
        metric: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        rating,
      },
    });
  }

  // Store in localStorage for performance dashboard
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('web_vitals_history') || '[]');
      stored.push({
        metric: name,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        rating,
        timestamp: Date.now(),
        page: window.location.pathname,
      });
      // Keep last 100 metrics
      if (stored.length > 100) stored.shift();
      localStorage.setItem('web_vitals_history', JSON.stringify(stored));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
}

/**
 * Main Web Vitals reporting function
 * Call this from _app.js's reportWebVitals export
 */
export function reportWebVitals(metric) {
  // Core Web Vitals
  if (['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'].includes(metric.name)) {
    sendToAnalytics(metric);
  }

  // Performance warnings (development only)
  if (process.env.NODE_ENV === 'development') {
    const thresholds = {
      LCP: 2500, // 2.5s
      FID: 100, // 100ms
      CLS: 0.1,
      FCP: 1800, // 1.8s
      TTFB: 800, // 0.8s
      INP: 200, // 200ms
    };

    if (metric.value > thresholds[metric.name]) {
      console.warn(
        `⚠️  ${metric.name} is above threshold:`,
        `${Math.round(metric.value)} > ${thresholds[metric.name]}`,
        `(Rating: ${metric.rating})`
      );
    }
  }
}

/**
 * Get current Web Vitals snapshot
 * Returns Promise with all current metrics
 */
export async function getWebVitalsSnapshot() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Use web-vitals library if available
    const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');

    return new Promise((resolve) => {
      const metrics = {};
      let count = 0;
      const total = 6;

      const checkComplete = () => {
        count++;
        if (count === total) {
          resolve(metrics);
        }
      };

      onCLS((metric) => {
        metrics.CLS = metric;
        checkComplete();
      });
      onFID((metric) => {
        metrics.FID = metric;
        checkComplete();
      });
      onFCP((metric) => {
        metrics.FCP = metric;
        checkComplete();
      });
      onLCP((metric) => {
        metrics.LCP = metric;
        checkComplete();
      });
      onTTFB((metric) => {
        metrics.TTFB = metric;
        checkComplete();
      });
      onINP((metric) => {
        metrics.INP = metric;
        checkComplete();
      });
    });
  } catch (error) {
    console.error('Failed to get Web Vitals snapshot:', error);
    return null;
  }
}

export default reportWebVitals;
