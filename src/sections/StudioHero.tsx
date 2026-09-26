import { LazyScene } from "../three/LazyScene";
import "./StudioHero.css";

const loadVessel = () => import("../three/scenes/celadonVessel");

export function StudioHero() {
  return (
    <header className="hero">
      <nav className="hero__nav" aria-label="주요 메뉴">
        <a className="hero__brand" href="#studio">Styles.kr</a>
        <ul>
          <li><a href="#work">작업</a></li>
          <li><a href="#process">진행 방식</a></li>
          <li><a href="#contact">문의</a></li>
          <li><a href="#playground">플레이그라운드</a></li>
          <li><a href="#shelf">서가 데모</a></li>
        </ul>
      </nav>

      <LazyScene
        className="hero__scene"
        load={loadVessel}
        label="천천히 회전하는 청자 빛깔의 도자기 형태"
        fallback={<div className="hero__fallback" />}
      />

      <div className="hero__copy">
        <h1 className="hero__title">
          <span>손끝의 감각이</span>
          <span>느껴지는 웹사이트</span>
        </h1>
        <p className="hero__lede">
          Styles.kr는 브랜드마다 하나뿐인 인터페이스와 3D 경험을 설계하고 직접 개발합니다.
          첫 화면에서 기억되고, 모든 기기에서 가볍게 작동하도록.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#contact">프로젝트 상담하기</a>
          <a className="btn btn--ghost" href="#work">작업 보기</a>
          <a className="btn btn--ghost" href="#shelf">3D 서가 전체 화면</a>
        </div>
      </div>
    </header>
  );
}
