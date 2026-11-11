# Installation

Open the repository in your coding agent and send:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install SPECTRE in this repository.
```

The agent verifies the mirror's declared canonical release, pins its exact bytes, chooses flat or
nested storage, extracts runtime rules/templates, and validates the accepted installation record.
It changes tracking files and the `AGENTS.md` pointer, not product source. SPECTRE 1.0.0 is current;
existing installations remain pinned until explicitly upgraded.

## Start with natural language

Installation adds no slash command. Ask:

```text
Spectre, show the setup and available operations.
Spectre, plan a health endpoint for the API target and implement it, then archive after my decision.
```

The second request creates a bounded queue. After implementation and checks, the record enters
`REVIEW`; the agent shows the result and pauses for your decision. A direct checkpoint reply such
as `Accept it and continue` records your decision and runs the already authorized archive. Passing
tests never substitute for acceptance. You can also plan, implement and decide in separate requests.

Start new workflows by mentioning SPECTRE. Direct replies to its uniquely pending clarification
or decision checkpoint can continue that bounded interaction without repeating the name. Unrelated
messages do not start tracking; there is no global mode.

## Optional host commands

```text
Spectre host add codex cursor
Spectre host remove cursor
```

Reload or restart the host after changing its adapter. Codex invokes `$spectre`; other supported
hosts invoke `/spectre`. Supported names: `codex`, `antigravity`, `claude`, `cursor`, `copilot`,
`gemini`, `opencode`, `windsurf`. Adapters only point to the shared router.

## What gets installed

```text
SPECTRE.md                         # populated live sections only
.agents/spectre/
├── ROUTER.md                      # selective runtime routing
├── TARGETS.md                     # stable identities and current paths
├── runtime/
│   ├── SPECTRE-PROTOCOL.md         # verified pinned release
│   └── modules/                   # 25 extracted rule modules
│       └── templates/             # status, targets, implementation, provider
└── implementations/               # bootstrap instruction and result
```

Only the bootstrap target is registered initially: the repository slug in flat mode, or reserved
`repository` governance target in nested mode. Other targets register on their first plan. No
per-project empty ledger sections are created. Archives/providers appear only when needed.

Runtime modules include their version and source SHA-256. Routine operations load selected modules;
full validation compares their bytes with extraction. Missing or stale runtime is reported without
an implicit repair. There are no lock or transaction files: every write follows one order, and
version control is the backup.

## Install a specific version

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v1.0.0 in this repository.
```

A named version takes precedence over the moving mirror. Reinstalling does not authorize migration
of an existing installation.

For manual download, run from the adopting repository root:

```sh
mkdir -p .agents/spectre/runtime
curl -fsSLo .agents/spectre/runtime/SPECTRE-PROTOCOL.md \
  https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md
```

Then ask the agent to read the file completely and perform its installation procedure.

## Upgrade an existing installation

Ask for the named release, for example `Spectre upgrade 1.0.1`. Commit first: the upgrade rewrites
only generated files and ledger metadata, and version control is its rollback path. Records,
decisions, IDs, archives and captures keep their bytes. Review checkpoints must be refreshed after
an upgrade. See [versioning](./versioning#upgrading).

[Continue to the command reference →](./commands)
