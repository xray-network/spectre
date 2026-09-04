# SPECTRE documentation

The documentation site uses the same Rspress and Wrangler layout as the XRAY JS documentation.

```sh
npm install --workspaces=false
npm run dev --workspaces=false
```

The pre-build publisher validates every version under `../protocol/`, verifies that root
`../SPECTRE-PROTOCOL.md` is byte-for-byte identical to the latest release, and publishes both the
current mirror and immutable raw assets under `src/pages/public/`. Build with
`npm run build --workspaces=false` and deploy the `wiki-spectre-docs` Cloudflare Worker with
`npm run deploy --workspaces=false`.
