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
- [Protocol](https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md) — latest version; earlier versions are not kept

## Install

Ask a coding agent:

```text
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The installer installs the exact protocol bytes it read, extracts its runtime/templates, and
creates the accepted installation record. Later publication never changes an existing installation.
It installs into the repository root unless you name another folder; a repository can hold several
independent installations, combined or split later with `absorb` and `detach`. No slash command is
installed: natural-language requests work through the `AGENTS.md` pointer, and you can create your
own `/spectre` command that points to `.agents/spectre/ROUTER.md`.

## Work and maintenance

Natural language and explicit commands select the same workflows:

```text
Spectre plan <target>: <objective>
Spectre implement <record>
Spectre implement --batch <records>
Spectre revise <record>: <changes>
Spectre accept <records>: <proof>
Spectre reject <records>: <proof>
Spectre cancel <records>: <reason>
Spectre status [scope] [state] [--archived]
Spectre recall [target]: <question>
Spectre sync [scope]
Spectre archive [scope]
Spectre capture <provider>
Spectre upgrade
Spectre override <scope>: <changes> because <reason>
Spectre absorb <path>
Spectre detach <target> to <path>
Spectre help [operation]
```

Open work is closed by explicit cancellation, never by an archive flag. Decisions about existing
records can be queued with applicable human proof; future results always require a checkpoint. Setup
and override remain standalone. An optional SPECTRE tool you run yourself can show status, run
checks and record your decisions in the same files. See the
[command reference](wiki/src/pages/commands.md).

## Tracking model

| Source | Authority |
| --- | --- |
| Root `SPECTRE.md`, Targets table | Stable target identities, current source paths, active/retired status |
| Root `SPECTRE.md`, Implementations | Unarchived implementation rows, grouped only under populated targets |
| Root `SPECTRE.md`, Providers | Live providers: source, tracking, latest capture and the records that pin them |
| `.agents/spectre/*/__archive/<timestamp>/ARCHIVE.md` | Archived rows and preserved human decisions |

Targets register on first planning, with an ID derived from the folder path or package name; a
folder rename changes `Path`, not historical IDs: run `sync` and it proposes the new path. Records
live in `implementations/<target>/` in every installation. Archiving moves terminal rows to the
`ARCHIVE.md` of a new `implementations/__archive/<timestamp>/` folder and their files there,
unchanged; whole providers archive the same way under `providers/__archive/`. Target retirement
keeps identity/history. IDs continue above all live and
archived IDs, never restart.
`upgrade` is a human-ordered override that brings the installation to the latest protocol: it
rewrites the live ledger, live records and provider guides and captures to the current formats in
place, updates every digest and pin that depends on them, and logs each file. Archived records are
never rewritten; record files from earlier layouts move into the current one.

`sync` checks tracking, fixes safe bookkeeping at once, proposes target fixes for your answer and
reports blockers; asked for a report only, it writes nothing. It never infers record state or
deletes evidence. Tracking is plain Markdown with no locks or transaction
logs: every operation writes in one order and its last write is its commit point, so an interrupted
write leaves a named state that `sync` reports and finishes when provably safe. Version
control is the backup. Provider guides remain unversioned, captures remain
numbered snapshots with full logical inventories and reused earlier artifact bytes; only an upgrade
rewrites their format, never their artifacts.

## Source and validation

`protocol/SPECTRE-PROTOCOL.md` is the only source; it carries `Protocol-ID` and `Protocol-Version`,
and earlier versions are not kept. The wiki build publishes it as `/spectre/SPECTRE-PROTOCOL.md`.
The protocol's marked sections define all 25 runtime modules and three canonical templates; adopters
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
