# Example repository

A fictional `beacon-api` project with SPECTRE installed: two accepted product changes, one
implementation awaiting review, and one plan ready to start. This is a single application, so it
uses flat storage and one sequence of implementation IDs. All records use local repository evidence.

## Repository tree

Application files are abbreviated, and protocol setup files are omitted for clarity.
The implementation files below match the ledger in the next section.

```text
beacon-api/
├── AGENTS.md
├── README.md
├── SPECTRE.md
├── package.json
├── src/
│   └── ...
└── .agents/
    └── spectre/
        ├── TARGETS.md               # Stable target identity and current source path
        ├── implementations/
        │   ├── 0001-IMPL-INSTR.md     # Install SPECTRE · ACCEPTED
        │   ├── 0001-IMPL-RESULT.md
        │   ├── 0002-IMPL-INSTR.md     # Add health endpoint · ACCEPTED
        │   ├── 0002-IMPL-RESULT.md
        │   ├── 0003-IMPL-INSTR.md     # Add request logging · ACCEPTED
        │   ├── 0003-IMPL-RESULT.md
        │   ├── 0004-IMPL-INSTR.md     # Add rate limiting · REVIEW
        │   ├── 0004-IMPL-RESULT.md
        │   └── 0005-IMPL-INSTR.md     # Add readiness endpoint · PLANNED
        └── providers/                # Empty: these changes use LOCAL evidence
```

Each implemented change has an instruction and a result. Record `0005` has only an instruction
because implementation has not started. Record `0001` documents installation itself; its acceptance
comes from the human's installation request.

Accepted records stay in the active ledger until you explicitly archive them. This example has
no archive yet, so there is no `archive/` directory.

## SPECTRE.md

This is the complete text of the example's repository-root ledger. Its links are relative to
`beacon-api/SPECTRE.md`. Its record links point to the implementation files shown above.

```markdown
# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: flat
Targets: [.agents/spectre/TARGETS.md](.agents/spectre/TARGETS.md)

This is the sole live lifecycle ledger. Archived rows live in .agents/spectre/archive/ manifests.

## Beacon API implementation status

Target: beacon-api
Path: ./

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `beacon-api/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
| `beacon-api/0002` | Add health endpoint | [Instruction](.agents/spectre/implementations/0002-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0002-IMPL-RESULT.md) | `LOCAL` | Human command "Spectre accept the health endpoint: response format and endpoint checks look right" on 2026-10-14; reviewed beacon-api/0002@5b0e7a91c3d4. |
| `beacon-api/0003` | Add request logging | [Instruction](.agents/spectre/implementations/0003-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0003-IMPL-RESULT.md) | `LOCAL` | Human decision "accept beacon-api/0003: request IDs and redaction verified" in spectre on 2026-10-21; reviewed beacon-api/0003@e81f40a27b6c. |
| `beacon-api/0004` | Add rate limiting | [Instruction](.agents/spectre/implementations/0004-IMPL-INSTR.md) | `REVIEW` | [Result](.agents/spectre/implementations/0004-IMPL-RESULT.md) | `LOCAL` | Implementation and checks recorded; awaiting human review. |
| `beacon-api/0005` | Add readiness endpoint | [Instruction](.agents/spectre/implementations/0005-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Plan recorded; implementation has not started. |
```

The ledger summarizes state and decisions; the linked instruction and result hold the detailed
scope, changes, checks, and evidence. You can refer to a record naturally, such as
`/spectre status the rate limiting change`, or directly with `/spectre status beacon-api/0004`.

## Target registry

The source path is independent of whether this target currently has live rows:

```markdown
# SPECTRE targets

Target-Schema-Version: v1

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `beacon-api` | Beacon API | `./` | `ACTIVE` | Repository bootstrap |
```

Archiving records 0001–0003 removes those rows while retaining 0004–0005. Once all records are
terminal and archived, the live ledger contains metadata only; the target remains registered and
its next implementation still receives 0006. No empty target section or per-folder marker remains.
