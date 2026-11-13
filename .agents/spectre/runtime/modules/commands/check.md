<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Read-only consistency checking

`check [scope]` reads and diagnoses, never mutates or fetches upstream evidence. No scope means the
complete installation. Scoped target/record/provider checks include their required dependency
closure, Targets rows, shared indexes and loaded runtime integrity; report exactly what was
and was not checked. Read canonical templates for the checked schema and provider checks when
consuming evidence. A full check re-extracts all modules/templates and checks the router/pointer.

Report failures with canonical identities, paths, failed invariant and an appropriate next action:
safe sync, explicit revision/decision, repeating an interrupted operation, or an exceptional scoped
override. Report interrupted writes with the state and next action from publication.md, and
duplicate IDs from parallel branches as blockers. Distinguish errors, safely correctable bookkeeping
and historical information. Never call missing records harmless formatting or infer lifecycle state
from result existence. Success means only the reported scope passed applicable checks. A diagnostic report with safe
bookkeeping findings is complete and may feed an explicitly queued sync; structural errors block
that sync rather than being silently removed.
