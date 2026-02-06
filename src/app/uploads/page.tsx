"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavHeader } from "@/components/nav-header";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

const fileTypeColors: Record<string, string> = {
  audio: "bg-purple-100 text-purple-800",
  document: "bg-blue-100 text-blue-800",
  image: "bg-green-100 text-green-800",
};

const ragStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Indexing pending", className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Indexing...", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Indexed", className: "bg-green-100 text-green-800" },
  failed: { label: "Index failed", className: "bg-red-100 text-red-800" },
};

export default function UploadsPage() {
  const files = useQuery(api.files.getMyFiles);
  const deleteFile = useMutation(api.files.deleteFile);
  const generateDownloadUrl = useAction(api.fileActions.generateDownloadUrl);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (storageKey: string, fileName: string) => {
    setDownloading(storageKey);
    try {
      const url = await generateDownloadUrl({ storageKey });
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.target = "_blank";
      a.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">File Uploads</h1>

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Upload a file</h2>
          <FileUpload
            fileType="document"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.mp3,.wav,.m4a"
            onUploadComplete={() => {
              // Files list auto-updates via useQuery
            }}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Files</h2>

        <div className="space-y-2">
          {files === undefined ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No files uploaded yet.
            </div>
          ) : (
            files.map((file) => {
              // ragStatus is optional and added via schema migration
              const ragStatus = (file as Record<string, unknown>).ragStatus as string | undefined;
              return (
              <div
                key={file._id}
                className="bg-white rounded-lg border p-4 flex items-center gap-3"
              >
                <Badge className={fileTypeColors[file.fileType] || "bg-gray-100"}>
                  {file.fileType}
                </Badge>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {file.fileName}
                    </p>
                    {ragStatus && ragStatusConfig[ragStatus] && (
                      <Badge
                        variant="outline"
                        className={ragStatusConfig[ragStatus].className + " text-xs shrink-0"}
                      >
                        {ragStatusConfig[ragStatus].label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} &middot;{" "}
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file.storageKey, file.fileName)}
                  disabled={downloading === file.storageKey}
                  className="shrink-0"
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFile({ fileId: file._id })}
                  className="shrink-0 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
