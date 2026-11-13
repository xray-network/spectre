<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Archive workflow

Accept explicit commands or natural language under §1:

```text
/spectre archive [record-set|target|all]
/spectre archive implementations [record-set|target|all]
/spectre archive providers <provider> [<provider>...]
```

Omitted implementation scope means all eligible live terminal rows. Resolve/freeze the selected
scope before writing. A run publishes one kind in one new batch. No eligible rows/providers means
a reported no-op without creating a directory. Never cancel records, accept work, reset IDs or
delete history as part of archiving. Archiving never waives a defect: open work is cancelled
explicitly first, and damaged tracking needs a scoped override.

#### Implementations archive

Target/all scopes select ACCEPTED, REJECTED and CANCELLED live rows, preserving PLANNED/REVIEW.
An explicit record set must be entirely terminal; open selections pause for a human decision
checkpoint, and no partial subset is archived. Already archived selected IDs are no-ops. Pronouns
and deferred output scopes never expand to all rows or the parent target.

1. Read the ledger, archive manifest indexes, selected terminal instructions/results and
   affected inbound/outbound SPECTRE references. Validate the affected dependency closure (§13), not
   unrelated product records/evidence. Global identity indexes must still be readable and unique.
   An unfinished earlier archive (publication.md) blocks publication. ACCEPTED/REJECTED require results;
   preserve CANCELLED's optional result. Strictly validate selected live bytes and identity.
2. Record exact files, hashes, decision rows and original installation-relative paths. Choose UTC
   archive ID YYYYMMDDTHHMMSSZ, adding the smallest unused four-digit suffix beginning -0001 on
   collision; never write into an existing batch directory.
3. Copy the selected files into the new batch, preserving each file's suffix beneath
   implementations/ and its bytes, and verify their hashes. Then write ARCHIVE.md below, the commit
   point of the copy (publication.md). Verify selected rows, direct manifest links and affected
   dependency resolution. Record IDs remain qualified identities. Archive relocation resolves
   existing embedded references by original paths; no redirect stubs or record rewrites.
4. Reread the ledger. Remove the matching live rows, then only the verified originals, and prune
   newly empty implementation subsections and record directories. Keep ledger metadata, the Targets
   table, unrelated subsections/rows and earlier archives. A ledger with no live rows keeps its
   metadata, Targets table and Implementations heading; never create per-target empty-table markers.
5. Verify exactly one authoritative row per selected ID, preserved state/proof/bytes, and affected
   reference resolution. An interruption leaves a state publication.md names; never overwrite
   concurrent edits or allocate from incomplete history.
6. Report archive ID/path, archived IDs, no-op IDs and remaining counts. Continue only an already
   authorized queue item; otherwise stop. No automatic product, provider or lifecycle changes.

#### Provider archive

Resolve each named existing provider, not a capture subset. There is no all-providers selector.
Archive its guide and every capture whole because later snapshots reuse earlier files. Every
instruction/result with a live row counts as active here, including terminal unarchived records.

1. Read the live record index, relevant manifests, selected guides/snapshots and dependent references.
   Refuse the entire run if any live record references a selected provider; report every blocker.
   Validate the selected providers and their evidence closure. No force/cleanup operation bypasses
   this dependency gate. An unfinished earlier archive (publication.md) blocks publication.
2. Search only the relevant repository consumers outside .agents/spectre/ for paths naming the
   selected provider roots. Report every match as a warning before mutation; consumers may break
   after the move. Archive never edits those product files or expands its source scope.
3. Record complete regular-file inventories, sizes and hashes; refuse symlinks, special files,
   unsafe paths or undeclared evidence. Choose a collision-safe archive ID as above. Copy whole
   unchanged directories under the batch's providers/<provider>/, verify them, and write the
   manifest below last: it is the commit point of the copy (publication.md).
4. Recheck eligibility, then remove only the verified originals. Change no live row, record,
   product file, unrelated provider or earlier archive. Verify inventories, affected references and
   preserved bytes.
5. Report archive ID/path, providers/capture ranges/file counts and external-consumer warnings.

A provider held only in archives is not selectable by capture/plan. Explicit preparation may
recreate the same logical provider at its original slug (§12); numbering continues above archived
maxima, and the first new live capture is a full baseline using no archived artifact owners.

### Archive manifest

ARCHIVE.md is created only by nonempty archiving and is immutable once written. Implementation
batches use:

```markdown
# SPECTRE archive <archive-id>

Archive-Version: v1
Archive-ID: <archive-id>
Created: YYYYMMDDTHHMMSSZ
Protocol-Version: 1.0.0
Kind: implementations
Storage-Mode: <flat|nested>
Scope: <sorted qualified record IDs>

## Archived implementations

### <Label> implementation status

Target: <target>
Path: <current target path at archiving>

| ID | Title | Instruction | State | Result | Evidence mode | Decision or status |
| --- | --- | --- | --- | --- | --- | --- |

## Record paths

| Original path | Archived file | SHA-256 |
| --- | --- | --- |
| `.agents/spectre/implementations/<record-file>` | [Record](implementations/<record-file>) | `<sha256>` |
```

Provider batches use:

```markdown
# SPECTRE archive <archive-id>

Archive-Version: v1
Archive-ID: <archive-id>
Created: YYYYMMDDTHHMMSSZ
Protocol-Version: 1.0.0
Kind: providers
Scope: <sorted provider IDs>

## Archived providers

| Provider | Captures | Original path | Archived guide | Files |
| --- | --- | --- | --- | --- |
| `<provider>` | `<first>`–`<last>` | `.agents/spectre/providers/<provider>/` | [Guide](providers/<provider>/PROVIDER.md) | <count> |
```

Populate only selected records/providers, ordered by target/number or provider slug. Preserve each
implementation row's values and link labels; only rebase Instruction/Result destinations to direct
batch-relative links. Preserve — for an absent optional result. Record paths has exactly one row
per moved instruction/result, with unique normalized original/destination paths and exact SHA-256.
Provider Files counts every regular moved file; Captures is its range, one number, or None. Path
is historical context, never a current-directory existence requirement on an archive.

The table format is canonical under §11. One batch contains implementations or providers, never
both. A manifest has no section for waiving defects; a failed selected-record check stops the
archive. A manifest written by another release is read under its own Archive-Version and
Protocol-Version; never rewrite a manifest into a newer schema.
