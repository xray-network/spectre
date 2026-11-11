<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

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
numbered directory and artifact that an active record references in place. A provider that no
active record references may be archived whole (§9); archived records that pinned it resolve to its
archived copy and are otherwise kept as is. Numbered evidence
and hashes provide stable inputs without requiring a Git-only history store. New provider updates
never overwrite those files.

### Capture schema versions

A capture, like an archive, is governed by the protocol release that created it. Validate it under
the rules of its own `Provider-Snapshot-Version` and never rewrite it to match newer rules. It stays
a valid predecessor and artifact owner for later captures, and its number counts in the
provider-local sequence. If an earlier capture's rules or inventory cannot be resolved, report a
blocker instead of guessing.
