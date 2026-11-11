# Target registry

Target-Template-Version: v1

Create .agents/spectre/TARGETS.md with this shape:

```markdown
# SPECTRE targets

Target-Schema-Version: v1

| Target | Label | Path | Status | Reason |
| --- | --- | --- | --- | --- |
| `repository` | Repository | `./` | `ACTIVE` | Repository governance bootstrap |
```

Flat installations replace the example with their repository slug/label at ./ and keep one target.
Nested installations register repository for governance; other targets appear on first planning.
Rows are unique and sorted by canonical target ID. Active paths exist, use ./ or ./path/, and are
contained in the installation. A new project's path may be absent until any of its records reaches
REVIEW when its open plan creates it; retired paths retain the last location and may be absent. Status is
ACTIVE or RETIRED. Reason gives registration context or explicit retirement/reactivation reason.
Use §11 canonical table delimiters and no raw | inside cells. Labels are plain text. Never store
record state, counters, inferred folder inventories or aliases silently. Retain identity forever;
sync cannot remove a target merely because its ledger section is empty.
