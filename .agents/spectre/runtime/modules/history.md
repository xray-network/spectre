<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

### Immovable evidence

Published capture directories, their files, and every record file keep their path forever. Never
rename, move, or rewrite them, including to adopt a new naming scheme. Before deleting, merging, or
moving an installation, run full §13 validation and preserve its tracking/evidence dependencies.
Moving an owned source directory within the same installation changes its target Path through
`target move`; that operation does not move evidence or immutable record files.

Two operations move evidence or records. `/spectre archive` (§9) moves terminal records, or whole
providers that no active record references, into an archive, unchanged. Any other move or rename is
a human-ordered `/spectre override` (§9). The override moves the file and, in the same change, updates every link, provider pin, inventory entry,
and SHA-256 in active records, the ledger, and provider files that refers to it, so every such
reference names the file's real path. Archives are kept as is and are not updated. It keeps
a copy at the original path only when the human asks for one. No lookup table redirects old paths.

### Archives are kept as is

Archives preserve history under the schemas that created them. Ordinary maintenance does not
rewrite, reformat or refresh their records, manifests, source links or digests. Their identity
headers and row IDs, terminal states and decision proofs remain authoritative; original-path maps
locate records without rewriting them. Missing/changed historical files or stale source navigation
are information for status/recall, not automatic authority to repair or invalidate a decision.

A live operation declaring an archived result as a normative input must still obtain that exact
input, confirm its accepted identity/schema and verify recorded digests when available. Missing or
altered required evidence blocks that consumer; it does not erase the historical row. Never replace
missing evidence with Git history or a similar file silently. Explicit scoped overrides remain the
only exception to historical immutability and must preserve affected live references.

### Resolving archived records and references

All SPECTRE operations resolve record IDs and references across the active ledger and every
archive manifest. One implementation ID has exactly one authoritative row and one physical
instruction (and at most one result), either active or archived. Archive dates never change
implementation identity, target ownership, state, or dependency acceptance.

Record contents remain byte-for-byte unchanged, including embedded relative paths. To follow a
repository-relative reference from a record:

1. Use the containing file's original repository location as the base. For an archived record,
   obtain that location from its Record paths entry; for an active record, use its current path.
   Explicit repository-root-relative references keep the installation root as their base.
2. Normalize the referenced path within the installation root (§3), retaining any fragment. If it
   names an Original path in an archive manifest, resolve it to that row's Archived file. If it
   lies inside an archived provider's Original path and no live file exists at that path, resolve
   it to the same suffix under that batch's `providers/<provider>/`. Otherwise use the file at that
   path. Logs under `logs/` are never used for resolution. Direct links already naming an archived
   file remain valid.
3. Require a unique existing destination. Reject conflicting active and archived copies, duplicate
   mappings, missing destinations, or paths that leave the installation root. For historical inspection, a missing archived file or changed digest is information.
   For consumption as an active normative input, require the matching accepted row, readable
   instruction/result identity, and recorded digest when available; missing/corrupt/changed evidence
   blocks the consuming operation. Do not repair history or substitute another input. Never follow
   a mapping chain.

Apply this to `Depends-On`, input tables, `Instruction`, result references, and provider links.
Provider files stay in place unless a provider archive moved them whole; an active record never
references an archived provider. An archived file's raw relative link may require this
original-location resolution rather than ordinary Markdown navigation. The archive operation
writes manifest record links that work directly; afterwards they are kept as is, and `status`
returns the links it can still resolve. Do not
rewrite immutable records merely to make their embedded links relative to the archive directory.
