# Good Boys - Zurich Scout Demo Script

Target length: 2:30 to 2:45.

## Opening: 0:00-0:20

Zurich's challenge is not to find more company names. Zurich already has broker relationships, existing customers, prior quotes, and market knowledge. The challenge is to uncover middle-market white space and decide which accounts deserve distribution and underwriting attention now.

Our solution is Zurich Scout: an agentic target-scouting workflow that turns external signals into Zurich account review briefs.

## Show The Workflow: 0:20-0:45

Show `.smithers/workflows/challenge3-target-scout.tsx`.

The workflow follows the real operating path:

1. Define the Zurich ICP and appetite logic.
2. Source candidate accounts.
3. Triage the universe.
4. Research each company deeply.
5. Run a quality panel.
6. Map public buyer and influencer paths.
7. Assemble the final pursuit brief.

The key design decision is that the workflow does not produce "send email now" leads. It produces an internal validation queue for Zurich.

## Show The Validated Run: 0:45-1:15

Show terminal validation output:

```bash
bun .smithers/scripts/validate-challenge3-output.ts .smithers/outputs/challenge3-target-scout/latest.json
```

Say:

The final structured artifact passed schema and completeness validation with 70 accounts, 304 buyer paths, 18 pursue recommendations, 50 watch recommendations, 2 rejects, and zero artifact validation issues.

The validator checks that the output has a portfolio dashboard, Zurich action queue, evidence, unknowns, underwriting questions, and source-supported buyer paths.

## Show The Portfolio Dashboard: 1:15-1:45

Show `.smithers/outputs/challenge3-target-scout/latest.md`.

Say:

This is the portfolio view a Zurich distribution leader would start with. It shows the recommendation mix, most common Zurich entry lines, and the first review batch.

The important result is focus. The workflow narrowed 70 possible FI accounts into 18 active validation candidates and deferred 52 accounts before they consumed expert time.

## Show One Account Brief: 1:45-2:20

Show Citizens Business Bank in `latest.md`.

Say:

Here is the difference between Zurich Scout and a generic lead list. Citizens Business Bank is a pursue candidate because there is public evidence of FI fit, scale, branch and property exposure, and a recent merger trigger.

But the output still says this is not quote-ready. The first Zurich action is to check CRM, submission history, broker ownership, incumbent status, and renewal calendar.

That is the behavior Zurich needs: explain the opportunity, explain the risk, and state the internal gate before outreach.

## Close: 2:20-2:45

Show `deliverables/challenge3-target-customer-scouting/validation/GoodBoys_ZurichScout_proof_pack.md` or the business report.

Say:

The next pilot is straightforward: run Zurich Scout over Zurich's D&B 30,000-company universe, add anonymized internal overlay fields, and have Zurich SMEs review the top 25 accounts.

The value is not more leads. The value is fewer, better-justified pursuit decisions that respect appetite, broker ownership, and relationship timing.
