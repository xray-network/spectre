# Protocol releases

Release directories are immutable once published; installed copies remain pinned to their own
bytes. Installation pins a complete versioned URL. The default prompt starts from the
current-release mirror to discover that version; you can also choose a specific release directly.

The <a href="/spectre/SPECTRE-PROTOCOL.md">current-release mirror</a> is convenient for reading and
repository discovery. The build generates it directly from the latest versioned protocol source.

## 1.0.0

- <a href="/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

The first public release.

- **Natural-language queues and checkpoints.** Describe objectives and operations in your own words.
  The agent resolves bounded operations and deferred outputs. Future results pause for your decision;
  a direct reply such as “Accept both and continue” can resume the authorized archive without
  repeating the protocol name. Unrelated messages never start tracking, and the word inside a path
  such as `.agents/spectre/` is not a mention.
- **Stable targets and paths.** The Targets table in `SPECTRE.md` owns identity, current Path and retirement. First planning
  registers targets; source moves preserve IDs; retirement retains history and numbering.
- **Sparse ledger.** `SPECTRE.md` contains only populated sections with Target and Path. Archive removes
  terminal rows and newly empty sections.
- **Plain Markdown writes.** Every operation writes in one order and its last write is its commit
  point. An interrupted write leaves a named state that `check` reports and `sync` finishes when it
  is provably safe. No locks, transaction logs or recovery manifests; version control is the backup.
- **Parallel branches.** Duplicate IDs after a merge are reported, and one record is renumbered
  through an explicit override.
- **Decisions bound to reviewed bytes.** Every decision records your quoted words, the date and a
  12-character digest of each reviewed result, such as `api/0004@3f9a1c0b7d2e`. You can bind the
  digest yourself (`accept api/0004@3f9a1c0b7d2e`), and `check` reports accepted results that
  changed afterwards.
- **Tools.** A program you run, such as a CLI or a local page, can show status, run checks and
  record your decisions using the same files and rules.
- **Selective runtime.** Installation extracts 25 rule modules. Each operation loads only its own
  dependencies; queue and checkpoint rules and archive-history rules load only when a request needs
  them.
- **Schemas.** Target, status, implementation, result, archive and provider schemas all start at v1.

The complete file contains marked runtime sections. Installation extracts shared rules and command
modules locally from the pinned protocol, with its SHA-256 in each header. Separate runtime
downloads are not published.

Machine-readable release metadata is available from
<a href="/spectre/protocol/index.json"><code>protocol/index.json</code></a>.
