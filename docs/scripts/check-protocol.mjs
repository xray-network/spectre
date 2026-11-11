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
const [major, minor] = version.split(".").map(Number)
const atLeast = (ma, mi) => major > ma || (major === ma && minor >= mi)
assert.ok(source.includes(`Canonical-URL: https://wiki.xraynetwork.io/spectre/protocol/${release}/SPECTRE-PROTOCOL.md\n`), `${release} must declare its canonical URL`)
assert.ok(!source.includes("\r"), "protocol must use LF line endings")

const names = ["core.md", "selectors.md", "references.md", "validation.md",
  ...(major >= 2 ? ["providers.md", "validation-full.md", "validation-evidence.md"] : []), ...[
  "help", "list", "status", ...(major >= 2 ? ["recall"] : []), "plan", "implement", "revise", "decide", ...(atLeast(2, 1) ? ["override"] : []), "capture", "archive",
  ...(atLeast(2, 3) ? ["slash"] : [])
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

// From 2.3.0 the router is the plain file .agents/spectre/ROUTER.md instead of a skill.
const skill = (atLeast(2, 3)
  ? /````markdown\n(# SPECTRE command router\n[\s\S]+?)\n````/
  : /````markdown\n(---\nname: spectre\n[\s\S]+?)\n````/).exec(source)?.[1]
assert.ok(skill, "missing installable router")
assert.ok(skill.includes(atLeast(2, 3) ? "mentions by\nstandalone name, command, or host-native sigil" : "mentions SPECTRE by standalone name, command, or host-native sigil"), "router must recognize explicit SPECTRE mentions")
assert.ok(skill.includes("natural-language mention anywhere in the message"), "router must accept natural-language mention placement")
assert.ok(skill.includes("Every message must activate independently"), "router activation must be per message")
assert.ok(skill.includes("do not replace the required mention"), "router must reject implicit contextual activation")
assert.ok(skill.includes("core.md") && skill.includes("selectors.md"), "router must load authorization and scope rules")
// From 2.3.0 the templates live under runtime/modules/templates/.
const templateDir = atLeast(2, 3) ? ".agents/spectre/runtime/modules/templates" : ".agents/spectre/templates"
for (const template of ["IMPL", "STATUS", "PROVIDER"]) {
  assert.equal(source.split(`### \`${templateDir}/TEMPLATE_${template}.md\``).length - 1, 1,
    `missing or duplicated ${template} template`)
}
const providerTemplate = new RegExp("### `" + templateDir.replace(/[./]/g, "\\$&") + "/TEMPLATE_PROVIDER\\.md`\\n\\n````markdown\\n([\\s\\S]+?)\\n````").exec(source)?.[1]
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
  assert.ok(runtime.get("commands/help.md").includes(atLeast(2, 3) ? "/spectre archive implementations [target] --force: <reason>" : "/spectre archive [target] --force: <reason>"), "help must list forced archive")
  assert.ok(runtime.get("core.md").includes(atLeast(2, 3) ? "A forced archive closes open records as `CANCELLED` or archives despite existing defects, and an\noverride changes SPECTRE files outside" : atLeast(2, 1) ? "A forced archive closes open records as `CANCELLED`, and an override changes SPECTRE files outside" : "A forced archive closes open records as `CANCELLED`, so it is a decision too"), "forced archive must stay out of queues")
  assert.ok(runtime.get("core.md").includes("### Shared runtime checks") && runtime.get("core.md").includes("installation boundary (§3)"), "every write must check the boundary")
  assert.ok(runtime.get("references.md").includes("### Installation boundary"), "references must define the installation boundary")
  assert.ok(runtime.get("references.md").includes(atLeast(2, 3) ? "### Immovable evidence" : "### Immovable evidence and migrations"), "references must define immovable evidence")
  assert.ok(runtime.get("providers.md").includes("which is always\n`SELF`"), "provider pins must be SELF only")
  assert.ok(runtime.get("commands/plan.md").includes("2. Capture first."), "planning must capture first")
  assert.ok(runtime.get("commands/capture.md").includes("a standalone capture is never a planning\nprerequisite"), "standalone capture must be tracking only")
  assert.ok(runtime.get("commands/decide.md").includes("is the only way a `REVIEW` row becomes `CANCELLED`"), "only forced archive cancels REVIEW")
  assert.ok(runtime.get("commands/decide.md").includes("A set of two or more records requires a human-written proof or reason"), "batch decisions need written proof")
  assert.ok(runtime.get("commands/archive.md").includes("Archive-Version: v2") && runtime.get("commands/archive.md").includes("## Known issues"), "manifests must be v2 with known issues")
  assert.ok(runtime.get("validation-full.md").includes(atLeast(2, 3) ? "30. Version: every manifest, whatever its" : "30. Version: a manifest is governed by its own"), "old archives must not be re-judged")
  assert.ok(runtime.get("validation-full.md").includes(`1. Runtime: all ${names.length} modules`), "full validation must count every module")
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
  assert.ok(skill.includes(atLeast(2, 3) ? "Never place accept, reject, cancel, a forced archive, an override, addslash,\nor removeslash in a compound queue" : atLeast(2, 1) ? "Never place accept, reject, cancel, a forced archive, or an override in a compound queue" : "Never place accept, reject, cancel, or a forced archive in a compound queue"), "router must keep decisions out of queues")
  assert.ok(runtime.get("commands/recall.md").includes("### Recall"), "recall must have its own module")
  assert.ok(runtime.get("commands/recall.md").includes("It is read-only"), "recall must stay read-only")
  assert.ok(runtime.get("commands/help.md").includes("/spectre recall [target]: <question>"), "help must list recall")
  assert.match(skill, /\| recall \| runtime\/(?:modules\/)?commands\/recall\.md \|[^\n]+references\.md/, "router must load recall with reference resolution")
}
if (atLeast(2, 1)) {
  // 2.1.0: override, a human-only decision that changes SPECTRE files outside the normal rules.
  assert.ok(runtime.get("commands/override.md").includes("### Override workflow"), "override must have its own module")
  assert.ok(runtime.get("commands/override.md").includes("never an agent on its own initiative"), "override must stay human-only")
  assert.ok(runtime.get("commands/override.md").includes("# SPECTRE overrides"), "override must log to OVERRIDES.md")
  assert.ok(runtime.get("commands/override.md").includes("An override never bypasses these rules"), "override must keep safety rules")
  assert.ok(runtime.get("commands/help.md").includes("/spectre override <scope>: <changes> because <reason>"), "help must list override")
  assert.ok(runtime.get("core.md").includes("neither is ever a queue item"), "override must stay out of queues")
  if (!atLeast(2, 3)) {
    assert.ok(runtime.get("references.md").includes("`OVERRIDES.md`, resolve it to that row's File after"), "resolution must follow the override log")
    assert.ok(runtime.get("validation.md").includes("37. Overrides:"), "validation must check the override log")
  }
  assert.match(skill, /\| override \| runtime\/(?:modules\/)?commands\/override\.md \|[^\n]+validation\.md/, "router must load override with validation")
}
if (atLeast(2, 3)) {
  // 2.3.0: the router leaves .agents/skills/, installation registers no slash command, and
  // addslash/removeslash manage host adapters without writing any SPECTRE state.
  const slash = runtime.get("commands/slash.md")
  assert.ok(slash.includes("### Optional host adapters"), "slash commands must have their own module")
  assert.match(source, /Install the following as `\.agents\/spectre\/ROUTER\.md`/, "router must install as ROUTER.md")
  assert.ok(!/^---\nname: spectre$/m.test(skill), "router must not be a skill")
  assert.ok(source.includes("Then follow `.agents/spectre/ROUTER.md`"), "AGENTS.md pointer must lead to ROUTER.md")
  assert.ok(source.includes("6. Create no slash command or host adapter"), "installation must not add slash commands")
  assert.ok(runtime.get("commands/help.md").includes("/spectre addslash <host> [<host>...]"), "help must list addslash")
  assert.ok(runtime.get("commands/help.md").includes("/spectre removeslash <host> [<host>...]"), "help must list removeslash")
  assert.match(skill, /\| addslash \/ removeslash \| runtime\/modules\/commands\/slash\.md \| None \|/, "router must load the slash module")
  for (const host of ["codex", "antigravity", "claude", "cursor", "copilot", "gemini", "opencode", "windsurf"]) {
    assert.match(slash, new RegExp(`^\\| \`${host}\` \\|`, "m"), `slash table must list ${host}`)
  }
  assert.ok(slash.includes("Follow .agents/spectre/ROUTER.md for this SPECTRE request."), "adapters must point to ROUTER.md")
  assert.ok(slash.includes("The adapter file is the only state."), "slash commands must keep no SPECTRE state")
  assert.ok(slash.includes("reload or restart that agent"), "slash commands must tell the human to reload the agent")
  assert.ok(runtime.get("core.md").includes("`addslash` and `removeslash` change only agent-host command files"), "slash commands must stay out of queues")
  assert.ok(runtime.get("validation-full.md").includes("6. Host adapters: none is required."), "validation must not require adapters")
  assert.ok(runtime.get("validation-full.md").includes("exactly one router exists at `.agents/spectre/ROUTER.md`"), "validation must check ROUTER.md")
  assert.ok(!/\.agents\/skills\/spectre\/SKILL\.md` from the router/.test(source), "installation must not write the router as a skill")
  // 2.3.0: the override log is informational, lives in logs/, and nothing depends on it.
  const override = runtime.get("commands/override.md")
  assert.ok(override.includes("`.agents/spectre/logs/OVERRIDES.md`"), "override must log under logs/")
  assert.ok(override.includes("no log excuses a check"), "overrides must update dependents instead of relying on the log")
  assert.ok(override.includes("a human may edit, trim, or delete `logs/` at any time"), "logs must be wipeable")
  assert.ok(!runtime.get("references.md").includes("OVERRIDES"), "resolution must not read the override log")
  assert.ok(!runtime.get("validation.md").includes("OVERRIDES"), "validation must not read the override log")
  assert.ok(runtime.get("validation.md").includes("37. Logs: when `.agents/spectre/logs/` exists, it holds a `.gitignore` whose single line is `*`"), "validation must ignore logs and require them ignored by Git")
  assert.ok(override.includes("When `logs/` is absent, create it with a `.gitignore` whose single line is `*`"), "the first override must keep logs out of Git")
  assert.ok(source.includes("When `logs/` exists, give it a `.gitignore` whose single line is `*`"), "upgrade must keep logs out of Git")
  assert.ok(!source.includes("`.agents/spectre/.gitignore`"), "no top-level .gitignore")
  assert.ok(runtime.get("validation-full.md").includes("`ROUTER.md` is the\n   only file at the top of `.agents/spectre/`."), "ROUTER.md must be the only top-level file")
  assert.ok(override.includes("propose a\n   commit message"), "override must carry its reason into a commit message")
  assert.ok(!source.includes("MIGRATIONS"), "2.3.0 has no migrations; overrides move evidence")
  // 2.3.0: archives are history kept as is; nothing in them is validated beyond manifest rows.
  assert.ok(runtime.get("references.md").includes("### Archives are kept as is"), "references must define archives as is")
  assert.ok(runtime.get("validation-full.md").includes("31. As is: archived files, Record paths entries, links, paths, and recorded SHA-256 values are not\n    validated."), "validation must not check archived bytes or links")
  assert.ok(runtime.get("validation.md").includes("16. Boundary: every reference in an active record, the ledger, or a provider file"), "boundary checks must skip archives")
  assert.ok(!runtime.get("validation.md").includes("archived result hashes match their manifest"), "dependencies must not check archived hashes")
  assert.ok(runtime.get("commands/status.md").includes("archives are kept as is"), "status must report archive defects as information")
  assert.ok(runtime.get("commands/override.md").includes("Archives are kept as is and need no update."), "overrides must not have to update archives")
  // 2.3.0: archive names its kind; whole providers that no active record references may be archived.
  const archive = runtime.get("commands/archive.md")
  for (const form of ["/spectre archive implementations [target] [--force: <reason>]", "/spectre archive providers <provider> [<provider>...] [--force: <reason>]", "#### Implementations archive", "#### Provider archive", "Kind: implementations", "Kind: providers", "## Archived providers"]) assert.ok(archive.includes(form), `archive module lacks ${form}`)
  assert.ok(archive.includes("Bare `/spectre archive` is the short form of\n`/spectre archive implementations` for all targets and accepts no target or flag."), "bare archive must mean all implementations")
  assert.ok(archive.includes("`--force` never removes this\nrefusal."), "provider force must not bypass active references")
  assert.ok(archive.includes("Never archive part of a\nprovider"), "providers are archived whole")
  assert.ok(archive.includes("Report every match as a warning"), "provider archive must warn about outside readers")
  assert.ok(runtime.get("commands/help.md").includes("| `/spectre archive providers <provider> [<provider>...] [--force: <reason>]` |"), "help must list provider archive")
  assert.ok(runtime.get("selectors.md").includes("Provider archive has no `all` form"), "selectors must refuse all providers")
  assert.ok(source.includes("`implementations` and `providers` are reserved archive kinds"), "archive kinds must be reserved target names")
  assert.ok(runtime.get("references.md").includes("resolve\n   it to the same suffix under that batch's `providers/<provider>/`"), "archived provider paths must resolve")
  assert.ok(runtime.get("commands/capture.md").includes("archived captures are never predecessors or artifact owners"), "captures must not build on archived captures")
  assert.ok(runtime.get("validation-full.md").includes("A batch holds implementations or providers, never both."), "batches hold one kind")
  assert.ok(!runtime.get("validation-full.md").includes("Archiving modifies neither provider captures nor source."), "old provider-archive ban must be gone")
  // 2.3.0 layout: ROUTER.md is the only top-level file; protocol and templates live in runtime/.
  assert.ok(source.includes("curl -fsSLo .agents/spectre/runtime/SPECTRE-PROTOCOL.md"), "manual download must target runtime/")
  assert.ok(skill.includes("contains\n`.agents/spectre/ROUTER.md`"), "the router must find installations by ROUTER.md")
  assert.ok(skill.includes("Require `.agents/spectre/runtime/SPECTRE-PROTOCOL.md`"), "the router must read the protocol from runtime/")
  assert.ok(source.includes("## 10. No installation README"), "no README is installed")
  for (const old of ["`.agents/spectre/SPECTRE-PROTOCOL.md`", "`.agents/spectre/templates/`"]) {
    assert.equal(source.split(old).length - 1, 1, `${old} may appear only in the runtime/ redirect rule`)
  }
  assert.ok(runtime.get("references.md").includes("resolve it to `.agents/spectre/runtime/SPECTRE-PROTOCOL.md` or the\n   same template under `.agents/spectre/runtime/modules/templates/`"), "old protocol and template links must redirect to runtime/")
  // runtime/ holds only the protocol and modules/; every generated file lives under modules/.
  assert.ok(source.includes("The only destinations, relative to `.agents/spectre/runtime/modules/`, are"), "modules must extract into runtime/modules/")
  assert.ok(skill.includes("Bare runtime names above are under `runtime/modules/`; TEMPLATE names are under `runtime/modules/templates/`."), "router must read modules from runtime/modules/")
  for (const line of skill.split("\n").filter((l) => /^\| [a-z]/.test(l) && l.includes("commands/"))) assert.ok(line.includes("| runtime/modules/commands/"), `router row must use runtime/modules/: ${line}`)
  assert.ok(!/runtime\/(core|selectors|references|providers|validation[a-z-]*)\.md|runtime\/commands\/|runtime\/templates\//.test(source), "no path may skip runtime/modules/")
  assert.ok(runtime.get("validation-full.md").includes("`runtime/` holds only the installed protocol and\n   `modules/`"), "check 2 must keep runtime/ to the protocol and modules/")
  assert.ok(runtime.get("references.md").includes("Any other move or rename is\na human-ordered `/spectre override` (§9)."), "evidence moves must go through archive or overrides")
  assert.ok(runtime.get("validation.md").includes("19. Moves:"), "validation must check moved files by their real paths")
  assert.ok(source.includes("Move an existing\n   `.agents/spectre/OVERRIDES.md` unchanged to `.agents/spectre/logs/OVERRIDES.md`"), "upgrade must move the override log")
}
console.log(`SPECTRE ${version}: ${names.length} runtime modules extract correctly; router, templates and workflow rule placement verified. SHA-256 ${hash}`)
}
