import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"

// Verify that a selective installation receives every rule it needs from the
// canonical source, without adding a second maintained runtime or publishing it.
// Every published release under protocol/ is checked; releases are immutable once published.
const protocolRoot = new URL("../../protocol/", import.meta.url)
const releases = (await readdir(protocolRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^v\d+\.\d+\.\d+$/.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.slice(1).split(".").map(Number).reduce((r, n, i) => r || n - b.slice(1).split(".").map(Number)[i], 0))
assert.ok(releases.length > 0, "no protocol releases found")

for (const release of releases) {
const source = await readFile(new URL(`${release}/SPECTRE-PROTOCOL.md`, protocolRoot), "utf8")
const version = /^Standard-Version: (\S+)$/m.exec(source)?.[1]
assert.equal(`v${version}`, release)
const major = Number(version.split(".")[0])
assert.ok(source.includes(`Canonical-URL: https://wiki.xraynetwork.io/spectre/protocol/${release}/SPECTRE-PROTOCOL.md\n`), `${release} must declare its canonical URL`)
assert.ok(!source.includes("\r"), "protocol must use LF line endings")

const names = ["core.md", "selectors.md", "references.md", "validation.md",
  ...(major >= 2 ? ["providers.md", "validation-full.md", "validation-evidence.md"] : []), ...[
  "help", "list", "status", ...(major >= 2 ? ["recall"] : []), "plan", "implement", "revise", "decide", "capture", "archive"
].map((name) => `commands/${name}.md`)]
const blocks = new Map(names.map((name) => [name, []]))
let active
let start
let markerCount = 0
for (const match of source.matchAll(/<!-- (spectre:runtime ([^>\n]+)|\/spectre:runtime) -->/g)) {
  markerCount += 1
  if (match[2] !== undefined) {
    assert.equal(active, undefined, "runtime blocks must not nest")
    active = match[2].trim().split(/\s+/)
    assert.equal(new Set(active).size, active.length, "duplicate runtime destination")
    for (const name of active) assert.ok(blocks.has(name), `unknown runtime destination: ${name}`)
    start = match.index + match[0].length
  } else {
    assert.ok(active, "runtime end without start")
    const body = source.slice(start, match.index).replace(/^\n+|\n+$/g, "")
    assert.ok(body.trim(), "empty runtime block")
    for (const name of active) blocks.get(name).push(body)
    active = undefined
  }
}
assert.equal(active, undefined, "unclosed runtime block")
assert.equal(markerCount, (source.match(/<!--\s*\/?spectre:runtime\b/g) ?? []).length, "malformed runtime marker")
const hash = createHash("sha256").update(source).digest("hex")
const runtime = new Map()
for (const [name, bodies] of blocks) {
  assert.ok(bodies.length > 0, `missing runtime module: ${name}`)
  runtime.set(name, `<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->\nRuntime-Version: ${version}\nSource-SHA256: ${hash}\n\n${bodies.join("\n\n")}\n`)
}

// These dependencies must remain inside the modules loaded by the router.
for (const [name, heading] of [
  ["core.md", "### Authorization and explicit activation"],
  ["selectors.md", "### Implementation batch selectors"],
  ["selectors.md", "### Decision batch selectors"],
  ["commands/implement.md", "### Sequential batch execution"],
  ["commands/decide.md", "### Decision workflow"],
  [major >= 2 ? "providers.md" : "references.md", "### Pinned provider evidence"],
  ...(major >= 2 ? [["providers.md", "### Captures from earlier versions"]] : [["references.md", "### Explicit development-layout adoption"]]),
  ["commands/capture.md", "### Publish a numbered incremental capture"],
  ["validation.md", "## 13. Validation invariants"]
]) assert.ok(runtime.get(name).includes(heading), `${name} is missing ${heading}`)
assert.ok(runtime.get("commands/help.md").includes("/spectre implement --batch <records>"))
assert.match(runtime.get("commands/help.md"), /multiple\s+explicitly stated non-decision operations/)
assert.match(runtime.get("commands/help.md"), /bounded eligible\s+record set/)
assert.match(runtime.get("core.md"), /non-decision operations in one natural-language request/)
assert.ok(runtime.get("core.md").includes("contains the standalone word `spectre`"), "core must require an explicit SPECTRE mention")
assert.ok(runtime.get("core.md").includes("mention may appear\nanywhere in the message"), "natural-language mentions must work anywhere")
assert.ok(runtime.get("core.md").includes("Every message must independently contain that mention"), "activation must be per message")
assert.ok(runtime.get("core.md").includes("A continuation that omits SPECTRE never resumes it"), "implicit queue continuation must stay inactive")
assert.ok(runtime.get("core.md").includes("An implementation request that omits SPECTRE never activates it"), "implicit implementation batches must stay inactive")
assert.ok(runtime.get("core.md").includes("`accept`, `reject`, and `cancel` are never queue items"))
assert.ok(runtime.get("commands/decide.md").includes("one root\n`SPECTRE.md` ledger edit"))
assert.ok(runtime.get("commands/capture.md").includes("### Compound-queue provider preparation"))
assert.match(runtime.get("commands/help.md"), /Refine a `PLANNED` instruction/)
assert.match(runtime.get("commands/revise.md"), /active `PLANNED` or `REVIEW` row/)
assert.match(runtime.get("commands/revise.md"), /For `PLANNED`:/)
assert.match(runtime.get("commands/revise.md"), /Do not modify product source or tests/)
assert.match(runtime.get("commands/revise.md"), /For `REVIEW`:/)

const skill = /````markdown\n(---\nname: spectre\n[\s\S]+?)\n````/.exec(source)?.[1]
assert.ok(skill, "missing installable skill")
assert.ok(skill.includes("mentions SPECTRE by standalone name, command, or host-native sigil"), "router must recognize explicit SPECTRE mentions")
assert.ok(skill.includes("natural-language mention anywhere in the message"), "router must accept natural-language mention placement")
assert.ok(skill.includes("Every message must activate independently"), "router activation must be per message")
assert.ok(skill.includes("do not replace the required mention"), "router must reject implicit contextual activation")
assert.ok(skill.includes("core.md") && skill.includes("selectors.md"), "router must load authorization and scope rules")
for (const template of ["IMPL", "STATUS", "PROVIDER"]) {
  assert.equal(source.split(`### \`.agents/spectre/templates/TEMPLATE_${template}.md\``).length - 1, 1,
    `missing or duplicated ${template} template`)
}
const providerTemplate = /### `\.agents\/spectre\/templates\/TEMPLATE_PROVIDER\.md`\n\n````markdown\n([\s\S]+?)\n````/.exec(source)?.[1]
assert.ok(providerTemplate, "missing provider template body")
assert.ok(!/^Provider-Version:/m.test(providerTemplate), "provider templates must not version providers")
assert.ok(providerTemplate.includes("## Complete capture specification"), "capture must own its complete rules")
assert.match(providerTemplate, /^Provider-Capture-Version: v1$/m)
assert.match(providerTemplate, /^Provider-Snapshot-Version: v1$/m)
assert.match(providerTemplate, /^Snapshot: <NNNN>$/m)
assert.ok(providerTemplate.includes("### Complete resolved artifact inventory"), "snapshots must describe all effective artifacts")
assert.ok(providerTemplate.includes("## Capture summary"), "summary must be separate from specification")
const [snapshotSection, summarySection] = providerTemplate.split("## Capture summary")
assert.match(snapshotSection, /^Provider-Snapshot-Version: v1$/m)
assert.match(summarySection, /^Provider-Capture-Version: v1$/m)
assert.ok(!summarySection.includes("### Complete resolved artifact inventory"), "summary must not own the inventory")
assert.ok(providerTemplate.includes("Capture-Summary-SHA256:"), "snapshot must bind its summary")
assert.ok(providerTemplate.includes("An unchanged logical artifact must reference"), "unchanged bytes must be reused")
assert.ok(providerTemplate.includes("zero new artifact"), "removal-only updates must not force artifact copies")
assert.ok(runtime.get("commands/help.md").includes("/spectre capture <provider>"))
assert.ok(runtime.get("commands/capture.md").includes("### Discovery and comparison"))
assert.ok(runtime.get("commands/capture.md").includes("Discovery and publication are one authorized operation"))
assert.ok(!/\/spectre (?:check|validate)\b/.test(source), "removed operations must not remain in the public API")
assert.ok(!/\| (?:check|validate) \|/.test(skill), "router must not expose removed operations")
assert.ok(runtime.get("validation.md").includes("Validation is an internal requirement, not a public operation"))
for (const name of ["plan", "implement", "revise", "accept / reject / cancel", "capture", "archive"]) {
  const row = skill.split("\n").find((line) => line.startsWith(`| ${name} |`))
  assert.ok(row?.includes("validation.md"), `${name} must load automatic validation`)
}
for (const name of ["plan", "implement", "revise"]) {
  assert.ok(runtime.get(`commands/${name}.md`).includes("A provider input names an immutable numbered snapshot"), `${name} lacks pin contract`)
  assert.match(skill, new RegExp(`\\| ${name} \\|[^\\n]+references\\.md`), `${name} must load pin resolution`)
}
assert.ok(runtime.get("commands/plan.md").includes("incomplete captures or missing inherited artifacts block"))
const pins = major >= 2 ? "providers.md" : "references.md"
assert.ok(runtime.get(pins).includes("The snapshot contains the complete resolved inventory"))
assert.ok(runtime.get(pins).includes("a separate Git commit is not a protocol prerequisite"))
assert.ok(runtime.get("commands/capture.md").includes("stop without tracked writes for NO-CHANGE"))
assert.ok(runtime.get(major >= 2 ? "validation-evidence.md" : "validation.md").includes("No pin silently follows latest"))
assert.ok(source.includes(`Require all ${names.length} files.`), "runtime file count does not match extraction")
assert.ok(!source.includes("versions/vN/PROVIDER.md"), "no separate provider contract history")
if (major >= 2) {
  // 2.0.0 rules: forced archive, installation boundary, migrations, capture-first planning,
  // canonical tables, checklist validation, host adapters, and the upgrade procedure.
  assert.ok(runtime.get("commands/help.md").includes("/spectre archive [target] --force: <reason>"), "help must list forced archive")
  assert.ok(runtime.get("core.md").includes("A forced archive closes open records as `CANCELLED`, so it is a decision too"), "forced archive must stay out of queues")
  assert.ok(runtime.get("core.md").includes("### Shared runtime checks") && runtime.get("core.md").includes("installation boundary (§3)"), "every write must check the boundary")
  assert.ok(runtime.get("references.md").includes("### Installation boundary"), "references must define the installation boundary")
  assert.ok(runtime.get("references.md").includes("### Immovable evidence and migrations"), "references must define migrations")
  assert.ok(runtime.get("providers.md").includes("which is always\n`SELF`"), "provider pins must be SELF only")
  assert.ok(runtime.get("commands/plan.md").includes("2. Capture first."), "planning must capture first")
  assert.ok(runtime.get("commands/capture.md").includes("a standalone capture is never a planning\nprerequisite"), "standalone capture must be tracking only")
  assert.ok(runtime.get("commands/decide.md").includes("is the only way a `REVIEW` row becomes `CANCELLED`"), "only forced archive cancels REVIEW")
  assert.ok(runtime.get("commands/decide.md").includes("A set of two or more records requires a human-written proof or reason"), "batch decisions need written proof")
  assert.ok(runtime.get("commands/archive.md").includes("Archive-Version: v2") && runtime.get("commands/archive.md").includes("## Known issues"), "manifests must be v2 with known issues")
  assert.ok(runtime.get("validation-full.md").includes("30. Version: a manifest is governed by its own"), "old archives must be checked by hash only")
  assert.ok(runtime.get("validation-full.md").includes("1. Runtime: all 17 modules"), "full validation must count every module")
  assert.ok(runtime.get("validation-evidence.md").includes("20. Pins:") && !runtime.get("validation.md").includes("20. Pins:"), "evidence checks must live in their own module")
  assert.ok(!runtime.get("validation.md").includes("1. Runtime:") && !runtime.get("references.md").includes("### Pinned provider evidence"), "split modules must not duplicate rules")
  for (const row of ["| capture |", "| plan |", "| implement |", "| revise |"]) {
    assert.ok(skill.split("\n").find((line) => line.startsWith(row))?.includes("validation-evidence.md"), `${row} must load evidence checks`)
  }
  assert.ok(skill.split("\n").find((line) => line.startsWith("| archive |"))?.includes("validation-full.md"), "archive must load full validation")
  assert.ok(!skill.split("\n").find((line) => line.startsWith("| accept / reject / cancel |"))?.includes("validation-full.md"), "decisions must not load full validation")
  assert.ok(runtime.get("validation.md").includes("16. Boundary:"), "validation must check the boundary")
  assert.ok(source.includes("### Optional host adapters"), "install must define host adapters")
  assert.ok(source.includes("### Upgrade procedure"), "versioning must define upgrades")
  assert.ok(source.includes("Canonical table format, for this ledger and every archive manifest table:"), "templates must define the canonical table format")
  assert.ok(skill.includes("Never place accept, reject, cancel, or a forced archive in a compound queue"), "router must keep forced archive out of queues")
  assert.ok(runtime.get("commands/recall.md").includes("### Recall"), "recall must have its own module")
  assert.ok(runtime.get("commands/recall.md").includes("It is read-only"), "recall must stay read-only")
  assert.ok(runtime.get("commands/help.md").includes("/spectre recall [target]: <question>"), "help must list recall")
  assert.match(skill, /\| recall \| runtime\/commands\/recall\.md \|[^\n]+references\.md/, "router must load recall with reference resolution")
}
console.log(`SPECTRE ${version}: ${names.length} runtime modules extract correctly; router, templates and workflow rule placement verified. SHA-256 ${hash}`)
}
