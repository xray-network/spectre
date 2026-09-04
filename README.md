# SPECTRE

**Specification · Planning · Evidence · Change · Traceability · Review · Execution**

SPECTRE is a Markdown-only protocol that connects a bounded implementation plan to its declared
evidence, source changes, validation, and final human decision.

## Published resources

- `https://wiki.xraynetwork.io/spectre/` — documentation
- `https://wiki.xraynetwork.io/spectre/SPECTRE-PROTOCOL.md` — current-release mirror
- `https://wiki.xraynetwork.io/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md` — immutable v2.0.0 protocol

## Install

Ask a coding agent:

```text
Read https://wiki.xraynetwork.io/spectre/protocol/v2.0.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v2.0.0 in this repository.
```

The pinned standard installs as `.spectre/SPECTRE-PROTOCOL.md`. Installation creates root
`SPECTRE.md` as the adopting project's implementation summary and sole lifecycle ledger.

## Repository layout

```text
.
├── SPECTRE-PROTOCOL.md          # current-release mirror
├── protocol/
│   └── v2.0.0/
│       ├── SPECTRE-PROTOCOL.md
│       └── MIGRATION.md
└── docs/
    ├── src/pages/public/        # generated release assets
    ├── rspress.config.ts
    └── wrangler.jsonc
```

`protocol/` is the canonical, immutable release source. Root `SPECTRE-PROTOCOL.md` mirrors the
latest release for convenient repository access. The documentation build rejects drift between
the mirror and latest release, then publishes both current and immutable raw assets. This source
repository does not install its own tracking structure.

## Documentation

```sh
cd docs
npm install
npm run dev
```

Build with `npm run build`; deploy the `wiki-spectre-docs` Cloudflare Worker with
`npm run deploy`.

## License

SPECTRE is available under the [MIT License](./LICENSE).
