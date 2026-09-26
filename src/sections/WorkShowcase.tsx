import { LazyFrame } from "../frames/LazyFrame";
import "./WorkShowcase.css";

/**
 * DIQQAT: bu yerdagi demo Styles.kr ishi EMAS — ThreeUI Community (MIT, © Meng To) shabloni.
 * Mijozga ko'rsatiladigan ochiq saytda uni o'z case study'laringiz bilan almashtiring
 * yoki kreditni shu ko'rinishda qoldiring.
 */
export function WorkShowcase() {
  return (
    <section id="work" className="showcase" aria-labelledby="showcase-title">
      <div className="showcase__head">
        <h2 id="showcase-title" className="showcase__title">레퍼런스 데모</h2>
        <p className="showcase__lede">
          실제 브라우저에서 동작하는 3D 랜딩 페이지입니다. 화면에 보일 때만 실행되고,
          벗어나면 멈춰 기기 자원을 아낍니다.
        </p>
      </div>

      <figure className="showcase__item">
        <LazyFrame
          src="/landing-pages/complete-shelf-v2.html"
          title="Working Volumes — 3D 서가 랜딩 페이지 데모"
          poster={<div className="showcase__poster" aria-hidden="true" />}
        />
        <figcaption className="showcase__caption">
          <span>Working Volumes — 일곱 가지 도구를 3D 서가로 보여주는 에디토리얼 랜딩 페이지.</span>
          <span className="showcase__credit">
            원본: <a href="https://github.com/MengTo/threeui" rel="noopener noreferrer">ThreeUI Community</a> (MIT, Meng To)
          </span>
          <a className="showcase__open" href="/landing-pages/complete-shelf-v2.html" target="_blank" rel="noopener">
            전체 화면으로 보기
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
