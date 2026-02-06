"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Global Error Page
 *
 * This component is displayed when an unhandled error occurs in the application.
 * It replaces the entire root layout during error states.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console for debugging
    console.error("[Global Error Page] Error:", error);
  }, [error]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-2">
          We encountered an unexpected error while processing your request.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          This has been logged and our team will look into it.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
              Error Details (Development Only)
            </summary>
            <div className="bg-gray-100 rounded p-3 text-xs overflow-auto max-h-40">
              <p className="font-mono text-red-600 mb-2">
                {error.message}
              </p>
              {error.digest && (
                <p className="font-mono text-gray-700 text-xs">
                  Error ID: {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="font-mono text-gray-700 whitespace-pre-wrap mt-2">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-900"
          >
            Go Back to Previous Page
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If this problem persists, please contact support with the error
          details above.
        </p>
      </div>
    </div>
  );
}
