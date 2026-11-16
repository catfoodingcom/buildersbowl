import { formatDate } from '../lib/listings.js';
import { statusLabel } from '../lib/bowls.js';

/** One Bowl in the list: its number, title and date. Opens the exercise. */
export default function BowlCard({ bowl, builds, onOpen }) {
  const b = bowl;
  return (
    <article className="bowl-exercise">
      <a
        className="bowl-exercise__link"
        href={`?page=builders&bowl=${b.number}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onOpen(b.number);
        }}
      >
        <span className="bowl-exercise__number">#{b.number}</span>
        <span className="bowl-exercise__body">
          <span className="bowl-meta">
            {formatDate(b.date)} · {statusLabel[b.status]}
          </span>
          <span className="bowl-exercise__title">{b.title}</span>
          <span className="bowl-exercise__tagline">{b.tagline}</span>
          <span className="bowl-exercise__foot">
            {builds === 1 ? '1 build' : `${builds} builds`} · Open the exercise →
          </span>
        </span>
      </a>
    </article>
  );
}
