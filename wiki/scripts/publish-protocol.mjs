import { cp, mkdir, readFile, rm } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// Only the latest protocol is published, at /spectre/SPECTRE-PROTOCOL.md. Earlier versions are not kept.
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, "../..")
const protocolPath = join(repositoryRoot, "protocol/SPECTRE-PROTOCOL.md")
const publicRoot = join(repositoryRoot, "wiki/src/pages/public")

const protocol = await readFile(protocolPath, "utf8")
const version = /^Protocol-Version: (\d+\.\d+\.\d+)$/m.exec(protocol)?.[1]
if (!/^Protocol-ID: xray\/spectre$/m.test(protocol) || !version) {
  throw new Error("protocol/SPECTRE-PROTOCOL.md must declare Protocol-ID: xray/spectre and Protocol-Version.")
}

// Remove versioned release directories left by earlier publications.
await rm(join(publicRoot, "protocol"), { recursive: true, force: true })
await mkdir(publicRoot, { recursive: true })
await cp(protocolPath, join(publicRoot, "SPECTRE-PROTOCOL.md"))

console.log(`Published SPECTRE protocol ${version}.`)
