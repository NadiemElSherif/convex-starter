"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

/**
 * Error handler hook that provides consistent error handling
 * with toast notifications and retry functionality
 */
export function useErrorHandler() {
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  /**
   * Show error toast with optional retry action
   */
  const showError = useCallback((
    message: string,
    options?: {
      title?: string;
      retryable?: boolean;
      onRetry?: () => Promise<void> | void;
      duration?: number;
    }
  ) => {
    const title = options?.title ?? "Error";
    const retryable = options?.retryable ?? false;
    const onRetry = options?.onRetry;
    const duration = options?.duration ?? 5000;

    const toastProps: Record<string, any> = {
      title,
      description: message,
      variant: "destructive",
      duration,
    };

    if (retryable && onRetry) {
      toastProps.action = ToastAction({
        altText: "Retry",
        onClick: async () => {
          setIsRetrying(true);
          try {
            await onRetry();
            toast({
              title: "Success",
              description: "The operation completed successfully.",
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            showError(errorMessage, { title: "Retry Failed", retryable, onRetry });
          } finally {
            setIsRetrying(false);
          }
        },
        children: isRetrying ? "Retrying..." : "Retry",
      });
    }

    toast(toastProps);
  }, [toast, isRetrying]);

  /**
   * Handle Convex function errors with user-friendly messages
   */
  const handleConvexError = useCallback((
    error: unknown,
    context?: string,
    options?: {
      retryable?: boolean;
      onRetry?: () => Promise<void> | void;
    }
  ) => {
    console.error(`[Error Handler] ${context || "Convex error"}:`, error);

    let message = "An unexpected error occurred. Please try again.";
    let title = "Error";

    // Handle different error types
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("not found")) {
        message = "The requested resource was not found.";
        title = "Not Found";
      } else if (errorMessage.includes("unauthorized") || errorMessage.includes("unauthenticated")) {
        message = "You need to sign in to perform this action.";
        title = "Authentication Required";
      } else if (errorMessage.includes("forbidden") || errorMessage.includes("permission")) {
        message = "You don't have permission to perform this action.";
        title = "Access Denied";
      } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
        message = "Network error. Please check your connection and try again.";
        title = "Network Error";
      } else if (errorMessage.includes("rate limit")) {
        message = "Too many requests. Please wait a moment and try again.";
        title = "Rate Limit Exceeded";
      } else if (errorMessage.includes("validation")) {
        message = "Please check your input and try again.";
        title = "Validation Error";
      } else if (errorMessage.includes("conflict")) {
        message = "This resource already exists or has been modified.";
        title = "Conflict";
      } else {
        message = error.message || message;
      }
    }

    showError(message, {
      title,
      retryable: options?.retryable ?? false,
      onRetry: options?.onRetry,
    });
  }, [showError]);

  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(async <T>(
    fn: () => Promise<T>,
    options?: {
      context?: string;
      successMessage?: string;
      retryable?: boolean;
    }
  ): Promise<T | null> => {
    try {
      const result = await fn();

      if (options?.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "default",
          duration: 3000,
        });
      }

      return result;
    } catch (error) {
      handleConvexError(error, options?.context, {
        retryable: options?.retryable,
      });
      return null;
    }
  }, [toast, handleConvexError]);

  return {
    showError,
    handleConvexError,
    withErrorHandling,
    isRetrying,
  };
}
