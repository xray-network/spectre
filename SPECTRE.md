# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)
Status-Schema-Version: v1
Storage-Mode: nested
Targets: [.agents/spectre/TARGETS.md](.agents/spectre/TARGETS.md)

This is the sole live lifecycle ledger. Archived rows live in .agents/spectre/archive/ manifests.

## Harness implementation status

Target: harness
Path: ./harness/

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `harness/0001` | Review ledger decisions locally | [Instruction](.agents/spectre/implementations/harness/0001-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Planned for SPECTRE 2.x; blocked until revised against SPECTRE 1.0.0. |

## Repository implementation status

Target: repository
Path: ./

### Implementation ledger

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `repository/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/repository/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
