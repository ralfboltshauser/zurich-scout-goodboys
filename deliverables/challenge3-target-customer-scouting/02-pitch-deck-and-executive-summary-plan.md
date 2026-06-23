# Deliverable 2 Plan: Pitch Deck And One-Page Executive Summary

## Required Output

- One-page executive summary.
- Maximum 3 supporting slides:
  - Problem approach and solution design.
  - Results and key insights.
  - Next steps and recommendations.

## Hackathon Guide Constraints

- Build the deck from the first hour, not at the end.
- Every slide must have one key message that is written, visualized, and spoken.
- Optimize for emotional buy-in first, then logical justification.
- Assume reviewers are distracted and may understand the case less deeply than we do; take them on a simple journey.
- Use real validation artifacts as unfair advantage: interview quotes, call notes, validation matrix, or screenshots/photos where appropriate.
- Do not include a feature or technical detail unless it supports the pitch story.
- Rehearse at least 5 times and time the talk to the exact cutoff.

## One-Page Executive Summary Layout

Use the official template fields:

- Team name.
- Team name: **Good Boys**.
- Selected use case: `CI_Customer_Scouting_GoodBoys` / Target Customer Scouting.
- Team members.
- Main learning from experience.
- How our approach solves the problem.
- Prototype results.
- Next steps for scaling.

## One-Page Executive Summary Message

Headline:

"An explainable target scout that turns public market signals into Zurich-ready pursuit decisions."

Anchor sentence:

"Zurich does not need more leads; Zurich needs fewer, better-justified pursuit decisions that respect appetite, broker ownership, and relationship timing."

Main learning:

"The highest-value AI is not a generic lead generator. It is a disciplined triage layer that helps Zurich decide which accounts deserve human distribution and underwriting attention, and what must be validated before outreach."

How it solves the problem:

- Defines an ICP for US middle-market financial institutions.
- Sources and enriches candidate accounts.
- Scores appetite, priority, and evidence confidence.
- Creates account-level pursuit briefs.
- Recommends broker/distribution actions and Zurich internal validation gates.

Results:

- 70 accounts reviewed.
- 18 pursue, 50 watch, 2 reject.
- 304 buyer/influencer routes.
- Top LOB entry points: Cyber, Financial Lines, Property, GL, WC, Umbrella.
- Final artifact passed validation with zero issues.

Next steps:

- Run on Zurich-provided D&B 30,000-company dataset.
- Overlay Zurich CRM, quote, policy, broker, renewal, and loss-history data.
- Validate recommendations with Zurich distribution and underwriting SMEs.
- Expand from financial institutions to additional Zurich middle-market focus industries.

Emotional hook:

"Give a Zurich distribution leader their Monday-morning account review queue: fewer accounts, better reasons, and no blind outreach."

## Slide 1: Problem, Approach, And Solution Design

Single message:

"Target scouting is a judgment workflow, not a lead-list workflow."

Visual:

Process map:

`Target universe -> Public enrichment -> Appetite/ICP scoring -> Buyer/distribution mapping -> Zurich validation gates -> Pursuit brief -> CRM/broker action`

Content:

- Problem:
  - Middle-market white space exists.
  - Public data alone is noisy.
  - Broker relationships and Zurich internal history determine actionability.
- Approach:
  - Use agents to research and score accounts.
  - Preserve evidence and uncertainty.
  - Output recommendations that humans can validate quickly.
- Solution:
  - Reproducible Smithers workflow.
  - Structured JSON plus business-readable report.
  - Zurich account review memos with "why now," "why Zurich," "who might matter," and "what to check before outreach."

Spoken story:

"Maya, a Zurich distribution leader, does not need another spreadsheet of 70 companies. She needs the 18 accounts worth internal validation, the 50 to watch, and the 2 to leave alone."

Add a "why Zurich wins" box:

- Public research is only the first layer.
- Zurich's proprietary overlay is the advantage: CRM match, prior quote, broker owner, renewal date, loss history, and relationship owner.
- That distribution memory turns AI research into defensible action.

## Slide 2: Results And Key Insights

Single message:

"The scout found a small actionable pursuit set and a larger watchlist without pretending everything is ready."

Visual:

- Recommendation mix: 18 pursue / 50 watch / 2 reject.
- Top 5 pursuit accounts table.
- LOB bar chart.

Content:

- Top accounts:
  - Citizens Business Bank.
  - Nicolet National Bank.
  - NBH Bank.
  - Stellar Bank.
  - Banner Bank.
