# Styles.kr studio kit

Mijoz loyihalari uchun 3D + motion boshlang'ich to'plami.

## Ishga tushirish

```bash
npm install
npm run dev
```

## Struktura

```
src/tokens/    dizayn tokenlari — har loyihada birinchi almashtiriladigan fayl
src/motion/    useReducedMotion, useRenderGate (ko'rinish + tab holati)
src/three/     LazyScene wrapper, SceneFactory kontrakti, sahnalar (+ scenes/threeui adapterlari)
src/frames/    LazyFrame — og'ir demo sahifalar uchun lazy, pauza qiluvchi iframe
src/sections/  tayyor bo'limlar: StudioHero, WorkShowcase
src/pages/     Playground — texnologik hero shablonlari (/#playground)
public/landing-pages/  to'liq HTML demo sahifalar (ThreeUI Community, MIT)
vendor/threeui ThreeUI Community komponentlari (MIT) — qoidalar ichidagi README'da
docs/          performance budjeti va checklist
```

## Yangi sahna qo'shish

1. `src/three/scenes/` ga `SceneFactory` qaytaradigan modul yozing (namuna: `celadonVessel.ts`).
2. Bo'limda: `<LazyScene load={() => import("../three/scenes/yourScene")} fallback={...} />`.

## Playground

`npm run dev` dan keyin `http://localhost:5173/#playground` — uchta texnologik hero shabloni
(Orbital Sphere, Data Pixel Arc, Predictive Arc). Har biri faqat ekranda ko'ringanda ishlaydi.
