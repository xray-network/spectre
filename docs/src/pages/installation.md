# Installation

Install an exact protocol release so the repository is never governed by a mutable remote page.

## Ask a coding agent

```text
Read https://wiki.xraynetwork.io/spectre/protocol/v3.0.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v3.0.0 in this repository.
```

The installer downloads the protocol to `.agents/spectre/SPECTRE-PROTOCOL.md`, installs the
`.agents/skills/spectre/SKILL.md` command entrypoint, discovers whether the repository needs flat or
monorepo storage, creates the templates and initial accepted installation record, adds the required
`AGENTS.md` pointer, and creates root `SPECTRE.md`.

## Download manually

```sh
mkdir -p .agents/spectre
curl -fsSLo .agents/spectre/SPECTRE-PROTOCOL.md \
  https://wiki.xraynetwork.io/spectre/protocol/v3.0.0/SPECTRE-PROTOCOL.md
```

Then ask the coding agent to read the local file completely and perform its installation section.

## Installed structure

```text
SPECTRE.md
.agents/
├── skills/spectre/
│   └── SKILL.md
└── spectre/
    ├── SPECTRE-PROTOCOL.md
    ├── README.md
    ├── templates/
    ├── implementations/
    └── providers/
```

`SPECTRE.md` is the visible project summary and lifecycle authority. Detailed, immutable records
remain under `.agents/spectre/`.
