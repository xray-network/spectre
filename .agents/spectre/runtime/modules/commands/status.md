<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Runtime-Version: 2.3.0
Source-SHA256: 2b39ac38b84a9fb53a675af760def170d9840f43b4748d51282509890212386e

`status` searches both the active ledger and archive manifests. It reports the preserved state,
decision proof, and current record links, including archive ID when applicable. Refuse duplicate
IDs or ambiguous locations rather than choosing one. For an archived record, report missing files,
broken links, or changed bytes as information; archives are kept as is.
Resolve archived references under §9. Status never restores an archived record to the active ledger.

For `/spectre status <record>`, read the resolved row, complete instruction, and result when present.
Report canonical ID, title, state, evidence mode, result availability, human decision proof, and
usable current record links/location. Change no files or lifecycle data.
