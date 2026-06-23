// smithers-source: authored
// smithers-metadata-version: 1
// smithers-display-name: Challenge 3 Target Scout
// smithers-description: Build an evidence-backed Zurich Challenge 3 GTM pursuit brief for a small set of financial-institution prospects.
// smithers-tags: gtm, research, sales, insurance
/** @jsxImportSource smithers-orchestrator */
import { createSmithers } from "smithers-orchestrator";
import { z } from "zod/v4";
import { agents } from "../agents";
import {
  AssemblePursuitBrief,
  BuyerMap,
  CompanyQualityPanel,
  DeepCompanyResearch,
  DeepPersonResearch,
  DefineIcp,
  SourceCandidates,
  TriageCandidates,
  approvalSchema,
  buyerMapSchema,
  candidateTriageSchema,
  candidateUniverseSchema,
  companyProfileSchema,
  enrichedBuyerSchema,
  icpSchema,
  pursuitBriefSchema,
  qualifiedCompanySchema,
  seedCompanySchema,
} from "../components/gtm";

const CHALLENGE_RESOURCES = [
  "resources/Hyperchallenge ETH.pdf",
  "resources/ama-case-3-target-customer-scouting-summary.md",
  "resources/ama-case-3-target-customer-scouting-transcript.txt",
  "resources/ZNA Middle Markets Financial Institutions Playbook.pdf",
] as const;

const inputSchema = z.object({
  prompt: z
    .string()
    .default("Find high-quality Zurich Challenge 3 target customer prospects and produce a GTM pursuit brief."),
  seedCompanies: z.array(seedCompanySchema).default([]),
  targetVertical: z.string().default("US middle-market financial institutions"),
  maxCompanies: z.number().int().min(1).max(100).default(2),
  maxPeoplePerCompany: z.number().int().min(1).max(5).default(5),
  companyConcurrency: z.number().int().min(1).max(12).default(2),
  qualityConcurrency: z.number().int().min(1).max(12).default(2),
  buyerMapConcurrency: z.number().int().min(1).max(12).default(2),
  personConcurrency: z.number().int().min(1).max(24).default(3),
  reviewIcp: z.boolean().default(false),
});

const { Workflow, Sequence, Approval, smithers, outputs } = createSmithers({
  input: inputSchema,
  icp: icpSchema,
  approval: approvalSchema,
  candidateUniverse: candidateUniverseSchema,
  candidateTriage: candidateTriageSchema,
  companyProfile: companyProfileSchema,
  qualifiedCompany: qualifiedCompanySchema,
  buyerMap: buyerMapSchema,
  enrichedBuyer: enrichedBuyerSchema,
  pursuitBrief: pursuitBriefSchema,
});

