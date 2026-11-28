import React from 'react';
import { Alert } from './Alert';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Unified inline error banner with optional retry action.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  retryLabel = 'Retry',
  onRetry,
  className = '',
}) => (
  <Alert tone="error" className={className}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span>{message}</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  </Alert>
);
