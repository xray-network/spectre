# Versioning

SPECTRE versions the protocol separately from the implementation records and provider captures
stored in a repository. Each version field identifies one specific format or source of rules.

## Protocol

| Field | Meaning |
| --- | --- |
| `Standard-Version` | Semantic version declared by `SPECTRE-PROTOCOL.md` |
| `Protocol-Version` | Installed standard version recorded by a ledger or archive manifest |
| `Runtime-Version` | Matches the installed standard version in each generated runtime module |

SPECTRE `2.0.0` is the current version; `1.0.0` is frozen as published. Every release is
immutable once published, and later changes always get a new version. Installed copies remain
pinned to their own bytes and do not update automatically when the published source changes.

| Release | What it may change | How installations adopt it |
| --- | --- | --- |
| Patch | Wording and clarifications only | Refresh in place |
| Minor | Optional additions, never a new required check for existing records | Refresh in place |
| Major | Record formats, rules, or required checks | Archive first, then refresh |

Install from the canonical URL containing the complete version. A repository is governed by the
version in its local `.agents/spectre/SPECTRE-PROTOCOL.md`, not by whichever release is newest
online. The published release manifest records the SHA-256 digest of every protocol so downloaded
bytes can be verified independently.

Generated runtime modules carry `Runtime-Version` and `Source-SHA256`, binding them to the complete
installed protocol bytes. They are extracted rules rather than a separate release. Commands check
their version and source hash. Installation, explicit protocol updates, and archiving compare every
module with deterministic extraction; internal validation has no separate public command.

## Implementation records

| Field | Meaning |
| --- | --- |
| `Status-Template-Version` | Version of the installed status template |
| `Status-Schema-Version` | Schema of the root `SPECTRE.md` ledger |
| `Implementation-Workflow-Version` | Version of the implementation-template workflow instructions |
| `Implementation-Version` | Schema of an instruction record |
| `Result-Version` | Schema of a result record |
| `Archive-Version` | Schema of an immutable archive manifest |

The status, instruction, result, and archive formats started at `v1`. Their schema versions change
independently from the standard version when a release defines a new format. SPECTRE 2.0.0 uses
`Status-Template-Version: v2`, `Status-Schema-Version: v2`, and `Archive-Version: v2`: one exact
table format with qualified `target/NNNN` IDs, and a `Known issues` section in every manifest.
Every active ledger and archive manifest also records the installed `Protocol-Version`. Terminal
instructions, results, decisions, and archive manifests remain immutable. An archive is governed
by the version it was created with; newer versions verify only its header, path map, and hashes.

## Provider captures

| Field | Meaning |
| --- | --- |
| `Provider-Workflow-Version` | Version of the provider-template workflow instructions |
| `Provider-Snapshot-Version` | Schema of a numbered capture specification (`v1`) |
| `Provider-Capture-Version` | Schema of that capture’s advisory summary (`v1`) |

Providers themselves are not versioned. Their unversioned `PROVIDER.md` guides link official
sources and describe tracking, summarization, and maintained-consumer intent. Four-digit capture
IDs identify immutable evidence history rather than an upstream provider version.

Each new numbered directory contains a `SNAPSHOT.md` with the full resolved specification and
inventory, a `CAPTURE.md` with an advisory summary, and, when needed, only the newly stored files
under `artifacts/`. The first baseline is full; later captures reference unchanged files in earlier
directories. A capture stays governed by the protocol version that created it; captures made
before `CAPTURE.md` was required may omit it.

Plans pin a numbered snapshot and hashes, so consumers never silently follow the latest capture.
A separate Git commit is not required to pin a new capture. Preserve every referenced earlier directory;
a no-change capture creates no new directory or tracked writes.

## Upgrading

An upgrade is an explicit human request that names the target version. Each installation upgrades
separately; in a monorepo, every project with `.agents/spectre/` is its own installation.

1. Read the target release completely and verify its identity and canonical URL.
2. Validate the installation under its current version and resolve every failure.
3. For a major release, decide every `REVIEW` record and archive every terminal record first. A
   forced archive (`archive --force: <reason>`) may close all open records instead and records
   existing defects as known issues.
4. Replace the protocol, runtime, templates, router, README, `AGENTS.md` pointer, and any host
   adapters with the new version, and update the ledger's version fields.
5. Validate the installation under the new version.

Upgrades never rewrite terminal records, archives, or provider captures. Existing full numbered
snapshots stay valid at their original paths under the version that created them and may provide
reused artifacts to new incremental captures. Evidence never moves; an unavoidable move
keeps the original and is recorded in `.agents/spectre/MIGRATIONS.md`.
