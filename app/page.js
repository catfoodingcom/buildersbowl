import listings from '../listings/index.json';
import BuildersBowl from '../bowl/BuildersBowl.jsx';

// The preview page: renders <BuildersBowl> on the site's background, the way catfooding.com will.
// Only bowl/ goes to the site; this page doesn't.
export default function Preview() {
  return (
    <main className="preview">
      <p className="preview__flag">Preview · on catfooding.com this replaces the Builder&apos;s Bowls page</p>
      <BuildersBowl listings={listings} />
    </main>
  );
}
