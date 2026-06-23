# Good Boys - Challenge 3 Submission Manifest

Use case: `CI_Customer_Scouting_GoodBoys`  
Challenge: Zurich Hyper Challenge 2026 - Challenge 3, Target Customer Scouting  
Solution: Zurich Scout

## Submission Files

| Deliverable | File |
| --- | --- |
| Prototype walkthrough MP4 | [`video/GoodBoys_TargetCustomerScouting.mp4`](video/GoodBoys_TargetCustomerScouting.mp4) |
| Video transcript | [`video/GoodBoys_TargetCustomerScouting_transcript.md`](video/GoodBoys_TargetCustomerScouting_transcript.md) |
| One-page executive summary | [`deck/GoodBoys_TargetCustomerScouting_executive_summary.pdf`](deck/GoodBoys_TargetCustomerScouting_executive_summary.pdf) |
| Executive summary text backup | [`deck/GoodBoys_TargetCustomerScouting_executive_summary.md`](deck/GoodBoys_TargetCustomerScouting_executive_summary.md) |
| Pitch deck, 3 slides | [`deck/GoodBoys_TargetCustomerScouting_pitch_deck.pdf`](deck/GoodBoys_TargetCustomerScouting_pitch_deck.pdf) |
| Technical summary visual one-pager | [`technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.pdf`](technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.pdf) |
| Technical summary detailed backup | [`technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.md`](technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.md) |
| Proof pack / validation evidence | [`validation/GoodBoys_ZurichScout_proof_pack.md`](validation/GoodBoys_ZurichScout_proof_pack.md) |
| Full generated artifact | [`prototype-evidence/latest.json`](prototype-evidence/latest.json) |
| Human-readable generated artifact | [`prototype-evidence/latest.md`](prototype-evidence/latest.md) |
| Validator | [`prototype-evidence/validate-submission-output.mjs`](prototype-evidence/validate-submission-output.mjs) |

## Submission Metadata

- Team name: `Good Boys`
- Solution name: `Zurich Scout`
- Use case: `CI_Customer_Scouting_GoodBoys`
- External video mirror: <https://exploration.nbg1.your-objectstorage.com/zurich-scout_good-boys.mp4>
- Final GitHub repository URL: add the GitHub URL in the submission form.
- Final team member names and emails: add in the submission form.

## Validation Command

Run from repository root:

```bash
node scripts/validate_challenge3_package.mjs .smithers/outputs/challenge3-target-scout/latest.json
```

Or validate the copied submission evidence:

```bash
node deliverables/challenge3-target-customer-scouting/prototype-evidence/validate-submission-output.mjs \
  deliverables/challenge3-target-customer-scouting/prototype-evidence/latest.json
```

Expected result:

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

## Recommended Review Order

1. README.
2. MP4 walkthrough and transcript.
3. Executive summary.
4. Three-slide pitch deck.
5. Technical summary visual one-pager.
6. Proof pack and detailed technical backup.
7. Full generated artifact only if deeper audit is needed.
