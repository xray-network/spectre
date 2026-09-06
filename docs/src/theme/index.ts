import "./theme.css"
import { createElement, forwardRef } from "react"
import { Link as DefaultLink, type LinkProps } from "@rspress/core/theme-original"

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
