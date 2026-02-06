"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavHeader } from "@/components/nav-header";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const statusColors: Record<string, string> = {
  queued: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function TranscriptionPage() {
  const [lastUploadedFileId, setLastUploadedFileId] = useState<string | null>(null);
  const [lastStorageKey, setLastStorageKey] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const transcriptions = useQuery(api.transcriptions.getTranscriptions);
  const queueTranscription = useMutation(api.transcriptions.queueTranscription);
  const processTranscription = useAction(api.transcriptions.processTranscription);
  const generateDownloadUrl = useAction(api.fileActions.generateDownloadUrl);

  const handleUploadComplete = (fileId: string, storageKey: string) => {
    setLastUploadedFileId(fileId);
    setLastStorageKey(storageKey);
  };

  const handleTranscribe = async () => {
    if (!lastUploadedFileId || !lastStorageKey) return;
    setProcessing(true);

    try {
      // Queue the transcription
      const transcriptionId = await queueTranscription({
        fileMetadataId: lastUploadedFileId as Id<"fileMetadata">,
      });

      // Get a download URL for the audio file
      const audioUrl = await generateDownloadUrl({
        storageKey: lastStorageKey,
      });

      // Process it
      await processTranscription({
        transcriptionId: transcriptionId as Id<"transcriptions">,
        audioUrl,
      });

      setLastUploadedFileId(null);
      setLastStorageKey(null);
    } catch (err) {
      console.error("Transcription failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Transcription</h1>

        {/* Upload + transcribe */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            <Mic className="h-4 w-4 inline mr-1" />
            Upload audio file
          </h2>
          <FileUpload
            fileType="audio"
            accept=".mp3,.wav,.m4a,audio/*"
            onUploadComplete={handleUploadComplete}
          />
          {lastUploadedFileId && (
            <div className="mt-3">
              <Button
                onClick={handleTranscribe}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Transcription
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Transcriptions list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Your Transcriptions
        </h2>

        <div className="space-y-2">
          {transcriptions === undefined ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : transcriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transcriptions yet. Upload an audio file above.
            </div>
          ) : (
            transcriptions.map((t: { _id: string; status: string; fileName: string; transcript?: string; errorMessage?: string; ragStatus?: string }) => (
              <div
                key={t._id}
                className="bg-white rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[t.status]}>
                    {t.status}
                  </Badge>
                  {t.status === "completed" && t.ragStatus && (
                    <Badge
                      variant="outline"
                      className={
                        t.ragStatus === "completed"
                          ? "bg-green-100 text-green-800 text-xs"
                          : t.ragStatus === "processing"
                            ? "bg-blue-100 text-blue-800 text-xs"
                            : t.ragStatus === "failed"
                              ? "bg-red-100 text-red-800 text-xs"
                              : "bg-yellow-100 text-yellow-800 text-xs"
                      }
                    >
                      {t.ragStatus === "completed" ? "Indexed" : t.ragStatus === "processing" ? "Indexing..." : t.ragStatus === "failed" ? "Index failed" : "Index pending"}
                    </Badge>
                  )}
                  <p className="font-medium text-gray-900 flex-1 truncate">
                    {t.fileName}
                  </p>
                  {t.status === "completed" && t.transcript && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedId(expandedId === t._id ? null : t._id)
                      }
                    >
                      {expandedId === t._id ? "Hide" : "View"}
                    </Button>
                  )}
                </div>
                {t.status === "failed" && t.errorMessage && (
                  <p className="text-sm text-red-600 mt-2">{t.errorMessage}</p>
                )}
                {expandedId === t._id && t.transcript && (
                  <pre className="mt-3 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {t.transcript}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
