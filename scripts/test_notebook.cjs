const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../dist/assets/notebook.js'), 'utf8');
function harness(initial, denyWrites = false) {
  let raw = initial;
  class Element {
    constructor() { this.value = ''; this.children = []; this.events = {}; this.textContent = ''; }
    addEventListener(name, callback) { this.events[name] = callback; }
    append(...children) { this.children.push(...children); }
    replaceChildren() { this.children = []; }
    reportValidity() { return true; }
    click() {}
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  vm.runInNewContext(code, {
    document: { getElementById: get, createElement: () => new Element() },
    location: { pathname: '/repo/my-research.html' },
    localStorage: { getItem: () => raw ?? null, setItem: (_, value) => { if (denyWrites) throw new Error('QuotaExceededError'); raw = value; } },
    window: { addEventListener() {} }, crypto: { randomUUID: () => 'test-note-0001' }, Date, Blob, URL, setTimeout
  });
  return { get, raw: () => raw, import: async data => get('import-notes').events.change({target: {files: [{size: JSON.stringify(data).length, text: async () => JSON.stringify(data)}], value: ''}}) };
}
const entry = {id: 'test-note-0002', createdAt: '2026-11-01T12:00:00.000Z', asOf: '2026-11-01', reviewDate: '2026-11-07', company: 'Test', thesis: '<script>alert(1)</script>', evidence: 'source', invalidation: 'failure'};
const backup = entries => ({app: 'evade-research', version: 1, entries});
(async () => {
  const h = harness();
  await h.import(backup([entry]));
  assert.equal(JSON.parse(h.raw()).entries.length, 1);
  assert.equal(h.get('saved-notes').children[0].children[3].textContent, entry.thesis);
  await h.import(backup([entry]));
  assert.equal(JSON.parse(h.raw()).entries.length, 1);
  const saved = h.raw();
  await h.import(backup([{...entry, id: 'test-note-0003'}, {...entry, thesis: 'conflict'}]));
  assert.equal(h.raw(), saved, 'Conflicting merge must be atomic');
  await h.import(backup([{...entry, id: 'test-note-0004', asOf: '2026-02-30'}]));
  assert.equal(h.raw(), saved, 'Invalid date must not change storage');
  await h.import(backup([entry, entry]));
  assert.equal(h.raw(), saved, 'Duplicate IDs in a backup must be rejected');
  await h.import({app: 'another-app', version: 1, entries: []});
  assert.equal(h.raw(), saved);
  const corrupt = harness('{bad');
  assert.equal(corrupt.get('save-note').disabled, true);
  assert.equal(corrupt.get('import-notes').disabled, true);
  assert.equal(corrupt.raw(), '{bad', 'Corrupt data must be preserved');
  const full = harness(saved, true);
  for (const key of ['company','thesis','evidence','invalidation']) full.get(key).value = 'unsaved';
  full.get('as-of').value = '2026-11-01'; full.get('review-date').value = '2026-11-07';
  full.get('note-form').events.submit({preventDefault() {}});
  assert.equal(full.raw(), saved);
  assert.equal(full.get('thesis').value, 'unsaved', 'Quota failures must retain form text');
  console.log('PASS: safe text, merge, deduplication, atomic conflict rejection, date/schema validation, corruption and quota recovery.');
})();
