# SPECTRE command router

Start a new workflow only from a current-human SPECTRE mention: the standalone word `spectre`,
`/spectre`, `$spectre`, or a natural-language mention anywhere in the message, case-insensitive.
The word inside a path or identifier is not a mention. A direct reply to a uniquely pending
clarification/checkpoint may continue its bounded authorization without repeating the name; read
`core.md` and `queues.md` before applying that exception. Prior context alone never starts a new
workflow. Otherwise follow ordinary instructions and leave tracking untouched.

Resolve the nearest installation at or above the working directory by `.agents/spectre/ROUTER.md`,
or the installation explicitly named in the request. Ask when several installations match. Require
the pinned `runtime/SPECTRE-PROTOCOL.md`; check its metadata and SHA-256 with local tools. Verify
Runtime-Version and Source-SHA256 in each loaded module. Missing/stale files block ordinary work;
never implicitly install, regenerate, repair or upgrade. Explicit upgrade reads the target release
and follows its procedure; it does not follow a moving mirror.

Always load `runtime/modules/core.md`. Resolve natural language to supported operations, not exact
command wording. For several operations, deferred outputs, a human decision checkpoint or a reply to
one, also load `queues.md` and `selectors.md`, report scope, order and checkpoints, and read each
item's dependencies before executing it. Never load all runtime files by default. Override,
upgrade, and host setup remain standalone.

All paths below are relative to `.agents/spectre/runtime/modules/`.

| Operation | Command file | Additional required reads |
| --- | --- | --- |
| help | commands/help.md | None |
| status | commands/status.md | selectors.md, references.md; history.md for archived records; commands/target.md for target summaries |
| recall | commands/recall.md | selectors.md, references.md, history.md; providers.md for pinned evidence |
| check | commands/check.md | selectors.md, references.md, history.md, publication.md, validation.md; validation-full.md for installation scope; validation-evidence.md and templates/TEMPLATE_PROVIDER.md for provider checks |
| sync | commands/sync.md | selectors.md, references.md, history.md, publication.md, validation.md, commands/target.md, templates/TEMPLATE_STATUS.md; validation-full.md for installation scope |
| target | commands/target.md | selectors.md, references.md, publication.md, validation.md, templates/TEMPLATE_STATUS.md |
| plan | commands/plan.md | selectors.md, references.md, publication.md, commands/target.md, validation.md, templates/TEMPLATE_IMPL.md, templates/TEMPLATE_STATUS.md; history.md for archived inputs; commands/capture.md, providers.md, validation-evidence.md, templates/TEMPLATE_PROVIDER.md when relying on providers |
| implement | commands/implement.md | selectors.md, references.md, publication.md, validation.md, templates/TEMPLATE_IMPL.md; commands/target.md and templates/TEMPLATE_STATUS.md for declared source relocation; history.md for archived inputs; providers.md and validation-evidence.md for provider inputs |
| revise | commands/revise.md | selectors.md, references.md, publication.md, validation.md, templates/TEMPLATE_IMPL.md; commands/target.md and templates/TEMPLATE_STATUS.md for declared source relocation; history.md for archived inputs; providers.md and validation-evidence.md for provider inputs |
| accept / reject / cancel | commands/decide.md | selectors.md, references.md, publication.md, validation.md |
| archive | commands/archive.md | selectors.md, references.md, history.md, publication.md, validation.md, templates/TEMPLATE_STATUS.md; providers.md, validation-evidence.md and templates/TEMPLATE_PROVIDER.md for provider archive |
| capture | commands/capture.md | selectors.md, references.md, publication.md, providers.md, validation.md, validation-evidence.md, templates/TEMPLATE_PROVIDER.md |
| upgrade | commands/upgrade.md | Target release completely; publication.md, references.md, history.md, validation.md, validation-full.md |
| override | commands/override.md | selectors.md, references.md, history.md, publication.md, validation.md |
| host add / remove | commands/host.md | None |

Read the matching canonical templates for each record/schema being checked. Provider consumption
always loads providers.md, validation-evidence.md and the provider template. Read-only operations
report issues without repair. Section numbers identify source locations; they do not require a
full-standard read for routine operations.

Before every mutation, verify canonical scope and current state and follow publication.md. Apply
repository guidance; targets describe ownership, not blanket authorization to edit their paths.
