// Listings: the only place that knows their shape and where they come from.
// Used by the page (sorting, filtering) and by scripts/index.js (checking).

export const KINDS = [
  { id: 'skill', label: 'Skills', one: 'Skill' },
  { id: 'app', label: 'Apps', one: 'App' },
  { id: 'game', label: 'Games', one: 'Game' },
  { id: 'agent', label: 'Agents', one: 'Agent' },
];

export const NETWORKS = ['testnet', 'mainnet', 'none'];

export const REPO_URL = 'https://github.com/catfoodingcom/buildersbowl';
export const ADD_URL = `${REPO_URL}#add-your-build`;

export const kindLabel = (id) => KINDS.find((k) => k.id === id)?.one ?? id;

/** A "report this" link: a new issue on the repo, titled with the listing's slug. */
export const reportUrl = (slug) =>
  `${REPO_URL}/issues/new?title=${encodeURIComponent(`report: ${slug}`)}&body=${encodeURIComponent('What is wrong with this listing?\n\n')}`;

const isHttps = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u);
const isText = (s) => typeof s === 'string' && s.trim().length > 0;

/** Checks one listing. Returns a list of problems (empty when it's fine). `file` is its file name, if known. */
export function checkListing(l, file) {
  const p = [];
  if (!l || typeof l !== 'object' || Array.isArray(l)) return ['not a JSON object'];
  if (!isText(l.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.slug)) p.push('slug: lowercase letters, numbers and hyphens');
  if (file && l.slug && file !== `${l.slug}.json`) p.push(`slug "${l.slug}" must match the file name (${file})`);
  if (!isText(l.name)) p.push('name is missing');
  if (!KINDS.some((k) => k.id === l.kind)) p.push(`kind must be one of: ${KINDS.map((k) => k.id).join(', ')}`);
  if (!isText(l.tagline)) p.push('tagline is missing');
  else if (l.tagline.length > 160) p.push('tagline: keep it under 160 characters');
  if (!l.builder || !isText(l.builder.name)) p.push('builder.name is missing');
  if (!l.links || !isHttps(l.links.try)) p.push('links.try must be an https link');
  if (l.links?.code != null && !isHttps(l.links.code)) p.push('links.code must be an https link');
  if (l.media != null && !(typeof l.media === 'string' && /^listings\/media\/[a-z0-9-]+\.(png|jpg|webp)$/.test(l.media)))
    p.push('media must be null or listings/media/<slug>.png');
  if (l.needs != null && !(Array.isArray(l.needs) && l.needs.every(isText))) p.push('needs must be a list of short lines');
  if (!NETWORKS.includes(l.network)) p.push(`network must be one of: ${NETWORKS.join(', ')}`);
  if (l.chain != null && !isText(l.chain)) p.push('chain must be text');
  if (!(l.bowl === null || (Number.isInteger(l.bowl) && l.bowl > 0))) p.push('bowl must be a number or null');
  if (l.featured != null && typeof l.featured !== 'boolean') p.push('featured must be true or false');
  if (!isText(l.added) || !/^\d{4}-\d{2}-\d{2}$/.test(l.added) || Number.isNaN(Date.parse(l.added))) p.push('added must be a date, YYYY-MM-DD');
  return p;
}

/** Newest first; ties by name. */
export const byNewest = (a, b) => (a.added === b.added ? a.name.localeCompare(b.name) : a.added < b.added ? 1 : -1);

/** Keeps only listings that pass the check, so one bad file can't break the page. */
export const usable = (listings) => (Array.isArray(listings) ? listings.filter((l) => checkListing(l).length === 0) : []);

export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
