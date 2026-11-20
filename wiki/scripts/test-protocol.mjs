import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { extractRelease, moduleNames, splitRow, verifyRelease } from "./verify-protocol.mjs"

const source = await readFile(new URL("../../protocol/SPECTRE-PROTOCOL.md", import.meta.url), "utf8")

test("the protocol extracts all routed rules and three templates from one canonical source", () => {
  const release = verifyRelease(source)
  assert.match(release.version, /^\d+\.\d+\.\d+$/)
  assert.equal(release.runtime.size, 23)
  assert.equal(release.templates.size, 3)
  assert.equal(new Set(moduleNames).size, 23)
  assert.equal(release.hash, createHash("sha256").update(source).digest("hex"))
  for (const text of release.runtime.values()) {
    assert.ok(text.startsWith(`<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->\nProtocol-Version: ${release.version}\nSource-SHA256: ${release.hash}\n\n`))
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
  const implement = runtime.get("commands/implement.md")
  const revise = runtime.get("commands/revise.md")
  const sharedStart = "### Declared source relocation"
  const shared = implement.slice(implement.indexOf(sharedStart)).split("\n\n").slice(0, 2).join("\n\n")
  assert.ok(shared.startsWith(sharedStart) && revise.includes(shared))
})

test("documents carry no schema versions; only the protocol is versioned", () => {
  const { templates } = verifyRelease(source)
  for (const template of templates.values()) assert.doesNotMatch(template, /^[A-Za-z-]+-Version: v\d+$/m)
  assert.doesNotMatch(source, /^[A-Za-z-]+-Version: v\d+$/m)
  assert.match(templates.get("templates/TEMPLATE_STATUS.md"), /^Protocol-Version: <Protocol-Version of the installed protocol>$/m)
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
  ["incorrect module inventory", text => text.replace("Require all 23 files.", "Require all 22 files.")],
  ["schema version header returns", text => text.replace("Protocol-Version: <Protocol-Version of the installed protocol>\nProtocol-SHA256: <SHA-256 of the installed protocol>\nProtocol: [", "Protocol-Version: <Protocol-Version of the installed protocol>\nProtocol-SHA256: <SHA-256 of the installed protocol>\nStatus-Schema-Version: v2\nProtocol: [")],
  ["ledger loses its protocol hash", text => text.replace("Protocol-SHA256: <SHA-256 of the installed protocol>\n", "")],
  ["upgrade relies on the version label alone", text => text.replace("The same Protocol-Version with a different SHA-256 still\n   upgrades.", "")],
  ["missing status template", text => text.replace("### `.agents/spectre/runtime/modules/templates/TEMPLATE_STATUS.md`", "### Status template removed")],
  ["upgrade stops rewriting live files", text => text.replace("5. Rewrite every live file to the latest templates", "5. Preserve every live file")],
  ["upgrade keeps an old layout", text => text.replace("Bring files into the current layout", "Leave files in their earlier layout")],
  ["provider archive disappears", text => text.replaceAll("Spectre archive provider <provider>", "Spectre archive")],
  ["archives lose their ARCHIVE.md", text => text.replace("This is the commit point", "No record is kept")],
  ["sync applies target fixes without asking", text => text.replace("Proposed fixes, applied only after the human answers", "Target fixes, applied at once")],
  ["absorb loses its ID map", text => text.replace("Build the ID map before writing", "Move the files")],
  ["upgrade rewrites historical hashes", text => text.replace("Historical notes, such as\n     migration hash tables in guides or provenance notes in snapshots, keep the hashes they\n     recorded.", "All recorded hashes are refreshed.")],
  ["upgrade stops logging as an override", text => text.replace("7. Append one override log row", "7. Optionally note")],
  ["upgrade takes a version argument again", text => text.replace("| `Spectre upgrade` |", "| `Spectre upgrade <version>` |")],
  ["implement accepts records marked for revision", text => text.replace("including one an upgrade marked for revision; it needs `revise`", "including stale ones; it may need `revise`")],
  ["separate target registry returns", text => text.replace("## Targets\n\n| Target |", "Targets: [.agents/spectre/TARGETS.md](.agents/spectre/TARGETS.md)\n\n| Target |")],
  ["router drops decision publication order", text => text.replace(/(\| accept \/ reject \/ cancel \|[^\n]*)publication\.md, /, "$1")],
  ["router points to missing module", text => text.replace("| sync | commands/sync.md |", "| sync | commands/repair.md |")],
  ["archive regresses to unrelated full validation", text => text.replace("| archive | commands/archive.md | selectors.md,", "| archive | commands/archive.md | validation-full.md, selectors.md,")],
  ["checkpoint gate is removed", text => text.replace("### Human checkpoints and bounded replies", "### Unbounded continuation")],
  ["tool proof source is removed", text => text.replace("| `Human decision \"<verbatim input>\" in <tool>` |", "| `Tool decision` |")],
  ["decision digests leave the proof shape", text => text.replace("<source> on <date>; reviewed <id>@<digest>, <id>@<digest>.", "<source> on <date>.")],
  ["archived-row rules leak into references", text => text.replace("<!-- spectre:runtime history.md -->\n### Immovable evidence", "<!-- spectre:runtime references.md history.md -->\n### Immovable evidence")],
  ["decisions load archive history", text => text.replace(/(\| accept \/ reject \/ cancel \| commands\/decide\.md \| selectors\.md, references\.md, )/, "$1history.md, ")],
  ["old ledger column returns", text => text.replace("| Evidence mode | Decision or status |", "| Evidence mode | Decision proof |")],
  ["interrupted revise state is removed", text => text.replace("Revise again; it reconciles the row", "Ask a human")],
  ["tools section is removed", text => text.replace("## 16. Tools", "## 16. Programs")],
  ["transaction recovery returns", text => text.replace("| `Spectre help [operation]` |", "| `Spectre sync --recover <transaction-id>` | Recover. |\n| `Spectre help [operation]` |")],
  ["legacy aliases return", text => `${text}\n\`vacuum\` means ordinary \`sync\`.\n`],
  ["archive force returns to help", text => text.replace("| `Spectre archive [scope]` |", "| `Spectre archive [scope] --force` |")],
  ["protocol ID is renamed back to standard", text => text.replace("Protocol-ID: xray/spectre", "Standard-ID: xray/spectre")],
  ["missing protocol version", text => text.replace("Protocol-Version: 1.0.0\n", "")],
  ["versioned release URL returns", text => text.replace("https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely", "https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md completely")],
  ["raw pipe inside a protocol table", text => text.replace("| `REVIEW` | Work is implemented", "| `REVIEW` | Work|is implemented")],
]
for (const [name, mutate] of corruptions) {
  test(`rejects ${name}`, () => {
    const changed = mutate(source)
    assert.notEqual(changed, source, "test must actually corrupt the source")
    assert.throws(() => verifyRelease(changed), assert.AssertionError)
  })
}
