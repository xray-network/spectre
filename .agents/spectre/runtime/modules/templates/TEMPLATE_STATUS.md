# Ledger and target registry

Status-Template-Version: v1

Root SPECTRE.md is the sole live lifecycle ledger and the target registry. Archive manifests own
archived decision rows.

```markdown
# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: <flat|nested>

This is the sole live lifecycle ledger and target registry. Archived rows live in .agents/spectre/archive/ manifests.

## Targets

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `repository` | Repository | `./` | `ACTIVE` | Repository governance bootstrap |

## Implementations

### `repository`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `repository/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/repository/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
```

Targets: flat installations register their repository slug and label at ./ as the only target, and
their bootstrap links point directly into implementations/. Nested installations register repository
for governance; other targets are added by their first plan. Rows are unique and sorted by target
ID. Active paths exist, use ./ or ./path/, and are contained in the installation. A new project's
path may be absent until any of its records reaches REVIEW when its open plan creates it; retired
paths retain the last location and may be absent. Status is ACTIVE or RETIRED. Reason gives
registration context or explicit retirement/reactivation reason. Labels are plain text. Never store
record state, counters, inferred folder inventories or aliases. Every target ever used keeps its
row, with or without live rows.

Implementations: one subsection per target with live rows, headed by the target ID in backticks
(### `api`), ordered by target, rows by numeric ID. Add a subsection with its target's first live row and remove it when the last row is
archived. The Implementations heading stays when no subsection remains. No empty table,
per-target empty marker or discovered-folder subsection is canonical. Never delete the ledger.

Canonical table format, for this ledger and every new archive table:

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
- ID cells use qualified target/NNNN in backticks, with four digits. State and evidence-mode values
  use backticks. Instruction/result links match that identity and preserve their labels on archive.
- Title is a concise two-to-eight-word objective label without ending punctuation; evidence mode
  matches the instruction. One row links exactly one instruction and at most one matching result.
- States are PLANNED, REVIEW, ACCEPTED, REJECTED or CANCELLED. REVIEW/ACCEPTED/REJECTED require a
  result; started PLANNED links its partial result and describes unfinished work/checks honestly.
  Unstarted PLANNED and CANCELLED can use — when no result exists. Never delete an existing result.
- Decision or status gives the actual reason for state. Accept, reject and cancel use the proof
  shape in commands/decide.md; the bootstrap keeps its fixed proof; PLANNED and REVIEW rows
  describe the current work or blocker.
- Exactly one accepted bootstrap exists in live or archived history, never recreated after archive.
- IDs remain unique across live and archived records and are allocated above the sequence maximum.
  Flat mode has one sequence; nested mode has one per stable target. No stored next-ID counter.
- Every implementation subsection names a target with an ACTIVE Targets row, and every row ID in it
  belongs to that target. Retired targets have no live rows. Removing an empty subsection never
  removes a Targets row or historical records.
- Provider inventories, execution queues and global work plans do not belong in the ledger.
