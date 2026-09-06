# Command resolution scenarios

Behavioral review cases for the Markdown protocol and its installed command skill. These are
specification scenarios, not an executable command parser. Evaluate each case independently.

Fixture: nested storage with `api` (the backend service) and `web` (the frontend app).
All records are valid, timestamps are UTC, and no conversation target is established unless stated.

| Record | Title | State | Location | Instruction Created |
| --- | --- | --- | --- | --- |
| api/0002 | Health endpoint | PLANNED | ACTIVE | 20260901T090000Z |
| api/0003 | Login timeout | REVIEW | ACTIVE | 20260902T090000Z |
| api/0004 | Login audit | ACCEPTED | archive A | 20260903T090000Z |
| web/0002 | Login form | REVIEW | ACTIVE | 20260904T090000Z |

One provider contract, `payments`, describes the payment gateway. Each mutating case assumes all
other workflow prerequisites pass. “Ask” and “refuse” both mean no file or lifecycle mutation.

| Invocation or situation | Expected resolution and boundary |
| --- | --- |
| `implement the health endpoint` without an invocation | SPECTRE stays inactive; no operation-selection question. |
| A quoted `/spectre reject last implementation` example | SPECTRE stays inactive. |
| `/spectre implement api/0002` | Report `api/0002`, implement only it, stop in REVIEW. |
| `/spectre implement the health endpoint plan` | Same identity and boundary as the exact ID. |
| `/spectre implement api/0099` | Refuse the missing exact ID; never substitute another record. |
| `/spectre status 0002` | Ask: `api/0002` and `web/0002` both exist. |
| `/spectre status the login change` | Ask: several login records plausibly match. |
| `/spectre status last implementation` | Resolve `web/0002` using the unique latest Created timestamp. |
| `/spectre reject latest backend implementation: incomplete checks` | Resolve archived `api/0004`, then refuse; do not choose `api/0003`. |
| `/spectre reject latest REVIEW implementation in the backend: incomplete checks` | The explicitly requested state filter selects `api/0003`; record only its rejection decision. |
| `/spectre reject last implementation` | Resolve `web/0002`; ask for human proof. No decision yet. |
| Human then replies `the keyboard checks are missing` | Recheck the bound `web/0002`; record the supplied rejection proof under the pending invocation. |
| A newer record appears while that proof is pending | Ask whether the human still means the bound record; do not silently retarget “last.” |
| `/spectre reject the login timeout because the timeout check is missing` | Resolve `api/0003`; preserve the human's reason and record only the rejection decision. |
| `/spectre accept it: reviewed the diff and checks`, after an actual report identifying `api/0003` | Verify and accept `api/0003`; no extra identity confirmation. |
| Same command after only a quoted example naming `api/0003` | Ask what “it” refers to; the quote creates no target context. |
| `/spectre status last implemented`, with no completion chronology | Ask; Created values and numeric IDs do not prove completion order. |
| `/spectre status last implementation`, with equal latest timestamps across targets | Ask; do not use target ID size, row position, or file modification times as a tie-break. |
| `/spectre plan the backend service: add a readiness endpoint` | Resolve `api` through repository discovery; create only its next plan. |
| `/spectre revise the login timeout: add the missing timeout check` | Resolve `api/0003`; revise within its instruction and stop in REVIEW. |
| `/spectre cancel the health endpoint plan: no longer needed` | Resolve `api/0002`; record cancellation only. |
| `/spectre list the frontend app REVIEW` | Read-only filter to `web` and REVIEW; no record-content inspection. |
| `/spectre list the backend service ACCEPTED --archived` | Read-only archived listing includes `api/0004`. |
| `/spectre validate the login audit` | Validate archived `api/0004`; do not restore it. |
| `/spectre archive the backend service` | Resolve target `api`; no eligible active terminal rows, so no mutation. |
| `/spectre archive the login form` | Ask about target scope; do not expand one record to the whole `web` target. |
| `/spectre archive unknown package` | Ask for a valid target; never archive all targets as a fallback. |
| `/spectre capture the payment gateway` | Resolve `payments`; capture only under that existing contract. |
| `/spectre help reject` | Explain rejection syntax, selectors, human proof, and REVIEW boundary. |
| `/spectre implement and accept the health endpoint` | Refuse combined operations; no implementation or acceptance. |

Also verify default scope (`list`, `archive`, `validate`, `help`), quoted state-like target names,
duplicate IDs or archive locations, missing provider contracts, unchanged canonical schemas, and
the same semantics with the Codex `$spectre` invocation.
