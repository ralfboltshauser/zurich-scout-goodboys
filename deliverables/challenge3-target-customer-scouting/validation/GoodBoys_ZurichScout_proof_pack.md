# Good Boys - Zurich Scout Proof Pack

## The Claim

Zurich Scout demonstrates a reproducible Financial Institutions scouting workflow that generates structurally validated, source-linked account review briefs pending Zurich SME and internal-data validation.

It does more than produce a list of companies. It converts external market signals into an explainable queue of accounts Zurich can validate through its own CRM, broker, quote, policy, renewal, and loss-history data.

The core decision it supports:

**Which middle-market accounts deserve Zurich distribution and underwriting attention now, and what must be checked before anyone acts?**

## What Zurich Asked For

Zurich's challenge is to uncover additional commercial opportunities in US middle-market white space. The AMA made the operating reality clear: Zurich is already strong with Fortune 500 accounts and already has relationship memory through brokers, past quotes, existing customers, and internal data. The gap is finding high-fit opportunities that are not obvious yet, then making them actionable without flooding teams with low-quality leads.

Zurich Scout is built around that reality. It treats prospecting as a disciplined account-review workflow, not automated cold outreach.

## What The Prototype Did

The Smithers workflow ran an end-to-end scout for a focused pilot vertical: US middle-market financial institutions. This is an **FDIC Financial Institutions pilot**, not the full Zurich D&B 30,000-company dataset.

It produced:

| Result | Count |
| --- | ---: |
| Accounts reviewed | 70 |
| Buyer and influencer paths identified | 304 |
| Pursue candidates for immediate Zurich internal validation | 18 |
| Watch candidates requiring more evidence or timing | 50 |
| Rejected candidates | 2 |
| Schema / artifact validation issues | 0 |

Schema/artifact validation command:

```bash
node prototype-evidence/validate-submission-output.mjs prototype-evidence/latest.json
```

Schema/artifact validation result:

```json
{
  "companies": 70,
  "buyers": 304,
  "recommendationCounts": {
    "pursue": 18,
    "watch": 50,
    "reject": 2
  },
  "issueCount": 0,
  "issues": []
}
```

Important boundary: this proves the artifact is complete and structurally coherent. It does **not** prove source truth, Zurich appetite truth, broker ownership, renewal timing, buyer authority, or ground-truth opportunity quality. Those require Zurich SME review and internal data.

## Manual Source Spot-Check

In addition to schema/artifact validation, a small source spot-check was run on June 18, 2026 against the public FDIC institutions API. This is not a full source-truth audit; it verifies that selected account identity, active-bank status, and scale signals in the artifact are supported by a reachable regulator source.

| Account | Source checked | Result |
| --- | --- | --- |
| Nicolet National Bank | FDIC certificate 57038 | API returned active institution, Green Bay, WI, $15.5B assets, 119 offices. |
| Banner Bank | FDIC certificate 28489 | API returned active institution, Walla Walla, WA, $16.3B assets, 147 offices. |
| OceanFirst Bank, National Association | FDIC certificate 28359 | API returned active institution, Toms River, NJ, $14.5B assets, 72 offices. |
| NBH Bank | FDIC certificate 59052 | API returned active institution, Greenwood Village, CO, $12.6B assets, 107 offices. |
| Stellar Bank | FDIC certificate 58629 | API returned active institution, Houston, TX, $10.9B assets, 52 offices. |

Spot-check conclusion: the sampled accounts are real, active regulated bank entities with scale consistent with the artifact's account-selection rationale. This does not validate insurance buying intent, broker ownership, renewal timing, Zurich appetite, buyer authority, or opportunity quality.

## Fast Proof Path

To inspect the prototype quickly:

1. Open `.smithers/outputs/challenge3-target-scout/latest.md`.
2. Search for `Citizens Business Bank`, `Nicolet National Bank`, and `Stellar Bank`.
3. For each account, check the recommendation, why-now trigger, positive evidence, negative evidence, unknowns, buyer paths, and Zurich validation gate.
4. Run the validator command above.
5. Confirm that the top accounts are framed as internal validation candidates, not quote-ready outreach targets.

## What The Output Looks Like

The final artifact is designed as a handoff to Zurich distribution and underwriting teams.

It includes:

- A portfolio dashboard with account counts, recommendation mix, common Zurich entry lines, and first review batch.
- A ranked account table with recommendation, priority, appetite score, evidence confidence, likely first lines, and buyer path.
- A Zurich action queue that states the first internal validation action before outreach.
- Account briefs with why-now triggers, positive evidence, negative evidence, unknowns, open underwriting questions, source URLs, buyer paths, and public-contact routes.

This matters because Zurich can see not only "who looks attractive," but also "why this could be wrong" and "what must be verified next."

