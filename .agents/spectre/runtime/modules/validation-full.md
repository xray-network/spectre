<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

**Installation**

1. Runtime: all 23 modules equal marked source extraction, including installed Protocol-Version/source hash.
   Templates match §11 byte-for-byte. Full checks verify bodies, not just headers.
2. Layout of rules: runtime/ contains only SPECTRE-PROTOCOL.md and modules/; modules/ contains only
   extracted modules and templates/. Three canonical templates exist. ROUTER.md is the only
   top-level installed file; no installation README is generated. Informational logs are
   outside runtime/ and never protocol/decision authorities. No lock, transaction or staging files.
3. Router: the installed router equals §2 and loads every operation's dependencies selectively.
4. Natural language: selectors, queues and human checkpoints follow selectors.md and queues.md. Exact
   command syntax is optional; ambiguous identity or missing decision intent/proof stops mutation.
5. Activation: pointer and router agree with core.md: a new workflow needs a current-human mention;
   uniquely pending bounded replies are the sole name-free exception. No global tracking mode.
6. Slash commands: SPECTRE creates and checks none (§2).
7. Bootstrap: exactly one accepted `Install SPECTRE` row exists, live or archived, normally
   `<target>/0001` of a single project or `repository/0001` of a monorepo. It has its matching
   instruction/result and human installation proof; an empty live ledger never authorizes another
   bootstrap.
8. Storage: one SPECTRE.md in the installation root whose Protocol-Version and Protocol-SHA256
   equal the installed protocol's. Live record files are in `implementations/<target>/` and
   archived ones in `implementations/__archive/<archive-id>/<target>/`, never elsewhere. Implementation
   subsections exist exactly for targets with live rows; every target identity used anywhere has a
   Targets row. The Providers section has exactly one subsection per live provider directory and
   one row per published capture in that subsection. No target-local ledger. No target's Path
   contains another installation.
9. Installation changes only tracking structure and its pointer; no product implementation.

**Archives and relocation**

29. Archives: every `implementations/__archive/<archive-id>/` and `providers/__archive/<archive-id>/`
    has an `ARCHIVE.md` following §11. Implementation rows name exactly the archived records, are
    ACCEPTED, REJECTED or CANCELLED and belong to registered targets. Provider subsections name
    exactly the archived guides and all their published captures.
30. Archive identity: an implementation or capture has one row and a provider has one
    subsection across `SPECTRE.md` and all archive ledgers. Archived implementation rows keep their
    terminal states and proofs. Links inside archived files may be stale; that is information only.
31. Historical files: a missing or changed file behind an archived row is information for status;
    a consumer requiring it still validates its own normative input. Never fabricate evidence.
32. Relocation: after `absorb` or `detach`, both installations validate on their own files; the ID
    map is recorded in the moved targets' Reasons; no record of a moved target is left behind, and
    providers stay only where a remaining record pins them.
