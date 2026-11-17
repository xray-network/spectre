# SPECTRE implementations

Protocol-Version: 1.0.0
Protocol-SHA256: 1ae4c43cd1f1ad8e6cc942c5b573490f5cd3e332ff3acda5e920cfd2186a33f5
Protocol: [.agents/spectre/runtime/SPECTRE-PROTOCOL.md](.agents/spectre/runtime/SPECTRE-PROTOCOL.md)
Storage-Mode: nested

This is the sole live lifecycle ledger and target registry. Archived rows live in .agents/spectre/archive/ manifests.

## Targets

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `harness` | Harness | `./harness/` | `ACTIVE` | Registered by harness/0001, which creates this new project |
| `repository` | Repository | `./` | `ACTIVE` | Repository governance bootstrap |

## Implementations

### `harness`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `harness/0001` | Review ledger decisions locally | [Instruction](.agents/spectre/implementations/harness/0001-IMPL-INSTR.md) | `PLANNED` | — | `LOCAL` | Needs revise after upgrade to 1.0.0. Planned for SPECTRE 2.x. |

### `repository`

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |
| `repository/0001` | Install SPECTRE | [Instruction](.agents/spectre/implementations/repository/0001-IMPL-INSTR.md) | `ACCEPTED` | [Result](.agents/spectre/implementations/repository/0001-IMPL-RESULT.md) | `LOCAL` | Human requested installation of SPECTRE. |
