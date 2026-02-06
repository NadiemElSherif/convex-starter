import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Convex Starter</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl text-center">
        A modular starter app with auth, todos, file uploads, transcription, and
        RAG chat — built with Convex + Next.js.
      </p>

      <SignedOut>
        <div className="mt-8 flex gap-4">
          <Link
            href="/sign-in"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Sign Up
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}
