import React from 'react';

/**
 * SectionErrorBoundary - Granular error boundary for individual sections
 * Prevents entire page crash when one section fails
 */
export default class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Section Error:', error, errorInfo);
    }
    
    // Log to analytics in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `Section Error: ${error.message}`,
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { sectionName = 'This section', fallback } = this.props;

      if (fallback) {
        return fallback;
      }

      return (
        <div className="card-elegant p-8 text-center my-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-display text-charcoal mb-4">
            {sectionName} encountered an error
          </h3>
          <p className="text-charcoal/70 mb-6 max-w-md mx-auto">
            Don't worry! The rest of the page is working fine. You can try reloading this section.
          </p>
          <button onClick={this.handleRetry} className="btn-primary">
            🔄 Retry
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left bg-red-50 p-4 rounded-lg">
              <summary className="cursor-pointer font-semibold text-red-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