- Key insight:
  - Merger/integration events create strong program-review triggers.
  - Cyber and financial lines are universal FI entry points.
  - Property, GL, WC, and umbrella become strong when branch/real estate operations are material.
- Quality insight:
  - Watch status is a feature, not a weakness.
  - It protects Zurich from wasting sales effort on under-validated accounts.

Add a scoring-rubric visual so the 18 pursue accounts do not look arbitrary:

| Dimension | Weight | What It Measures |
| --- | ---: | --- |
| Zurich appetite and SIC fit | 25% | In-scope FI segment, likely SIC/NAICS, playbook alignment, disqualifiers |
| Why-now trigger strength | 20% | M&A, branch expansion, conversion, leadership change, regulatory or cyber trigger |
| Zurich line relevance | 20% | Clear entry LOBs: Cyber, Financial Lines, Property, GL, WC, Umbrella |
| Buyer/broker route plausibility | 15% | Public buyer path, distribution hypothesis, broker-safe access route |
| Evidence confidence | 10% | Source count, source authority, recency, contradiction penalties |
| Internal-data dependency | 10% | CRM, broker, renewal, loss-history checks needed before action |

Show one top-account breakdown:

- Account: Citizens Business Bank or Nicolet National Bank.
- Why now: merger/conversion/integration trigger.
- Handoff: Zurich internal clearance and broker conversation brief.
- Gate before action: existing insured, prior quote, broker owner, renewal, loss history.

Validation artifact to include:

- A small "proof we talked to humans" box if the sprint is completed:
  - Quote from distribution/broker proxy.
  - Quote from underwriting/risk proxy.
  - One-row validation matrix for top account.
- If not completed, mark it as the first pilot step and do not pretend it happened.

## Slide 3: Next Steps And Recommendations

Single message:

"Make this useful by validating it against Zurich's confidential internal truth."

Visual:

Pilot roadmap:

1. Internal clearance.
2. Distribution validation.
3. Underwriting pre-qualification.
4. Broker-safe outreach.
5. Measured pilot.

Content:

- Immediate action:
  - Take the 18 pursue accounts through CRM, quote, policy, broker, renewal, and loss-history checks.
- Pilot:
  - Run the workflow on D&B 30,000 companies.
  - Compare outputs to known customers, prior quotes, and won/lost opportunities.
- Success metrics:
  - Time saved per prospect screen.
  - Precision of pursue recommendations after internal overlay.
  - Number of broker conversations created.
  - Number of qualified submissions or account reviews triggered.
  - Reviewer trust score from underwriters/distribution leaders.
  - Internal-clearance pass rate: share of `pursue` accounts not blocked by incumbent, broker ownership, appetite, or loss history.
  - False-positive reasons: why a recommended account was rejected by Zurich SMEs.

Add a 24-hour validation sprint:

- Pick 5 top pursue accounts.
- Ask one distribution/broker proxy, one underwriting/risk proxy, and one buyer/procurement proxy to score each account.
- Capture accept/watch/reject, missing data, and confidence.
- Put the disagreement matrix in the appendix or as a visual if space allows.

Pilot ask:

- "Give us 25 accounts plus anonymized Zurich internal fields. In one week we will return a ranked queue and measure which recommendations survive SME review."

## Out-Of-The-Box Additions For A Winning Deck

- Include one anonymized quote or mini-finding from a Zurich distribution/underwriting interview if we can get one.
- Include a "what we deliberately did not automate" box:
  - Did not auto-email buyers.
  - Did not claim quote readiness.
  - Did not use private contact data.
  - Did not ignore broker ownership.
- Include a "how Zurich can rationalize the value" box:
  - If a distribution or underwriting expert spends 30-60 minutes screening an account, moving 52 of 70 accounts out of immediate deep-screening saves roughly 26-52 expert hours in this run.
  - The value scales when run over 30,000 D&B companies.
  - The workflow creates reusable knowledge artifacts for CRM and underwriting.
- Include a "subjective win" box:
  - This feels like Zurich's future operating model: AI narrows the field, humans own judgment and relationships.
- Include a negative-control box:
  - Show one rejected account and one watch account to prove the system protects relationship capital rather than pushing every account into sales.

## Perfect Deliverable Checklist

- Deck is simple and visual.
- One page can stand alone without narration.
- Every slide has one message.
- Each slide's message is written, visualized, and spoken.
- Numbers come from actual prototype output.
- Business value is explicit.
- Technical novelty is visible but not overexplained.
- The deck shows restraint, governance, and explainability.
- Includes real validation artifacts if available.
- Contains no slide that is "interesting but not used in the pitch."
