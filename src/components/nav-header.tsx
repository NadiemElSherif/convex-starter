"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const navLinks = [
  { href: "/todos", label: "Todos" },
  { href: "/uploads", label: "Uploads" },
  { href: "/transcription", label: "Transcription" },
  { href: "/chat", label: "Chat" },
];

export function NavHeader() {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // Auto-provision user record on any authenticated page
  useEffect(() => {
    if (currentUser === null) {
      getOrCreateUser().catch(console.error);
    }
  }, [currentUser, getOrCreateUser]);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            Convex Starter
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
