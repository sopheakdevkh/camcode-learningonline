import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { buttonClasses } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  isChunkError: boolean;
}

interface InnerErrorBoundaryProps {
  resetKey?: string;
  title: string;
  description: string;
  retryLabel: string;
  homeLabel: string;
  children: React.ReactNode;
}

export function isChunkLoadFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('dynamically imported module') ||
    msg.includes('loading chunk') ||
    msg.includes('failed to fetch') ||
    error.name === 'ChunkLoadError'
  );
}

export const ErrorFallback: React.FC<{
  title: string;
  description: string;
  retryLabel: string;
  homeLabel: string;
  onRetry: () => void;
}> = ({ title, description, retryLabel, homeLabel, onRetry }) => (
  <div className="container-page py-16 md:py-20">
    <div
      role="alert"
      className="max-w-lg mx-auto geist-card rounded-[12px] p-8 text-center space-y-5"
    >
      <div className="mx-auto h-12 w-12 rounded-[10px] bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error)] flex items-center justify-center">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-h2 text-[var(--text-main)]">{title}</h1>
        <p className="text-small text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={onRetry}
          className={buttonClasses({ variant: 'primary', size: 'md' })}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
        <Link to="/" className={buttonClasses({ variant: 'outline', size: 'md' })}>
          <Home className="h-4 w-4" aria-hidden="true" />
          <span>{homeLabel}</span>
        </Link>
      </div>
    </div>
  </div>
);

export class ErrorBoundaryInner extends React.Component<
  InnerErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      isChunkError: isChunkLoadFailure(error),
    };
  }

  componentDidUpdate(prevProps: InnerErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, isChunkError: false });
    }
  }

  componentDidCatch(error: Error) {
    console.error('[CamcodeLearn ErrorBoundary]', error.name, error.message);
  }

  private handleRetry = () => {
    if (this.state.isChunkError) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, isChunkError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <ErrorFallback
        title={this.props.title}
        description={this.props.description}
        retryLabel={this.props.retryLabel}
        homeLabel={this.props.homeLabel}
        onRetry={this.handleRetry}
      />
    );
  }
}

export const RouteErrorBoundary: React.FC<{
  resetKey?: string;
  children: React.ReactNode;
}> = ({ resetKey, children }) => {
  const { t, pickText } = useI18n();
  return (
    <ErrorBoundaryInner
      resetKey={resetKey}
      title={pickText({ en: 'Something went wrong', km: 'មានបញ្ហាមួយបានកើតឡើង' })}
      description={t.common.errorGeneric}
      retryLabel={t.common.retry}
      homeLabel={t.nav.home}
    >
      {children}
    </ErrorBoundaryInner>
  );
};
