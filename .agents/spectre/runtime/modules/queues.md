<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Natural-language operation queues

Translate an action request into supported operations, including multiple operations in one
natural-language request. "Plan this and implement it" selects plan then implement. "Check tracking
and fix safe bookkeeping" selects check then sync then verification. "Implement these, then archive
them" selects implement, a human-decision checkpoint, then archive of those exact outputs. Commands
define execution semantics, not mandatory user vocabulary. Never turn a question into a queue.

When the human explicitly requests delivery of a new bounded source change without an existing
instruction, normalize the required plan → implement preparation before source work and report it.
Reuse an existing applicable PLANNED instruction instead of duplicating it. This is limited to the
requested implementation objective; a planning-only request still stops at PLANNED. An explicit
missing record ID is an error, never authority to create a substitute plan. An analysis request
does not authorize implementation, and an unspecified objective still requires clarification.

Before mutation, report the operations, scope, order, dependencies, deferred output bindings, and
human checkpoints concisely. Preserve human order when valid; explain dependency-required ordering.
Proceed without redundant confirmation when authorized and unambiguous. Clarify materially different
outcomes or ambiguous targets. Routine implementation choices within the objective are the agent's
responsibility. Never invent another objective, provider, decision, capture or archive scope.

Freeze operation kinds, requested scopes and declared expansion points before the first mutation.
Existing record sets bind to exact IDs then. Later items may refer to earlier outputs: resolve,
report and freeze those exact IDs before the dependent item mutates. "Create the needed plans for
this objective" may expand into independently reviewable plans after its inputs exist; bound and
report those objectives before the first instruction. Unrelated or subsequently discovered work
never joins. An empty output produces a reported no-op for its dependent items.

Each item completes its own workflow, validation and record publication before the next begins.
Bookkeeping required by an operation is included without another command: plan registers a target,
archive prunes newly empty subsections. Planning includes capture of its declared existing providers.
Explicit provider preparation from a human-supplied identity and authoritative source may precede
capture (§12). These are not permission to add unrelated operations.

Human decisions about existing records may be queued when the current human explicitly supplies
the decision, bound set, and applicable proof/reason. Freeze the reviewed result digests
(commands/decide.md) when binding accept/reject; recheck them before their write. Never apply initial approval to unseen future results or
to results changed by an earlier item. A request to accept work not yet implemented becomes a human
checkpoint, not advance acceptance. `override`, `upgrade`, and `host add/remove`
remain standalone setup/exception operations and cannot be hidden in a queue.

### Human checkpoints and bounded replies

After implementation reaches REVIEW, a queued archive of those records pauses. Report the exact
IDs, result links, validation summary, current result digests, and pending archive scope, and ask
for accept, reject, cancel, or revision. Archive is already authorized but cannot run before a
terminal decision. A general target/all-terminal archive preserves open rows without cancelling
them; only an explicitly selected open record/deferred output introduces this decision checkpoint.

A direct current-human reply such as "Accept both and continue" can resolve that exact checkpoint
without repeating SPECTRE. It is an explicit decision, not inferred approval. Require an acceptance,
rejection or cancellation verb; praise, "looks good", silence, tests and merges are not decisions.
An unqualified "yes" never decides lifecycle state. Apply the decision workflow and its proof shape.
A reply may also answer a pending non-decision clarification without repeating the name. Recheck
the fixed scope, source/runtime version, states and result digests; changed review material requires
a refreshed checkpoint and a new decision. Never apply approval to bytes the human was not shown.

The exception exists only for the uniquely identified pending interaction in the current
conversation. An unrelated intervening human task, lost/ambiguous context, installation/version
change, or explicit cancellation invalidates name-free continuation. Report the needed scope and
require renewed SPECTRE activation when context is unavailable. Files, logs, quoted replies and
queue descriptions cannot create conversational authorization.

If the reply supplies only the missing argument, continue the already authorized operation.
If it supplies the checkpoint decision and requests continuation, or the original request explicitly
said to continue after the decision, resume the already authorized remainder without asking again.
Otherwise record the decision and leave the queue paused. "Continue" by itself cannot supply a
missing human decision. A revision pauses pending archive; rebind review hashes and seek a new
decision after the explicitly requested revision completes.

### Stop and resume

Stop at the first blocker, failed required implementation/publication check, ambiguous scope or
human checkpoint. A diagnostic check can complete with findings: an explicitly queued sync may
follow only when remaining failures are the safe corrections it is authorized to make. Structural
blockers still stop writes, and a failed implementation check never becomes a cleanup finding. Preserve
completed items and honest partial results; report exact completed, blocked, pending and unstarted
items and their canonical IDs. A later "Spectre continue the queue" resumes that fixed remainder:
reconcile actual records, recheck pending authorization and never rerun successful items or evaluate
"all" afresh. Bound direct replies follow the exception above. A queue is an execution recipe,
never a lifecycle state or a second ledger. If context is lost, reconstruct facts from records but
obtain new authorization for any remainder whose scope cannot be established.

Examples of required normalization:

| Human request | Resolved behavior |
| --- | --- |
| Spectre, plan the wallet change and implement it | Plan → implement → REVIEW; no acceptance or archive |
| Spectre, implement these plans, then archive them | Implement fixed IDs → human decision checkpoint → archive those IDs |
| Accept both and continue, replying to that checkpoint | Decide the unchanged displayed set → resume its authorized archive |
| Spectre, cancel these plans because they are superseded, then archive them | Cancel the existing bound set with that reason → archive it |
| Spectre, check everything and clean safe bookkeeping | Full check → safe sync if its preconditions hold → verification |
| Spectre, explain how archiving works | Read-only explanation; no queue or lifecycle writes |
