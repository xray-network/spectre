# Commands

SPECTRE exposes one command namespace. A command selects one workflow and its stopping boundary.
An explicit natural-language request mentioning SPECTRE may instead queue multiple separately stated
non-decision operations; this is a protocol rule, not another command.

SPECTRE activates when the current-human message contains the standalone word `spectre`, including
`/spectre`, the host-native form `$spectre`, `Spectre:`, or natural language such as `using Spectre`.
Matching is case-insensitive, and the mention may appear anywhere. Every message must opt in
independently. Prior context and requests that omit SPECTRE—including batches, "implement these one
by one", and "continue the queue"—leave tracking inactive. Capability questions and quoted examples
may mention SPECTRE but do not authorize lifecycle mutation. Planning alone never starts
implementation. Accept, reject, and cancel remain separate commands and can never be queued.

```text
/spectre plan <target>: <objective>
/spectre implement <record>
/spectre implement --batch <records>
/spectre revise <record>: <changes>
/spectre status <record>
/spectre recall [target]: <question>
/spectre list [target] [state] [--archived]
/spectre accept <records>: <proof>
/spectre reject <records>: <proof>
/spectre cancel <records>: <reason>
/spectre archive
/spectre archive implementations [target] [--force: <reason>]
/spectre archive providers <provider> [<provider>...] [--force: <reason>]
/spectre override <scope>: <changes> because <reason>
/spectre capture <provider>
/spectre addslash <host> [<host>...]
/spectre removeslash <host> [<host>...]
/spectre help [operation]
```

## Agent invocation

`/spectre` is the canonical cross-agent notation. Installation registers no slash command in any
agent. Until you add one, mention SPECTRE in natural language; the `AGENTS.md` pointer leads the
agent to the router:

```text
Spectre: plan api: add health endpoint
```

Add the slash command for the agents you use, then reload or restart each agent so it discovers the
command:

```text
Spectre addslash claude
/spectre addslash codex cursor
/spectre removeslash cursor
```

| Host | Adapter file | Invocation |
| --- | --- | --- |
| `codex` | `.agents/skills/spectre/SKILL.md` | `$spectre plan api: add health endpoint` |
| `antigravity` | `.agents/skills/spectre/SKILL.md` | `/spectre plan api: add health endpoint` |
| `claude` | `.claude/skills/spectre/SKILL.md` | `/spectre plan api: add health endpoint` |
| `cursor` | `.cursor/commands/spectre.md` | `/spectre plan api: add health endpoint` |
| `copilot` | `.github/prompts/spectre.prompt.md` | `/spectre plan api: add health endpoint` |
| `gemini` | `.gemini/commands/spectre.toml` | `/spectre plan api: add health endpoint` |
| `opencode` | `.opencode/commands/spectre.md` | `/spectre plan api: add health endpoint` |
| `windsurf` | `.windsurf/workflows/spectre.md` | `/spectre plan api: add health endpoint` |

Codex and Antigravity share one file, so adding or removing either changes it for both. Each adapter
lives at the repository root and only points to the installed router, so every agent follows the
same rules. The adapter file is the only state: SPECTRE writes no ledger row, record, or log for it,
and nothing lists which adapters exist. `addslash` and `removeslash` are standalone commands and
never join a queue.

After installation, the router lives at `.agents/spectre/ROUTER.md`, next to the installed state,
immutable records, templates, and provider evidence under `.agents/spectre/`.

The router loads `runtime/modules/core.md` plus the selected command file. It adds selector/reference rules
and templates only where required. For a compound queue, it first loads selector rules and reports
the normalized queue, then loads each operation's dependencies when that item begins. For example,
rejection loads `core.md`, `selectors.md`, `references.md`, `validation.md`, and
`commands/decide.md`, then the relevant ledger and records. It does not read installation
instructions, provider rules, or every other command. Source-hash checks use local tools without
loading the full protocol text. Validation is split by need: `validation.md` holds the record checks
every workflow applies, `validation-evidence.md` and `providers.md` load only when provider evidence
is captured or consumed, and `validation-full.md` loads for archive and upgrade, which validate the
full installation.

