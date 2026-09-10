import { defineConfig } from "@rspress/core"
import { remarkOutlineHeadings } from "./plugins/remark-outline-headings"
import { documentationSections } from "./src/navigation"

export default defineConfig({
  root: "src/pages",
  outDir: "build/spectre",
  base: "/spectre/",
  siteOrigin: "https://wiki.xraynetwork.io",
  icon: "https://cdn.xraynetwork.io/favicon.png",
  themeDir: "src/theme",
  title: "SPECTRE",
  logo: "/xray-blue.svg",
  logoText: "SPECTRE",
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
  markdown: { remarkPlugins: [remarkOutlineHeadings] },
  themeConfig: {
    fallbackHeadingTitle: false,
    darkMode: "dark",
    enableAppearanceAnimation: false,
    nav: [
      {
        text: "Back to Wiki",
        link: "https://wiki.xraynetwork.io",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14"/></svg>',
        position: "left"
      },
      {
        text: "GitHub",
        link: "https://github.com/xray-network/spectre",
        position: "right"
      }
    ],
    sidebar: Object.fromEntries(
      documentationSections.flatMap(({ paths, sidebar }) =>
        paths.map(path => [path, sidebar])
      )
    )
  }
})
