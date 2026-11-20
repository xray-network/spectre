<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8792d72d42e4a70556d250a829ee45cdff86241cbd062e9eb3824062e71d07f4

### Absorb and detach

`Spectre absorb <path>` merges the installation at `<path>`, a folder inside this installation, into
this one. `Spectre detach <target> to <path>` moves one target out of this installation into the
installation at `<path>`, creating it when absent. Both are standalone, human-ordered and run as an
override (commands/override.md) whose scope is fixed by this section. They move records, providers
and rows, never product source, and they never change a decision, state or numbering inside a
target.

Shared rules for both:

1. Read both installations: runtime, both ledgers, every record and provider. Run full validation
   on each and stop on any blocker. Both must run the same protocol (§14); upgrade first otherwise.
   Recommend a commit first.
2. Build the ID map before writing: each moved target's old ID and new ID, each record's old and new
   qualified ID and path, and each provider's old and new slug. Keep every record number; only the
   target part changes. Report the map, the files to move and the rows to move, then proceed.
3. Move record files and provider directories to their new paths, byte for byte. Then update, in
   the moved files and in both installations, every link, provider pin, predecessor and reuse hash,
   and qualified ID that the map changes. A file whose bytes change gets its new digest cited
   wherever a decision proof cited the old one; decision sources, dates and wording stay.
4. Write the receiving installation's `SPECTRE.md` (its commit point) and the archive ledger
   with the moved rows and Targets rows. Then update the sending installation's ledgers.
5. Log every moved, changed, created or removed file in each installation's override log, with the
   human's command and the reason, and record the ID map in the moved targets' Targets-row Reason
   in both installations (`Moved from <installation>: <old> → <new>`). Validate both installations.
   A repeated run skips what is already in place.

`absorb <path>`:

- The inner installation's targets become targets here. A target ID that collides gets the inner
  folder's slug as prefix (`app` at `./mobile/` becomes `mobile-app`). Its Path becomes the old
  Path joined to `<path>`.
- Its bootstrap record stays as history of that target; this installation keeps its own.
- Providers move into `providers/`. One with the same official source as an existing provider stays
  separate unless the human asks to combine it; a colliding slug gets the folder prefix.
- Afterwards the inner `.agents/spectre/`, `SPECTRE.md` and its `AGENTS.md` SPECTRE section are
  removed.

`detach <target> to <path>`:

- `<path>` must be the target's folder or contain it. Every live row of another target here that
  depends on this target's results blocks the run: finish it or re-plan it against a provider
  capture of the target first. Archived dependencies are history and do not block.
- Without an installation at `<path>`, install one first (§2) as a single project whose one target
  is the detached target: it keeps its ID and numbers, and the bootstrap record takes that target's
  next free number instead of `0001`.
- With an installation at `<path>`, the target joins it as in `absorb`, including the collision rule.
- Providers the target pins are copied, not moved, when other records here still pin them.
- Here, the target becomes RETIRED with the reason above; its rows and record files leave, so its
  numbers are never reused.
