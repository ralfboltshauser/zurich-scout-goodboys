import express from "express";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const smithersBin = resolve(repoRoot, ".smithers/node_modules/.bin/smithers");
const latestOutputPath = resolve(repoRoot, ".smithers/outputs/challenge3-target-scout/latest.json");
const latestMarkdownPath = resolve(repoRoot, ".smithers/outputs/challenge3-target-scout/latest.md");
const iconPath = resolve(repoRoot, "deliverables/challenge3-target-customer-scouting/brand/zurich-scout-icon.png");

const app = express();
app.use(express.json({ limit: "1mb" }));

function stripAnsi(value) {
  return String(value ?? "").replace(/\u001b\[[0-9;]*m/g, "");
}

function runSmithers(args, { timeoutMs = 20_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(smithersBin, args, {
      cwd: repoRoot,
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`smithers ${args.join(" ")} timed out`));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      const cleanStdout = stripAnsi(stdout).trim();
      const cleanStderr = stripAnsi(stderr).trim();
      if (code !== 0) {
        const error = new Error(cleanStderr || cleanStdout || `smithers exited with ${code}`);
        error.stdout = cleanStdout;
        error.stderr = cleanStderr;
        reject(error);
        return;
      }
      try {
        resolvePromise(JSON.parse(cleanStdout));
      } catch {
        resolvePromise({ text: cleanStdout, stderr: cleanStderr });
      }
    });
  });
}

function readLatestOutput() {
  if (!existsSync(latestOutputPath)) return null;
  const output = JSON.parse(readFileSync(latestOutputPath, "utf8"));
  const companies = Array.isArray(output.companies) ? output.companies : [];
  const buyers = companies.flatMap((company) => company.buyers ?? []);
  const recommendationCounts = companies.reduce(
    (acc, company) => {
      const key = company.recommendation ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    { pursue: 0, watch: 0, reject: 0 },
  );
  const enrichTarget = (company) => {
    const appetite = company.scores?.zurichAppetite ?? 0;
    const priority = company.scores?.pursuitPriority ?? 0;
    const confidence = company.scores?.evidenceConfidence ?? 0;
    const alignmentScore = Math.round(appetite * 0.45 + priority * 0.4 + confidence * 0.15);
    return {
      name: company.name,
      recommendation: company.recommendation,
      priority,
      appetite,
      confidence,
      alignmentScore,
      buyers: company.buyers?.length ?? 0,
      entryLobs: (company.likelyEntryLobs ?? []).slice(0, 4),
      whyNow: Array.isArray(company.whyNow) ? company.whyNow.slice(0, 2) : [],
      currentBroker: "Not publicly identified",
      brokerValidationPriority:
        company.recommendation === "pursue" && alignmentScore >= 74
          ? "High"
          : company.recommendation === "pursue"
            ? "Medium"
            : "Low",
      brokerAction: "Validate broker-of-record, incumbent carrier, renewal timing and relationship owner in Zurich CRM before outreach.",
      alignmentNarrative:
        company.rationale ??
        "Zurich fit requires internal validation against appetite, CRM history, broker ownership, renewal timing and loss experience.",
      buyerPaths: (company.buyers ?? []).slice(0, 5).map((buyer) => ({
        name: buyer.name,
        role: buyer.role,
        confidence: buyer.confidence,
        rationale: buyer.relevanceRationale,
        contactPaths: buyer.businessContactPaths?.slice(0, 3) ?? [],
        warmIntroHypotheses: buyer.warmIntroHypotheses?.slice(0, 2) ?? [],
        publicProfiles: buyer.publicProfiles?.slice(0, 2) ?? [],
      })),
      rationale: company.rationale,
      nextAction: company.recommendedActions?.[0] ?? "Zurich CRM and broker validation before outreach.",
    };
  };
  const topCompanies = companies
    .slice()
    .map(enrichTarget)
    .sort((a, b) => b.alignmentScore - a.alignmentScore)
    .slice(0, 8)
    .map((company) => company);
  const buyerPaths = companies
    .filter((company) => Array.isArray(company.buyers) && company.buyers.length > 0)
    .sort((a, b) => (b.scores?.pursuitPriority ?? 0) - (a.scores?.pursuitPriority ?? 0))
    .slice(0, 6)
    .map((company) => ({
      name: company.name,
      recommendation: company.recommendation,
      priority: company.scores?.pursuitPriority ?? null,
      buyers: company.buyers.slice(0, 3).map((buyer) => ({
        name: buyer.name,
        role: buyer.role,
        confidence: buyer.confidence,
        rationale: buyer.relevanceRationale,
        contactPaths: buyer.businessContactPaths?.slice(0, 3) ?? [],
        warmIntroHypotheses: buyer.warmIntroHypotheses?.slice(0, 2) ?? [],
      })),
    }));

  return {
    executiveSummary: output.executiveSummary,
    counts: {
      companies: companies.length,
      buyers: buyers.length,
      pursue: recommendationCounts.pursue ?? 0,
      watch: recommendationCounts.watch ?? 0,
      reject: recommendationCounts.reject ?? 0,
    },
    topCompanies,
    buyerPaths,
    markdownPreview: existsSync(latestMarkdownPath)
      ? readFileSync(latestMarkdownPath, "utf8").slice(0, 6000)
      : output.markdownBrief?.slice(0, 6000) ?? "",
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, repoRoot, latestOutput: existsSync(latestOutputPath) });
});

