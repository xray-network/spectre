# Aggregate implementation status

Status-Template-Version: v1

Root SPECTRE.md is the sole live lifecycle ledger. Archive manifests own archived decision rows;
TARGETS.md owns target identity and current location. Create sections only for targets with rows.

```markdown
# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: <flat|nested>
Targets: [.agents/spectre/TARGETS.md](.agents/spectre/TARGETS.md)

This is the sole live lifecycle ledger. Archived rows live in .agents/spectre/archive/ manifests.

## <Label> implementation status

Target: <target>
Path: ./<current-owned-directory>/

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `<target>/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
```

The example bootstrap links are flat; nested bootstrap uses implementations/repository/ and Path
./. Other sections use their registered labels, IDs and current paths. Order sections by target,
rows by numeric ID. Add a section with its first PLANNED row; remove it when the last row is archived.
No empty table, per-target empty marker or discovered-folder section is canonical. Zero live rows
means metadata and the introductory sentence only, with no target sections. Never delete the ledger.

Canonical table format, for this ledger and every new archive/registry table:

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
- Every live section's Target/Path/label agrees with its ACTIVE registry row. Retired targets have
  no live rows. Removing an empty section never removes registry identity or historical records.
- Provider inventories, execution queues and global work plans do not belong in the ledger.
