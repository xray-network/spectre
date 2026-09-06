# Protocol releases

Each published directory is immutable. Installations should use the complete versioned URL rather
than a floating `latest` or major-version alias.

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
modules; normal invocations load only their declared dependencies. Versioned runtime downloads are
generated from the same source, with the pinned protocol's SHA-256 in each header.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
