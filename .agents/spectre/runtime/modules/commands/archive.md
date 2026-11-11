<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

### Archive workflow

Run only for one of these forms or its host-native equivalent:

```text
/spectre archive
/spectre archive implementations [target] [--force: <reason>]
/spectre archive providers <provider> [<provider>...] [--force: <reason>]
```

The word after `archive` names the kind. Bare `/spectre archive` is the short form of
`/spectre archive implementations` for all targets and accepts no target or flag. Any other word
after `archive`, such as a target slug or `--force`, is not a kind: ask whether the human meant
`/spectre archive implementations ...` and change nothing. Each run archives one kind into one new
batch.

Rules for both kinds:

- An archive moves files unchanged. It never rewrites their bytes, creates redirect stubs, or
  resets IDs or capture numbers, and it never deletes anything except the originals of files it
  has just published to the batch.
- A forced archive (`--force: <reason>`) is a human decision and never a queue item. An ordinary
  archive may be queued only when individually stated.
- If nothing in scope is eligible, report that nothing was archived and change no files; do not
  create an empty archive or directory.

#### Implementations archive

Omit the target to select all active-ledger targets; supply a target to select exactly that
existing target. In flat mode, the only valid target is the repository slug. Resolve supplied
target descriptions under §1 before mutation; an unknown or ambiguous selector requires
clarification. Do not create a target or expand a record description to a target scope for this
operation.

Eligible states are `ACCEPTED`, `REJECTED`, and `CANCELLED`, including the accepted installation
record. Keep `PLANNED` and `REVIEW` records and rows active. Already archived records are never
moved again.

A forced implementations archive, `/spectre archive implementations [target] --force: <reason>`,
changes this workflow in two ways and nowhere else:

- **Close open records.** Before step 2, close every active `PLANNED` and `REVIEW` row in scope as
  `CANCELLED` with the human reason, under the decision workflow above. Archives still contain only
  terminal records, and the closed rows are archived with the rest.
- **Record existing defects.** In step 1, a validation failure that already exists in active
  records or evidence, such as an unresolvable legacy link, does not refuse the archive. Record
  each one in the new manifest's `Known issues` table instead. A defect introduced by this operation
  still blocks it, and so does any failure in the selected records' own bytes, digests, or rows.

1. Read the active ledger, all archive manifests, and selected terminal instructions and results.
   Validate the installation using §13 before mutation. Refuse missing or duplicate records,
   invalid states, unresolved references, hash mismatches, or an incomplete previous archive. An
   issue already listed in an earlier manifest's `Known issues` table does not refuse the archive.
2. Collect every eligible row in the selected scope and its exact record files. An `ACCEPTED` or
   `REJECTED` row requires a result; preserve a `CANCELLED` row's optional result when present.
   Capture the original repository-relative paths, record bytes and SHA-256 digests, ledger rows,
   and current active-ledger contents before moving anything.
3. Choose a new UTC archive ID `YYYYMMDDTHHMMSSZ`. If that directory already exists, append the
   smallest unused four-digit suffix beginning with `-0001`. Never overwrite an existing batch.
   Stage the batch outside the live archive directory, retaining each file's path relative to
   active `implementations/`, and prepare `ARCHIVE.md` using the format below.
4. Verify staged bytes against the original digests, row preservation, direct manifest links,
   and all inbound and outbound SPECTRE references using the path-resolution rules below.
   Dependencies from active work must still resolve to the same record bytes; older archives are
   kept as is.
   Preserve product source, provider evidence, active records outside the selection, and all
   previous archives. Do not rewrite record contents, create redirect stubs, or reset IDs.
5. Recheck that the original records and ledger still match the captured inputs; if they changed,
   stop before publication and leave the new work untouched. Publish the complete batch, remove
   only its original record files, and remove only its rows
   from root `SPECTRE.md` as one recoverable repository change. Keep ledger metadata, target
   sections, table headers, and remaining rows unchanged. For each newly empty table, add
   `No implementation records.`; remove a stale empty-table marker when a later plan adds a row.
   Do not delete the active ledger or renumber its records.
6. Validate the final installation and reference resolution using §13. If publication or
   validation fails, restore the captured source files and ledger and remove only this operation's
   new batch. Do not report success or discard staging/backups until the entire change validates.
   After an interruption, detect inconsistent copies or rows and stop for recovery rather than
   running another archive or allocating IDs from incomplete history.
7. Report the archive ID and path, archived implementation IDs, and remaining active counts.
   Stop without creating a plan, result, acceptance decision, or other lifecycle operation.

#### Provider archive

`/spectre archive providers <provider> [<provider>...]` moves each named provider whole: its
`PROVIDER.md` and every numbered capture. Resolve each provider slug or description under §1 to an
existing directory under `providers/`; an unknown or ambiguous name requires clarification. There
is no `all` form, and a description never expands to every provider. Never archive part of a
provider, such as older captures alone: later captures reuse earlier captures' files.

A provider is eligible only when no active record references any file inside it. Active records are
every instruction and result with a row in root `SPECTRE.md`, whatever its state, including
terminal records not yet archived. Refuse the whole run, before mutation, when any selected
provider is still referenced, and report each referencing record and the file it names. The human
then archives or revises those records first, or orders an override. `--force` never removes this
refusal.

