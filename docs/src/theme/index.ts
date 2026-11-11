import "./theme.css"
import { createElement, forwardRef, Fragment } from "react"
import { Link as DefaultLink, Layout as DefaultLayout, type LinkProps, type LayoutProps } from "@rspress/core/theme-original"
import { SectionTabs } from "./SectionTabs"

export function Layout(props: LayoutProps) {
  return createElement(DefaultLayout, {
    ...props,
    afterNav: createElement(Fragment, null, createElement(SectionTabs), props.afterNav)
  })
}

// Native navigation opens external URLs in a new tab; the Wiki is our parent site.
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) =>
  createElement(DefaultLink, {
    ...props,
    ref,
    ...(props.href === "https://wiki.xraynetwork.io" ? { target: "_self" } : {})
  })
)
Link.displayName = "Link"

export * from "@rspress/core/theme-original"
export { HeroArtwork } from "./hero/HeroArtwork"
export { HeroDiagram } from "./hero/HeroDiagram"
export { CopyPromptButton, installationPrompt } from "./CopyPromptButton"
