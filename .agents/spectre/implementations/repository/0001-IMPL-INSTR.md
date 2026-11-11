# Repository implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: repository/0001
Created: 20261111T100848Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request to install SPECTRE 2.1.0 in the spectre repository. | `LOCAL` | Yes | Authorize installation and the bootstrap acceptance exception. |
| [Pinned SPECTRE protocol](../../SPECTRE-PROTOCOL.md) | `LOCAL` | Yes | Define installation, runtime extraction, canonical content, and validation. |
| [Repository README](../../../../README.md) | `LOCAL` | Yes | Establish repository identity and structure. |

## Objective

Install SPECTRE 2.1.0 in the spectre repository and validate its tracking structure.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Install the pinned protocol, generated runtime, canonical templates, README, command router, and repository pointer. | Preserve product behavior and unrelated repository instructions. | `.agents/spectre/`, `.agents/skills/spectre/`, `AGENTS.md` | Verify canonical bytes, runtime headers, file inventory, and the ledger. |

## Implementation steps

1. Install and verify the SPECTRE 2.1.0 tracking runtime.
2. Create the aggregate ledger in monorepo mode.
3. Validate the installed structure.

## Validation

- Verify the protocol SHA-256 and all 18 generated runtime modules.
- Verify the three canonical templates, the command router, the README, and the `AGENTS.md` pointer.

## Compatibility and human review

Installation changes no product source.

## Completion criteria

SPECTRE 2.1.0 is installed in the repository and validation passes.

## Out of scope

Product implementation, provider capture, and any lifecycle decision not explicitly authorized by the current human.

## Blockers

None.
