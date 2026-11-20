# Ledger and target registry

SPECTRE.md in the installation root is the live lifecycle ledger, the target registry and the
provider registry. Each archive folder's ARCHIVE.md holds the rows that left it. Both use the
canonical table format below.

```markdown
# SPECTRE implementations

Protocol-Version: <Protocol-Version of the installed protocol>
Protocol-SHA256: <SHA-256 of the installed protocol>
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)

This is the live ledger: targets, providers and implementations. Archived rows live in the __archive folders' ARCHIVE.md files.

## Targets

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `repository` | Repository | `./` | `ACTIVE` | Repository governance bootstrap |

## Providers

## Implementations

### `repository`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `repository/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/repository/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
```

Targets: a single project registers its one target at ./, named after its folder, which holds the
bootstrap. A monorepo registers repository at ./ for governance; other targets are added by their
first plan. The example above is a monorepo's. Rows are unique and sorted by target
ID. Active paths exist, use ./ or ./path/, and are contained in the installation. A new project's
path may be absent until any of its records reaches REVIEW when its open plan creates it; retired
paths retain the last location and may be absent. Status is ACTIVE or RETIRED. Reason gives
registration context or explicit retirement/reactivation reason. Labels are plain text. Never store
record state, counters, inferred folder inventories or aliases. Every target ever used keeps its
row, with or without live rows.

Providers: one subsection per live provider, sorted by slug, under a heading that stays when
there are none (as in the installation example). Name each subsection by the provider slug in
backticks and link its guide, which owns the source and tracking policy. Each published capture
has one row, sorted by numeric ID. A prepared provider without captures has `No captures yet.`
after its guide link. Example with two captures:

```markdown
## Providers

### `uplc`

[Provider guide](.agents/spectre/providers/uplc/PROVIDER.md)

| Capture | Captured | Upstream | Snapshot | Summary | Pinned by |
| --- | --- | --- | --- | --- | --- |
| `uplc/0001` | 2026-07-27 | `1.66.0.0` | [Snapshot](.agents/spectre/providers/uplc/0001/SNAPSHOT.md) | [Summary](.agents/spectre/providers/uplc/0001/CAPTURE.md) | — |
| `uplc/0002` | 2026-09-09 | `1.68.0.0` | [Snapshot](.agents/spectre/providers/uplc/0002/SNAPSHOT.md) | [Summary](.agents/spectre/providers/uplc/0002/CAPTURE.md) | `typescript/0029` |
```

Capture is the qualified provider/NNNN ID; the highest numeric ID is the latest. Captured is the
UTC date from SNAPSHOT.md's Created. Upstream displays the first available value of Source-Tag,
Source-Commit and Source-SHA256 in backticks, treating NONE as absent and using — if all are absent.
Snapshot and Summary link SNAPSHOT.md and CAPTURE.md for that exact ID. Pinned by lists the unique
qualified IDs of live implementations that pin that exact capture, comma-separated and sorted,
or —. A record pinning several captures appears in each of those rows. Preparation creates the
subsection, capture appends its row, plan and revise update the affected Pinned by cells, and
archiving a record removes its ID from those cells. Sync rebuilds the live provider subsections
from their validated files and live instruction pins.

Implementations: one subsection per target with live rows, headed by the target ID in backticks
(### `api`), ordered by target, rows by numeric ID. Add a subsection with its target's first live row and remove it when the last row is
archived. The Implementations heading stays when no subsection remains. No empty table,
per-target empty marker or discovered-folder subsection is canonical. Never delete the ledger.

Each archive's `__archive/<archive-id>/ARCHIVE.md`, written once by the archive that created it:

```markdown
# SPECTRE archive <archive-id>

Rows moved from SPECTRE.md on YYYY-MM-DD. Links name the archived files in this folder.

## Implementations

### `<target>`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
```

A provider archive has `## Providers` with the same subsections and capture columns. The guide,
snapshot and summary links are relative to the archive ledger and name the archived files.
Capture cells keep their values at archiving, including the recorded Pinned by lists. For an
archive that recorded pins only for the whole provider, use — in the capture rows and preserve
the original list after the table as `Recorded provider pins at archive time: <IDs>.` That note
means no per-capture list was recorded. An ARCHIVE.md is edited only by an explicit upgrade,
absorb, detach or override after publication.

Canonical table format, for SPECTRE.md and every ARCHIVE.md:

- Each header/separator/row is one line starting | followed by a space, ending with a space and |,
  and separating cells with ` | ` (ordinary ASCII spaces and pipe). Separator cells are ---;
  no padding/alignment spaces. Cells are never empty; use — for an absent value.
- Escaping: a literal pipe inside a cell is written \|. A literal backslash never directly precedes
  a literal pipe (insert a space). A cell contains no tab or line break; a line break in human text
  becomes one space. Parsers split a row on ` | ` whose pipe is not preceded by a backslash, then
  replace \| with a pipe; every other backslash is literal. This renders correctly in GitHub
  Markdown, so escaped cells read as the original text.
- Metadata lines are `Name: value`, one space after the colon, in the template's order, before the
  first section heading. Unknown metadata fields are errors, not extensions.
- ID and Capture cells use qualified target/NNNN and provider/NNNN respectively, in backticks
  with four digits. State and evidence-mode values use backticks. Instruction/result links match
  their implementation ID, and snapshot/summary links match their capture ID.
- Title is a concise two-to-eight-word objective label without ending punctuation; evidence mode
  matches the instruction. One row links exactly one instruction and at most one matching result.
- States are PLANNED, REVIEW, ACCEPTED, REJECTED or CANCELLED. REVIEW/ACCEPTED/REJECTED require a
  result; started PLANNED links its partial result and describes unfinished work/checks honestly.
  Unstarted PLANNED and CANCELLED can use — when no result exists. Never delete an existing result.
- Decision or status gives the actual reason for state. Accept, reject and cancel use the proof
  shape in commands/decide.md; the bootstrap keeps its fixed proof; PLANNED and REVIEW rows
  describe the current work or blocker.
- Exactly one accepted bootstrap exists across SPECTRE.md and every ARCHIVE.md, never recreated
  after archive.
- IDs remain unique across live and archived records and are allocated above the sequence maximum.
  Each target has its own sequence. No stored next-ID counter.
- Every implementation subsection names a target with an ACTIVE Targets row, and every row ID in it
  belongs to that target. Retired targets have no live rows. Removing an empty subsection never
  removes a Targets row or historical records.
- The ledger's provider subsections hold only the guide link and capture columns above. Provider
  inventories and capture details live in the snapshot and summary. Execution queues and global
  work plans do not belong in the ledger.
