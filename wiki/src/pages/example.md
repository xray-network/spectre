# Example repository

A fictional `beacon-api` project with XRAY/SPECTRE installed: two accepted product changes, one
implementation awaiting review, and one plan ready to start. This is a single application, so it
has one target, `beacon-api`, named after its folder, with one sequence of implementation IDs. All records use local repository evidence.

## Repository tree

Application files are abbreviated, and protocol setup files are omitted for clarity.
The implementation files below match the ledger in the next section.

```text
beacon-api/
├── .agents/
│   └── spectre/
│       ├── implementations/
│       │   └── beacon-api/
│       │       ├── 0001-IMPL-INSTR.md     # Install SPECTRE · ACCEPTED
│       │       ├── 0001-IMPL-RESULT.md
│       │       ├── 0002-IMPL-INSTR.md     # Add health endpoint · ACCEPTED
│       │       ├── 0002-IMPL-RESULT.md
│       │       ├── 0003-IMPL-INSTR.md     # Add request logging · ACCEPTED
│       │       ├── 0003-IMPL-RESULT.md
│       │       ├── 0004-IMPL-INSTR.md     # Add rate limiting · REVIEW
│       │       ├── 0004-IMPL-RESULT.md
│       │       └── 0005-IMPL-INSTR.md     # Add readiness endpoint · PLANNED
│       └── providers/                     # Empty: these changes use LOCAL evidence
├── src/
│   └── ...
├── AGENTS.md
├── package.json
├── README.md
└── SPECTRE.md
```

Each implemented change has an instruction and a result. Record `0005` has only an instruction
because implementation has not started. Record `0001` documents installation itself; its acceptance
comes from the human's installation request.

Accepted records stay in the live ledger until you explicitly archive them. This example has
no archive yet, so there is no `.agents/spectre/archive/` folder.

## SPECTRE.md

This is the complete text of the example's repository-root ledger. Its links are relative to
`beacon-api/SPECTRE.md`. Its record links point to the implementation files shown above.

```markdown
# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol-SHA256: <SHA-256 of the installed protocol>
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)

This is the live ledger: targets, providers and implementations. Archived rows live in the __archive folders' ARCHIVE.md files.

## Targets

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `beacon-api` | Beacon API | `./` | `ACTIVE` | Repository bootstrap |

## Providers

## Implementations

### `beacon-api`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `beacon-api/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/beacon-api/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/beacon-api/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
| `beacon-api/0002` | Add health endpoint | [Instruction](.agents/spectre/implementations/beacon-api/0002-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/beacon-api/0002-IMPL-RESULT.md) | `LOCAL` | Human command "Spectre accept the health endpoint: response format and endpoint checks look right" on 2026-10-14; reviewed beacon-api/0002@5b0e7a91c3d4. |
| `beacon-api/0003` | Add request logging | [Instruction](.agents/spectre/implementations/beacon-api/0003-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/beacon-api/0003-IMPL-RESULT.md) | `LOCAL` | Human decision "accept beacon-api/0003: request IDs and redaction verified" in spectre on 2026-10-21; reviewed beacon-api/0003@e81f40a27b6c. |
| `beacon-api/0004` | Add rate limiting | [Instruction](.agents/spectre/implementations/beacon-api/0004-IMPL-INSTR.md) | `REVIEW` | [Result](.agents/spectre/implementations/beacon-api/0004-IMPL-RESULT.md) | `LOCAL` | Implementation and checks recorded; awaiting human review. |
| `beacon-api/0005` | Add readiness endpoint | [Instruction](.agents/spectre/implementations/beacon-api/0005-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Plan recorded; implementation has not started. |
```

The Targets table registers every target with its label, source folder and status, whether or not
it has live rows. Below it, each target with live rows has one subsection. The linked instruction
and result hold the detailed scope, changes, checks, and evidence. You can refer to a record
naturally, such as `Spectre status the rate limiting change`, or directly with
`Spectre status beacon-api/0004`.

Archiving records 0001–0003 moves their files to
`.agents/spectre/implementations/__archive/<timestamp>/beacon-api/` and their rows into that folder's
`ARCHIVE.md`, while 0004–0005 stay live. Once all records are
terminal and archived, the ledger keeps its Targets table and an empty `## Implementations`
heading; the target remains registered and its next implementation still receives 0006.
