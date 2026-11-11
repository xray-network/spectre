<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: 687625436908d6aa614773a7dd0ce9a8629be1929c66635d825efdcdefd56b6c

### Status and listing

Parse `status [scope] [state] [--archived]` from the end: an optional final flag, then an optional
state; the remaining words are one scope selector. A quoted state-like target name is not a filter.
Summaries read only the registry, live ledger, and applicable archive indexes; no record bodies or
evidence are needed for them.

`status` without scope summarizes registered targets, their paths/status, and live record counts.
A target scope lists its live records; `all` lists all live records. An explicit state filters
summary rows. `--archived` selects archived rows only for summaries. Include target, qualified ID,
title, state, evidence mode, result availability, and location; order by target and numeric ID.
Registered targets with no live rows remain visible in installation summaries without creating
empty ledger sections. An absent archive directory means no archived rows.

A unique record scope searches the live ledger and every implementation archive, then reads the
complete instruction and result when available. Report state, proof, location and usable links.
Report historical missing/changed files as information; never restore or repair them. If a target
and record description both match, ask which scope was intended. Invalid, duplicate or ambiguous
IDs are not silently chosen or substituted. Record detail does not accept summary filters.

`status`, `help`, `recall`, and `check` are read-only. They may report damaged tracking or an
interrupted write (publication.md), but do not repair it. Scope and actual checks must be explicit
in the report.
