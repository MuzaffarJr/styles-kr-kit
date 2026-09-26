import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useRenderGate } from "../motion/useRenderGate";
import type { SceneFactory, SceneHandle } from "./types";

interface Props {
  /** Dynamic import: three.js asosiy bundle'ga tushmaydi. */
  load: () => Promise<{ default: SceneFactory }>;
  /** WebGL yo'q, yuklanmoqda yoki xato bo'lsa ko'rinadigan statik fon. */
  fallback: ReactNode;
  maxDpr?: number;
  className?: string;
  label?: string;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function LazyScene({ load, fallback, maxDpr = 1.5, className, label }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<SceneHandle | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");
  const reduced = useReducedMotion();
  const { near, running } = useRenderGate(hostRef);

  // 1) Viewport'ga yaqinlashganda sahnani yuklash
  useEffect(() => {
    if (!near || status !== "idle") return;
    if (!hasWebGL()) { setStatus("failed"); return; }
    let cancelled = false;
    load()
      .then(({ default: create }) => {
        if (cancelled || !canvasRef.current || !hostRef.current) return;
        const handle = create(canvasRef.current, { maxDpr });
        const r = hostRef.current.getBoundingClientRect();
        handle.resize(r.width, r.height);
        handleRef.current = handle;
        setStatus("ready");
      })
      .catch((err) => {
        console.error("[LazyScene] load failed", err);
        if (!cancelled) setStatus("failed");
      });
    return () => { cancelled = true; };
  }, [near, status, load, maxDpr]);

  // 2) Loop boshqaruvi: ko'rinmasa, tab yashirin bo'lsa yoki reduced-motion — to'xtaydi
  useEffect(() => {
    const h = handleRef.current;
    if (status !== "ready" || !h) return;
    if (reduced) { h.stop(); h.renderOnce(); return; }
    if (running) h.start(); else h.stop();
  }, [status, running, reduced]);

  // 3) Resize + pointer
  useEffect(() => {
    const host = hostRef.current;
    if (status !== "ready" || !host) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      handleRef.current?.resize(width, height);
      if (reduced) handleRef.current?.renderOnce();
    });
    ro.observe(host);
    const onMove = (ev: PointerEvent) => {
      if (reduced) return;
      const r = host.getBoundingClientRect();
      handleRef.current?.setPointer?.(
        ((ev.clientX - r.left) / r.width) * 2 - 1,
        -(((ev.clientY - r.top) / r.height) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { ro.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, [status, reduced]);

  // 4) Unmount
  useEffect(() => () => { handleRef.current?.dispose(); handleRef.current = null; }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {status !== "ready" && <div style={{ position: "absolute", inset: 0 }}>{fallback}</div>}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: status === "ready" ? 1 : 0,
          transition: "opacity var(--dur-3) var(--ease-out)",
        }}
      />
    </div>
  );
}
