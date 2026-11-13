<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 1.0.0
Source-SHA256: fde9185b15eff04d2b0e301a91c8dffbb9f633b6a8b76fc5064ff6d67057d590

### Override workflow

`/spectre override <scope>: <changes> because <reason>` lets a human order any change to SPECTRE
files that the other rules forbid or do not define, such as renaming historical record/target IDs,
rewriting terminal records, moving evidence, or merging installations. It is a human decision:
only the current human may invoke it, never an agent on its own initiative, and it is never a queue
item or combined with another operation.

1. Require the scope, the requested changes, and a reason. Ask before writing if any is missing or
   ambiguous.
2. Resolve the scope to the exact files and records it changes, including links, manifest entries,
   and ledger rows that must follow. Report that complete list and the intended result before
   writing, then proceed without further confirmation.
3. Apply exactly the requested changes, even where they break immutability, layout, naming, format,
   lifecycle, or boundary rules. The human's decision is the authority for them.
4. In the same scope, bring every dependent active record in line with the new bytes and paths:
   provider pins and inventories, ledger rows, and links that point at moved or renamed files.
   Archives are kept as is and need no update. The installation must validate on its own files afterwards;
   no log excuses a check. Change nothing outside the reported scope.
5. Append one row per changed, moved, created, or removed file to `.agents/spectre/logs/OVERRIDES.md`.
   When `logs/` is absent, create it with a `.gitignore` whose single line is `*`, so nothing in it
   is ever committed, then create the log file:

   ```markdown
   # SPECTRE overrides

   | Date | Command | File before | File after | SHA-256 before | SHA-256 after | Reason |
   | --- | --- | --- | --- | --- | --- | --- |
   ```

   `Command` is the human's verbatim command. Use `—` for the before cells of a created file and
   the after cells of a removed one. The log is informational only: no check, reference, or command
   reads it, and a human may edit, trim, or delete `logs/` at any time. Git history is the durable
   audit trail of overrides.
6. Validate the affected scope (§13) as usual. When a check still fails because the requested change
   itself breaks a rule that no dependent update can satisfy, report that check and the human's
   options (another override, a revision, or leaving it failing); later operations stop on it like
   any other failure.
7. Report every changed file and the log rows. Because `logs/` is not committed, also propose a
   commit message that carries the decision into Git history: subject
   `SPECTRE override <scope>: <changes>`, body `Reason: <reason>` and the human's verbatim command.
   Do not commit unless the human asks. Then stop.

An override never bypasses these rules: secrets stay out of tracked files and reports, provider
content is never executed, and only a current-human explicitly scoped override authorizes the exception. A missing
name in unrelated conversation never authorizes an override. Follow publication.md where it applies;
the informational override log is never a recovery source.
