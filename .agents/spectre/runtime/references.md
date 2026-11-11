<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

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

Archive directories are created only by a nonempty `/spectre archive` operation. Each batch
preserves the installation's flat or nested layout under its `implementations/` directory.
IDs remain unique across active records and every archive within their original sequence.
Archiving never resets a sequence: the next ID follows the highest ID used by any active or
archived record of that target.

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

### Immovable evidence and migrations

Published capture directories, their files, and every record file keep their path forever. Never
rename, move, or rewrite them, including to adopt a new naming scheme. Before deleting, merging, or
moving the repository or project that holds an installation, run full §13 validation and resolve
every failure, so no evidence depends on history that is about to disappear.

When a human explicitly authorizes an unavoidable evidence move, keep the original file at its
original path whenever its license and the human's authorization allow it, place the copy at the new
path, and record the move in `.agents/spectre/MIGRATIONS.md`. Remove an original only when the human
authorization requires it. Create the file with the first migration:

```markdown
# SPECTRE migrations

| Date | Original path | New path | SHA-256 before | SHA-256 after | Original kept | Reason |
| --- | --- | --- | --- | --- | --- | --- |
```

Append one row per moved file; never edit or remove a row. `SHA-256 after` differs from `SHA-256
before` only when the authorization requires a byte change, and the reason states why. A reference
to an original path that no longer exists resolves through exactly one row of this table to its new
path, whose bytes must match `SHA-256 after`. Never follow a chain of rows.

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
   names a missing Original path in `MIGRATIONS.md`, resolve it to that row's New path; if it names
   a missing File before in `OVERRIDES.md`, resolve it to that row's File after. Otherwise
   use the file at that path. Direct links already naming an archived file remain valid.
3. Require a unique existing destination. Reject conflicting active and archived copies, duplicate
   mappings, missing destinations, or paths that leave the installation root. For an archived or
   migrated destination, verify its digest and, for a record, the matching decision row before using
   it as evidence. Never follow a mapping chain.

Apply this to `Depends-On`, input tables, `Instruction`, result references, and provider links;
provider files themselves stay in place. An archived file's raw relative link may require this
original-location resolution rather than ordinary Markdown navigation. The manifest's record
links must work directly, and `status` must return usable links to the resolved files. Do not
rewrite immutable records merely to make their embedded links relative to the archive directory.
