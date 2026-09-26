/**
 * Har bir sahna (o'zimizniki yoki ThreeUI'dan moslangani) shu kontraktni bajaradi.
 * Shunda <LazyScene> performance/a11y qoidalarini hamma sahnaga bir xil qo'llaydi.
 */
export interface SceneHandle {
  start(): void;          // render loop'ni boshlash
  stop(): void;           // render loop'ni to'xtatish (GPU bo'sh qoladi)
  renderOnce(): void;     // reduced-motion uchun bitta statik kadr
  resize(width: number, height: number): void;
  setPointer?(x: number, y: number): void; // -1..1 normalized
  dispose(): void;
}

export interface SceneOptions {
  maxDpr: number;
}

export type SceneFactory = (canvas: HTMLCanvasElement, opts: SceneOptions) => SceneHandle;
