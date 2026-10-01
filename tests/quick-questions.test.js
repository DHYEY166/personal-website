// The quick-question chips are always available, and the page falls back to offline answers
// when the chat API fails, so every chip must map to a specific (non-generic) fallback answer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickQuestions } from '../src/data/quickQuestions.js';
import { getFallbackResponse } from '../src/data/qaContext.js';

const GENERIC = getFallbackResponse('zzz unrelated question');

test('there are five unique quick questions', () => {
  assert.equal(quickQuestions.length, 5);
  assert.equal(new Set(quickQuestions).size, quickQuestions.length);
  for (const q of quickQuestions) assert.match(q, /\?$/);
});

const expected = [
  [/Associate Forward Deployed Engineer/, 'current role'],
  [/Diagnostics|IEMECON/, 'publications'],
  [/BEACON|Policy RAG/, 'projects'],
  [/Python/, 'skills'],
  [/dvdesai06@gmail\.com/, 'contact'],
];

quickQuestions.forEach((q, i) => {
  test(`fallback answer for "${q}" is the ${expected[i][1]} answer`, () => {
    const answer = getFallbackResponse(q);
    assert.notEqual(answer, GENERIC);
    assert.match(answer, expected[i][0]);
  });
});