A forced provider archive, `/spectre archive providers <provider> [<provider>...] --force: <reason>`,
changes only step 1: a validation failure that already exists in the selected providers or
elsewhere in the installation, such as a stale hash pin inside a capture, does not refuse the
archive. Record each one in the new manifest's `Known issues` table instead. It closes no records.
A defect introduced by this operation still blocks it.

1. Read the active ledger, every archive manifest, and each selected provider's guide and
   snapshots. Validate the installation using §13 before mutation; refuse an incomplete previous
   archive. An issue already listed in an earlier manifest's `Known issues` table does not refuse
   the archive. Check eligibility as above.
2. Search the repository outside `.agents/spectre/` for text naming
   `.agents/spectre/providers/<provider>/` for each selected provider, as source, tests, build
   files, or documentation may read provider files directly. Report every match as a warning
   before mutation. Matches do not block the archive, and the archive never edits them; they will
   break once the files move, and fixing them is ordinary product work.
3. Capture each provider directory's file list, sizes, and SHA-256 digests. Require regular files
   and refuse symlinks or paths outside the installation.
4. Choose a new archive ID as in the implementations archive. Stage each provider directory
   unchanged at `providers/<provider>/` inside the batch, outside the live archive directory, and
   prepare `ARCHIVE.md` using the format below.
5. Verify the staged bytes against the captured digests. Recheck that no active record references
   the selected providers and that their directories still match the captured inputs; if anything
   changed, stop before publication and leave the new work untouched. Publish the complete batch,
   then remove only the selected original provider directories, as one recoverable repository
   change. Change no record, ledger row, other provider, or product file.
6. Validate the final installation using §13. If publication or validation fails, restore the
   original provider directories and remove only this operation's new batch. After an
   interruption, detect inconsistent copies and stop for recovery.
7. Report the archive ID and path, each archived provider with its capture range and file count,
   and the warnings from step 2. Stop without capturing, planning, or changing product files.

A provider that exists only in archives is no longer selectable by `capture` or `plan`. Explicit
compound provider preparation may create it again under the same slug (§12); its capture numbers
continue above the highest archived capture, and its first new capture is a complete baseline that
reuses no archived file.

### Archive manifest

Each batch has one `.agents/spectre/archive/<archive-id>/ARCHIVE.md`. This is a batch manifest,
not a fourth installed template. It becomes immutable when the archive operation succeeds. An
implementations batch uses this format:

```markdown
# SPECTRE archive <archive-id>

Archive-Version: v2
Archive-ID: <archive-id>
Created: YYYYMMDDTHHMMSSZ
Protocol-Version: 2.3.0
Kind: implementations
Storage-Mode: <flat|nested>
Scope: <target|ALL>
Forced: <no|yes: human reason>

## Archived implementations

### <Target> implementation status

Target: <target>

| ID | Title | Instruction | State | Result | Evidence mode | Decision proof |
| --- | --- | --- | --- | --- | --- | --- |

## Record paths

| Original path | Archived file | SHA-256 |
| --- | --- | --- |
| `.agents/spectre/implementations/<record-file>` | [Record](implementations/<record-file>) | `<sha256>` |

## Known issues

| File | Issue | Found by |
| --- | --- | --- |
```

A provider batch uses this format:

```markdown
# SPECTRE archive <archive-id>

Archive-Version: v2
Archive-ID: <archive-id>
Created: YYYYMMDDTHHMMSSZ
Protocol-Version: 2.3.0
Kind: providers
Scope: <provider>[, <provider>...]
Forced: <no|yes: human reason>

## Archived providers

| Provider | Captures | Original path | Archived guide | Files |
| --- | --- | --- | --- | --- |
| `<provider>` | `<first>`–`<last>` | `.agents/spectre/providers/<provider>/` | [Guide](providers/<provider>/PROVIDER.md) | <count> |

## Known issues

| File | Issue | Found by |
| --- | --- | --- |
```

Order provider rows by slug. Captures holds the lowest and highest capture numbers, one number for a
single capture, or `None` for a provider without captures. Files counts every regular file moved
for that provider. Original path is the provider directory's repository-relative path before
archiving; the archived directory is `providers/<provider>/` beside `ARCHIVE.md`. A manifest
without a `Kind` line, written by an earlier release, is an implementations manifest.

`Known issues` holds `None.` instead of rows unless a forced archive recorded existing defects. It
is informational: like the rest of the archive, it is kept as is and never validated.
Each row names the repository-relative file, the exact failed check, and the archive ID that found
it. Listed issues stay listed; later archives do not repeat or remove them.

Populate the manifest with only this batch's selected rows. Repeat the target section for each
selected target, ordered by slug, and order rows by numeric ID. Preserve every cell's original
value and link label; only rebase Instruction and Result destinations to the archived files,
relative to `ARCHIVE.md`. Preserve `—` for a missing optional result.

The Record paths table has exactly one row per moved instruction or result. Original path is the
normalized repository-relative path before archiving. Archived file is a direct relative link to
the batch's file with the same suffix below `implementations/`; nested storage includes the target
in that suffix. SHA-256 is the lowercase hex digest of the original bytes. Require regular files,
unique original paths and destinations, and agreement between record IDs, ledger rows, and paths.
Refuse symlinks, paths outside the installation, duplicate maps, or extra undeclared record files.
