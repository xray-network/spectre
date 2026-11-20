<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

## 13. Validation invariants

Validation is mandatory within every operation; a report-only `sync` is optional read-only
diagnosis, never a prerequisite command. Install, upgrade and unscoped sync validate the complete
installation.
Routine writes, including archive, validate the affected dependency closure and shared identity
indexes without revalidating unrelated evidence. Full validation re-extracts every runtime module
and template byte-for-byte. Scoped validation verifies loaded module headers and selected formats,
states, inputs, containment and references. Report the exact checked scope, never imply a full pass
from a scoped check. Always verify the final affected records before reporting success.

Read the canonical status/implementation/target templates for matching checks; provider consumption
loads its template, providers.md and validation-evidence.md. Live files follow the installed
templates. Missing normative evidence blocks its consumer;
stale historical source links alone do not invalidate terminal decisions.

Every applicable failed invariant blocks the selected write except the exact mechanically
correctable bookkeeping defects ordinary sync is authorized to fix. Existing unrelated defects
are reported, not silently waived or expanded into repairs. Override exceptions are explicit and
reported under §9. Read-only diagnosis can report multiple failures instead of stopping at the first.

Checks below are split between this module (records/references/operations), validation-full.md
(installation and archives), and validation-evidence.md (captured/provider inputs).

**Ledger and records**

10. Format: `SPECTRE.md` and every `ARCHIVE.md` use §11 canonical delimiters/columns; Targets rows and implementation
    subsections are unique and sorted; live subsections are populated and name ACTIVE targets.
11. Identity: valid target/provider slugs and four-digit IDs; no new target is all/implementations/
    providers. Each record ID has exactly one row, live or archived. Sequence allocation scans
    every row and record file, live and archived, never fills gaps or reuses published IDs. Duplicate IDs from
    parallel branches are blockers resolved under publication.md.
12. Rows: each live row has one matching instruction, matching title/evidence mode and at most one
    result. REVIEW/ACCEPTED/REJECTED require results; a started PLANNED instruction has a partial result.
    Detect orphan files rather than reconstructing/deleting them automatically.
13. Agreement: row/instruction/result IDs and modes agree; each required Change ID has exactly one
    disposition. Instructions carry a valid Target-Path snapshot. Current ownership must be clear
    before implementation; historical location never authorizes silent input rebinding.
14. Completion: implementation-complete reports have matching results, actual required validation,
    and REVIEW or a later human decision. Partial work states its real checks and blockers.
15. Immutability: terminal record bytes and decisions remain unchanged except an upgrade's rewrite
    (§14), `absorb`/`detach` or an explicit override. Every live ACCEPTED or REJECTED row's recorded digests match its
    current result bytes; a mismatch is a structural blocker. Source renames do not rewrite terminal
    inputs/history.

**References and targets**

16. Boundary: local references and active target paths remain inside the installation, including
    realpath/symlink containment. External official provenance URLs are not local input pointers.
17. Resolution: links in `SPECTRE.md` and every `ARCHIVE.md` resolve to existing files; record-to-record references resolve
    by qualified ID through the ledgers. Historical source locations may be stale; missing normative evidence blocks its
    consumer. Never guess replacement evidence or use log text as an input redirect.
18. Dependencies: DERIVED/HYBRID consume accepted results of this installation, preserving identity
    and decision through archiving. Other projects enter through provider captures of their interfaces.
19. Target ownership/moves: ACTIVE paths exist (a new project's path once any of its records reaches
    REVIEW), target IDs are stable, ownership does not overlap
    except repository governance, RETIRED targets have no live rows and retain identity/last path.
    Evidence/record moves use archive/absorb/detach/override; a Path update changes current source
    binding only.

**Operations**

33. Batches: fixed IDs/order, honest outcomes, actual checks and acceptance gates; no silent skips.
34. Queues: reports follow queues.md for scopes, deferred outputs, outcomes and checkpoints.
35. Decisions: follow commands/decide.md: complete eligible set, explicit current-human intent, the
    recorded proof shape with result digests, digest guards, one ledger edit changing only State and
    Decision or status cells.
36. Logs: logs/ is optional, ignored with a single-line * .gitignore, informational and never used
    for validation authority, authorization, numbering or recovery. No tracked secrets or credentials.
37. Publication: writes follow publication.md; a commit point is written last. Interrupted states are
    reported with their next action; only the states marked safe sync are completed automatically.
38. Sync: only the exhaustive safe fixes in commands/sync.md occur without an answer, and target
    fixes only after the human answers; no implementation rows or records reconstructed, no
    state inferred, no evidence/history deleted, no format upgraded implicitly.
39. Targets: the ledger's Targets table uniquely owns IDs, labels, current paths, status and reasons.
    Removing an empty implementation subsection never removes a Targets row or frees its ID.
40. Providers: each live subsection links its guide. Each published capture has one row under
    its own provider, with matching ID, UTC date, upstream identity, snapshot and summary links.
    Pinned by equals the sorted set of live implementations whose instructions pin that exact
    capture. Validate the empty marker for a guide with no captures.

Use repository-native validation tools when available. Machine checks verify structure and execution
contracts; human acceptance remains a separate explicit decision. Never report checks that did not run.
