<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

## 13. Validation invariants

Validation is an internal requirement, not a public operation. Installation, explicit protocol
updates and archive workflows validate the complete installation, including every runtime file,
template, active record and archive. Full validation re-extracts runtime from the complete
protocol and compares bytes. A record-scoped validation checks its identity, schema, state, links,
and transitive declared inputs, including relevant archive manifests and provider inventories;
it does not claim that unrelated records or runtime files were fully validated. Planning,
implementation, revision and decisions validate affected records and their required inputs; capture
validates the complete candidate and referenced evidence. Validate before publication/state changes
and verify the resulting records/evidence before reporting success. Required checks cannot be skipped
because no standalone command exists. Other workflow checks use the affected scope unless full
validation is explicitly required. This scope limits reads, never the applicable checks.
Upgrades (§14) validate the complete installation before and after the change. Read the
status/implementation templates for record validation and the provider template when provider
inputs or capture are involved.

Run every applicable check below. Each states its pass condition; a check passes only when that
condition holds exactly. A failed check blocks the operation, except an existing defect that a
forced archive records as a known issue (§9) or an issue already listed in an earlier manifest's
`Known issues` table.

Checks are split by who needs them. This module holds the record, reference, and operation checks
that every workflow applies. `validation-full.md` holds the installation and archive checks (1–9,
29–33) for full validation during installation, archive, and upgrade. `validation-evidence.md` holds
the provider-evidence checks (20–28) for any workflow that captures or consumes provider evidence.

**Ledger and records**

10. Format: every ledger and manifest table follows the §11 canonical table format, and every ID
    cell holds a qualified `target/NNNN` ID.
11. Identity: target and provider slugs and four-digit IDs are valid. IDs are unique across active
    records and all archives in each sequence, ascending, and never reused.
12. Rows: every ledger row has a concise Title that agrees with its instruction objective, exactly
    one matching instruction, and, for states that require one, exactly one matching result
    (optional states have at most one).
13. Agreement: instruction, result, and ledger IDs, evidence modes, and links agree. Each result
    disposition maps to exactly one instruction Change ID; no required Change ID is missing or
    duplicated.
14. Completion: every item reported implementation-complete has a matching result, required
    validation evidence, and a `REVIEW` row or later human decision. A partial `PLANNED` result
    states actual work and blockers. Source edits alone are not completion, and batches never bypass
    this.
15. Immutability: terminal record bytes and decision values are unchanged since entering their
    terminal state. Only §9 archive relocation and rebased links are permitted, plus moves recorded
    in `MIGRATIONS.md` and changes recorded in `OVERRIDES.md`.

**References**

16. Boundary: every reference in a record, ledger, manifest, or provider file stays inside the
    installation root (§3). No reference leaves it, including to another installation in the same
    repository.
17. Resolution: every reference resolves using original locations, the §9 archive path maps,
    `MIGRATIONS.md`, and `OVERRIDES.md` to a unique existing file. Manifest links and other installation-relative
    Markdown links resolve directly.
18. Dependencies: `DERIVED` and `HYBRID` inputs resolve to results of this installation whose active
    or archived decision row says `ACCEPTED`; archived result hashes match their manifest.
    Dependencies and evidence references resolve across active and archived records to the same
    identity and state.
19. Migrations: when `MIGRATIONS.md` exists, every row names an existing new path whose bytes match
    `SHA-256 after`, every row marked as keeping its original names an existing original whose bytes
    match `SHA-256 before`, and no row maps a path that another row also maps.

**Operations**

34. Batches: batch reports account for the fixed selected IDs, completion, and any blockers or
    unstarted work; required `ACCEPTED` dependencies and human-only decisions remain enforced.
35. Queues: compound-queue reports account for every normalized operation, dependency, deferred
    binding, completion, blocker, and exact remaining item. Every item keeps its workflow boundary;
    accept, reject, cancel, forced archive, and override never appear in a queue.
36. Decisions: a decision batch uses one explicit human decision and one applicable proof or reason,
    preflights a fixed nonempty eligible set, changes all selected rows in one ledger edit, and never
    skips or partially decides an invalid selection. Only a single-record decision uses the verbatim
    command and UTC date as its proof.
37. Overrides: when `OVERRIDES.md` exists, every row records a human command and reason, each file
    after-state exists with bytes matching `SHA-256 after` unless a later row changed it again, and
    no row has been edited or removed. Checks broken only by a file's logged after-state pass.

Validation should use repository-native tools when available. Machine validation is helpful but
does not replace human acceptance.
