<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

### Deterministic bookkeeping synchronization

`sync [scope]` reconciles only mechanically provable metadata. No scope means the installation.
Inspect first, report the proposed correction set, then apply authorized safe changes without
another confirmation, following publication.md. Check affected records, registry and references
before and after. A matching installation produces no writes.

Allowed corrections are exhaustive:

- Remove a target section with genuinely zero rows after proving there are no orphan instructions
  or results for it and all ever-used identities are registered. An unregistered empty generated
  heading can be removed only when no used identity is lost. Preserve prose
  that cannot be identified as generated bookkeeping and report ambiguity instead.
- Refresh live section Label/Path from the valid existing registry, preserving Target and row values.
- Sort existing sections/rows and normalize table formatting where parsing is unambiguous, retaining
  exact IDs, links, titles, states, evidence modes and Decision or status values.
- Remove an empty active record directory, never a directory containing files, an archive or evidence.
- Complete the interrupted states that publication.md marks safe sync, and only after verifying
  every byte and row condition that table states: remove an unused non-bootstrap registry row,
  remove an unpublished archive batch or capture directory, or finish removing live rows and
  originals already copied into a written `ARCHIVE.md`.

Refuse corrections in a target or provider that has missing registry identities used by
records/history, conflicting states, duplicate IDs, orphan instructions/results other than the
interrupted states publication.md names, missing record files, invalid target ownership, corrupt
pins, or interrupted writes outside that table.
Corrections elsewhere proceed; report every blocker. A scoped sync never masks blockers in its
dependency closure. Beyond those safe states, do not
add/reconstruct/delete record rows, register/retire/reactivate targets, infer REVIEW or acceptance,
move files, archive work, garbage-collect evidence, reset counters, upgrade schemas/runtime, or
rewrite terminal records. Known formatting corrections cannot excuse structural errors.
