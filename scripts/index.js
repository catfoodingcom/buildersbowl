// Checks every listing in listings/ and every Bowl in bowls/, and writes listings/index.json (newest first)
// and bowls/index.json (newest Bowl first).
// `node scripts/index.js --check` only checks: it fails if a file is bad or an index is out of date.
import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkListing, byNewest } from '../bowl/lib/listings.js';
import { checkBowl, byNumberDesc } from '../bowl/lib/bowls.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
let bad = 0;

/** Reads every *.json in a folder (but index.json) and checks each with `check`. Returns the good ones. */
async function readAll(folder, check) {
  const dir = path.join(root, folder);
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json') && f !== 'index.json').sort();
  const good = [];
  for (const file of files) {
    let item;
    try {
      item = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    } catch (e) {
      console.error(`✗ ${folder}/${file}: not valid JSON (${e.message})`);
      bad++;
      continue;
    }
    const problems = check(item, file);
    if (problems.length) {
      bad++;
      console.error(`✗ ${folder}/${file}`);
      for (const p of problems) console.error(`    ${p}`);
    } else good.push(item);
  }
  return good;
}

const bowls = await readAll('bowls', checkBowl);
const bowlNumbers = new Set(bowls.map((b) => b.number));

const listings = await readAll('listings', (l, file) => {
  const p = checkListing(l, file);
  if (l?.media && !existsSync(path.join(root, l.media))) p.push(`media file not found: ${l.media}`);
  if (Number.isInteger(l?.bowl) && !bowlNumbers.has(l.bowl)) p.push(`bowl ${l.bowl} has no file in bowls/`);
  return p;
});

const slugs = listings.map((l) => l.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) {
  console.error(`✗ the same slug twice: ${dupes.join(', ')}`);
  bad++;
}
if (bad) {
  console.error(`\n${bad} file(s) need fixing.`);
  process.exit(1);
}

const outputs = [
  [path.join(root, 'listings', 'index.json'), listings.sort(byNewest)],
  [path.join(root, 'bowls', 'index.json'), bowls.sort(byNumberDesc)],
];
for (const [file, items] of outputs) {
  const json = `${JSON.stringify(items, null, 2)}\n`;
  const name = path.relative(root, file);
  if (checkOnly) {
    if ((await readFile(file, 'utf8').catch(() => '')) !== json) {
      console.error(`✗ ${name} is out of date. Run \`npm run index\` and commit it.`);
      process.exit(1);
    }
  } else await writeFile(file, json);
}
if (!checkOnly) {
  // The preview page serves listing images from public/ (not committed); the site gets them its own way.
  const media = path.join(root, 'listings', 'media');
  if (existsSync(media)) await cp(media, path.join(root, 'public', 'listings', 'media'), { recursive: true });
}
console.log(`✓ ${listings.length} listing(s) and ${bowls.length} Bowl(s) fine; ${checkOnly ? 'the indexes are up to date' : 'wrote the indexes'}.`);
