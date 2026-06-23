# Good Boys - Zurich Scout Pitch Deck Draft

## One-Page Executive Summary

**Team:** Good Boys  
**Use case:** `CI_Customer_Scouting_GoodBoys` - Target Customer Scouting  
**Solution:** Zurich Scout  

### Zurich's Need

Zurich wants to uncover additional US middle-market commercial opportunities in the white space beyond obvious Fortune 500 accounts, known customers, past quotes, and current broker flow. The goal is not more names. The goal is more qualified, appetite-aligned opportunities that distribution and underwriting teams can act on efficiently.

### Our Point Of View

Zurich does not need more leads. Zurich needs fewer, better-justified pursuit decisions that respect appetite, broker ownership, and relationship timing.

### What Zurich Scout Does

Zurich Scout is an agentic customer-scouting workflow. It researches external company signals, matches accounts to Zurich appetite, identifies why-now triggers, proposes likely Zurich entry lines, maps public buyer paths, and states the Zurich-only checks required before outreach.

It produces a Zurich account-review brief, not a generic sales list.

### Prototype Evidence

The schema-validated FDIC Financial Institutions pilot reviewed 70 US financial-institution accounts:

- 18 pursue candidates for immediate Zurich internal validation.
- 50 watch candidates that fit the profile but need more timing, broker, renewal, or underwriting evidence.
- 2 rejected candidates.
- 304 buyer or influencer paths.
- 0 schema / artifact validation issues in the final structured artifact.

The first review batch included Citizens Business Bank, Nicolet National Bank, NBH Bank, Stellar Bank, and Banner Bank. Each account included a first Zurich validation action such as CRM match, prior quote search, broker ownership, incumbent status, renewal calendar, loss history, and account-owner clearance.

### Why It Creates Business Value

Zurich Scout helps Zurich allocate scarce distribution and underwriting attention to accounts with stronger evidence and clearer timing. In the pilot run, 70 possible accounts became 18 active validation candidates, while 52 were deferred or rejected before they consumed expert time.

At scale, Zurich can run this over the D&B 30,000-company universe, deep-research the strongest accounts, and overlay confidential Zurich data to decide which opportunities should become broker conversations, account reviews, or CRM tasks.

### Recommended Pilot

Run Zurich Scout on the D&B file and add anonymized Zurich internal overlay fields: existing customer, prior quote, broker owner, renewal date, loss-history flag, appetite class, and relationship owner. Review the top 25 accounts with Zurich distribution and underwriting SMEs, then measure internal-clearance pass rate, broker conversations created, qualified account reviews, false-positive reasons, and time saved.

---

## Slide 1 - Problem Approach And Solution Design

### Slide Message

Target customer scouting is a judgment workflow, not a lead-list workflow.

### What To Show

`D&B / external market universe -> Zurich Scout scout -> Zurich action queue -> CRM / broker / underwriting validation`

### Key Points

- Zurich already has strong relationship memory: customers, past quotes, broker flow, prior submissions, and internal expertise.
- The remaining opportunity is white space: accounts that fit appetite but are not surfaced at the right time through existing channels.
- Zurich Scout researches companies externally, scores appetite and timing, and turns the result into an account-review memo.
- The workflow is designed around Zurich's broker-led commercial reality. It does not recommend outreach until internal ownership and broker context are checked.

### Example To Mention

Citizens Business Bank is marked `pursue` because the public evidence shows FI fit, scale, branch/property exposure, and a 2026 merger trigger. But the first action is still Zurich internal validation: CRM, submission history, broker ownership, incumbent status, and renewal calendar.

### Core Message

This is not AI scraping leads. It is an explainable pursuit decision layer for Zurich distribution and underwriting teams.

---

## Slide 2 - Results And Key Insights

### Slide Message

The prototype produced a validated Zurich pursuit queue with clear action gates.

### What To Show

Portfolio dashboard:

| Metric | Result |
| --- | ---: |
| Accounts reviewed | 70 |
| Pursue | 18 |
| Watch | 50 |
| Reject | 2 |
| Buyer / influencer paths | 304 |
| Validation issues | 0 |

Top first-review accounts:

| Account | Priority | Likely Entry Lines | First Zurich Gate |
| --- | ---: | --- | --- |
| Citizens Business Bank | 76 | Property, GL, WC, Umbrella | CRM / broker / renewal / incumbent checks |
| Nicolet National Bank | 76 | Property, GL, WC, Umbrella | Broker and current-account ownership |
| NBH Bank | 76 | Property, GL, WC, Umbrella | Entity and trade-name clearance |
| Stellar Bank | 74 | Financial Lines, Cyber, Property | Stellar/Prosperity history and broker checks |
| Banner Bank | 72 | Financial Lines, Cyber, Property | Broker, prior submission, renewal intelligence |

### Key Insights

- The best opportunities were not just large companies. They had a combination of appetite fit, credible Zurich entry lines, public why-now triggers, and clear internal validation paths.
- `watch` is a feature, not a failure. It prevents the system from pushing accounts when broker ownership, renewal timing, loss history, or appetite evidence is not strong enough.
- The output becomes more valuable when Zurich overlays internal data that no external model has.

### Core Message

Zurich Scout is useful because it can say "pursue this now," "watch this," and "do not spend time here" with reasons.

---

## Slide 3 - Next Steps And Recommendations

### Slide Message

Zurich's proprietary data turns public scouting into a growth advantage.

### What To Show

`Public evidence + Zurich internal overlay = validated pursuit decision`

Internal overlay fields:

- Existing customer match.
- Prior quote or declination.
- Broker owner.
- Renewal date.
- Loss-history flag.
- Relationship owner.
- Appetite class or underwriting note.

### Recommended Pilot

1. Run Zurich Scout over the D&B 30,000-company universe.
2. Use cheap first-pass triage to select a smaller deep-research set.
3. Add anonymized Zurich internal overlay fields.
4. Have Zurich SMEs review the top 25 accounts.
5. Measure which accounts survive internal clearance and create qualified broker conversations.

### Success Metrics

- Internal-clearance pass rate.
- SME acceptance rate.
- Broker conversations created.
- Qualified account reviews or submissions created.
- False-positive reasons.
- Time saved per first-pass account screen.

### Core Message

Generic AI can research public companies. Zurich wins when public scouting is combined with Zurich's private relationship, quote, broker, renewal, and loss-history memory.
