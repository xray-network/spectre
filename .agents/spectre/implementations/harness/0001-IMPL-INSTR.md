# Harness implementation 0001 instruction

Implementation-Version: v1
Implementation-ID: harness/0001
Target-Path: ./harness/
Created: 20261111T100920Z
Evidence-Mode: LOCAL
Depends-On: NONE
Provider-Evidence: NONE

## Inputs and authority

| Input | Kind | Required | Purpose |
| --- | --- | --- | --- |
| Current human request to plan a Node-only SPECTRE harness: a `spectre` CLI whose first release shows the ledger and records human decisions in a local web UI, with AI-driven planning and implementation added later. | `LOCAL` | Yes | Authorize the objective, the `harness` target, the command names, and the no-dependency constraint. |
| [Pinned SPECTRE protocol](../../runtime/SPECTRE-PROTOCOL.md) | `LOCAL` | Yes | Define the ledger format, selectors, lifecycle, decision workflow, and archive manifests the harness reads and writes. |
| [SPECTRE protocol v1.0.0 source](../../../../protocol/v1.0.0/SPECTRE-PROTOCOL.md) | `LOCAL` | Yes | Supported protocol release; byte-identical to the pinned copy. |
| [Repository README](../../../../README.md) | `LOCAL` | Yes | Repository identity, published resources, and the place to document the harness. |
| [Repository ignore rules](../../../../.gitignore) | `LOCAL` | Yes | Keep dependencies, build output, and secrets out of the harness. |
| [Repository license](../../../../LICENSE) | `LOCAL` | Yes | License copied into the harness package. |

## Provider pins

NONE

## Objective

Create the `harness/` Node CLI that lists SPECTRE records and records human accept, reject, and
cancel decisions from the terminal or a local web UI, without dependencies.

## Changes to implement

| Change ID | Requirement | Compatibility | Local owner | Validation |
| --- | --- | --- | --- | --- |
| C01 | Create the package: `harness/package.json` (`@xray-network/spectre`, version `0.1.0`, `"private": true`, `"type": "module"`, `"license": "MIT"`, `bin` `spectre` → `bin/spectre.mjs`, `engines.node` `>=22`, scripts `test` and `start`), `harness/LICENSE` as a byte copy of the root `LICENSE`, and `harness/README.md`. No `dependencies` or `devDependencies`; only `node:` built-in modules. | Nothing outside `harness/` imports it; the protocol and docs are unchanged. | `harness/package.json`, `harness/LICENSE`, `harness/README.md` | Package has no dependency fields; every import starts with `node:` or `./`/`../`; `cmp LICENSE harness/LICENSE`. |
| C02 | Read an installation: find the root by walking up from the working directory to `SPECTRE.md` or use `--root <dir>`; parse the ledger header, target sections, and canonical rows; parse every `.agents/spectre/archive/*/ARCHIVE.md` manifest's target sections, rows, and record paths. Support `Protocol-Version` 2.0.0 and 2.1.0 with `Status-Schema-Version: v2`; any other version stops with a clear error. | Read-only. Parsing follows the §11 canonical table format, including empty sections with `No implementation records.`. | `harness/lib/ledger.mjs`, `harness/lib/archive.mjs` | Unit tests for flat and nested ledgers, empty sections, archive manifests v1 and v2, unsupported versions, and non-canonical rows. |
| C03 | Selectors: qualified IDs (`target/NNNN`), a range within one target (`target/NNNN..NNNN`), comma-separated lists, and a bare `NNNN` only when it matches exactly one target. Natural-language selectors stay with agents. | Same resolution as §1 for the forms supported; ambiguity is an error, never a guess. | `harness/lib/selectors.mjs` | Tests for each form, ambiguous bare IDs, unknown targets, archived IDs, duplicates. |
| C04 | Read commands: `spectre status <record>` (active ledger, then archives; prints ID, title, state, decision proof, and record locations), `spectre list [target] [state] [--archived]`, `spectre help [command]`, and `spectre --version`. | Never writes. Output wording follows the `/spectre status` and `/spectre list` definitions. | `harness/bin/spectre.mjs`, `harness/lib/commands/` | Tests compare output for a fixture installation; a run leaves every file's SHA-256 unchanged. |
| C05 | Decision commands: `spectre accept <records>[: <proof>]`, `spectre reject <records>[: <proof>]`, `spectre cancel <records>[: <reason>]`, implementing the §9 decision workflow: accept/reject only `REVIEW` rows with a matching instruction and result; cancel only `PLANNED` rows; the instruction's and result's `Implementation-ID` match the row; the whole set is resolved and checked before any write, and one ineligible record changes nothing. A single record without proof records `Human command "spectre accept <id>" on <YYYY-MM-DD>.` (UTC date); two or more records require a human proof. A proof containing `|` or a line break is refused. | Changes only the State and Decision proof cells of the selected rows, in one write of `SPECTRE.md`. Record files, other rows, and every other file stay unchanged. | `harness/lib/decide.mjs`, `harness/lib/commands/` | Tests for each state transition, refused transitions, missing result, mismatched `Implementation-ID`, batch without proof, proof with `|`, and a byte diff limited to the selected cells. |
| C06 | Safe writes: read `SPECTRE.md` and its SHA-256 at preflight; re-read immediately before writing and stop if the hash changed; write to a temporary file in the same folder and rename it; re-read after the rename and verify that only the selected cells changed, otherwise restore the previous bytes when the file still holds this write. | Protects against an agent writing the ledger at the same time. | `harness/lib/decide.mjs`, `harness/lib/fsx.mjs` | Tests that change the ledger between preflight and write, and that inject a failed verification. |
| C07 | `spectre ui [--port 4590] [--open]`: a `node:http` server bound to `127.0.0.1` that serves the static UI and a JSON API. Reads: parsed ledger and archives, and the Markdown of records linked from them. Writes: only the C05 decisions. Pushes reloads over Server-Sent Events when `SPECTRE.md` or `.agents/spectre/` changes (`fs.watch`). Runs in the foreground; Ctrl+C closes it. | No other write endpoint exists. Decisions made in the UI use the same C05 rules and C06 writes; a single record without proof records `Human decision "accept <id>" in SPECTRE harness on <YYYY-MM-DD>.` | `harness/lib/server.mjs`, `harness/lib/commands/ui.mjs` | Integration tests start the server on a free port against a fixture installation and exercise every endpoint. |
| C08 | Server safety: reject requests whose `Host` is not `127.0.0.1:<port>` or `localhost:<port>`; require a per-process random token header and a matching `Origin` on every write; serve only files under `harness/ui/` and `.md` files under `SPECTRE.md` and `.agents/spectre/` reached through ledger or manifest links; refuse `..`, absolute paths, symbolic links that leave the root, and every other file. | Secrets and product source are never readable through the server. | `harness/lib/server.mjs` | Tests for a wrong `Host`, a missing or wrong token, a foreign `Origin`, path traversal, a `.env` request, and a symbolic link out of the root. |
| C09 | UI: plain HTML, CSS, and JavaScript modules in `harness/ui/` with no build step and no network requests. Target list with state counts; records filterable by target and state, with an archived view; a record view that renders the instruction and result; Accept, Reject, and Cancel on eligible rows; multi-select with a required proof field; a confirmation showing the exact cells that will change; light and dark themes. Markdown is rendered by a small local renderer (headings, paragraphs, lists, tables, code, links) that escapes all HTML and allows only relative and `https:` links. | Decision buttons appear only where C05 allows them. | `harness/ui/` | Renderer unit tests (escaping, `javascript:` links, tables); manual run against a copy of this repository's installation. |
| C10 | Document the harness: `harness/README.md` (install-free run with `node harness/bin/spectre.mjs`, every command, UI safety, supported protocol versions, decision-proof wording) and a short Harness section in the root `README.md`. | Docs site pages are out of scope. | `harness/README.md`, `README.md` | Every command in the README runs as shown against a fixture installation. |

