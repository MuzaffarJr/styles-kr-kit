# vendor/threeui

ThreeUI **Community** komponentlari uchun joy (MIT, © Meng To / Design+Code).
Manba: https://github.com/MengTo/threeui

## Qoidalar

1. Faqat Community komponentlar. Pro/Beta kod (CLI orqali olingan) bu repo'ga **commit qilinmaydi** —
   u faqat mijoz loyihasi ichida, obuna shartlari doirasida yashaydi.
2. Upstream `LICENSE`, `THIRD_PARTY_NOTICES.md`, `FONT-LICENSES.md`, `ASSET-LICENSES.md` fayllarini shu papkaga
   o'zgarishsiz ko'chiring.
3. threeui.com'dan yuklanadigan thumbnail/preview'larni ko'chirmang — ular repo litsenziyasiga kirmaydi.
4. Har bir ko'chirilgan komponent uchun pastdagi jadvalga upstream commit SHA'sini yozing.
5. Komponentni to'g'ridan-to'g'ri sahifaga qo'ymang: `src/three/types.ts` dagi `SceneFactory` kontraktiga
   moslab, `<LazyScene>` orqali ulang. Shunda lazy-load, pauza, reduced-motion va fallback avtomatik ishlaydi.

## Ko'chirish tartibi

```bash
git clone https://github.com/MengTo/threeui.git ../threeui-ref
cp ../threeui-ref/{LICENSE,THIRD_PARTY_NOTICES.md,FONT-LICENSES.md,ASSET-LICENSES.md} vendor/threeui/
# Komponent Community'da ekanini tekshiring:
grep -n "CompleteShelf" ../threeui-ref/src/data/shaders.tsx
```

## Ko'chirilgan komponentlar

Litsenziya fayllari (`LICENSE`, `THIRD_PARTY_NOTICES.md`, `FONT-LICENSES.md`, `ASSET-LICENSES.md`) shu papkada, upstream `68802d5` dan o'zgarishsiz.

To'liq HTML hujjat ko'rinishidagi landing page'lar `public/landing-pages/` ga o'zgarishsiz qo'yiladi va
`<LazyFrame>` orqali ko'rsatiladi (canvas sahnalar esa `<LazyScene>` orqali).

| Komponent | Upstream yo'l | Commit SHA | Moslangan fayl |
|---|---|---|---|
| Complete Shelf landing page | `public/landing-pages/complete-shelf-v2.html` | `68802d5428071ada5c20db8094b1649e6bb770ed` | `public/landing-pages/complete-shelf-v2.html` (o'zgarishsiz), `src/frames/LazyFrame.tsx` orqali ulangan |
| Orbital Sphere renderer | `src/shaders/orbital-sphere/orbitalSphereRenderer.ts` | `68802d5428071ada5c20db8094b1649e6bb770ed` | `vendor/threeui/src/orbital-sphere/` (o'zgarishsiz) → `src/three/scenes/threeui/orbitalSphere.ts` adapteri |
| Data Pixel Arc renderer | `src/shaders/data-pixel-arc/dataPixelArcRenderer.ts` | `68802d5428071ada5c20db8094b1649e6bb770ed` | `vendor/threeui/src/data-pixel-arc/` (o'zgarishsiz) → `src/three/scenes/threeui/dataPixelArc.ts` adapteri |
| Predictive Arc renderer | `src/shaders/predictive-arc/predictiveArcRenderer.ts` | `68802d5428071ada5c20db8094b1649e6bb770ed` | `vendor/threeui/src/predictive-arc/` (o'zgarishsiz) → `src/three/scenes/threeui/predictiveArc.ts` adapteri |

## Canvas renderer'larni ulash

ThreeUI renderer'lari `create(canvas, getOptions) => { resize, render, dispose? }` shaklida.
`src/three/scenes/threeui/adapt.ts` ularni o'zgartirmasdan `SceneFactory`'ga aylantiradi.
Yangi renderer qo'shish: faylni `vendor/threeui/src/<nom>/` ga o'zgarishsiz ko'chiring,
keyin `adaptThreeUI(createXRenderer, { ...X_DEFAULTS, ...o'zgartirishlar })` bilan bitta qatorli adapter yozing.

### Ma'lum cheklovlar

- Orbital Sphere `three128` (npm:three@0.128.0) alias'ini ishlatadi — upstream'dagidek. Bu kit'da
  ikkinchi three nusxasi bo'lib, faqat o'sha sahna ochilganda alohida chunk sifatida yuklanadi.
  Mijoz loyihasida bitta sahna ishlatilsa, ikkitasidan birini qoldiring.
- Upstream renderer'lar DPR'ni 2 bilan cheklaydi (bizning budjet 1.5). O'zgartirish uchun
  faylni tahrirlash kerak — bu holda jadvalga "o'zgartirilgan" deb yozing.
- 2D renderer'lar kadr asosida animatsiya qiladi (vaqt emas): 120Hz ekranda tezroq aylanadi.
