import { formatDate, kindLabel, reportUrl } from '../lib/listings.js';
import Media from './Media.jsx';
import NetworkBadge from './NetworkBadge.jsx';

const URL_RE = /(https:\/\/[^\s)]+)/g;

/** A "needs" line, with any https link in it made clickable. */
function Line({ text }) {
  // split() with a capture group puts each link at an odd index.
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part.replace(/^https:\/\//, '').replace(/\/.*$/, '')}
      </a>
    ) : (
      part
    ),
  );
}

function Builder({ builder }) {
  const links = [
    builder.x && { href: `https://x.com/${builder.x}`, label: `@${builder.x}` },
    builder.github && { href: `https://github.com/${builder.github}`, label: 'GitHub' },
  ].filter(Boolean);
  return (
    <span>
      by <strong>{builder.name}</strong>
      {links.map((k) => (
        <span key={k.href}>
          {' · '}
          <a href={k.href} target="_blank" rel="noopener noreferrer">
            {k.label}
          </a>
        </span>
      ))}
    </span>
  );
}

/** One build's own view. */
export default function ListingDetail({ listing, onBack, mediaBase }) {
  const l = listing;
  return (
    <article className="bowl-detail">
      <button type="button" className="bowl-back" onClick={onBack}>
        ← All builds
      </button>
      <Media listing={l} mediaBase={mediaBase} />
      <p className="bowl-meta">
        {kindLabel(l.kind)}
        {l.bowl ? ` · Built at Bowl #${l.bowl}` : ''} · Added {formatDate(l.added)}
      </p>
      <h2 className="bowl-detail__name">{l.name}</h2>
      <p className="bowl-detail__tagline">{l.tagline}</p>
      <p className="bowl-detail__by">
        <Builder builder={l.builder} />
      </p>
      <p>
        <NetworkBadge network={l.network} chain={l.chain} />
      </p>
      {l.network === 'testnet' && <p className="bowl-note">Testnet: it uses test money, not real funds.</p>}
      {l.network === 'mainnet' && <p className="bowl-note bowl-note--warn">This build uses real funds. Read what it does before you connect a wallet.</p>}

      {l.needs?.length > 0 && (
        <section className="bowl-needs">
          <h3 className="bowl-needs__title">Before you start</h3>
          <ul>
            {l.needs.map((n) => (
              <li key={n}>
                <Line text={n} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="bowl-actions">
        <a className="bowl-button" href={l.links.try} target="_blank" rel="noopener noreferrer">
          Try it
        </a>
        {l.links.code && (
          <a className="bowl-button bowl-button--quiet" href={l.links.code} target="_blank" rel="noopener noreferrer">
            See the code
          </a>
        )}
      </div>
      <p className="bowl-report">
        Something wrong with this build?{' '}
        <a href={reportUrl(l.slug)} target="_blank" rel="noopener noreferrer">
          Report it
        </a>
      </p>
    </article>
  );
}
