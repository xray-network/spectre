# Releases

Only the latest protocol is published, at
<a href="/spectre/SPECTRE-PROTOCOL.md"><code>/spectre/SPECTRE-PROTOCOL.md</code></a>; earlier versions
are not kept. The protocol may be updated under the same version, and its SHA-256 identifies the
exact bytes. Installed copies keep their own bytes until an explicit `Spectre upgrade` brings them
to the latest. See [versioning](../versioning).

## 1.0.0

- <a href="/spectre/SPECTRE-PROTOCOL.md">Read or download <code>SPECTRE-PROTOCOL.md</code></a>

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
  point. An interrupted write leaves a named state that `sync` reports and finishes when it
  is provably safe. No locks, transaction logs or recovery manifests; version control is the backup.
- **Parallel branches.** Duplicate IDs after a merge are reported, and one record is renumbered
  through an explicit override.
- **Decisions bound to reviewed bytes.** Every decision records your quoted words, the date and a
  12-character digest of each reviewed result, such as `api/0004@3f9a1c0b7d2e`. You can bind the
  digest yourself (`accept api/0004@3f9a1c0b7d2e`), and `sync` reports accepted results that
  changed afterwards.
- **Tools.** A program you run, such as a CLI or a local page, can show status, run checks and
  record your decisions using the same files and rules.
- **Selective runtime.** Installation extracts 25 rule modules. Each operation loads only its own
  dependencies; queue and checkpoint rules and archive-history rules load only when a request needs
  them.
- **One versioned protocol.** Files carry no schema versions of their own. Live files follow the
  installed templates, and `Spectre upgrade` rewrites them in place to the latest protocol.
  Archives are frozen.

The complete file contains marked runtime sections. Installation extracts shared rules and command
modules locally from the installed protocol, with its version and SHA-256 in each header. Separate
runtime downloads are not published.
