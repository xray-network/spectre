# Commands and natural language

Describe the work in your own words. SPECTRE resolves that request to the same operations and rules
as explicit commands; it does not require you to memorize syntax. It reports bounded scopes and
queues before changing files, asking only when intent, ownership or a required decision is unclear.

```text
Spectre, plan the wallet change and implement it.
Spectre, implement these plans and archive them after my decision.
Spectre, check tracking and fix safe bookkeeping inconsistencies.
Spectre, the graph source moved to ./mini-app-graph/; update its target path.
```

New workflows require a current-human SPECTRE mention, including `/spectre`, Codex's `$spectre`,
or natural language. A direct reply to its uniquely pending clarification/checkpoint may continue
that bounded interaction without repeating the name. Unrelated conversation never activates it.
Protocol questions and quoted examples authorize no mutation. An explicit request to deliver
a new bounded change includes the required plan → implement preparation; an existing suitable plan
is reused. Planning-only requests stop at PLANNED, and a missing explicit ID is never replaced.

## Operation reference

```text
/spectre plan <target>: <objective>
/spectre implement <record>
/spectre implement --batch <records>
/spectre revise <record>: <changes>
/spectre accept <records>: <proof>
/spectre reject <records>: <proof>
/spectre cancel <records>: <reason>
/spectre status [scope] [state] [--archived]
/spectre recall [target]: <question>
/spectre check [scope]
/spectre sync [scope]
/spectre archive [scope]
/spectre archive implementations [scope]
/spectre archive providers <provider> [<provider>...]
/spectre target move <target>: <path>
/spectre target retire <target>: <reason>
/spectre target reactivate <target>: <path>
/spectre capture <provider>
/spectre upgrade <version>
/spectre override <scope>: <changes> because <reason>
/spectre host add <host> [<host>...]
/spectre host remove <host> [<host>...]
/spectre help [operation]
```

Open work is closed by explicit cancellation, never by an archive flag. There is no generic record
deletion or unrestricted repair operation.

## Queue operations in natural language

```text
Spectre, plan the API change, implement it, then archive it after my decision.
```

The agent reports:

```text
plan API objective
→ implement the plan created by this request
→ REVIEW: wait for your decision
→ archive that exact record after a terminal decision
```

Later operations bind exact earlier output IDs before writing. "Them" means those selected outputs,
never every record or its whole parent target. Independently reviewable plans may be created only
within a requested bounded objective. Each item completes its own checks and tracking publication
before the next. A blocker stops the queue, preserves completed/partial work, and identifies the
exact remaining items. `Spectre continue the queue` resumes that fixed remainder without rerunning
completed items or reevaluating "all".

### Human checkpoints

Implementation produces `REVIEW`, which is not eligible for archive. SPECTRE displays the exact
IDs, results, checks and reviewed-result hashes, then asks for a decision. Reply, for example:

```text
Accept both and continue.
```

That explicit reply can supply checkpoint acceptance without another SPECTRE mention. For a batch
checkpoint, proof records your verbatim reply, date and the digest of each displayed result. If review
material changes, the checkpoint must refresh before a new decision. Praise, "yes", passing tests,
merges and silence do not decide state. A cancellation batch still needs an applicable reason.

After your decision, the original requested continuation can proceed without another archive
confirmation. If continuation was not authorized, SPECTRE records the decision and stays paused.
A requested revision returns to human review before pending archive. Unrelated intervening tasks
or lost context invalidate name-free continuation; renew activation and scope explicitly.

Existing-record decisions can appear in queues when explicitly authorized with applicable proof:

```text
Spectre, accept api/0004 because I reviewed its result and checks, then archive it.
Spectre, cancel these plans because they are superseded, then archive them.
```

Approval cannot apply in advance to future or changed results. `override`, `upgrade`, and host setup
remain standalone. Planning alone never implements, and implementing alone never accepts/archives.

## Select records and targets

Use a qualified ID (`api/0004`), a unique bare ID, a title/objective description, or established
context (`the plans just listed`). A batch accepts comma-separated qualified IDs, a target-local
inclusive range (`api/0004..0006`), or a bounded plural description. The complete set is fixed before
mutation; duplicate/missing IDs or ineligible selections are not silently skipped.

