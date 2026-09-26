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
