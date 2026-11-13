<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Status and listing

Parse `status [scope] [state] [--archived]` from the end: an optional final flag, then an optional
state; the remaining words are one scope selector. A quoted state-like target name is not a filter.
Summaries read only the ledger (its Targets table and live rows) and applicable archive indexes; no record bodies or
evidence are needed for them.

`status` without scope summarizes registered targets, their paths/status, and live record counts.
A target scope lists its live records; `all` lists all live records. An explicit state filters
summary rows. `--archived` selects archived rows only for summaries. Include target, qualified ID,
title, state, evidence mode, result availability, and location; order by target and numeric ID.
Registered targets with no live rows remain visible in installation summaries without creating
empty implementation subsections. An absent archive directory means no archived rows.

A unique record scope searches the live ledger and every implementation archive, then reads the
complete instruction and result when available. Report state, proof, location and usable links.
Report historical missing/changed files as information; never restore or repair them. If a target
and record description both match, ask which scope was intended. Invalid, duplicate or ambiguous
IDs are not silently chosen or substituted. Record detail does not accept summary filters.

`status`, `help`, `recall`, and `check` are read-only. They may report damaged tracking or an
interrupted write (publication.md), but do not repair it. Scope and actual checks must be explicit
in the report.
