# Migrating SPECTRE 2.x to 3.0.0

SPECTRE 3.0.0 moves its installed data below the shared `.agents/` namespace and adds a repository
skill that routes the canonical command vocabulary. This is a breaking storage migration and
requires explicit human approval in every adopting repository.

## Layout changes

| SPECTRE 2.x | SPECTRE 3.0.0 |
| --- | --- |
| `.spectre/SPECTRE-PROTOCOL.md` | `.agents/spectre/SPECTRE-PROTOCOL.md` |
| `.spectre/README.md` | `.agents/spectre/README.md` |
| `.spectre/templates/` | `.agents/spectre/templates/` |
| `.spectre/implementations/` | `.agents/spectre/implementations/` |
| `.spectre/providers/` | `.agents/spectre/providers/` |
| No command skill | `.agents/skills/spectre/SKILL.md` |

Root `SPECTRE.md` remains the project-facing implementation summary and sole lifecycle and
decision-proof authority.

## Required migration

1. Read the complete 3.0.0 protocol and this migration note before changing the installation.
2. Confirm that `.agents/spectre/` and `.agents/skills/spectre/` contain no conflicting non-SPECTRE
   files. Stop and ask the human to resolve any conflict.
3. Preserve the active 2.x protocol, templates, and a copy of root `SPECTRE.md` under
   `.agents/spectre/archive/<old-version>/` before replacing active files.
4. Move implementations, providers, and other SPECTRE-owned data from `.spectre/` to
   `.agents/spectre/` without rewriting instruction, result, snapshot, artifact, ID, state, or
   decision-proof content.
5. Install the pinned 3.0.0 protocol as `.agents/spectre/SPECTRE-PROTOCOL.md`, update the active
   templates and README from §§10–11, and create `.agents/skills/spectre/SKILL.md` from §2.
6. Update root `SPECTRE.md` metadata to `Protocol-Version: 3.0.0`, point `Protocol` and all record
   links through `.agents/spectre/`, and leave every other terminal-row value unchanged.
7. Update the SPECTRE section in `AGENTS.md` to point to
   `.agents/spectre/SPECTRE-PROTOCOL.md` without disturbing unrelated repository instructions.
8. Remove the old `.spectre/` directory only after verifying that every owned file was moved or
   archived and that no consumer still depends on its paths.
9. Validate the complete 3.0.0 installation, including the command skill, before adoption.

Do not create a new implementation ID merely for this required storage migration, and do not use
the bootstrap exception to overwrite the existing `0001` record. If non-terminal records cannot be
moved without changing their meaning, stop and require a human-approved record mapping.
