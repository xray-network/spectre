import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { extractRelease, moduleNames, splitRow, verifyRelease } from "./verify-protocol.mjs"

const releaseUrl = new URL("../../protocol/v1.0.0/", import.meta.url)
const source = await readFile(new URL("SPECTRE-PROTOCOL.md", releaseUrl), "utf8")

test("1.0.0 extracts all routed rules and three templates from one canonical source", () => {
  const release = verifyRelease(source)
  assert.equal(release.version, "1.0.0")
  assert.equal(release.runtime.size, 25)
  assert.equal(release.templates.size, 3)
  assert.equal(new Set(moduleNames).size, 25)
  assert.equal(release.hash, createHash("sha256").update(source).digest("hex"))
  for (const text of release.runtime.values()) {
    assert.ok(text.startsWith(`<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->\nRuntime-Version: 1.0.0\nSource-SHA256: ${release.hash}\n\n`))
    assert.ok(text.endsWith("\n") && !text.endsWith("\n\n"))
    assert.ok(!text.includes("<!-- spectre:runtime"))
  }
})

test("core stays small: queue and checkpoint rules load only from queues.md", () => {
  const { runtime } = extractRelease(source)
  const words = (name) => runtime.get(name).split(/\s+/).length
  assert.ok(words("core.md") < 1300, `core.md has ${words("core.md")} words`)
  assert.ok(runtime.get("queues.md").includes("### Human checkpoints and bounded replies"))
  assert.ok(!runtime.get("core.md").includes("### Stop and resume"))
})

test("extraction preserves repeated block order and shared rules byte-for-byte", () => {
  const { runtime } = extractRelease(source)
  const core = runtime.get("core.md")
  assert.ok(core.indexOf("Operation names, flags") < core.indexOf("### Authorization"))
  assert.ok(core.indexOf("### Authorization") < core.indexOf("### Shared runtime checks"))
  const target = runtime.get("commands/target.md")
  const refs = runtime.get("references.md")
  const sharedStart = "### Target identity and current paths"
  const shared = target.slice(target.indexOf(sharedStart), target.indexOf("### Target operations")).trim()
  assert.ok(refs.includes(shared))
})

test("all 1.0.0 schemas start at v1", () => {
  const { templates } = verifyRelease(source)
  for (const field of ["Status-Schema-Version", "Status-Template-Version"]) assert.match(templates.get("templates/TEMPLATE_STATUS.md"), new RegExp(`^${field}: v1$`, "m"))
  for (const field of ["Implementation-Version", "Implementation-Workflow-Version", "Result-Version"]) assert.match(templates.get("templates/TEMPLATE_IMPL.md"), new RegExp(`^${field}: v1$`, "m"))
  assert.match(templates.get("templates/TEMPLATE_PROVIDER.md"), /^Provider-Snapshot-Version: v1$/m)
  assert.match(source, /^Archive-Version: v1$/m)
})

test("table rows split on unescaped separators and unescape literal pipes", () => {
  assert.deepEqual(splitRow("| `a/0001` | Proof \\| with a pipe | — |"), ["`a/0001`", "Proof | with a pipe", "—"])
  assert.throws(() => splitRow("| a | raw|pipe |"), assert.AssertionError)
  assert.throws(() => splitRow("|a | b |"), assert.AssertionError)
})

