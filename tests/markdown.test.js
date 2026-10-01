// Run with `npm test` (Node's built-in test runner; no extra dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInline, parseMarkdown } from '../src/utils/markdown.js';

/** Flattens inline tokens to a compact string: links as [label](href), others as type{...}. */
const flat = (nodes) =>
  nodes
    .map((n) => {
      if (n.type === 'link') return `[${flat(n.children)}](${n.href})`;
      if (n.type === 'text') return n.text;
      if (n.type === 'code') return `\`${n.text}\``;
      if (n.type === 'br') return '<BR>';
      return `${n.type}{${flat(n.children)}}`;
    })
    .join('');

const walk = (nodes) => nodes.flatMap((n) => [n, ...(n.children ? walk(n.children) : [])]);

const cases = [
  // autolinks: brackets are dropped
  ['repo <https://github.com/DHYEY166/rag>', 'repo [https://github.com/DHYEY166/rag](https://github.com/DHYEY166/rag)'],
  ['mail <mailto:dvdesai06@gmail.com>.', 'mail [dvdesai06@gmail.com](mailto:dvdesai06@gmail.com).'],
  ['mail <dvdesai06@gmail.com>', 'mail [dvdesai06@gmail.com](mailto:dvdesai06@gmail.com)'],
  ['unclosed <https://a.com/x', 'unclosed <[https://a.com/x](https://a.com/x)'],
  // unsafe input stays text
  ['bad <javascript:alert(1)>', 'bad <javascript:alert(1)>'],
  ['bad [x](javascript:alert(1))', 'bad x)'],
  ['html <img src=x onerror=alert(1)>', 'html <img src=x onerror=alert(1)>'],
  ['<script>alert(1)</script>', '<script>alert(1)</script>'],
  // site-relative paths become same-origin links
  ['**Contact form:** /#contact', 'strong{Contact form:} [/#contact](/#contact)'],
  ['**Resume PDF:** /Dhyey_Desai_Resume.pdf.', 'strong{Resume PDF:} [/Dhyey_Desai_Resume.pdf](/Dhyey_Desai_Resume.pdf).'],
  ['Visit /chatbot, or (/#about)', 'Visit [/chatbot](/chatbot), or ([/#about](/#about))'],
  // ...but not slashes inside words, protocol-relative URLs, or odd paths
  ['and/or 24/7 TCP/IP github.com/DHYEY166', 'and/or 24/7 TCP/IP github.com/DHYEY166'],
  ['protocol-relative //evil.com/x', 'protocol-relative //evil.com/x'],
  ['odd /foo.bar.baz path', 'odd /foo.bar.baz path'],
  ['`/#contact` stays code', '`/#contact` stays code'],
  // existing behaviour
  ['see https://doi.org/10.3390/diagnostics16162494.', 'see [https://doi.org/10.3390/diagnostics16162494](https://doi.org/10.3390/diagnostics16162494).'],
  ['[home](/#about) and [x](https://a.com)', '[home](/#about) and [x](https://a.com)'],
  ['email dvdesai06@gmail.com plain', 'email [dvdesai06@gmail.com](mailto:dvdesai06@gmail.com) plain'],
  ['*italic* and **bold**', 'em{italic} and strong{bold}'],
];

for (const [input, want] of cases) {
  test(`inline: ${input}`, () => {
    assert.equal(flat(parseInline(input)), want);
  });
}

test('every produced link uses a safe href', () => {
  const links = walk(cases.flatMap(([input]) => parseInline(input))).filter((n) => n.type === 'link');
  assert.ok(links.length > 0);
  for (const n of links) assert.match(n.href, /^(https?:\/\/|mailto:|\/(?!\/))/);
});

test('autolink on a list continuation line (live reply sample)', () => {
  const blocks = parseMarkdown('- **Policy RAG Assistant** – RAG.  \n  <https://github.com/DHYEY166/rag>  \n\n- **BEACON** – x');
  assert.equal(
    flat(blocks[0].items[0]),
    'strong{Policy RAG Assistant} – RAG.   [https://github.com/DHYEY166/rag](https://github.com/DHYEY166/rag)',
  );
});
