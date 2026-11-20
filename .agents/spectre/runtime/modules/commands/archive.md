<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

### Archive workflow

```text
Spectre archive [record-set|target|all]
Spectre archive provider <provider> [<provider>...]
```

Archiving keeps `SPECTRE.md` short by moving finished work out of it. It moves files, byte for byte,
into a new archive folder and moves their rows into that folder's `ARCHIVE.md`. It never changes a
record's content, decides work or resets numbering.

- **Records.** Target/all scopes and the omitted scope select ACCEPTED, REJECTED and CANCELLED rows
  and leave PLANNED/REVIEW rows in place. An explicit record set must be entirely terminal; open
  selections pause for a human decision checkpoint, and no partial subset is archived. Open work is
  cancelled explicitly first. Already archived IDs are no-ops. Pronouns and deferred output scopes
  never expand to all rows or the parent target.
- **Providers.** Name each provider; there is no all-providers form. A provider is archived whole,
  with its guide and every capture, even while live records pin it.

1. Read `SPECTRE.md`, the selected records or providers, and every live record. Validate the
   selection (§13): ACCEPTED/REJECTED records require results. An unfinished earlier archive
   (publication.md) blocks publication. Nothing eligible is a reported no-op.
2. Report what the move affects, then proceed: live records that pin a selected provider or depend
   on a selected record, and repository files outside `.agents/spectre/` that mention a path being
   moved. Archiving never edits those; afterwards `sync` reports them as blockers, and the human
   fixes them by hand or with a new plan.
3. Choose the archive ID: the UTC time as `YYYYMMDDTHHMMSSZ`, with the smallest free `-0001` suffix
   on collision. Copy each selected record into `implementations/__archive/<archive-id>/<target>/`,
   or each selected provider directory into `providers/__archive/<archive-id>/<provider>/`, under
   its own names, and verify every copy's SHA-256.
4. Write `__archive/<archive-id>/ARCHIVE.md` from the template (§11) with the selected implementation
   rows or entire provider subsections from `SPECTRE.md`, changing their links to the archived files.
   This is the commit point.
5. Reread `SPECTRE.md`. Remove exactly those rows or subsections. For archived implementations,
   remove their IDs from the Pinned by cells of the exact captures they pinned. Prune newly empty
   implementation subsections. Then delete the verified originals and prune newly empty directories.
6. Verify each selected implementation has exactly one row with its original state and proof and
   that each selected provider has exactly one subsection with all its capture rows. Check that
   they appear in the new `ARCHIVE.md` and their links name the archived files. Report the archive
   ID, archived items, no-ops and affected live records and paths. Continue only an already
   authorized queue item; otherwise stop.
