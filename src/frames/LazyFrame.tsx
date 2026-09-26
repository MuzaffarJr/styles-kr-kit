import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useRenderGate } from "../motion/useRenderGate";
import "./LazyFrame.css";

interface Props {
  /** public/ ichidagi to'liq HTML sahifa, masalan "/landing-pages/complete-shelf-v2.html" */
  src: string;
  title: string;
  /** Iframe ichidagi sahifa qaysi viewport'da chizilsin (keyin konteynerga sig'diriladi). */
  designWidth?: number;
  designHeight?: number;
  /** Faollashtirilmaguncha ko'rinadigan statik kontent (poster, rang, matn). */
  poster?: ReactNode;
}

/**
 * Og'ir demo sahifalar uchun iframe:
 * - viewport'ga yaqinlashmaguncha yuklanmaydi;
 * - ekrandan chiqsa yoki tab yashirinsa unmount bo'ladi (ichki render loop CPU/GPU yemaydi);
 * - reduced-motion yoki tor ekranda avtomatik ishga tushmaydi — foydalanuvchi o'zi bosadi;
 * - desktop o'lchamida chizilib, konteynerga masshtablanadi (portfolio "case study" kartasi).
 */
export function LazyFrame({ src, title, designWidth = 1440, designHeight = 900, poster }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();
  const { near, running } = useRenderGate(hostRef, "300px");

  // Tor ekran yoki reduced-motion: faqat bosilganda
  const autoplayAllowed =
    !reduced && typeof window !== "undefined" && window.matchMedia("(min-width: 821px)").matches;

  useEffect(() => {
    if (near && autoplayAllowed) setActivated(true);
  }, [near, autoplayAllowed]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / designWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  const mounted = activated && running;
  useEffect(() => { if (!mounted) setLoaded(false); }, [mounted]);

  return (
    <div
      ref={hostRef}
      className="lazy-frame"
      style={{ aspectRatio: `${designWidth} / ${designHeight}` }}
    >
      {!loaded && (
        <div className="lazy-frame__poster">
          {poster}
          {!activated && (
            <button type="button" className="lazy-frame__play" onClick={() => setActivated(true)}>
              미리보기 실행
            </button>
          )}
        </div>
      )}
      {mounted && (
        <iframe
          className="lazy-frame__iframe"
          src={src}
          title={title}
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          style={{
            width: designWidth,
            height: designHeight,
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