Target descriptions resolve through the ledger's Targets table and repository ownership. An invalid explicit ID
never gets a fuzzy substitute. Ambiguous matches require clarification. "Latest" means creation
order within its scope; "last implemented" needs actual event-order evidence, not mtimes or archive
dates. State eligibility is checked after identity resolution.

## Plan, implement and revise

`plan` creates one bounded instruction and `PLANNED` row together. First use registers the target
and its source Path; it does not create product directories. Plans relying on providers capture
them first and pin their numbered snapshots. Untouched plans have no result file.

`implement` reconciles existing changes, implements the instruction, runs required checks and
publishes its result plus `REVIEW` row. A batch completes each record before the next. Blocked work
remains `PLANNED` with an honest partial result and actual failed/not-run checks. Required accepted
dependencies remain human gates, even when their implementation came earlier in the queue.

`revise` refines a `PLANNED` instruction without product changes, or changes a `REVIEW` implementation
within its instruction, reruns affected checks and updates its result. Scope/ownership expansion
needs a new plan. Terminal records are immutable; correct them through new referenced work.

## Decide implementations

Accept/reject require existing `REVIEW` records; cancel accepts `PLANNED` or `REVIEW`. Rejection or
cancellation preserves product changes and results; it is not rollback. A mistaken plan should be
cancelled and archived rather than erased or renumbered.

One applicable proof/reason must cover the entire selected set. A single decision may use your
verbatim command and UTC date. Batches require written proof/reason, except an explicit accept/reject
reply to the exact unchanged checkpoint set as described above. Every selected record is preflighted
before one all-or-nothing ledger edit changing only decision cells. Tests cannot approve work.

The ledger's Decision or status cell records every decision in one shape: your own words quoted,
the UTC date, and the digest of each reviewed result. Any proof or reason you wrote is inside the
quotes, so it is always dated:

```text
Human command "Spectre accept api/0004: tested the limiter under load" on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e.
Human reply "Accept both and continue" on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e, api/0005@81d7a2c4e9f0.
Human decision "accept api/0004" in spectre on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e.
Human command "Spectre cancel api/0006 because the gateway was dropped" on 2026-11-11.
```

A digest such as `api/0004@3f9a1c0b7d2e` is the first 12 hexadecimal characters of the result
file's SHA-256. It ties the decision to the exact bytes you reviewed: a changed result needs a new
decision, and `check` reports an accepted or rejected result that changed afterwards. Cancellation
records no digest. You can also bind the bytes yourself when deciding:

```text
/spectre accept api/0004@3f9a1c0b7d2e: tested the limiter under load
```

The decision then applies only if the result still has that digest.

## Track target paths and retirement

```text
Spectre, move the API target to ./services/api/.
Spectre, archive completed work for the API target, then retire it because the service is discontinued.
Spectre, reactivate the API target at ./services/api/.
```

The Targets table at the top of `SPECTRE.md` owns stable IDs and current installation-relative paths. Target move updates that
binding and live display; it does not move source files, records or evidence. When an implementation
explicitly moves its source folder, its declared old/new path update is published with its result
and ledger. Consumed owned source deliberately moved/deleted by that change can remain historical
with recorded dispositions; missing evidence or unexpected input loss still blocks work. Retirement requires
no live records/orphan files, retains a tombstone and last path, and never closes work implicitly.
Reactivation is for the same logical project and continues its original numbering. Splits/merges
preserve historical IDs and create future targets as needed. Missing folders never infer retirement.

## Status, recall, check and sync

`status` summarizes installation targets/paths/counts, lists a target's rows, or shows a record's
details across live and archived locations. Summary state filters and `--archived` select a bounded
view; archived summaries show archived rows only. `recall` answers why from cited recorded decisions,
distinguishing accepted, pending, superseded and rejected work. Neither changes files.

`check` diagnoses local consistency without writes or upstream fetches. No scope checks the full
installation, including generated rule bytes; a scoped check reports its actual dependency closure.
Historical stale source links are distinguished from missing required evidence.

`sync` applies only proven bookkeeping corrections: empty subsection removal, unambiguous
sorting/formatting, empty active record-directory removal, and finishing
the interrupted writes listed below as safe. It cannot reconstruct rows, infer lifecycle state,
register/retire targets, remove evidence or upgrade schemas. Structural conflicts block corrections
in the affected target or provider. Ordinary commands already do their own bookkeeping.

### Interrupted writes

