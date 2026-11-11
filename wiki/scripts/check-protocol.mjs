import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { verifyRelease } from "./verify-protocol.mjs"

// Verify that a selective installation receives every rule it needs from the canonical source,
// without adding a second maintained runtime or publishing it. Every release under protocol/ is
// checked; releases are immutable once published.
const protocolRoot = new URL("../../protocol/", import.meta.url)
const releases = (await readdir(protocolRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^v\d+\.\d+\.\d+$/.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
assert.ok(releases.length > 0, "no protocol releases found")

for (const release of releases) {
  const releaseRoot = new URL(`${release}/`, protocolRoot)
  const source = await readFile(new URL("SPECTRE-PROTOCOL.md", releaseRoot), "utf8")
  const { version, runtime, hash } = verifyRelease(source)
  assert.equal(`v${version}`, release, `${release} declares Standard-Version ${version}`)
  console.log(`SPECTRE ${version}: ${runtime.size} runtime modules, four templates, router and rule placement verified. SHA-256 ${hash}`)
}
