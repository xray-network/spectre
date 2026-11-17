<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 1ae4c43cd1f1ad8e6cc942c5b573490f5cd3e332ff3acda5e920cfd2186a33f5

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
