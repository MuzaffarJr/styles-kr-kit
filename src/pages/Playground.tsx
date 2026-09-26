import { LazyScene } from "../three/LazyScene";
import type { SceneFactory } from "../three/types";
import "./Playground.css";

interface Stage {
  id: string;
  scene: string;
  load: () => Promise<{ default: SceneFactory }>;
  webgl: boolean;
  weight: string;
  useCase: string;
  title: string;
  lede: string;
}

/**
 * Texnologik yo'nalishdagi hero shablonlari. Har bir "stage" — mijoz loyihasiga
 * to'g'ridan-to'g'ri ko'chirsa bo'ladigan hero: fon sahnasi + nusxa + CTA.
 * Sahnalar ThreeUI Community (MIT, © Meng To) renderer'lari, o'zgartirilmagan.
 */
const STAGES: Stage[] = [
  {
    id: "orbital",
    scene: "Orbital Sphere",
    load: () => import("../three/scenes/threeui/orbitalSphere"),
    webgl: true,
    weight: "WebGL, three@0.128",
    useCase: "AI, infratuzilma, tarmoq mahsulotlari",
    title: "데이터가 연결되는 방식을\n다시 설계합니다",
    lede: "수천 개의 신호를 하나의 흐름으로. 팀이 실시간으로 같은 그림을 봅니다.",
  },
  {
    id: "pixel-arc",
    scene: "Data Pixel Arc",
    load: () => import("../three/scenes/threeui/dataPixelArc"),
    webgl: false,
    weight: "Canvas 2D, qo'shimcha kutubxonasiz",
    useCase: "Analitika, monitoring, dashboard",
    title: "실시간 신호를\n한눈에",
    lede: "흩어진 지표를 한 화면에 모으고, 변화가 생기는 순간 알려드립니다.",
  },
  {
    id: "predictive-arc",
    scene: "Predictive Arc",
    load: () => import("../three/scenes/threeui/predictiveArc"),
    webgl: false,
    weight: "Canvas 2D, qo'shimcha kutubxonasiz",
    useCase: "Fintech, prognoz, rejalashtirish",
    title: "다음 분기를\n먼저 봅니다",
    lede: "과거 데이터에서 패턴을 찾아, 결정이 필요한 시점을 미리 보여줍니다.",
  },
];

export function Playground() {
  return (
    <div className="tech">
      <header className="tech__bar">
        <a href="#studio" className="tech__back">Styles.kr 홈</a>
        <p className="tech__intro">
          기술 제품을 위한 히어로 템플릿 세 가지. 화면에 보이는 장면만 실행됩니다.
        </p>
      </header>

      {STAGES.map((s) => (
        <section key={s.id} className="stage" aria-labelledby={`stage-${s.id}`}>
          <LazyScene
            className="stage__scene"
            load={s.load}
            requiresWebGL={s.webgl}
            fallback={<div className="stage__fallback" />}
          />
          <div className="stage__scrim" aria-hidden="true" />
          <div className="stage__copy">
            <h2 id={`stage-${s.id}`} className="stage__title">{s.title}</h2>
            <p className="stage__lede">{s.lede}</p>
            {/* Mijoz loyihasida haqiqiy havola/forma bilan almashtiring */}
            <button type="button" className="stage__cta">데모 요청하기</button>
          </div>
          <dl className="stage__meta">
            <div><dt>Sahna</dt><dd>{s.scene}</dd></div>
            <div><dt>Texnologiya</dt><dd>{s.weight}</dd></div>
            <div><dt>Mos keladi</dt><dd>{s.useCase}</dd></div>
          </dl>
        </section>
      ))}

      <footer className="tech__credit">
        Sahnalar: <a href="https://github.com/MengTo/threeui" rel="noopener noreferrer">ThreeUI Community</a> (MIT, Meng To).
        Nusxa va tartib — Styles.kr.
      </footer>
    </div>
  );
}
