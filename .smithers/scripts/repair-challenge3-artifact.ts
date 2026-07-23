import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pursuitBriefSchema } from "../components/gtm/schemas";

const artifactPath = process.argv[2] ?? ".smithers/outputs/challenge3-target-scout/latest.json";
const maxBuyers = 5;

const brief = pursuitBriefSchema.parse(JSON.parse(readFileSync(artifactPath, "utf8")));

const companies = brief.companies.map((company) => {
  const buyers = dedupeBuyers(company.buyers).slice(0, maxBuyers);
  if (company.recommendation !== "pursue" || buyers.length > 0) return { ...company, buyers };

  return {
    ...company,
    scores: {
      ...company.scores,
      pursuitPriority: Math.min(company.scores.pursuitPriority, 64),
    },
    recommendation: "watch" as const,
    rationale: `${company.rationale} Final artifact repair downgraded this account from pursue to watch because no verified public buyer path survived buyer mapping.`,
    riskFlags: [
      ...company.riskFlags,
      "No verified public buyer path survived buyer mapping; do not treat as active pursue until Zurich or broker data identifies a buyer.",
    ],
    recommendedActions: [
      "Run Zurich CRM, broker and internal relationship checks to identify a verified buyer before external outreach.",
      ...company.recommendedActions,
    ],
    buyers,
  };
});

const repaired = {
  ...brief,
  executiveSummary: buildExecutiveSummary(companies),
  companies,
  markdownBrief: buildMarkdownBrief(brief.icp, companies),
};

pursuitBriefSchema.parse(repaired);

writeFileSync(artifactPath, `${JSON.stringify(repaired, null, 2)}\n`, "utf8");
writeFileSync(artifactPath.replace(/\.json$/, ".md"), `${repaired.markdownBrief}\n`, "utf8");

const outputDir = join(process.cwd(), ".smithers", "outputs", "challenge3-target-scout");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
writeFileSync(join(outputDir, `pursuit-brief-repaired-${stamp}.json`), `${JSON.stringify(repaired, null, 2)}\n`, "utf8");
writeFileSync(join(outputDir, `pursuit-brief-repaired-${stamp}.md`), `${repaired.markdownBrief}\n`, "utf8");

console.log(JSON.stringify({
  companies: repaired.companies.length,
  buyers: repaired.companies.reduce((sum, company) => sum + company.buyers.length, 0),
  maxBuyers: Math.max(...repaired.companies.map((company) => company.buyers.length)),
  recommendations: countRecommendations(repaired.companies),
  markdownChars: repaired.markdownBrief.length,
}, null, 2));

function dedupeBuyers(buyers: typeof brief.companies[number]["buyers"]) {
  const seen = new Set<string>();
  const result: typeof buyers = [];
  for (const buyer of buyers.sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))) {
    const key = normalize(`${buyer.name} ${buyer.role}`);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(buyer);
  }
  return result;
}

function buildExecutiveSummary(companies: typeof brief.companies) {
  const counts = countRecommendations(companies);
  const topAccounts = [...companies]
    .sort((a, b) => b.scores.pursuitPriority - a.scores.pursuitPriority)
    .slice(0, 5)
    .map((company) => `${company.name} (${company.recommendation}, priority ${company.scores.pursuitPriority})`)
    .join("; ");

  return [
    `Zurich Challenge 3 scout reviewed ${companies.length} financial-institution accounts: ${counts.pursue} pursue, ${counts.watch} watch, ${counts.reject} reject.`,
    topAccounts ? `Highest-priority accounts: ${topAccounts}.` : "",
    "Use this as a pursuit brief, not a quote-ready underwriting file: each account still requires Zurich CRM, broker, incumbent carrier, loss, renewal, and account-ownership validation before outreach.",
  ].filter(Boolean).join(" ");
}

