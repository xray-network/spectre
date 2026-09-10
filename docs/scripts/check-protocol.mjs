import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"

// Verify that a selective installation receives every rule it needs from the
// canonical source, without adding a second maintained runtime or publishing it.
const source = await readFile(new URL("../../protocol/v1.0.0/SPECTRE-PROTOCOL.md", import.meta.url), "utf8")
const version = /^Standard-Version: (\S+)$/m.exec(source)?.[1]
assert.equal(version, "1.0.0")
assert.match(source, /^Canonical-URL: https:\/\/wiki\.xraynetwork\.io\/spectre\/protocol\/v1\.0\.0\/SPECTRE-PROTOCOL\.md$/m)
assert.ok(!source.includes("\r"), "protocol must use LF line endings")

const names = ["core.md", "selectors.md", "references.md", "validation.md", ...[
  "help", "list", "status", "plan", "implement", "revise", "decide", "capture", "archive"
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
  ["core.md", "### Authorization, compound queues, and continuation"],
  ["selectors.md", "### Implementation batch selectors"],
  ["selectors.md", "### Decision batch selectors"],
  ["commands/implement.md", "### Sequential batch execution"],
  ["commands/decide.md", "### Decision workflow"],
  ["references.md", "### Pinned provider evidence"],
  ["references.md", "### Explicit development-layout adoption"],
  ["commands/capture.md", "### Publish a numbered incremental capture"],
  ["validation.md", "## 13. Validation invariants"]
]) assert.ok(runtime.get(name).includes(heading), `${name} is missing ${heading}`)
assert.ok(runtime.get("commands/help.md").includes("/spectre implement --batch <records>"))
assert.ok(runtime.get("commands/help.md").includes("queue multiple explicitly"))
assert.ok(runtime.get("commands/help.md").includes("bounded eligible record set"))
assert.ok(runtime.get("core.md").includes("non-decision operations in one natural-language request"))
assert.ok(runtime.get("core.md").includes("`accept`, `reject`, and `cancel` are never queue items"))
assert.ok(runtime.get("commands/decide.md").includes("one root\n`SPECTRE.md` ledger edit"))
assert.ok(runtime.get("commands/capture.md").includes("### Compound-queue provider preparation"))

const skill = /````markdown\n(---\nname: spectre\n[\s\S]+?)\n````/.exec(source)?.[1]
assert.ok(skill, "missing installable skill")
assert.ok(skill.includes("explicit natural-language operation queues"), "router must recognize compound queues")
assert.ok(skill.includes("direct continuations"), "router must recognize bounded continuation")
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
assert.ok(runtime.get("references.md").includes("The snapshot contains the complete resolved inventory"))
assert.ok(runtime.get("references.md").includes("a separate Git commit is not a protocol prerequisite"))
assert.ok(runtime.get("commands/capture.md").includes("stop without tracked writes for NO-CHANGE"))
assert.ok(runtime.get("validation.md").includes("No pin silently follows latest"))
assert.ok(source.includes(`Require all ${names.length} files.`), "runtime file count does not match extraction")
assert.ok(!source.includes("versions/vN/PROVIDER.md"), "no separate provider contract history")
console.log(`SPECTRE ${version}: ${names.length} runtime modules extract correctly; router, templates and workflow rule placement verified. SHA-256 ${hash}`)
