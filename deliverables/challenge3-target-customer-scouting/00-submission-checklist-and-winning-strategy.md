# Challenge 3 Submission Checklist And Winning Strategy

## Official Deliverables From Submission Instructions

Team name: **Good Boys**.

Selected use case: `CI_Customer_Scouting_GoodBoys` / Target Customer Scouting.

Required by end of hackathon:

1. Solution/prototype demonstration and recorded walkthrough, 2-3 minutes max.
   - MP4 video.
   - Transcript of the video.
   - GitHub link to the working prototype.
2. Pitch deck, including one-page executive summary.
   - One-page executive summary.
   - Up to 3 supporting slides:
     - Problem approach and solution design.
     - Results and key insights.
     - Next steps and recommendations.
3. Technical summary document.
   - What we built.
   - How we built it.
   - System design and component diagrams.
   - Technology stack.
   - Implementation methodology, workflows, integrations.
   - Control, evaluation, monitoring, known risks.
   - Learnings.
   - Cost drivers and running-cost estimate.
   - Process design map.
   - GitHub repository link.

## Winning Thesis

Do not present this as "AI made a lead list." That is too easy to dismiss and too similar to what other teams will do.

Present it as Zurich's explainable target-scouting operating system for middle-market distribution:

- It discovers white-space accounts.
- It proves why each account is in or out of Zurich appetite.
- It turns public evidence into an underwriter-ready pursuit brief.
- It names the internal Zurich checks needed before outreach.
- It supports broker-led execution instead of pretending direct cold outreach is enough.
- It can be validated against Zurich's confidential CRM, quote, policy, broker, and loss-history data after submission.

The emotional message: Zurich Scout is built for a relationship-led business, not just a data-led one. The agent helps Zurich distribution and underwriting teams decide where to spend the next hour.

Use this as the core submission sentence:

"Zurich does not need more leads; Zurich needs fewer, better-justified pursuit decisions that respect appetite, broker ownership, and relationship timing."

## Hackathon Guide Learnings Applied

The Good Boys guide adds a useful meta-rule: win the emotional decision first, then provide the logic that makes the decision defensible. For this Zurich challenge, that means the submission must feel like we deeply understand their distribution and underwriting reality before it proves architecture details.

Applied principles:

- Work backwards from the pitch. Only build or polish what appears in the video, deck, or technical summary.
- Assign one owner for jury appeal and narrative. This person guards the story, slide messages, and demo sequence.
- Treat case providers, Zurich stakeholders, brokers, and buyer proxies like customers.
- Get real validation artifacts: short interview notes, call screenshots/photos where appropriate, anonymized quotes, and a simple validation matrix.
- Every slide has one message that is written, visualized, and spoken.
- Demo must be deterministic. If live demo reliability is uncertain, use a recorded deterministic walkthrough with visible artifacts and validation output.
- Freeze scope early. A stable, rehearsed story beats extra features that are not shown.
- Pitcher energy matters. Protect rehearsal time and avoid making the final pitch a tired last-minute task.

## Value Case To Make Rational

Avoid unprovable revenue claims. Use scenario math a Zurich business stakeholder can sanity-check:

- The validated run reduced 70 public FI accounts into 18 pursue, 50 watch, and 2 reject.
- If a distribution or underwriting expert spends 30-60 minutes on a first-pass screen, deferring or suppressing 52 lower-readiness accounts redirects about 26-52 expert hours to better candidates.
- The value is not the exact saved-hour number; it is better allocation of scarce producer, distribution, underwriting, and risk-engineering attention.
- At D&B scale, even a small precision gain can create more qualified broker conversations without flooding teams with bad leads.

Pilot value hypothesis:

- Run the scout over the D&B 30,000-company dataset.
- Deep-research only the top 500 accounts.
- Send the top 100 through Zurich internal clearance.
- Have SMEs review the top 25.
- Measure how many survive to broker conversation, account review, submission, or pipeline creation.

## What Zurich Reviewers Are Likely To Like

Business evaluation perspective:

- Explicit alignment to Andy and Ashley's AMA guidance.
- Revenue upside framed as new middle-market opportunities, not technology novelty.
- Respect for broker/distribution reality.
- Actionable account briefs, not generic ranked prospects.
- Clear separation between public facts, model inferences, and Zurich-only validation gates.
- A path to use the output inside real Zurich workflows.
- A named handoff artifact: the final output should become a Zurich account review memo, broker conversation brief, CRM task, or underwriting pre-clearance packet.

Technical evaluation perspective:

- A real, reproducible workflow, not a manually written report.
- Source-linked evidence and transparent scoring.
- Structured JSON plus human-readable Markdown/HTML outputs.
- Quality gates that downgrade weak opportunities instead of forcing false positives.
- Clear architecture, process map, and evaluation strategy.
- Cost controls: capped account batches, cached research, human validation gates.
- Reproducibility: run ID, workflow hash, input config, validation command, and expected output paths.

