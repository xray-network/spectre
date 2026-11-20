---
title: Core concepts
description: "How XRAY/SPECTRE works: installations and ledgers, targets, records and states, human decisions, evidence, combining installations, safe writes and versions."
---

# Core concepts

XRAY/SPECTRE is a set of instructions for your coding agent, plus the Markdown records it keeps in your
repository. You describe a change; your agent plans it, implements it and records its checks; you
decide. This page explains the ideas behind that, so you know what your agent writes, where, and
what stays your decision.

## One change, end to end

Three requests take one change from idea to decision. Each writes a file and moves the record's
row in `SPECTRE.md`:

<ol class="spectre-flow">
<li>
<pre><code>Spectre plan api: add a health endpoint</code></pre>
<p class="spectre-flow__result">Writes the plan to <code>.agents/spectre/implementations/0002-IMPL-INSTR.md</code>; row <code>0002</code> becomes <span class="spectre-state spectre-state--planned">PLANNED</span></p>
</li>
<li>
<pre><code>Spectre implement 0002</code></pre>
<p class="spectre-flow__result">Changes the source, runs the checks and writes <code>0002-IMPL-RESULT.md</code>; the row becomes <span class="spectre-state spectre-state--review">REVIEW</span></p>
</li>
<li>
<pre><code>Spectre accept 0002: checks pass</code></pre>
<p class="spectre-flow__result">Records your words, the date and the result's digest; the row becomes <span class="spectre-state spectre-state--accepted">ACCEPTED</span></p>
</li>
</ol>

