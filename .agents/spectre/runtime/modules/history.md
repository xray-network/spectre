<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8792d72d42e4a70556d250a829ee45cdff86241cbd062e9eb3824062e71d07f4

### Immovable evidence

Published capture directories, their files, and every record file keep their path, except that
archiving moves a terminal record's files once into `archive/<archive-id>-<target>/`, byte for byte.
Never rename, move, or rewrite them otherwise, including to adopt a new naming scheme. The only
content rewrite is an explicit upgrade (§14), which brings live records and provider files to the
current formats in place and never changes an artifact file. Moving an owned source
directory within the same installation changes its target Path (references.md); that never moves
evidence or record files.

Besides archiving, three operations move evidence or records, each human-ordered and each updating every link,
provider pin, inventory entry and SHA-256 that refers to a moved file, in both ledgers and every
record and provider file, so every reference names the file's real path: `absorb` and `detach`
(§9) move whole targets between installations, and `Spectre override` (§9) moves anything else. A
copy stays at the original path only when the human asks for one. No lookup table redirects old
paths.

### Archived rows

The archive ledger, `.agents/spectre/archive/SPECTRE-ARCHIVE.md`, holds terminal rows that left
`SPECTRE.md` with the same ID, title, state, evidence mode and decision proof. Only the Instruction
and Result link destinations change, to the moved files (`<archive-id>-<target>/...`, relative to
the archive ledger). An archived record file sits at the same depth under
`archive/<archive-id>-<target>/` as it did under `implementations/<target>/`, so its links to
repository files still resolve, and its bytes, digest and decision proof stay valid.

A reference from one record to another, such as a Depends-On input, resolves by its qualified ID
through the two ledgers: the row there names the record's current file, live or archived. Never
rewrite a record to follow an archive. An archived row is history: ordinary maintenance never edits
it. A live operation that consumes an archived result as a normative input verifies its identity and
recorded digest like any other input; a missing or changed file blocks that consumer, not the
historical row. Report missing or changed historical files as information; never repair them or
substitute another file.
