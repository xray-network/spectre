# Installation

Open the repository you want to use with SPECTRE in your coding agent. One prompt sets up the
protocol, the command skill, and the files that track your work.

## 1. Install SPECTRE

Copy and send this prompt to your agent:

```text wrapCode
Read https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v1.0.0 in this repository.
```

The agent inspects your repository, chooses the appropriate storage layout, and creates the
accepted installation record. It does not modify product source.

SPECTRE 1.0.0 is the initial release. It defines fresh installation only and uses a pinned
protocol file, so a remote page cannot silently change your repository's rules.

## 2. Check the setup

Ask for the command reference:

```text
/spectre help
```

**Using Codex?** Use `$spectre` instead of `/spectre` for every command, for example `$spectre help`.

You can also run `/spectre validate` to check the installed structure. Installing SPECTRE does not
enable automatic tracking: ordinary requests stay outside its workflows until you explicitly
invoke a command.

## 3. Plan your first change

Use your repository slug, or a target in your monorepo, in place of `api`:

```text
/spectre plan api: add a health endpoint
```

The agent creates a plan in `PLANNED` and stops. Read it, then run `implement` with its ID or
a clear description:

```text
/spectre implement the health endpoint plan
```

The agent implements the plan, runs its checks, and leaves the result in `REVIEW`. You then decide
whether to accept, reject, or request a revision. Each operation requires its own command.

[Continue to the command reference →](./commands)

## What gets installed

```text
SPECTRE.md                    # active implementation ledger
.agents/
├── skills/spectre/
│   └── SKILL.md               # command entrypoint
└── spectre/
    ├── SPECTRE-PROTOCOL.md    # pinned protocol
    ├── README.md
    ├── templates/
    ├── implementations/      # instructions and results
    └── providers/            # optional external evidence
```

The installer adds a pointer in `AGENTS.md` so your agent knows when to use the protocol.
Completed work can later move into dated batches under `.agents/spectre/archive/` with the
[archive command](./commands#archive-completed-work). That directory is created by the first
nonempty archive operation.

## Manual download

If you prefer to download the protocol yourself, run this from the repository root:

```sh
mkdir -p .agents/spectre
curl -fsSLo .agents/spectre/SPECTRE-PROTOCOL.md \
  https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md
```

Then ask your coding agent to read the local file completely and perform its installation section.
