# Installation

Open the repository in your coding agent and send:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md completely and install XRAY/SPECTRE in this repository.
```

The agent installs the exact protocol bytes it read, decides whether the repository is a single
project or a monorepo, extracts runtime rules/templates, and validates the accepted installation
record. It changes tracking files
and the `AGENTS.md` pointer, not product source. XRAY/SPECTRE 1.0.0 is current; existing
installations keep their installed bytes until explicitly upgraded.

## Where it installs

By default the agent installs into the repository root: `SPECTRE.md`, `AGENTS.md` and
`.agents/spectre/` go there. To install into one project of a monorepo instead, name its folder in
the prompt, for example "…and install XRAY/SPECTRE in ./services/api/". A repository can hold several
installations, each fully independent, and no target of one may include another's folder. To combine
installations later or move a target out, use `Spectre absorb` and `Spectre detach`
([core concepts](./concepts#combine-and-split-installations)).

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

## Your own slash command

XRAY/SPECTRE never creates or manages slash commands. If you want one, create it in your agent's
command format with a body that only says to read `.agents/spectre/ROUTER.md` and treat the text
after the command as the request. Typing `/spectre` (or `$spectre`) then counts as a SPECTRE
mention. See [custom slash commands](./commands#custom-slash-commands).

## What gets installed

```text
SPECTRE.md                         # Targets table and live implementation rows
.agents/spectre/
├── ROUTER.md                      # selective runtime routing
├── runtime/
│   ├── SPECTRE-PROTOCOL.md         # the installed protocol
│   └── modules/                   # 23 extracted rule modules
│       └── templates/             # status, implementation, provider
└── implementations/
    └── <target>/                  # bootstrap instruction and result
```

Only the bootstrap target is registered initially: a single project's one target, named after its
folder, or the reserved `repository` governance target of a monorepo. Other targets register on
their first plan. No
per-project empty ledger subsections are created. `providers/` and the `__archive/` folders appear
only when needed.

Runtime modules include their version and source SHA-256. Routine operations load selected modules;
full validation compares their bytes with extraction. Missing or stale runtime is reported without
an implicit repair. There are no lock or transaction files: every write follows one order, and
version control is the backup.

## Download manually

Only the latest protocol is published; earlier versions are not kept. To install from a local
copy, run from the installation root (the repository root by default):

```sh
mkdir -p .agents/spectre/runtime
curl -fsSLo .agents/spectre/runtime/SPECTRE-PROTOCOL.md \
  https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md
```

Then ask the agent to read the file completely and perform its installation procedure. Reinstalling
does not authorize an upgrade of an existing installation.

## Upgrade an existing installation

Ask for `Spectre upgrade`; it always goes to the latest protocol. Commit first: version control is
the upgrade's rollback path. The upgrade replaces the generated files and rewrites the live ledger,
live records and provider files to the latest formats in place, as one human-ordered override.
Archived records are never rewritten; record files from earlier layouts move into the current
one. Review checkpoints must be refreshed after an upgrade. See
[versioning](./versioning#upgrading).

[Continue to core concepts →](./concepts)