export default smithers((ctx) => {
  const prompt = ctx.input.prompt;
  const maxCompanies = ctx.input.maxCompanies;
  const maxPeoplePerCompany = ctx.input.maxPeoplePerCompany;
  const companyConcurrency = ctx.input.companyConcurrency;
  const qualityConcurrency = ctx.input.qualityConcurrency;
  const buyerMapConcurrency = ctx.input.buyerMapConcurrency;
  const personConcurrency = ctx.input.personConcurrency;

  const icp = ctx.outputMaybe("icp", { nodeId: "gtm:define-icp" });
  const approval = ctx.outputMaybe("approval", { nodeId: "gtm:approve-icp" });
  const icpApproved = !ctx.input.reviewIcp || approval?.approved === true;

  const candidateUniverse = ctx.outputMaybe("candidateUniverse", { nodeId: "gtm:source-candidates" });
  const candidateTriage = ctx.outputMaybe("candidateTriage", { nodeId: "gtm:triage-candidates" });
  const selectedCompanyCount = candidateTriage
    ? Math.min(maxCompanies, candidateTriage.selectedCompanies.length)
    : 0;

  const companyProfiles = ctx.outputs.companyProfile ?? [];
  const companyProfilesReady = candidateTriage !== undefined && companyProfiles.length >= selectedCompanyCount;

  const qualifiedCompanies = ctx.outputs.qualifiedCompany ?? [];
  const qualifiedCompaniesReady = companyProfilesReady && qualifiedCompanies.length >= selectedCompanyCount;

  const buyerMaps = ctx.outputs.buyerMap ?? [];
  const buyerMapsReady = qualifiedCompaniesReady && buyerMaps.length >= qualifiedCompanies.length;
  const expectedBuyerCount = buyerMaps.reduce((sum, buyerMap) => sum + (buyerMap.buyers?.length ?? 0), 0);

  const enrichedBuyers = ctx.outputs.enrichedBuyer ?? [];
  const peopleReady = buyerMapsReady && (expectedBuyerCount === 0 || enrichedBuyers.length >= expectedBuyerCount);

  return (
    <Workflow name="challenge3-target-scout">
      <Sequence>
        <DefineIcp
          idPrefix="gtm"
          agent={agents.smartTool}
          prompt={prompt}
          targetVertical={ctx.input.targetVertical}
          challengeResources={[...CHALLENGE_RESOURCES]}
        />

        {ctx.input.reviewIcp && icp ? (
          <Approval
            id="gtm:approve-icp"
            output={outputs.approval}
            onDeny="fail"
            request={{
              title: "Approve Challenge 3 ICP before sourcing candidates",
              summary: [
                "Review the ICP definition before the workflow spends research budget on sourcing and account qualification.",
                "",
                JSON.stringify(icp, null, 2),
              ].join("\n"),
            }}
          />
        ) : null}

        {icp && icpApproved ? (
          <SourceCandidates
            idPrefix="gtm"
            agent={agents.smartTool}
            prompt={prompt}
            icp={icp}
            seedCompanies={ctx.input.seedCompanies}
          />
        ) : null}

        {icp && candidateUniverse ? (
          <TriageCandidates
            idPrefix="gtm"
            agent={agents.smart}
            prompt={prompt}
            icp={icp}
            candidateUniverse={candidateUniverse}
            maxCompanies={maxCompanies}
          />
        ) : null}

        {icp && candidateTriage ? (
          <DeepCompanyResearch
            idPrefix="gtm"
            agent={agents.smartTool}
            prompt={prompt}
            icp={icp}
            candidateTriage={candidateTriage}
            maxCompanies={maxCompanies}
            maxConcurrency={companyConcurrency}
          />
        ) : null}

        {icp && companyProfilesReady ? (
          <CompanyQualityPanel
            idPrefix="gtm"
            agent={agents.smart}
            prompt={prompt}
            icp={icp}
            companyProfiles={companyProfiles.slice(0, selectedCompanyCount)}
            maxConcurrency={qualityConcurrency}
          />
        ) : null}

        {icp && qualifiedCompaniesReady ? (
          <BuyerMap
            idPrefix="gtm"
            agent={agents.smartTool}
            prompt={prompt}
            icp={icp}
            companies={qualifiedCompanies.slice(0, selectedCompanyCount)}
            maxPeoplePerCompany={maxPeoplePerCompany}
            maxConcurrency={buyerMapConcurrency}
          />
        ) : null}

        {buyerMapsReady ? (
          <DeepPersonResearch
            idPrefix="gtm"
            agent={agents.smartTool}
            prompt={prompt}
            companies={qualifiedCompanies.slice(0, selectedCompanyCount)}
            buyerMaps={buyerMaps}
            maxConcurrency={personConcurrency}
          />
        ) : null}

        {icp && peopleReady ? (
          <AssemblePursuitBrief
            idPrefix="gtm"
            agent={agents.smart}
            prompt={prompt}
            icp={icp}
            companies={qualifiedCompanies.slice(0, selectedCompanyCount)}
            enrichedBuyers={enrichedBuyers}
          />
        ) : null}
      </Sequence>
    </Workflow>
  );
});
