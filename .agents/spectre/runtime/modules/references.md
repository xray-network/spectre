<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

Every installation keeps its records in one form: `implementations/<target>/NNNN-IMPL-INSTR.md` and
`implementations/<target>/NNNN-IMPL-RESULT.md`, one independent sequence per target. A single
project has one target, named after its folder (§4); a monorepo has one target per project plus the
reserved `repository` governance target. Archiving moves records to
`implementations/__archive/<archive-id>/<target>/` and providers to
`providers/__archive/<archive-id>/<provider>/`.

An implementation **target** is the smallest stable project area with its own source ownership and
meaningful completion validation. Examples include `api`, `web`, `mobile`,
`typescript`, or `payments`. Implementation sequences use four digits beginning at `0001`.
Each provider has an independent four-digit capture sequence. These numbers identify immutable
evidence captures, not versions of the provider or upstream protocol.

`SPECTRE.md` in the installation root is the live lifecycle ledger, the target registry and the
project-facing summary. Its Targets table holds every target identity and current source location,
its Providers section has one subsection per live provider and one row per published capture, and
its implementation subsections exist only for targets with live rows. Each archive run has one
folder, `__archive/<archive-id>/`, under `implementations/` or `providers/`, whose `ARCHIVE.md`
holds the rows or provider subsections that left `SPECTRE.md`. Every implementation and capture
has exactly one row, and every provider has exactly one subsection, in `SPECTRE.md` or in one
`ARCHIVE.md`. Target directories contain
instructions and results, not status ledgers. Provider captures have no lifecycle ledger and never
contain implementation instructions or results.

IDs remain unique within their sequence across live and archived records. Archiving never resets a
sequence: the next ID follows the highest ID live or archived for that target, and a provider's
next capture follows its highest live or archived capture.

### Installation boundary

The installation root is the folder that holds `.agents/spectre/` (§2). Every local reference in a
record, ledger, or provider file stays inside that root. Official upstream URLs are provenance,
not local filesystem references. Active normative inputs must resolve; historical source locations
may be stale under the source-reference rules below. A reference that leaves it,
such as `../other-project/...`, an absolute path, or a symbolic link pointing outside, is invalid
even when the target exists, including another installation in the same repository. A nested
installation's folder belongs to it alone: the outer installation's targets and references never
enter it. Check this whenever a record is written.

Anything an implementation uses from another project, including a sibling project in the same
monorepo, enters as provider evidence: a numbered capture in this installation's `providers/`,
like any upstream source. Capture the other project's published interface, such as its README,
exported types, and package version or commit, never its SPECTRE records. A plan names the capture
it relies on instead of requiring another project's result to be `ACCEPTED`.

### Target identity and current paths

The Targets table at the top of root `SPECTRE.md` is the sole target registry (§11). Its rows contain stable Target ID,
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
A single project's one target owns `./`.

Implementation subsections name only their target ID; label and current Path live in the Targets
table alone. Historical instructions and source paths remain snapshots; a source-folder move
never rewrites them. Target IDs and sequence ownership survive source renames.
Record and evidence paths remain governed by §3/§9 and cannot be moved by changing a Targets row.

A Targets row changes in three ways only: the first plan registers the target; `sync` updates a
moved Path or retires a target whose folder is gone, after the human answers its proposal; and
planning new work for a RETIRED target reactivates it, with an existing owned Path and a Reason
naming the plan, continuing its numbering. A source move declared by an implementation updates the
Path in that implementation's publication. Splits/merges within one installation create future
targets as needed; history retains original IDs. Moving a target to or from another installation
uses `detach` and `absorb` (§9). Target IDs never change outside an explicit scoped override.

### Current inputs and historical source locations

Local normative inputs in a new/revised instruction and all inputs consumed during implementation
must exist when consumed. Explicit owned-source moves/removals declared by a Change ID can
become historical after consumption when the result records their verified disposition (§9). Other
active PLANNED/REVIEW records with moved required inputs need an explicit revision before work; changing target Path cannot silently rebind them.
SPECTRE record links, dependencies and provider pins always require identity-safe resolution when
consumed. The Targets Path defines current ownership, not an input redirect.

Source/test paths describing completed changes, the Target-Path snapshot of an instruction, and
source links in terminal records are historical context. A later legitimate move/removal may make
them stale without invalidating the decision or blocking archiving/target maintenance. Report stale
source locations when relevant; never rewrite terminal bytes to refresh navigation. Every local
reference still stays inside the installation. Provider inventory paths and evidence hashes are
strict evidence, never treated as optional historical source links.
