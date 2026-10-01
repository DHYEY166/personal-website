// Tiny, safe Markdown subset for chatbot replies.
//
// The parser returns plain data (blocks and inline tokens); ChatMarkdown renders it with React
// elements, so model output is never injected as HTML. Supported: paragraphs and line breaks,
// headings (rendered as bold lines), bullet and numbered lists, simple pipe tables, fenced code,
// **bold**, *italic*, `inline code`, [links](https://...), <autolinks>, bare URLs, email
// addresses, and site-relative paths such as /#contact or /Dhyey_Desai_Resume.pdf.

const SAFE_URL = /^(https?:\/\/|mailto:|\/(?!\/))/i;

/** Only http(s), mailto, and same-site absolute paths are turned into links. */
export function safeHref(url) {
  const u = String(url || '').trim();
  return SAFE_URL.test(u) ? u : null;
}

const EMAIL_SOURCE = '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';

/**
 * Site-relative path: `/#section`, `/route`, or `/file.pdf`, optionally with a #fragment. Only at
 * the start of the text or after whitespace / an opening bracket, so "and/or", "24/7", and
 * "github.com/user" are left alone, and never `//host` (protocol-relative).
 */
const SITE_PATH_SOURCE =
  '(?<![^\\s(\\[])\\/(?:#[A-Za-z][\\w-]*|[A-Za-z0-9_-]+(?:\\/[A-Za-z0-9_-]+)*(?:\\.[A-Za-z0-9]{2,5})?\\/?(?:#[A-Za-z][\\w-]*)?)(?![\\w/.-]*[\\w/])';

const INLINE_SOURCE = new RegExp(
  [
    '(`[^`\\n]+`)', // 1 inline code
    '(\\*\\*(?=\\S)[^\\n]+?\\*\\*|__(?=\\S)[^\\n]+?__)', // 2 bold
    '(\\[[^\\]\\n]+\\]\\([^)\\s]+\\))', // 3 [text](url)
    "(https?:\\/\\/[^\\s<>()\\[\\]]*[^\\s<>()\\[\\].,;:!?'\"])", // 4 bare URL
    `(${EMAIL_SOURCE})`, // 5 email
    '((?<![\\w*])\\*(?=\\S)[^*\\n]+?\\*(?![\\w*])|(?<![\\w])_(?=\\S)[^_\\n]+?_(?![\\w]))', // 6 italic
    '(<br\\s*\\/?>)', // 7 literal <br> (models use it inside table cells)
    `(<(?:https?:\\/\\/[^\\s<>]+|mailto:${EMAIL_SOURCE}|${EMAIL_SOURCE})>)`, // 8 <autolink>
    `(${SITE_PATH_SOURCE})`, // 9 site-relative path
  ].join('|'),
  'g',
).source;

/** Inline tokens: { type: 'text' | 'code' | 'strong' | 'em' | 'link' | 'br', ... } */
export function parseInline(text) {
  const out = [];
  const src = String(text ?? '');
  let last = 0;
  // A fresh regex per call: parseInline recurses, and a shared /g regex would share lastIndex.
  const re = new RegExp(INLINE_SOURCE, 'g');
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ type: 'text', text: src.slice(last, m.index) });
    const [whole, code, strong, mdLink, url, email, em, br, autolink, sitePath] = m;
    if (code) {
      out.push({ type: 'code', text: code.slice(1, -1) });
    } else if (strong) {
      out.push({ type: 'strong', children: parseInline(strong.slice(2, -2)) });
    } else if (mdLink) {
      const split = mdLink.indexOf('](');
      const label = mdLink.slice(1, split);
      const href = safeHref(mdLink.slice(split + 2, -1));
      out.push(href ? { type: 'link', href, children: parseInline(label) } : { type: 'text', text: label });
    } else if (url) {
      out.push({ type: 'link', href: url, children: [{ type: 'text', text: url }] });
    } else if (email) {
      out.push({ type: 'link', href: `mailto:${email}`, children: [{ type: 'text', text: email }] });
    } else if (em) {
      out.push({ type: 'em', children: parseInline(em.slice(1, -1)) });
    } else if (br) {
      out.push({ type: 'br' });
    } else if (autolink) {
      const target = autolink.slice(1, -1);
      const isEmail = !/^(https?:|mailto:)/i.test(target);
      const href = safeHref(isEmail ? `mailto:${target}` : target);
      const label = target.replace(/^mailto:/i, '');
      out.push(href ? { type: 'link', href, children: [{ type: 'text', text: label }] } : { type: 'text', text: label });
    } else if (sitePath) {
      const href = safeHref(sitePath);
      out.push(href ? { type: 'link', href, children: [{ type: 'text', text: sitePath }] } : { type: 'text', text: sitePath });
    } else {
      out.push({ type: 'text', text: whole });
    }
    last = m.index + whole.length;
  }
  if (last < src.length) out.push({ type: 'text', text: src.slice(last) });
  return out;
}

const BULLET_RE = /^\s*(?:[-*+\u2022])\s+(.*)$/;
const ORDERED_RE = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const HEADING_RE = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/;
const TABLE_ROW_RE = /^\s*\|.*\|\s*$/;
const TABLE_SEP_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const HR_RE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;

const splitRow = (line) =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => parseInline(c.trim()));

/**
 * Blocks: { type: 'p', lines: Inline[][] } | { type: 'h', children } | { type: 'ul' | 'ol', items, start }
 *       | { type: 'table', head, rows } | { type: 'pre', text } | { type: 'hr' }
 */
export function parseMarkdown(text) {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let para = null;
  let list = null;
  const flush = () => {
    para = null;
    list = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (/^\s*```/.test(line)) {
      flush();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'pre', text: body.join('\n') });
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }

    if (TABLE_ROW_RE.test(line) && i + 1 < lines.length && TABLE_SEP_RE.test(lines[i + 1])) {
      flush();
      const head = splitRow(line);
      const rows = [];
      i += 2;
      while (i < lines.length && TABLE_ROW_RE.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: 'table', head, rows });
      continue;
    }

    if (HR_RE.test(line)) {
      flush();
      blocks.push({ type: 'hr' });
      continue;
    }

    const heading = line.match(HEADING_RE);
    if (heading) {
      flush();
      blocks.push({ type: 'h', children: parseInline(heading[1]) });
      continue;
    }

    const bullet = line.match(BULLET_RE);
    const ordered = !bullet && line.match(ORDERED_RE);
    if (bullet || ordered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        para = null;
        list = { type, items: [], start: ordered ? Number(ordered[1]) : 1 };
        blocks.push(list);
      }
      list.items.push(parseInline(bullet ? bullet[1] : ordered[2]));
      continue;
    }

    // Indented continuation of the previous list item.
    if (list && /^\s{2,}\S/.test(line)) {
      const items = list.items;
      items[items.length - 1] = [...items[items.length - 1], { type: 'text', text: ' ' }, ...parseInline(line.trim())];
      continue;
    }

    list = null;
    if (!para) {
      para = { type: 'p', lines: [] };
      blocks.push(para);
    }
    para.lines.push(parseInline(line.trim()));
  }
  return blocks;
}
