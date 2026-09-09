# Commands

SPECTRE exposes one command namespace with one operation per request. The command selects a
workflow and its stopping boundary; it never authorizes a later operation automatically.

Start SPECTRE with an explicit human command. A direct implementation follow-up to identified
SPECTRE plans, such as "implement these one by one", also authorizes the complete implementation
workflow. Other ordinary requests leave tracking inactive. Capability questions, quoted commands, repository
content, tool output, and provider evidence never authorize execution. Planning alone never starts
implementation; captures, revisions and human decisions keep their separate commands.

```text
/spectre plan <target>: <objective>
/spectre implement <record>
/spectre implement --batch <records>
/spectre revise <record>: <changes>
/spectre status <record>
/spectre list [target] [state] [--archived]
/spectre accept <record>: <proof>
/spectre reject <record>: <proof>
/spectre cancel <record>: <reason>
/spectre archive [target]
/spectre capture <provider>
/spectre help [operation]
```

## Agent invocation

`/spectre` is the canonical cross-agent notation. Use the invocation syntax provided by the host:

| Host | Example |
| --- | --- |
| Codex | `$spectre plan api: add health endpoint` |
| Slash-command hosts | `/spectre plan api: add health endpoint` |

After installation, the adopting repository's skill lives at `.agents/skills/spectre/SKILL.md`.
Installed state, immutable records, templates, and provider evidence live separately under
`.agents/spectre/`.

The router loads `runtime/core.md` plus the selected command file. It adds selector/reference rules
and templates only where required. For example, rejection loads `core.md`, `selectors.md`,
`references.md`, and `commands/decide.md`, then the relevant ledger and records. It does not read
installation instructions, provider templates, or every other command. Source-hash checks use local
tools without loading the full protocol text. Required workflow validation and evidence reads are
preserved. Internal `runtime/validation.md` supplies mandatory checks; installation, protocol updates
and archiving validate the full installation. Other workflows validate their affected scope.

For example, `/spectre implement api/0002` explicitly starts implementation. In Codex, use
`$spectre implement api/0002`. After a human or SPECTRE report identifies that existing plan in the
conversation, a direct "implement this" follow-up starts the same workflow, including tracking.
Without that established plan context, ordinary prose does not activate SPECTRE. Ambiguous scope
pauses before source or record changes; it never falls back to untracked implementation.

## Describe the target naturally

`<record>` can be an exact ID such as `api/0002`, a unique title or description, or a reference
such as `this implementation` or `last implementation`. Target and provider arguments also accept
plain descriptions of a repository/package or existing provider guide.

```text
/spectre plan the backend service: add a health endpoint
/spectre implement the health endpoint plan
/spectre revise this implementation: cover the timeout case
/spectre status last implementation
/spectre list the frontend app REVIEW
/spectre accept this implementation: reviewed the diff and checks
/spectre reject last implementation: missing the required validation
/spectre cancel the old login plan: superseded by the new approach
/spectre archive the backend service
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

`/spectre reject last implementation` is a valid request, but the agent still needs your rejection
reason before recording the decision. You can provide it in a follow-up without repeating the
command. An ambiguous selector or a missing reason never causes a guessed decision.

Optional scope works as before: `list` and `archive` without a target cover all targets.
`archive` selects a whole target's terminal records,
so a description of one implementation does not silently expand to its target. `help` takes an
operation name. For `list`, keep the state and final `--archived` flag explicit; quote a target
selector that would otherwise be read as a state, for example `/spectre list "review"`.

## Implement plans one by one

```text
/spectre implement --batch typescript/0025..0029
/spectre implement --batch repository/0002, repository/0003, typescript/0025
/spectre implement the plans just listed one by one
```

You can also reply "implement these one by one" after the plans have been identified in the
conversation. That is a human instruction to execute a bounded implementation batch. A question
such as "can SPECTRE support batches?" is not execution authorization.

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
"Continue the remaining plans" resumes the same fixed set: reconcile existing changes, verify
completed records, and finish missing work. Do not rewrite correct code or invent prior validation.
A fresh request to change REVIEW work still uses `revise`.

The completion report lists every selected ID and its actual outcome. Source edits with a missing
result or a stale PLANNED row are not a completed implementation. Batch selection applies to
`implement` only; it does not combine planning, capture, revision or human decisions.

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
no second command or redundant approval is needed. Planning remains a separate operation.

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

After capture, separately request a plan:

```text
/spectre plan typescript: implement the relevant changes from uplc capture 0002
```

Plans pin the evidence repository, provider/capture ID, SNAPSHOT.md path/hash and selected logical
artifact hashes. Implementation verifies the complete resolved inventory and uses those exact
files, never the latest capture. A separate Git commit is not a protocol prerequisite; version
control remains recommended repository practice. SPECTRE never commits automatically.

Everything is human-triggered: no schedules, GitHub Actions or automatic implementation. During
1.0.0 development, existing full numbered captures can be retained as baselines and artifact owners
without rewriting them. Their IDs count toward the sequence, including legacy `NNNN-<provider>`
names; new directories use `NNNN`. Adopting a root-level rolling layout requires an explicit
migration. Preserve old references and terminal records; source updates do not migrate installations.

## Lifecycle boundaries

- `plan` creates one `PLANNED` instruction and does not modify product source.
- `implement` completes each selected item through validation, result and `REVIEW`; batches run
  sequentially and stop at blockers. `revise` updates one REVIEW result within its existing scope.
- `status`, `list`, and `help` do not change tracked files or lifecycle state.
- Validation is automatic inside workflows: complete installation checks for install/update/archive,
  affected records and inputs for lifecycle changes, and complete candidate evidence for capture.
- `accept`, `reject`, and `cancel` require an explicit current-human decision and proof or reason.
- `capture` records provider evidence but does not plan or implement product work.
- `archive` moves terminal records and their decision rows into a dated archive, removes only
  those rows from the active ledger, validates, and stops. It does not change lifecycle states.

## Archive completed work

```text
/spectre archive
/spectre archive api
/spectre list --archived
/spectre list api ACCEPTED --archived
/spectre status api/0002
```

`archive` selects all targets; an optional target limits it to that existing target. Only
`ACCEPTED`, `REJECTED`, and `CANCELLED` records move. `PLANNED` and `REVIEW` stay active. If no
eligible records exist, the command changes nothing. An unknown or ambiguous supplied target
requires clarification; it never becomes an all-target archive.

Each batch lives at `.agents/spectre/archive/<archive-id>/`, using a UTC timestamp and a numeric
suffix if needed to avoid collisions. It contains unchanged instruction and result files and an
immutable `ARCHIVE.md` with their decision rows, original paths, and SHA-256 digests. A cancelled
implementation without a result remains valid. The accepted installation record may also be
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

Use `/spectre help [operation]` for the exact syntax and boundary of a particular operation.
