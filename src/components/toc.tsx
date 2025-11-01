import type { Heading } from 'nextra'
import type { FC, ReactNode } from 'react'
import { isValidElement } from 'react'

type TocNode = Heading & { children: TocNode[] }

const buildTree = (headings: Heading[]): TocNode[] => {
  const tree: TocNode[] = []
  const stack: TocNode[] = []

  for (const heading of headings) {
    const node: TocNode = { ...heading, children: [] }

    while (stack.length && stack[stack.length - 1].depth >= node.depth) {
      stack.pop()
    }

    if (!stack.length) {
      tree.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }

    stack.push(node)
  }

  return tree
}

const extractText = (node: ReactNode | unknown): string => {
  if (node == null || typeof node === 'boolean') {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }

  if (isValidElement(node)) {
    if (typeof node.props === 'object' && 'children' in node.props) {
      const children = node.props.children
      return extractText(children)
    }
  }

  return ''
}

const getHeadingLabel = (value: Heading['value']): string => {
  return extractText(value).trim()
}

const renderItems = (items: TocNode[]): ReactNode => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="block border-l border-border/60 pl-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {getHeadingLabel(item.value) || item.id}
          </a>
          {item.children.length ? (
            <div className="mt-2 ml-3">{renderItems(item.children)}</div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

interface TocProps {
  toc: Heading[]
  className?: string
}

export const TOC: FC<TocProps> = ({ toc, className }) => {
  const tree = buildTree(toc)

  if (!tree.length) {
    return null
  }

  const tocList = renderItems(tree)
  const navClassName = ['text-sm', className ?? ''].join(' ').trim()

  return (
    <nav aria-label="Table of contents" className={navClassName}>
      <details data-toc className="rounded-lg border border-border/80 bg-card/80 shadow-sm" open>
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>목차</span>
          <svg
            aria-hidden="true"
            className="toc-toggle-icon h-4 w-4 text-muted-foreground"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.5 6.5L8 11L12.5 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <div className="border-t border-border/60 px-4 pb-4 pt-3">{tocList}</div>
      </details>
    </nav>
  )
}
