# Migrating SPECTRE 1.x to 2.0.0

SPECTRE 2.0.0 separates the installed protocol from the project implementation summary. This is a
breaking storage migration and requires explicit human approval in every adopting repository.

## Layout changes

| SPECTRE 1.x | SPECTRE 2.0.0 |
| --- | --- |
| `.spectre/SPECTRE.md` | `.spectre/SPECTRE-PROTOCOL.md` |
| `.spectre/SPECTRE-STATUS.md` | `SPECTRE.md` |

Root `SPECTRE.md` becomes both the project-facing implementation summary and the sole lifecycle and
decision-proof authority. There must not be a second active status ledger under `.spectre/`.

## Required migration

1. Read the complete 2.0.0 protocol and this migration note before changing the installation.
2. Confirm that root `SPECTRE.md` is available. If a non-SPECTRE file already occupies that path,
   stop and ask the human to choose a conflict-resolution strategy.
3. Preserve the 1.x protocol and status ledger in a versioned archive before changing active paths.
4. Install the pinned 2.0.0 protocol as `.spectre/SPECTRE-PROTOCOL.md`.
5. Move the aggregate ledger to root `SPECTRE.md`; add `Protocol-Version`, `Protocol`,
   `Status-Schema-Version`, and `Storage-Mode` metadata.
6. Rewrite ledger links so they resolve from the repository root through `.spectre/implementations/`.
7. Update the SPECTRE section in `AGENTS.md` and `.spectre/README.md` without disturbing unrelated
   repository instructions.
8. Update active templates to their v2 forms and validate the complete installation.

Do not rewrite terminal implementation instructions, results, evidence snapshots, IDs, states, or
decision proof. The migration changes active governance paths, not historical meaning.