## Implementation steps

1. Create the package skeleton, license copy, and CLI entry point with `help` and `--version` (C01).
2. Implement installation discovery, ledger and archive parsing, and selectors with unit tests (C02, C03).
3. Implement `status` and `list` (C04).
4. Implement decisions and safe writes with tests for every refusal path (C05, C06).
5. Implement the server, its safety checks, and the UI (C07–C09).
6. Write the documentation (C10).
7. Run the validation below, write the result, and move the row to `REVIEW`.

## Validation

- `cd harness && npm test` (runs `node --test`), with no network access and no installed packages.
- `node --check` passes for every `.mjs` file under `harness/`.
- `grep` confirms that `harness/package.json` has no `dependencies` or `devDependencies` and that every
  import is a `node:` module or a relative path.
- On a temporary copy of this repository's installation: `status`, `list`, and `list --archived`
  change no file; accepting, rejecting, and cancelling a fixture record changes only its State and
  Decision proof cells; the UI loads, renders a record, and records a decision.
- The SPECTRE installation in this repository still passes validation, and the protocol files and
  `docs/` are unchanged.

## Compatibility and human review

- The harness is a new, optional tool. The protocol stays the source of truth, and agents continue
  to follow it without the harness.
- The decision workflow requires the current human to invoke the decision explicitly. A human typing
  `spectre accept` or confirming a decision in the local UI is that invocation; the recorded proof
  names the harness. A later protocol release may state this explicitly; that change belongs to the
  `protocol` target and is not part of this plan.
- The default UI port `4590` and the package name `@xray-network/spectre` are new choices for human review.

## Completion criteria

All changes C01–C10 are implemented, every validation check passes, and the result records the
actual test output.

## Out of scope

- Full §13 validation (`spectre validate`), `plan`, `implement`, `revise`, `archive`, `capture`,
  `override`, `recall`, and any AI API access.
- Editing record files or any write other than C05 decisions.
- Publishing to npm, protocol text changes, and docs site pages.

## Blockers

This plan was written for SPECTRE 2.0.0 and 2.1.0 (Status-Schema-Version v2, no target registry,
no publication order, earlier decision-proof wording). Revise it against SPECTRE 1.0.0 before
implementation.
