'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ADD_URL, KINDS, byNewest, usable } from './lib/listings.js';
import { byNumberDesc, usableBowls } from './lib/bowls.js';
import BowlCard from './components/BowlCard.jsx';
import BowlDetail from './components/BowlDetail.jsx';
import KindFilter from './components/KindFilter.jsx';
import ListingCard from './components/ListingCard.jsx';
import ListingDetail from './components/ListingDetail.jsx';
import './bowl.css';

/** What's open, from the address bar: a build (?l=<slug>), a Bowl (?bowl=<number>), or neither. */
function viewFromUrl() {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  const bowl = Number(q.get('bowl'));
  return { slug: q.get('l'), bowl: Number.isInteger(bowl) && bowl > 0 ? bowl : null };
}

// On catfooding.com the page is chosen by ?page=builders, and the site's menu doesn't put it in the address bar.
// Setting it here keeps a link to a build or a Bowl working when it's shared or reloaded.
function setViewInUrl({ slug = null, bowl = null }) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', 'builders');
  if (slug) url.searchParams.set('l', slug);
  else url.searchParams.delete('l');
  if (bowl) url.searchParams.set('bowl', String(bowl));
  else url.searchParams.delete('bowl');
  window.history.pushState({ slug, bowl }, '', url);
}

/**
 * Builder's Bowl: the Bowls (the exercise set at each meetup) and the builds that came out of them.
 * `listings` is the array in listings/index.json, `bowls` the array in bowls/index.json.
 * `mediaBase` is put in front of each listing's `media` path.
 */
export default function BuildersBowl({ listings, bowls = [], mediaBase = '' }) {
  const all = useMemo(() => usable(listings).sort(byNewest), [listings]);
  const allBowls = useMemo(() => usableBowls(bowls).sort(byNumberDesc), [bowls]);
  const [kind, setKind] = useState('all');
  const [view, setView] = useState({});

  useEffect(() => {
    setView(viewFromUrl());
    const onPop = () => setView(viewFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const show = useCallback((next) => {
    setViewInUrl(next);
    setView(next);
    window.scrollTo?.({ top: 0 });
  }, []);
  const openBuild = useCallback((slug) => show({ slug }), [show]);
  const openBowl = useCallback((bowl) => show({ bowl }), [show]);
  const home = useCallback(() => show({}), [show]);

  const buildsOf = (n) => all.filter((l) => l.bowl === n);
  const hasBowl = (n) => allBowls.some((b) => b.number === n);

  const build = view.slug ? all.find((l) => l.slug === view.slug) : null;
  if (build) {
    return (
      <div className="bowl">
        <ListingDetail listing={build} onBack={home} onBowl={openBowl} hasBowl={hasBowl(build.bowl)} mediaBase={mediaBase} />
      </div>
    );
  }
  const bowl = view.bowl ? allBowls.find((b) => b.number === view.bowl) : null;
  if (bowl) {
    return (
      <div className="bowl">
        <BowlDetail bowl={bowl} builds={buildsOf(bowl.number)} onBack={home} onOpenBuild={openBuild} mediaBase={mediaBase} />
      </div>
    );
  }

  const featured = all.filter((l) => l.featured);
  const shown = kind === 'all' ? all : all.filter((l) => l.kind === kind);
  const kindName = KINDS.find((k) => k.id === kind)?.label.toLowerCase();
  const missing = view.slug || view.bowl;

  return (
    <div className="bowl">
      <header className="bowl-head">
        <p className="bowl-eyebrow">Builder&apos;s Bowl</p>
        <h1 className="bowl-title">Build with your agent. Show what you made.</h1>
        <p className="bowl-lede">
          Builder&apos;s Bowls are hands-on build and demo sessions at Catfooding meetups. Bring your coding agent and go
          catfooding: use what you build, and get real people to use it too. These are the skills, apps, games and
          agents built or demoed at our sessions. Each Bowl&apos;s exercise is further down, and you can still do it on
          your own.
        </p>
        <a className="bowl-add" href={ADD_URL} target="_blank" rel="noopener noreferrer">
          Add your build
        </a>
      </header>

      {missing && <p className="bowl-note">That {view.slug ? 'build' : 'Bowl'} isn&apos;t listed (any more). Here&apos;s everything else.</p>}

      {featured.length > 0 && (
        <section className="bowl-section">
          <h2 className="bowl-section__title">Featured builds</h2>
          <div className="bowl-grid bowl-grid--featured">
            {featured.map((l) => (
              <ListingCard key={l.slug} listing={l} onOpen={openBuild} mediaBase={mediaBase} />
            ))}
          </div>
        </section>
      )}

      <section className="bowl-section">
        <h2 className="bowl-section__title">All builds, newest first</h2>
        <KindFilter listings={all} value={kind} onChange={setKind} />
        {shown.length > 0 ? (
          <div className="bowl-grid">
            {shown.map((l) => (
              <ListingCard key={l.slug} listing={l} onOpen={openBuild} mediaBase={mediaBase} />
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

      {allBowls.length > 0 && (
        <section className="bowl-section">
          <h2 className="bowl-section__title">The Bowls</h2>
          <div className="bowl-exercises">
            {allBowls.map((b) => (
              <BowlCard key={b.number} bowl={b} builds={buildsOf(b.number).length} onOpen={openBowl} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
