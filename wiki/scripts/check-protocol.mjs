import { readFile } from "node:fs/promises"
import { verifyRelease } from "./verify-protocol.mjs"

// Verify that a selective installation receives every rule it needs from the canonical source,
// without adding a second maintained runtime or publishing it. Only the latest protocol is kept.
const source = await readFile(new URL("../../protocol/SPECTRE-PROTOCOL.md", import.meta.url), "utf8")
const { version, runtime, hash } = verifyRelease(source)
console.log(`SPECTRE ${version}: ${runtime.size} runtime modules, three templates, router and rule placement verified. SHA-256 ${hash}`)
