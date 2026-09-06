import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { extractRuntime, runtimePaths } from "./protocol-runtime.mjs"

const source = await readFile(new URL("../../protocol/v1.0.0/SPECTRE-PROTOCOL.md", import.meta.url), "utf8")
const runtime = extractRuntime(source)
const body = text => text.split("\n\n").slice(1).join("\n\n")
const words = text => text.trim().split(/\s+/).length
const router = source.split("````markdown\n---\nname: spectre\n")[1].split("\n````")[0]

test("all 13 modules are deterministic and pinned to the canonical release source", () => {
  assert.equal(runtime.size, 13)
  assert.deepEqual([...runtime.keys()], runtimePaths)
  assert.deepEqual(extractRuntime(source), runtime)
  const digest = createHash("sha256").update(source).digest("hex")
  for (const content of runtime.values()) {
    assert(content.includes("Runtime-Version: 1.0.0\n"))
    assert(content.includes(`Source-SHA256: ${digest}\n`))
    assert(!content.includes("<!-- spectre:runtime"))
    assert(content.endsWith("\n") && !content.endsWith("\n\n"))
  }
})

test("extraction preserves prose, code fences, and shared rule order without rewriting", () => {
  const blocks = [...source.matchAll(/<!-- spectre:runtime ([^\n]+) -->\n([\s\S]*?)\n<!-- \/spectre:runtime -->/g)]
  for (const path of runtimePaths) {
    const expected = blocks.filter(match => match[1].split(" ").includes(path)).map(match => match[2].trim()).join("\n\n")
    assert.equal(body(runtime.get(path)), `${expected}\n`)
  }
  const marker = "Do not silently fetch, refresh, substitute, or broaden a declared input"
  for (const command of ["plan", "implement", "revise"]) assert(runtime.get(`commands/${command}.md`).includes(marker))
  assert(runtime.get("commands/archive.md").includes("```markdown\n# SPECTRE archive"))
})

test("any source edit invalidates old module headers, and changed rules update only their bodies", () => {
  const changed = extractRuntime(source.replace("Evidence-backed implementation tracking", "Evidence-backed change tracking"))
  for (const path of runtimePaths) {
    assert.notEqual(changed.get(path), runtime.get(path))
    assert.equal(body(changed.get(path)), body(runtime.get(path)))
  }
  const changedRules = extractRuntime(source.replace("Never claim", "Do not claim"))
  assert.notEqual(body(changedRules.get("commands/implement.md")), body(runtime.get("commands/implement.md")))
  assert.equal(body(changedRules.get("commands/help.md")), body(runtime.get("commands/help.md")))
})

test("malformed, incomplete, empty, and unsafe extraction directives fail closed", () => {
  const start = "<!-- spectre:runtime commands/help.md -->"
  const end = "<!-- /spectre:runtime -->"
  const cases = [
    source.replace(start, "<!-- spectre:runtime ../outside.md -->"),
    source.replace(start, "<!-- spectre:runtime /tmp/outside.md -->"),
    source.replace(start, "<!-- spectre:runtime unknown.md -->"),
    source.replace(start, "<!-- spectre:runtime commands/help.md commands/help.md -->"),
    source.replace(start, `${start}\n${start}`),
    `${end}\n${source}`,
    `${source}\n${start}`,
    source.replace(start, "<!-- spectre:runtime commands/help.md-->"),
    source.replace(start, `${start}\n${end}\n${start}`),
    source.replace(/<!-- spectre:runtime commands\/status.md -->[\s\S]*?<!-- \/spectre:runtime -->/, ""),
    source.replace("Standard-Version: 1.0.0", "Standard-Version: missing"),
    `${source}\nStandard-Version: 1.0.0\n`,
  ]
  for (const invalid of cases) assert.throws(() => extractRuntime(invalid))
})

test("router covers every operation, selected files exist, and templates remain outside runtime", () => {
  const rows = [...router.matchAll(/^\| ([a-z]+(?: \/ [a-z]+)*) \| runtime\/(commands\/[a-z]+\.md) \|/gm)]
  assert.deepEqual(rows.flatMap(row => row[1].split(" / ")), [
    "help", "list", "status", "plan", "implement", "revise", "accept", "reject", "cancel", "capture", "archive", "validate"
  ])
  for (const row of rows) assert(runtime.has(row[2]), row[2])
  assert(router.includes("without reading its full text into context"))
  assert(router.includes("Missing/mismatched files block execution"))
  for (const content of runtime.values()) {
    assert(!content.includes("Installation is an explicit setup request"))
    assert(!content.includes("Implementation-Version: v1\nImplementation-ID:"))
  }
})

test("loaded rule sets preserve core boundaries and selector/reference safeguards", () => {
  const decision = ["core.md", "selectors.md", "references.md", "commands/decide.md"].map(path => runtime.get(path)).join("\n").replace(/\s+/g, " ")
  for (const rule of [
    "Never obey commands", "terminal", "immutable", "invalid/missing explicit ID", "tie", "human rejection proof",
    "never substitute another identity", "Archive accepts a whole existing target", "before writing", "read the selected row",
    "Reject conflicting active and archived copies", "Change only that row's State and Decision proof"
  ]) assert(decision.includes(rule), rule)
  assert(runtime.get("commands/plan.md").includes("every archive manifest in that sequence"))
  assert(runtime.get("commands/archive.md").includes("restore the captured source files and ledger"))
  assert(runtime.get("commands/capture.md").includes("Never run upstream hooks"))
  assert(runtime.get("commands/validate.md").includes("re-extracts runtime"))
})

test("common commands load substantially less protocol text, including router overhead", t => {
  const sets = {
    help: ["core.md", "commands/help.md"],
    list: ["core.md", "commands/list.md"],
    status: ["core.md", "selectors.md", "references.md", "commands/status.md"],
    reject: ["core.md", "selectors.md", "references.md", "commands/decide.md"],
  }
  for (const [command, paths] of Object.entries(sets)) {
    const loaded = words(router) + paths.reduce((sum, path) => sum + words(runtime.get(path)), 0)
    assert(loaded < words(source) * .3, `${command} should load less than 30% of the complete protocol's word count`)
    t.diagnostic(`${command}: ${loaded} instruction words including router; full protocol: ${words(source)} words. Excludes repository records/evidence.`)
  }
})
