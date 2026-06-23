# AMA Summary: Case 3 - Target Customer Scouting

Source transcript: `resources/ama-case-3-target-customer-scouting-transcript.txt`

## Context

This AMA discussed the Zurich North America business challenge around identifying untapped middle-market customer opportunities. The core business objective is to create additional opportunities for underwriting teams by using public and private data sources to identify prospects that are aligned with Zurich appetite but are not already obvious through existing channels.

## Stakeholders Mentioned

- Andy: business-side stakeholder for the challenge.
- Ashley: North America stakeholder, explained data availability and validation sources.
- Joel / Anthony: challenge facilitation and technical/business coordination.

## Core Problem

Zurich is already strong with Fortune 500 accounts and has grown its middle-market book, but there is still significant white space in the US middle market. The challenge is to identify untapped opportunities efficiently and at scale, especially by industry, broker source, company type, and appetite fit.

The desired solution is not just a generic lead list. It should help uncover prospects that Zurich may not currently see through normal broker channels and explain why they are worth pursuing.

## Current Data Sources And Workflow

Zurich currently uses traditional and internal sources:

- US/global data lake.
- Old opportunities.
- Companies Zurich quoted in the past but did not win.
- Industry data across focused industry groups.
- Association membership and public information.
- Verisk-like external/customer data sources.
- Russell 3000 analysis by CDM and global teams.
- Dun & Bradstreet data shared for the challenge, covering the largest 30,000 US companies with public company information.

For the challenge, Zurich is not sharing current customer data or current business data. In real adoption, they would combine the prototype output with internal customer, broker, and relationship data.

## Broker Relationship Reality

The US commercial insurance workflow is heavily relationship-driven. Distribution professionals source business through disciplined broker meetings, understanding each broker's book, customer needs, and appetite fit. Zurich also profiles brokers to understand whether they have the right customer mix.

This means a good prototype should not stop at "company looks attractive." It should also suggest the likely broker/distribution route or identify what broker relationship data would be needed.

## Validation Guidance

Validation should start with Zurich's appetite guardrails:

- Industry group fit.
- Detailed market appetite guidance.
- SIC-level appetite classifications.
- Preferred / acceptable / not wanted categories.
- Matching D&B company data or externally sourced companies against appetite.

Zurich may later overlay submitted prototype outputs with confidential internal ground truth:

- Who Zurich already insures.
- Who Zurich previously quoted.
- Internal appetite evidence.
- Customer/prospect lists that cannot be shared with hackathon teams.

## Explainability Requirement

Stakeholders emphasized that prototypes should document their rationale. Because there are many gray areas, Zurich needs to understand why an agent decided a prospect was in appetite or not.

The agent should show:

- Which appetite rule or SIC code matched.
- Which public signals support the recommendation.
- Which risk factors or gray areas remain.
- Why the prospect should be pursued now.
- What additional internal data would be needed before outreach.

## Prototype Implications

A strong case 3 prototype should include:

1. Ingest appetite documents and SIC-level classifications.
2. Mine the D&B 30,000-company list and/or external company sources.
3. Enrich candidate companies with public data.
4. Score appetite fit with transparent reasoning.
5. Identify likely line-of-business entry points.
6. Flag risks, missing data, and underwriting questions.
7. Recommend broker/distribution actions.
8. Produce an account brief that can be reviewed by sales, distribution, or underwriting.

## Key Takeaways

- The business value is new middle-market revenue, not technical novelty alone.
- Public data is useful, but final validation requires internal Zurich data.
- The Russell 3000 is already relatively covered; the opportunity is broader white space, especially from D&B/private-company data and other external sources.
- Broker relationships are central to execution.
- The model must be explainable enough for Zurich to judge why a company is or is not in appetite.
- A useful output is an actionable prospect brief, not just a ranked list.

