# Commands

SPECTRE exposes one command namespace with one operation per request. The command selects a
workflow and its stopping boundary; it never authorizes a later operation automatically.

```text
/spectre plan <target>: <objective>
/spectre implement <target>/<id>
/spectre revise <target>/<id>: <changes>
/spectre status <target>/<id>
/spectre list [target] [state]
/spectre validate [target/id]
/spectre accept <target>/<id>: <proof>
/spectre reject <target>/<id>: <proof>
/spectre cancel <target>/<id>: <reason>
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

## Lifecycle boundaries

- `plan` creates one `PLANNED` instruction and does not modify product source.
- `implement` and `revise` validate and stop in `REVIEW`.
- `status`, `list`, `validate`, and `help` do not change tracked files or lifecycle state.
- `accept`, `reject`, and `cancel` require an explicit current-human decision and proof or reason.
- `capture` records provider evidence but does not plan or implement product work.

Use `/spectre help [operation]` for the exact syntax and boundary of a particular operation.
