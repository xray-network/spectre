<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

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

Root `SPECTRE.md` is the sole active lifecycle ledger, the target registry and the project-facing
implementation summary. Its Targets table holds every target identity and current source location;
its implementation subsections exist only for targets with live rows. Each archived implementation has its sole historical decision row in
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

The installation root is the folder that holds `.agents/spectre/`. Every local reference in a record,
ledger, manifest, or provider file stays inside that root. Official upstream URLs are provenance,
not local filesystem references. Active normative inputs must resolve; historical source locations
may be stale under the source-reference rules below. A reference that leaves it,
such as `../other-project/...`, an absolute path, or a symbolic link pointing outside, is invalid
even when the target exists, including another installation in the same repository. Check this
whenever a record is written, not only during archive.

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
Flat mode has exactly one registered repository target at `./`.

Implementation subsections name only their target ID; label and current Path live in the Targets
table alone. Historical instructions/source paths and archive Path fields remain snapshots; a
source-folder move never rewrites them. Target IDs and sequence ownership survive source renames.
Record and evidence paths remain governed by §3/§9 and cannot be moved by changing a Targets row.

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
