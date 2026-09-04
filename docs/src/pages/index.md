---
pageType: home
hero:
  name: SPECTRE
  text: Every change leaves a trace.
  tagline: A Markdown-only protocol connecting plans, evidence, implementation, validation, and final human decisions.
  actions:
    - theme: brand
      text: Install SPECTRE 2.0.0
      link: /installation
    - theme: alt
      text: Read the protocol
      link: /protocol/
features:
  - title: Bound the work
    details: Create one implementation-ready instruction before product source changes.
  - title: Record reality
    details: Capture inputs, changed paths, validation, deviations, and the exported change contract.
  - title: Keep humans final
    details: Only a human can accept, reject, or cancel work with explicit decision proof.
---

## Specification · Planning · Evidence · Change · Traceability · Review · Execution

SPECTRE keeps durable implementation history inside the repository. The installed protocol lives
at `.spectre/SPECTRE-PROTOCOL.md`; the project's root `SPECTRE.md` summarizes every implementation
and is the sole lifecycle ledger.

```text
PLANNED ── implement + validate ──> REVIEW ── human decision ──> ACCEPTED
                                           └── human decision ──> REJECTED
```

[Start with installation](/installation) or download the
<a href="/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md">immutable SPECTRE 2.0.0 protocol</a>.
