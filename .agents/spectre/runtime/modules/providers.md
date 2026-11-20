<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

### Pinned provider evidence

A provider pin contains a stable pin ID; the evidence-owning repository identity, which is always
`SELF` because evidence never lives outside the installation; the provider and capture ID; the
repository-relative SNAPSHOT.md path and its SHA-256; and selected logical artifact paths and
SHA-256 values, inline or in a pinned manifest. PROVIDER input rows and Provider-Evidence name
these pin IDs. Upstream Source-Commit is provenance, not the capture's local identity.

Resolve the pinned SNAPSHOT.md, verify its hash and complete specification, then resolve every
entry in its full logical inventory directly to the declared physical file in this or an earlier
same-provider capture. Verify membership, sizes, hashes, source mapping and counts before consuming
the selected subset. The snapshot contains the complete resolved inventory, not just additions or
patch instructions. No replay of earlier deltas, Git checkout or upstream fetch is needed to obtain
the effective evidence. Verify referenced earlier snapshot hashes and their ownership of reused
files; validate the predecessor chain as an acyclic, strictly decreasing sequence.

Reject missing files, unsafe paths, duplicate logical entries, forward/cross-provider references,
cycles, altered descriptors or hash mismatches. Never substitute the provider's latest capture,
an upstream ref or a similarly named file. A missing retained artifact is a blocker, not authority
to recapture it or silently read Git history. CAPTURE.md is advisory; it cannot override SNAPSHOT.md.

Plans select an explicit completed immutable capture and record its pin. Capture publication and
integrity validation are required; a separate Git commit is not a protocol prerequisite. Version
control remains recommended repository practice and commands never auto commit. Keep every
numbered directory and artifact in place until the human archives the whole provider (§9).
Numbered evidence
and hashes provide stable inputs without requiring a Git-only history store. New provider updates
never overwrite those files.

### Capture format

Every live capture follows the installed protocol's provider template. Only an explicit upgrade
(§14) rewrites existing PROVIDER.md, SNAPSHOT.md and CAPTURE.md files to a newer format, as a
human-ordered override that recomputes their hashes and every live pin, predecessor, reuse and
summary reference to them. Historical provenance in snapshots keeps its recorded hashes. Artifact
files are captured provider data and are never rewritten. An unresolved earlier capture inventory
is a blocker.
