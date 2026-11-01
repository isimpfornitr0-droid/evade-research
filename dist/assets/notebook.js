(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const key = 'evade-research:notebook:v1:' + location.pathname.replace(/[^/]*$/, '');
  const maxEntries = 1000;
  let blocked = false;
  const message = text => { $('notebook-status').textContent = text; };
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  function validate(data) {
    if (!data || data.app !== 'evade-research' || data.version !== 1 || !Array.isArray(data.entries) || data.entries.length > maxEntries) throw new Error('Unsupported backup format or too many notes.');
    const ids = new Set();
    const entries = data.entries.map(item => {
      if (!item || typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(item.id) || ids.has(item.id)) throw new Error('Invalid or duplicate note ID.');
      ids.add(item.id);
      if (!validDate(item.asOf) || !validDate(item.reviewDate) || typeof item.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(item.createdAt) || !Number.isFinite(Date.parse(item.createdAt))) throw new Error('Invalid note date.');
      const clean = { id: item.id, createdAt: item.createdAt, asOf: item.asOf, reviewDate: item.reviewDate };
      for (const [field, limit] of [['company', 100], ['thesis', 6000], ['evidence', 6000], ['invalidation', 6000]]) {
        if (typeof item[field] !== 'string' || !item[field].trim() || item[field].length > limit) throw new Error('Invalid or oversized note text.');
        clean[field] = item[field];
      }
      return clean;
    });
    return { app: 'evade-research', version: 1, entries };
  }
  const read = () => {
    const raw = localStorage.getItem(key);
    return raw === null ? { app: 'evade-research', version: 1, entries: [] } : validate(JSON.parse(raw));
  };
  function render(data) {
    const list = $('saved-notes');
    list.replaceChildren();
    $('note-count').textContent = `${data.entries.length} saved ${data.entries.length === 1 ? 'note' : 'notes'}`;
    $('notes-empty').hidden = data.entries.length !== 0;
    for (const entry of [...data.entries].reverse()) {
      const card = document.createElement('article'); card.className = 'local-note';
      const title = document.createElement('h3'); title.textContent = entry.company; card.append(title);
      const date = document.createElement('p'); date.className = 'meta'; date.textContent = `Evidence as of ${entry.asOf} · Review ${entry.reviewDate}`; card.append(date);
      for (const [field, label] of [['thesis', 'My interpretation'], ['evidence', 'Evidence and sources'], ['invalidation', 'What would change my mind?']]) {
        const heading = document.createElement('h4'); heading.textContent = label;
        const paragraph = document.createElement('p'); paragraph.textContent = entry[field]; card.append(heading, paragraph);
      }
      list.append(card);
    }
  }
  function refresh() {
    try { render(read()); blocked = false; $('save-note').disabled = false; $('import-notes').disabled = false; }
    catch { blocked = true; $('save-note').disabled = true; $('import-notes').disabled = true; message('Saved data could not be read, or browser storage is blocked. Nothing was changed. Export a recovery copy before troubleshooting.'); }
  }
  function commit(data) {
    const clean = validate(data);
    if (new Blob([JSON.stringify(clean, null, 2)]).size > 1024 * 1024) throw new Error('Notebook has reached the 1 MB backup limit. Export it before starting another notebook.');
    localStorage.setItem(key, JSON.stringify(clean));
    render(clean);
  }
  $('as-of').value = new Date().toLocaleDateString('en-CA');
  $('note-form').addEventListener('submit', event => {
    event.preventDefault();
    if (blocked || !$('note-form').reportValidity()) return;
    try {
      const data = read();
      const entry = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), asOf: $('as-of').value, reviewDate: $('review-date').value };
      for (const field of ['company', 'thesis', 'evidence', 'invalidation']) entry[field] = $(field).value.trim();
      data.entries.push(entry); commit(data);
      for (const field of ['company', 'thesis', 'evidence', 'invalidation']) $(field).value = '';
      message('Note saved in this browser. Export a backup to keep a separate copy.');
    } catch (error) { message('Could not save. Your form is still here. ' + error.message); }
  });
  $('export-notes').addEventListener('click', () => {
    try {
      const raw = localStorage.getItem(key);
      const content = blocked ? raw : JSON.stringify(read(), null, 2);
      if (content === null) throw new Error('No saved data to export.');
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = `evade-research-backup-${new Date().toISOString().slice(0, 10)}${blocked ? '-recovery' : ''}.json`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); message('Backup download started. Keep this file outside the website repository.');
    } catch (error) { message('Could not export: ' + error.message); }
  });
  $('import-notes').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file || blocked) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Backup exceeds the 1 MB import limit.');
      const incoming = validate(JSON.parse(await file.text()));
      const data = read(); const existing = new Map(data.entries.map(entry => [entry.id, entry]));
      let added = 0;
      for (const entry of incoming.entries) {
        if (existing.has(entry.id)) {
          if (JSON.stringify(existing.get(entry.id)) !== JSON.stringify(entry)) throw new Error('A note ID conflicts with existing text. Import cancelled; nothing was changed.');
        } else { data.entries.push(entry); existing.set(entry.id, entry); added++; }
      }
      commit(data); message(`Imported ${added} new notes; ${incoming.entries.length - added} exact duplicates skipped.`);
    } catch (error) { message('Import failed. ' + error.message); }
    finally { event.target.value = ''; }
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { refresh(); if (!blocked) message('Saved notes updated from another tab. Your unsaved form is unchanged.'); } });
  refresh();
})();
