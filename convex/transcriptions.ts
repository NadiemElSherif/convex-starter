import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireAuth } from "./auth";

export const queueTranscription = mutation({
  args: {
    fileMetadataId: v.id("fileMetadata"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    // Verify file exists
    const file = await ctx.db.get(args.fileMetadataId);
    if (!file) throw new Error("File not found");
    if (file.fileType !== "audio")
      throw new Error("Only audio files can be transcribed");

    // Check if transcription already exists
    const existing = await ctx.db
      .query("transcriptions")
      .withIndex("by_file_metadata", (q) =>
        q.eq("fileMetadataId", args.fileMetadataId)
      )
      .first();

    if (existing) return existing._id;

    const now = Date.now();
    const id = await ctx.db.insert("transcriptions", {
      fileMetadataId: args.fileMetadataId,
      status: "queued",
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const getTranscriptions = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = await requireAuth(ctx);
      const transcriptions = await ctx.db
        .query("transcriptions")
        .withIndex("by_created_by", (q) => q.eq("createdBy", user._id))
        .collect();

      // Enrich with file info
      return await Promise.all(
        transcriptions.map(async (t) => {
          const file = await ctx.db.get(t.fileMetadataId);
          return {
            ...t,
            fileName: file?.fileName ?? "Unknown file",
          };
        })
      );
    } catch {
      return [];
    }
  },
});

export const getTranscription = internalQuery({
  args: {
    id: v.id("transcriptions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const processTranscription = action({
  args: {
    transcriptionId: v.id("transcriptions"),
    audioUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { transcriptionId, audioUrl } = args;

    const ncatBaseUrl = process.env.NCAT_BASE_URL;
    const ncatApiKey = process.env.NCAT_API_KEY;

    if (!ncatBaseUrl) throw new Error("NCAT_BASE_URL not configured");
    if (!ncatApiKey) throw new Error("NCAT_API_KEY not configured");

    try {
      // Mark as processing
      await ctx.runMutation(
        internal.transcriptions._updateStatus,
        {
          id: transcriptionId,
          status: "processing",
        }
      );

      // Submit to NCAT
      const submitResponse = await fetch(`${ncatBaseUrl}/v1/media/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ncatApiKey,
        },
        body: JSON.stringify({
          media_url: audioUrl,
          language: "en",
          include_text: true,
        }),
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        throw new Error(`NCAT API error: ${submitResponse.status} - ${errorText}`);
      }

      const submitData = await submitResponse.json();
      const jobId = submitData.job_id;

      // If response is 200 with direct result (no queuing)
      if (submitData.code === 200 && submitData.response?.text) {
        const transcript = submitData.response.text;
        await ctx.runMutation(
          internal.transcriptions.completeTranscription,
          { id: transcriptionId, transcript }
        );
        return { success: true, transcript };
      }

      if (!jobId) {
        throw new Error("NCAT did not return a job ID");
      }

      // Poll for completion (max 5 minutes)
      const maxPolls = 30;
      const pollInterval = 10000;

      for (let i = 0; i < maxPolls; i++) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));

        const statusResponse = await fetch(`${ncatBaseUrl}/v1/toolkit/job/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ncatApiKey,
          },
          body: JSON.stringify({ job_id: jobId }),
        });

        if (!statusResponse.ok) {
          throw new Error(`NCAT status check failed: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        const jobStatus = statusData.response?.job_status || statusData.job_status;

        if (jobStatus === "done" || jobStatus === "completed") {
          const transcript =
            statusData.response?.response?.text ||
            statusData.response?.text ||
            statusData.text ||
            "";

          if (!transcript) {
            throw new Error("NCAT returned empty transcript");
          }

          // Save transcript (mutation schedules RAG processing)
          await ctx.runMutation(
            internal.transcriptions.completeTranscription,
            { id: transcriptionId, transcript }
          );

          return { success: true, transcript };
        } else if (jobStatus === "failed" || jobStatus === "error") {
          throw new Error(statusData.response?.error || statusData.error || "Transcription failed");
        }
      }

      throw new Error("Transcription timed out");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      await ctx.runMutation(
        internal.transcriptions.failTranscription,
        {
          id: transcriptionId,
          errorMessage: msg,
        }
      );
      return { success: false, error: msg };
    }
  },
});

export const completeTranscription = internalMutation({
  args: {
    id: v.id("transcriptions"),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "completed",
      transcript: args.transcript,
      ragStatus: "pending" as const,
      updatedAt: Date.now(),
    });

    // Schedule RAG indexing server-side (decoupled from transcription action)
    await ctx.scheduler.runAfter(
      0,
      internal.embeddings.processTranscription,
      { transcriptionId: args.id }
    );
  },
});

export const failTranscription = internalMutation({
  args: {
    id: v.id("transcriptions"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      errorMessage: args.errorMessage,
      updatedAt: Date.now(),
    });
  },
});

export const _updateStatus = internalMutation({
  args: {
    id: v.id("transcriptions"),
    status: v.union(
      v.literal("queued"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
