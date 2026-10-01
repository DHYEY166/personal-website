import { Fragment, useMemo } from 'react';
import { parseMarkdown } from '../../utils/markdown';
import { useTheme } from '../../context/ThemeContext';

function Inline({ nodes, theme, mode }) {
  return nodes.map((n, i) => {
    switch (n.type) {
      case 'strong':
        return <strong key={i} style={{ fontWeight: 700 }}><Inline nodes={n.children} theme={theme} mode={mode} /></strong>;
      case 'em':
        return <em key={i}><Inline nodes={n.children} theme={theme} mode={mode} /></em>;
      case 'code':
        return (
          <code
            key={i}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: '0.9em',
              padding: '1px 5px',
              borderRadius: 4,
              background: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            }}
          >
            {n.text}
          </code>
        );
      case 'link': {
        // External pages and same-site files (e.g. the resume PDF) open in a new tab so the chat
        // isn't lost; same-site routes like /#contact and mailto: links open in place.
        const external = !n.href.startsWith('/');
        const siteFile = !external && /\.[a-z0-9]{2,5}(?:#|$)/i.test(n.href);
        const newTab = siteFile || (external && !n.href.startsWith('mailto:'));
        return (
          <a
            key={i}
            href={n.href}
            {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{ color: theme.accent.text, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2, wordBreak: 'break-word' }}
          >
            <Inline nodes={n.children} theme={theme} mode={mode} />
          </a>
        );
      }
      case 'br':
        return <br key={i} />;
      default:
        return <Fragment key={i}>{n.text}</Fragment>;
    }
  });
}

/** Renders a safe Markdown subset (see utils/markdown.js) as React elements: no raw HTML. */
export default function ChatMarkdown({ text }) {
  const { theme, mode } = useTheme();
  const blocks = useMemo(() => parseMarkdown(text), [text]);
  const gap = { margin: '0 0 8px' };
  const cell = {
    border: theme.glass.border,
    padding: '4px 8px',
    textAlign: 'left',
    verticalAlign: 'top',
  };

  return (
    <div className="chat-md" style={{ display: 'flow-root' }}>
      {blocks.map((b, i) => {
        const last = i === blocks.length - 1;
        const style = last ? { ...gap, marginBottom: 0 } : gap;
        switch (b.type) {
          case 'h':
            return <p key={i} style={{ ...style, fontWeight: 700 }}><Inline nodes={b.children} theme={theme} mode={mode} /></p>;
          case 'ul':
          case 'ol': {
            const List = b.type;
            return (
              <List key={i} start={b.type === 'ol' && b.start !== 1 ? b.start : undefined} style={{ ...style, paddingLeft: 20 }}>
                {b.items.map((item, j) => (
                  <li key={j} style={{ margin: '2px 0' }}><Inline nodes={item} theme={theme} mode={mode} /></li>
                ))}
              </List>
            );
          }
          case 'table':
            return (
              <div key={i} style={{ ...style, overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '0.95em' }}>
                  <thead>
                    <tr>{b.head.map((c, j) => <th key={j} style={{ ...cell, fontWeight: 700 }}><Inline nodes={c} theme={theme} mode={mode} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>{r.map((c, k) => <td key={k} style={cell}><Inline nodes={c} theme={theme} mode={mode} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'pre':
            return (
              <pre key={i} style={{ ...style, whiteSpace: 'pre-wrap', fontSize: '0.9em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}>
                {b.text}
              </pre>
            );
          case 'hr':
            return <hr key={i} style={{ ...style, border: 0, borderTop: theme.glass.border }} />;
          default:
            return (
              <p key={i} style={style}>
                {b.lines.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    <Inline nodes={line} theme={theme} mode={mode} />
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
