# Versioning

XRAY/SPECTRE 1.0.0 is the current protocol. Only the latest protocol is published, at
`/spectre/SPECTRE-PROTOCOL.md`; earlier versions are not kept. `Protocol-Version` is a label for
people, and the protocol may be updated under the same version. The protocol's SHA-256 identifies
its exact bytes. Each installation keeps its installed bytes until it is explicitly upgraded.

## Protocol and schemas

Documents carry no schema versions of their own. Live files always follow the installed protocol's
templates, and an upgrade brings them to the latest. Archived records are never rewritten.

<div class="spectre-fields">
<div class="spectre-fields__head"><span>File type</span><span>Path</span></div>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Protocol</span><code>runtime/SPECTRE-PROTOCOL.md</code></summary>
<ul>
<li><code>Protocol-ID</code> — always <code>xray/spectre</code>.</li>
<li><code>Protocol-Version</code> — the version label, currently <code>1.0.0</code>.</li>
</ul>
<p>The file's SHA-256 identifies the exact installed bytes; it is computed, not stored in the file.</p>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Runtime modules</span><code>runtime/modules/**/*.md</code></summary>
<ul>
<li><code>Protocol-Version</code> — the version of the protocol the module was extracted from.</li>
<li><code>Source-SHA256</code> — the SHA-256 of that protocol file. A module whose hash differs from the installed protocol is stale and blocks ordinary work.</li>
</ul>
<p>Templates under <code>modules/templates/</code> are verbatim copies from the protocol and carry no metadata.</p>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Ledger</span><code>SPECTRE.md</code></summary>
<ul>
<li><code>Protocol-Version</code> — the version the live files follow.</li>
<li><code>Protocol-SHA256</code> — the protocol bytes the live files follow. An upgrade writes it last, so a value that differs from the installed protocol means an upgrade was interrupted.</li>
<li><code>Protocol</code> — link to the installed protocol.</li>
</ul>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Instruction</span><code>NNNN-IMPL-INSTR.md</code></summary>
<ul>
<li><code>Implementation-ID</code> — qualified <code>target/NNNN</code> ID.</li>
<li><code>Target-Path</code> — snapshot of the target's source path when planned.</li>
<li><code>Created</code> — UTC timestamp.</li>
<li><code>Evidence-Mode</code> — <code>DIRECT</code>, <code>DERIVED</code>, <code>HYBRID</code> or <code>LOCAL</code>.</li>
<li><code>Depends-On</code> — accepted result links, or <code>NONE</code>.</li>
<li><code>Provider-Evidence</code> — provider pin IDs, or <code>NONE</code>.</li>
</ul>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Result</span><code>NNNN-IMPL-RESULT.md</code></summary>
<ul>
<li><code>Implementation-ID</code> — matches its instruction and ledger row.</li>
<li><code>Instruction</code> — link to its instruction.</li>
<li><code>Evidence-Mode</code> — matches its instruction.</li>
</ul>
<p>The result digest used in decision proofs is the first 12 hexadecimal characters of the file's SHA-256.</p>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Provider guide</span><code>providers/&lt;provider&gt;/PROVIDER.md</code></summary>
<ul>
<li><code>Provider</code> — provider slug. Guides are unversioned; captures are numbered instead.</li>
</ul>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Capture snapshot</span><code>providers/&lt;provider&gt;/NNNN/SNAPSHOT.md</code></summary>
<ul>
<li><code>Provider</code>, <code>Snapshot</code>, <code>Created</code> — identity and UTC timestamp.</li>
<li><code>Previous-Snapshot</code> — predecessor path and SHA-256, or <code>NONE</code>.</li>
<li><code>Capture-Summary</code>, <code>Capture-Summary-SHA256</code> — the paired <code>CAPTURE.md</code> and its hash.</li>
<li><code>Source-Type</code> — <code>git</code> or <code>url</code>.</li>
<li><code>Source-Repository</code>, <code>Source-Commit</code>, <code>Source-Ref</code>, <code>Source-Tag</code> — upstream Git provenance.</li>
<li><code>Source-URL</code>, <code>Source-SHA256</code> — upstream URL provenance.</li>
</ul>
<p>Plans pin a snapshot by path and SHA-256. The snapshot is the commit point of a capture.</p>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Capture summary</span><code>providers/&lt;provider&gt;/NNNN/CAPTURE.md</code></summary>
<ul>
<li><code>Provider</code>, <code>Capture</code> — identity.</li>
<li><code>Snapshot</code> — its <code>SNAPSHOT.md</code>.</li>
<li><code>Previous-Capture</code> — predecessor summary, or <code>NONE</code>.</li>
</ul>
</details>
<details class="spectre-fields__row">
<summary><span class="spectre-fields__name">Archive</span><code>__archive/&lt;timestamp&gt;/ARCHIVE.md</code></summary>
<ul>
<li>No metadata fields: one subsection per target, with the same table columns as <code>SPECTRE.md</code>.</li>
<li>Rows move here unchanged except their Instruction and Result links, which name the archived files.</li>
</ul>
<p>One per archive run, under <code>implementations/</code> or <code>providers/</code>, next to the archived files. Archived files are never rewritten.</p>
</details>
</div>

