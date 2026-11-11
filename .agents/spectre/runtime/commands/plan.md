<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

## 4. Repository discovery and target selection

Before installing or preparing an instruction, inspect rather than guess:

- Read root `AGENTS.md` and other repository guidance.
- Inspect manifests, workspace definitions, lockfiles, source roots, test roots, build files, and
  documented completion commands.
- Identify package or service boundaries and their owners.
- Prefer terminology already used by the repository.
- Ignore generated output, vendored dependencies, caches, fixtures, SPECTRE archives, and documentation mirrors as
  target candidates unless repository instructions explicitly make one independently owned.

Choose targets using these rules:

- Use flat mode unless repository discovery establishes that the repository is a monorepo or the
  current human explicitly requires separate implementation targets.
- A single application, package, or service uses flat mode. Do not create
  `implementations/<target>/` for it, even when its name or a plausible target slug is known.
- A monorepo uses nested mode. Each independently versioned, owned, or validated package/service
  usually becomes one target directory.
- In monorepo mode, `repository` is the reserved repository-governance target. Its `0001` record is the
  SPECTRE installation; it is not a parent product target.
- A current human may explicitly require nested target directories when repository metadata alone
  does not establish a monorepo. Absent that direction, use flat mode.
- Do not create both a parent target and child targets for the same implementation ownership.
- Never mix flat implementation records and target directories in one active installation.
- Do not use transient branch names, ticket numbers, contributor names, or vague buckets such as
  `misc`.
- Use lowercase ASCII slugs containing letters, digits, and single hyphens. A target ID matches
  `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- When two plausible models would assign the same source to different targets, stop before
  creating target directories and ask a human to choose.

Choose the storage mode and target layout during installation. This release does not define
in-place conversion between layouts. Terminal records retain their original paths except for
the explicit archive relocation defined in §9; their logical identity and original path remain recorded.

## 6. Evidence modes and inputs

Every instruction declares exactly one evidence mode:

| Mode | Normative inputs |
| --- | --- |
| `DIRECT` | One or more immutable numbered provider snapshots and their resolved artifacts. |
| `DERIVED` | One or more `ACCEPTED` implementation results. |
| `HYBRID` | Provider evidence and `ACCEPTED` implementation results. |
| `LOCAL` | Repository requirements and owned source only. |

Every normative input must be an explicit row in the instruction's input table. Input kinds are
`PROVIDER`, `IMPLEMENTATION_RESULT`, and `LOCAL`.

- A derived input is valid only while its active or archived decision row is `ACCEPTED` and the
  linked result matches the implementation ID. Resolve relocated inputs through the §9 archive
  path map; archiving does not revoke acceptance or require rewriting the consuming instruction.
- A provider input names an immutable numbered snapshot using the pin format and resolution rules
  in `providers.md`. A provider root, latest alias, branch, tag or `HEAD` alone is not an input pin.
- A local input names an exact tracked path, requirement, decision, or human-approved statement.
- Every input resolves inside the installation boundary (§3). A derived input is a result of this
  installation; anything from another project, including a sibling in the same monorepo, is a
  provider input.
- An accepted result exports a semantic contract. It does not authorize copying source, private
  internals, dependencies, licenses, or nominal types from another target.
- Do not silently fetch, refresh, substitute, or broaden a declared input during implementation.
  A material input change requires a new or revised non-terminal instruction.

## 8. Planning workflow

Run this workflow only for an explicit `/spectre plan` invocation, its host-native equivalent, or
one explicitly stated plan item in a normalized compound queue. Planning and implementation remain
separate operations except for the required bootstrap installation record in §2; a queue may contain
both only when the human stated both. Planning does not authorize product-source changes. Resolve the
target selector using §1 and §4 before allocating an ID or creating records.

1. Read repository guidance, relevant decisions, applicable source/tests/manifest/README, the
   applicable section in root `SPECTRE.md`, status and implementation templates, and candidate
   declared inputs. Read the provider template only when provider evidence is involved.
2. Capture first. If the plan relies on provider evidence, report every existing provider guide it
   relies on, then run the §12 capture workflow for each, in provider slug order, before allocating
   an ID. A CAPTURED or NO-CHANGE outcome leaves the provider's latest capture as the plan's pin; a
   BLOCKED outcome stops planning without creating an instruction. These captures belong to this
   plan operation and need no separate command. Planning never prepares a missing provider guide or
   changes a provider's selection rules; report either need as a blocker. A plan that relies on no
   provider evidence (`LOCAL` or `DERIVED`) captures nothing.
3. Reconcile the applicable sequence: repository-wide in flat mode or target-local in nested mode.
   Read active records and every archive manifest in that sequence. The next ID is one greater
   than the highest instruction, result, or ledger ID across both locations. Never fill gaps,
   reuse IDs, or restart after archiving, even when the active ledger is empty. Refuse incomplete
   or conflicting history; if the highest ID is `9999`, stop and report sequence exhaustion.
4. Confirm that prerequisite results are `ACCEPTED` and provider snapshots pass their complete
   resolved-inventory checks, including every reused file. Resolve pins under `providers.md`;
   incomplete captures or missing inherited artifacts block planning against that evidence. Do not
   substitute a different capture. Check owned source and existing active/accepted plans before
   proposing work; do not duplicate work already covered.
5. Select one evidence mode and resolve all inputs inside the installation boundary (§3).
6. Bound one coherent objective. Split independently reviewable or deployable changes.
7. Define every change, compatibility requirement, validation command, completion criterion,
   out-of-scope item, and blocker.
8. If a material question remains unresolved, record it as a blocker and do not create a
   misleading `PLANNED` row.
9. Verify that every reference in the new instruction resolves inside the installation boundary,
   then create `NNNN-IMPL-INSTR.md` and its matching `PLANNED` ledger row in the same change. Give
   the row a short title matching the instruction objective. Do not create a result or modify source.

Every change row receives a stable Change ID such as `C01`. IDs are unique within the instruction
and are used unchanged by the result.

Planning command:

```text
/spectre plan <target>: <bounded objective>
```
