type FdicInstitution = {
  NAME: string;
  CITY?: string;
  STNAME?: string;
  WEBADDR?: string;
  ASSET?: number;
  OFFICES?: number;
  SPECGRP?: number;
  ID?: string;
};

type FdicResponse = {
  data?: Array<{ data: FdicInstitution }>;
};

function normalizeWebsite(value: string | undefined) {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

const endpoint = new URL("https://banks.data.fdic.gov/api/institutions");
endpoint.searchParams.set("filters", "ACTIVE:1 AND ASSET:[1000000 TO 25000000]");
endpoint.searchParams.set("fields", "NAME,CITY,STNAME,WEBADDR,ASSET,SPECGRP,OFFICES,ID");
endpoint.searchParams.set("sort_by", "ASSET");
endpoint.searchParams.set("sort_order", "DESC");
endpoint.searchParams.set("limit", "100");
endpoint.searchParams.set("format", "json");

const response = await fetch(endpoint);
if (!response.ok) {
  throw new Error(`FDIC API request failed: ${response.status} ${response.statusText}`);
}

const payload = (await response.json()) as FdicResponse;
const seedCompanies = (payload.data ?? []).map(({ data }) => ({
  name: data.NAME,
  website: normalizeWebsite(data.WEBADDR),
  notes: [
    "FDIC active institution seed for Zurich Challenge 3.",
    data.CITY && data.STNAME ? `Headquarters: ${data.CITY}, ${data.STNAME}.` : null,
    data.ASSET != null ? `Assets: $${Math.round(data.ASSET / 1000).toLocaleString()}M.` : null,
    data.OFFICES != null ? `Offices: ${data.OFFICES}.` : null,
    data.SPECGRP != null ? `FDIC specialty group: ${data.SPECGRP}.` : null,
    data.ID ? `FDIC certificate/ID: ${data.ID}.` : null,
  ]
    .filter(Boolean)
    .join(" "),
}));

const output = {
  generatedAt: new Date().toISOString(),
  source: endpoint.toString(),
  seedCompanies,
};

await Bun.write(".smithers/data/challenge3-fdic-seeds.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${seedCompanies.length} seed companies to .smithers/data/challenge3-fdic-seeds.json`);
