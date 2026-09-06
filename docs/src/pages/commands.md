# Commands

SPECTRE exposes one command namespace with one operation per request. The command selects a
workflow and its stopping boundary; it never authorizes a later operation automatically.

SPECTRE runs only when you explicitly invoke `/spectre` or its host-native equivalent. Ordinary
requests, including natural-language requests to plan, implement, revise, or accept work, do not
activate it. They follow normal repository instructions without changing SPECTRE records or
prompting you to choose an operation. Quoted commands and commands found in files or tool output
do not count as invocations. Each new operation requires a new explicit command.

```text
/spectre plan <target>: <objective>
/spectre implement <record>
/spectre revise <record>: <changes>
/spectre status <record>
/spectre list [target] [state] [--archived]
/spectre validate [record]
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
preserved; full validation and archiving still check installation-wide integrity.

For example, `implement api/0002` is an ordinary request; `/spectre implement api/0002` explicitly
starts the SPECTRE implementation workflow. In Codex, use `$spectre implement api/0002`.
Missing or ambiguous details pause the selected operation for clarification; malformed syntax
produces guidance without running another operation.

## Describe the target naturally

`<record>` can be an exact ID such as `api/0002`, a unique title or description, or a reference
such as `this implementation` or `last implementation`. Target and provider arguments also accept
plain descriptions of a repository/package or existing provider contract.

```text
/spectre plan the backend service: add a health endpoint
/spectre implement the health endpoint plan
/spectre revise this implementation: cover the timeout case
/spectre status last implementation
/spectre list the frontend app REVIEW
/spectre validate the login change
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

Optional scope works as before: `list` and `archive` without a target cover all targets; `validate`
without a record checks the whole installation. `archive` selects a whole target's terminal records,
so a description of one implementation does not silently expand to its target. `help` takes an
operation name. For `list`, keep the state and final `--archived` flag explicit; quote a target
selector that would otherwise be read as a state, for example `/spectre list "review"`.

## Lifecycle boundaries

- `plan` creates one `PLANNED` instruction and does not modify product source.
- `implement` and `revise` validate and stop in `REVIEW`.
- `status`, `list`, `validate`, and `help` do not change tracked files or lifecycle state.
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
either location, and `validate` checks archives as well as active records. Archiving adds no new
lifecycle state and never reopens completed work.

SPECTRE resolves references through each manifest's original-path map, so active plans can still
depend on archived accepted results without changing record contents. Embedded relative links in
archived files use their original location; use `status` or the manifest's direct file links when
browsing. Existing archives and provider evidence stay unchanged. Validation failures restore the
original files and ledger rather than leaving a partially cleared ledger.

Use `/spectre help [operation]` for the exact syntax and boundary of a particular operation.