function buildMarkdownBrief(icp: typeof brief.icp, companies: typeof brief.companies) {
  const rankedCompanies = [...companies].sort((a, b) => b.scores.pursuitPriority - a.scores.pursuitPriority);
  const lines: string[] = [
    "# Zurich Challenge 3 Target Scout",
    "",
    "## Executive Summary",
    "",
    buildExecutiveSummary(rankedCompanies),
    "",
    "## ICP",
    "",
    icp.definition,
    "",
    `Target vertical: ${icp.targetVertical}`,
    "",
    `Primary buyer personas: ${icp.buyerPersonas.slice(0, 7).join("; ")}`,
    "",
    "## Portfolio Dashboard",
    "",
    ...buildPortfolioDashboard(rankedCompanies),
    "",
    "## Ranked Account Table",
    "",
    ...buildRankedTable(rankedCompanies),
    "",
    "## Zurich Action Queue",
    "",
    ...buildActionQueue(rankedCompanies),
    "",
    "## Cross-Account Underwriting Themes",
    "",
    ...buildUnderwritingThemes(rankedCompanies),
    "",
    "## Ranked Account Briefs",
  ];

  for (const company of rankedCompanies) {
    const buyers = company.buyers.slice(0, maxBuyers);
    lines.push(
      "",
      `### ${company.name}`,
      "",
      `Recommendation: ${company.recommendation}`,
      `Scores: ICP ${company.scores.icpFit} | Zurich appetite ${company.scores.zurichAppetite} | Pursuit priority ${company.scores.pursuitPriority} | Evidence confidence ${company.scores.evidenceConfidence}`,
      `Website: ${company.website ?? "unknown"}`,
      `Subsegment / SIC: ${company.subsegment ?? "unknown"} / ${company.likelySic ?? "unknown"}`,
      "",
      "Why this account:",
      company.rationale,
      "",
      "Why now:",
      ...company.whyNow.slice(0, 5).map((item) => `- ${item}`),
      "",
      `Likely Zurich entry LOBs: ${company.likelyEntryLobs.join(", ") || "unknown"}`,
      "",
      "Positive evidence:",
      ...company.positiveEvidence.slice(0, 4).map((item) => `- ${item.claim} Implication: ${item.salesImplication}`),
      "",
      "Negative evidence / risk flags:",
      ...[
        ...company.negativeEvidence.slice(0, 3).map((item) => `${item.claim} Implication: ${item.salesImplication}`),
        ...company.riskFlags.slice(0, 3),
      ].map((item) => `- ${item}`),
      "",
      "Unknowns Zurich must validate:",
      ...company.unknowns.slice(0, 4).map((item) => `- ${item.claim} Implication: ${item.salesImplication}`),
      "",
      "Priority buyers and paths:",
      ...(buyers.length > 0
        ? buyers.flatMap((buyer) => [
            `- ${buyer.name}, ${buyer.role} (priority ${buyer.priority}, confidence ${buyer.confidence})`,
            `  - Outreach angle: ${buyer.personalizedOutreachAngle}`,
            `  - Business paths: ${buyer.businessContactPaths.slice(0, 3).join("; ") || "incomplete"}`,
            `  - Warm paths: ${buyer.warmIntroHypotheses.slice(0, 3).join("; ") || "not verified"}`,
          ])
        : ["- No verified buyer selected."]),
      "",
      "Next actions:",
      ...company.recommendedActions.slice(0, 5).map((item) => `- ${item}`),
      "",
      "Open underwriting questions:",
      ...company.openUnderwritingQuestions.slice(0, 6).map((item) => `- ${item}`),
      "",
      `Source coverage: ${company.sourceCoverageCategories.join(", ") || "unknown"}`,
      `Key sources: ${company.sourceUrls.slice(0, 8).join(", ") || "none"}`,
    );
  }

  return lines.join("\n");
}

