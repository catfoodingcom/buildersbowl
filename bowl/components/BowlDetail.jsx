import { useState } from 'react';
import { formatDate } from '../lib/listings.js';
import { statusLabel } from '../lib/bowls.js';
import Linkified from './Linkified.jsx';
import ListingCard from './ListingCard.jsx';
import NetworkBadge from './NetworkBadge.jsx';

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="bowl-button bowl-button--quiet bowl-copy"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          },
          () => {},
        )
      }
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/** One Bowl's own page: the exercise, so anyone can do it, and the builds that came out of it. */
export default function BowlDetail({ bowl, builds, onBack, onOpenBuild, mediaBase }) {
  const b = bowl;
  return (
    <article className="bowl-detail bowl-detail--wide">
      <button type="button" className="bowl-back" onClick={onBack}>
        ← Builder&apos;s Bowl
      </button>
      <p className="bowl-meta bowl-detail__top">
        Bowl #{b.number} · {formatDate(b.date)} · {statusLabel[b.status]}
      </p>
      <h2 className="bowl-detail__name">{b.title}</h2>
      <p className="bowl-detail__tagline">{b.tagline}</p>
      <p className="bowl-detail__by">
        {b.where}.{b.turnout ? ` ${b.turnout}` : ''}
      </p>
      <p>
        <NetworkBadge network={b.network} chain={b.chain} />
      </p>
      {b.status !== 'upcoming' && <p className="bowl-note">You can still do it on your own, at your own pace.</p>}

      {b.needs?.length > 0 && (
        <section className="bowl-needs">
          <h3 className="bowl-needs__title">Before you start</h3>
          <ul>
            {b.needs.map((n) => (
              <li key={n}>
                <Linkified text={n} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {b.prompt && (
        <section className="bowl-needs">
          <h3 className="bowl-needs__title">Paste this into your agent</h3>
          <p className="bowl-prompt-text">{b.prompt}</p>
          <CopyButton text={b.prompt} />
        </section>
      )}

      <section className="bowl-needs">
        <h3 className="bowl-needs__title">The steps</h3>
        <ol>
          {b.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      {b.challenge && (
        <section className="bowl-needs bowl-needs--accent">
          <h3 className="bowl-needs__title">The challenge: {b.challenge.title}</h3>
          {b.challenge.text.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </section>
      )}

      {b.safety?.length > 0 && (
        <section className="bowl-needs">
          <h3 className="bowl-needs__title">Safety</h3>
          <ul>
            {b.safety.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {b.kit && (
        <div className="bowl-actions">
          <a className="bowl-button" href={b.kit} target="_blank" rel="noopener noreferrer">
            Open the kit
          </a>
        </div>
      )}

      <section className="bowl-section">
        <h3 className="bowl-section__title">Builds from Bowl #{b.number}</h3>
        {builds.length > 0 ? (
          <div className="bowl-grid">
            {builds.map((l) => (
              <ListingCard key={l.slug} listing={l} onOpen={onOpenBuild} mediaBase={mediaBase} />
            ))}
          </div>
        ) : (
          <p className="bowl-empty">No builds listed from this Bowl yet.</p>
        )}
      </section>
    </article>
  );
}
