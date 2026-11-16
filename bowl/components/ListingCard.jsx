import { kindLabel } from '../lib/listings.js';
import Media from './Media.jsx';
import NetworkBadge from './NetworkBadge.jsx';

/** One build in the list. The whole card opens its detail view. */
export default function ListingCard({ listing, onOpen, mediaBase }) {
  const l = listing;
  return (
    <article className="bowl-listing">
      <a
        className="bowl-listing__link"
        href={`?page=builders&l=${l.slug}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onOpen(l.slug);
        }}
      >
        <Media listing={l} mediaBase={mediaBase} />
        <div className="bowl-listing__body">
          <p className="bowl-meta">
            {kindLabel(l.kind)}
            {l.bowl ? ` · Bowl #${l.bowl}` : ''}
            {l.featured ? ' · Featured' : ''}
          </p>
          <h3 className="bowl-listing__name">{l.name}</h3>
          <p className="bowl-listing__tagline">{l.tagline}</p>
          <p className="bowl-listing__foot">
            <span className="bowl-listing__by">by {l.builder.name}</span>
            <NetworkBadge network={l.network} chain={l.chain} />
          </p>
        </div>
      </a>
    </article>
  );
}
