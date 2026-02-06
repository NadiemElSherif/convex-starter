import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Convex Starter",
  description:
    "A modular starter app demonstrating Convex + Next.js patterns with auth, todos, file uploads, transcription, and RAG chat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en">
          <body className={inter.className}>
            <ErrorBoundary>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:font-medium"
              >
                Skip to main content
              </a>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </ErrorBoundary>
            <Toaster />
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