const corruptions = [
  ["inconsistent canonical table columns", text => text.replace("| `repository` | Repository | `./` | `ACTIVE` | Repository governance bootstrap |", "| `repository` | Repository | `./` | `ACTIVE` |")],
  ["source relocation rules disappear from implementation", text => text.replace("### Declared source relocation", "### Untracked folder moves")],
  ["publication order disappears", text => text.replace("### Publication order", "### Unspecified writes")],
  ["interrupted-write table disappears", text => text.replace("### Interrupted writes", "### Unknown states")],
  ["unknown extraction destination", text => text.replace("spectre:runtime core.md", "spectre:runtime untrusted.md")],
  ["duplicate extraction destination", text => text.replace("spectre:runtime core.md", "spectre:runtime core.md core.md")],
  ["nested extraction markers", text => text.replace("<!-- spectre:runtime core.md -->", "<!-- spectre:runtime core.md -->\n<!-- spectre:runtime core.md -->")],
  ["unbalanced extraction markers", text => text.replace("<!-- /spectre:runtime -->", "")],
  ["malformed extraction marker", text => text.replace("<!-- spectre:runtime core.md -->", "<!-- spectre:runtime core.md-->")],
  ["missing publication module", text => text.replace("<!-- spectre:runtime publication.md -->", "<!-- spectre:runtime references.md -->")],
  ["queue rules leak back into core", text => text.replace("<!-- spectre:runtime queues.md -->", "<!-- spectre:runtime core.md queues.md -->")],
  ["incorrect module inventory", text => text.replace("Require all 25 files.", "Require all 24 files.")],
  ["misversioned schema template", text => text.replace("Status-Schema-Version: v1\nStorage-Mode", "Status-Schema-Version: v3\nStorage-Mode")],
  ["missing status template", text => text.replace("### `.agents/spectre/runtime/modules/templates/TEMPLATE_STATUS.md`", "### Status template removed")],
  ["upgrade stops migrating live records", text => text.replace("4. Migrate the live ledger and every live record", "4. Preserve the live ledger and every live record")],
  ["upgrade rewrites frozen history", text => text.replace("archives, provider captures and guides byte for byte", "provider guides byte for byte")],
  ["implement accepts records marked for revision", text => text.replace("including one an upgrade marked for revision; it needs `revise`", "including stale ones; it may need `revise`")],
  ["separate target registry returns", text => text.replace("## Targets\n\n| Target |", "Targets: [.agents/spectre/TARGETS.md](.agents/spectre/TARGETS.md)\n\n| Target |")],
  ["router drops decision publication order", text => text.replace(/(\| accept \/ reject \/ cancel \|[^\n]*)publication\.md, /, "$1")],
  ["router points to missing module", text => text.replace("| sync | commands/sync.md |", "| sync | commands/repair.md |")],
  ["archive regresses to unrelated full validation", text => text.replace("| archive | commands/archive.md | selectors.md,", "| archive | commands/archive.md | validation-full.md, selectors.md,")],
  ["checkpoint gate is removed", text => text.replace("### Human checkpoints and bounded replies", "### Unbounded continuation")],
  ["tool proof source is removed", text => text.replace("| `Human decision \"<verbatim input>\" in <tool>` |", "| `Tool decision` |")],
  ["decision digests leave the proof shape", text => text.replace("<source> on <date>; reviewed <id>@<digest>, <id>@<digest>.", "<source> on <date>.")],
  ["archive history leaks back into references", text => text.replace("<!-- spectre:runtime history.md -->\n### Archives are kept as is", "<!-- spectre:runtime references.md history.md -->\n### Archives are kept as is")],
  ["decisions load archive history", text => text.replace(/(\| accept \/ reject \/ cancel \| commands\/decide\.md \| selectors\.md, references\.md, )/, "$1history.md, ")],
  ["old ledger column returns", text => text.replace("| Evidence mode | Decision or status |", "| Evidence mode | Decision proof |")],
  ["interrupted revise state is removed", text => text.replace("Revise again; it reconciles the row", "Ask a human")],
  ["tools section is removed", text => text.replace("## 16. Tools", "## 16. Programs")],
  ["transaction recovery returns", text => text.replace("| `/spectre help [operation]` |", "| `/spectre sync --recover <transaction-id>` | Recover. |\n| `/spectre help [operation]` |")],
  ["legacy aliases return", text => `${text}\n\`vacuum\` means ordinary \`sync\`.\n`],
  ["archive force returns to help", text => text.replace("| `/spectre archive [scope]` |", "| `/spectre archive [scope] --force` |")],
  ["canonical version mismatches", text => text.replace("Canonical-URL: https://wiki.xraynetwork.io/spectre/protocol/v1.0.0", "Canonical-URL: https://wiki.xraynetwork.io/spectre/protocol/v3.0.0")],
  ["raw pipe inside a protocol table", text => text.replace("| Patch | Wording only;", "| Patch | Wording|only;")],
]
for (const [name, mutate] of corruptions) {
  test(`rejects ${name}`, () => {
    const changed = mutate(source)
    assert.notEqual(changed, source, "test must actually corrupt the source")
    assert.throws(() => verifyRelease(changed), assert.AssertionError)
  })
}