For example, `/spectre implement api/0002` explicitly starts implementation. After a human or
SPECTRE report identifies that existing plan in the conversation, `Spectre implement this` starts
the same workflow, including tracking. The phrase
`implement this` without SPECTRE never activates it, even with that context. Ambiguous scope pauses
before source or record changes; it never falls back to untracked implementation.

## Describe the target naturally

`<record>` can be an exact ID such as `api/0002`, a unique title or description, or a reference
such as `this implementation` or `last implementation`. Decision `<records>` additionally accepts
bounded plural sets. Target and provider arguments also accept plain descriptions of a
repository/package or existing provider guide.

```text
/spectre plan the backend service: add a health endpoint
/spectre implement the health endpoint plan
/spectre revise this implementation: cover the timeout case
/spectre revise the planned health endpoint: require a JSON content type
/spectre status last implementation
/spectre list the frontend app REVIEW
/spectre accept this implementation: reviewed the diff and checks
/spectre accept api/0004, api/0005: reviewed both results and checks
/spectre reject last implementation: missing the required validation
/spectre cancel the old login plan: superseded by the new approach
/spectre archive implementations of the backend service
/spectre archive the old payments provider
/spectre capture the payments provider
```

The agent resolves the description, reports its canonical ID or scope, and proceeds when the match
is unique. If several records could match, it asks you to distinguish them by description or ID.
An invalid exact ID never falls back to a similar record. Stored references always use canonical IDs.

`last` means the latest created instruction: highest ID within a target, or the unique latest
instruction `Created` timestamp across targets. Ties or missing chronology require clarification.
`the one you just implemented` uses verified conversation context; `last implemented` requires
actual completion-order evidence. The agent never skips an ineligible latest record to operate
on an older one. For example, rejecting an accepted latest implementation is refused.

Use a colon before the objective, changes, or decision reason. Natural phrasing also works when
its meaning is clear:

```text
/spectre reject the login change because the timeout check is missing
```

`/spectre reject last implementation` is incomplete because the agent still needs your rejection
reason before recording the decision. Repeat the explicit command with that reason. An ambiguous
selector or a missing reason never causes a guessed decision.

Optional scope works as before: `list` and `archive` without a target cover all targets.
`archive implementations` selects a whole target's terminal records,
so a description of one implementation does not silently expand to its target. `archive providers`
needs at least one named provider and never selects all of them. `help` takes an
operation name. For `list`, keep the state and final `--archived` flag explicit; quote a target
selector that would otherwise be read as a state, for example `/spectre list "review"`.

## Queue operations in natural language

No `run` or `queue` command is required. Mention SPECTRE and state at least two non-decision
operations:

```text
Using Spectre, capture provider2, create and capture provider3 from
https://github.com/example/provider3, create the needed plans for the TypeScript target,
then implement every plan created by this request.
```

Before changing files, the agent reports the normalized items, dependencies, resolved scopes and
order. Human order is preserved when valid; dependency-required reordering is explained. Every
item remains a separate ordinary operation and completes its validation and record writes before
the next begins.

Later items may refer to earlier outputs. The queue records a deferred binding such as `plans
created by this request`, then reports and freezes the exact canonical IDs before that item writes.
`create the needed plans` may expand into one plan per independently reviewable objective after its
declared captures exist; those objectives are bounded and reported before the first plan is created.
Unrelated or subsequently created records never join the queue.

On a blocker, completed work remains complete, partial work is recorded by its operation, and all
remaining items are reported exactly. `Spectre continue the queue` resumes that same identified
remainder without repeating finished work or widening scope; a continuation omitting SPECTRE does not.

