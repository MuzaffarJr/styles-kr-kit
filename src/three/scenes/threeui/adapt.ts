import type { SceneFactory } from "../../types";

/**
 * ThreeUI renderer'lari umumiy shaklga ega:
 *   create(canvas, getOptions) => { resize(w, h), render(), dispose?() } | null
 * Bu adapter ularni o'zgartirmasdan bizning SceneFactory kontraktimizga ulaydi,
 * shunda <LazyScene> lazy-load, pauza, reduced-motion va fallback'ni boshqaradi.
 */
export interface ThreeUIRenderer {
  resize(width: number, height: number): void;
  render(): void;
  dispose?(): void;
}

export function adaptThreeUI<O extends object>(
  create: (canvas: HTMLCanvasElement, getOptions: () => O) => ThreeUIRenderer | null,
  options: O,
): SceneFactory {
  return (canvas) => {
    const renderer = create(canvas, () => options);
    // null => kontekst olinmadi; LazyScene buni ushlab CSS fallback'ni ko'rsatadi
    if (!renderer) throw new Error("ThreeUI renderer: canvas context unavailable");

    let raf = 0;
    const frame = () => {
      renderer.render();
      raf = requestAnimationFrame(frame);
    };

    return {
      start() {
        if (!raf) raf = requestAnimationFrame(frame);
      },
      stop() {
        cancelAnimationFrame(raf);
        raf = 0;
      },
      renderOnce() {
        renderer.render();
      },
      resize(w, h) {
        if (w && h) renderer.resize(w, h);
      },
      dispose() {
        cancelAnimationFrame(raf);
        renderer.dispose?.();
      },
    };
  };
}
