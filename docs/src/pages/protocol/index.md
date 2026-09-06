# Protocol releases

Each published directory is immutable. Installation pins a complete versioned URL. The default
prompt starts from the current-release mirror to discover that version; you can also choose a
specific release directly.

The <a href="/spectre/SPECTRE-PROTOCOL.md">current-release mirror</a> is convenient for reading and
repository discovery. The build generates it directly from the latest versioned protocol source.

## 1.0.0

- <a href="/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

The initial release stores installed protocol data in `.agents/spectre/`, exposes the command
skill at `.agents/skills/spectre/SKILL.md`, and uses root `SPECTRE.md` as the sole active lifecycle ledger.
SPECTRE runs only on explicit `/spectre` invocation; Codex invokes the same skill as `$spectre`.
Commands accept natural-language record, target, and provider selectors, resolving them to canonical
identities and asking when the meaning is ambiguous.
The archive command moves terminal records and decision history into immutable batches while
preserving references and implementation IDs.
This release defines fresh installation only.

The complete file contains marked runtime sections. Installation extracts shared rules and command
modules locally from the pinned protocol, with its SHA-256 in each header. Normal invocations load
only their declared dependencies. Separate runtime downloads are not published; references to those
optional downloads in v1.0.0 describe the earlier publishing setup. Local extraction is unchanged.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
