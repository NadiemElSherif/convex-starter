import { spawn } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

interface HookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  hook_event_name: string;
}

interface TranscriptMessage {
  role: string;
  content: unknown;
}

interface ToolUseBlock {
  type: "tool_use";
  name: string;
  input: Record<string, unknown>;
}

function getChangedFiles(transcriptPath: string): string[] {
  const changed = new Set<string>();
  try {
    const raw = readFileSync(transcriptPath, "utf-8");
    const messages: TranscriptMessage[] = JSON.parse(raw);

    for (const msg of messages) {
      if (msg.role !== "assistant" || !Array.isArray(msg.content)) continue;
      for (const block of msg.content) {
        const b = block as ToolUseBlock;
        if (b.type !== "tool_use") continue;
        if (b.name === "Write" || b.name === "Edit") {
          const fp = b.input?.file_path as string | undefined;
          if (fp) changed.add(fp);
        }
      }
    }
  } catch (e) {
    console.error("Failed to read transcript:", e);
  }
  return Array.from(changed);
}

function runCommand(
  cmd: string,
  args: string[],
  cwd: string
): Promise<{ code: number; output: string }> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    proc.stdout.on("data", (d: Buffer) => {
      output += d.toString();
    });
    proc.stderr.on("data", (d: Buffer) => {
      output += d.toString();
    });
    proc.on("close", (code) => {
      resolve({ code: code ?? 1, output });
    });
  });
}

// Recursively collect .ts files under convex/, skipping _generated and node_modules
function getConvexTsFiles(convexDir: string): { filePath: string; relPath: string }[] {
  const results: { filePath: string; relPath: string }[] = [];

  function walk(dir: string) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (
        entry.isDirectory() &&
        entry.name !== "_generated" &&
        entry.name !== "node_modules"
      ) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.endsWith(".d.ts") &&
        entry.name !== "tsconfig.json"
      ) {
        const relPath = fullPath.slice(convexDir.length + 1);
        results.push({ filePath: fullPath, relPath });
      }
    }
  }

  walk(convexDir);
  return results;
}

// Client-only packages that should never appear in convex/ server code
const CLIENT_ONLY_PACKAGES = [
  "react",
  "react-dom",
  "next",
  "@clerk/nextjs",
  "@radix-ui",
  "lucide-react",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "tailwindcss",
];

function checkUnusedGeneratedImports(cwd: string): string[] {
  const convexDir = join(cwd, "convex");
  const errors: string[] = [];
  const files = getConvexTsFiles(convexDir);

  for (const { filePath, relPath } of files) {
    let content: string;
    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Find all imports from _generated
    const importRegex =
      /import\s+\{([^}]+)\}\s+from\s+["']\.?\/?_generated\/\w+["'];?/g;
    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(content)) !== null) {
      const importedNames = match[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Strip "type" keyword and handle "as alias" renames
      const resolvedNames = importedNames.map((name) => {
        let n = name.replace(/^type\s+/, "");
        const asMatch = n.match(/^\S+\s+as\s+(\S+)$/);
        if (asMatch) n = asMatch[1];
        return n;
      });

      // Check each name is used somewhere beyond the import line itself
      const contentWithoutImportLine = content.replace(match[0], "");
      for (const name of resolvedNames) {
        // Word-boundary check: the name must appear as its own token
        const usageRegex = new RegExp(`\\b${name}\\b`);
        if (!usageRegex.test(contentWithoutImportLine)) {
          errors.push(`convex/${relPath}: unused import "${name}" from _generated`);
        }
      }
    }
  }

  return errors;
}

function checkClientImportsInConvex(cwd: string): string[] {
  const convexDir = join(cwd, "convex");
  const errors: string[] = [];
  const files = getConvexTsFiles(convexDir);

  for (const { filePath, relPath } of files) {
    let content: string;
    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Match import statements and check the source against banned packages
    const importRegex = /import\s+.*?\s+from\s+["']([^"']+)["']/g;
    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(content)) !== null) {
      const source = match[1];
      for (const pkg of CLIENT_ONLY_PACKAGES) {
        if (source === pkg || source.startsWith(pkg + "/")) {
          errors.push(
            `convex/${relPath}: imports client-only package "${source}"`
          );
        }
      }
    }
  }

  return errors;
}

// --- Diagram maintenance ---

const DIAGRAM_DIR = "memory/ai/diagrams";

interface DiagramMapping {
  diagram: string;
  patterns: RegExp[];
}

const DIAGRAM_MAPPINGS: DiagramMapping[] = [
  {
    diagram: "schema.md",
    patterns: [/convex\/schema\.ts$/],
  },
  {
    diagram: "functions.md",
    patterns: [/convex\/(?!schema\.)[^/]+\.ts$/],
  },
  {
    diagram: "auth-flow.md",
    patterns: [
      /convex\/auth\.ts$/,
      /convex\/auth\.config\.ts$/,
      /convex\/users\.ts$/,
      /src\/middleware\.ts$/,
      /src\/components\/providers\.tsx$/,
      /src\/app\/sign-in\//,
      /src\/app\/sign-up\//,
    ],
  },
  {
    diagram: "user-journeys.md",
    patterns: [
      /src\/app\/[^/]+\/page\.tsx$/,
      /src\/components\/[^/]+\.tsx$/,
      /convex\/[^/]+\.ts$/,
    ],
  },
  {
    diagram: "data-flow.md",
    patterns: [
      /convex\/[^/]+\.ts$/,
      /src\/app\/[^/]+\/page\.tsx$/,
      /src\/components\/[^/]+\.tsx$/,
    ],
  },
];

