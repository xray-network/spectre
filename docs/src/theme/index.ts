import "./theme.css"
import { createElement } from "react"
import { Layout as DefaultLayout, type LayoutProps } from "@rspress/core/theme-original"

export function Layout(props: LayoutProps) {
  return createElement(DefaultLayout, {
    ...props,
    afterNavTitle: createElement(
      "a",
      { href: "https://wiki.xraynetwork.io", className: "spectre-back-to-wiki" },
      "Back to Wiki"
    )
  })
}

export * from "@rspress/core/theme-original"
