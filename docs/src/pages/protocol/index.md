# Protocol releases

Each published directory is immutable. Installations should use the complete versioned URL rather
than a floating `latest` or major-version alias.

The <a href="/spectre/SPECTRE-PROTOCOL.md">current-release mirror</a> is convenient for reading and
repository discovery. The build verifies it is byte-for-byte identical to the latest immutable
release.

## 2.0.0

- <a href="/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>
- <a href="/spectre/protocol/v2.0.0/MIGRATION.md">Read the 1.x migration instructions</a>

SPECTRE 2.0.0 separates the locally installed protocol from the project summary: the protocol is
stored at `.spectre/SPECTRE-PROTOCOL.md`, while root `SPECTRE.md` is the sole lifecycle ledger.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
