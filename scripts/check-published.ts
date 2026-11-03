import { readdirSync, readFileSync } from "node:fs";

/**
 * Fails when a package version is missing from npm or has no provenance attestation.
 * Checks the current version of every public workspace package: the changesets action's
 * `published` output stays false with this CLI, so it cannot gate the check.
 */
const packages = readdirSync("packages").flatMap((dir) => {
  const manifest = JSON.parse(
    readFileSync(`packages/${dir}/package.json`, "utf8"),
  ) as { name: string; version: string; private?: boolean };
  return manifest.private ? [] : [manifest];
});

interface Packument {
  versions?: Record<string, { dist?: { attestations?: unknown } }>;
}

const check = async ({ name, version }: { name: string; version: string }) => {
  const response = await fetch(
    `https://registry.npmjs.org/${name.replace("/", "%2f")}`,
    { headers: { "cache-control": "no-cache" } },
  );
  const dist = ((await response.json()) as Packument).versions?.[version]?.dist;
  if (!dist) return "not on the registry";
  return dist.attestations ? "" : "no provenance attestation";
};

let failed = false;
for (const pkg of packages) {
  let problem = await check(pkg);
  // The registry can lag a few seconds behind a fresh publish.
  for (let retry = 0; problem && retry < 3; retry++) {
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    problem = await check(pkg);
  }
  failed ||= problem !== "";
  console.log(
    `${problem ? "FAIL" : "ok  "} ${pkg.name}@${pkg.version} ${problem}`,
  );
}
process.exit(failed ? 1 : 0);
