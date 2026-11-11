<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

**Provider evidence**

20. Pins: new provider inputs pin an explicit numbered SNAPSHOT.md and its hashes, use the `SELF`
    owning repository, and resolve the complete effective inventory, including reused earlier files.
    No pin silently follows latest or substitutes a Git revision for missing numbered evidence.
21. Guides: provider guides contain purpose and authority, official links, tracking intent, domain
    boundaries, summarization and consumer guidance. They have no Provider-Version field or versions
    directory.
22. Captures: every new numbered capture has a complete SNAPSHOT.md and advisory CAPTURE.md.
    Specification, counts, and verification rules live only in SNAPSHOT.md or its pinned manifests;
    the summary's hash matches the snapshot; metadata links and hashes form no self-hashing cycles.
23. Inventory: the full logical inventory resolves directly to regular files in this or earlier
    same-provider captures. Every earlier artifact owner is hash-pinned; predecessor and owner
    references decrease, with no cycles, forward references, duplicate logical paths, unsafe paths,
    or missing files.
24. Counts: effective logical inventory, newly stored files, reused entries, and corpus or case
    counts are distinguished and exact. Inventory and source membership agree through the declared
    mapping; all local control files are declared and hashed. A zero-file delta is valid only for a
    justified removal or specification change; the first baseline is nonempty.
25. Comparison: changes exactly match the predecessor comparison. Removed logical paths are absent
    from the new inventory while their old files remain intact. Unchanged artifacts reuse earlier
    physical paths; renames and reintroductions reuse verified earlier bytes when available. No
    duplicate full trees exist.
26. Summary: each summary records a baseline or update, artifact-backed findings, maintained-consumer
    mapping, recommended tests and work, exclusions, and unresolved questions, without unsupported
    parity claims.
27. Outcomes: NO-CHANGE creates no number, directory, timestamp, summary, guide update, or other
    tracked write. A changed capture publishes one new immutable numbered directory and an optional
    guide index entry, preserving every existing capture file, with no persistent duplicate copies.
28. History: captures from earlier versions remain valid under their own version's rules and may
    serve as pinned baselines and artifact owners. No capture contains a status, instruction,
    result, executable tooling, symlink, or undeclared artifact. No ordinary command deletes
    historical evidence or rewrites terminal records; a provider archive moves a whole provider
    unchanged and deletes nothing else. No active record references an archived provider, and no
    live capture uses an archived capture as predecessor or artifact owner.
