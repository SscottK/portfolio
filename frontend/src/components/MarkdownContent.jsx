import './MarkdownContent.css'

function renderInline(text) {
  const nodes = []
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push(
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noreferrer">
            {linkMatch[1]}
          </a>,
        )
      } else {
        nodes.push(token)
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function parseBlocks(markdown) {
  const normalized = (markdown ?? '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const lines = normalized.split('\n')
  const blocks = []
  let paragraphLines = []
  let listItems = null

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    blocks.push({
      type: 'paragraph',
      text: paragraphLines.join(' ').replace(/\s+/g, ' ').trim(),
    })
    paragraphLines = []
  }

  const flushList = () => {
    if (!listItems?.length) {
      listItems = null
      return
    }
    blocks.push({ type: 'list', items: listItems })
    listItems = null
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/)
    if (unordered) {
      flushParagraph()
      if (!listItems) listItems = []
      listItems.push(unordered[1])
      return
    }

    flushList()
    paragraphLines.push(trimmed)
  })

  flushParagraph()
  flushList()
  return blocks
}

export default function MarkdownContent({ content, className = '' }) {
  const blocks = parseBlocks(content)

  if (blocks.length === 0) return null

  return (
    <div className={`markdown-content ${className}`.trim()}>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        return <p key={`p-${index}`}>{renderInline(block.text)}</p>
      })}
    </div>
  )
}
