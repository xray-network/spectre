# SPECTRE command router

Activate only when the current-human message mentions SPECTRE: `/spectre`, `$spectre`, `Spectre:`,
or a natural-language mention anywhere in the message, case-insensitive. This covers mentions by
standalone name, command, or host-native sigil.
Every message must activate independently; prior context and SPECTRE reports
do not replace the required mention. Otherwise leave tracking untouched and do not ask for an operation. `runtime/modules/core.md` defines authorization,
compound queues, and decisions, and `runtime/modules/selectors.md` defines binding; apply both before any
source or record change. Never place accept, reject, cancel, a forced archive, an override, addslash,
or removeslash in a compound queue.

Resolve the installation: the nearest folder at or above the working directory that contains
`.agents/spectre/ROUTER.md`. When the agent starts outside every installation, such as a
monorepo root reached through a slash command, resolve the installation from the project the request
names; ask when it names none or several match. Require `.agents/spectre/runtime/SPECTRE-PROTOCOL.md` and
the selected runtime files; do not install implicitly. Check the protocol's Standard-Version and SHA-256 with local tools,
without reading its full text into context. Require Runtime-Version and Source-SHA256 headers to
match in every loaded module. Missing/mismatched files block execution; report them without repair.

Always read `runtime/modules/core.md`, then the files below relative to `.agents/spectre/`. For a compound
request, also read `runtime/modules/selectors.md`, normalize and report the queue, then load each selected
operation's dependencies before executing that item. Never load all command files or the complete
protocol by default. Read applicable repository guidance as required.

| Operation | Command file | Additional required reads |
| --- | --- | --- |
| help | runtime/modules/commands/help.md | None |
| list | runtime/modules/commands/list.md | selectors.md only for a supplied target |
| status | runtime/modules/commands/status.md | selectors.md, references.md |
| recall | runtime/modules/commands/recall.md | references.md; selectors.md for a supplied target; providers.md when records pin captures |
| plan | runtime/modules/commands/plan.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md, TEMPLATE_STATUS.md; commands/capture.md, providers.md, validation-evidence.md, and TEMPLATE_PROVIDER.md when the plan relies on providers |
| implement | runtime/modules/commands/implement.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md; providers.md and validation-evidence.md when the instruction has provider inputs |
| revise | runtime/modules/commands/revise.md | selectors.md, references.md, validation.md, TEMPLATE_IMPL.md; providers.md and validation-evidence.md when the instruction has provider inputs |
| accept / reject / cancel | runtime/modules/commands/decide.md | selectors.md, references.md, validation.md |
| capture | runtime/modules/commands/capture.md | selectors.md, references.md, providers.md, validation.md, validation-evidence.md, TEMPLATE_PROVIDER.md |
| archive | runtime/modules/commands/archive.md | selectors.md for a supplied target or provider; references.md, validation.md, validation-full.md; commands/decide.md for a forced implementations archive; providers.md and validation-evidence.md for a provider archive |
| override | runtime/modules/commands/override.md | selectors.md, references.md, validation.md |
| addslash / removeslash | runtime/modules/commands/slash.md | None |

Bare runtime names above are under `runtime/modules/`; TEMPLATE names are under `runtime/modules/templates/`. These are
rule dependencies, never authorization to execute another operation. Validation is mandatory
within the selected workflow; `runtime/modules/validation.md` is shared internal guidance, not a command. Read
`TEMPLATE_PROVIDER.md`, `runtime/modules/providers.md`, and `runtime/modules/validation-evidence.md` when consuming
provider evidence; read `runtime/modules/references.md` whenever following implementation references or
archives. No input may be skipped because loading is selective.

Resolve selectors to canonical identities, report the binding, and follow only the selected
workflow or normalized queue. Ask for ambiguous targets or missing payload/proof before mutation.
Check current state again before writing.
Section numbers in modules identify their source, not instructions to load the full standard.
