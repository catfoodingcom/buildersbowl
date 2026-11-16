import { formatDate, kindLabel, reportUrl } from '../lib/listings.js';
import Media from './Media.jsx';
import NetworkBadge from './NetworkBadge.jsx';
import Linkified from './Linkified.jsx';

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
export default function ListingDetail({ listing, onBack, onBowl, hasBowl, mediaBase }) {
  const l = listing;
  return (
    <article className="bowl-detail">
      <button type="button" className="bowl-back" onClick={onBack}>
        ← All builds
      </button>
      <Media listing={l} mediaBase={mediaBase} />
      <p className="bowl-meta">
        {kindLabel(l.kind)}
        {l.bowl ? (
          <>
            {' · '}
            {hasBowl ? (
              <a href={`?page=builders&bowl=${l.bowl}`} onClick={(e) => (e.preventDefault(), onBowl(l.bowl))}>
                Built at Bowl #{l.bowl}
              </a>
            ) : (
              `Built at Bowl #${l.bowl}`
            )}
          </>
        ) : null}{' '}
        · Added {formatDate(l.added)}
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
                <Linkified text={n} />
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
