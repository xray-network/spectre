<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

The two implementation forms in the tree are alternatives and must not be mixed:

- A single-project repository uses the flat form: `implementations/NNNN-IMPL-INSTR.md` and
  `implementations/NNNN-IMPL-RESULT.md`. It has one repository-wide sequence.
- A monorepo uses the nested form: `implementations/<target>/NNNN-IMPL-INSTR.md` and
  `implementations/<target>/NNNN-IMPL-RESULT.md`. Its required bootstrap record uses the reserved
  `repository` target; other sequences are independent per target.

An implementation **target** is the smallest stable monorepo project area with its own source
ownership and meaningful completion validation. Examples include `api`, `web`, `mobile`,
`typescript`, or `payments`. Implementation sequences use four digits beginning at `0001`.
Each provider has an independent four-digit capture sequence. These numbers identify immutable
evidence captures, not versions of the provider or upstream protocol.

Root `SPECTRE.md` is the sole active lifecycle ledger and the project-facing implementation
summary. It aggregates one status section for the repository in flat mode or one section per
target in monorepo mode. Each archived implementation has its sole historical decision row in
one `archive/<archive-id>/ARCHIVE.md`; it has no row in the active ledger. Archive manifests are
immutable history, not additional active ledgers. Target directories contain instructions and
results, not status ledgers. Provider captures have no lifecycle ledger and never contain
implementation instructions or results.

Archive directories are created only by a nonempty `/spectre archive` operation. A batch holds
either implementations or providers, never both. An implementations batch preserves the
installation's flat or nested layout under its `implementations/` directory; a provider batch holds
each archived provider's whole directory under `providers/<provider>/`.
IDs remain unique across active records and every archive within their original sequence.
Archiving never resets a sequence: the next ID follows the highest ID used by any active or
archived record of that target. A provider's capture numbers likewise stay unique across its live
directory and every archive that holds an earlier copy of it.

### Installation boundary

The installation root is the folder that holds `.agents/spectre/`. Every reference in a record,
ledger, manifest, or provider file resolves to a file inside that root. A reference that leaves it,
such as `../other-project/...`, an absolute path, or a symbolic link pointing outside, is invalid
even when the target exists, including another installation in the same repository. Check this
whenever a record is written, not only during archive.

Anything an implementation uses from another project, including a sibling project in the same
monorepo, enters as provider evidence: a numbered capture in this installation's `providers/`,
like any upstream source. Capture the other project's published interface, such as its README,
exported types, and package version or commit, never its SPECTRE records. A plan names the capture
it relies on instead of requiring another project's result to be `ACCEPTED`.

### Immovable evidence

Published capture directories, their files, and every record file keep their path forever. Never
rename, move, or rewrite them, including to adopt a new naming scheme. Before deleting, merging, or
moving the repository or project that holds an installation, run full §13 validation and resolve
every failure, so no evidence depends on history that is about to disappear.

Two operations move evidence or records. `/spectre archive` (§9) moves terminal records, or whole
providers that no active record references, into an archive, unchanged. Any other move or rename is
a human-ordered `/spectre override` (§9). The override moves the file and, in the same change, updates every link, provider pin, inventory entry,
and SHA-256 in active records, the ledger, and provider files that refers to it, so every such
reference names the file's real path. Archives are kept as is and are not updated. It keeps
a copy at the original path only when the human asks for one. No lookup table redirects old paths.

### Archives are kept as is

An archive is history. The archive operation records paths, SHA-256 values, and decision rows as
they are when it runs; afterwards nothing re-checks or repairs an archive. Links, paths, hashes, and
text inside archived files and manifests may become stale or broken, and that is never a validation
failure. Only each manifest row's ID, state, and decision proof are relied on. Ordinary operations
never edit archives; an override may, but no override has to keep them current. When a command reads
an archived file, it uses the file as is and may note, as information only, that a link no longer
resolves or that the bytes differ from the recorded SHA-256.

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
   it to the same suffix under that batch's `providers/<provider>/`. If it
   names `.agents/spectre/SPECTRE-PROTOCOL.md` or a file under `.agents/spectre/templates/`, where
   earlier releases kept them, resolve it to `.agents/spectre/runtime/SPECTRE-PROTOCOL.md` or the
   same template under `.agents/spectre/runtime/modules/templates/`. This
   fixed rule covers tooling files only, never evidence. Otherwise use the file at that path. Logs under `logs/` are never used for resolution. Direct links already naming an archived file remain valid.
3. Require a unique existing destination. Reject conflicting active and archived copies, duplicate
   mappings, missing destinations, or paths that leave the installation root. For an archived
   destination, rely on its matching decision row and read the file as is; a missing archived file
   or a changed digest is information, never a failure. Never follow a mapping chain.

Apply this to `Depends-On`, input tables, `Instruction`, result references, and provider links.
Provider files stay in place unless a provider archive moved them whole; an active record never
references an archived provider. An archived file's raw relative link may require this
original-location resolution rather than ordinary Markdown navigation. The archive operation
writes manifest record links that work directly; afterwards they are kept as is, and `status`
returns the links it can still resolve. Do not
rewrite immutable records merely to make their embedded links relative to the archive directory.
