# SPECTRE

**Specification · Planning · Evidence · Change · Traceability · Review · Execution**

SPECTRE is a Markdown-only protocol that connects a bounded implementation plan to its declared
evidence, source changes, validation, and final human decision.

After installation, start SPECTRE with an explicit command. Direct implementation follow-ups to
identified plans, such as "implement these one by one", also run the complete tracked workflow.
Other ordinary requests leave SPECTRE inactive. Planning never starts implementation automatically.

## Published resources

- `https://wiki.xraynetwork.io/spectre/` — documentation
- `https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md` — current-release mirror
- `https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md` — v1.0.0 protocol (in development)

## Install

Ask a coding agent:

```text
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The mirror identifies the current release. The installer verifies its versioned canonical copy
and pins that release locally; later mirror updates do not change existing installations.
For a particular release, use its versioned URL and name that version in the prompt.

The pinned standard installs as `.agents/spectre/SPECTRE-PROTOCOL.md`, with its command skill at
`.agents/skills/spectre/SKILL.md`. Installation creates root `SPECTRE.md` as the adopting project's
implementation summary and sole active lifecycle ledger. Archived decisions remain in immutable
batch manifests under `.agents/spectre/archive/`.

Installation also extracts `runtime/core.md`, `selectors.md`, `references.md`, `validation.md`,
and nine command modules from marked sections of the complete protocol. The small skill router loads only shared
rules and the selected operation's dependencies on each call. Templates, record contents, and
required evidence load when needed; installation and full integrity checks retain their full scope.
Runtime files are generated verbatim, checked against the pinned protocol, and never maintained
as separate summaries. Missing or stale modules block a command without an implicit repair.

## Commands

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

`/spectre` is the cross-agent spelling. In Codex, invoke the repository skill with `$spectre` and
the same arguments. Record selectors accept IDs or natural descriptions; target and provider
selectors accept descriptions too. For example:

```text
/spectre implement the health endpoint plan
/spectre reject last implementation: missing the required validation
```

The agent reports the resolved identity and asks when a match is ambiguous or a required decision
reason is missing. A bounded implementation follow-up uses the same selector and workflow rules.
For a fixed batch, use `/spectre implement --batch typescript/0025..0029`, a comma-separated list
of qualified IDs, or `/spectre implement the plans just listed one by one`. The agent reports the
resolved order, then implements, validates, writes a result and updates REVIEW for each item before
the next. It stops on blockers, records partial progress, and can resume existing changes. No batch
authorizes acceptance, new plans, capture, or arbitrary combinations of operations.

`PROVIDER.md` is unversioned information about the provider, official sources, tracking and summary
requirements. Each immutable numbered capture has a `SNAPSHOT.md` specification and `CAPTURE.md`
summary. The first `artifacts/` contains the full selected baseline; later captures store only new
or changed bytes. Their complete inventory points unchanged entries directly to earlier files.
Removed evidence disappears from the new inventory while its historical files remain available.

`capture` detects upstream changes, verifies evidence and publishes only when needed. A no-change
capture creates no folder or summary. Validation runs automatically inside the workflows; it does
not require a separate command. Plans pin a numbered snapshot and hashes, including resolved earlier artifacts; a separate
Git commit is not a protocol prerequisite. Capture, planning and implementation remain separate
human-triggered operations. See [provider captures](docs/src/pages/commands.md#provider-captures).

`archive [target]` moves terminal implementations and their decision rows into a dated archive,
clearing those rows from the active ledger. `PLANNED` and `REVIEW` stay active. Record contents,
decision proofs, and reference identity are preserved; implementation IDs never restart. Use
`list --archived` to browse history and `status <record>` to find a record in either location.

## Repository layout

```text
.
├── protocol/
│   └── v1.0.0/
│       └── SPECTRE-PROTOCOL.md
└── docs/
    ├── src/pages/public/        # generated release assets
    ├── rspress.config.ts
    └── wrangler.jsonc
```

`protocol/` is the single canonical release source. Version 1.0.0 is still in development and
these changes update it in place; no new standard or record-schema version is introduced. The documentation build generates both
the public current-release mirror and versioned raw assets directly from it. This source
repository does not install its own `.agents/` tracking or command structure; the v1 protocol
instructs adopting repositories to create it during installation.

Adopting repositories extract runtime modules locally from the pinned protocol during installation.
The docs publisher does not generate separate runtime downloads.

## Documentation

```sh
cd docs
npm install
npm run dev
```

Check protocol structure with `npm run check:protocol`. Build with `npm run build`; deploy the `wiki-spectre-docs` Cloudflare Worker with
`npm run deploy`.

## License

SPECTRE is available under the [MIT License](./LICENSE).
