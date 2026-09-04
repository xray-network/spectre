# Versioning

SPECTRE separates the version of the standard from the schemas used by installed records.

| Version | Meaning |
| --- | --- |
| `Standard-Version` | Semantic version of `SPECTRE-PROTOCOL.md` |
| `Status-Schema-Version` | Schema of the root `SPECTRE.md` ledger |
| `Implementation-Version` | Schema of an instruction record |
| `Result-Version` | Schema of a result record |
| `Provider-Version` | Version of one repository's provider contract |

Protocol releases use semantic versioning:

- A patch clarifies behavior without changing required structure.
- A minor version adds backward-compatible commands or optional fields.
- A major version changes required paths, authority, fields, or lifecycle semantics.

Always install from an immutable URL containing the complete version. A repository is governed by
the version in its local `.spectre/SPECTRE-PROTOCOL.md`, not by whichever release is newest online.
The release manifest records the SHA-256 digest of every published protocol so downloaded bytes can
be verified independently.

Major upgrades require the release's migration instructions. Historical terminal records must not
be rewritten under the new standard.
