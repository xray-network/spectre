# XRAY/SPECTRE

**Specification · Planning · Evidence · Change · Traceability · Review · Execution**

SPECTRE is a Markdown protocol connecting bounded plans, implementation, validation evidence, and
human decisions. Describe work naturally; the agent resolves targets and operations, reports a
bounded queue, and keeps records and ledgers synchronized. An explicit request to deliver a
new change includes its required planning step; a planning-only request stops before source work.

```text
Spectre, plan this change for the API target, implement it, then archive after my decision.
```

The agent plans and implements, then pauses in `REVIEW`. A direct reply to that exact checkpoint,
such as `Accept it and continue`, records your decision and resumes the authorized archive. New
workflows require a SPECTRE mention; unrelated work stays outside tracking. No automatic acceptance.

## Published resources

- [Documentation](https://wiki.xraynetwork.io/spectre/)
- [Current-release mirror](https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md)
- [v1.0.0 protocol](https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md) — current

## Install

Ask a coding agent:

```text
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The installer verifies the versioned canonical bytes, pins that release locally, extracts its
runtime/templates, and creates the accepted installation record. Later publication never changes
an existing installation. Installation adds no host adapter; natural-language requests work through
the `AGENTS.md` pointer. `Spectre host add codex` optionally adds `$spectre` for Codex; other supported
hosts use `/spectre`. Reload the host after adapter changes.

## Work and maintenance

Natural language and explicit commands select the same workflows:

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

Open work is closed by explicit cancellation, never by an archive flag. Decisions about existing
records can be queued with applicable human proof; future results always require a checkpoint. Setup
and override remain standalone. An optional SPECTRE tool you run yourself can show status, run
checks and record your decisions in the same files. See the
[command reference](wiki/src/pages/commands.md).

## Tracking model

| Source | Authority |
| --- | --- |
| `.agents/spectre/TARGETS.md` | Stable target identities, current source paths, active/retired status |
| Root `SPECTRE.md` | Unarchived implementation rows, grouped only under populated targets |
| `.agents/spectre/archive/<id>/ARCHIVE.md` | Archived rows and preserved human decisions |

Targets register on first planning; a folder rename changes `Path`, not historical IDs. Archiving
preserves terminal record bytes and removes their live rows and newly empty sections. Target
retirement keeps identity/history. IDs continue above all live and archived IDs, never restart.

`check` diagnoses without writes; `sync` makes only deterministic bookkeeping corrections. Neither
infers record state or deletes evidence. Tracking is plain Markdown with no locks or transaction
logs: every operation writes in one order and its last write is its commit point, so an interrupted
write leaves a named state that `check` reports and `sync` finishes when provably safe. Version
control is the backup. Provider guides remain unversioned, captures remain
immutable numbered snapshots with full logical inventories and reused earlier artifact bytes.

## Source and validation

`protocol/v1.0.0/SPECTRE-PROTOCOL.md` is the current canonical source. Released versions are frozen.
The wiki build generates versioned raw assets, the latest mirror, and release hashes from `protocol/`.
The protocol's marked sections define all 25 runtime modules and four canonical templates; adopters
extract them verbatim, never maintain independent summaries. Protocol enhancements are planned
and tracked through this repository’s SPECTRE records.

This repository also has its own separately pinned SPECTRE installation. Editing/publishing a
protocol release does not upgrade that installation or other adopting repositories.

Run commands from `wiki/`:

```sh
npm install
npm run check:protocol
npm run test:protocol
npm run build
```

`check:protocol` verifies every release's extraction and rule placement. `test:protocol` checks
release structure, selective runtime dependencies, table escaping and rejection of
malformed/contradictory releases. These checks do not implement
the planned SPECTRE tool (§16 of the protocol). `npm run dev` starts documentation;
`npm run deploy` builds and deploys the `wiki-spectre-docs` Cloudflare Worker.

## License

SPECTRE is available under the [MIT License](./LICENSE).
