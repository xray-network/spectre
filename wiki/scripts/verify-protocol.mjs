import assert from "node:assert/strict"
import { createHash } from "node:crypto"

export const moduleNames = [
  "core.md", "queues.md", "selectors.md", "references.md", "history.md", "providers.md", "publication.md",
  "validation.md", "validation-full.md", "validation-evidence.md",
  ...["help", "status", "recall", "plan", "implement", "revise", "decide", "override", "capture",
    "archive", "host", "check", "sync", "target", "upgrade"]
    .map(name => `commands/${name}.md`)
]
const templateNames = ["STATUS", "TARGETS", "IMPL", "PROVIDER"]

// Split one canonical table row (§11): cells are separated by " | "; a literal pipe inside a
// cell is written \| and therefore never matches the separator.
export function splitRow(line) {
  assert.ok(line.startsWith("| ") && line.endsWith(" |"), `noncanonical table line: ${line}`)
  const cells = line.slice(2, -2).split(" | ")
  for (const cell of cells) {
    assert.ok(!/(^|[^\\])\|/.test(cell), `raw pipe inside table cell: ${line}`)
  }
  return cells.map(cell => cell.replaceAll("\\|", "|"))
}

// Extraction validates the complete marker grammar before any generated file is usable.
// This is release validation, not an execution harness or an alternative lifecycle store.
export function extractRelease(source) {
  assert.ok(!source.includes("\r"), "protocol must use LF line endings")
  const version = /^Standard-Version: (\d+\.\d+\.\d+)$/m.exec(source)?.[1]
  assert.ok(version, "missing Standard-Version")
  assert.match(source, /^Standard-ID: xray\/spectre$/m)
  assert.ok(source.includes(`Canonical-URL: https://wiki.xraynetwork.io/spectre/protocol/v${version}/SPECTRE-PROTOCOL.md\n`), "canonical version mismatch")
  const blocks = new Map(moduleNames.map(name => [name, []]))
  let active, start, markerCount = 0
  for (const match of source.matchAll(/<!-- (spectre:runtime ([^>\n]+)|\/spectre:runtime) -->/g)) {
    markerCount++
    if (match[2] !== undefined) {
      assert.equal(active, undefined, "nested runtime marker")
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
  assert.equal(active, undefined, "unclosed runtime marker")
  assert.equal(markerCount, (source.match(/<!--\s*\/?spectre:runtime\b/g) ?? []).length, "malformed runtime marker")
  const hash = createHash("sha256").update(source).digest("hex")
  const runtime = new Map([...blocks].map(([name, bodies]) => {
    assert.ok(bodies.length, `missing runtime module: ${name}`)
    return [name, `<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->\nRuntime-Version: ${version}\nSource-SHA256: ${hash}\n\n${bodies.join("\n\n")}\n`]
  }))
  const templates = new Map()
  for (const name of templateNames) {
    const heading = `### \`.agents/spectre/runtime/modules/templates/TEMPLATE_${name}.md\``
    assert.equal(source.split(heading).length - 1, 1, `missing/duplicate ${name} template`)
    const rest = source.slice(source.indexOf(heading) + heading.length)
    const body = /^\n\n````markdown\n([\s\S]+?)\n````/.exec(rest)?.[1]
    assert.ok(body, `missing ${name} template body`)
    templates.set(`templates/TEMPLATE_${name}.md`, `${body}\n`)
  }
  const routers = [...source.matchAll(/````markdown\n(# SPECTRE command router\n[\s\S]+?)\n````/g)]
  assert.equal(routers.length, 1, "require exactly one installable router")
  const pointerSection = source.split("### Required `AGENTS.md` pointer\n")[1]?.split("### Required bootstrap installation record")[0]
  const pointer = /```markdown\n([\s\S]+?)\n```/.exec(pointerSection ?? "")?.[1]
  assert.ok(pointer, "missing installable AGENTS pointer")
  return { version, hash, runtime, templates, router: `${routers[0][1]}\n`, pointer: `${pointer}\n` }
}

export function verifyRelease(source) {
  const result = extractRelease(source)
  const { version, runtime, templates, router, pointer } = result
  const requireText = (body, text, label) => assert.ok(body.includes(text), `${label} lacks ${text}`)
  assert.ok(source.includes(`Require all ${moduleNames.length} files.`), "wrong extraction file count")
  assert.ok(runtime.get("validation-full.md").includes(`all ${moduleNames.length} modules`), "wrong validation module count")

  const requirements = new Map([
    ["core.md", ["### Authorization and explicit activation", "### Shared runtime checks",
      "is not a mention", "follows queues.md", "## 7. Lifecycle and permissions", "commands/decide.md"]],
    ["queues.md", ["### Natural-language operation queues", "### Human checkpoints and bounded replies",
      "### Stop and resume", "future results", "unqualified \"yes\" never decides", "result digests",
      "unrelated intervening human task", "without repeating SPECTRE", "never a lifecycle state or a second ledger"]],
    ["selectors.md", ["### Implementation batch selectors", "### Decision batch selectors",
      "### Archive record-set selectors", "never gets", "never expand or silently", "commands/decide.md",
      "`api/0004@3f9a1c0b7d2e`, alone or in a comma-separated list"]],
    ["references.md", ["### Installation boundary", "### Target identity and current paths",
      "### Current inputs and historical source locations"]],
    ["history.md", ["### Immovable evidence", "### Archives are kept as is", "### Resolving archived records and references",
      "missing/corrupt/changed evidence", "original repository location"]],
    ["publication.md", ["### Publication order", "### Interrupted writes", "### Parallel branches",
      "commit point", "reread it", "Create new files only at paths that do not exist",
      "Safe sync removes the unpublished batch", "Repeat the same explicit install or upgrade",
      "the write after which its change counts as published", "Revise again; it reconciles the row",
      "explicit `/spectre override`"]],
    ["commands/plan.md", ["## 4. Repository discovery", "2. Capture first.", "highest instruction, result, or ledger ID",
      "Register\n   the resolved target if first used", "Target-Path", "incomplete captures or missing inherited artifacts block",
      "an interrupted plan", "Add the matching PLANNED row last"]],
    ["commands/implement.md", ["### Declared source relocation", "registry Path", "### Sequential batch execution", "partial result", "leave the row `PLANNED`",
      "required validation", "reconcile", "the `REVIEW` row last", "repository guidance"]],
    ["commands/revise.md", ["### Declared source relocation", "For `PLANNED`:", "Do not modify product source or tests", "For `REVIEW`:",
      "the ledger row\n     last (publication.md)"]],
    ["commands/decide.md", ["### Decision workflow", "Cancel", "REVIEW", "result digest", "first 12 lowercase hexadecimal",
      "<source> on <date>; reviewed <id>@<digest>, <id>@<digest>.", "| `Human command \"<verbatim request>\"` |",
      "| `Human reply \"<verbatim reply>\"` |", "| `Human decision \"<verbatim input>\" in <tool>` |",
      "proof is always dated", "fixed proof and has no digest", "one root SPECTRE.md edit",
      "only their State and Decision\nor status cells", "future-result acceptance", "never parse them for authority"]],
    ["commands/archive.md", ["#### Implementations archive", "#### Provider archive", "Archive-Version: v1",
      "selected terminal", "prune\n   newly empty", "if any live record references", "Record paths",
      "Already archived selected IDs are no-ops", "the commit point of the copy", "Then write ARCHIVE.md"]],
    ["commands/target.md", ["target move", "target retire", "target reactivate", "no live ledger rows",
      "same logical project", "never reuse", "Target operations never move/delete",
      "The one exception is a new project"]],
    ["commands/check.md", ["reads and diagnoses, never mutates", "exactly what was", "publication.md", "duplicate IDs"]],
    ["commands/sync.md", ["Allowed corrections are exhaustive", "Refuse", "orphan instructions/results",
      "reconstruct/delete record rows", "marks safe sync", "Corrections elsewhere proceed"]],
    ["commands/upgrade.md", ["### Upgrade procedure", "Report", "Preserve all PLANNED, REVIEW",
      "Version control is\n   the rollback path", "running the same upgrade again", "never add absent ones"]],
    ["commands/host.md", ["### Optional host adapters", "`host add`:", "`host remove`:", "is itself\nthe current-human SPECTRE mention"]],
    ["providers.md", ["### Pinned provider evidence", "### Capture schema versions",
      "complete resolved inventory", "a separate Git commit is not a protocol prerequisite"]],
    ["commands/capture.md", ["### Compound-queue provider preparation", "### Publish a numbered incremental capture",
      "stop without tracked writes for NO-CHANGE", "archived captures are never predecessors or artifact owners",
      "SNAPSHOT.md last, the commit point"]],
    ["commands/recall.md", ["### Recall", "It is read-only", "Cite every statement"]],
    ["commands/status.md", ["### Status and listing", "Parse `status [scope] [state] [--archived]`", "read-only"]],
    ["validation.md", ["## 13. Validation invariants", "recorded digests match its\n    current result bytes", "37. Publication:", "38. Sync:", "39. Registry:"]],
    ["validation-full.md", ["1. Runtime: all 25 modules"]]
  ])
  // These phrases identify normative rules in the selectively loaded module, not just elsewhere
  // in the full document. Wording changes must update the release validator deliberately.
  for (const [name, rules] of requirements) {
    for (const rule of rules) requireText(runtime.get(name), rule, name)
  }
  for (const name of moduleNames.filter(name => name !== "core.md" && name !== "queues.md")) {
    assert.ok(!runtime.get(name).includes("### Human checkpoints and bounded replies"), `${name} duplicates checkpoint rules`)
  }
  assert.ok(!runtime.get("core.md").includes("### Natural-language operation queues"), "queue rules must load only from queues.md")
  assert.ok(!runtime.get("selectors.md").includes("Human command"), "decision proof rules belong only in decide.md")
  assert.ok(!runtime.get("references.md").includes("### Archives are kept as is"), "archive history loads only from history.md")
  assert.ok(!/\| accept \/ reject \/ cancel \|[^\n]*history\.md/.test(router), "decisions do not load archive history")
  requireText(source, "except\n   validation item 7, which needs the bootstrap record being created", "install step")

  const routes = new Map(router.split("\n").filter(line => /^\| [a-z]/.test(line)).map(line => {
    const cells = splitRow(line)
    assert.equal(cells.length, 3, `malformed router row: ${line}`)
    return [cells[0], { file: cells[1], deps: cells[2] }]
  }))
  for (const [operation, file, dependencies] of [
    ["help", "commands/help.md", []],
    ["status", "commands/status.md", ["selectors.md", "references.md"]],
    ["recall", "commands/recall.md", ["references.md", "history.md"]],
    ["check", "commands/check.md", ["validation-full.md", "validation.md", "publication.md"]],
    ["sync", "commands/sync.md", ["publication.md", "commands/target.md", "validation.md", "TEMPLATE_TARGETS.md"]],
    ["target", "commands/target.md", ["publication.md", "validation.md", "TEMPLATE_TARGETS.md"]],
    ["plan", "commands/plan.md", ["publication.md", "commands/target.md", "validation-evidence.md", "TEMPLATE_STATUS.md", "TEMPLATE_TARGETS.md"]],
    ["implement", "commands/implement.md", ["publication.md", "commands/target.md", "TEMPLATE_TARGETS.md", "validation.md", "validation-evidence.md"]],
    ["revise", "commands/revise.md", ["publication.md", "commands/target.md", "TEMPLATE_TARGETS.md", "validation.md", "validation-evidence.md"]],
    ["accept / reject / cancel", "commands/decide.md", ["publication.md", "validation.md"]],
    ["archive", "commands/archive.md", ["history.md", "publication.md", "validation.md", "TEMPLATE_STATUS.md", "validation-evidence.md"]],
    ["capture", "commands/capture.md", ["publication.md", "providers.md", "validation-evidence.md"]],
    ["upgrade", "commands/upgrade.md", ["publication.md", "validation-full.md"]],
    ["override", "commands/override.md", ["history.md", "publication.md", "validation.md"]],
    ["host add / remove", "commands/host.md", []]
  ]) {
    const route = routes.get(operation)
    assert.ok(route, `missing router operation: ${operation}`)
    assert.equal(route.file, file, `wrong module for ${operation}`)
    for (const dep of dependencies) requireText(route.deps, dep, `${operation} route`)
  }
  assert.equal(routes.size, 15, "unexpected/missing router operation")
  assert.ok(!routes.get("archive").deps.includes("validation-full.md"), "routine archive must check affected closure")
  for (const text of ["queues.md", "is not a mention", "publication.md"]) requireText(router, text, "router")
  for (const file of router.matchAll(/(?:commands\/[a-z]+|templates\/TEMPLATE_[A-Z]+|[a-z][a-z-]*)\.md/g)) {
    assert.ok(runtime.has(file[0]) || templates.has(file[0]), `router points to missing file ${file[0]}`)
  }
  for (const text of ["pending", "without", "No global tracking mode", "Do not install"]) requireText(pointer, text, "AGENTS pointer")
  for (const [name, fields] of [
    ["STATUS", ["Status-Template-Version: v1", "Status-Schema-Version: v1", `Protocol-Version: ${version}`, "Targets:",
      "| Evidence mode | Decision or status |",
      "Target: <target>", "Path:", "metadata", "no target sections", "Escaping:", "Metadata lines are"]],
    ["TARGETS", ["Target-Template-Version: v1", "Target-Schema-Version: v1", "| Target | Label | Path | Status | Reason |", "RETIRED", "no raw |"]],
    ["IMPL", ["Implementation-Workflow-Version: v1", "Implementation-Version: v1", "Target-Path:", "Result-Version: v1"]],
    ["PROVIDER", ["Provider-Workflow-Version: v1", "Provider-Snapshot-Version: v1", "Provider-Capture-Version: v1", "### Complete resolved artifact inventory", "Capture-Summary-SHA256:"]]
  ]) {
    const template = templates.get(`templates/TEMPLATE_${name}.md`)
    for (const field of fields) requireText(template, field, `${name} template`)
  }
  const help = runtime.get("commands/help.md")
  assert.match(help, /\| `\/spectre upgrade <version>` \|/)
  assert.match(help, /\| `\/spectre sync \[scope\]` \|/)
  assert.ok(!/--force|--recover|\blist\b/.test(help), "retired command advertised in help")
  for (const section of ["## 16. Tools", "## 17. Compact operating model", "A conforming tool:"]) {
    requireText(source, section, "protocol")
  }
  // Release 1.0.0 carries no rules for earlier releases, aliases or transaction recovery.
  for (const oldRule of ["transactions.md", "Transaction-Version", "sync --recover", "TRANSACTION.md",
    "addslash", "removeslash", "vacuum", "--force", "compatibility alias", "Legacy", "legacy",
    "pre-v3", "Known issues", "TypeScript may be", "No implementation records.",
    "earlier release's", "commands/list.md", "commands/slash.md", "Status-Schema-Version: v3", "Archive-Version: v3",
    "| Decision proof |", "its last tracking write"]) {
    assert.ok(!source.includes(oldRule), `contradictory legacy rule: ${oldRule}`)
  }
  let tableColumns
  let tableRow = 0
  for (const line of source.split("\n")) {
    if (!line.startsWith("|")) { tableColumns = undefined; tableRow = 0; continue }
    const cells = splitRow(line)
    tableColumns ??= cells.length
    assert.equal(cells.length, tableColumns, `inconsistent table columns: ${line}`)
    if (tableRow === 1) assert.ok(cells.every(cell => cell === "---"), `missing canonical separator: ${line}`)
    tableRow++
  }
  return result
}