function getAffectedDiagrams(changedFiles: string[], cwd: string): string[] {
  const affected = new Set<string>();
  for (const file of changedFiles) {
    const rel = file.startsWith(cwd) ? file.slice(cwd.length + 1) : file;
    for (const mapping of DIAGRAM_MAPPINGS) {
      for (const pattern of mapping.patterns) {
        if (pattern.test(rel)) {
          affected.add(mapping.diagram);
          break;
        }
      }
    }
  }
  return Array.from(affected);
}

function block(reason: string): void {
  console.log(JSON.stringify({ decision: "block", reason }));
}

async function main() {
  // Read hook input from stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const input: HookInput = JSON.parse(Buffer.concat(chunks).toString("utf-8"));

  // Only act on Stop events
  if (input.hook_event_name !== "Stop") return;

  const changedFiles = getChangedFiles(input.transcript_path);
  if (changedFiles.length === 0) return;

  // --- Check 1: TypeScript typecheck ---
  console.error("Running TypeScript typecheck...");
  const tsResult = await runCommand("bun", ["run", "typecheck"], input.cwd);
  if (tsResult.code !== 0) {
    block(`TypeScript errors found. Please fix them:\n${tsResult.output}`);
    return;
  }

  // --- Check 2: Convex typecheck (schema vs function signatures) ---
  console.error("Running Convex typecheck...");
  const convexResult = await runCommand(
    "bunx",
    ["convex", "typecheck"],
    input.cwd
  );
  if (convexResult.code !== 0) {
    block(
      `Convex typecheck failed. Please fix the function signature / schema errors:\n${convexResult.output}`
    );
    return;
  }

  // --- Check 3: Unused _generated imports ---
  console.error("Checking for unused _generated imports...");
  const unusedImports = checkUnusedGeneratedImports(input.cwd);
  if (unusedImports.length > 0) {
    block(
      `Unused imports from convex/_generated found. Please remove them:\n${unusedImports.join("\n")}`
    );
    return;
  }

  // --- Check 4: Client-only packages in server code ---
  console.error("Checking for client-only imports in convex/...");
  const clientImports = checkClientImportsInConvex(input.cwd);
  if (clientImports.length > 0) {
    block(
      `Client-only packages imported in server-side Convex code. Please remove them:\n${clientImports.join("\n")}`
    );
    return;
  }

  // All checks passed — update diagrams if needed, then commit
  const affectedDiagrams = getAffectedDiagrams(changedFiles, input.cwd);
  const diagramDir = join(input.cwd, DIAGRAM_DIR);
  const diagramsExist = existsSync(diagramDir);

  const commitPrompt =
    "Generate a concise commit message for the staged changes. Do not commit anything sensitive like .env files. Stage and commit.";

  if (affectedDiagrams.length > 0) {
    const existingDiagrams = diagramsExist
      ? affectedDiagrams.filter((d) => existsSync(join(diagramDir, d)))
      : [];
    const missingDiagrams = diagramsExist
      ? affectedDiagrams.filter((d) => !existsSync(join(diagramDir, d)))
      : affectedDiagrams;

    console.error(
      `Diagrams needing update: ${affectedDiagrams.join(", ")}. Spawning diagram updater then commit...`
    );

    const diagramPrompt = [
      `The following source files were changed: ${changedFiles.join(", ")}.`,
      existingDiagrams.length > 0
        ? `UPDATE these existing mermaid diagrams in ${DIAGRAM_DIR}/: ${existingDiagrams.join(", ")}. Read each diagram file first, then read the changed source files, and edit only the parts that need updating to reflect the current code.`
        : "",
      missingDiagrams.length > 0
        ? `CREATE these missing diagrams in ${DIAGRAM_DIR}/: ${missingDiagrams.join(", ")}. Read the relevant source files and generate complete mermaid diagrams in markdown.`
        : "",
      `Also consider if the changes introduce something that should be in a NEW diagram not yet listed (e.g., a new integration, a new pipeline, a new auth provider). If so, create it in ${DIAGRAM_DIR}/.`,
      `Use mermaid syntax inside markdown code blocks. Prioritize completeness for AI consumption — include every edge case and conditional path.`,
      `Do NOT stage or commit anything — only update/create diagram files.`,
    ]
      .filter(Boolean)
      .join(" ");

    // Chain: sonnet updates diagrams, then haiku commits everything
    const child = spawn(
      "bash",
      [
        "-c",
        'claude -p --model sonnet "$DIAGRAM_PROMPT" && claude -p --model haiku "$COMMIT_PROMPT"',
      ],
      {
        cwd: input.cwd,
        stdio: "ignore",
        detached: true,
        env: {
          ...process.env,
          DIAGRAM_PROMPT: diagramPrompt,
          COMMIT_PROMPT: commitPrompt,
        },
      }
    );
    child.unref();
  } else {
    // No diagrams affected — just commit
    console.error("All checks passed. Spawning background commit...");
    const child = spawn(
      "claude",
      ["-p", "--model", "haiku", commitPrompt],
      {
        cwd: input.cwd,
        stdio: "ignore",
        detached: true,
      }
    );
    child.unref();
  }
}

main().catch((e) => {
  console.error("Hook error:", e);
  process.exit(0); // Don't block on hook errors
});
