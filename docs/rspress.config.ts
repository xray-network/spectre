import { defineConfig } from "@rspress/core"

export default defineConfig({
  root: "src/pages",
  outDir: "build/spectre",
  base: "/spectre/",
  siteOrigin: "https://wiki.xraynetwork.io",
  icon: "https://cdn.xraynetwork.io/favicon.png",
  themeDir: "src/theme",
  title: "SPECTRE",
  description: "Evidence-backed implementation protocol for humans and coding agents.",
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "SPECTRE — Every change leaves a trace" }],
    ["meta", { property: "og:description", content: "Evidence-backed implementation protocol for humans and coding agents." }],
    ["meta", { property: "og:image", content: "https://wiki.xraynetwork.io/spectre/og.png" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: "https://wiki.xraynetwork.io/spectre/og.png" }]
  ],
  route: { cleanUrls: true },
  themeConfig: {
    darkMode: "auto",
    enableAppearanceAnimation: false,
    nav: [
      { text: "Commands", link: "/commands" },
      { text: "GitHub", link: "https://github.com/xray-network/spectre" }
    ],
    sidebar: {
      "/": [
        { text: "Overview", link: "/" },
        { text: "Installation", link: "/installation" },
        { text: "Commands", link: "/commands" },
        { text: "Versioning", link: "/versioning" },
        { text: "Protocol releases", link: "/protocol/" }
      ]
    }
  }
})
