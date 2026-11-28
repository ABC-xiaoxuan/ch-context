import { memo, useState, type ReactElement } from 'react'
import type { LosslessJsonNode } from './json-view.ts'

function JsonBranch({
  name,
  node,
  depth,
}: {
  name?: string
  node: LosslessJsonNode
  depth: number
}): ReactElement {
  const [open, setOpen] = useState(depth < 2)
  const keyPrefix =
    name !== undefined ? (
      <>
        <span className="ch-json-key">{JSON.stringify(name)}</span>
        <span className="ch-json-punct">: </span>
      </>
    ) : null

  if (node.type === 'string') {
    return (
      <div className="ch-json-line">
        {keyPrefix}
        <span className="ch-json-str">{JSON.stringify(node.value)}</span>
      </div>
    )
  }
  if (node.type === 'number') {
    return (
      <div className="ch-json-line">
        {keyPrefix}
        <span className="ch-json-num">{node.raw}</span>
      </div>
    )
  }
  if (node.type === 'boolean') {
    return (
      <div className="ch-json-line">
        {keyPrefix}
        <span className="ch-json-bool">{node.value ? 'true' : 'false'}</span>
      </div>
    )
  }
  if (node.type === 'null') {
    return (
      <div className="ch-json-line">
        {keyPrefix}
        <span className="ch-json-null">null</span>
      </div>
    )
  }
  if (node.type === 'array') {
    if (node.items.length === 0) {
      return (
        <div className="ch-json-line">
          {keyPrefix}
          <span className="ch-json-punct">[]</span>
        </div>
      )
    }
    return (
      <div className="ch-json-branch">
        <button
          type="button"
          className="ch-json-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="ch-json-chev" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
          {keyPrefix}
          <span className="ch-json-punct">[</span>
          {!open && <span className="ch-json-summary">{node.items.length}</span>}
          {!open && <span className="ch-json-punct">]</span>}
        </button>
        {open && (
          <div className="ch-json-children">
            {node.items.map((child, index) => (
              <JsonBranch key={index} node={child} depth={depth + 1} />
            ))}
            <span className="ch-json-punct">]</span>
          </div>
        )}
      </div>
    )
  }
  if (node.entries.length === 0) {
    return (
      <div className="ch-json-line">
        {keyPrefix}
        <span className="ch-json-punct">{'{}'}</span>
      </div>
    )
  }
  return (
    <div className="ch-json-branch">
      <button
        type="button"
        className="ch-json-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ch-json-chev" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
        {keyPrefix}
        <span className="ch-json-punct">{'{'}</span>
        {!open && <span className="ch-json-summary">{node.entries.length}</span>}
        {!open && <span className="ch-json-punct">{'}'}</span>}
      </button>
      {open && (
        <div className="ch-json-children">
          {node.entries.map((entry, index) => (
            <JsonBranch
              key={`${entry.key}-${index}`}
              name={entry.key}
              node={entry.value}
              depth={depth + 1}
            />
          ))}
          <span className="ch-json-punct">{'}'}</span>
        </div>
      )}
    </div>
  )
}

export const JsonViewer = memo(function JsonViewer({
  node,
}: {
  node: LosslessJsonNode
}): ReactElement {
  return (
    <div className="ch-json-tree">
      <JsonBranch node={node} depth={0} />
    </div>
  )
})
