"use client";

import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryable?: boolean;
  isRetrying?: boolean;
}

/**
 * Error State Component
 *
 * Displays a user-friendly error message with optional retry and dismiss actions.
 * Use this component to show errors in specific sections of a page.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  onDismiss,
  retryable = false,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {message}
            </p>

            <div className="flex flex-wrap gap-2">
              {retryable && onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="bg-white"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isRetrying ? "animate-spin" : ""}`} />
                  {isRetrying ? "Retrying..." : "Retry"}
                </Button>
              )}

              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>

          {onDismiss && (
            <div className="flex-shrink-0">
              <button
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * Inline Error Component
 *
 * A compact inline error display for use within forms or other components.
 */
export function InlineError({ message, onRetry, isRetrying }: InlineErrorProps) {
  return (
    <div className="rounded-md bg-red-50 p-3 border border-red-200">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
        <p className="text-sm text-red-800 flex-1">{message}</p>
        {onRetry && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRetry}
            disabled={isRetrying}
            className="h-auto py-0 px-2 text-red-700 hover:text-red-900 hover:bg-red-100"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
          </Button>
        )}
      </div>
    </div>
  );
}

interface FullPageErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  retryable?: boolean;
  isRetrying?: boolean;
}

/**
 * Full Page Error Component
 *
 * Displays a full-page error state with prominent message and actions.
 * Use this for critical errors that prevent the page from functioning.
 */
export function FullPageError({
  title = "Something went wrong",
  message,
  onRetry,
  onGoBack,
  retryable = false,
  isRetrying = false,
}: FullPageErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {retryable && onRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          )}

          {onGoBack && (
            <Button
              variant="outline"
              onClick={onGoBack}
            >
              Go Back
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
