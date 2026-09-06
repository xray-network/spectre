export const spacing = 26
export const firstY = 20

// CSS-pixel coordinates: resize changes the number of symbols, never their size.
export function createGrid(width: number, height: number) {
  const margin = 6
  const columns = width > 0 ? Math.floor((width + margin) / spacing) + 1 : 0
  const rows = height > 0 ? Math.max(0, Math.floor((height + margin - firstY) / spacing) + 1) : 0
  const points = Array.from({ length: rows * columns }, (_, i) => {
    const x = (i % columns) * spacing
    return { x, y: firstY + Math.floor(i / columns) * spacing, visibility: .06 + Math.pow(Math.min(x / width, 1), 3) * .84 }
  })
  return { columns, rows, points }
}
