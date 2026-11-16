import { kindLabel } from '../lib/listings.js';

/** The listing's 1200×630 image, or a plain tile with its kind (and Bowl) when it has none. */
export default function Media({ listing, mediaBase = '' }) {
  if (listing.media) return <img className="bowl-media" src={`${mediaBase}${listing.media}`} alt="" loading="lazy" width="1200" height="630" />;
  return (
    <div className="bowl-media bowl-media--blank" aria-hidden="true">
      <span className="bowl-media__name">{kindLabel(listing.kind)}</span>
      {listing.bowl ? <span className="bowl-media__kind">Bowl #{listing.bowl}</span> : null}
    </div>
  );
}
