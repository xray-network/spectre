<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

| Syntax | Operation and stopping boundary |
| --- | --- |
| `/spectre plan <target>: <objective>` | Run the §8 planning workflow for one target: first capture every existing provider the plan relies on, then create the instruction and `PLANNED` row, and stop without modifying product source. A plan that relies on no provider captures nothing. |
| `/spectre implement <record>` | Run the §9 implementation workflow for the identified `PLANNED` record, validate it, write its result, move it to `REVIEW`, and stop. |
| `/spectre implement --batch <records>` | Resolve a fixed set of existing plans and run §9 sequentially, completing each result and `REVIEW` transition before the next item. Stop on a blocker or after the selected set; never accept work automatically. |
| `/spectre revise <record>: <changes>` | Run the §9 revision workflow for one identified active record. Refine a `PLANNED` instruction without modifying product source and keep it `PLANNED`, or change a `REVIEW` implementation within its instruction, update its result, and keep it `REVIEW`. Then stop. |
| `/spectre status <record>` | Find the unique record in the active ledger or archives, read its row, instruction, and result when present, and report status and location without changing files or state. |
| `/spectre recall [target]: <question>` | Answer a question about past work from the active ledger and archives, citing the records that support each statement, without changing files or state. |
| `/spectre list [target] [state] [--archived]` | List active-ledger records by default, or archived records only with `--archived`. Optional target and state arguments filter that set; no arguments include every target and state in the active ledger. |
| `/spectre accept <records>: <proof>` | Resolve one or a bounded set of `REVIEW` records and record the current human's acceptance in only their matching ledger decision fields. |
| `/spectre reject <records>: <proof>` | Resolve one or a bounded set of `REVIEW` records and record the current human's rejection in only their matching ledger decision fields. |
| `/spectre cancel <records>: <reason>` | Resolve one or a bounded set of `PLANNED` records and record the human-authorized cancellation in only their matching ledger decision fields. |
| `/spectre archive [target]` | Run the §9 archive workflow for all targets or one selected target, move only terminal implementations and their ledger rows into a dated archive, preserve active work, validate, and stop. |
| `/spectre archive [target] --force: <reason>` | Run the §9 forced archive: close every `PLANNED` and `REVIEW` record in scope as `CANCELLED` with the human reason, archive every terminal record, list existing defects in the manifest instead of failing, and stop. |
| `/spectre override <scope>: <changes> because <reason>` | Run the §9 override: apply exactly the human's requested change to the named SPECTRE files, even where it breaks other SPECTRE rules, log every changed file with its hashes in `OVERRIDES.md`, validate, and stop. |
| `/spectre capture <provider>` | Run only §12 to track upstream changes between plans: publish a numbered full baseline or incremental capture; unchanged evidence creates no folder or tracked writes. Do not create or implement a target record. Planning captures its own providers, so a standalone capture is never a planning prerequisite. |
| `/spectre help [operation]` | Report every command, or one named operation, with its syntax, purpose, and stopping boundary without changing tracked files or lifecycle state. |

`help` reads only the router, shared core, and its command module. Its unqualified form reports every command in the table;
its qualified form reports one command. If the command name is unknown, report that it is not
recognized and suggest `/spectre help` without selecting or running another operation.

Unqualified help also explains that a current-human message mentioning SPECTRE may queue multiple
explicitly stated non-decision operations in natural language without another command,
and that accept, reject, and cancel remain standalone commands that may select a bounded eligible
record set; forced archive and override are standalone human decisions too.

Record, target, and provider selectors accept IDs/slugs or natural descriptions. A unique match
resolves to its canonical identity; bounded plural record selectors are also valid for implementation
and decision batches. Ambiguity or missing decision proof requires clarification. Examples:
`/spectre status last implementation`, `/spectre reject the login change: missing checks`, and
`/spectre accept the three implementations just completed: reviewed their results and checks`.
Describing a target never authorizes another operation or bypasses its state requirements.
