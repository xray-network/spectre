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
/spectre implement <target>/<id>
/spectre revise <target>/<id>: <changes>
/spectre status <target>/<id>
/spectre list [target] [state] [--archived]
/spectre validate [target/id]
/spectre accept <target>/<id>: <proof>
/spectre reject <target>/<id>: <proof>
/spectre cancel <target>/<id>: <reason>
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

For example, `implement api/0002` is an ordinary request; `/spectre implement api/0002` explicitly
starts the SPECTRE implementation workflow. In Codex, use `$spectre implement api/0002`.
Missing or malformed required arguments produce syntax guidance without running another operation.

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
eligible records exist, the command changes nothing. An unknown target is an error.

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
