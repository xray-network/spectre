<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

### Sync

`Spectre sync [scope]` checks tracking and repairs what can be repaired. No scope means the
installation. It never fetches upstream evidence. It is standalone: never a queue item. It runs in
four steps.

1. Check. Validate the scope (§13): ledgers, records, links, hashes, generated runtime files, router
   and pointer, interrupted writes (publication.md), duplicate IDs, and each ACTIVE target's Path
   against the folders on disk. A scoped sync includes its dependency closure. Report exactly what
   was and was not checked. When the human asks only to check or report, stop here: write nothing.
2. Safe fixes, applied without asking. This list is exhaustive:
   - Remove an implementation subsection with zero rows after proving there are no orphan records
     for its target; its Targets row stays.
   - Sort Targets rows, subsections and rows, and normalize table formatting where parsing is
     unambiguous, keeping every ID, link, title, state, evidence mode and Decision or status value.
   - Remove an empty record directory, never one that holds files or evidence.
   - Rebuild live provider subsections and capture rows from valid guides, validated published
     captures and the live instructions that pin each exact capture (§11). A missing ledger row
     for a validated capture is repairable. A row naming a missing snapshot, conflicting identities
     or an invalid pin is a blocker.
   - Complete the interrupted states that publication.md marks safe sync, after verifying every
     byte and row condition that table states.
3. Proposed fixes, applied only after the human answers. List them together as one checkpoint
   (queues.md):
   - Moved target: an ACTIVE target's Path is missing and exactly one folder is the same project,
     shown by its package identity or a rename that version control records. Propose the new Path.
   - Removed target: an ACTIVE target's Path is missing, it has no live rows, and no folder matches.
     Propose retiring it, keeping its ID, label, last Path and history.
   The human may apply all, some or none. Apply only the named proposals, in one ledger edit, with
   the human's reply as the Reason. Several candidate folders are listed for the human to choose;
   never pick one.
4. Blockers are reported and never changed: missing record files, conflicting states, duplicate IDs
   (publication.md), a changed accepted or rejected result, corrupt pins, an ACTIVE target with live
   rows but no folder, a live record that pins an archived provider or depends on a missing archived
   result, a repository file that names a path moved by an archive, and interrupted states outside
   the publication.md table.

Distinguish errors, safe fixes, proposals and historical information. Never add, reconstruct or
delete implementation rows, register targets, infer REVIEW or acceptance, move records or evidence,
archive, reset counters, upgrade, or rewrite terminal records. A clean installation produces no
writes. Success means only the reported scope passed.
