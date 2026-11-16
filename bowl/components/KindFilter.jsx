import { KINDS } from '../lib/listings.js';

/** All, Skills, Apps, Games, Agents, each with how many there are. */
export default function KindFilter({ listings, value, onChange }) {
  const count = (id) => listings.filter((l) => l.kind === id).length;
  const options = [{ id: 'all', label: 'All', n: listings.length }, ...KINDS.map((k) => ({ id: k.id, label: k.label, n: count(k.id) }))];
  return (
    <div className="bowl-filter" role="tablist" aria-label="Kind of build">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          className={`bowl-filter__tab${value === o.id ? ' is-on' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label} <span className="bowl-filter__n">{o.n}</span>
        </button>
      ))}
    </div>
  );
}
