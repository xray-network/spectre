# Versioning

SPECTRE separates the version of the standard from the schemas used by installed records.
The initial release is `1.0.0`; its templates and record schemas start at `v1`.

| Version | Meaning |
| --- | --- |
| `Standard-Version` | Semantic version of `SPECTRE-PROTOCOL.md` |
| `Status-Schema-Version` | Schema of the root `SPECTRE.md` ledger |
| `Implementation-Version` | Schema of an instruction record |
| `Result-Version` | Schema of a result record |
| `Archive-Version` | Schema of an immutable archive manifest |
| `Provider-Version` | Version of one repository's provider contract |
| `Runtime-Version` | Matches the installed standard version in each generated runtime module |

Protocol releases use semantic versioning:

- A patch clarifies behavior without changing required structure.
- A minor version adds backward-compatible commands or optional fields.
- A major version changes required paths, authority, fields, or lifecycle semantics.

Always install from an immutable URL containing the complete version. A repository is governed by
the version in its local `.agents/spectre/SPECTRE-PROTOCOL.md`, not by whichever release is newest online.
The release manifest records the SHA-256 digest of every published protocol so downloaded bytes can
be verified independently.

Generated runtime modules also carry `Source-SHA256`, binding them to the complete installed
protocol bytes. They are extracted rules, not a separate release or record schema. Commands check
their version and source hash; full validation compares every module with deterministic extraction.

This release defines fresh installation only. Existing installations from another standard
version or layout are not converted in place. Terminal record contents and decision data remain
immutable; the explicit archive command may relocate files and rebase their ledger links.
