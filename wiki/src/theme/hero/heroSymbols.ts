import { SLOPE } from "./heroRays"

// Narrow, font-independent glyphs: / \ | + < > [ ] = 0 1 :
// Each group of four numbers is one line segment in CSS pixels.
const randomGlyphs = [
  [-1.5, 3.5, 1.5, -3.5],
  [-1.5, -3.5, 1.5, 3.5],
  [0, -3.5, 0, 3.5],
  [-1.5, 0, 1.5, 0, 0, -3, 0, 3],
  [1.5, -3, -1.5, 0, -1.5, 0, 1.5, 3],
  [-1.5, -3, 1.5, 0, 1.5, 0, -1.5, 3],
  [1.5, -3.5, -1.5, -3.5, -1.5, -3.5, -1.5, 3.5, -1.5, 3.5, 1.5, 3.5],
  [-1.5, -3.5, 1.5, -3.5, 1.5, -3.5, 1.5, 3.5, 1.5, 3.5, -1.5, 3.5],
  [-1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, 1.5],
  [-1.5, -3, 1.5, -3, 1.5, -3, 1.5, 3, 1.5, 3, -1.5, 3, -1.5, 3, -1.5, -3],
  [-1.5, -2, 0, -3.5, 0, -3.5, 0, 3.5, -1.5, 3.5, 1.5, 3.5],
  [0, -2, 0, -1.5, 0, 1.5, 0, 2],
  // Weighted blank slots create gaps between the bright symbols.
  [], [], [],
]

// The ray's slashes: the resting slash rotated, in fine steps, to the ray's lean (and a little longer), so a cell turns
// smoothly toward the ray as it lights up.
export const rayGlyphCount = 24
const restAngle = Math.atan2(1.5, 3.5), rayAngle = Math.atan(SLOPE)
const rayGlyphs = Array.from({ length: rayGlyphCount }, (_, k) => {
  const t = (k + 1) / rayGlyphCount
  const angle = restAngle + (rayAngle - restAngle) * t
  const length = 3.8 + .9 * t
  const sx = length * Math.sin(angle), sy = length * Math.cos(angle)
  return [-sx, sy, sx, -sy]
})

const glyphs = [...randomGlyphs, ...rayGlyphs]
export const firstBlankSymbol = randomGlyphs.length - 3
export const symbolCount = glyphs.length
export const firstRaySymbol = randomGlyphs.length
export const symbolInterval = 140

/** The ray slash for a cell turned this far (0..1) toward the ray's lean. */
export function raySymbol(strength: number) {
  return firstRaySymbol + Math.min(rayGlyphCount - 1, Math.floor(strength * rayGlyphCount))
}

export function strokeSymbol(ctx: CanvasRenderingContext2D, symbol: number, x: number, y: number, ratio = 1) {
  ratio *= 1.25
  const segments = glyphs[symbol]
  if (!segments.length) return
  ctx.beginPath()
  for (let i = 0; i < segments.length; i += 4) {
    ctx.moveTo(x + segments[i] * ratio, y + segments[i + 1] * ratio)
    ctx.lineTo(x + segments[i + 2] * ratio, y + segments[i + 3] * ratio)
  }
  ctx.stroke()
}

export function symbolAt(index: number, now: number) {
  // Stagger each cell and hash its time step; no random allocation in the frame loop.
  let hash = Math.imul(index + 1, 374761393) ^ Math.floor((now + index * 37) / symbolInterval)
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177)
  // 1..firstRaySymbol - 1: the random glyphs, not the resting slash (0) or the ray's slashes.
  return 1 + ((hash ^ (hash >>> 16)) >>> 0) % (firstRaySymbol - 1)
}
