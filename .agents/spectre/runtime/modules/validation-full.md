<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

**Installation**

1. Runtime: all 19 modules equal their marked source extraction byte for byte, declare the
   installed version and source hash, and contain no independent edits (full validation). Every
   module loaded by an invocation has matching version and source-hash headers.
2. Templates: exactly the three canonical templates exist, only under
   `.agents/spectre/runtime/modules/templates/`. `runtime/` holds only the installed protocol and
   `modules/`; `modules/` holds only the extracted modules and `templates/`. `ROUTER.md` is the
   only file at the top of `.agents/spectre/`.
3. Router: exactly one router exists at `.agents/spectre/ROUTER.md`, matches the §2 router, and
   routes commands, compound queues, batches, and continuations only when the current-human message
   mentions SPECTRE.
4. Router behavior: the router accepts §1 natural-language selectors, sequential implementation
   batches, all-or-nothing decision batches, and explicit non-decision operation queues; it
   resolves and reports fixed canonical identities before mutation, binds deferred queue outputs
   before their item writes, and pauses on ambiguity or missing proof.
5. Activation: the router and the `AGENTS.md` pointer agree with `core.md` on per-message SPECTRE
   mention activation, and neither enables global tracking or an automatic later operation.
6. Host adapters: none is required. Every SPECTRE adapter found at a §2 table path carries only the
   current §2 pointer body in its host's format and contains no protocol rule. No SPECTRE file
   records which adapters exist.
7. Bootstrap: exactly one `ACCEPTED` bootstrap row exists at the flat `<target>/0001` or monorepo
   `repository/0001`, with the required human-request decision proof; while active, it has its
   matching instruction and result. An archived bootstrap is kept as is. An empty active ledger never authorizes another bootstrap.
8. Layout: exactly one aggregate root `SPECTRE.md` exists, with one repository section in flat mode
   or exactly one section per target in monorepo mode. Flat installations store active records
   directly under `.agents/spectre/implementations/`, monorepos under target directories; flat and
   nested records never coexist; no target-local `STATUS.md` exists. Each implementations archive
   preserves the same layout beneath its own `implementations/`; a provider archive holds only
   whole provider directories beneath its own `providers/`.
9. Installation does not modify product source.

**Archives**

29. Manifests: each archive directory has an `ARCHIVE.md` whose Archive-ID matches the directory
    name (UTC timestamp and optional collision suffix). In an implementations manifest, including
    one without a `Kind` line, every row carries an ID, a terminal state, and a decision proof. In
    a provider manifest, every row names a provider slug and its capture range.
30. Version: every manifest, whatever its `Archive-Version` and `Protocol-Version`, is read only for
    its header and those rows; its content is never judged under newer rules.
31. As is: archived files, Record paths entries, links, paths, and recorded SHA-256 values are not
    validated. A missing file, broken link, or changed hash in an archive is information, never a
    failure.
32. Separation: archived rows do not remain in the active ledger, and `PLANNED` or `REVIEW` records
    never appear in archives. Root ledger metadata and every target table header remain present when
    tables are empty. A batch holds implementations or providers, never both. Archiving
    implementations moves no provider file; archiving providers changes no record or ledger row.
    Neither modifies product source.
33. Known issues: a manifest's `Known issues` table, when present, is informational and kept as is.
