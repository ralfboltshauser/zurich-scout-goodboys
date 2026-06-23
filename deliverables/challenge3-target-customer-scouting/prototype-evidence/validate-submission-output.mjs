#!/usr/bin/env node
import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "prototype-evidence/latest.json";
const raw = readFileSync(path, "utf8");
const brief = JSON.parse(raw);
const issues = [];

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const array = (value) => (Array.isArray(value) ? value : []);
const text = (value) => (typeof value === "string" ? value : "");

if (!isObject(brief)) issues.push("Root JSON is not an object.");
if (!Array.isArray(brief.companies)) issues.push("Missing companies array.");
if (text(brief.markdownBrief).length < 5000) issues.push("Markdown brief is unexpectedly short.");
if (!text(brief.markdownBrief).includes("## Portfolio Dashboard")) issues.push("Missing portfolio dashboard.");
if (!text(brief.markdownBrief).includes("## Zurich Action Queue")) issues.push("Missing Zurich action queue.");
if (/clears the pursue threshold|Final artifact repair downgraded/i.test(raw)) {
  issues.push("Stale pursue/watch repair language remains in the artifact.");
}

const companies = array(brief.companies);
const names = new Map();
for (const company of companies) {
  const name = text(company.name).trim();
  if (!name) issues.push("Company with missing name.");
  const key = name.toLowerCase();
  names.set(key, (names.get(key) ?? 0) + 1);

  if (!["pursue", "watch", "reject"].includes(company.recommendation)) {
    issues.push(`${name || "Unknown company"}: invalid recommendation.`);
  }
  if (!isObject(company.scores)) issues.push(`${name}: missing scores.`);
  if (company.recommendation === "pursue" && Number(company.scores?.pursuitPriority ?? 0) < 60) {
    issues.push(`${name}: pursue recommendation with low priority score.`);
  }
  if (array(company.sourceUrls).length < 3 && Number(company.scores?.evidenceConfidence ?? 0) >= 60) {
    issues.push(`${name}: high evidence confidence but fewer than 3 source URLs.`);
  }
  if (array(company.positiveEvidence).length === 0) issues.push(`${name}: no positive evidence.`);
  if (array(company.negativeEvidence).length === 0) issues.push(`${name}: no negative evidence.`);
  if (array(company.unknowns).length === 0) issues.push(`${name}: no unknowns.`);
  if (array(company.openUnderwritingQuestions).length === 0) issues.push(`${name}: no open underwriting questions.`);
  if (array(company.buyers).length > 5) issues.push(`${name}: more than 5 buyers.`);

  for (const buyer of array(company.buyers)) {
    const buyerName = text(buyer.name) || "Unknown buyer";
    if (array(buyer.sourceUrls).length === 0) issues.push(`${name}/${buyerName}: no buyer source URLs.`);
    if (array(buyer.publicProfiles).length === 0) issues.push(`${name}/${buyerName}: no public profiles.`);
    if (array(buyer.businessContactPaths).length === 0) issues.push(`${name}/${buyerName}: no business contact paths.`);
    if (text(buyer.personalizedOutreachAngle).trim().length < 80) {
      issues.push(`${name}/${buyerName}: outreach angle is too thin.`);
    }
  }
}

for (const [name, count] of names.entries()) {
  if (count > 1) issues.push(`Duplicate company display name "${name}" appears ${count} times.`);
}

const recommendationCounts = Object.fromEntries(
  ["pursue", "watch", "reject"].map((recommendation) => [
    recommendation,
    companies.filter((company) => company.recommendation === recommendation).length,
  ]),
);

const summary = {
  path,
  companies: companies.length,
  buyers: companies.reduce((sum, company) => sum + array(company.buyers).length, 0),
  recommendationCounts,
  markdownChars: text(brief.markdownBrief).length,
  issueCount: issues.length,
  issues,
};

console.log(JSON.stringify(summary, null, 2));
if (issues.length > 0) process.exit(1);
