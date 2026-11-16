const URL_RE = /(https:\/\/[^\s)]+)/g;

/** Text with any https link in it made clickable, shown by its site name. */
export default function Linkified({ text }) {
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
