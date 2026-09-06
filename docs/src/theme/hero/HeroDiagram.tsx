import { useId } from "react"

export function HeroDiagram() {
  const id = useId()
  return (
    <svg className="spectre-hero-diagram" viewBox="0 0 320 280" role="img" aria-labelledby={`${id}-title ${id}-description`} focusable="false">
      <title id={`${id}-title`}>SPECTRE: a protocol for coding agents.</title>
      <desc id={`${id}-description`}>Plan the scope, implement and check the code, then review and decide. SPECTRE records the plans, checks, and decisions in your repository.</desc>

      <text className="spectre-diagram-name" x="160" y="30">SPECTRE</text>
      <text className="spectre-diagram-caption" x="160" y="49">A protocol for coding agents</text>
      <g className="spectre-diagram-traces">
        <path d="M14 56V38a12 12 0 0 1 12-12h52M242 26h52a12 12 0 0 1 12 12v18" />
        <path d="M64 186v12a10 10 0 0 0 10 10h172a10 10 0 0 0 10-10v-12" />
      </g>
      <rect className="spectre-diagram-frame" x="14" y="68" width="292" height="118" rx="8" />

      <g className="spectre-diagram-records">
        <rect x="36" y="84" width="56" height="48" rx="4" />
        <rect x="132" y="84" width="56" height="48" rx="4" />
        <rect x="228" y="84" width="56" height="48" rx="4" />
        <g className="spectre-diagram-icon">
          <path d="M56 96h11l5 5v19H56Zm11 0v6h5m-12 5h8m-8 6h8" />
          <path d="m154 101-7 7 7 7m12-14 7 7-7 7m-4-19-4 24" />
          <path d="m246 108 7 7 13-15" />
        </g>
        <text x="64" y="151">Plan</text>
        <text x="160" y="151">Implement</text>
        <text x="256" y="151">Review</text>
      </g>
      <g className="spectre-diagram-arrows">
        <path className="spectre-diagram-dashed" d="M96 108h28M192 108h28M160 186v37" />
        <path d="M120 104L124 108L120 112M216 104L220 108L216 112M156 219L160 223L164 219" />
      </g>
      <g className="spectre-diagram-caption">
        <text x="64" y="169">Define scope</text>
        <text x="160" y="169">Code + checks</text>
        <text x="256" y="169">You decide</text>
      </g>
      <g className="spectre-diagram-ports">
        <circle cx="78" cy="26" r="2" />
        <circle cx="242" cy="26" r="2" />
        <circle cx="64" cy="186" r="2" />
        <circle cx="256" cy="186" r="2" />
      </g>
      <rect className="spectre-diagram-repository" x="32" y="228" width="256" height="46" rx="6" />
      <path className="spectre-diagram-icon" d="M45 242h6l3 3h9v15H45Zm0 7h18" />
      <text className="spectre-diagram-summary" x="174" y="247">Recorded in your repository</text>
      <text className="spectre-diagram-caption" x="174" y="263">Plans · checks · decisions</text>
    </svg>
  )
}