The sections below explain each piece: the [ledger](#installation-and-ledgers), the
[target](#targets), the [record and its states](#records-and-states) and your
[decision](#human-decisions). The [example repository](./example) shows a complete one.

## Installation and ledgers

An installation lives in one folder, its installation root: the repository root by default, or a
project folder you name. It holds:

- **`SPECTRE.md`**, the live ledger, holds the Targets table, the Providers section and one row per
  open or recently finished implementation.
- **`.agents/spectre/`**: the installed protocol and its rule modules, live records under
  `implementations/<target>/`, captured evidence under `providers/`, and the archive: its ledger
  `__archive/<timestamp>/` folders inside `implementations/` and `providers/`, each with an
  `ARCHIVE.md` holding the rows that left `SPECTRE.md`.
- **A pointer in `AGENTS.md`** that tells every agent where the router is.

Treat `.agents/spectre/runtime/` as read-only: it is generated from the protocol and replaced by an
upgrade. A repository can hold several installations, each fully independent.

## Targets

A target is one area of code that owns its own work, such as a package or service.

- **Single project or monorepo.** Records always live in `implementations/<target>/`. A single
  project has one target, named after its folder, which also holds the installation record. A
  monorepo gives each project its own target, plus a reserved `repository` target for governance.
  Each target has its own numbering.
- **IDs.** A new target's ID comes from its folder's path, slugified (`js/packages/runtime/` becomes
  `js-packages-runtime`), or from the package name when it is unique (`@acme/runtime` becomes
  `acme-runtime`). The agent reports it at the first plan, and you can choose another then. Once
  registered, an ID never changes.
- **Paths.** The Targets table records each target's current folder. Rename or move a folder, then
  run `Spectre sync`: it proposes the new path, or retiring a target whose folder is gone, and
  applies what you approve. The ID and history never change. Planning new work for a retired target
  brings it back.

## Records and states

Every change is one record with a qualified ID such as `api/0004`. Numbers are never reused, even
after archiving.

- **Instruction** (`NNNN-IMPL-INSTR.md`): the plan, with its inputs, required changes, checks and
  completion criteria.
- **Result** (`NNNN-IMPL-RESULT.md`): what was changed, the checks that actually ran, and anything
  left open.

| State | Meaning | Who sets it |
| --- | --- | --- |
| `PLANNED` | The plan is ready; work has not reached review | Your agent |
| `REVIEW` | Implemented and checked; waiting for your decision | Your agent |
| `ACCEPTED` | You approved the result | You only |
| `REJECTED` | You turned the result down | You only |
| `CANCELLED` | You abandoned the work; its changes and results stay | You only |

Finished records are never edited: a correction is a new record that references the old one.
Archiving keeps `SPECTRE.md` short: it moves finished records, unchanged, to
`implementations/__archive/<timestamp>/<target>/`, and their rows, with your decisions, into that
folder's `ARCHIVE.md`. It is not a state. Archived files sit deeper than before, so relative links
inside them may no longer open; they are history and are never rewritten. Records refer to each
other by ID, so a record that depends on an archived one never needs editing.

## Human decisions

Only you decide. Passing tests, a merge or a positive comment never accept work. Your decision is
recorded with your own words, the date and a digest of the result you reviewed, so it applies to
those exact bytes: if the result changes later, it needs a new decision. See
[decision proof](./commands#decision-proof).

## Evidence

Each plan declares what it relies on:

| Mode | The plan relies on |
| --- | --- |
| `LOCAL` | The repository's own requirements and code |
| `DIRECT` | Captured evidence from outside the repository |
| `DERIVED` | Accepted results of earlier records |
| `HYBRID` | Both captured evidence and accepted results |

Outside evidence, such as an upstream repository, a specification or another project's interface,
enters as a **provider**: a guide describing the source, plus numbered **captures**, each a frozen
snapshot with a summary of what changed. Plans pin an exact capture and its hashes, never a branch
or "latest". In `SPECTRE.md`, each provider has its own subsection with a guide link and a row for
every numbered capture. Each row shows the UTC capture date, upstream identity, snapshot and
summary links, and the live implementations that pin that capture. The highest capture ID is the
latest. `Spectre status <provider> --archived` lists archived consumers by capture.

Records stay within their installation. Evidence from another project, including a sibling in the
same monorepo, enters through a provider capture.

## Combine and split installations

Two operations move whole targets between installations, each run on its own and logged:

- **`Spectre absorb <path>`** merges the installation inside `<path>` into this one.
- **`Spectre detach <target> to <path>`** moves a target into the installation at `<path>`, creating
  it when needed, and retires it here.

Both build an ID map first and report it. Record numbers stay; a colliding target ID gets the folder
as prefix (`app` at `./mobile/` becomes `mobile-app`). Every link, pin and hash that refers to a
moved file is updated in both installations, and the map is recorded in both ledgers. Detach refuses
while live work in another target depends on the one leaving. Commit first: version control is the
rollback.

## Safe writes

Tracking is plain Markdown, with no locks or databases. Every operation writes in a fixed order, and
one write is its commit point: the ledger row, the archive's `ARCHIVE.md`, or a
capture's `SNAPSHOT.md`. If an agent stops halfway, `Spectre sync` names what was left:

| Left behind | Next step |
| --- | --- |
| A plan's instruction without its ledger row | Delete it, or ask to plan the same objective again |
| A result not yet linked from its `PLANNED` row | Implement again; it reconciles the result |
| An `__archive/<timestamp>/` folder without its `ARCHIVE.md` | `sync` removes the copies |
| Archived rows or files still in the live ledger or `implementations/` | `sync` finishes the move |
| A capture directory without `SNAPSHOT.md` | `sync` removes it |
| Records of an `absorb` or `detach` in both installations | Repeat the same operation; it skips what is done |
| Rule files or a ledger hash that do not match the protocol | Repeat the install or upgrade |

Anything else is a blocker: restore it from version control or order an `override`. Two branches can
allocate the same ID; after the merge, `sync` reports it, and you renumber one with an override.
Commands never commit, push or deploy.

## Tools

A tool is a program you run yourself, such as a CLI or a local page. It reads and writes the same
Markdown under the same rules: it can show status, run sync, archive, and record decisions you make
in it. Planning, implementation, revision, capture and recall still need
an agent. A decision made in a tool names the tool in its proof.

## Versions

An installation keeps its installed protocol until you ask for `Spectre upgrade`. An upgrade fetches
the latest protocol and rewrites live records to its formats; archived records are never rewritten.
Commit first: version control is how you roll back. See [versioning](./versioning).

[Continue to the command reference →](./commands)
