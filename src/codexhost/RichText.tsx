import {
  Fragment,
  createElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Lexer, type Token, type Tokens } from 'marked'
import { decodeText, safeHref } from './markdown.ts'
import type { Translate } from './i18n.ts'

function CodeBlock({ text, lang, t }: { text: string; lang?: string; t: Translate }): ReactElement {
  const [copied, setCopied] = useState(false)
  return (
    <div className="ch-code-block">
      <header>
        <span>{lang || 'text'}</span>
        <button
          className="ch-mini-button"
          onClick={() => {
            void navigator.clipboard
              .writeText(text)
              .then(() => setCopied(true))
              .catch(() => setCopied(false))
          }}
        >
          {t(copied ? 'copied' : 'copyRecord')}
        </button>
      </header>
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  )
}

function renderTokens(tokens: readonly Token[], t: Translate, depth = 0): ReactNode {
  if (depth > 16) return tokens.map((token) => token.raw).join('')
  return tokens.map((value, index) => {
    const child = (children: readonly Token[]) => renderTokens(children, t, depth + 1)
    let node: ReactNode
    switch (value.type) {
      case 'space':
        node = null
        break
      case 'paragraph':
        node = <p>{child((value as Tokens.Paragraph).tokens)}</p>
        break
      case 'heading': {
        const token = value as Tokens.Heading
        node = createElement(
          `h${Math.min(6, Math.max(2, token.depth + 1))}`,
          null,
          child(token.tokens),
        )
        break
      }
      case 'text': {
        const token = value as Tokens.Text
        node = token.tokens ? child(token.tokens) : decodeText(token.text)
        break
      }
      case 'escape':
        node = decodeText((value as Tokens.Escape).text)
        break
      case 'strong':
        node = <strong>{child((value as Tokens.Strong).tokens)}</strong>
        break
      case 'em':
        node = <em>{child((value as Tokens.Em).tokens)}</em>
        break
      case 'del':
        node = <del>{child((value as Tokens.Del).tokens)}</del>
        break
      case 'codespan':
        node = <code>{(value as Tokens.Codespan).text}</code>
        break
      case 'code': {
        const token = value as Tokens.Code
        node = <CodeBlock text={token.text} lang={token.lang} t={t} />
        break
      }
      case 'blockquote':
        node = <blockquote>{child((value as Tokens.Blockquote).tokens)}</blockquote>
        break
      case 'br':
        node = <br />
        break
      case 'hr':
        node = <hr />
        break
      case 'list': {
        const token = value as Tokens.List
        const rows = token.items.map((item, position) => (
          <li key={position}>
            {item.task && (
              <span
                className="ch-task-state"
                aria-label={t(item.checked ? 'taskChecked' : 'taskUnchecked')}
              >
                {item.checked ? '☑' : '☐'}{' '}
              </span>
            )}
            {child(item.tokens)}
          </li>
        ))
        node = token.ordered ? (
          <ol start={typeof token.start === 'number' ? token.start : 1}>{rows}</ol>
        ) : (
          <ul>{rows}</ul>
        )
        break
      }
      case 'table': {
        const token = value as Tokens.Table
        node = (
          <div className="ch-rich-table">
            <table>
              <thead>
                <tr>
                  {token.header.map((cell, position) => (
                    <th key={position}>{child(cell.tokens)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {token.rows.map((row, position) => (
                  <tr key={position}>
                    {row.map((cell, column) => (
                      <td key={column}>{child(cell.tokens)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        break
      }
      case 'link': {
        const token = value as Tokens.Link
        const href = safeHref(token.href, location.href)
        node = href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {child(token.tokens)}
          </a>
        ) : (
          <span>{child(token.tokens)}</span>
        )
        break
      }
      case 'image': {
        const token = value as Tokens.Image
        const href = safeHref(token.href, location.href)
        const label = `${t('imageLink')}: ${token.text || token.href}`
        node = href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <span>{label}</span>
        )
        break
      }
      case 'def':
        node = null
        break
      default:
        node = <span>{value.raw}</span>
    }
    return <Fragment key={index}>{node}</Fragment>
  })
}

export function RichText({ text, t }: { text: string; t: Translate }): ReactElement {
  const tokens = useMemo(() => Lexer.lex(text, { gfm: true, breaks: false }), [text])
  return <div className="ch-rich-text">{renderTokens(tokens, t)}</div>
}
