# Installation

Open the repository you want to use with SPECTRE in your coding agent. One prompt sets up the
protocol, the command skill, and the files that track your work.

## 1. Install SPECTRE

Copy and send this prompt to your agent:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The agent resolves the mirror's declared version, verifies the matching canonical release, and
pins that copy locally. Later mirror updates do not change your installed protocol.

It inspects your repository, chooses the appropriate storage layout, and creates the
accepted installation record. It does not modify product source.

It also extracts compact runtime files from marked sections of the protocol. Later commands load
shared rules and their own operation files instead of rereading the complete specification.
Required source, evidence, and validation checks still apply.

SPECTRE 2.3.0 is the current release. Installation pins the protocol locally, so later releases
cannot silently change your repository’s rules.

## 2. Check the setup

Installation adds no slash command, so ask for the command reference in natural language:

```text
Spectre help
```

Then add the slash command for the agents you use, and reload or restart each agent so it
discovers the command:

```text
Spectre addslash claude
```

Supported hosts are `codex`, `antigravity`, `claude`, `cursor`, `copilot`, `gemini`, `opencode`, and
`windsurf`; name several at once, such as `Spectre addslash codex cursor`. Codex invokes it as
`$spectre`, the others as `/spectre`. `/spectre removeslash <host>` removes it again. Each adapter
only points to the same router, and its file is the only record that it exists.

The installer validates the complete structure automatically before reporting success. Installing
SPECTRE does not enable automatic tracking. Each message must mention the standalone word `spectre`,
including `/spectre`, a host-native form such as `$spectre`, or a natural-language form such as
`using Spectre`. The mention is case-insensitive and may appear anywhere. Prior context and requests
that omit SPECTRE—including batches and continuations—stay outside it.

## 3. Plan your first change

Use your repository slug, or a target in your monorepo, in place of `api`. In this single-project
example, `0001` is the installation record, so the first planned change receives ID `0002`:

```text
/spectre plan api add a health endpoint
```

The agent creates plan `0002` in `PLANNED` and stops. Read it, then run `implement` with its ID:

```text
/spectre implement 0002
```

The agent implements the plan, runs its checks, and leaves the result in `REVIEW`. After reviewing
the changes and validation, accept it with your decision proof:

```text
/spectre accept 0002: reviewed the result and required checks
```

You can instead reject the result or request a revision using their separate commands. One accept,
reject, or cancel command may select a bounded set when its proof or reason applies to every record.
Decisions never enter an operation queue.

Once plans are identified, you may say `Spectre implement these one by one`: the agent resolves a
fixed batch and completes each item's tests, result and REVIEW update before the next. Or begin a
natural-language request that mentions SPECTRE to queue capture, planning and implementation. It reports
the normalized operations and resolves earlier outputs before dependent items. It stops at blockers
and records partial work, so source changes and tracking cannot be reported complete separately.

[Continue to the command reference →](./commands)

## What gets installed

```text
SPECTRE.md                    # active implementation ledger
.agents/
└── spectre/
    ├── ROUTER.md              # the only top-level file; slash commands point here
    ├── runtime/               # everything agents read and nobody edits
    │   ├── SPECTRE-PROTOCOL.md       # pinned protocol; the only file here
    │   └── modules/                  # generated from the protocol; never edited
    │       ├── core.md           # shared authority and lifecycle rules
    │       ├── selectors.md      # natural-language target resolution
    │       ├── references.md     # active/archive record links
    │       ├── providers.md      # provider pins
    │       ├── validation.md     # record checks used by every workflow
    │       ├── validation-full.md      # installation and archive checks
    │       ├── validation-evidence.md  # provider-evidence checks
    │       ├── commands/         # help, list, status, recall, plan, implement, revise,
    │       │                     # decide, override, capture, archive, slash
    │       └── templates/        # status, implementation, provider templates
    ├── implementations/      # instructions and results
    └── providers/            # optional external evidence
```

The installer adds a pointer in `AGENTS.md` so your agent knows when to use the protocol.
Completed work can later move into dated batches under `.agents/spectre/archive/` with the
[archive command](./commands#archive-completed-work). That directory is created by the first
nonempty archive operation.

[See a populated repository tree and its matching SPECTRE.md ledger →](./example)

Runtime files contain a version and source hash. Commands check these against the pinned protocol;
full validation checks that every module exactly matches its source blocks. A missing or stale
module is reported without an automatic repair or protocol update. Do not edit generated modules
independently; upgrades follow the protocol's versioning rules.

## Install a specific version

To choose a release explicitly, use its versioned URL and include the version in your request:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/protocol/v2.3.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v2.3.0 in this repository.
```

An explicitly requested version takes precedence over the current-release mirror. Neither prompt
automatically upgrades or migrates an existing installation.

## Update an existing installation

Copy and send this prompt to your agent:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/protocol/v2.3.0/SPECTRE-PROTOCOL.md completely and upgrade the existing SPECTRE installation in this repository to v2.3.0 using its upgrade procedure. Preserve all archived implementation records, provider evidence, and existing references. Validate the complete installation before and after, and report any blocker without rewriting history.
```

The agent follows the target release's [upgrade procedure](./versioning#upgrading). A major release
such as 2.0.0 needs every terminal record archived first, so decide any `REVIEW` records and archive
before upgrading:

```text
/spectre archive
```

To close everything instead, use a forced archive. It cancels open `PLANNED` and `REVIEW` records
with your reason and lists existing defects in the manifest instead of failing:

```text
/spectre archive implementations --force: closing before the upgrade
```

Use the syntax of the version you have installed: before 2.3.0, the forced form is
`/spectre archive --force: <reason>`.

Conflicting files, unresolved evidence, or references that cannot be preserved block the upgrade
instead of being overwritten or redirected.

## Manual download

If you prefer to download the protocol yourself, run this from the repository root:

```sh
mkdir -p .agents/spectre/runtime
curl -fsSLo .agents/spectre/runtime/SPECTRE-PROTOCOL.md \
  https://wiki.xraynetwork.io/spectre/protocol/v2.3.0/SPECTRE-PROTOCOL.md
```

Then ask your coding agent to read the local file completely and perform its installation section.
