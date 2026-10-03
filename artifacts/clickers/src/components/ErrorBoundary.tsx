import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string; // e.g. "BookDetail", "Checkout"
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

/**
 * Production-grade Error Boundary.
 * Catches all render errors inside children so a single broken
 * component never produces a blank white screen for the user.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production: send to error tracking service (Sentry, Datadog, etc.)
    console.error(`[ErrorBoundary:${this.props.context || 'App'}]`, {
      error: error.message,
      stack: info.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-primary/50 text-sm mb-1">
              {this.props.context
                ? `The "${this.props.context}" section encountered an error.`
                : 'An unexpected error occurred.'}
            </p>
            <p className="text-primary/25 text-xs font-mono">{this.state.errorId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-accent hover:text-primary transition-all"
            >
              <RefreshCw size={15} /> Try Again
            </button>
            <a
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-all"
            >
              <Home size={15} /> Go Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
