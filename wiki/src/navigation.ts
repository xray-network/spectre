import type { Sidebar } from "@rspress/core"

// A single section hides the tabs; each additional section gets its own menu.
export const documentationSections = [
  {
    text: "Docs",
    href: "/",
    paths: ["/", "/installation", "/concepts", "/commands", "/example", "/versioning", "/protocol"],
    icon: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
    sidebar: [
      { sectionHeaderText: "Get started" },
      { text: "Overview", link: "/" },
      { text: "Installation", link: "/installation" },
      { text: "Core concepts", link: "/concepts" },
      { sectionHeaderText: "Reference" },
      { text: "Commands", link: "/commands" },
      { text: "Example repository", link: "/example" },
      { text: "Versioning", link: "/versioning" },
      { text: "Releases", link: "/protocol/" },
    ]
  }
] satisfies { text: string; href: string; paths: string[]; icon: string; sidebar: Sidebar[string] }[]
