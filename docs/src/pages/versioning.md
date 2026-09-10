# Versioning

SPECTRE versions the protocol separately from the implementation records and provider captures
stored in a repository. Each version field identifies one specific format or source of rules.

## Protocol

| Field | Meaning |
| --- | --- |
| `Standard-Version` | Semantic version declared by `SPECTRE-PROTOCOL.md` |
| `Protocol-Version` | Installed standard version recorded by a ledger or archive manifest |
| `Runtime-Version` | Matches the installed standard version in each generated runtime module |

SPECTRE `1.0.0` is the initial version. Installed copies remain pinned to their own bytes and do not
update automatically when the published source changes. Protocol releases use semantic versioning.

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

The status, instruction, result, and archive formats start at `v1`. Their schema versions can
change independently from the standard version when a protocol revision defines a new format.
Every active ledger and archive manifest also records the installed `Protocol-Version`. Terminal
instructions, results, decisions, and archive manifests remain immutable.

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
directories. Retained legacy captures may follow their original schema and omit `CAPTURE.md`.

Plans pin a numbered snapshot and hashes, so consumers never silently follow the latest capture.
A separate Git commit is not required to pin a new capture. Legacy Git-pinned inputs still require
their exact committed history and hash verification. Preserve every referenced earlier directory;
a no-change capture creates no new directory or tracked writes.

## Existing installation adoption

When permitted by the installed protocol, a human may explicitly request refreshing its protocol,
runtime modules, and templates in place. Source edits alone never update an installation.
Existing full numbered snapshots remain valid under their original rules and may provide reused
artifacts to new incremental captures. Root-level rolling evidence requires explicit human-authorized
adoption before a numbered baseline is created. Preserve old paths or exact Git history wherever
existing references require them, and never silently redirect references or rewrite terminal
records.
