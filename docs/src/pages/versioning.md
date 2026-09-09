# Versioning

SPECTRE separates the version of the standard from the schemas used by installed records.
The initial version is `1.0.0`; its templates and record schemas start at `v1`. While 1.0.0 remains
in development, these protocol refinements update that source in place without a version bump.
Installed copies remain pinned to their own bytes; development edits do not update them automatically.

| Version | Meaning |
| --- | --- |
| `Standard-Version` | Semantic version of `SPECTRE-PROTOCOL.md` |
| `Status-Schema-Version` | Schema of the root `SPECTRE.md` ledger |
| `Implementation-Version` | Schema of an instruction record |
| `Result-Version` | Schema of a result record |
| `Archive-Version` | Schema of an immutable archive manifest |
| `Provider-Snapshot-Version` | Schema of a numbered capture specification (`v1`) |
| `Provider-Capture-Version` | Schema of that capture’s advisory summary (`v1`) |
| `Runtime-Version` | Matches the installed standard version in each generated runtime module |

Providers are not versioned. Their guides link sources and describe tracking/summarization intent.
Each numbered directory is an immutable evidence capture: SNAPSHOT.md defines its full resolved
specification and inventory, CAPTURE.md summarizes the baseline or update, and artifacts/ stores
only the newly needed bytes. The first baseline is full; subsequent captures reuse unchanged files
in earlier directories. Four-digit capture IDs identify evidence history, not upstream versions.

Plans pin a numbered snapshot and hashes. Historical and current consumers resolve the complete
inventory directly to retained physical files; they never silently follow latest. Git commits are
not required to identify these immutable inputs. Preserve earlier referenced directories, including
legacy full snapshots, instead of overwriting or deleting them to save space. No-change capture
creates no new directory or tracked writes.

Finalized protocol releases use semantic versioning:

- A patch clarifies behavior without changing required structure.
- A minor version adds backward-compatible commands or optional fields.
- A major version changes required paths, authority, fields, or lifecycle semantics.

Install from the canonical URL containing the complete version; finalized release URLs are immutable. A repository is governed by
the version in its local `.agents/spectre/SPECTRE-PROTOCOL.md`, not by whichever release is newest online.
The release manifest records the SHA-256 digest of every published protocol so downloaded bytes can
be verified independently.

Generated runtime modules also carry `Source-SHA256`, binding them to the complete installed
protocol bytes. They are extracted rules, not a separate release or record schema. Commands check
their version and source hash. Installation, explicit updates and archiving automatically compare
every module with deterministic extraction. Internal validation rules have no separate public command.

This release defines fresh installation and explicit development adoption rules. Existing full
numbered snapshots remain valid under their original rules and may supply reused artifacts to new
incremental captures. Root-level rolling evidence requires an authorized migration before numbered
capture. Preserve old paths or exact Git history wherever existing references require them; do not
silently redirect those references. Terminal records and decisions remain immutable. No standard
or record-schema version is bumped for this in-development correction.
