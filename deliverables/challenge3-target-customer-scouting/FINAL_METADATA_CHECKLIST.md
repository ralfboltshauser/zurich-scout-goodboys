# Final Metadata Checklist

The submission content is complete. Before upload, fill in these user-owned fields.

## Required User Metadata

1. Final team member names and emails.
2. Final GitHub repository URL.

## Where To Enter Them

| Field | Location |
| --- | --- |
| Team member names/emails | Official submission form |
| GitHub repository URL | Official submission form / repository field |

## Already Complete

- MP4 walkthrough exists and is recognized as MP4.
- Transcript exists.
- Pitch deck is exactly 3 pages.
- Executive summary PDF is exactly 1 page.
- Technical summary exists.
- Proof pack exists.
- Upload manifest exists.
- Submission ZIP exists.
- Strengthened validator passes with 0 issues.

## Validation Command

```bash
node deliverables/challenge3-target-customer-scouting/prototype-evidence/validate-submission-output.mjs \
  deliverables/challenge3-target-customer-scouting/prototype-evidence/latest.json
```

Expected output:

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
