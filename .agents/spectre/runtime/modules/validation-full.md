<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

**Installation**

1. Runtime: all 25 modules equal marked source extraction, including installed version/source hash.
   Templates match §11 byte-for-byte. Full checks verify bodies, not just headers.
2. Layout of rules: runtime/ contains only SPECTRE-PROTOCOL.md and modules/; modules/ contains only
   extracted modules and templates/. Four canonical templates exist. ROUTER.md and TARGETS.md are
   the top-level installed files; no installation README is generated. Informational logs are
   outside runtime/ and never protocol/decision authorities. No lock, transaction or staging files.
3. Router: the installed router equals §2 and loads every operation's dependencies selectively.
4. Natural language: selectors, queues and human checkpoints follow selectors.md and queues.md. Exact
   command syntax is optional; ambiguous identity or missing decision intent/proof stops mutation.
5. Activation: pointer and router agree with core.md: a new workflow needs a current-human mention;
   uniquely pending bounded replies are the sole name-free exception. No global tracking mode.
6. Adapters: none required; existing SPECTRE adapters carry only the §2 pointer in their host format.
7. Bootstrap: exactly one accepted flat target/0001 or nested repository/0001 installation row exists
   in live or archived history. Active bootstrap has its matching instruction/result and human
   installation proof; an empty live ledger never authorizes another bootstrap.
8. Storage: one root SPECTRE.md uses Status-Schema-Version v1 and the selected flat/nested layout. Sections exist exactly
   for targets with live rows; every target identity has a registry binding. No target-local ledger
   or mixed flat/nested active storage. Archives retain their original layout/schema.
9. Installation changes only tracking structure and its pointer; no product implementation.

**Archive indexes**

29. Manifest identity: each archive has readable version/ID/kind headers and lifecycle or provider
    index rows. IDs match directory names and remain
    unique. Implementation rows retain terminal state and decision proof.
30. Version: archives use the schema that created them. Do not rewrite or rejudge their record bytes,
    paths, table syntax or hashes under a newer release. Read indexes needed for identity, decisions
    and numbering.
31. Historical files: missing/broken/changed archived content is informational for historical status;
    a consumer requiring that content must still validate its own normative input. Do not fabricate
    evidence to make a historical archive complete.
32. Separation: no authoritative row exists both live and archived; no PLANNED/REVIEW archive rows.
    New batches have one kind and preserve selected bytes/proof; affected dependencies resolve after
    relocation. No empty live sections remain. Archive never edits product source or unrelated data.
    No archive waives a failed selected-record check.
