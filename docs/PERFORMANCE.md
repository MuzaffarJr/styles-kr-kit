# 3D va motion budjeti

Har bir mijoz loyihasi topshirishdan oldin shu ro'yxatdan o'tadi.

## Budjet (mobil, o'rta Android, 4G)

| Ko'rsatkich | Chegara |
|---|---|
| LCP | ≤ 2.5s — LCP elementi matn/rasm, canvas emas |
| three.js + sahna chunk (gzip) | ≤ 250 KB, alohida chunk, lazy |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 — canvas konteyneri o'lchami oldindan belgilangan |
| DPR | ≤ 1.5 (`maxDpr`) |

## Majburiy xatti-harakatlar (`<LazyScene>` ta'minlaydi)

- Sahna faqat viewport'ga 200px qolganda yuklanadi.
- Ko'rinmasa yoki tab yashirin bo'lsa render loop to'xtaydi.
- `prefers-reduced-motion` → bitta statik kadr, pointer reaksiyasi yo'q.
- WebGL yo'q yoki yuklash xatosi → CSS fallback, sahifa buzilmaydi.

## Dizayn qoidalari

- 3D faqat hero va ko'pi bilan 1–2 "moment"da. Butun sahifa 3D bo'lmaydi.
- Bitta orkestrlangan kirish animatsiyasi. Har bir section'ga fade-up qo'shilmaydi.
- Foydalanuvchi harakatiga javob beruvchi motion (ochish, tasdiqlash) — ruxsat.

## Tekshirish

```bash
npm run build && npx vite preview
# Chrome DevTools → Lighthouse (Mobile) va Performance → CPU 4x slowdown
```
