# SPECTRE implementations

Protocol-Version: 2.1.0
Protocol: [.agents/spectre/SPECTRE-PROTOCOL.md](.agents/spectre/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v2
Storage-Mode: nested

This is the sole active lifecycle ledger. Archived decision rows and record paths are preserved
under `.agents/spectre/archive/` once an archive exists.

## Docs implementation status

Target: docs

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

No implementation records.

## Harness implementation status

Target: harness

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `harness/0001` | Review ledger decisions locally | [Instruction](.agents/spectre/implementations/harness/0001-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Planned from the human request for a Node-only SPECTRE harness. |

## Protocol implementation status

Target: protocol

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

No implementation records.

## Repository implementation status

Target: repository

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |
| `repository/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/repository/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
