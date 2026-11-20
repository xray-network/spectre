<!-- Generated from SPECTRE-PROTOCOL.md; do not edit. -->
Protocol-Version: 1.0.0
Source-SHA256: 5a90409736ecc8357b3a4e93530fffd94c8c008bcc3ed48a16351b450eb046a7

### Immovable evidence

Published capture directories, their files, and every record file keep their path, except that
archiving moves terminal records into `implementations/__archive/<archive-id>/<target>/` and whole
providers into `providers/__archive/<archive-id>/<provider>/`, byte for byte. Never rename, move, or
rewrite them otherwise, including to adopt a new naming scheme. The only content rewrite is an
explicit upgrade (§14), which brings live records and provider files to the current formats in place
and never changes an artifact file. Moving an owned source directory within the same installation
changes its target Path (references.md); that never moves evidence or record files.

Besides archiving, three operations move evidence or records, each human-ordered and each updating
every link, provider pin, inventory entry and SHA-256 that refers to a moved file, in `SPECTRE.md`
and every live record and provider file: `absorb` and `detach` (§9) move whole targets between
installations, and `Spectre override` (§9) moves anything else. A copy stays at the original path
only when the human asks for one. No lookup table redirects old paths.

### Archives

An archive is history. Its `ARCHIVE.md` keeps the implementation rows and provider subsections
that left `SPECTRE.md` with links to the archived files (§11). The archived files keep their bytes,
so digests and decision proofs stay valid. Moving deeper can leave relative links inside them
stale. Report such links as information and never rewrite an archived file to repair them.

A record or capture resolves by its qualified ID, searching `SPECTRE.md` and then every
`ARCHIVE.md` in the corresponding section. A provider guide resolves by provider slug. A pin
still verifies by its recorded hashes. Never rewrite a record to follow an archive. A live record that pins
an archived provider, or depends on an archived result that is missing or changed, is blocked until
it is revised; `sync` reports it. Archives are never edited by ordinary maintenance. Report missing or
changed historical files as information; never repair them or substitute another file.