app.get("/api/brand/icon", (_req, res) => {
  if (!existsSync(iconPath)) {
    res.status(404).json({ error: "Icon not found" });
    return;
  }
  res.sendFile(iconPath);
});

app.get("/api/overview", async (_req, res) => {
  try {
    const [ps, workflows] = await Promise.all([
      runSmithers(["ps", "--format", "json"], { timeoutMs: 15_000 }).catch((error) => ({ error: error.message, runs: [] })),
      runSmithers(["workflow", "list", "--format", "json"], { timeoutMs: 15_000 }).catch((error) => ({ error: error.message, workflows: [] })),
    ]);
    res.json({
      workflows: workflows.workflows ?? [],
      runs: ps.runs ?? [],
      cta: ps.cta ?? null,
      output: readLatestOutput(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/runs", async (req, res) => {
  const runId = `zurich-scout-ui-${Date.now()}`;
  const input = {
    prompt:
      req.body?.prompt ||
      "Demo Zurich Scout target customer scouting with ICP approval before sourcing.",
    maxCompanies: Number(req.body?.maxCompanies ?? 1),
    maxPeoplePerCompany: Number(req.body?.maxPeoplePerCompany ?? 2),
    companyConcurrency: 1,
    qualityConcurrency: 1,
    buyerMapConcurrency: 1,
    personConcurrency: 1,
    reviewIcp: true,
  };

  try {
    const result = await runSmithers(
      [
        "workflow",
        "run",
        "challenge3-target-scout",
        "--detach",
        "--run-id",
        runId,
        "--input",
        JSON.stringify(input),
        "--format",
        "json",
      ],
      { timeoutMs: 30_000 },
    );
    res.json({ runId, input, result });
  } catch (error) {
    res.status(500).json({ error: error.message, stdout: error.stdout, stderr: error.stderr, runId, input });
  }
});

app.get("/api/runs/:runId", async (req, res) => {
  const { runId } = req.params;
  const [inspect, events] = await Promise.all([
    runSmithers(["inspect", runId, "--format", "json"], { timeoutMs: 20_000 }).catch((error) => ({ error: error.message })),
    runSmithers(["events", runId, "--format", "json", "--limit", "80"], { timeoutMs: 20_000 }).catch((error) => ({
      error: error.message,
      events: [],
    })),
  ]);
  const rawEvents = Array.isArray(events) ? events : events.events ?? [];
  res.json({
    inspect,
    events: rawEvents.map((event) => stripAnsi(typeof event === "string" ? event : JSON.stringify(event))),
  });
});

app.post("/api/runs/:runId/approve", async (req, res) => {
  try {
    const result = await runSmithers(["approve", req.params.runId, "--format", "json"], { timeoutMs: 30_000 });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message, stdout: error.stdout, stderr: error.stderr });
  }
});

app.get("/api/output", (_req, res) => {
  const output = readLatestOutput();
  if (!output) {
    res.status(404).json({ error: "No Challenge 3 output found" });
    return;
  }
  res.json(output);
});

const dist = resolve(here, "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(resolve(dist, "index.html")));
}

const port = Number(process.env.PORT ?? 5179);
const host = process.env.HOST ?? "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Zurich Scout workflow visualizer API listening on http://${host}:${port}`);
});
