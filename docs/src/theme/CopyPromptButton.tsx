import { useEffect, useRef, useState } from "react"

export const installationPrompt = "Read https://wiki.xraynetwork.io/spectre/protocol/v1.0.0/SPECTRE-PROTOCOL.md completely and install SPECTRE v1.0.0 in this repository."

export function CopyPromptButton() {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(true)
  const pending = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(timer.current)
    }
  }, [])

  const copy = async () => {
    if (pending.current) return
    pending.current = true
    clearTimeout(timer.current)
    setStatus("copying")
    try {
      await navigator.clipboard.writeText(installationPrompt)
      if (mounted.current) setStatus("copied")
    } catch {
      if (mounted.current) setStatus("error")
    } finally {
      pending.current = false
      if (mounted.current) timer.current = setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const label = status === "copied" ? "Prompt copied" : status === "error" ? "Copy failed" : status === "copying" ? "Copying…" : "Copy prompt"

  return (
    <button type="button" className="spectre-button spectre-button--secondary spectre-copy-prompt" onClick={copy} disabled={status === "copying"}>
      <span role="status" aria-live="polite">{label}</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {status === "copied" ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
      </svg>
    </button>
  )
}
