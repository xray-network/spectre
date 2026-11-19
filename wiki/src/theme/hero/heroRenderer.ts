import { createGrid, spacing, firstY } from "./heroGrid"
import { firstRaySymbol, raySymbol, strokeSymbol, symbolAt, symbolCount } from "./heroSymbols"
import { POINTER_REACH, SLOPE, createRay, pointerHalfWidth, rayFrame, rayHalfWidth, type Ray, type RayState } from "./heroRays"

const alphaEpsilon = 1 / 1024
const maxRays = 10

export function createHeroRenderer(canvas: HTMLCanvasElement, background: HTMLCanvasElement, hero: Element): () => void {
  const ctx = canvas.getContext("2d")
  const baseCtx = background.getContext("2d")
  const atlas = document.createElement("canvas")
  const atlasCtx = atlas.getContext("2d")
  if (!ctx || !baseCtx || !atlasCtx) return () => {}

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  let { columns, rows, points } = createGrid(0, 0)
  let hoverStrength = new Float32Array(points.length)
  let hoverTargets = new Float32Array(points.length)
  let rayStrength = new Float32Array(points.length)
  let rayDissolves = new Uint8Array(points.length)
  let turn = new Float32Array(points.length) // how far each cell's slash has turned toward the ray's lean, 0..1
  let lastAlpha = new Float32Array(points.length)
  let lastSprite = new Uint8Array(points.length)
  let pixelX = new Int32Array(points.length)
  let pixelY = new Int32Array(points.length)
  let frame = 0, lastPaint = 0, lastMove = 0
  let wakeTimer = 0, nextAmbientRay = 0
  const rays: Ray[] = []
  const rayState: RayState = { front: 0, topY: 0, headY: 0, envelope: 0, dissolving: false }
  let hasPointer = false
  let inView = false, disposed = false, hoverActive = false, hoverDirty = false, boundsDirty = false
  let width = 0, height = 0, pixelRatio = 1, tileSize = 1
  let minRow = 0, maxRow = -1, minColumn = 0, maxColumn = -1
  let mouseX = 0, mouseY = 0, left = 0, top = 0
  let neutral = "#767575", blue = "#1940ed"
  let spriteRatio = 0, spriteBlue = "", spriteNeutral = ""
  const canAnimate = () => !disposed && !reducedMotion.matches && !document.hidden && inView && width > 0 && height > 0

  const rebuildImages = () => {
    // Static marks are painted only on resize/theme changes, never copied per frame.
    baseCtx.setTransform(1, 0, 0, 1, 0, 0)
    baseCtx.clearRect(0, 0, background.width, background.height)
    baseCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    baseCtx.strokeStyle = neutral
    baseCtx.lineWidth = .75
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const point = points[row * columns + col]
        baseCtx.globalAlpha = point.visibility * .9
        strokeSymbol(baseCtx, 0, point.x, point.y)
      }
    }
    // Small, cached sprites replace path construction/rasterization during animation.
    if (spriteRatio !== pixelRatio || spriteBlue !== blue || spriteNeutral !== neutral) {
      tileSize = Math.ceil(10 * pixelRatio) + 4
      atlas.width = tileSize * symbolCount
      atlas.height = tileSize * 2
      atlasCtx.lineWidth = 1 * pixelRatio
      atlasCtx.strokeStyle = blue
      for (let i = 0; i < symbolCount; i++) {
        // The ray's glyph is drawn heavier, so a ray reads as one stroke.
        atlasCtx.lineWidth = (i >= firstRaySymbol ? 1.8 : 1) * pixelRatio
        strokeSymbol(atlasCtx, i, tileSize * (i + .5), tileSize / 2, pixelRatio)
      }
      atlasCtx.strokeStyle = neutral
      atlasCtx.lineWidth = .75 * pixelRatio
      strokeSymbol(atlasCtx, 0, tileSize / 2, tileSize * 1.5, pixelRatio)
      spriteRatio = pixelRatio
      spriteBlue = blue
      spriteNeutral = neutral
    }
    for (let i = 0; i < points.length; i++) {
      pixelX[i] = Math.round(points[i].x * pixelRatio - tileSize / 2)
      pixelY[i] = Math.round(points[i].y * pixelRatio - tileSize / 2)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
    lastSprite.fill(0)
  }
  const showRestingMark = (i: number, visible: boolean) => {
    const x = pixelX[i] / pixelRatio, y = pixelY[i] / pixelRatio, size = tileSize / pixelRatio
    baseCtx.clearRect(x, y, size, size)
    if (visible) {
      baseCtx.globalAlpha = points[i].visibility * .9
      baseCtx.drawImage(atlas, 0, tileSize, tileSize, tileSize, x, y, size, size)
    }
  }
  const suspend = () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(wakeTimer)
    wakeTimer = nextAmbientRay = 0
    rays.length = 0
    rayStrength.fill(0)
    frame = 0
    hasPointer = false
    hoverActive = hoverDirty = false
    hoverStrength.fill(0)
    turn.fill(0)
    hoverTargets.fill(0)
    lastPaint = 0
    for (let i = 0; i < points.length; i++) if (lastSprite[i] > 0) showRestingMark(i, true)
    lastSprite.fill(0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
  }
  const wake = () => {
    window.clearTimeout(wakeTimer)
    wakeTimer = 0
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick)
  }
  const syncPlayback = () => { if (!canAnimate()) suspend(); else wake() }

  const pruneRays = (now: number) => {
    for (let i = rays.length - 1; i >= 0; i--) {
      if (now - rays[i].start >= rays[i].duration) rays.splice(i, 1)
    }
  }

  const tick = (now: number) => {
    frame = 0
    if (!canAnimate()) { suspend(); return }
    const elapsed = lastPaint ? Math.min(now - lastPaint, 50) : 16.67
    const rise = 1 - Math.exp(-elapsed / 90)
    const fade = 1 - Math.exp(-elapsed / 220)
    const turning = 1 - Math.exp(-elapsed / 110)
    lastPaint = now
    if (hoverActive && now - lastMove > 220) {
      hoverActive = false
      hoverDirty = true
    }
    if (boundsDirty && hoverActive) {
      const rect = canvas.getBoundingClientRect()
      left = rect.left
      top = rect.top
      boundsDirty = false
      hoverDirty = true
    }
    // The pointer's ray: a short band along the ray's lean through the pointer, recomputed only when it moves.
    if (hoverDirty) {
      hoverTargets.fill(0)
      if (hoverActive) {
        const x = mouseX - left
        const y = mouseY - top
        const through = x + SLOPE * y
        const r0 = Math.max(minRow, Math.ceil((y - POINTER_REACH - firstY) / spacing))
        const r1 = Math.min(maxRow, Math.floor((y + POINTER_REACH - firstY) / spacing))
        for (let row = r0; row <= r1; row++) {
          const rowY = firstY + row * spacing
          const half = pointerHalfWidth(rowY - y)
          if (half <= 0) continue
          const center = through - SLOPE * rowY
          const c0 = Math.max(minColumn, Math.ceil((center - half) / spacing))
          const c1 = Math.min(maxColumn, Math.floor((center + half) / spacing))
          for (let col = c0; col <= c1; col++) {
            const i = row * columns + col
            const band = 1 - Math.abs(points[i].x - center) / half
            if (band > 0) hoverTargets[i] = band * band * (3 - 2 * band)
          }
        }
      }
      hoverDirty = false
    }
    pruneRays(now)
    if (now >= nextAmbientRay && rays.length < maxRays) {
      const ray = createRay(now, width, height)
      rays.push(ray)
      nextAmbientRay = now + ray.duration + 1400 + Math.random() * 1600
    }
    rayStrength.fill(0)
    for (const ray of rays) {
      if (!rayFrame(ray, now, rayState)) continue
      for (let row = minRow; row <= maxRow; row++) {
        const start = row * columns
        const y = points[start].y
        const half = rayHalfWidth(ray, rayState, y)
        if (half <= 0) continue
        const center = rayState.front - SLOPE * y
        // Visit only the columns the ray crosses on this row.
        const c0 = Math.max(minColumn, Math.ceil((center - half) / spacing))
        const c1 = Math.min(maxColumn, Math.floor((center + half) / spacing))
        for (let col = c0; col <= c1; col++) {
          const i = start + col
          const point = points[i]
          const band = Math.max(0, 1 - Math.abs(point.x - center) / half)
          // Lit across the whole hero, a little softer where the resting grid fades out.
          const strength = band * band * (3 - 2 * band) * rayState.envelope * (.65 + .35 * point.visibility)
          // In overlaps, the brightest ray controls both the cell's intensity and its glyph.
          if (strength > rayStrength[i]) {
            rayStrength[i] = strength
            rayDissolves[i] = Number(rayState.dissolving)
          }
        }
      }
    }
    let settling = false
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const i = row * columns + col
        const difference = hoverTargets[i] - hoverStrength[i]
        if (Math.abs(difference) < .001) hoverStrength[i] = hoverTargets[i]
        else { hoverStrength[i] += difference * (difference > 0 ? rise : fade); settling = true }
        const active = hoverStrength[i]
        // Each slash eases toward its target turn (its strength in a ray), so rotation is smooth frame to frame. Rays
        // dissolve into random symbols as they fade; the pointer's ray just fades, its slashes turning back.
        const turnTarget = Math.max(rayStrength[i], active)
        const turnDifference = turnTarget - turn[i]
        if (Math.abs(turnDifference) < .004) turn[i] = turnTarget
        else { turn[i] += turnDifference * turning; settling = true }
        const pointerValue = active * (.55 + active * .45)
        const value = Math.max(pointerValue, rayStrength[i])
        const alpha = value < .002 ? 0 : value * (2 - value)
        const sprite = alpha > 0
          ? (rayStrength[i] > pointerValue && rayDissolves[i] ? symbolAt(i, now) : raySymbol(turn[i]))
          : 0
        if (alpha === lastAlpha[i] || (alpha > 0 && lastAlpha[i] > 0 && Math.abs(alpha - lastAlpha[i]) < alphaEpsilon)) {
          if (sprite === lastSprite[i]) continue
        }
        // Hide the resting slash while a symbol replaces it; restore from the cache.
        if ((sprite > 0) !== (lastSprite[i] > 0)) showRestingMark(i, sprite === 0)
        // Symbol tiles never overlap. Clear only changed tiles, not the full hero surface.
        if (lastAlpha[i] > 0) ctx.clearRect(pixelX[i], pixelY[i], tileSize, tileSize)
        if (alpha > 0) {
          ctx.globalAlpha = alpha
          ctx.drawImage(atlas, sprite * tileSize, 0, tileSize, tileSize, pixelX[i], pixelY[i], tileSize, tileSize)
        }
        lastAlpha[i] = alpha
        lastSprite[i] = sprite
      }
    }
    if (rays.length || hoverActive || settling) frame = requestAnimationFrame(tick)
    else {
      lastPaint = 0
      wakeTimer = window.setTimeout(() => { wakeTimer = 0; wake() }, Math.max(1, nextAmbientRay - now))
    }
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    left = rect.left
    top = rect.top
    boundsDirty = false
    hoverDirty = true
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    if (width === rect.width && height === rect.height && ratio === pixelRatio) return
    width = rect.width
    height = rect.height
    pixelRatio = ratio
    canvas.width = background.width = Math.max(1, Math.round(width * pixelRatio))
    canvas.height = background.height = Math.max(1, Math.round(height * pixelRatio))
    const grid = createGrid(width, height)
    columns = grid.columns
    rows = grid.rows
    points = grid.points
    hoverStrength = new Float32Array(points.length)
    hoverTargets = new Float32Array(points.length)
    rayStrength = new Float32Array(points.length)
    rayDissolves = new Uint8Array(points.length)
    turn = new Float32Array(points.length)
    lastAlpha = new Float32Array(points.length)
    lastSprite = new Uint8Array(points.length)
    pixelX = new Int32Array(points.length)
    pixelY = new Int32Array(points.length)
    minColumn = minRow = 0
    maxColumn = columns - 1
    maxRow = rows - 1
    for (const ray of rays) ray.height = height
    rebuildImages()
    syncPlayback()
  }
  const readTheme = () => {
    const style = getComputedStyle(canvas)
    const nextNeutral = style.getPropertyValue("--xr-fg-muted").trim() || neutral
    const nextBlue = style.getPropertyValue("--spectre-symbol-color").trim() || style.getPropertyValue("--xr-link").trim() || blue
    if (neutral === nextNeutral && blue === nextBlue) return
    neutral = nextNeutral
    blue = nextBlue
    rebuildImages()
    syncPlayback()
  }
  const onMove = (event: Event) => {
    const { clientX, clientY, isPrimary } = event as PointerEvent
    if (!canAnimate() || isPrimary === false) return
    if (hasPointer && mouseX === clientX && mouseY === clientY) return
    hasPointer = true
    lastMove = performance.now()
    mouseX = clientX
    mouseY = clientY
    hoverActive = hoverDirty = true
    wake()
  }
  const onLeave = (event?: Event) => {
    if ((event as PointerEvent | undefined)?.isPrimary === false) return
    hasPointer = false
    hoverActive = false
    hoverDirty = true
    if (lastPaint || frame) wake()
  }
  const onContact = (event: Event) => {
    if ((event as PointerEvent).pointerType !== "mouse") onMove(event)
  }
  // Clicks add rays without changing the ambient schedule or interrupting a ray in flight.
  const onLaunch = (event: Event) => {
    const { clientX, clientY, target } = event as MouseEvent
    if (!canAnimate() || (target as Element | null)?.closest?.("a, button")) return
    const now = performance.now()
    pruneRays(now)
    if (rays.length >= maxRays) return
    const rect = canvas.getBoundingClientRect()
    // Start on a grid mark so even a click between marks lights up on the first frame.
    const col = Math.max(minColumn, Math.min(maxColumn, Math.round((clientX - rect.left) / spacing)))
    const row = Math.max(minRow, Math.min(maxRow, Math.round((clientY - rect.top - firstY) / spacing)))
    const point = points[row * columns + col]
    if (!point) return
    rays.push(createRay(now, width, height, point))
    wake()
  }
  const onEndContact = (event: Event) => {
    const { isPrimary, pointerType } = event as PointerEvent
    if (isPrimary !== false && pointerType !== "mouse") onLeave()
  }
  const onScroll = () => { boundsDirty = true; onLeave() }
  const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback() })
  const sizeObserver = new ResizeObserver(resize)
  const themeObserver = new MutationObserver(readTheme)
  intersection.observe(hero)
  sizeObserver.observe(canvas)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
  // Passive pointer events support touch/pen without blocking native scrolling.
  hero.addEventListener("pointerdown", onContact, { passive: true })
  hero.addEventListener("pointermove", onMove, { passive: true })
  hero.addEventListener("pointerup", onEndContact, { passive: true })
  hero.addEventListener("pointercancel", onEndContact, { passive: true })
  hero.addEventListener("pointerleave", onLeave)
  hero.addEventListener("click", onLaunch)
  reducedMotion.addEventListener("change", syncPlayback)
  document.addEventListener("visibilitychange", syncPlayback)
  window.addEventListener("resize", resize)
  window.addEventListener("scroll", onScroll, true)
  resize()
  readTheme()
  return () => {
    disposed = true
    suspend()
    intersection.disconnect()
    sizeObserver.disconnect()
    themeObserver.disconnect()
    hero.removeEventListener("pointermove", onMove)
    hero.removeEventListener("pointerdown", onContact)
    hero.removeEventListener("pointerup", onEndContact)
    hero.removeEventListener("pointercancel", onEndContact)
    hero.removeEventListener("pointerleave", onLeave)
    hero.removeEventListener("click", onLaunch)
    reducedMotion.removeEventListener("change", syncPlayback)
    document.removeEventListener("visibilitychange", syncPlayback)
    window.removeEventListener("resize", resize)
    window.removeEventListener("scroll", onScroll, true)
    atlas.width = atlas.height = 0
  }
}
