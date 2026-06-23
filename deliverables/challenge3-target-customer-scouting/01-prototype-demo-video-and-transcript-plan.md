# Deliverable 1 Plan: Prototype Demo Video, Transcript, And GitHub Link

## Required Output

- 2-3 minute MP4 walkthrough.
- Transcript uploaded as a separate file.
- GitHub link to working prototype.

## Core Story

"Zurich has a repeatable opportunity to identify and prioritize middle-market white space, but the bottleneck is not finding random company names. The bottleneck is deciding which accounts deserve distribution and underwriting attention now. Our target scout turns public signals into an explainable pursuit brief, then tells Zurich exactly what internal data to validate before outreach."

Memorable line:

"Zurich does not need more leads; Zurich needs fewer, better-justified pursuit decisions that respect appetite, broker ownership, and relationship timing."

## Hackathon Guide Constraints

- This video is the product. Anything not shown in the video or deck has no submission value.
- Prefer a deterministic recorded walkthrough unless the live demo has been tested repeatedly.
- Rehearse the final script at least 5 times and keep it under the hard 3-minute limit.
- Use persona-based storytelling instead of a generic product tour.
- The first 20 seconds must create emotional buy-in; the rest provides logical proof.
- Show real validation evidence if available: interview quote, scoring sheet, or call-note snapshot.

## Demo Persona

Use a Zurich distribution leader persona:

"Meet Maya, a Zurich regional distribution leader. She has 70 possible FI accounts on her desk, limited broker meeting time, and no interest in another generic lead list. She needs to know which accounts deserve the next hour and what Zurich must check before anyone reaches out."

The demo then follows Maya from noisy account universe to account review memo.

## Video Structure

0:00-0:20 - Problem and insight.

- Zurich is strong in Fortune 500 and growing middle market, but white space remains.
- Current opportunity sourcing is relationship-heavy and fragmented across brokers, internal history, appetite docs, and public data.
- We built for the real workflow: public discovery plus internal Zurich validation before outreach.
- Introduce Maya and the "which account deserves my next hour?" decision.

0:20-0:45 - What the prototype does.

- Ingests target universe and appetite assumptions.
- Enriches companies with public signals.
- Scores fit, appetite, confidence, and pursuit priority.
- Produces account briefs with evidence, risks, unknowns, buyer routes, and next distribution actions.
- Outputs structured JSON and executive-readable Markdown/HTML.

0:45-1:45 - Live demo.

- Show before/after:
  - Before: a messy public-data account with fragments from company pages, FDIC/SEC records, news, and leadership sources.
  - After: a Zurich account review memo with "why now," "why Zurich," "who might matter," "what can block appetite," and "what to check before action."
- Show portfolio dashboard:
  - 70 accounts reviewed.
  - 18 pursue, 50 watch, 2 reject.
  - Top Zurich entry lines: Cyber, Financial Lines, Property, GL, WC, Umbrella.
- Open one top pursuit account:
  - Citizens Business Bank or Nicolet National Bank.
  - Explain why-now trigger.
  - Show score breakdown: Zurich appetite/SIC fit, trigger strength, Zurich line relevance, buyer/broker route plausibility, evidence confidence, and internal-data dependency.
  - Show first LOB hypothesis.
  - Show buyer path.
  - Show "gate before outreach": CRM, broker owner, incumbent, renewal, loss history.
- Show one watch account:
  - Explain why the system did not overclaim.
- Show one reject:
  - Explain quality control and restraint.
  - Say explicitly: "This protects Zurich's relationship capital by suppressing weak opportunities."
- Show the optional internal overlay if ready:
  - CRM: no current match / prior quote / existing customer.
  - Broker owner: unknown or named.
  - Renewal window.
  - Loss-history flag.
  - Resulting action: broker conversation brief, watch, or no action.

1:45-2:20 - Agentic AI and technical credibility.

- Smithers workflow decomposes the work:
  - ICP definition.
  - Candidate sourcing.
  - Company research.
  - Triage.
  - Buyer mapping.
  - Brief assembly.
  - Validation/repair.
- The agent separates facts, inferences, unknowns, and Zurich-only validation gates.
- Capped research and cached runs keep cost controlled.

2:20-2:55 - Business value and ask.

- This gives Zurich a repeatable way to prioritize broker/distribution effort.
- It can be validated against Zurich CRM, prior submissions, policies, broker relationships, and loss history.
- Next step: run on the D&B 30,000-company file and one additional industry vertical, then compare against Zurich confidential ground truth.

## Subjective Value: What Should Feel Impressive

- The demo should feel like a sales and underwriting command center, not a spreadsheet.
- The strongest moment is "gate before outreach" because it shows respect for Zurich's real operating model.
- The reviewer should feel: "This team understands our business, not just AI."
- The reviewer should emotionally want Maya to have this tool on Monday morning.

## Technical Proof To Show

- Repository path and runnable command.
- `latest.json` as machine-readable artifact.
- `latest.md` as human-readable artifact.
- Validation script passing.
- Evidence that weak accounts are downgraded.
- Validation command:

```bash
bun .smithers/scripts/validate-challenge3-output.ts .smithers/outputs/challenge3-target-scout/latest.json
```

- Expected validation result: 70 companies, 304 buyers, 18 pursue, 50 watch, 2 reject, 0 issues.
- Show capped people per company, watch/reject restraint, and no automatic outreach.

## Demo Reliability Plan

- Use a fixed browser state and fixed artifact paths.
- Keep a local backup recording of the demo.
- Test the final demo route three times: open page, show portfolio, open top account, show watch/reject, show validation output.
- Do not depend on live web research during the recording.
- If a live app is unstable, record from static HTML/Markdown artifacts and terminal validation output.

## Transcript Requirements

Create a clean transcript matching the final video script. The transcript should include:

- Team name and selected use case.
- Use team name: **Good Boys**.
- Use selected use case/repo pattern: `CI_Customer_Scouting_GoodBoys`.
- What was built.
- What is shown in the demo.
- How Agentic AI powers the approach.
- Business value and next steps.

## Perfect Deliverable Checklist

- Video is under 3 minutes.
- First 20 seconds state the business problem clearly.
- Demo uses actual challenge-three output, not generic slides.
- Shows at least one pursue, one watch, one reject account.
- Mentions broker/distribution route and internal validation gates.
- Mentions GitHub link and reproducibility.
- Transcript file exists and mirrors video.
- No unqualified claim that accounts are quote-ready.
- Includes one human validation quote or explains the 24-hour validation sprint as the immediate next action.
- Follows a persona story rather than a feature list.
- Ends with a clear next pilot ask.
