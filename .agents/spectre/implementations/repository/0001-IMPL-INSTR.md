# Repository implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: repository/0001
Target-Path: ./
Created: 20261111T100848Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request to install SPECTRE and to migrate this installation to 1.0.0. | `LOCAL` | Yes | Authorize installation and the bootstrap acceptance exception. |
| [Pinned SPECTRE protocol](../../runtime/SPECTRE-PROTOCOL.md) | `LOCAL` | Yes | Define installation, runtime extraction, canonical content, and validation. |
| [Repository README](../../../../README.md) | `LOCAL` | Yes | Establish repository identity and structure. |

## Provider pins

NONE

## Objective

Install SPECTRE 1.0.0 in the spectre repository and validate its tracking structure.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Install the pinned protocol, extracted runtime modules and templates, command router, target registry, ledger and `AGENTS.md` pointer. | Preserve product behavior and unrelated repository instructions. | `.agents/spectre/`, `SPECTRE.md`, `AGENTS.md` | Full installation validation (§13). |

## Implementation steps

1. Install the pinned SPECTRE 1.0.0 protocol and extract its runtime modules and templates.
2. Create the router, target registry and nested-mode ledger, and add the `AGENTS.md` pointer.
3. Validate the complete installation.

## Validation

- Verify the protocol SHA-256 and that all 25 runtime modules and four templates equal extraction.
- Verify the router, `AGENTS.md` pointer, registry, ledger and record identities.

## Compatibility and human review

Installation changes no product source.

## Completion criteria

SPECTRE 1.0.0 is installed in the repository and full validation passes.

## Out of scope

Product implementation, provider capture, and any lifecycle decision not explicitly authorized by the current human.

## Blockers

None.
