import { normalizeImagePath, useSite } from "@rspress/core/runtime"
import { Link } from "@rspress/core/theme-original"

/**
 * Rspress's nav title with the product name inside the logo box, as one unit: the XRAY wordmark and its ray (one image
 * per theme, Rspress's classes decide which shows), then `logoText` as text aligned to the box's bottom (theme.css).
 */
export function NavTitle() {
  const { site } = useSite()
  const { logo, logoText } = site
  const images = !logo
    ? null
    : typeof logo === "string"
      ? [{ src: logo, mod: "" }]
      : [{ src: logo.light, mod: " rp-nav__title__logo-image--light" }, { src: logo.dark, mod: " rp-nav__title__logo-image--dark" }]

  return (
    <div className="rp-nav__title">
      <Link href="/" className="rp-nav__title__link">
        <div className="rp-nav__title__logo">
          {images?.map(({ src, mod }) => (
            <img key={src} src={normalizeImagePath(src)} alt={logoText ? "XRAY" : site.title} className={`rspress-logo rp-nav__title__logo-image${mod}`} />
          ))}
          {logoText && <span className="rp-nav__title__suffix">{logoText}</span>}
        </div>
      </Link>
    </div>
  )
}
