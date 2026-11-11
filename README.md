# SPECTRE

**Specification · Planning · Evidence · Change · Traceability · Review · Execution**

SPECTRE is a Markdown-only protocol that connects a bounded implementation plan to its declared
evidence, source changes, validation, and final human decision.

After installation, SPECTRE activates when the current message contains its standalone name,
including `/spectre`, a host-native form such as `$spectre`, or a natural-language mention such as
`using Spectre`. The mention is case-insensitive and may appear anywhere. Every message must opt in
independently; prior context and requests that omit SPECTRE—including batches and continuations—leave
it inactive. Planning never starts implementation unless the human separately states it as a later
queue item.

## Published resources

- `https://wiki.xraynetwork.io/spectre/` — documentation
- `https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md` — current-release mirror
- `https://wiki.xraynetwork.io/spectre/protocol/v2.3.0/SPECTRE-PROTOCOL.md` — v2.3.0 protocol (current)
- `https://wiki.xraynetwork.io/spectre/protocol/v2.1.0/SPECTRE-PROTOCOL.md` — v2.1.0 protocol (frozen)
- `https://wiki.xraynetwork.io/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md` — v2.0.0 protocol (frozen)
- `https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md` — v1.0.0 protocol (frozen)

## Install

Ask a coding agent:

```text
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The mirror identifies the current release. The installer verifies its versioned canonical copy
and pins that release locally; later mirror updates do not change existing installations.
For a particular release, use its versioned URL and name that version in the prompt.

The pinned standard installs as `.agents/spectre/runtime/SPECTRE-PROTOCOL.md`, and everything
generated from it, runtime modules and templates, goes under `runtime/modules/`; the command router `.agents/spectre/ROUTER.md` is the only top-level file.
Installation registers no slash command in any agent. It creates root `SPECTRE.md` as the adopting
project's implementation summary and sole active lifecycle ledger. Archived decisions remain in immutable
batch manifests under `.agents/spectre/archive/`.

Installation also extracts `runtime/modules/core.md`, `selectors.md`, `references.md`, `providers.md`,
`validation.md`, `validation-full.md`, `validation-evidence.md`, and twelve command modules from marked
sections of the complete protocol. The small skill router loads only shared
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

`/spectre` is the cross-agent spelling. Until a slash command is added, mention SPECTRE in natural
language, such as `Spectre help`. `addslash` adds the command for `codex` (invoked as `$spectre`),
`antigravity`, `claude`, `cursor`, `copilot`, `gemini`, `opencode`, or `windsurf`, and `removeslash`
removes it; reload or restart the agent afterwards. The adapter file is the only state. Record selectors accept IDs or natural descriptions; target and provider
selectors accept descriptions too. For example:

```text
/spectre implement the health endpoint plan
/spectre reject last implementation: missing the required validation
```

The agent reports resolved identities and asks when a match is ambiguous or a required decision
reason is missing. A follow-up such as `Spectre implement these plans one by one`
uses the same selector and workflow rules.
For a fixed batch, use `/spectre implement --batch typescript/0025..0029`, a comma-separated list
of qualified IDs, or `/spectre implement the plans just listed one by one`. The agent reports the
resolved order, then implements, validates, writes a result and updates REVIEW for each item before
the next. It stops on blockers, records partial progress, and can resume existing changes.

An explicit prompt such as `Using Spectre, capture provider2, create and capture provider3 from <GitHub
URL>, create the needed plans, then implement all plans created by this request` is normalized into
a fixed queue of separately bounded operations. The agent reports its order and deferred output
bindings before mutation, completes each workflow before the next, and stops with exact remaining
items on a blocker. This is a protocol rule, not a new command or lifecycle state. Accept, reject,
and cancel cannot appear in a queue.

A separate decision command can select one record, comma-separated IDs, a target-local range, or a
bounded plural description. The full set is checked before one all-or-nothing ledger edit, and the
same human proof or reason must apply to every selected record. For example:

```text
/spectre accept api/0004, api/0005: reviewed both results and their required checks
/spectre cancel the three migration plans just listed: superseded by the new design
```

`revise` accepts one active `PLANNED` or `REVIEW` record. On `PLANNED`, it refines the instruction
without changing product source and keeps the record planned; on `REVIEW`, it changes the bounded
implementation, reruns affected validation, updates the result, and keeps the record in review.

`PROVIDER.md` is unversioned information about the provider, official sources, tracking and summary
requirements. Each immutable numbered capture has a `SNAPSHOT.md` specification and `CAPTURE.md`
summary. The first `artifacts/` contains the full selected baseline; later captures store only new
or changed bytes. Their complete inventory points unchanged entries directly to earlier files.
Removed evidence disappears from the new inventory while its historical files remain available.

`capture` detects upstream changes, verifies evidence and publishes only when needed. A compound
queue may explicitly prepare a missing provider guide from a human-supplied authoritative source
immediately before capturing it; ordinary capture still requires an existing guide. A no-change
capture creates no folder or summary. Validation runs automatically inside the workflows; it does
not require a separate command. Plans pin a numbered snapshot and hashes, including resolved earlier artifacts; a separate
Git commit is not a protocol prerequisite. A plan captures the providers it relies on before
writing its instruction; a standalone capture tracks upstream changes between plans. Anything from
another project enters as a provider capture, never as a link outside the installation. See [provider captures](docs/src/pages/commands.md#provider-captures).

`archive implementations [target]`, or bare `archive` for all targets, moves terminal
implementations and their decision rows into a dated archive, clearing those rows from the active
ledger. `PLANNED` and `REVIEW` stay active. Record contents, decision proofs, and reference identity
are preserved; implementation IDs never restart. Use `list --archived` to browse history and
`status <record>` to find a record in either location. `archive implementations [target] --force:
<reason>` first closes open records as `CANCELLED` with that reason and lists existing defects in
the manifest instead of failing. `archive providers <provider>...` moves whole providers that no
active record uses into an archive; see [archive providers](docs/src/pages/commands.md#archive-providers).

## Repository layout

```text
.
├── protocol/
│   ├── v1.0.0/                  # frozen
│   │   └── SPECTRE-PROTOCOL.md
│   ├── v2.0.0/                  # frozen
│   │   └── SPECTRE-PROTOCOL.md
│   ├── v2.1.0/                  # frozen
│   │   └── SPECTRE-PROTOCOL.md
│   └── v2.3.0/                  # current
│       └── SPECTRE-PROTOCOL.md
├── ideas/                       # proposals, not part of the protocol
└── docs/
    ├── src/pages/public/        # generated release assets
    ├── rspress.config.ts
    └── wrangler.jsonc
```

`protocol/` is the single canonical release source. Each release directory is frozen once
published; every later change becomes a new semantic version. The documentation build generates
both the public current-release mirror (the highest version) and versioned raw assets directly from
it. `docs/scripts/check-protocol.mjs` checks runtime extraction and rule placement for every release.
This source repository does not install its own `.agents/` tracking or command structure; the
protocol instructs adopting repositories to create it during installation.

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
