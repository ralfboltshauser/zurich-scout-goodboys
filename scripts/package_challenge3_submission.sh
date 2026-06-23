#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/deliverables/challenge3-target-customer-scouting"
TMP="/tmp/GoodBoys_TargetCustomerScouting_submission"
ZIP="$SRC/GoodBoys_TargetCustomerScouting_submission.zip"

rm -rf "$TMP"
mkdir -p "$TMP/deck" "$TMP/video" "$TMP/technical-summary" "$TMP/validation" "$TMP/brand" "$TMP/prototype-evidence" "$TMP/readme-assets"

cp "$SRC/SUBMISSION_MANIFEST.md" "$TMP/"
cp "$SRC/FINAL_METADATA_CHECKLIST.md" "$TMP/"
cp "$SRC/README.md" "$TMP/README.md"

cp "$SRC/deck/GoodBoys_TargetCustomerScouting_executive_summary.pdf" "$TMP/deck/"
cp "$SRC/deck/GoodBoys_TargetCustomerScouting_executive_summary.md" "$TMP/deck/"
cp "$SRC/deck/GoodBoys_TargetCustomerScouting_pitch_deck.pdf" "$TMP/deck/"

cp "$SRC/video/GoodBoys_TargetCustomerScouting.mp4" "$TMP/video/"
cp "$SRC/video/GoodBoys_TargetCustomerScouting_transcript.md" "$TMP/video/"
cp "$SRC/video/MP4_RENDERING_NOTE.md" "$TMP/video/"

cp "$SRC/technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.md" "$TMP/technical-summary/"
cp "$SRC/technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.pdf" "$TMP/technical-summary/"
cp "$SRC/validation/GoodBoys_ZurichScout_proof_pack.md" "$TMP/validation/"
cp "$SRC/brand/zurich-scout-icon.png" "$TMP/brand/"

cp "$SRC/prototype-evidence/latest.json" "$TMP/prototype-evidence/latest.json"
cp "$SRC/prototype-evidence/latest.md" "$TMP/prototype-evidence/latest.md"
cp "$SRC/prototype-evidence/validate-submission-output.mjs" "$TMP/prototype-evidence/validate-submission-output.mjs"
cp "$SRC/readme-assets/"*.png "$TMP/readme-assets/"

rm -f "$ZIP"
python3 - <<PY
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path("$TMP")
zip_path = Path("$ZIP")
base = root.parent

with ZipFile(zip_path, "w", ZIP_DEFLATED) as zf:
    for path in sorted(root.rglob("*")):
        if path.is_file():
            zf.write(path, path.relative_to(base))
PY

ls -lh "$ZIP"
