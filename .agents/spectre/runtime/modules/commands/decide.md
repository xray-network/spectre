<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Decision workflow

Accept/reject require existing live REVIEW records with matching instructions and results. Cancel
accepts PLANNED or REVIEW with an instruction and any existing result. Only the current human's
explicit decision authorizes the transition: a command, clear natural language, a bounded
checkpoint reply (queues.md), or a decision action in a SPECTRE tool the human runs (§16). Archive,
tests, merges and queue descriptions do not. No product rollback occurs on rejection or
cancellation, and no result or instruction is deleted.

Resolve and report a fixed nonempty set (selectors.md). One applicable human proof or reason covers
the complete set. If it is missing, pause before mutation. Never fabricate a review claim.

A result digest is the first 12 lowercase hexadecimal characters of the SHA-256 of the result
file's bytes, written `<qualified-id>@<digest>`. It identifies the reviewed bytes without storing
full hashes in the ledger. Take it from the selector (`api/0004@3f9a1c0b7d2e`, selectors.md), from
the checkpoint the human answered, or from the bytes a tool showed the human; otherwise compute it
from the result as reported to the human. Recheck it immediately before writing. Dates are UTC
`YYYY-MM-DD`.

Every accept or reject records one Decision or status cell (§11 escaping) with this shape:

```text
<source> on <date>; reviewed <id>@<digest>, <id>@<digest>.
```

| Source | Used for |
| --- | --- |
| `Human command "<verbatim request>"` | A command or natural-language request in the conversation |
| `Human reply "<verbatim reply>"` | A direct reply to a pending checkpoint (queues.md) |
| `Human decision "<verbatim input>" in <tool>` | A decision action in a tool; the input holds the verb, IDs and any typed proof |

A cancellation records `<source> on <date>.` with no digests. The quoted words are the human's own
and carry any written proof or reason, so proof is always dated and never restated. Digests follow
the selection order, separated by `, `. Two or more records outside a checkpoint need human-written
proof or reason in those words; a cancellation of two or more always needs a reason; a reply to an
unchanged checkpoint set is its own proof. Example:

```text
Human command "Spectre accept api/0004: tested the limiter under load" on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e.
```

The quoted words are a human record: tools and agents never parse them for authority. They read
only the trailing digests, which `check` compares with each live accepted or rejected result
(§13). The
bootstrap installation record (§2) keeps its fixed proof and has no digest.

Read every selected row, instruction and result, required inputs, and the relevant checkpoint
binding. Immediately before writing, recheck identities, states, schemas and result digests. If any
record is missing, duplicate, archived, terminal, corrupt, ineligible or changed since review
binding, decide none; never filter the selection. A future-result acceptance in a queue is a
checkpoint and cannot execute from initial advance authorization.

Apply all selected transitions in one root SPECTRE.md edit, changing only their State and Decision
or status cells. Preserve other cells, every record, source, evidence and unrelated rows. Reread the
ledger first (publication.md); if a selected row changed, stop. Verify the diff and postconditions
afterwards. Report each canonical ID, final state and proof. Resume a preauthorized queue remainder
only under queues.md. Otherwise stop after the decision; no implicit archive or new work.
