<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 8792d72d42e4a70556d250a829ee45cdff86241cbd062e9eb3824062e71d07f4

| Syntax | Operation and stopping boundary |
| --- | --- |
| `Spectre plan <target>: <objective>` | Capture the plan's declared providers if any, register its target on first use, and publish one instruction and `PLANNED` row together. No product changes. |
| `Spectre implement <record>` | Implement an existing `PLANNED` instruction, validate, and publish its result and `REVIEW` row together; interrupted work remains `PLANNED` with a partial result. |
| `Spectre implement --batch <records>` | Resolve and report a bounded set and order; complete each item's implementation, validation, result and ledger update before the next. |
| `Spectre revise <record>: <changes>` | Refine a `PLANNED` instruction without source changes, or revise a `REVIEW` implementation and its result within the existing objective; retain its state. |
| `Spectre status [scope] [state] [--archived]` | Read installation/target summaries or a record's details. Default summaries show live rows; `--archived` summaries show the rows in the archive ledger. Record lookup searches both ledgers. |
| `Spectre recall [target]: <question>` | Answer from recorded evidence and decisions with citations; no writes. |
| `Spectre sync [scope]` | Check tracking, apply safe bookkeeping fixes at once, propose target fixes such as a moved folder for your answer, and report blockers. "Report only" writes nothing. Never infers lifecycle state or reconstructs records. Standalone only. |
| `Spectre accept <records>: <proof>` | Record the current human's acceptance of existing `REVIEW` results, with applicable proof. |
| `Spectre reject <records>: <proof>` | Record the current human's rejection of existing `REVIEW` results, with applicable proof. |
| `Spectre cancel <records>: <reason>` | Cancel existing `PLANNED` or `REVIEW` records with the human reason; preserve results and product changes. |
| `Spectre archive [scope]` | Move selected terminal rows from `SPECTRE.md` to the archive ledger and their record files to `archive/<archive-id>-<target>/`. Omitted scope means eligible live rows across all targets. Record sets, targets and `all` are supported. Never close open work. |
| `Spectre capture <provider>` | Discover, compare, validate and publish a numbered baseline/update when needed; no change creates no tracked writes. |
| `Spectre upgrade` | Explicitly bring this installation to the latest protocol using §14: replace generated files and rewrite the ledgers, live records and provider files to the current formats as one human-ordered override. Standalone only. |
| `Spectre absorb <path>` | Merge the installation at `<path>`, inside this one, into this installation: its targets, records, providers and rows, with an ID map (§9). Standalone only. |
| `Spectre detach <target> to <path>` | Move one target, its records and the providers it pins into a new or existing installation at `<path>`, and retire it here with an ID map (§9). Standalone only. |
| `Spectre override <scope>: <changes> because <reason>` | Apply an exceptional human-ordered SPECTRE change, update affected live references, and record an informational override log. Standalone only. |
| `Spectre help [operation]` | Explain operations, natural-language queues, checkpoints, and stopping boundaries without writes. |

In accept and reject, a record may carry the digest of the result the human reviewed,
`api/0004@3f9a1c0b7d2e`; the decision applies only while the result still matches.
There is no generic `delete`, `set-state`, unrestricted `repair`, or mandatory `target add` command.
Open work is closed by explicit cancellation, never by an archive flag.

`help` loads only core and its own module. An unknown operation is reported without executing a
different one; suggest help. Unknown/repeated flags or malformed explicit IDs never trigger fuzzy
fallback. Natural-language synonyms resolve only when their operation and scope are unambiguous.
