<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8aa83ba3ac50feb3cc7a4e25c1a945fc25695fa146bbf4d246abb407ba3c9aad

**Provider evidence**

20. Pins: new inputs name numbered SNAPSHOT.md and hashes with SELF ownership; resolve complete
    inventories including reused files. No latest alias, Git ref or replacement for missing evidence.
21. Guides: unversioned purpose, authority, official sources, tracking, boundaries and consumer
    guidance; no provider-version directory or capture specification duplicated in the guide.
22. Captures: snapshots own complete specification/inventory and hash their advisory capture summary;
    no self-hashing cycles. Live captures follow the installed provider template.
23. Inventory: exact membership, regular files, sizes/hashes, unique safe paths; decreasing acyclic
    predecessor/owner references within the same provider; no forward/cross-provider ownership.
24. Counts: effective/new/reused/artifact/corpus/case counts and independent source enumeration agree.
    Every physical control file is declared and hashed. Zero-new-file deltas require a real change;
    an initial baseline is nonempty.
25. Comparison: exact added/changed/removed/unchanged mapping; old bytes are preserved, unchanged
    evidence reuses earlier physical files, and no duplicate full baseline is manufactured.
26. Summary: artifact-backed findings, maintained-consumer mapping, recommended checks/work and
    uncertainty; advisory content never authorizes execution or claims unsupported parity.
27. Outcomes: NO-CHANGE has no tracked writes or ID; CAPTURED commits a new immutable capture and
    optional guide index update together; BLOCKED never masquerades as upstream removal/no change.
28. Retention: earlier captures keep their paths and artifact bytes. No live record pins an archived provider;
    no live capture reuses an archived predecessor/owner. Only whole-provider archive moves evidence.
