'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ADD_URL, KINDS, byNewest, usable } from './lib/listings.js';
import KindFilter from './components/KindFilter.jsx';
import ListingCard from './components/ListingCard.jsx';
import ListingDetail from './components/ListingDetail.jsx';
import './bowl.css';

/** Reads `l` (the open listing) from the address bar, so a build's view has its own link. */
const slugFromUrl = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('l'));

// On catfooding.com the page is chosen by ?page=builders, and the site's menu doesn't put it in the address bar.
// Setting it here keeps a build's link (?page=builders&l=<slug>) working when it's shared or reloaded.
function setSlugInUrl(slug) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', 'builders');
  if (slug) url.searchParams.set('l', slug);
  else url.searchParams.delete('l');
  window.history.pushState({ bowl: slug }, '', url);
}

/**
 * Builder's Bowl: the builds from Catfooding's Builder's Bowls.
 * `listings` is the array in listings/index.json. `mediaBase` is put in front of each listing's `media` path.
 */
export default function BuildersBowl({ listings, mediaBase = '' }) {
  const all = useMemo(() => usable(listings).sort(byNewest), [listings]);
  const [kind, setKind] = useState('all');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen(slugFromUrl());
    const onPop = () => setOpen(slugFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const show = useCallback((slug) => {
    setSlugInUrl(slug);
    setOpen(slug);
    window.scrollTo?.({ top: 0 });
  }, []);

  const current = open ? all.find((l) => l.slug === open) : null;
  if (current) {
    return (
      <div className="bowl">
        <ListingDetail listing={current} onBack={() => show(null)} mediaBase={mediaBase} />
      </div>
    );
  }

  const featured = all.filter((l) => l.featured);
  const shown = kind === 'all' ? all : all.filter((l) => l.kind === kind);
  const kindName = KINDS.find((k) => k.id === kind)?.label.toLowerCase();

  return (
    <div className="bowl">
      <header className="bowl-head">
        <p className="bowl-eyebrow">Builder&apos;s Bowl</p>
        <h1 className="bowl-title">What builders made at the Bowls.</h1>
        <p className="bowl-lede">
          Builder&apos;s Bowls are hands-on build sessions at Catfooding meetups in Bangkok: you, your coding agent and an
          afternoon. These are the skills, apps, games and agents that came out of them. Try them, read the code, see who
          made them.
        </p>
        <a className="bowl-add" href={ADD_URL} target="_blank" rel="noopener noreferrer">
          Add your build
        </a>
      </header>

      {open && <p className="bowl-note">That build isn&apos;t listed (any more). Here are the others.</p>}

      {featured.length > 0 && (
        <section className="bowl-section">
          <h2 className="bowl-section__title">Featured</h2>
          <div className="bowl-grid bowl-grid--featured">
            {featured.map((l) => (
              <ListingCard key={l.slug} listing={l} onOpen={show} mediaBase={mediaBase} />
            ))}
          </div>
        </section>
      )}

      <section className="bowl-section">
        <h2 className="bowl-section__title">Newest</h2>
        <KindFilter listings={all} value={kind} onChange={setKind} />
        {shown.length > 0 ? (
          <div className="bowl-grid">
            {shown.map((l) => (
              <ListingCard key={l.slug} listing={l} onOpen={show} mediaBase={mediaBase} />
            ))}
          </div>
        ) : (
          <p className="bowl-empty">
            No {kindName ?? 'builds'} yet. Built one at a Bowl?{' '}
            <a href={ADD_URL} target="_blank" rel="noopener noreferrer">
              Add it
            </a>
            .
          </p>
        )}
      </section>
    </div>
  );
}