AI review agent:

- Complete file set.
- Clear use-case naming and repository link.
- Obvious alignment to "Target Customer Scouting."
- Video transcript included.
- Technical summary includes diagrams, stack, risks, cost, and evaluation.

## Differentiators To Add Before Final Submission

1. Zurich stakeholder alignment.
   - Ask Andy/Ashley or challenge facilitators whether they prefer a bank/FI focus or broader D&B industry coverage.
   - Ask which internal validation field matters most: existing insured, prior quote, broker owner, renewal date, loss history, or appetite class.
   - Ask whether they want the output shaped for underwriters, distribution leaders, or CRM ingestion first.
   - Ask whether the preferred handoff is a broker conversation brief, account review memo, CRM task, or underwriting pre-clearance packet.
   - Ask them what they personally need to see to believe this is worth a pilot.

2. Broker/distribution validation.
   - Interview one Zurich distribution professional or broker-facing colleague if possible.
   - Ask what makes a prospect worth a broker conversation.
   - Ask what "bad AI lead" behavior would waste their time.

3. Underwriting validation.
   - Interview one commercial/FI underwriter or risk engineer if possible.
   - Ask which public signals are credible and which are misleading.
   - Ask what minimum missing-data checklist is needed before pursuit.

4. External buyer/customer proxy interviews.
   - Interview 2-3 people who have owned insurance/risk/procurement decisions in banks, credit unions, fintechs, or mid-market companies.
   - Ask what triggers an insurance program review: merger, cyber incident, renewal pain, broker dissatisfaction, branch expansion, property change, regulatory pressure.
   - Use quotes or anonymized findings in the pitch deck.

5. Mandatory 24-hour Zurich-style validation sprint.
   - Take the top 5 pursue accounts.
   - Ask three humans or proxies to score them:
     - Distribution/broker proxy: "Would this be worth a broker conversation?"
     - Underwriting/risk proxy: "What would block appetite?"
     - Buyer/procurement proxy: "Would this trigger a program review?"
   - Capture accept/watch/reject, reason, missing data, and confidence.
   - Put one anonymized quote and a disagreement matrix in the deck or transcript.
   - Save visible proof of work for the jury: call notes, screenshots/photos of calls if permitted, timestamped interview notes, and the scoring sheet.

6. Live "Zurich validation overlay" demo.
   - Add an internal-data overlay screen with connector-ready fields:
     - CRM match: unknown / existing insured / prior quote / declined.
     - Broker owner: unknown / Aon / Marsh / Gallagher / regional broker.
     - Renewal window: unknown / within 90 days / outside 12 months.
     - Loss history: unavailable / clean / needs review.
   - Make it visually clear that the public scout becomes much more valuable when paired with Zurich data.

7. Outreach restraint.
   - Do not pitch automatic cold emails as the main win.
   - Pitch "outreach readiness" and "distribution action" instead.
   - If showing outreach language, make it broker-safe and trigger-led: "risk review after merger integration" rather than "buy Zurich."

## Strategic Moat

Generic AI can research public accounts. Zurich can win because it has proprietary distribution memory:

- Existing customer and subsidiary matches.
- Prior submissions and lost quotes.
- Broker-of-record and producer relationships.
- Renewal timing.
- Claims/loss history.
- Appetite exceptions and underwriter notes.
- Territory ownership and account conflict rules.

The prototype shows that public AI research becomes defensible when combined with Zurich's confidential operating data. That is the moat and the reason this belongs inside Zurich, not as a generic lead vendor.

## Do-Not-Overclaim Rules

- Do not say an account is ready for outreach until Zurich internal checks pass.
- Do not say public data proves Zurich appetite; say it supports a hypothesis.
- Do not claim revenue impact except as scenario math.
- Do not imply financial institutions are the whole challenge; explain FI as a focused pilot vertical that can expand to other middle-market industries.
- Do not pitch private-contact scraping or automatic cold outreach.

## Final-Hours Operating Rules

- Freeze feature scope several hours before submission.
- Pull one stable version for recording and screenshots.
- Run the validation command immediately before final packaging.
- Record the video against a clean deterministic demo state.
- Rehearse the pitch/video script at least 5 times.
- Maintain a final packaging buffer so polishing does not compromise the submission.

## Submission Naming

Recommended repository/team naming pattern:

- `CI_Customer_Scouting_GoodBoys`

Recommended deliverable names:

- `GoodBoys_TargetCustomerScouting.mp4`
- `GoodBoys_TargetCustomerScouting_transcript.md`
- `GoodBoys_TargetCustomerScouting_pitch_deck.pdf`
- `GoodBoys_TargetCustomerScouting_technical_summary.md`

## Final Quality Bar

The submission should be understandable in 60 seconds, defensible in 10 minutes, and useful to Zurich even if they never run the prototype again.