A compound queue may explicitly prepare a missing provider guide from a supplied authoritative
source immediately before capturing it. Provider preparation creates and validates only
`PROVIDER.md`; the capture is the next separate queue item. Existing guides are never overwritten.

Accept, reject and cancel are forbidden in compound queues. If one is included, no queue item runs;
issue the operational request without the decision, then use a separate decision command after the
implementations reach REVIEW.

## Implement plans one by one

```text
/spectre implement --batch typescript/0025..0029
/spectre implement --batch repository/0002, repository/0003, typescript/0025
/spectre implement the plans just listed one by one
```

You can also reply `Spectre implement these one by one` after the plans have been identified in the
conversation. The name makes it an instruction to execute a bounded implementation batch. The same
reply without SPECTRE is not execution authorization. A question such as "can SPECTRE support
batches?" mentions SPECTRE but authorizes no mutation.

The agent resolves the full set to existing canonical IDs and reports the order before editing.
Explicit ranges must contain every ID; duplicate, missing, ambiguous or ineligible records are not
silently skipped. An unqualified "all" needs an established scope. New plans created later never
join the selected set automatically.

For each item, the agent completes source changes, required checks, the matching result, and the
`REVIEW` ledger update before starting the next. Permission does not need repeating between selected
items. Human acceptance is required only when a declared dependency demands an ACCEPTED result;
a batch cannot waive that requirement or accept its own work.

On a blocker, the batch stops. Finished items stay in REVIEW; started work has a partial result,
actual check outcomes and a PLANNED row explaining what remains. Unstarted plans stay unchanged.
`Using Spectre, continue the remaining plans` resumes the same fixed set: reconcile existing changes,
verify completed records, and finish missing work. The phrase without SPECTRE does not activate it.
Do not rewrite correct code or invent prior validation. A fresh request to change REVIEW work still
uses an explicit `revise` invocation.

The completion report lists every selected ID and its actual outcome. Source edits with a missing
result or a stale PLANNED row are not a completed implementation. An implementation batch does not
combine planning, capture, revision or human decisions; only a compound request mentioning SPECTRE queues
separately stated non-decision operations.

## Revise planned or review work

```text
/spectre revise api/0004: also validate the degraded dependency response
```

`revise` accepts exactly one active `PLANNED` or `REVIEW` record. For a `PLANNED` record, it refines
the existing instruction within the same bounded objective, synchronizes its ledger row and any
existing partial result, and leaves the record `PLANNED`. It does not change product source or tests;
a later explicit `implement` operation is still required.

For a `REVIEW` record, `revise` changes the implementation within the existing instruction, reruns
affected checks, updates the existing result, and leaves the record in `REVIEW` for a human decision.
A revision that creates an independently reviewable capability, changes ownership, or makes the
original objective misleading requires a new plan instead.

## Decide multiple implementations

Accept, reject, and cancel remain standalone human commands, but each can select one or a bounded
set without a `--batch` flag:

```text
/spectre accept api/0004, api/0005: reviewed both results and their required checks
/spectre reject typescript/0025..0027: the captured behavior is implemented incorrectly
/spectre cancel the three migration plans just listed: superseded by the new design
```

The agent resolves and reports the complete set before changing anything. Comma-separated IDs,
target-local ranges, and bounded plural descriptions are supported. An unqualified `all`, `these`,
or `them` needs an established target or conversation scope; cross-target ID lists are qualified.

A decision on exactly one record may omit its proof; the agent then records your verbatim command
and the date. A set of two or more records always needs a written proof or reason.

Every selected record must be eligible: accept and reject require active REVIEW records, while
cancel requires active PLANNED records. Missing, duplicate, ambiguous, archived, terminal, or
wrong-state records invalidate the complete selection. Nothing is silently filtered or partially
decided. One proof or reason must apply to every selected record; otherwise use narrower commands.
After preflight, all selected decision cells are updated in one root-ledger edit and validated
together. The command never changes record files, product source, evidence, or unrelated rows.

