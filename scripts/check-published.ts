/** Fails when a just-published version is missing from npm or has no provenance attestation. */
const published = JSON.parse(process.argv[2] ?? "[]") as {
  name: string;
  version: string;
}[];

let failed = false;
for (const { name, version } of published) {
  const response = await fetch(
    `https://registry.npmjs.org/${name.replace("/", "%2f")}`,
  );
  const packument = (await response.json()) as {
    versions?: Record<string, { dist?: { attestations?: unknown } }>;
  };
  const dist = packument.versions?.[version]?.dist;
  const problem = !dist
    ? "not on the registry"
    : dist.attestations
      ? ""
      : "no provenance attestation";
  failed ||= problem !== "";
  console.log(`${problem ? "FAIL" : "ok  "} ${name}@${version} ${problem}`);
}
process.exit(failed ? 1 : 0);
