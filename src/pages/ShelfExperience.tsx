import "./ShelfExperience.css";

/** Full viewport presentation of the original, credited ThreeUI Community page. */
export function ShelfExperience() {
  return (
    <main className="shelf-experience">
      <iframe
        className="shelf-experience__frame"
        src="/landing-pages/complete-shelf-v2.html"
        title="Working Volumes — interactive ThreeUI bookshelf"
        allow="fullscreen"
      />
      <div className="shelf-experience__toolbar">
        <a href="#studio" className="shelf-experience__studio">Styles.kr <span aria-hidden="true">↗</span></a>
        <span className="shelf-experience__credit">
          Reference demo by <a href="https://github.com/MengTo/threeui" target="_blank" rel="noopener noreferrer">ThreeUI Community</a>
        </span>
      </div>
    </main>
  );
}