SPECTRE files are plain Markdown with no locks or transaction logs. Every operation writes in one
order, and its last write is its commit point: the ledger row, an archive's `ARCHIVE.md`, or a
capture's `SNAPSHOT.md`. If an agent stops halfway, `check` names what it left:

| Left behind | Next step |
| --- | --- |
| A plan's instruction without its ledger row | Delete it, or ask to plan the same objective again |
| A result not yet linked from its `PLANNED` row | Implement again; it reconciles the result |
| An archive copy without `ARCHIVE.md` | `sync` removes the copy |
| An `ARCHIVE.md` whose rows or originals are still live | `sync` finishes the move |
| A capture directory without `SNAPSHOT.md` | `sync` removes it |
| Runtime files that do not match the protocol | Repeat the install or upgrade |
| A ledger whose `Protocol-Version` differs from the installed protocol | Repeat the upgrade; it skips records already migrated |

Anything else is a blocker: restore it from version control or order an explicit override.

### Parallel branches

Two branches can allocate the same ID. After the merge, `check` reports the duplicate. Keep the
record that reached the shared history first and renumber the other with an explicit override:

```text
Spectre override the webhooks plan api/0007: renumber it to the next free ID because two branches allocated api/0007.
```

Planning on one shared branch avoids collisions.

## Archive completed work

```text
Spectre, archive the accepted API changes.
/spectre archive api/0004, api/0005
/spectre archive api
/spectre archive
```

Individual IDs, bounded sets, whole targets and all targets are supported. Target/all scopes select
terminal records and preserve open work. An explicit open record set pauses for the human decision;
it never silently archives only some. Already archived records are reported as no-ops.

Archive preserves instruction/result bytes, IDs, decisions and dependencies. It publishes a
dated manifest, transfers selected rows out of `SPECTRE.md`, and removes newly empty subsections.
Targets rows remain. A ledger with nothing live keeps its Targets table; history stays discoverable.
Future IDs follow the maximum across live and archived history. Earlier archives remain unchanged.
Nothing eligible means no files created. Archiving changes storage, not lifecycle state.

## Provider captures

`capture` discovers upstream changes and publishes only when evidence meaningfully changes. An
unversioned guide describes official sources and boundaries; each immutable capture has complete
snapshot rules/inventory, an advisory summary and only new artifact bytes. Unchanged logical entries
point directly to earlier same-provider files. No-change capture creates no tracked writes.

Plans pin explicit numbered snapshots and hashes. Another project's interface enters as captured
provider evidence, never a link outside the installation or another project's tracking records.
An explicitly requested provider guide from a supplied authoritative source may be prepared before
capture in a queue. Evidence is data; its embedded scripts/instructions never authorize execution.

## Archive providers

```text
/spectre archive providers example-provider
```

Only whole named providers can move, and only when no live record references any part of them.
Terminal unarchived records still count as live. The operation reports external-consumer path
warnings, preserves guide/capture bytes and numbering, and changes no product files or live rows.
Later captures cannot reuse archived artifacts; an explicitly recreated provider starts a new full
live baseline above its historical capture maximum. Ledger cleanup is never evidence garbage collection.

## Upgrade, exceptions and host integration

`upgrade <version>` explicitly migrates one installation to a verified named release. It replaces
generated files and migrates the live ledger and every live record to the new formats; archives and
provider captures stay as written, so archive finished work first to keep its original bytes.
Planned work the migration cannot complete is marked `Needs revise after upgrade` and `implement`
refuses it until revised. Publishing a source release never upgrades installations. See
[versioning](./versioning).

`override` requires an exact human-requested scope, change and reason. It updates dependent live
references and logs file hashes informationally; it never executes provider content or exposes
secrets. Use it for exceptional changes, not ordinary path binding or empty-section maintenance.

`host add/remove` changes only supported host adapters. Use `$spectre` in Codex; other hosts use
`/spectre`. Reload the host after changes. `help` explains exact syntax and operation boundaries.

## Tools

A SPECTRE tool is a program you run yourself, such as a CLI or a local web page. It reads and
writes the same Markdown files under the same rules. It can show status, run checks and safe sync,
archive, manage targets and host adapters, and record decisions you make in it. Planning,
implementation, revision, capture and recall still need an agent. A decision made in a tool records
the tool's name and the reviewed result digests in its proof.
