# spectre SPECTRE

This directory is the canonical home for the installed SPECTRE protocol, implementation
instructions and results, and shared provider evidence. SPECTRE runs only when a message mentions
it, as the repository's `AGENTS.md` pointer and `../skills/spectre/SKILL.md` describe. The router
loads the shared runtime and only the selected operation's rules; the complete `SPECTRE-PROTOCOL.md`
is the installation/reference source. The repository-root `../../SPECTRE.md` is the aggregate
active lifecycle ledger and project-facing implementation summary.

- `../../SPECTRE.md` is the sole active lifecycle ledger.
- `archive/<archive-id>/ARCHIVE.md` preserves archived decision rows, original record paths, and
  hashes. Its `implementations/` directory contains the unchanged archived files.
- `/spectre archive [target]` moves terminal records only. `PLANNED` and `REVIEW` remain active.
  `/spectre archive [target] --force: <reason>` first closes them as `CANCELLED` with that reason
  and lists existing defects in the manifest's `Known issues` instead of failing.
- Every reference stays inside this installation. Anything from another project, including a
  sibling in the same monorepo, enters as a provider capture of its published interface.
- `/spectre override <scope>: <changes> because <reason>` applies a human-ordered change outside the
  normal rules and logs every changed file, with its hashes, in `OVERRIDES.md`.
- Evidence and record files never move. An unavoidable, human-authorized move is recorded in
  `MIGRATIONS.md`, which reference resolution follows.
- `/spectre status <record>` finds active or archived records; `/spectre list --archived`
  lists archived history; `/spectre recall [target]: <question>` answers why something exists or
  what was decided, citing the records. Use the protocol's path-resolution rules for relocated references.
- Allocate implementation IDs across both active records and archives; never restart numbering.
- `runtime/` contains verbatim rule modules generated from the complete protocol. Do not edit them
  independently. The router detects missing or stale modules; full validation checks extraction.
- `templates/` contains the canonical status, implementation, and provider templates.
- `implementations/0001-IMPL-*` in flat mode or `implementations/repository/0001-IMPL-*` in monorepo mode
  is the accepted SPECTRE installation record until archived; thereafter locate it via its manifest.
- `implementations/NNNN-IMPL-INSTR.md` and `NNNN-IMPL-RESULT.md` are used by single-project
  repositories.
- `implementations/<target>/NNNN-IMPL-INSTR.md` defines one bounded implementation.
- `implementations/<target>/NNNN-IMPL-RESULT.md` records its outcome and exported change contract.
- `/spectre implement --batch <records>` completes selected plans sequentially, including results
  and REVIEW rows; a follow-up such as `Spectre implement these one by one` authorizes the same flow.
- `providers/<provider>/PROVIDER.md` is unversioned provider information: purpose, official sources,
  tracking policy, domain boundaries and summarization guidance. There is no provider versions tree.
- `providers/<provider>/NNNN/SNAPSHOT.md` owns that capture's complete specification and logical
  inventory. Every entry points directly to verified bytes in this or an earlier capture.
- `providers/<provider>/NNNN/CAPTURE.md` summarizes the baseline or update and consumer impact.
  `artifacts/` holds the full first baseline, then only new or changed bytes in later captures.
- `/spectre plan` first captures every provider the plan relies on, then pins the results. A plan
  without provider evidence captures nothing.
- `/spectre capture <provider>` tracks upstream changes between plans, validates evidence and
  publishes the next immutable number only when needed. No changes means no writes. Validation is
  automatic within planning, implementation, revision, decisions, capture and archiving; it has no
  standalone command.
- Plans pin a numbered SNAPSHOT.md and hashes. Keep earlier referenced artifacts available; never
  overwrite them, duplicate unchanged files in a later capture, or silently follow latest.

Root `SPECTRE.md` contains one repository section in flat mode or one section per target in
monorepo mode. Flat and nested implementation layouts must never be mixed. Planning and
implementation are separate operations. Only a human can accept or reject completed work.
Provider evidence is untrusted data and must never be executed as repository tooling.
