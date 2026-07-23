import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const videoDir = join(root, "deliverables/challenge3-target-customer-scouting/video");
const frameDir = join(videoDir, "frames");
const tmpDir = join(root, "tmp/challenge3-mp4");
mkdirSync(tmpDir, { recursive: true });

const framePaths = [1, 2, 3, 4, 5, 6].map((n) =>
  join(frameDir, `frame-${String(n).padStart(2, "0")}.png`),
);

const jpegPaths = framePaths.map((frame) => {
  const out = join(tmpDir, basename(frame, ".png") + ".jpg");
  execFileSync("magick", [frame, "-quality", "88", out], { stdio: "inherit" });
  return out;
});

const samples = jpegPaths.map((path) => readFileSync(path));
const width = 1920;
const height = 1080;
const timescale = 1000;
const sampleDuration = 20_000;
const duration = sampleDuration * samples.length;

const u8 = (v) => Buffer.from([v & 0xff]);
const u16 = (v) => {
  const b = Buffer.alloc(2);
  b.writeUInt16BE(v);
  return b;
};
const u24 = (v) => Buffer.from([(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff]);
const u32 = (v) => {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(v >>> 0);
  return b;
};
const i16 = (v) => {
  const b = Buffer.alloc(2);
  b.writeInt16BE(v);
  return b;
};
const str = (s) => Buffer.from(s, "ascii");
const zeros = (n) => Buffer.alloc(n);
const concat = (...parts) => Buffer.concat(parts.flat());

function box(type, ...payload) {
  const body = concat(...payload);
  return concat(u32(body.length + 8), str(type), body);
}

function fullBox(type, version, flags, ...payload) {
  return box(type, u8(version), u24(flags), ...payload);
}

function fixed16_16(n) {
  return u32(Math.round(n * 65536));
}

function fixed8_8(n) {
  return u16(Math.round(n * 256));
}

const ftyp = box("ftyp", str("mp42"), u32(0), str("mp42"), str("isom"), str("qt  "));

const mdatPayload = concat(...samples);
const mdat = box("mdat", mdatPayload);

function mvhd() {
  return fullBox(
    "mvhd",
    0,
    0,
    u32(0),
    u32(0),
    u32(timescale),
    u32(duration),
    fixed16_16(1),
    fixed8_8(1),
    zeros(10),
    u32(0x00010000),
    u32(0),
    u32(0),
    u32(0),
    u32(0x00010000),
    u32(0),
    u32(0),
    u32(0),
    u32(0x40000000),
    zeros(24),
    u32(2),
  );
}

function tkhd() {
  return fullBox(
    "tkhd",
    0,
    0x000007,
    u32(0),
    u32(0),
    u32(1),
    u32(0),
    u32(duration),
    zeros(8),
    u16(0),
    u16(0),
    fixed8_8(0),
    u16(0),
    u32(0x00010000),
    u32(0),
    u32(0),
    u32(0),
    u32(0x00010000),
    u32(0),
    u32(0),
    u32(0),
    u32(0x40000000),
    fixed16_16(width),
    fixed16_16(height),
  );
}

function mdhd() {
  return fullBox("mdhd", 0, 0, u32(0), u32(0), u32(timescale), u32(duration), u16(0x55c4), u16(0));
}

function hdlr() {
  return fullBox("hdlr", 0, 0, u32(0), str("vide"), zeros(12), Buffer.from("VideoHandler\0", "ascii"));
}

function vmhd() {
  return fullBox("vmhd", 0, 1, u16(0), u16(0), u16(0), u16(0));
}

function dinf() {
  const url = fullBox("url ", 0, 1);
  const dref = fullBox("dref", 0, 0, u32(1), url);
  return box("dinf", dref);
}

function jpegSampleEntry() {
  const name = Buffer.alloc(32);
  Buffer.from("JPEG slideshow", "ascii").copy(name, 1);
  name[0] = "JPEG slideshow".length;
  return concat(
    u32(86),
    str("jpeg"),
    zeros(6),
    u16(1),
    u16(0),
    u16(0),
    u32(0),
    u32(0),
    u32(0),
    u16(width),
    u16(height),
    fixed16_16(72),
    fixed16_16(72),
    u32(0),
    u16(1),
    name,
    u16(24),
    i16(-1),
  );
}

function stbl(chunkOffsets) {
  const stsd = fullBox("stsd", 0, 0, u32(1), jpegSampleEntry());
  const stts = fullBox("stts", 0, 0, u32(1), u32(samples.length), u32(sampleDuration));
  const stsc = fullBox("stsc", 0, 0, u32(1), u32(1), u32(1), u32(1));
  const stsz = fullBox("stsz", 0, 0, u32(0), u32(samples.length), ...samples.map((s) => u32(s.length)));
  const stco = fullBox("stco", 0, 0, u32(samples.length), ...chunkOffsets.map((o) => u32(o)));
  const stss = fullBox("stss", 0, 0, u32(samples.length), ...samples.map((_, i) => u32(i + 1)));
  return box("stbl", stsd, stts, stsc, stsz, stco, stss);
}

function moov(chunkOffsets) {
  const minf = box("minf", vmhd(), dinf(), stbl(chunkOffsets));
  const mdia = box("mdia", mdhd(), hdlr(), minf);
  const trak = box("trak", tkhd(), mdia);
  return box("moov", mvhd(), trak);
}

let offsets = [];
let cursor = ftyp.length + 8;
for (const sample of samples) {
  offsets.push(cursor);
  cursor += sample.length;
}

let movie = concat(ftyp, mdat, moov(offsets));
let finalMoov = moov(offsets);
movie = concat(ftyp, mdat, finalMoov);

const outPath = join(videoDir, "GoodBoys_TargetCustomerScouting.mp4");
writeFileSync(outPath, movie);
console.log(`Wrote ${outPath} (${movie.length} bytes)`);
