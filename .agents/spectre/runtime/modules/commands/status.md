<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

### Status and listing

Parse `status [scope] [state] [--archived]` from the end: an optional final flag, then an optional
state; the remaining words are one scope selector. A quoted state-like target name is not a filter.
Ordinary summaries read only `SPECTRE.md` (its Targets, Providers and live rows) and, for
`--archived`, the `ARCHIVE.md` of every `__archive/<archive-id>/`.

`status` without scope summarizes registered targets, their paths/status, and live record counts.
A target scope lists its live records; `all` lists all live records. An explicit state filters
summary rows. `--archived` selects archived rows only for summaries. Include target, qualified ID,
title, state, evidence mode, result availability, and location; order by target and numeric ID.
Registered targets with no live rows remain visible in installation summaries without creating
empty implementation subsections. A provider scope shows its guide and capture rows with the live
implementation IDs in each Pinned by cell. With `--archived`, find the provider's subsection in the
live ledger or its provider archive, then list archived consumers per capture by reading the
Provider pins sections of the archived instructions named by the implementation archive ledgers.
Match the recorded provider/capture ID, independent of whether the historical link resolves. Report
unreadable or incomplete history and distinguish recorded pins from evidence verified for use.
For provider summaries, a state filter applies to the consumer implementations. No `__archive/`
folder means nothing is archived.

A unique record scope searches `SPECTRE.md` and every archive's `ARCHIVE.md`, then reads the
complete instruction and result when available. Report state, proof, location and usable links.
Report historical missing/changed files as information; never restore or repair them. If a target
and record description both match, ask which scope was intended. Invalid, duplicate or ambiguous
IDs are not silently chosen or substituted. Record detail does not accept summary filters.

`status`, `help` and `recall` are read-only, as is `sync` asked to report only. They may report
damaged tracking or an interrupted write (publication.md), but do not repair it. Scope and actual checks must be explicit
in the report.
