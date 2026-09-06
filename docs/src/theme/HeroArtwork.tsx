import { useEffect, useRef } from "react"

const shapes = [
  { x: 248, y: 208, size: 126, angle: 45, kind: "square", accent: false },
  { x: 248, y: 208, size: 88, angle: 45, kind: "square", accent: false },
  { x: 248, y: 208, size: 48, angle: 45, kind: "square", accent: true },
  { x: 344, y: 112, size: 34, angle: 0, kind: "square", accent: true },
  { x: 151, y: 111, size: 32, angle: 15, kind: "triangle", accent: false },
  { x: 346, y: 304, size: 46, angle: 15, kind: "triangle", accent: false },
  { x: 150, y: 305, size: 20, angle: 0, kind: "square", accent: true },
  { x: 248, y: 52, size: 12, angle: 45, kind: "square", accent: false },
  { x: 404, y: 208, size: 14, angle: 45, kind: "square", accent: false },
  { x: 248, y: 365, size: 18, angle: 0, kind: "triangle", accent: true },
  { x: 78, y: 208, size: 12, angle: 0, kind: "square", accent: false },
  { x: 389, y: 58, size: 8, angle: 0, kind: "square", accent: false },
] as const

export function HeroArtwork() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const hero = svg?.closest(".spectre-hero")
    if (!svg || !hero) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const nodes = Array.from(svg.querySelectorAll<SVGGElement>("[data-shape]"))
    let frame = 0

    const reset = () => {
      cancelAnimationFrame(frame)
      svg.classList.remove("is-active")
      nodes.forEach(node => {
        node.style.removeProperty("transform")
        node.style.removeProperty("--shape-proximity")
      })
    }

    const onMove = (event: Event) => {
      if (reducedMotion.matches || !finePointer.matches) return
      const { clientX, clientY } = event as PointerEvent
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const matrix = svg.getScreenCTM()
        if (!matrix) return
        const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
        svg.classList.add("is-active")
        nodes.forEach((node, index) => {
          const shape = shapes[index]
          const dx = point.x - shape.x
          const dy = point.y - shape.y
          const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 190)
          node.style.transform = `translate(${-dx * proximity * .1}px, ${-dy * proximity * .1}px)`
          node.style.setProperty("--shape-proximity", String(proximity))
        })
      })
    }

    hero.addEventListener("pointermove", onMove)
    hero.addEventListener("pointerleave", reset)
    reducedMotion.addEventListener("change", reset)
    finePointer.addEventListener("change", reset)
    return () => {
      reset()
      hero.removeEventListener("pointermove", onMove)
      hero.removeEventListener("pointerleave", reset)
      reducedMotion.removeEventListener("change", reset)
      finePointer.removeEventListener("change", reset)
    }
  }, [])

  return (
    <svg ref={svgRef} className="spectre-hero-art" viewBox="0 0 440 420" fill="none" aria-hidden="true" focusable="false">
      <g className="spectre-art-grid">
        {[64, 112, 160, 208, 256, 304, 352, 400].map(x => <path key={`v${x}`} d={`M${x} 24V392`} />)}
        {[64, 112, 160, 208, 256, 304, 352].map(y => <path key={`h${y}`} d={`M40 ${y}H424`} />)}
      </g>
      <g className="spectre-art-guides">
        <circle cx="248" cy="208" r="137" strokeDasharray="2 8" />
        <path d="M78 208 248 52 404 208 248 365ZM151 111 346 304M344 112 150 305" />
        <path d="M248 24V392M40 208H424" strokeDasharray="3 7" />
      </g>
      <g className="spectre-art-trace">
        <path d="M78 208H110L150 168H207L248 208H301L344 165V112" />
        <path d="M248 208V265L288 305H346" />
      </g>
      {shapes.map((shape, index) => (
        <g key={index} data-shape className={`spectre-art-shape${shape.accent ? " spectre-art-shape--accent" : ""}`}>
          <g transform={`translate(${shape.x} ${shape.y}) rotate(${shape.angle})`}>
            {shape.kind === "square"
              ? <rect x={-shape.size / 2} y={-shape.size / 2} width={shape.size} height={shape.size} />
              : <path d={`M0 ${-shape.size / 2} ${shape.size / 2} ${shape.size / 2} ${-shape.size / 2} ${shape.size / 2}Z`} />}
          </g>
        </g>
      ))}
      <g className="spectre-art-points">
        <circle cx="248" cy="208" r="4" />
        <circle cx="344" cy="112" r="3" />
        <circle cx="150" cy="305" r="3" />
        <path d="M382 355h10m-5-5v10M110 63h10m-5-5v10M200 377h10m-5-5v10" />
      </g>
    </svg>
  )
}
