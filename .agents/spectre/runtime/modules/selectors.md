<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Natural-language selectors

Record selectors accept qualified `target/NNNN`, a unique bare ID, title/objective descriptions,
or verified conversational references such as "this plan". Target selectors accept stable IDs,
current paths, labels and repository/package descriptions. Provider selectors accept existing slugs
or guide descriptions. Explicit IDs take precedence; an invalid or missing explicit ID never gets
a fuzzy replacement. Search the Targets table and live/archive indexes first; read only candidate bodies
needed to resolve meaning. A source folder is not automatically a registered target (§4).

1. Parse operation and objective/changes/proof/reason, preserving the human payload. Colons are
   convenient, not required. Ask only when the split, intent, or required scope is ambiguous.
2. Prefer exact identities, then labels/objectives and repository metadata. Clear spelling variants
   in descriptive prose are allowed. Never choose solely by similarity or substitute another ID.
3. "This", "them" and "both" require actual human or SPECTRE-report context verified against records.
   Explicit qualifiers constrain the match. Queue pronouns refer only to their declared antecedent;
   "archive them" never expands from selected outputs to a target or installation.
4. "Latest" means highest created ID within one target, or a unique latest valid instruction Created
   timestamp across targets. Never compare target-local counters across targets. "Last implemented"
   requires actual event-order evidence; file mtimes, ledger order and archive dates are insufficient.
5. Resolve identity before state eligibility. Never skip an ineligible latest item to select an older
   eligible one. Explicit state filters apply before recency only when the human supplied them.
6. Report canonical scope and states before mutation, recheck before writing, and store canonical
   IDs/paths rather than phrases. If waiting changes a relative selector's meaning, clarify.

Omitted status/check/sync scope means the installation. Omitted archive scope means eligible terminal
implementations across all targets; omitted recall target means all targets. An unresolved supplied
selector never becomes omitted scope. `all` and `implementations` are reserved scope/kind words, as
are `providers`; quote an otherwise ambiguous descriptive target label. Exact registered IDs remain
canonical. Source slugs named `all`, `implementations`, or `providers` require a distinct target ID.

Implementation archive accepts a record set, a whole target or `all`, with optional explicit kind
`implementations`. An exact target means its eligible terminal rows, preserving open rows. An exact
record set must be entirely terminal or pause at the human checkpoint (§1); never expand or silently
filter it. Already archived explicitly selected records are reported as no-ops and not moved again.
Provider archive has no `all` form and never expands a description to every provider. A request
ambiguous between provider and implementation archive requires clarification. Capture requires an existing guide except explicit
provider preparation (§12). New target registration belongs to first planning, not generic sync.

### Implementation batch selectors

`implement --batch <records>` or a clear plural request accepts comma-separated qualified IDs, an
inclusive target-local range such as `typescript/0025..0029`, or a bounded description such as
"the plans just listed" or "all PLANNED plans in typescript". Resolve and freeze the entire nonempty
set and order before mutation. Reject duplicate IDs, missing explicit range members, ambiguous or
ineligible selections; never filter them. Cross-target sets use qualified identities. Honor stated
order when dependencies permit; otherwise explain the conflict. Unordered sets sort by dependency,
then target and numeric ID. A required ACCEPTED input remains a human gate even earlier in a batch.
Continuation uses bound IDs, never a fresh evaluation of "all". Reject unknown/repeated flags.

### Decision batch selectors

Accept, reject and cancel accept one record, comma-separated IDs, target-local inclusive ranges,
or a bounded plural description. Freeze and report the complete nonempty set before mutation;
reject duplicates, missing range members, archived/terminal records, and ineligible states rather
than partly deciding. Accept/reject require REVIEW; cancel accepts PLANNED or REVIEW. One human
proof/reason must apply to every selected record. Decision order has no lifecycle meaning.

An accept or reject selector may bind each record to the result digest the human reviewed:
`api/0004@3f9a1c0b7d2e`, alone or in a comma-separated list; a range carries no digests. The
decision applies only while every bound result still has that digest; a mismatch decides none and
reports the changed result. Cancel takes no digests.

Proof and reason requirements and the recorded proof shape are defined once, in commands/decide.md.
A batch decision without applicable proof/reason pauses. Never infer approval from the queue itself.

### Archive record-set selectors

Implementation archive reuses the bounded ID/range/plural syntax and duplicate/gap checks above.
The resolved set is fixed before writing. Target/all scopes collect only terminal rows at binding;
a later record never joins. A deferred "them" binds only prior queue outputs, including their open
states for the decision checkpoint. After the decision recheck that same set. Read-only historical
lookup does not imply authority to archive providers or modify unrelated records.
