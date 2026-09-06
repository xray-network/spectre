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

The theme's local palette in `src/theme/tokens.css` comes from
`xray-app/packages/frontend/app/shared/design-system/tokens.ts`, with neutral roles informed by
`antd-theme.ts`. It requires no access to that checkout at build time. The
[XRAY Design reference](https://wiki.xraynetwork.io/design/) guides the capsule controls, 20px
panels, surface steps, and shadow-free styling. Small dark-mode links use source `blue-300` for
contrast; primary actions retain `blue-500` in both themes. Navigation uses the native Rspress
sidebar and mobile menu.
