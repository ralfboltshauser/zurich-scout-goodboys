import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pursuitBriefSchema } from "../components/gtm/schemas";

const path = process.argv[2] ?? join(process.cwd(), "outputs", "challenge3-target-scout", "latest.json");
const raw = readFileSync(path, "utf8");
const brief = pursuitBriefSchema.parse(JSON.parse(raw));
const issues: string[] = [];

if (brief.companies.length === 0) {
  issues.push("No companies were produced.");
}

if (brief.markdownBrief.length < 5_000) {
  issues.push(`Markdown brief is unexpectedly short (${brief.markdownBrief.length} chars).`);
}

if (!brief.markdownBrief.includes("## Portfolio Dashboard")) {
  issues.push("Markdown brief is missing the portfolio dashboard.");
}

if (!brief.markdownBrief.includes("## Zurich Action Queue")) {
  issues.push("Markdown brief is missing the Zurich action queue.");
}

const companyNames = new Map<string, number>();
for (const company of brief.companies) {
  const normalizedName = company.name.trim().toLowerCase();
  companyNames.set(normalizedName, (companyNames.get(normalizedName) ?? 0) + 1);
}

for (const [name, count] of companyNames.entries()) {
  if (count > 1) {
    issues.push(`Duplicate company display name "${name}" appears ${count} times; disambiguate by parent, legal entity, website, FDIC cert, CIK, or geography.`);
  }
}

for (const company of brief.companies) {
  if (company.sourceUrls.length < 3 && company.scores.evidenceConfidence >= 60) {
    issues.push(`${company.name}: evidence confidence ${company.scores.evidenceConfidence} but only ${company.sourceUrls.length} source URLs.`);
  }

  if (company.positiveEvidence.length === 0) issues.push(`${company.name}: no positive evidence.`);
  if (company.negativeEvidence.length === 0) issues.push(`${company.name}: no negative evidence.`);
  if (company.unknowns.length === 0) issues.push(`${company.name}: no unknowns.`);
  if (company.openUnderwritingQuestions.length === 0) issues.push(`${company.name}: no open underwriting questions.`);
  if (company.buyers.length > 5) issues.push(`${company.name}: has ${company.buyers.length} buyers, expected at most 5.`);

  if (company.recommendation === "pursue" && company.scores.pursuitPriority < 60) {
    issues.push(`${company.name}: pursue recommendation with low priority score ${company.scores.pursuitPriority}.`);
  }

  for (const buyer of company.buyers) {
    if (buyer.sourceUrls.length === 0) issues.push(`${company.name}/${buyer.name}: no buyer source URLs.`);
    if (buyer.publicProfiles.length === 0) issues.push(`${company.name}/${buyer.name}: no public profiles.`);
    if (buyer.businessContactPaths.length === 0) issues.push(`${company.name}/${buyer.name}: no business contact paths.`);
    if (buyer.personalizedOutreachAngle.trim().length < 80) {
      issues.push(`${company.name}/${buyer.name}: outreach angle is too thin.`);
    }
  }
}

const recommendationCounts = Object.fromEntries(
  ["pursue", "watch", "reject"].map((recommendation) => [
    recommendation,
    brief.companies.filter((company) => company.recommendation === recommendation).length,
  ]),
);

const summary = {
  path,
  companies: brief.companies.length,
  buyers: brief.companies.reduce((sum, company) => sum + company.buyers.length, 0),
  recommendationCounts,
  markdownChars: brief.markdownBrief.length,
  issueCount: issues.length,
  issues,
};

console.log(JSON.stringify(summary, null, 2));

if (issues.length > 0) {
  process.exit(1);
}
