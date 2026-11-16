// Bowls: the exercises set at each Builder's Bowl. One file per Bowl, bowls/<number>.json.
// Used by the page and by scripts/index.js (checking).
import { NETWORKS } from './listings.js';

export const BOWL_STATUSES = ['upcoming', 'open', 'closed'];

const isHttps = (u) => typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u);
const isText = (s) => typeof s === 'string' && s.trim().length > 0;
const isLines = (a) => Array.isArray(a) && a.length > 0 && a.every(isText);

/** Checks one Bowl. Returns a list of problems (empty when it's fine). `file` is its file name, if known. */
export function checkBowl(b, file) {
  const p = [];
  if (!b || typeof b !== 'object' || Array.isArray(b)) return ['not a JSON object'];
  if (!Number.isInteger(b.number) || b.number < 1) p.push('number must be 1, 2, 3…');
  if (file && Number.isInteger(b.number) && file !== `${b.number}.json`) p.push(`number ${b.number} must match the file name (${file})`);
  if (!isText(b.title)) p.push('title is missing');
  if (!isText(b.tagline)) p.push('tagline is missing');
  if (!isText(b.date) || !/^\d{4}-\d{2}-\d{2}$/.test(b.date) || Number.isNaN(Date.parse(b.date))) p.push('date must be YYYY-MM-DD');
  if (!isText(b.where)) p.push('where is missing');
  if (b.turnout != null && !isText(b.turnout)) p.push('turnout must be text');
  if (!BOWL_STATUSES.includes(b.status)) p.push(`status must be one of: ${BOWL_STATUSES.join(', ')}`);
  if (!NETWORKS.includes(b.network)) p.push(`network must be one of: ${NETWORKS.join(', ')}`);
  if (b.chain != null && !isText(b.chain)) p.push('chain must be text');
  if (b.kit != null && !isHttps(b.kit)) p.push('kit must be an https link');
  if (b.prompt != null && !isText(b.prompt)) p.push('prompt must be text');
  if (b.needs != null && !isLines(b.needs)) p.push('needs must be a list of short lines');
  if (!isLines(b.steps)) p.push('steps must be a list of lines');
  if (b.challenge != null && !(isText(b.challenge.title) && isLines(b.challenge.text))) p.push('challenge needs a title and text lines');
  if (b.safety != null && !isLines(b.safety)) p.push('safety must be a list of lines');
  return p;
}

/** Newest Bowl first. */
export const byNumberDesc = (a, b) => b.number - a.number;

/** Keeps only Bowls that pass the check. */
export const usableBowls = (bowls) => (Array.isArray(bowls) ? bowls.filter((b) => checkBowl(b).length === 0) : []);

export const statusLabel = { upcoming: 'Coming up', open: 'Open: do it on your own', closed: 'Closed' };