function buildPortfolioDashboard(companies: typeof brief.companies) {
  const counts = countRecommendations(companies);
  const averagePriority = average(companies.map((company) => company.scores.pursuitPriority));
  const averageConfidence = average(companies.map((company) => company.scores.evidenceConfidence));
  const lobCounts = countValues(companies.flatMap((company) => company.likelyEntryLobs));
  const topLobs = [...lobCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([lob, count]) => `${lob}: ${count}`)
    .join("; ");
  const bestAccounts = companies
    .filter((company) => company.recommendation === "pursue")
    .slice(0, 10)
    .map((company) => `${company.name} (${company.scores.pursuitPriority})`)
    .join("; ");

  return [
    `- Account count: ${companies.length}`,
    `- Recommendations: pursue ${counts.pursue}, watch ${counts.watch}, reject ${counts.reject}`,
    `- Average pursuit priority: ${averagePriority}; average evidence confidence: ${averageConfidence}`,
    `- Most common Zurich entry LOBs: ${topLobs || "not enough data"}`,
    `- First Zurich review batch: ${bestAccounts || "none"}`,
    "- Operating posture: treat every `pursue` as qualified for broker/internal validation, not as quote-ready. The workflow intentionally downgrades accounts when CAT quality, broker path, loss history, renewal timing, or buyer verification is weak.",
  ];
}

function buildRankedTable(companies: typeof brief.companies) {
  const rows = [
    "| Rank | Account | Rec | Priority | Appetite | Confidence | First LOBs | Best buyer path |",
    "| ---: | --- | --- | ---: | ---: | ---: | --- | --- |",
  ];

  for (const [index, company] of companies.entries()) {
    const buyer = company.buyers[0];
    rows.push(
      [
        `| ${index + 1}`,
        escapeTable(company.name),
        company.recommendation,
        company.scores.pursuitPriority,
        company.scores.zurichAppetite,
        company.scores.evidenceConfidence,
        escapeTable(company.likelyEntryLobs.slice(0, 3).join(", ") || "unknown"),
        escapeTable(buyer ? `${buyer.name}, ${buyer.role}` : "not verified"),
      ].join(" | ") + " |",
    );
  }

  return rows;
}

function buildActionQueue(companies: typeof brief.companies) {
  const topPursue = companies.filter((company) => company.recommendation === "pursue").slice(0, 12);
  if (topPursue.length === 0) {
    return ["- No accounts cleared the pursue threshold. Review watch accounts only after Zurich internal data supplies broker, renewal, or appetite evidence."];
  }

  return topPursue.flatMap((company, index) => {
    const buyer = company.buyers[0];
    return [
      `- ${index + 1}. ${company.name}: ${company.recommendedActions[0] ?? "Validate Zurich account ownership, broker path, renewal timing, and underwriting appetite."}`,
      `  - First buyer route: ${buyer ? `${buyer.name}, ${buyer.role}` : "not verified"}`,
      `  - First LOB hypothesis: ${company.likelyEntryLobs.slice(0, 3).join(", ") || "unknown"}`,
      `  - Gate before outreach: ${company.openUnderwritingQuestions[0] ?? "Confirm broker, renewal, loss, and incumbent-carrier data."}`,
    ];
  });
}

function buildUnderwritingThemes(companies: typeof brief.companies) {
  return [
    "Recurring risk flags:",
    ...topPhrases(companies.flatMap((company) => company.riskFlags), 10).map((item) => `- ${item}`),
    "",
    "Recurring Zurich validation questions:",
    ...topPhrases(companies.flatMap((company) => company.openUnderwritingQuestions), 10).map((item) => `- ${item}`),
  ];
}

function countRecommendations(companies: typeof brief.companies) {
  return {
    pursue: companies.filter((company) => company.recommendation === "pursue").length,
    watch: companies.filter((company) => company.recommendation === "watch").length,
    reject: companies.filter((company) => company.recommendation === "reject").length,
  };
}

function countValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
  }
  return counts;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function escapeTable(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function topPhrases(values: string[], limit: number) {
  const seen = new Set<string>();
  const ranked: string[] = [];
  for (const value of values) {
    const normalized = value.replace(/\s+/g, " ").trim();
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    ranked.push(normalized);
  }
  return ranked.slice(0, limit);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
