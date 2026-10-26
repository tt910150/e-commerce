# WomenBiz — ayollar qo'l mehnati bozori

Hunarmand ayollar uchun onlayn platforma: qo'l mehnati buyumlarini sotish, moliyalashtirish imkoniyatlari va mentorlar.

**Jonli sayt:** https://tt910150.github.io/e-commerce/ (keyinchalik: https://womenbiz.uz)

## Bo'limlar
- **Katalog** — rasmlar, dekor buyumlar, uy shirinliklari, tikuvchilik, handmade sumka / sham / bijuteriya. Kategoriya filtri, qidiruv, saralash, mahsulot oynasi.
- **Savat va buyurtma** — miqdor, yetkazib berish narxi (500 000 so'mdan bepul), buyurtma formasi, to'lov usuli tanlash.
- **Ustalar** — sotuvchi ayollar profillari va reytingi.
- **Moliyalashtirish** — imtiyozli kreditlar (oylik to'lov kalkulyatori bilan), bepul darslarga yozilish, grantlar (muddatigacha qolgan kunlar).
- **Mentorlar** — marketing mentori (SMM, reklama, mijoz jalb qilish) va moliya mentori (xarajat-daromad, biznes reja); sana va vaqt tanlab konsultatsiyaga yozilish.
- **Sotuvchi bo'lish** — ariza formasi.

## Tuzilma
```
index.html      sahifa
css/style.css   dizayn (suzani va atlas ranglari)
js/data.js      mahsulotlar, ustalar, kreditlar, darslar, grantlar, mentorlar
js/art.js       mahsulotlar uchun SVG illyustratsiyalar
js/app.js       katalog, savat, kalkulyator, formalar
```

## Mahsulot suratlari
Hozir suratlar Unsplash'dan (bepul litsenziya) olingan. Surat yuklanmasa, avtomatik ravishda chizilgan illyustratsiya ko'rsatiladi. O'zingizning suratlaringizni qo'yish uchun rasmni `images/` papkasiga joylang va `js/data.js` dagi mahsulotga `image` maydonini qo'shing:
```js
{ id: 1, ..., image: "images/atlas-sumka.jpg" }
```

## Eslatma
Hozircha buyurtma, ariza va yozilishlar brauzerning `localStorage` ida saqlanadi (backend yo'q). Haqiqiy ishga tushirishda ularni server yoki Telegram botga ulash kerak. Kredit va grant shartlari namunaviy.

## womenbiz.uz domenini ulash
1. `womenbiz.uz` domenini .uz registratoridan sotib oling (ro'yxat: cctld.uz).
2. Registrator panelida DNS yozuvlarini qo'shing:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `tt910150.github.io`
3. GitHub'da **Settings → Pages → Custom domain** maydoniga `womenbiz.uz` yozib **Save** bosing.
4. DNS yangilangach (bir necha soatdan 24 soatgacha) **Enforce HTTPS** belgisini yoqing.
