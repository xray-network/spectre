<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

### Optional host adapters

The router in `.agents/spectre/ROUTER.md` is the only router. A slash command, also called a host
adapter, is a small command file in one agent host's own format whose body only points to the
router, so that host can invoke SPECTRE by name. Installation creates none. Natural-language
mentions such as `Spectre: status last implementation` reach the router through the `AGENTS.md`
pointer without one, so `Spectre addslash claude` works before any slash command exists.

`/spectre addslash <host> [<host>...]` adds slash commands and `/spectre removeslash <host> [<host>...]`
removes them. Host names are ASCII case-insensitive and come only from this table:

| Host | Agent | Adapter file | Invocation | Request line |
| --- | --- | --- | --- | --- |
| `codex` | Codex | `.agents/skills/spectre/SKILL.md` | `$spectre` | the text after the command |
| `antigravity` | Antigravity | `.agents/skills/spectre/SKILL.md` | `/spectre` | the text after the command |
| `claude` | Claude Code | `.claude/skills/spectre/SKILL.md` | `/spectre` | `$ARGUMENTS` |
| `cursor` | Cursor | `.cursor/commands/spectre.md` | `/spectre` | the text after the command |
| `copilot` | GitHub Copilot | `.github/prompts/spectre.prompt.md` | `/spectre` | the text after the command |
| `gemini` | Gemini CLI | `.gemini/commands/spectre.toml` | `/spectre` | `{{args}}` |
| `opencode` | OpenCode | `.opencode/commands/spectre.md` | `/spectre` | `$ARGUMENTS` |
| `windsurf` | Windsurf | `.windsurf/workflows/spectre.md` | `/spectre` | the text after the command |

`codex` and `antigravity` share one file, as does any other agent that discovers `.agents/skills/`.
Adding or removing either host changes that file for every agent that reads it; say so in the report.

Every adapter carries exactly this body, wrapped in only the host's required metadata (such as
`name: spectre` and a description) and file syntax:

```text
Follow .agents/spectre/ROUTER.md for this SPECTRE request. If the current folder holds no
.agents/spectre/ROUTER.md, use the one in the installation the request names.
Request: <request line>
```

`<request line>` is the host's argument placeholder from the table. For a host whose row says
`the text after the command`, it is the literal text
`the text that follows the command in the current message.` An adapter contains no other
instruction and no protocol rule. Adapters never change activation: the current-human message must
still mention SPECTRE, which the command itself does.

A SPECTRE adapter is a file at a table path whose body is the pointer above, an earlier release's
pointer (`Follow .agents/skills/spectre/SKILL.md for this SPECTRE request.`), or, at
`.agents/skills/spectre/SKILL.md` only, an earlier release's router (`name: spectre` and
`# SPECTRE command router`). Any other file at a table path belongs to someone else.

The adapter file is the only state. `addslash` and `removeslash` write no ledger row, record,
README entry, log, or other SPECTRE file, and no SPECTRE file lists which adapters exist; validation
finds them by checking the table's paths. Neither command touches product source, records, the
ledger, runtime, templates, `ROUTER.md`, or `AGENTS.md`. Both read only the router, shared core, and
this module, and both are standalone: never queue items and never combined with another operation.

`addslash`:

1. Require an installation with its `ROUTER.md`: the nearest one at or above the working
   directory, or, at a monorepo root that holds none, any installation in the repository. The
   adapter body names no installation, so it serves every installation in the repository.
2. Resolve every named host before writing. An unknown host refuses the whole command, writes
   nothing, and lists the supported hosts. Never guess a path for an unlisted host.
3. Verify the host's current command-file format. If it can no longer carry the body above, refuse
   the whole command, write nothing, and report which host and why.
4. Preflight every adapter path at the repository root (the version-control root, or the
   installation root without one), where agents discover commands. An identical adapter is a
   no-op. A different SPECTRE adapter is replaced. Any other existing file refuses the whole
   command without writing anything. Preserve unrelated host files.
5. Write the adapters. In a monorepo the root may hold no installation; the router then resolves
   the installation from the request.
6. Report each adapter created, replaced, or unchanged and its invocation. For each created or
   replaced adapter, tell the human to reload or restart that agent (its window, session, or CLI)
   before using the command, because hosts discover commands when they start.

`removeslash`:

1. Resolve every named host as `addslash` does.
2. Delete each table path that holds a SPECTRE adapter, and its `spectre` folder when deleting the
   file leaves that folder empty. A missing file is a no-op. Any other file at that path refuses the
   whole command without deleting anything. Never remove host folders or unrelated files.
3. Report each adapter removed or already absent. For each removed adapter, tell the human to
   reload or restart that agent so the command disappears.
