<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

**Installation**

1. Runtime: all 18 modules equal their marked source extraction byte for byte, declare the
   installed version and source hash, and contain no independent edits (full validation). Every
   module loaded by an invocation has matching version and source-hash headers.
2. Templates: exactly the three canonical templates exist, only under `.agents/spectre/templates/`.
3. Router: exactly one skill exists at `.agents/skills/spectre/SKILL.md`, declares
   `name: spectre`, and routes commands, compound queues, batches, and continuations only when the
   current-human message mentions SPECTRE.
4. Router behavior: the skill accepts §1 natural-language selectors, sequential implementation
   batches, all-or-nothing decision batches, and explicit non-decision operation queues; it
   resolves and reports fixed canonical identities before mutation, binds deferred queue outputs
   before their item writes, and pauses on ambiguity or missing proof.
5. Activation: the skill and the `AGENTS.md` pointer agree with `core.md` on per-message SPECTRE
   mention activation, and neither enables global tracking or an automatic later operation.
6. Host adapters: every adapter present is one of the §2 files, carries only the §2 pointer body in
   its host's format, and contains no protocol rule.
7. Bootstrap: exactly one matching instruction, result, and `ACCEPTED` bootstrap row exist at the
   flat `<target>/0001` or monorepo `repository/0001`, active or archived, with the required
   human-request decision proof. An empty active ledger never authorizes another bootstrap.
8. Layout: exactly one aggregate root `SPECTRE.md` exists, with one repository section in flat mode
   or exactly one section per target in monorepo mode. Flat installations store active records
   directly under `.agents/spectre/implementations/`, monorepos under target directories; flat and
   nested records never coexist; no target-local `STATUS.md` exists. Each archive preserves the
   same layout beneath its own `implementations/`.
9. Installation does not modify product source.

**Archives**

29. Manifests: each manifest matches its batch ID, storage mode, and directory name (UTC timestamp
    and optional collision suffix), and contains only terminal rows within its declared scope, with
    unchanged decision proofs and valid direct instruction and result links. All archived target
    sections correspond to existing active-ledger sections.
30. Version: a manifest is governed by its own `Archive-Version` and `Protocol-Version`. A
    manifest from an earlier version is checked only for its header, its Record paths entries, and
    its SHA-256 digests; its content is never re-judged under newer rules.
31. Path maps: each archived record has exactly one path-map entry with a matching SHA-256. All
    mapped files are regular files inside that batch, with no undeclared files, duplicate IDs,
    duplicate Original paths, conflicting active copies, or incomplete batches.
32. Separation: archived rows do not remain in the active ledger, and `PLANNED` or `REVIEW` records
    never appear in archives. Root ledger metadata and every target table header remain present when
    tables are empty. Archiving modifies neither provider captures nor source.
33. Known issues: a v2 manifest has a `Known issues` section holding `None.` or rows that each name
    an existing file, an exact failed check, and the archive ID that found it.
