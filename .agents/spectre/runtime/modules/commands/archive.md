<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8792d72d42e4a70556d250a829ee45cdff86241cbd062e9eb3824062e71d07f4

### Archive workflow

```text
Spectre archive [record-set|target|all]
```

Archiving moves finished records out of the live ledger: their rows to the archive ledger and their
files to `archive/<archive-id>-<target>/`, byte for byte. Omitted scope means all eligible terminal
rows. Target/all scopes select ACCEPTED, REJECTED and CANCELLED rows and leave PLANNED/REVIEW rows
in place. An explicit record set must be entirely terminal; open selections pause for a human
decision checkpoint, and no partial subset is archived. Already archived selected IDs are no-ops.
Pronouns and deferred output scopes never expand to all rows or the parent target. Never cancel
records, accept work, reset IDs or delete history as part of archiving; open work is cancelled
explicitly first, and damaged tracking needs a scoped override.

1. Read both ledgers and the selected rows' instructions and results. Validate the selected rows
   (§13): ACCEPTED/REJECTED require results; preserve CANCELLED's optional result. An unfinished
   earlier archive (publication.md) blocks publication. No eligible rows is a reported no-op.
2. Choose the archive ID: the UTC time as `YYYYMMDDTHHMMSSZ`, with the smallest free `-0001` suffix
   on collision; never write into an existing archive directory. Copy each selected instruction and
   result to `archive/<archive-id>-<target>/`, one folder per target, under its own name, and verify
   each copy's SHA-256.
3. Write the selected rows into the archive ledger, creating it from the template (§11) when absent,
   under each target's subsection, sorted by ID. Copy every cell unchanged except the Instruction
   and Result link destinations, which name the copies. This write is the commit point.
4. Reread `SPECTRE.md`, remove exactly those rows, and prune newly empty implementation subsections.
   Keep its metadata, Targets table and unrelated rows. Then delete the verified originals and prune
   newly empty record directories.
5. Verify exactly one row per selected ID across both ledgers, with state and proof unchanged and
   links naming the archived files. Report the archive ID, archived IDs, no-op IDs and remaining
   live counts. Continue only an already authorized queue item; otherwise stop.
