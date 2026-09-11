# Protocol releases

Finalized release directories are immutable. Version 1.0.0 is still in development and is updated
in place; installed copies remain pinned to their own bytes. Installation pins a complete versioned URL. The default
prompt starts from the current-release mirror to discover that version; you can also choose a
specific release directly.

The <a href="/spectre/SPECTRE-PROTOCOL.md">current-release mirror</a> is convenient for reading and
repository discovery. The build generates it directly from the latest versioned protocol source.

## 1.0.0

- <a href="/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

The initial release stores installed protocol data in `.agents/spectre/`, exposes the command
skill at `.agents/skills/spectre/SKILL.md`, and uses root `SPECTRE.md` as the sole active lifecycle ledger.
SPECTRE starts when each current-human message mentions its standalone name, including `/spectre`,
Codex's `$spectre`, `Spectre:`, or natural language such as `using Spectre`. The mention is
case-insensitive and may appear anywhere. Prior context and implementation follow-ups that omit the
name do not activate it. SPECTRE-mentioned batches perform bounded sequential work, including
required results and REVIEW updates for every selected item.
Commands accept natural-language record, target, and provider selectors, resolving them to canonical
identities and asking when the meaning is ambiguous.
Unversioned provider guides describe upstream sources, tracking and summarization. Each immutable
numbered capture contains a complete SNAPSHOT.md specification and an advisory CAPTURE.md summary.
The first stores the full selected artifact baseline; later captures store only new or changed
bytes and resolve unchanged evidence through explicit references to earlier files. `capture` includes
change detection and validation; no-change capture creates no directory or tracked writes. Validation
is an internal workflow requirement, not a standalone command. Plans
pin the numbered snapshot and hashes, preserving stable evidence without duplicate full trees.
The archive command moves terminal records and decision history into immutable batches while
preserving references and implementation IDs.
This development release also defines explicit adoption rules for existing provider layouts;
protocol source updates never migrate an installation automatically.

The complete file contains marked runtime sections. Installation extracts shared rules and command
modules locally from the pinned protocol, with its SHA-256 in each header. Normal invocations load
only their declared dependencies. Separate runtime downloads are not published; adopting repositories
extract every module directly from the pinned protocol.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
