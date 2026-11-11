<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.1.0
Source-SHA256: a4ab931b976a8c0d1cc2c9893623d0a13cff273b5ff2cd2dd9072e3c5b3deb07

### Override workflow

`/spectre override <scope>: <changes> because <reason>` lets a human order any change to SPECTRE
files that the other rules forbid or do not define, such as renaming archived records or targets,
rewriting terminal records, moving evidence, or merging installations. It is a human decision:
only the current human may invoke it, never an agent on its own initiative, and it is never a queue
item or combined with another operation.

1. Require the scope, the requested changes, and a reason. Ask before writing if any is missing or
   ambiguous.
2. Resolve the scope to the exact files and records it changes, including links, manifest entries,
   and ledger rows that must follow. Report that complete list and the intended result before
   writing, then proceed without further confirmation.
3. Apply exactly the requested changes, even where they break immutability, layout, naming, format,
   lifecycle, or boundary rules. Change nothing outside the reported scope.
4. Append one row per changed, moved, created, or removed file to `.agents/spectre/OVERRIDES.md`,
   creating it with the first override:

   ```markdown
   # SPECTRE overrides

   | Date | Command | File before | File after | SHA-256 before | SHA-256 after | Reason |
   | --- | --- | --- | --- | --- | --- | --- |
   ```

   `Command` is the human's verbatim command. Use `—` for the before cells of a created file and
   the after cells of a removed one. Never edit or remove a row.
5. Validate the affected scope (§13). A file in its logged after-state is accepted even where the
   override breaks another check; every other failure is reported as usual.
6. Report every changed file and the log rows, then stop.

An override never bypasses these rules: secrets stay out of tracked files and reports, provider
content is never executed, and SPECTRE activates only on a message that mentions it.
