import { Component, createElement, type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { App } from './App.tsx'
import { Icon } from './components.tsx'
import { en, zh, translator } from './i18n.ts'
import { recordOf } from './model.ts'
import { type ClientContext, type ViewProps } from './hooks.ts'
import styles from './styles.css'
import telemetryStyles from './telemetry.css'
import inspectorStyles from './inspector.css'
import richTextStyles from './richtext.css'
import surfaceStyles from './legacy-surface.css'

export const name = 'ch-context'
export const inject = ['slots', 'locale']

class PanelBoundary extends Component<
  { children: ReactNode; translate: () => ReturnType<typeof translator> },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }
  componentDidCatch(_error: Error, _info: ErrorInfo): void {}
  render(): ReactNode {
    if (this.state.failed)
      return (
        <div className="ch-context">
          <div className="ch-shell">
            <p role="alert">{this.props.translate()('errorBoundary')}</p>
            <button className="ch-button" onClick={() => this.setState({ failed: false })}>
              {this.props.translate()('retry')}
            </button>
          </div>
        </div>
      )
    return this.props.children
  }
}

export function apply(ctx: ClientContext): void {
  const text = (): ReturnType<typeof translator> =>
    translator(ctx.locale.getLocale?.().active ?? 'en')
  ctx.effect(
    () => ctx.locale.register(name, { en: { ...en }, zh: { ...zh } }),
    'ch-context: locale',
  )
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = name
    tag.dataset.pluginCss = name
    tag.textContent =
      styles +
      '\n' +
      telemetryStyles +
      '\n' +
      inspectorStyles +
      '\n' +
      richTextStyles +
      '\n' +
      surfaceStyles
    document.head.appendChild(tag)
    return () => tag.remove()
  }, 'ch-context: styles')
  const View = (props: ViewProps): ReactElement => {
    const readProjection = props.useProjection ?? (() => undefined)
    const projection = readProjection('codexhostUsage')
    return <App ctx={ctx} sessionId={props.sessionId} projection={projection} embedded />
  }
  const ScopedView = (props: ViewProps): ReactElement => (
    <PanelBoundary translate={text} key={`${props.sessionId ?? ''}:${typeof props.useProjection}`}>
      <View {...props} />
    </PanelBoundary>
  )
  const MainView = (): ReactElement => (
    <PanelBoundary translate={text}>
      <App ctx={ctx} />
    </PanelBoundary>
  )
  ctx.slots.inject('conversation.view', () =>
    ctx.slots.register(
      {
        name: 'conversation.view',
        id: name,
        order: 25,
        locale: name,
        label: () => text()('tab'),
      },
      ScopedView,
    ),
  )
  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: name, locale: name }, MainView),
  )
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: name,
        order: 25,
        label: () => text()('compatibilityTitle'),
        locale: name,
      },
      (props) => createElement(Icon, { size: typeof props.size === 'number' ? props.size : 20 }),
    ),
  )
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: name,
        order: 25,
        label: () => text()('titleShort'),
        locale: name,
      },
      () => (
        <div className="ch-context">
          <div className="ch-settings">
            <h2>CH Context</h2>
            <p>{text()('settingsNote')}</p>
            <p>{text()('localOnly')}</p>
            <button
              className="ch-button"
              onClick={() => {
                const layout = recordOf(ctx.get('layout'))
                if (typeof layout?.selectPanel === 'function') layout.selectPanel(name)
              }}
            >
              {text()('title')}
            </button>
            <small>{text()('readOnly')}</small>
          </div>
        </div>
      ),
    ),
  )
}