## Provider captures

Run one human-triggered capture operation:

```text
/spectre capture the uplc provider
```

`capture` compares selected upstream evidence with the latest complete numbered snapshot, validates
the complete candidate and publishes a new capture when needed. There is no separate check or
validation command. It reports `CAPTURED` with the new ID, `NO-CHANGE` without tracked writes, or
`BLOCKED` with the reason. A failed fetch or incomplete inventory is a blocker, not proof that
evidence was removed or unchanged. Discovery and publication proceed under the same authorization;
no second command or redundant approval is needed. An explicitly queued preparation may create a
missing provider guide from a human-supplied authoritative source immediately before capture;
ordinary capture still requires an existing guide. A standalone capture tracks upstream changes
between plans; planning captures the providers it relies on by itself, so you never need to capture
before planning.

```text
providers/<provider>/
├── PROVIDER.md
├── 0001/
│   ├── SNAPSHOT.md
│   ├── CAPTURE.md
│   └── artifacts/      # full selected baseline
└── 0002/
    ├── SNAPSHOT.md
    ├── CAPTURE.md
    └── artifacts/      # only new or changed bytes
```

`PROVIDER.md` explains the upstream protocol or implementation, official sources, tracking intent,
evidence domains, summary requirements and maintained consumers. It has no provider version or
exact capture counts. Four-digit directories identify evidence captures, not provider versions.

Each `SNAPSHOT.md` owns the complete specification: upstream revisions, selection/mapping, resolved
inventory, artifact/corpus/case counts, formats, transformations, hashes, licenses and consumer
boundaries. Its inventory maps every logical artifact to a physical path and hash in this or an
earlier same-provider capture. Verify completeness against independently enumerated source
membership and preserve binary bytes. Every reused file must match its pinned owner's inventory.

Each `CAPTURE.md` summarizes that baseline or update, relevant behavior and consumer impact. It
links evidence and the specification, distinguishing observation from inference. Exact inventory,
counts and verification rules remain in SNAPSHOT.md; the summary is advisory. Describe semantics
without assuming a language, then map actual maintained modules/APIs, tests and recommended work.
TypeScript can be the initial maintained consumer; C++ and other targets remain opt-in.

The first capture stores the full selected baseline. Later captures store only new or changed
bytes, referencing earlier files for unchanged evidence. For example:

| Logical artifact in 0002 | Physical file | Meaning |
| --- | --- | --- |
| `rules.cddl` | `0001/artifacts/rules.cddl` | Unchanged; reused |
| `cases.json` | `0002/artifacts/cases.json` | Changed; new bytes |
| `new-case.bin` | `0002/artifacts/new-case.bin` | Added |

If an old artifact is removed upstream, the new snapshot records the removal and excludes that
logical path from its inventory. Its earlier file stays intact for historical consumers. Renames
or reintroductions reuse earlier identical bytes where available, with explicit logical mapping
and provenance. A changed packed corpus can be a whole new file; unchanged corpora are referenced.

Every new snapshot lists the full effective inventory, so consumers resolve exact files directly
without replaying a chain of deltas. Earlier referenced directories must remain available. The new
directory alone is not a standalone export; include its complete referenced evidence when sharing.

A no-change capture creates no directory, number, summary, index update or timestamp change.
Unrelated upstream commits or summary rewording do not justify another capture. A meaningful
removal-only or specification-only update may have zero new artifact files and omit `artifacts/`.
Publication verifies the entire new snapshot and reused evidence before making one new directory
visible; it never overwrites old captures.

A plan captures what it needs first. It reports the providers it relies on, captures each one,
and then pins the results:

```text
/spectre plan typescript: implement the relevant UPLC conformance changes
```

A `NO-CHANGE` capture leaves the plan pinned to the latest capture; a `BLOCKED` capture stops the
plan. Plans without provider evidence capture nothing. A plan never changes a provider's selection
rules or creates a missing provider guide. Anything used from another project, including a sibling
in the same monorepo, is also a provider: capture its published interface rather than linking to it.

