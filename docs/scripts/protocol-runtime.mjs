import { createHash } from "node:crypto"

export const runtimePaths = Object.freeze([
  "core.md", "selectors.md", "references.md",
  ...["help", "list", "status", "plan", "implement", "revise", "decide", "capture", "archive", "validate"]
    .map(name => `commands/${name}.md`)
])

// The complete protocol is the only source. Repeated, non-nested blocks concatenate in order.
export function extractRuntime(protocol) {
  const versions = [...protocol.matchAll(/^Standard-Version: (\d+\.\d+\.\d+)$/gm)]
  if (versions.length !== 1) throw new Error("Expected one Standard-Version.")
  const version = versions[0][1]
  const digest = createHash("sha256").update(protocol).digest("hex")
  const sections = new Map(runtimePaths.map(path => [path, []]))
  let targets, lines
  for (const line of protocol.split("\n")) {
    const start = /^<!-- spectre:runtime (.+) -->$/.exec(line)
    if (start) {
      if (targets) throw new Error("Nested runtime block.")
      targets = start[1].split(" ")
      if (new Set(targets).size !== targets.length || targets.some(path => !sections.has(path))) {
        throw new Error(`Invalid runtime destinations: ${start[1]}`)
      }
      lines = []
    } else if (line === "<!-- /spectre:runtime -->") {
      if (!targets) throw new Error("Unmatched runtime end marker.")
      const body = lines.join("\n").trim()
      if (!body) throw new Error("Empty runtime block.")
      for (const path of targets) sections.get(path).push(body)
      targets = undefined
    } else if (/<!--\s*\/?spectre:runtime/.test(line)) {
      throw new Error("Malformed runtime marker.")
    } else if (targets) lines.push(line)
  }
  if (targets) throw new Error("Unclosed runtime block.")
  return new Map([...sections].map(([path, blocks]) => {
    if (!blocks.length) throw new Error(`Missing runtime module: ${path}`)
    return [path, `<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->\nRuntime-Version: ${version}\nSource-SHA256: ${digest}\n\n${blocks.join("\n\n")}\n`]
  }))
}
