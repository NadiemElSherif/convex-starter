/**
 * Error Handling Utilities for Convex Functions
 *
 * Provides consistent error handling across all Convex actions and mutations.
 * Errors are logged to console and user-friendly messages are returned.
 */

/**
 * Custom error classes for different error types
 */
export class ConvexError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ConvexError";
  }
}

export class ValidationError extends ConvexError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ConvexError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "NOT_FOUND", 404, details);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends ConvexError {
  constructor(message: string = "Authentication required", details?: Record<string, any>) {
    super(message, "AUTHENTICATION_ERROR", 401, details);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ConvexError {
  constructor(message: string = "You don't have permission to perform this action", details?: Record<string, any>) {
    super(message, "AUTHORIZATION_ERROR", 403, details);
    this.name = "AuthorizationError";
  }
}

export class ConflictError extends ConvexError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "CONFLICT_ERROR", 409, details);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends ConvexError {
  constructor(message: string = "Rate limit exceeded", details?: Record<string, any>) {
    super(message, "RATE_LIMIT_ERROR", 429, details);
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends ConvexError {
  constructor(
    service: string,
    message: string = "External service error",
    details?: Record<string, any>
  ) {
    super(`${service}: ${message}`, "EXTERNAL_SERVICE_ERROR", 502, {
      service,
      ...details,
    });
    this.name = "ExternalServiceError";
  }
}

/**
 * Error logger that logs errors to console with structured format
 */
export function logError(
  context: string,
  error: Error | ConvexError | unknown,
  additionalInfo?: Record<string, any>
): void {
  const timestamp = new Date().toISOString();

  if (error instanceof ConvexError) {
    console.error(`[${timestamp}] [${context}] ${error.code}:`, {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      ...additionalInfo,
    });
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] [${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
    });
  } else {
    console.error(`[${timestamp}] [${context}] Unknown error:`, {
      error,
      ...additionalInfo,
    });
  }
}

/**
 * Wrapper for async functions that logs errors and rethrows them
 */
export async function withErrorLogging<T>(
  context: string,
  fn: () => Promise<T>,
  additionalInfo?: Record<string, any>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(context, error, additionalInfo);
    throw error;
  }
}

/**
 * Check if an error is a transient/network error that should be retried
 */
export function isTransientError(error: unknown): boolean {
  if (error instanceof ConvexError) {
    return error.statusCode >= 500 || error.code === "RATE_LIMIT_ERROR";
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("econnrefused") ||
      message.includes("etimedout") ||
      message.includes("econnreset")
    );
  }
  return false;
}

/**
 * Get user-friendly error message from error
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for common error patterns
    const message = error.message.toLowerCase();

    if (message.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
    if (message.includes("not found")) {
      return "The requested resource was not found.";
    }
    if (message.includes("unauthorized") || message.includes("unauthenticated")) {
      return "You need to sign in to perform this action.";
    }
    if (message.includes("forbidden") || message.includes("permission")) {
      return "You don't have permission to perform this action.";
    }

    return "An unexpected error occurred. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Format error for client response
 */
export function formatErrorResponse(error: unknown): {
  message: string;
  code: string;
  statusCode: number;
  retryable: boolean;
} {
  const userMessage = getUserFriendlyMessage(error);
  const retryable = isTransientError(error);

  if (error instanceof ConvexError) {
    return {
      message: userMessage,
      code: error.code,
      statusCode: error.statusCode,
      retryable,
    };
  }

  return {
    message: userMessage,
    code: "UNKNOWN_ERROR",
    statusCode: 500,
    retryable,
  };
}
