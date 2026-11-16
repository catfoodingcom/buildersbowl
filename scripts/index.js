// Checks every listing in listings/ and writes listings/index.json (all listings, newest first).
// `node scripts/index.js --check` only checks: it fails if a listing is bad or index.json is out of date.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkListing, byNewest } from '../bowl/lib/listings.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'listings');
const out = path.join(dir, 'index.json');
const checkOnly = process.argv.includes('--check');

const files = (await readdir(dir)).filter((f) => f.endsWith('.json') && f !== 'index.json').sort();
const listings = [];
let bad = 0;
for (const file of files) {
  let l;
  try {
    l = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
  } catch (e) {
    console.error(`✗ ${file}: not valid JSON (${e.message})`);
    bad++;
    continue;
  }
  const problems = checkListing(l, file);
  if (problems.length) {
    bad++;
    console.error(`✗ ${file}`);
    for (const p of problems) console.error(`    ${p}`);
  } else listings.push(l);
}
const slugs = listings.map((l) => l.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) {
  console.error(`✗ the same slug twice: ${dupes.join(', ')}`);
  bad++;
}
if (bad) {
  console.error(`\n${bad} listing file(s) need fixing.`);
  process.exit(1);
}

const json = `${JSON.stringify(listings.sort(byNewest), null, 2)}\n`;
if (checkOnly) {
  const current = await readFile(out, 'utf8').catch(() => '');
  if (current !== json) {
    console.error('✗ listings/index.json is out of date. Run `npm run index` and commit it.');
    process.exit(1);
  }
  console.log(`✓ ${listings.length} listing(s) fine; index.json is up to date.`);
} else {
  await writeFile(out, json);
  console.log(`✓ ${listings.length} listing(s) fine; wrote listings/index.json.`);
}
