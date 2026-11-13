<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

| Syntax | Operation and stopping boundary |
| --- | --- |
| `/spectre plan <target>: <objective>` | Capture the plan's declared providers if any, register its target on first use, and publish one instruction and `PLANNED` row together. No product changes. |
| `/spectre implement <record>` | Implement an existing `PLANNED` instruction, validate, and publish its result and `REVIEW` row together; interrupted work remains `PLANNED` with a partial result. |
| `/spectre implement --batch <records>` | Resolve and report a bounded set and order; complete each item's implementation, validation, result and ledger update before the next. |
| `/spectre revise <record>: <changes>` | Refine a `PLANNED` instruction without source changes, or revise a `REVIEW` implementation and its result within the existing objective; retain its state. |
| `/spectre status [scope] [state] [--archived]` | Read installation/target summaries or a record's details. Default summaries show live rows; `--archived` summaries show archived rows. Record lookup searches both locations. |
| `/spectre recall [target]: <question>` | Answer from recorded evidence and decisions with citations; no writes. |
| `/spectre check [scope]` | Diagnose consistency without writing. Omitted scope checks the complete installation; report checked scope and failures. |
| `/spectre sync [scope]` | Apply only deterministic bookkeeping corrections, including finishing provably interrupted writes, validate, and report; never infer lifecycle state or reconstruct missing records. |
| `/spectre accept <records>: <proof>` | Record the current human's acceptance of existing `REVIEW` results, with applicable proof. |
| `/spectre reject <records>: <proof>` | Record the current human's rejection of existing `REVIEW` results, with applicable proof. |
| `/spectre cancel <records>: <reason>` | Cancel existing `PLANNED` or `REVIEW` records with the human reason; preserve results and product changes. |
| `/spectre archive [scope]` | Archive selected terminal implementations; omitted scope means eligible live records across all targets. Record sets, targets and `all` are supported. Never close open work. |
| `/spectre archive implementations [scope]` | Explicit spelling of implementation archiving, with the same scope rules. |
| `/spectre archive providers <provider> [<provider>...]` | Archive whole named providers only when no live record references them; preserve evidence and warn about external consumers. |
| `/spectre target move <target>: <path>` | Update an existing target's current source path in the ledger's Targets table; preserve IDs, records and history. Does not move product files. |
| `/spectre target retire <target>: <reason>` | Retire an existing target with no live rows; retain its identity, last path, and history. |
| `/spectre target reactivate <target>: <path>` | Reactivate the same logical target at an existing path; continue its original sequence. |
| `/spectre capture <provider>` | Discover, compare, validate and publish a numbered baseline/update when needed; no change creates no tracked writes. |
| `/spectre upgrade <version>` | Explicitly migrate this installation to a verified named release using §14: replace generated files and migrate the live ledger and live records; archives and captures keep their bytes. Archive first to keep terminal records as written. Never upgrade from a moving mirror implicitly. |
| `/spectre override <scope>: <changes> because <reason>` | Apply an exceptional human-ordered SPECTRE change, update affected live references, and record an informational override log. Standalone only. |
| `/spectre host add <host> [<host>...]` | Add only named host adapters and report their invocation/reload requirements. Standalone setup. |
| `/spectre host remove <host> [<host>...]` | Remove only named SPECTRE host adapters. Standalone setup. |
| `/spectre help [operation]` | Explain operations, natural-language queues, checkpoints, and stopping boundaries without writes. |

In accept and reject, a record may carry the digest of the result the human reviewed,
`api/0004@3f9a1c0b7d2e`; the decision applies only while the result still matches.
There is no generic `delete`, `set-state`, unrestricted `repair`, or mandatory `target add` command.
Open work is closed by explicit cancellation, never by an archive flag.

`help` loads only core and its own module. An unknown operation is reported without executing a
different one; suggest help. Unknown/repeated flags or malformed explicit IDs never trigger fuzzy
fallback. Natural-language synonyms resolve only when their operation and scope are unambiguous.