## Top Accounts From The Run

These are not quote-ready accounts. They are the first accounts Zurich should clear internally.

| Account | Rec | Priority | Appetite | Confidence | Likely Entry Lines | First Zurich Validation Action |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Citizens Business Bank, National Association | Pursue | 76 | 72 | 84 | Property, GL, WC, Umbrella | Check CRM, submission history, broker ownership, incumbent status, renewal calendar |
| Nicolet National Bank | Pursue | 76 | 74 | 79 | Property, GL, WC, Umbrella | Validate current Zurich/broker ownership before any external motion |
| NBH Bank | Pursue | 76 | 74 | 85 | Property, GL, WC, Umbrella | Search NBHC, NBH Bank, Vista Bank, Bank Midwest, Hillcrest Bank, and related trade names |
| Stellar Bank | Pursue | 74 | 70 | 84 | Financial Lines, Cyber, Property, GL | Check Stellar and Prosperity policy, quote, loss, broker, and relationship history |
| Banner Bank | Pursue | 72 | 74 | 80 | Financial Lines, Cyber, Property, GL | Check broker relationships, appointed agents, prior submissions, incumbent status, renewal intelligence |

The pattern is deliberate: every recommendation ends with a Zurich-controlled gate. Zurich Scout does not pretend public data can answer questions only Zurich can answer.

## Why This Fits Zurich

Zurich Scout aligns with Zurich's stated objective in five ways:

1. It searches outside the obvious relationship universe.
2. It ranks accounts against appetite instead of raw company size.
3. It explains why now: merger, branch footprint, governance change, cyber exposure, property concentration, or operational transition.
4. It respects the broker-led nature of commercial insurance by making broker and account-ownership validation mandatory.
5. It creates a handoff artifact Zurich can use in real account review, not just a hackathon dashboard.

## Business Value For Zurich

The case points to a greater than $200M topline GWP growth opportunity from expanding target coverage. Zurich Scout supports that ambition by improving the quality and timing of opportunities entering Zurich's distribution and underwriting motion.

The immediate value is focus:

- 70 accounts were narrowed to 18 active validation candidates.
- 52 accounts were deferred or rejected instead of consuming expert time.
- Each pursue account includes the exact internal checks needed before action.

Conservative time-allocation model:

- If first-pass SME review takes 30-60 minutes per account, suppressing or deferring 52 lower-readiness accounts avoids roughly 26-52 hours of low-readiness review.
- The value is not the exact hour estimate. The value is moving scarce distribution, underwriting, and risk-engineering attention toward accounts with stronger evidence and clearer next actions.

At D&B scale, the value is not that the model is always right. The value is that Zurich can screen thousands of companies, deep-research a smaller qualified set, and use its proprietary internal data to decide which accounts are worth broker conversations.

## Controls Built Into The Prototype

Zurich Scout intentionally avoids common "bad AI lead list" behavior:

- It uses `pursue`, `watch`, and `reject` instead of forcing every account into a sales motion.
- It stores source-linked positive evidence, negative evidence, unknowns, and open underwriting questions.
- It caps buyer research per account to keep output usable.
- It validates that every qualified company has evidence, unknowns, underwriting questions, and buyer-source support.
- It marks public output as an account-review brief, not a quote recommendation.
- It makes Zurich internal clearance mandatory before outreach.
- It keeps buyer paths role-based and business-safe. It does not require personal contact scraping, inferred private emails, or direct outreach.

## What Zurich Should Pilot Next

1. Run Zurich Scout on the Zurich-provided D&B 30,000-company universe.
2. Add anonymized Zurich internal overlay fields: existing customer, prior quote, broker owner, renewal date, loss-history flag, appetite class, and relationship owner.
3. Sample at least 10 accounts for manual source-truth review: verify source URLs, 3-5 key claims, buyer-role accuracy, SIC/appetite match, and false-positive reasons.
4. Send the top 25 accounts to a short review panel with distribution, underwriting, and risk-engineering SMEs.
5. Measure internal-clearance pass rate, broker conversations created, qualified account reviews, false-positive reasons, and time saved per account screen.

## Source Artifacts

| Artifact | Location |
| --- | --- |
| Machine-readable output | `.smithers/outputs/challenge3-target-scout/latest.json` |
| Human-readable account brief | `.smithers/outputs/challenge3-target-scout/latest.md` |
| Smithers workflow | `.smithers/workflows/challenge3-target-scout.tsx` |
| Portable package validator | `prototype-evidence/validate-submission-output.mjs` |
| Local Smithers validator | `.smithers/scripts/validate-challenge3-output.ts` |
| Business report | `public/challenge3-zurich-business-report.html` |
