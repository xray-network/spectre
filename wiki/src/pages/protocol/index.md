# Protocol releases

Release directories are immutable once published; installed copies remain pinned to their own
bytes. Installation pins a complete versioned URL. The default prompt starts from the
current-release mirror to discover that version; you can also choose a specific release directly.

The <a href="/spectre/SPECTRE-PROTOCOL.md">current-release mirror</a> is convenient for reading and
repository discovery. The build generates it directly from the latest versioned protocol source.

## 2.3.0

- <a href="/spectre/protocol/v2.3.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

A minor release; 2.x installations refresh in place without archiving.

- **No slash command by default.** The router moves from `.agents/skills/spectre/SKILL.md` to
  `.agents/spectre/ROUTER.md`, a plain file that no agent registers as a command. Installation adds
  no slash command; mention SPECTRE in natural language, such as `Spectre: list`, until you add one.
- **`addslash` and `removeslash`.** `/spectre addslash <host> [<host>...]` adds the slash command
  for Codex, Antigravity, Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenCode, or Windsurf;
  `removeslash` removes it. The adapter file is the only state: no ledger row, record, or log.
  Reload or restart the agent afterwards so it picks up the change.
- **Override log is informational.** An override now also updates the hashes and links that depend
  on what it changed, so the installation validates on its own. Its log moves to
  `.agents/spectre/logs/OVERRIDES.md`; nothing reads it, a `.gitignore` inside `logs/` keeps it out
  of Git, and you can wipe `logs/` at any time. The override proposes a commit message that carries
  your reason.
- **Tidier layout.** `ROUTER.md` is the only file at the top of `.agents/spectre/`. The protocol and
  templates move into `runtime/`: it holds only `SPECTRE-PROTOCOL.md` and `modules/`, where every
  generated module and template lives. No README is installed. Links in older records to the old
  protocol or template paths resolve to their new places.
- **Archives as is.** An archive is history: after it is written, nothing re-checks or repairs it.
  Broken links, moved paths, or changed hashes inside archives are information, never failures, and
  overrides no longer update them. Validation reads only manifest headers and rows.
- **Archive kinds and provider archive.** `archive` now names what it moves:
  `/spectre archive implementations [target]` works as `archive` did, and
  `/spectre archive providers <provider>...` moves whole providers that no active record uses into
  a dated archive. Bare `/spectre archive` still archives every finished implementation; forcing
  needs the full form, `/spectre archive implementations --force: <reason>`. For providers, `--force`
  only records existing defects. `implementations` and `providers` are reserved and can't be target
  names.
- **No migrations.** Evidence moves only through an override, which rewrites every reference to the
  moved file; `MIGRATIONS.md` and its lookup-based resolution are gone.
- **Upgrade.** An earlier router at `.agents/skills/spectre/SKILL.md` becomes the Codex adapter, so
  `$spectre` keeps working until `/spectre removeslash codex`. An existing `OVERRIDES.md` moves to
  `logs/` and stops being tracked.

## 2.1.0

- <a href="/spectre/protocol/v2.1.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

A minor release; 2.0.0 installations refresh in place without archiving.

- **Override.** `override <scope>: <changes> because <reason>` applies a human-ordered change outside
  the normal rules, such as renaming archived records or moving evidence. It is a human-only
  decision, never a queue item, and every changed file is logged with its hashes in
  `.agents/spectre/OVERRIDES.md`, which validation and reference resolution follow.

## 2.0.0

- <a href="/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

A major release. Existing installations archive under 1.0.0 before upgrading (see
[Versioning](../versioning)).

- **Installation boundary.** Every reference stays inside its installation. Anything from another
  project, including a sibling in the same monorepo, enters as a provider capture of its published
  interface; provider pins are always `SELF`.
- **Immovable evidence.** Capture and record files never move. An unavoidable, human-authorized move
  keeps the original and is recorded in `.agents/spectre/MIGRATIONS.md`.
- **Capture-first planning.** `plan` captures every provider it relies on before writing the
  instruction. A standalone `capture` tracks upstream changes between plans.
- **Forced archive.** `archive [target] --force: <reason>` closes open records as `CANCELLED` with the
  reason and lists existing defects in the manifest's `Known issues` instead of failing.
- **Canonical tables.** Ledgers and manifests use one exact table format with qualified
  `target/NNNN` IDs (`Status-Schema-Version: v2`, `Archive-Version: v2`).
- **Checks on every write.** Plan, implement, and revise verify every link they write; validation is
  a numbered checklist with exact pass conditions.
- **Recall.** `recall [target]: <question>` answers why something exists or what was decided,
  citing the records; it is read-only.
- **Simpler decisions.** A single-record decision may use the verbatim command and date as its
  proof; a batch needs a written proof.
- **Commands in every agent.** Optional host adapters register `/spectre` in Claude Code, Cursor,
  GitHub Copilot, Gemini CLI, and Windsurf; Codex keeps `$spectre`.
- **Versioning.** Releases are frozen once published. Patch and minor releases refresh in place;
  a major release archives first, and older archives are verified only by their hashes.

## 1.0.0

- <a href="/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

The initial release stores installed protocol data in `.agents/spectre/`, exposes the command
skill at `.agents/skills/spectre/SKILL.md`, and uses root `SPECTRE.md` as the sole active lifecycle ledger.
SPECTRE starts when each current-human message mentions its standalone name, including `/spectre`,
Codex's `$spectre`, `Spectre:`, or natural language such as `using Spectre`. The mention is
case-insensitive and may appear anywhere. Prior context and implementation follow-ups that omit the
name do not activate it. SPECTRE-mentioned batches perform bounded sequential work, including
required results and REVIEW updates for every selected item.
Commands accept natural-language record, target, and provider selectors, resolving them to canonical
identities and asking when the meaning is ambiguous.
Unversioned provider guides describe upstream sources, tracking and summarization. Each immutable
numbered capture contains a complete SNAPSHOT.md specification and an advisory CAPTURE.md summary.
The first stores the full selected artifact baseline; later captures store only new or changed
bytes and resolve unchanged evidence through explicit references to earlier files. `capture` includes
change detection and validation; no-change capture creates no directory or tracked writes. Validation
is an internal workflow requirement, not a standalone command. Plans
pin the numbered snapshot and hashes, preserving stable evidence without duplicate full trees.
The archive command moves terminal records and decision history into immutable batches while
preserving references and implementation IDs.
This release also defines explicit adoption rules for existing provider layouts; protocol source
updates never migrate an installation automatically. It is frozen as published.

The complete file contains marked runtime sections. Installation extracts shared rules and command
modules locally from the pinned protocol, with its SHA-256 in each header. Normal invocations load
only their declared dependencies. Separate runtime downloads are not published; adopting repositories
extract every module directly from the pinned protocol.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