Paths are relative to <code>.agents/spectre/</code> except the root <code>SPECTRE.md</code> ledger.

The build publishes the latest protocol only. Installed runtime and templates are verbatim
extractions, never separately maintained summaries. `sync` with no scope verifies all generated
bytes; routine operations check their loaded rules and affected dependency closure. No protocol
publication silently updates an adopting repository.

## Upgrading

Ask for an upgrade of one installation. No version is named; it always goes to the latest protocol:

```text
Spectre upgrade
```

An upgrade is a human-ordered override with a fixed scope: the generated files and every live
SPECTRE file. It runs on its own, never as part of a queue, and proceeds as follows:

1. Fetches the latest protocol, or uses a protocol file you supply. If its SHA-256 matches the
   installed protocol and the ledger's `Protocol-SHA256`, the installation is current and nothing
   changes. The same version with a different SHA-256 still upgrades.
2. Validates the installation under the installed protocol without writing, and reports blockers.
3. Recommends committing first. Version control is the rollback path.
4. Reports the exact scope: files replaced, records and captures to rewrite with the digests and
   pins that will change, and records to be marked for revision. The request authorizes that scope.
5. Rewrites every live file to the latest templates in place, keeping its meaning:
   - Nothing is invented. A required field it cannot derive reads "Not recorded in the original
     instruction." (or "result", or "capture").
   - A planned instruction left without implementation-ready content stays `PLANNED` with
     `Needs revise after upgrade to <version>.` in its status, and `implement` refuses it until a
     `revise` brings it up to date.
   - IDs, states, numbering, paths, decision sources, dates and wording are kept. Accepted and
     rejected proofs get the new digests of their rewritten results.
   - Only references that bind bytes change: provider pins, summary, predecessor and reuse hashes.
     Historical notes, such as migration hash tables in guides, keep the hashes they recorded.
   - Artifact files and archived records are never rewritten, and no work is closed or archived.
   - Record files from earlier layouts move into the current one: live records into
     `implementations/<target>/`, archived ones into `implementations/__archive/<timestamp>/<target>/`
     with an `ARCHIVE.md` per archive. Only live records' relative links change, when a move changes
     their depth; archived files are never rewritten.
6. Writes the protocol, runtime modules, templates, router and `AGENTS.md` section first; then each
   provider's captures in ascending order with recomputed hashes, then its guide; then live
   instructions with updated pins and live results; then the archive conversion; and finally the ledger with the new
   `Protocol-Version` and `Protocol-SHA256`, as the commit point.
7. Logs every changed file to `logs/OVERRIDES.md` with the reason
   `upgrade <old version>@<sha12> → <new version>@<sha12>`.
8. Validates the complete installation, reports old and new versions and hashes, changed files and
   digests, and proposes a commit message. It never commits.

An interrupted upgrade is finished by running it again; files already in the latest formats are
skipped. Review checkpoints must be refreshed after an upgrade. Because live files are rewritten in
place, a digest an archived record cites for a live file may no longer match; that is expected, not
damage.
