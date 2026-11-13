<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Publication order

SPECTRE tracking is ordinary Markdown written with ordinary file edits. There are no locks,
transaction logs, staging areas or recovery manifests. Safety comes from one write order, a reread
before the commit point, and validation afterwards. Version control is the backup and audit trail;
commands never commit for the human.

Each operation has one commit point: the write after which its change counts as published. It is
the root `SPECTRE.md` row for lifecycle changes, `ARCHIVE.md` for an archive, and `SNAPSHOT.md` for a
capture. Content without its commit point was never published. Writes after the commit point, such
as an archive's ledger edit and removal of originals, only finish a change already published. Every
mutation follows this order:

1. Read the selected inputs, the ledger and the archive indexes the operation needs.
   Resolve canonical scope and compute any new ID from them.
2. Create new files only at paths that do not exist, and never overwrite a file the operation did
   not read. Write record, evidence and archive content first; write `ARCHIVE.md` or `SNAPSHOT.md`
   only after every file it inventories exists and matches its recorded hash.
3. Immediately before editing `SPECTRE.md`, reread it. If a row, subsection or ID the operation
   depends on changed since step 1, stop and report it; never overwrite the other change. Files
   already written in step 2 stay for `check` to report.
4. Edit the ledger last, in one write, changing only the Targets rows, rows and cells the
   operation owns. After an archive's
   ledger edit, delete only the verified originals and prune newly empty directories.
5. Validate the affected scope (§13) and report. Never report a check that did not run.

Source implementation is not rolled back: preserve product edits and record honest partial work.
One working copy has one SPECTRE writer at a time. A tool (§16) may add stronger local mechanisms,
such as an advisory lock or atomic rename, but writes no additional SPECTRE files and leaves the
same final files as this order.

### Interrupted writes

An interrupted operation leaves one of these states. `check` reports each with its next action.
`sync` completes only the states marked safe sync, and deletes nothing else.

| State | Cause | Next action |
| --- | --- | --- |
| Instruction file at a sequence maximum with no row and no result | Plan stopped before its commit point | Human deletes the file, or asks to plan the same objective again, which publishes it |
| Result file not linked from its `PLANNED` row | Implement stopped before its commit point | Implement again; it reconciles the existing result |
| Row title or evidence mode that differs from its `PLANNED` or `REVIEW` instruction | Revise stopped before its ledger edit | Revise again; it reconciles the row |
| Archive batch without `ARCHIVE.md` whose every file equals a live original | Archive stopped before its commit point | Safe sync removes the unpublished batch |
| `ARCHIVE.md` whose rows are still live or whose originals still exist byte-identical | Archive stopped after its commit point | Safe sync removes those live rows, then those originals |
| Numbered capture directory without `SNAPSHOT.md` that nothing references | Capture stopped before its commit point | Safe sync removes the unpublished directory |
| Runtime files whose Source-SHA256 differs from the installed protocol | Install or upgrade stopped | Repeat the same explicit install or upgrade |
| Ledger Protocol-Version that differs from the installed protocol's version | Upgrade stopped before its commit point | Repeat the same explicit upgrade; it skips records already migrated |

Anything else, such as a row changed by two writers, unexpected bytes or a missing record, is a
structural blocker. The human restores it from version control or orders an explicit scoped override.

### Parallel branches

Each branch allocates IDs from its own view, so two branches can create the same ID. Prefer planning
on one shared line of history. After a merge, `check` reports duplicate IDs as blockers. Keep the
record that reached the shared history first. Renumber the other, if it is not terminal, to the
next free ID in its sequence with an explicit `/spectre override`, which updates its files, row and
live references. Terminal records are never renumbered without an override.
