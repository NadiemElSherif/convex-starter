"use client";

import { useState, useRef } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  fileType: "audio" | "document" | "image";
  onUploadComplete?: (fileId: string, storageKey: string) => void;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function FileUpload({
  accept,
  fileType,
  onUploadComplete,
  disabled,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useQuery(api.users.getCurrentUser);
  const generateUploadUrl = useAction(api.fileActions.generateUploadUrl);
  const storeFileMetadata = useMutation(api.files.storeFileMetadata);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit.");
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);

    try {
      if (!currentUser?._id) throw new Error("Not authenticated");

      // Get presigned URL
      const result = await generateUploadUrl({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        fileType,
        userId: currentUser._id,
      });

      // Upload to MinIO via presigned URL with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", result.presignedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      // Store metadata in Convex
      const fileId = await storeFileMetadata({
        fileName: result.fileName,
        storageKey: result.storageKey,
        mimeType: result.mimeType,
        size: result.size,
        fileType: result.fileType as "audio" | "document" | "image",
      });

      setProgress(100);
      onUploadComplete?.(fileId, result.storageKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setProgress(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid gap-2">
      {!selectedFile ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={disabled || uploading}
            className="w-full border-dashed border-2 hover:bg-gray-50 h-auto py-8"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="flex items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  Upload {fileType} file
                </div>
                <div className="text-sm text-gray-500">
                  Max 100MB
                </div>
              </div>
            </span>
          </Button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
              {progress < 100 && (
                <div className="mt-2">
                  <Progress value={progress} className="h-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {progress}%
                  </p>
                </div>
              )}
              {progress === 100 && (
                <p className="text-sm text-green-600 mt-1">Upload complete</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
