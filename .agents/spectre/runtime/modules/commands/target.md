<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

### Target identity and current paths

`.agents/spectre/TARGETS.md` is the sole target registry (§11). Its rows contain stable Target ID,
Label, Path, Status and Reason. It stores no implementation state or next-ID counter. Register only
the bootstrap target at installation and another target on its first successful plan. Discovery
does not pre-register filesystem folders. Every live or archived target identity remains registered;
retirement preserves a tombstone. Historical slugs remain separate identities unless an explicit scoped override changes them
with unambiguous continuity; never infer that two historical slugs are one sequence.

Path is a normalized installation-root-relative source directory: `./` or `./path/`. Reject absolute
paths, traversal, `.agents/spectre/` ownership, unsafe encodings, symlink escapes and nonexistent active
paths. The one exception is a new project: its first plan may register a Path that does not exist yet
when that plan's Target-Path names it and a change of that plan creates it. The Path must exist once
any record of the target reaches REVIEW; until then a missing folder is expected, not an error.
Resolve filesystem containment, not string prefixes. A target has one current path; it is
context/ownership, not permission to read or modify every descendant. Nested ownership does not
overlap; the `repository` governance target at `./` is the exception and owns governance only.
Flat mode has exactly one registered repository target at `./`.

Live sections display their registry ID, label and current Path, checked as a projection. Historical
instructions/source paths and archive Path fields remain snapshots; a source-folder move never
rewrites them. Target IDs and sequence ownership survive source renames. Record and evidence paths
remain governed by §3/§9 and cannot be moved by changing this registry.

### Target operations

Resolve and report exactly one existing identity before mutation. Check its registry row, live and
archived identity history, ownership and affected references; write the registry, then the live
projection (publication.md). Target operations never move/delete product files or records.

- `target move <target>: <path>` requires an ACTIVE target and an existing new owned directory.
  Update only its Path and any live section Path. A source-relocation instruction declares its old
  and new source paths; its implementation performs this binding update as required bookkeeping in
  the same result/ledger publication. Binding alone moves no source files.
  In flat mode the path remains `./`; moving the whole installation requires explicit setup/override.
- `target retire <target>: <reason>` requires ACTIVE status, a human reason, and no live ledger rows
  or orphan record files. If rows remain, report them; do not cancel/archive implicitly. Explicit
  "archive completed work then retire this target" can queue those operations. Retain its ID, label,
  last path and reason with RETIRED status; the last path may later cease to exist.
- `target reactivate <target>: <path>` requires RETIRED status, the same logical project, and a valid
  existing owned path. Set ACTIVE and record reactivation in Reason; continue IDs above live and
  archived maxima. A different project needs a different identity, never reuse of this target.

A repeated operation with the same already-achieved binding/status/reason is a reported no-op;
contradictory state or identity requires clarification. Missing folders never automatically retire
targets. Splits/merges create future targets as needed; history retains original IDs. Display-label
or historical-ID changes outside these operations require an explicit scoped override.
