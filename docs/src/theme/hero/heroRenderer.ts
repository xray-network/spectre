import { createGrid, spacing, firstY } from "./heroGrid"
import { createWave, prepareWave, waveFrame, type PreparedWave } from "./heroWaves"

const spriteCount = 17
const alphaEpsilon = 1 / 1024

export function createHeroRenderer(canvas: HTMLCanvasElement, background: HTMLCanvasElement, hero: Element): () => void {
  const ctx = canvas.getContext("2d")
  const baseCtx = background.getContext("2d")
  const atlas = document.createElement("canvas")
  const atlasCtx = atlas.getContext("2d")
  if (!ctx || !baseCtx || !atlasCtx) return () => {}

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
  let { columns, rows, points } = createGrid(0, 0)
  let ambient = new Float32Array(points.length)
  let hoverStrength = new Float32Array(points.length)
  let hoverTargets = new Float32Array(points.length)
  let lastAlpha = new Float32Array(points.length)
  let lastSprite = new Uint8Array(points.length)
  let pixelX = new Int32Array(points.length)
  let pixelY = new Int32Array(points.length)
  const waves: PreparedWave[] = []
  const state = { front: 0, envelope: 0 }
  let frame = 0, wakeTimer = 0, nextAmbient = 0, lastPaint = 0
  let inView = false, disposed = false, hoverActive = false, hoverDirty = false, boundsDirty = false
  let width = 0, height = 0, pixelRatio = 1, tileSize = 1
  let minRow = 0, maxRow = -1, minColumn = 0, maxColumn = -1
  let mouseX = 0, mouseY = 0, left = 0, top = 0
  let neutral = "#55556d", blue = "#1940ed"
  let spriteRatio = 0, spriteBlue = ""
  const canAnimate = () => !disposed && !reducedMotion.matches && !document.hidden && inView && width > 0 && height > 0

  const fillDot = (context: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }
  const rebuildImages = () => {
    // Static marks are painted only on resize/theme changes, never copied per frame.
    baseCtx.setTransform(1, 0, 0, 1, 0, 0)
    baseCtx.clearRect(0, 0, background.width, background.height)
    baseCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    baseCtx.fillStyle = neutral
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const point = points[row * columns + col]
        baseCtx.globalAlpha = point.visibility * .28
        fillDot(baseCtx, point.x, point.y, 1)
      }
    }
    // Small, cached sprites replace path construction/rasterization during animation.
    if (spriteRatio !== pixelRatio || spriteBlue !== blue) {
      tileSize = Math.ceil(2.6 * pixelRatio) + 4
      atlas.width = tileSize * spriteCount
      atlas.height = tileSize
      atlasCtx.fillStyle = blue
      for (let i = 0; i < spriteCount; i++) {
        const strength = i / (spriteCount - 1)
        fillDot(atlasCtx, tileSize * (i + .5), tileSize / 2, (1 + strength * .3) * pixelRatio)
      }
      spriteRatio = pixelRatio
      spriteBlue = blue
    }
    for (let i = 0; i < points.length; i++) {
      pixelX[i] = Math.round(points[i].x * pixelRatio - tileSize / 2)
      pixelY[i] = Math.round(points[i].y * pixelRatio - tileSize / 2)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
    lastSprite.fill(0)
  }
  const suspend = () => {
    cancelAnimationFrame(frame)
    window.clearTimeout(wakeTimer)
    frame = wakeTimer = 0
    waves.length = 0
    hoverActive = hoverDirty = false
    hoverStrength.fill(0)
    hoverTargets.fill(0)
    lastPaint = nextAmbient = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastAlpha.fill(0)
  }
  const wake = () => {
    window.clearTimeout(wakeTimer)
    wakeTimer = 0
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick)
  }
  const syncPlayback = () => { if (canAnimate()) wake(); else suspend() }

  const tick = (now: number) => {
    frame = 0
    if (!canAnimate()) { suspend(); return }
    const blend = 1 - Math.exp(-(lastPaint ? Math.min(now - lastPaint, 50) : 16.67) / 90)
    lastPaint = now
    if (boundsDirty && hoverActive) {
      const rect = canvas.getBoundingClientRect()
      left = rect.left
      top = rect.top
      boundsDirty = false
      hoverDirty = true
    }
    // Distance calculations only happen when the pointer moves, within its 100-unit radius.
    if (hoverDirty) {
      hoverTargets.fill(0)
      if (hoverActive) {
        const x = mouseX - left
        const y = mouseY - top
        const r0 = Math.max(minRow, Math.ceil((y - 100 - firstY) / spacing))
        const r1 = Math.min(maxRow, Math.floor((y + 100 - firstY) / spacing))
        const c0 = Math.max(minColumn, Math.ceil((x - 100) / spacing))
        const c1 = Math.min(maxColumn, Math.floor((x + 100) / spacing))
        for (let row = r0; row <= r1; row++) {
          for (let col = c0; col <= c1; col++) {
            const i = row * columns + col
            const squared = (points[i].x - x) ** 2 + (points[i].y - y) ** 2
            if (squared >= 10000) continue
            const proximity = 1 - Math.sqrt(squared) / 100
            hoverTargets[i] = proximity * proximity * (3 - 2 * proximity)
          }
        }
      }
      hoverDirty = false
    }
    // Compact the existing pool in place rather than allocating a new array every frame.
    let alive = 0
    for (let i = 0; i < waves.length; i++) if (now < waves[i].start + waves[i].duration) waves[alive++] = waves[i]
    waves.length = alive
    if (now >= nextAmbient) {
      waves.push(prepareWave(createWave(now, width), points))
      nextAmbient = now + 2800 + Math.random() * 2400
    }
    ambient.fill(0)
    for (let w = 0; w < waves.length; w++) {
      const wave = waves[w]
      if (!waveFrame(wave, now, state)) continue
      const inverseWidth = 1 / wave.width
      for (let row = minRow; row <= maxRow; row++) {
        const start = row * columns
        const offset = wave.distances[start]
        // Within a row the wave distance is monotonic, so skip every untouched column.
        const c0 = Math.max(minColumn, Math.ceil((state.front - wave.width - offset) / spacing))
        const c1 = Math.min(maxColumn, Math.floor((state.front + wave.width - offset) / spacing))
        for (let col = c0; col <= c1; col++) {
          const i = start + col
          const band = Math.max(0, 1 - Math.abs(wave.distances[i] - state.front) * inverseWidth)
          const value = band * band * (3 - 2 * band) * state.envelope
          if (value > ambient[i]) ambient[i] = value
        }
      }
    }
    let settling = false
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minColumn; col <= maxColumn; col++) {
        const i = row * columns + col
        const difference = hoverTargets[i] - hoverStrength[i]
        if (Math.abs(difference) < .001) hoverStrength[i] = hoverTargets[i]
        else { hoverStrength[i] += difference * blend; settling = true }
        const active = hoverStrength[i]
        const visibility = points[i].visibility
        const value = Math.max(ambient[i] * visibility, active * Math.max(visibility, active * .85))
        const alpha = value < .002 ? 0 : value
        const sprite = Math.round(active * (spriteCount - 1))
        if (alpha === lastAlpha[i] || (alpha > 0 && lastAlpha[i] > 0 && Math.abs(alpha - lastAlpha[i]) < alphaEpsilon)) {
          if (sprite === lastSprite[i]) continue
        }
        // Dot tiles never overlap. Clear only changed tiles, not the full hero surface.
        if (lastAlpha[i] > 0) ctx.clearRect(pixelX[i], pixelY[i], tileSize, tileSize)
        if (alpha > 0) {
          ctx.globalAlpha = alpha
          ctx.drawImage(atlas, sprite * tileSize, 0, tileSize, tileSize, pixelX[i], pixelY[i], tileSize, tileSize)
        }
        lastAlpha[i] = alpha
        lastSprite[i] = sprite
      }
    }
    if (waves.length || settling) frame = requestAnimationFrame(tick)
    else {
      lastPaint = 0
      wakeTimer = window.setTimeout(() => { wakeTimer = 0; wake() }, Math.max(1, nextAmbient - now))
    }
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    left = rect.left
    top = rect.top
    boundsDirty = false
    hoverDirty = true
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    if (width === rect.width && height === rect.height && ratio === pixelRatio) { wake(); return }
    width = rect.width
    height = rect.height
    pixelRatio = ratio
    canvas.width = background.width = Math.max(1, Math.round(width * pixelRatio))
    canvas.height = background.height = Math.max(1, Math.round(height * pixelRatio))
    const grid = createGrid(width, height)
    columns = grid.columns
    rows = grid.rows
    points = grid.points
    ambient = new Float32Array(points.length)
    hoverStrength = new Float32Array(points.length)
    hoverTargets = new Float32Array(points.length)
    lastAlpha = new Float32Array(points.length)
    lastSprite = new Uint8Array(points.length)
    pixelX = new Int32Array(points.length)
    pixelY = new Int32Array(points.length)
    minColumn = minRow = 0
    maxColumn = columns - 1
    maxRow = rows - 1
    for (let i = 0; i < waves.length; i++) {
      waves[i] = prepareWave({ ...waves[i], extent: width }, points)
    }
    rebuildImages()
    syncPlayback()
  }
  const readTheme = () => {
    const style = getComputedStyle(canvas)
    const nextNeutral = style.getPropertyValue("--xr-fg-muted").trim() || neutral
    const nextBlue = style.getPropertyValue("--xr-link").trim() || blue
    if (neutral === nextNeutral && blue === nextBlue) return
    neutral = nextNeutral
    blue = nextBlue
    rebuildImages()
    wake()
  }
  const onMove = (event: Event) => {
    if (!canAnimate() || !finePointer.matches) return
    const { clientX, clientY } = event as PointerEvent
    if (hoverActive && mouseX === clientX && mouseY === clientY) return
    mouseX = clientX
    mouseY = clientY
    hoverActive = hoverDirty = true
    wake()
  }
  const onLeave = () => { hoverActive = false; hoverDirty = true; wake() }
  const onScroll = () => { boundsDirty = true; if (hoverActive) wake() }
  const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncPlayback() })
  const sizeObserver = new ResizeObserver(resize)
  const themeObserver = new MutationObserver(readTheme)
  intersection.observe(hero)
  sizeObserver.observe(canvas)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
  hero.addEventListener("pointerenter", onMove)
  hero.addEventListener("pointermove", onMove)
  hero.addEventListener("pointerleave", onLeave)
  reducedMotion.addEventListener("change", syncPlayback)
  finePointer.addEventListener("change", onLeave)
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
    hero.removeEventListener("pointerenter", onMove)
    hero.removeEventListener("pointermove", onMove)
    hero.removeEventListener("pointerleave", onLeave)
    reducedMotion.removeEventListener("change", syncPlayback)
    finePointer.removeEventListener("change", onLeave)
    document.removeEventListener("visibilitychange", syncPlayback)
    window.removeEventListener("resize", resize)
    window.removeEventListener("scroll", onScroll, true)
    atlas.width = atlas.height = 0
  }
}
