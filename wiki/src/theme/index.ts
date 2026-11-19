import "./theme.css"
import { createElement, forwardRef, Fragment } from "react"
import { Link as DefaultLink, Layout as DefaultLayout, type LinkProps, type LayoutProps } from "@rspress/core/theme-original"
import { SectionTabs } from "./SectionTabs"
import pkg from "../../package.json"
import { NavTitle } from "./NavTitle"

// The wiki's version from its package.json (bumped by hand or by an agent on release), before the search box.

export function Layout(props: LayoutProps) {
  return createElement(DefaultLayout, {
    ...props,
    // The logo with the product name inside its box.
    navTitle: createElement(NavTitle),
    beforeNavMenu: createElement(Fragment, null, pkg.version ? createElement("span", { className: "wiki-version" }, `v${pkg.version}`) : null, props.beforeNavMenu),
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

// The theme switch's sun and moon (Rspress's SwitchAppearance takes IconSun and IconMoon from this theme): the
// XRAY/DESIGN kit's outline icons, Heroicons v2.2.0 (MIT, Copyright (c) Tailwind Labs, Inc.). The fill Rspress
// passes is ignored.
const outlineIcon = (body: string) => {
  const Icon = ({ className }: { className?: string }) =>
    createElement("svg", {
      className,
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
      dangerouslySetInnerHTML: { __html: body },
    })
  return Icon
}
export const IconSun = outlineIcon('<path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>')
export const IconMoon = outlineIcon('<path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>')
export { HeroArtwork } from "./hero/HeroArtwork"
export { HeroDiagram } from "./hero/HeroDiagram"
export { CopyPromptButton, installationPrompt } from "./CopyPromptButton"
