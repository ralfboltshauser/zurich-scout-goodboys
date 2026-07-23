#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/deliverables/challenge3-target-customer-scouting/imagegen-slides"
TMP="$ROOT/tmp/zurich-scout-polished"
ICON="$ROOT/deliverables/challenge3-target-customer-scouting/brand/zurich-scout-icon.png"

mkdir -p "$OUT" "$TMP"
rm -f "$TMP"/*.png

W=1920
H=1080
BLUE="#0070B8"
ZBLUE="#003399"
NAVY="#02296A"
TEXT="#3A3A3A"
MUTED="#666F7D"
LIGHT="#F1F6FA"
LINE="#D9E3EC"
GOLD="#D6A21E"
GREEN="#1B7F64"
RED="#E85B5B"
WHITE="#FFFFFF"

caption() {
  local width="$1" height="$2" size="$3" color="$4" font="$5" text="$6" out="$7"
  magick -background none -fill "$color" -font "$font" -pointsize "$size" \
    -size "${width}x${height}" -gravity northwest "caption:${text}" "$out"
}

place() {
  local canvas="$1" image="$2" x="$3" y="$4"
  magick "$canvas" "$image" -geometry "+${x}+${y}" -composite "$canvas"
}

base() {
  local out="$1"
  magick -size "${W}x${H}" xc:"$WHITE" \
    -fill "$BLUE" -draw "rectangle 0,0 ${W},18" \
    "$out"
  if [[ -f "$ICON" ]]; then
    magick "$ICON" -resize 58x58 "$TMP/icon.png"
    place "$out" "$TMP/icon.png" 96 62
  fi
  magick "$out" \
    -fill "$NAVY" -font Helvetica-Bold -pointsize 30 -annotate +172+98 "Zurich Scout" \
    -fill "$MUTED" -font Helvetica -pointsize 21 -annotate +1500+94 "Good Boys  |  Zurich Challenge 3" \
    "$out"
}

text_at() {
  local canvas="$1" w="$2" h="$3" size="$4" color="$5" font="$6" text="$7" x="$8" y="$9" name="${10}"
  caption "$w" "$h" "$size" "$color" "$font" "$text" "$TMP/${name}.png"
  place "$canvas" "$TMP/${name}.png" "$x" "$y"
}

metric() {
  local canvas="$1" x="$2" y="$3" value="$4" label="$5" width="${6:-360}"
  text_at "$canvas" "$width" 78 58 "$BLUE" Helvetica-Bold "$value" "$x" "$y" "metric-$value-$x"
  text_at "$canvas" "$width" 58 25 "$TEXT" Helvetica "$label" "$x" $((y + 82)) "metric-label-$x"
}

panel() {
  local canvas="$1" x="$2" y="$3" w="$4" h="$5" color="$6" title="$7" body="$8" name="$9"
  magick "$canvas" \
    -fill "$LIGHT" -stroke "$LINE" -strokewidth 2 -draw "rectangle ${x},${y} $((x+w)),$((y+h))" \
    -fill "$color" -stroke none -draw "rectangle ${x},${y} $((x+7)),$((y+h))" \
    "$canvas"
  text_at "$canvas" $((w - 52)) 42 25 "$NAVY" Helvetica-Bold "$title" $((x + 28)) $((y + 24)) "panel-title-$name"
  text_at "$canvas" $((w - 52)) $((h - 78)) 24 "$MUTED" Helvetica "$body" $((x + 28)) $((y + 78)) "panel-body-$name"
}

slide1="$OUT/zurich-scout-01-executive-summary.png"
base "$slide1"
text_at "$slide1" 980 74 48 "$TEXT" Helvetica-Bold "Executive Summary" 96 142 "s1-title"
text_at "$slide1" 1560 92 29 "$TEXT" Helvetica "Zurich Scout turns white-space target discovery into qualified pursuit decisions." 96 222 "s1-lead"
text_at "$slide1" 720 42 29 "$BLUE" Helvetica-Bold "Expected impact" 96 336 "s1-impact"
text_at "$slide1" 760 64 18 "$MUTED" Helvetica-Oblique "Pilot proof on FDIC financial institutions; scale path is D&B 30k with Zurich CRM, broker, quote, renewal, loss and appetite overlays." 96 386 "s1-note"
metric "$slide1" 96 486 "70 -> 18" "accounts narrowed to active Zurich validation candidates" 420
metric "$slide1" 540 486 "304" "public buyer / influencer paths mapped" 360
metric "$slide1" 96 700 "26-52h" "low-readiness SME review redirected" 420
metric "$slide1" 540 700 "\$200m+" "case-stated GWP growth opportunity to operationalize" 430
panel "$slide1" 1040 340 360 128 "$BLUE" "Problem" "White-space targets hide beyond obvious broker flow." "problem"
panel "$slide1" 1430 340 360 128 "$GREEN" "Prototype" "Validated briefs, not quote-ready outreach." "prototype"
panel "$slide1" 1040 508 360 128 "$GOLD" "Proof" "70 accounts, 304 buyer paths, 0 issues." "proof"
panel "$slide1" 1430 508 360 128 "$RED" "Next step" "Run D&B 30k with Zurich data and top-25 SME review." "next"
magick "$slide1" -fill "$LIGHT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 96,840 1790,1002" "$slide1"
text_at "$slide1" 1620 38 27 "$NAVY" Helvetica-Bold "Solution" 122 866 "s1-solution-title"
text_at "$slide1" 1600 76 25 "$NAVY" Helvetica "Zurich Scout converts public signals into account review briefs: why this account, why now, likely entry lines, what could be wrong, and what Zurich must validate before anyone acts." 122 914 "s1-solution-body"

slide2="$OUT/zurich-scout-02-proof.png"
base "$slide2"
text_at "$slide2" 1380 72 48 "$TEXT" Helvetica-Bold "Proof: qualification beats lead lists" 96 142 "s2-title"
magick "$slide2" -fill "#FFFBE6" -stroke "#EFE4A4" -strokewidth 1 -draw "rectangle 96,226 1790,334" "$slide2"
text_at "$slide2" 1540 58 27 "$TEXT" Helvetica "The pilot filtered 70 financial institutions into a broker-safe Zurich action queue." 150 260 "s2-banner"
metric "$slide2" 116 424 "70" "reviewed" 210
metric "$slide2" 370 424 "18" "pursue" 210
metric "$slide2" 624 424 "50" "watch" 210
metric "$slide2" 878 424 "2" "reject" 210
metric "$slide2" 116 640 "304" "buyer paths" 250
metric "$slide2" 430 640 "0" "validation issues" 270
panel "$slide2" 1040 420 330 130 "$BLUE" "First gates" "CRM status, broker owner, prior quote." "gates-a"
panel "$slide2" 1410 420 330 130 "$GREEN" "Timing gates" "Renewal timing, loss history, account owner." "gates-b"
panel "$slide2" 1040 610 330 130 "$GOLD" "Top queue" "Citizens, Nicolet, NBH, Stellar, Banner." "queue"
panel "$slide2" 1410 610 330 130 "$RED" "Discipline" "Watch and reject protect expert time." "discipline"
text_at "$slide2" 1600 52 29 "$BLUE" Helvetica-Bold "Watch and reject are features: they prevent bad AI-lead behavior." 96 930 "s2-bottom"

slide3="$OUT/zurich-scout-03-scale-path.png"
base "$slide3"
text_at "$slide3" 1420 72 48 "$TEXT" Helvetica-Bold "Zurich data creates the moat" 96 142 "s3-title"
text_at "$slide3" 1540 62 28 "$TEXT" Helvetica "Public scouting becomes defensible when Zurich overlays relationship memory." 96 222 "s3-lead"
panel "$slide3" 120 390 390 260 "$BLUE" "Public universe" "D&B 30k\nFilings\nWebsites\nNews\nTrigger signals" "public"
panel "$slide3" 765 390 390 260 "$GREEN" "Zurich overlay" "CRM\nBroker owner\nPrior quote\nRenewal\nLoss and appetite" "overlay"
panel "$slide3" 1410 390 390 260 "$GOLD" "Guarded activation" "Account review\nBroker ask\nWarm intro\nCRM task\nOutreach support" "activation"
magick "$slide3" \
  -stroke "$BLUE" -strokewidth 4 -fill none -draw "line 510,520 765,520" \
  -draw "line 1155,520 1410,520" \
  -fill "$BLUE" -stroke none -draw "polygon 742,510 765,520 742,530" \
  -draw "polygon 1387,510 1410,520 1387,530" \
  "$slide3"
magick "$slide3" -fill "$LIGHT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 96,820 1790,970" "$slide3"
text_at "$slide3" 1580 72 31 "$NAVY" Helvetica-Bold "Generic AI can research companies. Zurich wins when public signals meet proprietary relationship data." 122 858 "s3-bottom"

tech="$OUT/zurich-scout-technical-summary.png"
base "$tech"
text_at "$tech" 1280 72 48 "$TEXT" Helvetica-Bold "Technical Summary" 96 142 "t-title"
text_at "$tech" 1540 58 28 "$TEXT" Helvetica "Gated agent workflow, structured output, validation checks." 96 222 "t-lead"
labels=("Define ICP" "Source" "Triage" "Deep research" "Quality panel" "Buyer map" "Pursuit brief")
x=100
for i in "${!labels[@]}"; do
  magick "$tech" -fill "$LIGHT" -stroke "$BLUE" -strokewidth 2 -draw "rectangle ${x},380 $((x+205)),500" "$tech"
  text_at "$tech" 165 52 22 "$NAVY" Helvetica-Bold "${labels[$i]}" $((x+22)) 414 "t-stage-$i"
  if [[ "$i" -lt 6 ]]; then
    magick "$tech" -stroke "$BLUE" -strokewidth 3 -draw "line $((x+205)),440 $((x+250)),440" -fill "$BLUE" -stroke none -draw "polygon $((x+238)),431 $((x+254)),440 $((x+238)),449" "$tech"
  fi
  x=$((x+250))
done
panel "$tech" 112 620 380 180 "$BLUE" "Structured outputs" "JSON for validation and integration.\nMarkdown brief for human review." "outputs"
panel "$tech" 544 620 380 180 "$GREEN" "Validator passed" "70 companies\n304 buyers\n18 / 50 / 2\n0 issues" "validator"
panel "$tech" 976 620 380 180 "$GOLD" "Controls" "Public sources\nNegative evidence\nUnknowns\nNo autonomous outreach" "controls"
panel "$tech" 1408 620 380 180 "$RED" "Zurich gate" "Clear CRM, broker, quote, renewal, loss and appetite before action." "gate"
text_at "$tech" 1540 52 29 "$BLUE" Helvetica-Bold "Auditable and conservative by design." 96 930 "t-bottom"

magick "$slide1" "$slide2" "$slide3" "$OUT/zurich-scout-pitch-deck.pdf"
magick "$tech" "$OUT/zurich-scout-technical-summary.pdf"

echo "Rendered polished slides to $OUT"
