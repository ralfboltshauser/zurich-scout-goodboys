#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DELIVERABLES="$ROOT/deliverables/challenge3-target-customer-scouting"
DECK_DIR="$DELIVERABLES/deck"
VIDEO_DIR="$DELIVERABLES/video"
FRAME_DIR="$VIDEO_DIR/frames"
DECK_FRAME_DIR="$DECK_DIR/screenshots"
TMP_DIR="$ROOT/tmp/challenge3-render"
BRAND_ICON="$DELIVERABLES/brand/zurich-scout-icon.png"

BLUE="#003399"
DARK="#02296a"
MUTED="#5d6676"
LINE="#d9e0ec"
SOFT="#f6f8fb"
GREEN="#1b7f64"
AMBER="#b98218"
RED="#ff5252"
WHITE="#ffffff"

mkdir -p "$DECK_DIR" "$VIDEO_DIR" "$FRAME_DIR" "$DECK_FRAME_DIR" "$TMP_DIR"
rm -f "$TMP_DIR"/*.png "$FRAME_DIR"/*.png "$DECK_FRAME_DIR"/deck-slide-*.png

if [[ -f "$BRAND_ICON" ]]; then
  magick "$BRAND_ICON" -resize 72x72 "$TMP_DIR/brand-icon-72.png"
  magick "$BRAND_ICON" -resize 58x58 "$TMP_DIR/brand-icon-58.png"
fi

caption() {
  local width="$1"
  local height="$2"
  local pointsize="$3"
  local fill="$4"
  local weight="$5"
  local text="$6"
  local out="$7"
  magick -background none -fill "$fill" -font "$weight" -pointsize "$pointsize" \
    -size "${width}x${height}" -gravity northwest "caption:${text}" "$out"
}

compose_text() {
  local canvas="$1"
  local image="$2"
  local x="$3"
  local y="$4"
  magick "$canvas" "$image" -geometry "+${x}+${y}" -composite "$canvas"
}

grid_background() {
  local width="$1"
  local height="$2"
  local out="$3"
  magick -size "${width}x${height}" xc:"$WHITE" \
    -fill "#f7f9fd" -draw "rectangle 0,$((height - height / 5)) $width,$height" \
    -fill none -stroke "#edf2fa" -strokewidth 2 \
    -draw "rectangle 0 0 $((width - 1)) $((height - 1))" \
    "$out"
}

draw_header() {
  local canvas="$1"
  local right="$2"
  if [[ -f "$TMP_DIR/brand-icon-72.png" ]]; then
    magick "$canvas" "$TMP_DIR/brand-icon-72.png" -geometry +92+64 -composite "$canvas"
  fi
  magick "$canvas" \
    -fill "$DARK" -font Helvetica-Bold -pointsize 32 -annotate +180+110 "Zurich Scout" \
    -fill "$BLUE" -font Helvetica-Bold -pointsize 23 -annotate +"$right"+108 "GOOD BOYS · ZURICH CHALLENGE 3" \
    "$canvas"
}

summary_png="$DECK_DIR/GoodBoys_TargetCustomerScouting_executive_summary.png"
summary_pdf="$DECK_DIR/GoodBoys_TargetCustomerScouting_executive_summary.pdf"

grid_background 2400 1697 "$summary_png"
draw_header "$summary_png" 1590
caption 1820 190 78 "$DARK" Helvetica-Bold \
  "Zurich does not need more leads. Zurich needs fewer, better-justified pursuit decisions." "$TMP_DIR/summary-title.png"
caption 1800 112 33 "$MUTED" Helvetica \
  "Zurich Scout turns external market signals into Zurich account review briefs: why this account, why now, which Zurich lines fit, who might influence the conversation, and what Zurich must validate internally before any outreach." "$TMP_DIR/summary-lead.png"
compose_text "$summary_png" "$TMP_DIR/summary-title.png" 92 214
compose_text "$summary_png" "$TMP_DIR/summary-lead.png" 92 420

magick "$summary_png" \
  -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 92,620 1148,1098" \
  -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 1252,620 2308,1098" \
  -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 92,1150 1148,1588" \
  -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 1252,1150 2308,1588" \
  -fill "$BLUE" -draw "rectangle 92,620 1148,634" \
  -fill "$GREEN" -draw "rectangle 1252,620 2308,634" \
  -fill "$AMBER" -draw "rectangle 92,1150 1148,1164" \
  -fill "$RED" -draw "rectangle 1252,1150 2308,1164" \
  "$summary_png"

caption 960 86 24 "$BLUE" Helvetica-Bold "HOW OUR APPROACH SOLVES THE PROBLEM" "$TMP_DIR/p1k.png"
caption 960 72 44 "$DARK" Helvetica-Bold "Scouting with discipline" "$TMP_DIR/p1h.png"
caption 948 250 31 "$MUTED" Helvetica \
  "1. Look externally for white-space accounts aligned to Zurich appetite.\n2. Qualify fit, timing, evidence, risk flags, and likely entry lines.\n3. Route only the strongest accounts into Zurich CRM, broker, quote, renewal, and loss-history validation." "$TMP_DIR/p1b.png"
compose_text "$summary_png" "$TMP_DIR/p1k.png" 130 670
compose_text "$summary_png" "$TMP_DIR/p1h.png" 130 735
compose_text "$summary_png" "$TMP_DIR/p1b.png" 130 815

caption 960 86 24 "$BLUE" Helvetica-Bold "PROTOTYPE RESULT" "$TMP_DIR/p2k.png"
compose_text "$summary_png" "$TMP_DIR/p2k.png" 1290 670
magick "$summary_png" \
  -fill "$WHITE" -stroke "$LINE" -strokewidth 1 -draw "rectangle 1290,750 1518,948" \
  -draw "rectangle 1530,750 1758,948" \
  -draw "rectangle 1770,750 1998,948" \
  -draw "rectangle 2010,750 2268,948" \
  -fill "$DARK" -font Helvetica-Bold -pointsize 70 -annotate +1320+837 "70" \
  -annotate +1560+837 "18" \
  -annotate +1800+837 "50" \
  -annotate +2040+837 "304" \
  -fill "$MUTED" -font Helvetica -pointsize 24 -annotate +1320+895 "FI accounts" \
  -annotate +1560+895 "Pursue" \
  -annotate +1800+895 "Watch" \
  -annotate +2040+895 "Buyer paths" \
  -fill "$DARK" -font Helvetica-Bold -pointsize 30 -annotate +1290+1022 "Final structured artifact passed validation with 0 issues." \
  "$summary_png"

caption 960 86 24 "$BLUE" Helvetica-Bold "BUSINESS VALUE" "$TMP_DIR/p3k.png"
caption 960 74 43 "$DARK" Helvetica-Bold "Focus expert time where it can create growth." "$TMP_DIR/p3h.png"
caption 948 210 31 "$MUTED" Helvetica \
  "The case points to a greater than \$200M topline GWP growth opportunity from expanding target coverage. Zurich Scout makes that expansion operational by suppressing weak leads and elevating evidence-backed accounts for broker-safe, underwriter-aware review." "$TMP_DIR/p3b.png"
compose_text "$summary_png" "$TMP_DIR/p3k.png" 130 1200
compose_text "$summary_png" "$TMP_DIR/p3h.png" 130 1265
compose_text "$summary_png" "$TMP_DIR/p3b.png" 130 1348

caption 960 86 24 "$BLUE" Helvetica-Bold "NEXT STEPS FOR SCALING" "$TMP_DIR/p4k.png"
caption 960 74 43 "$DARK" Helvetica-Bold "Connect Zurich's private data." "$TMP_DIR/p4h.png"
caption 948 248 31 "$MUTED" Helvetica \
  "Run Zurich Scout on the D&B 30,000-company universe, then overlay existing customer, prior quote, broker owner, renewal date, loss-history flag, relationship owner, and appetite class. With that integration, Zurich Scout can suggest warm intros, broker asks, CRM tasks, and guarded outreach after Zurich confirms account ownership." "$TMP_DIR/p4b.png"
compose_text "$summary_png" "$TMP_DIR/p4k.png" 1290 1200
compose_text "$summary_png" "$TMP_DIR/p4h.png" 1290 1265
compose_text "$summary_png" "$TMP_DIR/p4b.png" 1290 1348

magick "$summary_png" "$summary_pdf"

make_frame() {
  local n="$1"
  local kicker="$2"
  local title="$3"
  local body="$4"
  local stat1="$5"
  local stat2="$6"
  local stat3="$7"
  local outfile
  outfile="$FRAME_DIR/frame-$(printf "%02d" "$n").png"
  grid_background 1920 1080 "$outfile"
  draw_header "$outfile" 1460
  caption 780 46 22 "$BLUE" Helvetica-Bold "$kicker" "$TMP_DIR/f${n}-k.png"
  caption 980 250 68 "$DARK" Helvetica-Bold "$title" "$TMP_DIR/f${n}-t.png"
  caption 920 170 31 "$MUTED" Helvetica "$body" "$TMP_DIR/f${n}-b.png"
  compose_text "$outfile" "$TMP_DIR/f${n}-k.png" 90 158
  compose_text "$outfile" "$TMP_DIR/f${n}-t.png" 90 220
  compose_text "$outfile" "$TMP_DIR/f${n}-b.png" 90 500
  magick "$outfile" \
    -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 1110,245 1815,405" \
    -fill "$BLUE" -draw "rectangle 1110,245 1122,405" \
    -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 1110,460 1815,620" \
    -fill "$GREEN" -draw "rectangle 1110,460 1122,620" \
    -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle 1110,675 1815,835" \
    -fill "$RED" -draw "rectangle 1110,675 1122,835" \
    "$outfile"
  caption 640 90 29 "$DARK" Helvetica-Bold "$stat1" "$TMP_DIR/f${n}-s1.png"
  caption 640 90 29 "$DARK" Helvetica-Bold "$stat2" "$TMP_DIR/f${n}-s2.png"
  caption 640 90 29 "$DARK" Helvetica-Bold "$stat3" "$TMP_DIR/f${n}-s3.png"
  compose_text "$outfile" "$TMP_DIR/f${n}-s1.png" 1150 292
  compose_text "$outfile" "$TMP_DIR/f${n}-s2.png" 1150 507
  compose_text "$outfile" "$TMP_DIR/f${n}-s3.png" 1150 722
}

make_frame 1 "OPENING" \
  "Not more leads. Better pursuit decisions." \
  "Zurich's white-space opportunity is not solved by scraping company names. It is solved by deciding which accounts deserve distribution and underwriting attention now." \
  "External signals become account-review evidence" \
  "Qualification comes before outreach" \
  "Internal Zurich gates stay mandatory"

make_frame 2 "WHAT WE BUILT" \
  "Zurich Scout is a target-scouting workflow." \
  "The Smithers workflow defines the Zurich ICP, sources candidates, triages accounts, researches companies, maps buyer paths, and assembles a pursuit brief." \
  "ICP and appetite logic" \
  "Deep company and buyer research" \
  "Zurich action queue"

make_frame 3 "SCHEMA-VALIDATED OUTPUT" \
  "70 accounts became 18 validation candidates." \
  "The FDIC FI pilot reviewed US financial institutions and passed structured completeness validation with zero issues." \
  "18 pursue after Zurich clearance" \
  "50 watch and 2 reject" \
  "304 public buyer / influencer paths"

make_frame 4 "ACCOUNT EXAMPLE" \
  "Citizens Business Bank is pursue, not quote-ready." \
  "The system explains FI fit, scale, property exposure, and a merger trigger, then states the first Zurich gate before anyone acts." \
  "Check CRM and submission history" \
  "Confirm broker ownership and incumbent status" \
  "Validate renewal calendar and loss history"

make_frame 5 "WHY ZURICH WINS" \
  "Private relationship memory is the moat." \
  "Generic AI can research public companies. Zurich's advantage is existing customer, prior quote, broker owner, renewal, loss, and relationship data." \
  "Public scout identifies the opportunity" \
  "Zurich overlay validates the motion" \
  "Warm intros and broker asks become possible"

make_frame 6 "PILOT RECOMMENDATION" \
  "Run the D&B 30,000-company pilot." \
  "Deep-research the strongest accounts, overlay Zurich internal data, and have distribution and underwriting SMEs review the top 25." \
  "Measure clearance pass rate" \
  "Measure broker conversations created" \
  "Measure false-positive reasons"

deck_canvas() {
  local out="$1"
  grid_background 1920 1080 "$out"
  draw_header "$out" 1460
}

draw_label_card() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local w="$4"
  local h="$5"
  local color="$6"
  local label="$7"
  local title="$8"
  local body="$9"
  magick "$canvas" \
    -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle $x,$y $((x + w)),$((y + h))" \
    -fill "$color" -draw "rectangle $x,$y $((x + 10)),$((y + h))" \
    "$canvas"
  caption $((w - 52)) 28 18 "$BLUE" Helvetica-Bold "$label" "$TMP_DIR/card-label.png"
  caption $((w - 52)) 54 29 "$DARK" Helvetica-Bold "$title" "$TMP_DIR/card-title.png"
  caption $((w - 52)) $((h - 118)) 18 "$MUTED" Helvetica "$body" "$TMP_DIR/card-body.png"
  compose_text "$canvas" "$TMP_DIR/card-label.png" $((x + 30)) $((y + 24))
  compose_text "$canvas" "$TMP_DIR/card-title.png" $((x + 30)) $((y + 62))
  compose_text "$canvas" "$TMP_DIR/card-body.png" $((x + 30)) $((y + 124))
}

draw_metric_tile() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local w="$4"
  local h="$5"
  local color="$6"
  local number="$7"
  local label="$8"
  magick "$canvas" \
    -fill "$WHITE" -stroke "$LINE" -strokewidth 2 -draw "rectangle $x,$y $((x + w)),$((y + h))" \
    -fill "$color" -draw "rectangle $x,$y $((x + w)),$((y + 8))" \
    "$canvas"
  caption $((w - 42)) 68 58 "$DARK" Helvetica-Bold "$number" "$TMP_DIR/metric-number.png"
  caption $((w - 42)) 72 19 "$MUTED" Helvetica "$label" "$TMP_DIR/metric-label.png"
  compose_text "$canvas" "$TMP_DIR/metric-number.png" $((x + 22)) $((y + 34))
  compose_text "$canvas" "$TMP_DIR/metric-label.png" $((x + 22)) $((y + 114))
}

draw_title_tile() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local w="$4"
  local h="$5"
  local color="$6"
  local label="$7"
  local title="$8"
  magick "$canvas" \
    -fill "$SOFT" -stroke "$LINE" -strokewidth 2 -draw "rectangle $x,$y $((x + w)),$((y + h))" \
    -fill "$color" -draw "rectangle $x,$y $((x + 8)),$((y + h))" \
    "$canvas"
  caption $((w - 44)) 28 18 "$BLUE" Helvetica-Bold "$label" "$TMP_DIR/title-label.png"
  caption $((w - 44)) 74 27 "$DARK" Helvetica-Bold "$title" "$TMP_DIR/title-title.png"
  compose_text "$canvas" "$TMP_DIR/title-label.png" $((x + 28)) $((y + 24))
  compose_text "$canvas" "$TMP_DIR/title-title.png" $((x + 28)) $((y + 62))
}

deck1="$DECK_FRAME_DIR/deck-slide-01.png"
deck_canvas "$deck1"
caption 760 44 22 "$BLUE" Helvetica-Bold "PROBLEM / SOLUTION" "$TMP_DIR/d1-k.png"
caption 840 190 62 "$DARK" Helvetica-Bold "Not more leads. Better pursuit decisions." "$TMP_DIR/d1-t.png"
caption 810 136 28 "$MUTED" Helvetica \
  "Zurich Scout turns external signals into Zurich account-review evidence. Qualification comes first; outreach only happens after Zurich validates ownership, broker context, appetite, and timing." "$TMP_DIR/d1-b.png"
compose_text "$deck1" "$TMP_DIR/d1-k.png" 90 158
compose_text "$deck1" "$TMP_DIR/d1-t.png" 90 220
compose_text "$deck1" "$TMP_DIR/d1-b.png" 90 438
draw_label_card "$deck1" 1060 200 680 170 "$BLUE" "01" "External evidence" "D&B-style universe, filings, news, company sites, trigger signals, and public buyer paths."
draw_label_card "$deck1" 1060 405 680 170 "$GREEN" "02" "Zurich-fit qualification" "Appetite fit, line fit, why-now trigger, risk flags, unknowns, and confidence."
draw_label_card "$deck1" 1060 610 680 170 "$RED" "03" "Internal validation gate" "CRM match, prior quote, broker owner, renewal date, loss signal, and account-owner clearance."
caption 1660 70 24 "$DARK" Helvetica-Bold \
  "Core message: an explainable pursuit decision layer for distribution and underwriting, not a cold lead list." "$TMP_DIR/d1-takeaway.png"
compose_text "$deck1" "$TMP_DIR/d1-takeaway.png" 90 910

deck2="$DECK_FRAME_DIR/deck-slide-02.png"
deck_canvas "$deck2"
caption 760 44 22 "$BLUE" Helvetica-Bold "RESULTS / PROOF" "$TMP_DIR/d2-k.png"
caption 860 150 60 "$DARK" Helvetica-Bold "70 accounts became 18 Zurich validation candidates." "$TMP_DIR/d2-t.png"
caption 820 120 26 "$MUTED" Helvetica \
  "The FDIC financial-institutions pilot deliberately held back accounts where broker ownership, timing, renewal, loss, or underwriting evidence was not strong enough." "$TMP_DIR/d2-b.png"
compose_text "$deck2" "$TMP_DIR/d2-k.png" 90 158
compose_text "$deck2" "$TMP_DIR/d2-t.png" 90 220
compose_text "$deck2" "$TMP_DIR/d2-b.png" 90 398
draw_metric_tile "$deck2" 1030 188 190 214 "$BLUE" "70" "Accounts reviewed"
draw_metric_tile "$deck2" 1246 188 190 214 "$GREEN" "18" "Pursue after Zurich clearance"
draw_metric_tile "$deck2" 1462 188 190 214 "$AMBER" "50" "Watch until timing or evidence improves"
draw_metric_tile "$deck2" 1678 188 170 214 "$RED" "2" "Reject from this motion"
draw_metric_tile "$deck2" 1030 432 395 178 "$BLUE" "304" "Public buyer / influencer paths mapped"
draw_metric_tile "$deck2" 1454 432 394 178 "$GREEN" "0" "Structured validation issues"
draw_label_card "$deck2" 90 650 530 174 "$GREEN" "TOP QUEUE" "Citizens Business Bank" "Priority 76. First gate: CRM, broker ownership, incumbent, renewal calendar, and loss history."
draw_label_card "$deck2" 692 650 530 174 "$GREEN" "TOP QUEUE" "Nicolet National Bank" "Priority 76. First gate: Zurich account status, current broker ownership, and appetite clearance."
draw_label_card "$deck2" 1294 650 530 174 "$GREEN" "TOP QUEUE" "Stellar Bank" "Priority 74. First gate: Stellar / Prosperity quote, loss, and broker history."
caption 1660 70 24 "$DARK" Helvetica-Bold \
  "Trust signal: Zurich Scout says pursue, watch, or reject with reasons and mandatory Zurich gates." "$TMP_DIR/d2-takeaway.png"
compose_text "$deck2" "$TMP_DIR/d2-takeaway.png" 90 910

deck3="$DECK_FRAME_DIR/deck-slide-03.png"
deck_canvas "$deck3"
caption 760 44 22 "$BLUE" Helvetica-Bold "PILOT / VISION" "$TMP_DIR/d3-k.png"
caption 820 150 60 "$DARK" Helvetica-Bold "Zurich's private data turns scouting into a growth system." "$TMP_DIR/d3-t.png"
caption 820 118 26 "$MUTED" Helvetica \
  "Start with disciplined qualification. When Zurich connects CRM, broker, quote, renewal, loss, and relationship data, Zurich Scout can activate the right next action." "$TMP_DIR/d3-b.png"
compose_text "$deck3" "$TMP_DIR/d3-k.png" 90 158
compose_text "$deck3" "$TMP_DIR/d3-t.png" 90 220
compose_text "$deck3" "$TMP_DIR/d3-b.png" 90 398
draw_title_tile "$deck3" 1030 184 260 150 "$BLUE" "NOW" "Qualified account briefs"
draw_title_tile "$deck3" 1320 184 260 150 "$GREEN" "PILOT" "D&B 30k + SME review"
draw_title_tile "$deck3" 1610 184 235 150 "$RED" "VISION" "Guarded activation"
magick "$deck3" \
  -fill "$DARK" -draw "rectangle 1028,424 1852,734" \
  -fill "#133f8a" -draw "rectangle 1054,484 1278,646" \
  -fill "#1b7f64" -draw "rectangle 1304,484 1528,646" \
  -fill "#ff5252" -draw "rectangle 1554,484 1826,646" \
  "$deck3"
caption 180 66 20 "$WHITE" Helvetica-Bold "Public scout" "$TMP_DIR/d3-a.png"
caption 180 66 20 "$WHITE" Helvetica-Bold "Zurich overlay" "$TMP_DIR/d3-b2.png"
caption 230 66 20 "$WHITE" Helvetica-Bold "Broker-safe activation" "$TMP_DIR/d3-c.png"
caption 780 52 24 "$WHITE" Helvetica-Bold "Public evidence + Zurich relationship memory = validated pursuit motion" "$TMP_DIR/d3-formula.png"
compose_text "$deck3" "$TMP_DIR/d3-a.png" 1076 565
compose_text "$deck3" "$TMP_DIR/d3-b2.png" 1326 565
compose_text "$deck3" "$TMP_DIR/d3-c.png" 1576 565
compose_text "$deck3" "$TMP_DIR/d3-formula.png" 1058 672
draw_title_tile "$deck3" 90 662 250 132 "$BLUE" "MEASURE" "Clearance pass rate"
draw_title_tile "$deck3" 378 662 250 132 "$GREEN" "MEASURE" "Broker conversations"
draw_title_tile "$deck3" 666 662 250 132 "$RED" "MEASURE" "False-positive reasons"
caption 1660 70 24 "$DARK" Helvetica-Bold \
  "Strategic advantage: Zurich's private relationship memory turns public research into a defensible growth system." "$TMP_DIR/d3-takeaway.png"
compose_text "$deck3" "$TMP_DIR/d3-takeaway.png" 90 910

magick "$DECK_FRAME_DIR/deck-slide-01.png" "$DECK_FRAME_DIR/deck-slide-02.png" "$DECK_FRAME_DIR/deck-slide-03.png" \
  "$DECK_DIR/GoodBoys_TargetCustomerScouting_pitch_deck.pdf"

# Enhanced submission visuals aligned to the higher-polish Agentic Commerce deck.
# These overwrite the earlier storyboard-style assets with a cleaner Zurich-style
# white presentation system: stronger executive hierarchy, fewer words, clearer
# diagrams, and a one-page technical architecture PDF.
official_canvas() {
  local out="$1"
  magick -size 1920x1080 xc:"$WHITE" \
    -fill "#f3f8fc" -draw "rectangle 0,930 1920,1080" \
    -fill none -stroke "#edf2f7" -strokewidth 2 -draw "rectangle 0,0 1919,1079" \
    "$out"
}

official_header() {
  local canvas="$1"
  if [[ -f "$TMP_DIR/brand-icon-58.png" ]]; then
    magick "$canvas" "$TMP_DIR/brand-icon-58.png" -geometry +96+57 -composite "$canvas"
  fi
  magick "$canvas" \
    -fill "#0070b8" -draw "rectangle 0,0 1920,18" \
    -fill "$DARK" -font Helvetica-Bold -pointsize 30 -annotate +172+94 "Zurich Scout" \
    -fill "$MUTED" -font Helvetica -pointsize 21 -annotate +1500+92 "Good Boys  |  Zurich Challenge 3" \
    "$canvas"
}

metric_big() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local number="$4"
  local label="$5"
  local width="${6:-300}"
  caption "$width" 90 64 "#0070b8" Helvetica-Bold "$number" "$TMP_DIR/metric-big-number.png"
  caption "$width" 78 25 "$DARK" Helvetica "$label" "$TMP_DIR/metric-big-label.png"
  compose_text "$canvas" "$TMP_DIR/metric-big-number.png" "$x" "$y"
  compose_text "$canvas" "$TMP_DIR/metric-big-label.png" "$x" $((y + 88))
}

plain_panel() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local w="$4"
  local h="$5"
  local color="$6"
  local title="$7"
  local body="$8"
  magick "$canvas" \
    -fill "#f7fafc" -stroke "#d8e3ee" -strokewidth 2 -draw "rectangle $x,$y $((x + w)),$((y + h))" \
    -fill "$color" -draw "rectangle $x,$y $((x + 8)),$((y + h))" \
    "$canvas"
  caption $((w - 56)) 42 26 "$DARK" Helvetica-Bold "$title" "$TMP_DIR/panel-title.png"
  caption $((w - 56)) $((h - 76)) 21 "$MUTED" Helvetica "$body" "$TMP_DIR/panel-body.png"
  compose_text "$canvas" "$TMP_DIR/panel-title.png" $((x + 30)) $((y + 26))
  compose_text "$canvas" "$TMP_DIR/panel-body.png" $((x + 30)) $((y + 78))
}

diagram_box() {
  local canvas="$1"
  local x="$2"
  local y="$3"
  local w="$4"
  local h="$5"
  local title="$6"
  local body="$7"
  magick "$canvas" \
    -fill "$WHITE" -stroke "#1595e6" -strokewidth 2 -draw "roundrectangle $x,$y $((x + w)),$((y + h)) 6,6" \
    "$canvas"
  caption $((w - 34)) 38 20 "$DARK" Helvetica-Bold "$title" "$TMP_DIR/diag-title.png"
  caption $((w - 34)) $((h - 54)) 16 "$MUTED" Helvetica "$body" "$TMP_DIR/diag-body.png"
  compose_text "$canvas" "$TMP_DIR/diag-title.png" $((x + 17)) $((y + 18))
  compose_text "$canvas" "$TMP_DIR/diag-body.png" $((x + 17)) $((y + 56))
}

connector_line() {
  local canvas="$1"
  local x1="$2"
  local y1="$3"
  local x2="$4"
  local y2="$5"
  magick "$canvas" -stroke "#1595e6" -strokewidth 3 -draw "line $x1,$y1 $x2,$y2" "$canvas"
}

summary_png="$DECK_DIR/GoodBoys_TargetCustomerScouting_executive_summary.png"
summary_pdf="$DECK_DIR/GoodBoys_TargetCustomerScouting_executive_summary.pdf"
official_canvas "$summary_png"
official_header "$summary_png"
caption 900 92 46 "$DARK" Helvetica-Bold "Executive Summary" "$TMP_DIR/es-title.png"
caption 1550 98 29 "$DARK" Helvetica \
  "Zurich does not need another lead list. It needs one disciplined pursuit layer that screens the white-space universe, suppresses weak accounts, and routes only evidence-backed targets into Zurich validation." "$TMP_DIR/es-lead.png"
compose_text "$summary_png" "$TMP_DIR/es-title.png" 96 138
compose_text "$summary_png" "$TMP_DIR/es-lead.png" 96 216
caption 520 42 29 "#0070b8" Helvetica-Bold "Expected impact" "$TMP_DIR/es-impact.png"
caption 720 58 20 "$MUTED" Helvetica-Oblique \
  "Pilot proof on FDIC financial institutions; scale path is the D&B 30,000-company universe with Zurich CRM/broker/quote/loss overlay." "$TMP_DIR/es-assumption.png"
compose_text "$summary_png" "$TMP_DIR/es-impact.png" 96 344
compose_text "$summary_png" "$TMP_DIR/es-assumption.png" 96 392
metric_big "$summary_png" 96 486 "70 -> 18" "accounts narrowed to active Zurich validation candidates" 410
metric_big "$summary_png" 555 486 "26-52h" "low-readiness SME review avoided in the pilot" 390
metric_big "$summary_png" 96 684 "\$200m+" "case-stated topline GWP growth opportunity to operationalize" 440
caption 580 135 25 "$DARK" Helvetica \
  "Business effects\n- Focus expert attention\n- Respect broker ownership\n- Convert signals into CRM-ready reviews" "$TMP_DIR/es-effects.png"
compose_text "$summary_png" "$TMP_DIR/es-effects.png" 555 684
plain_panel "$summary_png" 1095 342 360 135 "#0070b8" "Problem" "White-space targets hide beyond obvious broker flow."
plain_panel "$summary_png" 1490 342 330 135 "$GREEN" "Prototype" "Validated briefs, not quote-ready outreach."
plain_panel "$summary_png" 1095 510 360 135 "$AMBER" "Proof" "70 accounts, 304 buyer paths, 0 issues."
plain_panel "$summary_png" 1490 510 330 135 "$RED" "Next step" "D&B 30k, Zurich data, top 25 SME review."
magick "$summary_png" -fill "#eef5fb" -stroke "#d8e3ee" -strokewidth 2 -draw "rectangle 96,835 1820,970" "$summary_png"
caption 1660 44 28 "$DARK" Helvetica-Bold "Solution" "$TMP_DIR/es-solution-title.png"
caption 1660 74 25 "$DARK" Helvetica \
  "Zurich Scout turns external market signals into Zurich account review briefs: why this account, why now, which lines may fit, who may influence the conversation, what could be wrong, and what Zurich must validate internally before anyone acts." "$TMP_DIR/es-solution-body.png"
compose_text "$summary_png" "$TMP_DIR/es-solution-title.png" 122 866
compose_text "$summary_png" "$TMP_DIR/es-solution-body.png" 122 914
magick "$summary_png" "$summary_pdf"

deck1="$DECK_FRAME_DIR/deck-slide-01.png"
official_canvas "$deck1"
official_header "$deck1"
caption 1500 125 42 "$DARK" Helvetica-Bold "Target scouting is a qualification workflow, not a lead-list workflow" "$TMP_DIR/ds1-title.png"
caption 1560 84 27 "$DARK" Helvetica \
  "Zurich's white-space opportunity is captured when public market signals become underwriter-safe account-review evidence, then pass Zurich's broker, CRM, quote, renewal, and loss-history gates." "$TMP_DIR/ds1-lead.png"
compose_text "$deck1" "$TMP_DIR/ds1-title.png" 96 150
compose_text "$deck1" "$TMP_DIR/ds1-lead.png" 96 244
magick "$deck1" -fill "#fffde8" -stroke "#eee4a6" -strokewidth 2 -draw "rectangle 96,355 1820,492" "$deck1"
caption 1500 78 27 "$DARK" Helvetica \
  "Growth without noise: Zurich Scout protects expert time and broker ownership by qualifying first, then activating only after Zurich clearance." "$TMP_DIR/ds1-callout.png"
compose_text "$deck1" "$TMP_DIR/ds1-callout.png" 180 395
diagram_box "$deck1" 140 610 300 148 "External universe" "D&B-style companies, filings, websites, news, trigger signals."
diagram_box "$deck1" 585 610 300 148 "Zurich Scout" "Appetite fit, why-now, line hypotheses, risks, unknowns."
diagram_box "$deck1" 1030 610 300 148 "Zurich gates" "CRM, broker owner, prior quote, renewal, loss history."
diagram_box "$deck1" 1475 610 300 148 "Action queue" "Broker-safe account review, warm intro, CRM task, or watch."
connector_line "$deck1" 440 684 585 684
connector_line "$deck1" 885 684 1030 684
connector_line "$deck1" 1330 684 1475 684
caption 1640 56 28 "#0070b8" Helvetica-Bold "Not more leads. Better pursuit decisions." "$TMP_DIR/ds1-bottom.png"
compose_text "$deck1" "$TMP_DIR/ds1-bottom.png" 96 930

deck2="$DECK_FRAME_DIR/deck-slide-02.png"
official_canvas "$deck2"
official_header "$deck2"
caption 1500 118 42 "$DARK" Helvetica-Bold "Pilot proof: 70 accounts became 18 validation candidates" "$TMP_DIR/ds2-title.png"
caption 960 78 25 "$DARK" Helvetica \
  "The FDIC financial-institutions pilot is deliberately conservative. Pursue means worth Zurich internal clearance now, not quote-ready and not automatic outreach." "$TMP_DIR/ds2-lead.png"
compose_text "$deck2" "$TMP_DIR/ds2-title.png" 96 150
compose_text "$deck2" "$TMP_DIR/ds2-lead.png" 96 244
metric_big "$deck2" 96 380 "18" "pursue after Zurich clearance" 250
metric_big "$deck2" 380 380 "50" "watch until timing or evidence improves" 310
metric_big "$deck2" 735 380 "2" "reject from this pursuit motion" 250
metric_big "$deck2" 1025 380 "304" "public buyer / influencer paths" 340
metric_big "$deck2" 1410 380 "0" "schema validation issues" 310
plain_panel "$deck2" 96 640 510 185 "$GREEN" "Citizens Business Bank" "Priority 76. First Zurich gate: CRM, submission history, broker ownership, incumbent, renewal, and loss history."
plain_panel "$deck2" 705 640 510 185 "$GREEN" "Nicolet National Bank" "Priority 76. First Zurich gate: current Zurich / broker ownership and appetite clearance."
plain_panel "$deck2" 1314 640 510 185 "$GREEN" "Stellar Bank" "Priority 74. First Zurich gate: Stellar / Prosperity quote, loss, and broker history."
caption 1600 58 27 "#0070b8" Helvetica-Bold "The value is focus: suppress weak pursuits before they consume scarce expert attention." "$TMP_DIR/ds2-bottom.png"
compose_text "$deck2" "$TMP_DIR/ds2-bottom.png" 96 930

deck3="$DECK_FRAME_DIR/deck-slide-03.png"
official_canvas "$deck3"
official_header "$deck3"
caption 1500 118 42 "$DARK" Helvetica-Bold "Zurich data turns public scouting into a growth advantage" "$TMP_DIR/ds3-title.png"
caption 980 84 25 "$DARK" Helvetica \
  "Generic AI can research companies. Zurich wins when public scouting is joined with relationship memory: CRM, broker, quote, renewal, loss, and appetite context." "$TMP_DIR/ds3-lead.png"
compose_text "$deck3" "$TMP_DIR/ds3-title.png" 96 150
compose_text "$deck3" "$TMP_DIR/ds3-lead.png" 96 244
diagram_box "$deck3" 96 405 330 140 "Now" "Qualified account briefs from public evidence."
diagram_box "$deck3" 512 405 330 140 "Pilot" "D&B 30k triage plus Zurich SME review of top 25."
diagram_box "$deck3" 928 405 330 140 "Integration" "CRM, broker, quote, renewal, loss, and appetite overlays."
diagram_box "$deck3" 1344 405 330 140 "Vision" "Warm intros, broker asks, CRM tasks, and guarded outreach."
connector_line "$deck3" 426 475 512 475
connector_line "$deck3" 842 475 928 475
connector_line "$deck3" 1258 475 1344 475
magick "$deck3" -fill "$DARK" -draw "rectangle 96,650 1820,815" "$deck3"
caption 1650 54 31 "$WHITE" Helvetica-Bold \
  "Public evidence + Zurich relationship memory = validated pursuit motion" "$TMP_DIR/ds3-formula.png"
caption 1650 45 22 "#d5e8f7" Helvetica \
  "Measure: clearance pass rate, SME acceptance, broker conversations, qualified account reviews, false-positive reasons, and time saved." "$TMP_DIR/ds3-measure.png"
compose_text "$deck3" "$TMP_DIR/ds3-formula.png" 135 688
compose_text "$deck3" "$TMP_DIR/ds3-measure.png" 135 756
caption 1580 58 27 "#0070b8" Helvetica-Bold "Start with disciplined qualification; scale into relationship-led activation once Zurich data is connected." "$TMP_DIR/ds3-bottom.png"
compose_text "$deck3" "$TMP_DIR/ds3-bottom.png" 96 930
magick "$deck1" "$deck2" "$deck3" "$DECK_DIR/GoodBoys_TargetCustomerScouting_pitch_deck.pdf"

tech_png="$DECK_DIR/GoodBoys_TargetCustomerScouting_technical_summary.png"
tech_pdf="$DELIVERABLES/technical-summary/GoodBoys_TargetCustomerScouting_technical_summary.pdf"
official_canvas "$tech_png"
official_header "$tech_png"
caption 1060 74 48 "$DARK" Helvetica-Bold "Technical Architecture" "$TMP_DIR/tech-title.png"
caption 1500 70 26 "$DARK" Helvetica \
  "Zurich Scout is a gated, auditable research workflow: wide candidate triage first, deep account and buyer research second, Zurich validation gates before any activation." "$TMP_DIR/tech-lead.png"
compose_text "$tech_png" "$TMP_DIR/tech-title.png" 96 150
compose_text "$tech_png" "$TMP_DIR/tech-lead.png" 96 238
diagram_box "$tech_png" 120 370 300 122 "Inputs" "Challenge brief, AMA notes, FI appetite, public evidence."
diagram_box "$tech_png" 545 370 300 122 "Triage" "Candidate sourcing, ICP fit, appetite, timing, evidence."
diagram_box "$tech_png" 970 370 300 122 "Deep research" "Company facts, risks, unknowns, buyer paths, source URLs."
diagram_box "$tech_png" 1395 370 300 122 "Output" "Structured JSON and Zurich account-review brief."
connector_line "$tech_png" 420 431 545 431
connector_line "$tech_png" 845 431 970 431
connector_line "$tech_png" 1270 431 1395 431
magick "$tech_png" -fill "#f7fafc" -stroke "#d8e3ee" -strokewidth 2 -draw "rectangle 120,600 1695,820" "$tech_png"
caption 1480 46 28 "$DARK" Helvetica-Bold "Controls and evaluation" "$TMP_DIR/tech-controls-title.png"
caption 1480 122 23 "$DARK" Helvetica \
  "Zod schemas and validator enforce complete account briefs, source-supported evidence, negative evidence, unknowns, underwriting questions, capped buyer research, and pursue/watch/reject discipline. Final run: 70 companies, 304 buyers, 18 pursue, 50 watch, 2 reject, 0 validation issues." "$TMP_DIR/tech-controls-body.png"
compose_text "$tech_png" "$TMP_DIR/tech-controls-title.png" 150 632
compose_text "$tech_png" "$TMP_DIR/tech-controls-body.png" 150 685
caption 1540 46 24 "#0070b8" Helvetica-Bold "Boundary: validation proves structure and completeness, not Zurich CRM, broker, renewal, or underwriting truth." "$TMP_DIR/tech-boundary.png"
compose_text "$tech_png" "$TMP_DIR/tech-boundary.png" 120 905
magick "$tech_png" "$tech_pdf"

for n in 1 2 3 4 5 6; do
  frame="$FRAME_DIR/frame-$(printf "%02d" "$n").png"
  case "$n" in
    1) cp "$deck1" "$frame" ;;
    2) cp "$deck2" "$frame" ;;
    3) cp "$deck3" "$frame" ;;
    4) official_canvas "$frame"; official_header "$frame"; caption 1120 76 48 "$DARK" Helvetica-Bold "Example: pursue does not mean quote-ready" "$TMP_DIR/v4-title.png"; caption 1500 90 27 "$DARK" Helvetica "Citizens Business Bank is attractive because public evidence shows FI fit, scale, branch/property exposure, and a merger trigger. The first action is still Zurich internal validation." "$TMP_DIR/v4-lead.png"; compose_text "$frame" "$TMP_DIR/v4-title.png" 96 170; compose_text "$frame" "$TMP_DIR/v4-lead.png" 96 265; plain_panel "$frame" 120 500 500 150 "$GREEN" "Why it rises" "FI appetite fit, branch footprint, public trigger, and multiline entry hypotheses."; plain_panel "$frame" 710 500 500 150 "$AMBER" "Why it can be wrong" "Broker owner, incumbent status, prior submissions, renewal, and loss history are unknown."; plain_panel "$frame" 1300 500 500 150 "$RED" "First Zurich gate" "CRM search, broker ownership, incumbent, renewal calendar, and account-owner clearance."; caption 1550 58 27 "#0070b8" Helvetica-Bold "This is account-review discipline, not automated outreach." "$TMP_DIR/v4-bottom.png"; compose_text "$frame" "$TMP_DIR/v4-bottom.png" 96 930 ;;
    5) official_canvas "$frame"; official_header "$frame"; caption 1100 76 48 "$DARK" Helvetica-Bold "The operating model Zurich can pilot next" "$TMP_DIR/v5-title.png"; caption 1500 82 27 "$DARK" Helvetica "Run the same workflow over the D&B 30,000-company universe, add Zurich internal overlays, and let distribution and underwriting SMEs review the top 25 accounts." "$TMP_DIR/v5-lead.png"; compose_text "$frame" "$TMP_DIR/v5-title.png" 96 170; compose_text "$frame" "$TMP_DIR/v5-lead.png" 96 265; diagram_box "$frame" 135 520 300 135 "1. First pass" "Cheap broad triage over D&B 30k."; diagram_box "$frame" 545 520 300 135 "2. Deep research" "Evidence, risks, buyers, entry lines."; diagram_box "$frame" 955 520 300 135 "3. Zurich overlay" "CRM, broker, quote, renewal, loss."; diagram_box "$frame" 1365 520 300 135 "4. SME review" "Top 25 decisions and learning loop."; connector_line "$frame" 435 588 545 588; connector_line "$frame" 845 588 955 588; connector_line "$frame" 1255 588 1365 588; caption 1550 58 27 "#0070b8" Helvetica-Bold "Pilot outcome: validated broker conversations, not vanity lead volume." "$TMP_DIR/v5-bottom.png"; compose_text "$frame" "$TMP_DIR/v5-bottom.png" 96 930 ;;
    6) official_canvas "$frame"; official_header "$frame"; caption 1080 76 48 "$DARK" Helvetica-Bold "Where this goes if Zurich integrates deeply" "$TMP_DIR/v6-title.png"; caption 1500 82 27 "$DARK" Helvetica "With CRM and relationship data connected, Zurich Scout can become a guarded activation layer: warm-intro suggestions, broker asks, CRM tasks, and outreach support only after ownership is confirmed." "$TMP_DIR/v6-lead.png"; compose_text "$frame" "$TMP_DIR/v6-title.png" 96 170; compose_text "$frame" "$TMP_DIR/v6-lead.png" 96 265; metric_big "$frame" 140 520 "Public" "market scout identifies opportunity" 290; metric_big "$frame" 540 520 "Zurich" "private data validates motion" 310; metric_big "$frame" 960 520 "Broker" "safe relationship activation" 330; metric_big "$frame" 1395 520 "CRM" "tasks, tracking, learning loop" 300; caption 1500 58 27 "#0070b8" Helvetica-Bold "Zurich's moat is relationship memory plus disciplined execution." "$TMP_DIR/v6-bottom.png"; compose_text "$frame" "$TMP_DIR/v6-bottom.png" 96 930 ;;
  esac
done

for frame in "$FRAME_DIR"/frame-*.png; do
  magick "$frame" -resize 960x540 "$TMP_DIR/preview-$(basename "$frame")"
done
magick -delay 260 "$TMP_DIR"/preview-frame-*.png -loop 0 "$VIDEO_DIR/GoodBoys_TargetCustomerScouting_storyboard_preview.gif"

if command -v ffmpeg >/dev/null 2>&1; then
  awk 'found{print} /^## Transcript$/{found=1}' \
    "$VIDEO_DIR/GoodBoys_TargetCustomerScouting_transcript.md" > "$TMP_DIR/narration.txt"
  ffmpeg -y -framerate 1/28 -i "$FRAME_DIR/frame-%02d.png" \
    -f lavfi -i "flite=textfile=$TMP_DIR/narration.txt:voice=kal" \
    -filter:a "atempo=1.25" \
    -c:v libx264 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 96k -shortest \
    "$VIDEO_DIR/GoodBoys_TargetCustomerScouting.mp4"
  cat > "$VIDEO_DIR/MP4_RENDERING_NOTE.md" <<'NOTE'
# MP4 Rendering Note

The storyboard frames and transcript are complete. The final MP4 in this package is a narrated H.264/AAC slideshow rendered from the six storyboard frames and the transcript:

```bash
awk 'found{print} /^## Transcript$/{found=1}' \
  deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting_transcript.md > tmp/challenge3-render/narration.txt

ffmpeg -y -framerate 1/28 -i deliverables/challenge3-target-customer-scouting/video/frames/frame-%02d.png \
  -f lavfi -i "flite=textfile=tmp/challenge3-render/narration.txt:voice=kal" \
  -filter:a "atempo=1.25" \
  -c:v libx264 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 96k -shortest \
  deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting.mp4
```

The package includes:

`deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting.mp4`

Fallback if ffmpeg is unavailable:

```bash
node scripts/build_mp4_slideshow.mjs
```

The generated GIF preview is available at:

`deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting_storyboard_preview.gif`
NOTE
else
  cat > "$VIDEO_DIR/MP4_RENDERING_NOTE.md" <<'NOTE'
# MP4 Rendering Note

The storyboard frames and transcript are complete. This environment does not have `ffmpeg`, so the final MP4 is generated with the repository's local JavaScript slideshow encoder:

```bash
node scripts/build_mp4_slideshow.mjs
```

The current submission package includes:

`deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting.mp4`

On a machine with ffmpeg, the same frames can also be encoded with:

```bash
ffmpeg -y -framerate 1/20 -i deliverables/challenge3-target-customer-scouting/video/frames/frame-%02d.png \
  -c:v libx264 -pix_fmt yuv420p -r 30 \
  deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting.mp4
```

The generated GIF preview is available at:

`deliverables/challenge3-target-customer-scouting/video/GoodBoys_TargetCustomerScouting_storyboard_preview.gif`
NOTE
fi

echo "Rendered executive summary, storyboard frames, and video preview assets."
