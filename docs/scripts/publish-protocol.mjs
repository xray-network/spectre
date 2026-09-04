import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, "../..")
const sourceRoot = join(repositoryRoot, "protocol")
const publicRoot = join(repositoryRoot, "docs/src/pages/public")
const destinationRoot = join(publicRoot, "protocol")
const releasePattern = /^v(\d+)\.(\d+)\.(\d+)$/
const canonicalOrigin = "https://wiki.xraynetwork.io/spectre/protocol"

const entries = await readdir(sourceRoot, { withFileTypes: true })
const releases = entries
  .filter((entry) => entry.isDirectory() && releasePattern.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" })
  )

if (releases.length === 0) {
  throw new Error("No versioned SPECTRE protocol releases were found.")
}

await rm(destinationRoot, { recursive: true, force: true })
await mkdir(destinationRoot, { recursive: true })

const manifest = []

for (const release of releases) {
  const version = release.slice(1)
  const sourceDirectory = join(sourceRoot, release)
  const protocolPath = join(sourceDirectory, "SPECTRE-PROTOCOL.md")
  const protocol = await readFile(protocolPath, "utf8")
  const expectedUrl = `${canonicalOrigin}/${release}/SPECTRE-PROTOCOL.md`
  const releaseFiles = await readdir(sourceDirectory)

  if (!protocol.includes(`Standard-Version: ${version}`)) {
    throw new Error(`${release} does not declare Standard-Version: ${version}.`)
  }

  if (!protocol.includes(`Canonical-URL: ${expectedUrl}`)) {
    throw new Error(`${release} does not declare its immutable canonical URL.`)
  }

  await cp(sourceDirectory, join(destinationRoot, release), { recursive: true })
  manifest.push({
    version,
    protocol: expectedUrl,
    sha256: createHash("sha256").update(protocol).digest("hex"),
    migration: releaseFiles.includes("MIGRATION.md")
      ? `${canonicalOrigin}/${release}/MIGRATION.md`
      : null
  })
}

const latest = manifest.at(-1)
const latestRelease = releases.at(-1)
const latestProtocolPath = join(sourceRoot, latestRelease, "SPECTRE-PROTOCOL.md")
const [latestProtocol, rootProtocol] = await Promise.all([
  readFile(latestProtocolPath, "utf8"),
  readFile(join(repositoryRoot, "SPECTRE-PROTOCOL.md"), "utf8")
])

if (rootProtocol !== latestProtocol) {
  throw new Error(`Root SPECTRE-PROTOCOL.md must match the latest release (${latestRelease}).`)
}

await Promise.all([
  writeFile(
    join(destinationRoot, "index.json"),
    `${JSON.stringify({
      latest: latest.version,
      current: "https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md",
      releases: manifest
    }, null, 2)}\n`
  ),
  cp(latestProtocolPath, join(publicRoot, "SPECTRE-PROTOCOL.md"))
])

console.log(`Published ${releases.length} protocol release${releases.length === 1 ? "" : "s"}.`)
