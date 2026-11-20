<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8792d72d42e4a70556d250a829ee45cdff86241cbd062e9eb3824062e71d07f4

### Publication order

SPECTRE tracking is ordinary Markdown written with ordinary file edits. There are no locks,
transaction logs, staging areas or recovery manifests. Safety comes from one write order, a reread
before the commit point, and validation afterwards. Version control is the backup and audit trail;
commands never commit for the human.

Each operation has one commit point: the write after which its change counts as published. It is
the `SPECTRE.md` row for lifecycle changes, the archive ledger write for an archive,
`SNAPSHOT.md` for a capture, and the receiving `SPECTRE.md` for `absorb` and `detach`. Content
without its commit point was never published. Writes after the commit point, such as removing an
archived row from `SPECTRE.md`, only finish a change already published. Every mutation follows this
order:

1. Read the selected inputs and the ledgers the operation needs. Resolve canonical scope and compute
   any new ID from them.
2. Create new files only at paths that do not exist, and never overwrite a file the operation did
   not read. Write record and evidence content first; write `SNAPSHOT.md` only after every file it
   inventories exists and matches its recorded hash.
3. Immediately before editing `SPECTRE.md`, reread it. If a row, subsection or ID the operation
   depends on changed since step 1, stop and report it; never overwrite the other change. Files
   already written in step 2 stay for `sync` to report.
4. Edit the ledger last, in one write, changing only the Targets rows, rows and cells the
   operation owns. An archive copies its files first, writes its rows to the archive ledger (its
   commit point), then removes them from `SPECTRE.md`, deletes the verified originals and prunes
   newly empty subsections and directories.
5. Validate the affected scope (§13) and report. Never report a check that did not run.

Source implementation is not rolled back: preserve product edits and record honest partial work.
One working copy has one SPECTRE writer at a time. A tool (§16) may add stronger local mechanisms,
such as an advisory lock or atomic rename, but writes no additional SPECTRE files and leaves the
same final files as this order.

### Interrupted writes

An interrupted operation leaves one of these states. `sync` reports each with its next action.
`sync` completes only the states marked safe sync, and deletes nothing else.

| State | Cause | Next action |
| --- | --- | --- |
| Instruction file at a sequence maximum with no row and no result | Plan stopped before its commit point | Human deletes the file, or asks to plan the same objective again, which publishes it |
| Result file not linked from its `PLANNED` row | Implement stopped before its commit point | Implement again; it reconciles the existing result |
| Row title or evidence mode that differs from its `PLANNED` or `REVIEW` instruction | Revise stopped before its ledger edit | Revise again; it reconciles the row |
| Files in `archive/<archive-id>-<target>/` whose rows are not in the archive ledger, each equal to its live original | Archive stopped before its commit point | Safe sync removes the unpublished copies |
| Archived rows still in `SPECTRE.md`, or originals still byte-identical to their archived copies | Archive stopped after its commit point | Safe sync removes those live rows, then those originals |
| Files or rows listed in an `absorb` or `detach` ID map present in both installations | Absorb or detach stopped before its commit point | Repeat the same operation; it skips what is already in place |
| Numbered capture directory without `SNAPSHOT.md` that nothing references | Capture stopped before its commit point | Safe sync removes the unpublished directory |
| Runtime files whose Source-SHA256 differs from the installed protocol | Install or upgrade stopped | Repeat the same explicit install or upgrade |
| Ledger Protocol-SHA256 that differs from the installed protocol's SHA-256 | Upgrade stopped before its commit point | Repeat the explicit upgrade; it skips files already in the current formats |

Anything else, such as a row changed by two writers, unexpected bytes or a missing record, is a
structural blocker. The human restores it from version control or orders an explicit scoped override.

### Parallel branches

Each branch allocates IDs from its own view, so two branches can create the same ID. Prefer planning
on one shared line of history. After a merge, `sync` reports duplicate IDs as blockers. Keep the
record that reached the shared history first. Renumber the other, if it is not terminal, to the
next free ID in its sequence with an explicit `Spectre override`, which updates its files, row and
live references. Terminal records are never renumbered without an override.
