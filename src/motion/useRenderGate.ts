import { useEffect, useState, type RefObject } from "react";

/**
 * near    — element viewport'ga yaqinlashdi: sahnani lazy-load qilish vaqti.
 * running — element ko'rinib turibdi VA tab aktiv: render loop ishlashi mumkin.
 */
export function useRenderGate(ref: RefObject<Element | null>, rootMargin = "200px") {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(
    typeof document === "undefined" ? true : !document.hidden,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setNear(true); },
      { rootMargin },
    );
    const visObs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.01 },
    );
    nearObs.observe(el);
    visObs.observe(el);
    return () => { nearObs.disconnect(); visObs.disconnect(); };
  }, [ref, rootMargin]);

  useEffect(() => {
    const onVis = () => setTabActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return { near, running: visible && tabActive };
}
