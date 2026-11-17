<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 1ae4c43cd1f1ad8e6cc942c5b573490f5cd3e332ff3acda5e920cfd2186a33f5

### Upgrade procedure

`/spectre upgrade` or a clear natural-language request upgrades one installation to the latest
published protocol. It is a human-ordered override (commands/override.md) whose scope is fixed: the
generated files and every live SPECTRE file. It is standalone, never a queue item or implicit sync,
and only the current human may order it.

1. Fetch `https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md` completely, or use a protocol file
   the human supplies, and require `Protocol-ID: xray/spectre` and a `Protocol-Version` line. If its
   SHA-256 equals both the installed protocol's and the ledger's Protocol-SHA256, report that the
   installation is current and stop. The same Protocol-Version with a different SHA-256 still
   upgrades.
2. Read the installation metadata, runtime, ledger, archive indexes, every live record and every
   provider guide and capture. Run full validation under the installed protocol without changing
   files; when an earlier upgrade was interrupted (publication.md), continue it under the protocol
   it already wrote. Report conflicts, interrupted writes and missing evidence, and resolve blockers
   explicitly before writing.
3. Recommend that the human commit first. Version control is the rollback path.
4. Report the exact scope before writing: generated files replaced, ledger changes, live records to
   rewrite with the proof digests that will change, records to be marked for revision, provider
   guides and captures to rewrite with the snapshot hashes and pins that will change, and any human
   blockers. The upgrade request authorizes this scope; it needs no further confirmation.
5. Rewrite every live file to the latest templates, keeping its meaning:
   - Never invent content. A required field that cannot be derived reads `Not recorded in the
     original instruction.`, `Not recorded in the original result.` or `Not recorded in the original
     capture.`
   - A PLANNED instruction left without implementation-ready content stays PLANNED, and its Decision
     or status cell begins `Needs revise after upgrade to <Protocol-Version>.`
   - Preserve IDs, states, numbering, paths, decision sources, dates and wording, and every artifact
     file. In ACCEPTED and REJECTED proofs, replace each cited digest of a rewritten result with its
     new digest.
   - Never close work, archive records or providers, or touch `archive/`. Pending checkpoints are
     invalidated and must be refreshed.
6. Write in this order. First the protocol, its extracted modules and three templates, the router
   and the SPECTRE section of AGENTS.md; rewrite host adapters that already exist and never add
   absent ones; remove obsolete generated runtime files. Then, provider by provider in ascending
   capture order, each CAPTURE.md and its SNAPSHOT.md with recomputed summary, predecessor and
   reuse hashes, then the PROVIDER.md guide. Then each live instruction, with its pins updated, and
   each live result. Finally the ledger with its rewritten rows, cited digests, new
   Protocol-Version and new Protocol-SHA256 in one write, the commit point. Files already in the latest formats are left as
   they are, so repeating an interrupted upgrade completes it.
7. Append one override log row per changed, created or removed file (commands/override.md), with the
   human's verbatim command and the reason `upgrade <old version>@<old sha12> → <new version>@<new sha12>`, where sha12 is the
   first 12 hexadecimal characters of the protocol's SHA-256.
8. Validate the complete installation under the latest protocol. Compare every row's identity, state
   and decision source, and every numbering maximum, with step 2. Report the old and new versions
   and SHA-256, changed files, rewritten records with old and new digests, rewritten captures with
   old and new snapshot hashes, records marked for revision and the checks run. Tell humans to
   reload changed host adapters and propose the commit message
   `SPECTRE upgrade <old version>@<old sha12> → <new version>@<new sha12>`. Do not commit.