Plans pin the evidence repository (always this installation), provider/capture ID, SNAPSHOT.md path/hash and selected logical
artifact hashes. Implementation verifies the complete resolved inventory and uses those exact
files, never the latest capture. A separate Git commit is not a protocol prerequisite; version
control remains recommended repository practice. SPECTRE never commits automatically.

Everything is human-triggered: no schedules, GitHub Actions or automatic implementation. Existing
full numbered captures, including those from earlier protocol versions, are retained as baselines
and artifact owners without rewriting them; each stays governed by the version that created it.
Capture directories never move or get renamed, and their IDs count toward the sequence. Preserve
old references and terminal records; source updates do not migrate installations.

## Override the rules

```text
/spectre override cardano-lib archives: rename targets with prefix cardano-lib- because of the root merge
```

`override` applies a change that the other rules forbid or do not define, such as renaming archived
records, rewriting terminal records, or moving evidence. Only you can order it; an agent never
starts one, and it never joins a queue. The agent reports every file it will change before writing,
applies exactly the requested change, and updates everything active that depends on it: provider
pins, ledger rows, and links to moved files. Archives are kept as is and need no update. The installation then validates on its
own files. The agent also appends one row per file to `.agents/spectre/logs/OVERRIDES.md` with your
command, the reason, and the file's old and new path and SHA-256. That log is informational only:
nothing reads it, its own `logs/.gitignore` (`*`) keeps it out of Git, and you can trim or delete
`logs/` whenever you like. The agent proposes a commit message with your command and reason, so Git
history keeps the durable record.

An override never commits or prints secrets, never runs provider content, and still needs a message
that mentions SPECTRE. Every override weakens the guarantee that records match what was decided, so
use it for deliberate restructuring rather than routine edits.

## Recall past decisions

```text
/spectre recall why does the API reject duplicate certificates
/spectre recall typescript: how is UPLC conformance tested
```

`recall` answers a question about past work using only the records. It searches the active ledger
and every archive, reads the relevant instructions and results, and answers with accepted decisions
first. Pending, planned, superseded, rejected, and cancelled records are labeled separately. Every
statement cites the record's ID and links to its instruction or result, with its decision proof,
validation, and any provider capture it pinned. When the records do not answer the question, recall
says so. It is read-only: it changes no files and creates no records.

## Lifecycle boundaries

- `plan` captures the providers it relies on, then creates one `PLANNED` instruction, and does not
  modify product source.
- `implement` completes each selected item through validation, result and `REVIEW`; batches run
  sequentially and stop at blockers. `revise` refines one PLANNED instruction or updates one REVIEW
  implementation and result, keeping the record in its current state.
- `status`, `recall`, `list`, and `help` do not change tracked files or lifecycle state.
- Validation is automatic inside workflows: complete installation checks for install/update/archive,
  affected records and inputs for lifecycle changes, and complete candidate evidence for capture.
- `accept`, `reject`, and `cancel` require a separate explicit current-human decision and proof or
  reason. Each may atomically select one or a bounded eligible record set; none may enter a queue.
- `capture` tracks provider evidence between plans but does not plan or implement product work.
- A forced archive (`--force: <reason>`) is also a decision and never enters a queue. For
  implementations it closes open records as `CANCELLED` before archiving.
- `archive` moves terminal records and their decision rows, or whole unused providers, into a dated
  archive, validates, and stops. It does not change lifecycle states.

## Archive completed work

`archive` names what it moves: `implementations` or `providers`. Bare `/spectre archive` is short
for archiving every finished implementation and takes nothing after it; `/spectre archive api`
gets a question asking whether you meant `/spectre archive implementations api`. `implementations`
and `providers` can never be target names.

