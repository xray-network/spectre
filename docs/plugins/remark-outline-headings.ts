type Node = {
  type: string
  name?: string
  value?: string
  attributes?: { type: string; name?: string; value?: unknown }[]
  children?: Node[]
}

type Heading = { id: string; text: string; depth: number }

// Rspress discovers top-level Markdown headings by default. Opt selected JSX
// headings into the same page outline without changing the custom home layout.
export function remarkOutlineHeadings(this: {
  data(key: "pageMeta"): { toc: Heading[] }
}) {
  const meta = this.data("pageMeta")
  return (tree: Node) => {
    const textOf = (node: Node): string =>
      node.type === "text" ? node.value ?? "" : (node.children ?? []).map(textOf).join("")
    const visit = (node: Node) => {
      const attributes = node.attributes ?? []
      if ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") && /^h[2-4]$/.test(node.name ?? "") &&
          attributes.some(attr => attr.type === "mdxJsxAttribute" && attr.name === "data-outline")) {
        const id = attributes.find(attr => attr.type === "mdxJsxAttribute" && attr.name === "id")?.value
        const text = textOf(node).trim()
        if (typeof id !== "string" || !id || !text) {
          throw new Error("Headings with data-outline require a literal id and text.")
        }
        if (meta.toc.some(heading => heading.id === id)) throw new Error(`Duplicate outline heading: ${id}`)
        meta.toc.push({ id, text, depth: Number(node.name![1]) })
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}
