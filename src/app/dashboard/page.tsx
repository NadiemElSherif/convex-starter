"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavHeader } from "@/components/nav-header";
import Link from "next/link";
import {
  CheckSquare,
  Upload,
  Mic,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    title: "Todo List",
    description: "Create, assign, and track tasks with real-time updates.",
    href: "/todos",
    icon: CheckSquare,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "File Upload",
    description: "Upload files to MinIO/S3 with presigned URLs and progress tracking.",
    href: "/uploads",
    icon: Upload,
    color: "text-green-600 bg-green-100",
  },
  {
    title: "Transcription",
    description: "Upload audio and get transcriptions via NCAT API.",
    href: "/transcription",
    icon: Mic,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "RAG Chat",
    description: "Chat with an AI that uses vector search across your documents, transcriptions, and todos.",
    href: "/chat",
    icon: MessageSquare,
    color: "text-orange-600 bg-orange-100",
  },
];

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    // Auto-provision user on first visit
    if (currentUser === null) {
      getOrCreateUser().catch(console.error);
    }
  }, [currentUser, getOrCreateUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser?.name
              ? `Welcome, ${currentUser.name}`
              : "Welcome"}
          </h1>
          <p className="mt-2 text-gray-600">
            Pick a feature module to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