```text
/spectre archive
/spectre archive implementations api
/spectre list --archived
/spectre list api ACCEPTED --archived
/spectre status api/0002
```

`archive implementations` selects all targets; an optional target limits it to that existing target. Only
`ACCEPTED`, `REJECTED`, and `CANCELLED` records move. `PLANNED` and `REVIEW` stay active. If no
eligible records exist, the command changes nothing. An unknown or ambiguous supplied target
requires clarification; it never becomes an all-target archive.

A forced archive closes everything instead:

```text
/spectre archive implementations --force: closing before the SPECTRE upgrade
```

It first moves every `PLANNED` and `REVIEW` record in scope to `CANCELLED` with your reason, then
archives all terminal records. An existing defect, such as an unresolvable legacy link, is listed
in the manifest's `Known issues` table instead of blocking the archive; a defect the archive itself
would create still blocks it. Already archived records keep their state.

Each batch lives at `.agents/spectre/archive/<archive-id>/`, using a UTC timestamp and a numeric
suffix if needed to avoid collisions. It contains unchanged instruction and result files and an
immutable `ARCHIVE.md` with their decision rows, original paths, and SHA-256 digests. A cancelled
implementation without a result remains valid.

An archive is history, kept as is. Its paths and hashes are correct when the archive is written;
afterwards nothing re-checks or repairs it. A link inside an archive may stop resolving and a file's
bytes may differ from the recorded hash, and neither is a failure. Validation reads only each
manifest's header and its rows' IDs, states, and decision proofs; `status` mentions archive defects
as information. The accepted installation record may also be
archived; installing again must not recreate it.

The active ledger keeps its metadata and target table headers. A table becomes empty only when
all its records are terminal and selected for archiving. Implementation IDs continue above the
highest active or archived ID in their sequence, even after the active ledger is cleared.

`list` shows active-ledger records by default. Its final `--archived` flag shows archived records
only, with the same target and state filters and an archive location. `status` finds a record in
either location. Archiving automatically validates archives as well as active records. It adds no new
lifecycle state and never reopens completed work.

SPECTRE resolves references through each manifest's original-path map, so active plans can still
depend on archived accepted results without changing record contents. Embedded relative links in
archived files use their original location; use `status` or the manifest's direct file links when
browsing. Existing archives and provider evidence stay unchanged. Validation failures restore the
original files and ledger rather than leaving a partially cleared ledger.

## Archive providers

```text
/spectre archive providers cardano-ledger
/spectre archive providers cardano-cips message-signing
/spectre archive providers x402 --force: retired, captures predate the current pin rules
```

A provider archive moves each named provider whole, `PROVIDER.md` and every capture, unchanged
into `.agents/spectre/archive/<archive-id>/providers/<provider>/`. It never archives single
captures, because later captures reuse earlier captures' files. There is no `all` form.

- **Refused while used.** If any record in the active ledger, in any state, references a file of
  the provider, nothing moves and the agent lists those records. Archive or revise them first, or
  use an override. `--force` never changes this.
- **Outside readers are warned about, not fixed.** Before moving anything, the agent searches the
  repository outside `.agents/spectre/` for paths into the provider, such as tests that read
  provider artifacts, and reports each one. They don't block the archive, and the archive never
  edits them; updating them is ordinary work.
- **`--force`** only lists existing defects, such as a stale hash pin inside a capture, in the
  manifest's `Known issues` table instead of refusing. It closes no records.
- **Archived records keep working as history.** A pin in an archived record that names the old
  provider path resolves to the archived copy; anything that no longer resolves is information,
  as for every archive.
- **Tracking it again.** `capture` and `plan` no longer see an archived provider. Preparing it again
  under the same slug starts a new full baseline whose number continues above the archived
  captures, so no capture number is ever reused.

The manifest's `Kind: providers` header and `Archived providers` table record each provider's
original path, capture range, and file count.

Use `/spectre help [operation]` for the exact syntax and boundary of a particular operation.
