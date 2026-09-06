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
    ├── skills/
    │   └── spectre/
    │       └── SKILL.md
    └── spectre/
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
Protocol: [.agents/spectre/SPECTRE-PROTOCOL.md](.agents/spectre/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: flat

This is the sole active lifecycle ledger. Archived decision rows and record paths are preserved
under `.agents/spectre/archive/` once an archive exists.

## Beacon API implementation status

Target: beacon-api

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
| `0002` | Add health endpoint | [Instruction](.agents/spectre/implementations/0002-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0002-IMPL-RESULT.md) | `LOCAL` | Human reviewed the response format and passing endpoint checks. |
| `0003` | Add request logging | [Instruction](.agents/spectre/implementations/0003-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/0003-IMPL-RESULT.md) | `LOCAL` | Human verified request IDs and sensitive-field redaction. |
| `0004` | Add rate limiting | [Instruction](.agents/spectre/implementations/0004-IMPL-INSTR.md) | `REVIEW` | [Result](.agents/spectre/implementations/0004-IMPL-RESULT.md) | `LOCAL` | Implementation and checks recorded; awaiting human review. |
| `0005` | Add readiness endpoint | [Instruction](.agents/spectre/implementations/0005-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Plan recorded; implementation has not started. |
```

The ledger summarizes state and decisions; the linked instruction and result hold the detailed
scope, changes, checks, and evidence. You can refer to a record naturally, such as
`/spectre status the rate limiting change`, or directly with `/spectre status beacon-api/0004`.
