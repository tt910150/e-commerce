// 5-loyiha: Tabiiy oltingugurtdan sulfat kislota ishlab chiqarishning o'choq bo'limi va absorber hisobi. 7 t/sutka
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc5');
const t = require('./thermo');
const { Vm } = t;

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];

const NAMES = { SO2: 'SO₂', SO3: 'SO₃', O2: 'O₂', N2: 'N₂', Ar: 'Ar', H2O: 'H₂O' };
const ORDER = ['SO2', 'SO3', 'O2', 'N2', 'Ar', 'H2O'];
const ks = x => f(x / 3600 * 1000, 3); // kg/soat -> g/s
function rowsOf(fl) {
  const n = t.sum(fl); let m = 0; const rows = [];
  for (const s of ORDER) {
    if (fl[s] === undefined || fl[s] < 1e-7) continue;
    const mi = fl[s] * t.CP[s].M; m += mi;
    rows.push([NAMES[s], f(fl[s], 4), f(fl[s] * Vm, 2), f(mi, 3), f(fl[s] / n * 100, 3)]);
  }
  rows.push(B(['Jami', f(n, 4), f(n * Vm, 2), f(m, 3), '100,000']));
  return rows;
}
const gHead = ['Komponent', 'n_{i}, kmol/soat', 'V_{i}, m³/soat', 'm_{i}, kg/soat', 'y_{i}, % (hajm)'];
const W5 = [1.2, 1.1, 1.1, 1.1, 1.1];

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };
  const Patm = c.P / 101325;

  // ============ 1
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Sulfat kislota – kimyo sanoatining eng ko‘p ishlab chiqariladigan mahsuloti bo‘lib, uni haqli ravishda “kimyo sanoatining noni” deb atashadi. Jahonda yiliga 260 mln tonnadan ortiq sulfat kislota ishlab chiqariladi. Uning yarmidan ko‘prog‘i mineral o‘g‘itlar – superfosfat, ammofos, ammoniy sulfati, ekstraksion fosfat kislota ishlab chiqarishda sarflanadi. Shuningdek, sulfat kislota rangli metallurgiyada (mis, rux, uran rudalarini tanlab eritish), neftni qayta ishlashda, sun’iy tola, bo‘yoq, portlovchi moddalar, dori vositalari ishlab chiqarishda keng qo‘llaniladi.'));
  add(P('O‘zbekiston Respublikasida sulfat kislota “Ammofos-Maxam” (Olmaliq), “Olmaliq KMK” (mis zavodi gazlaridan), “Navoiy KMK”, “Samarqandkimyo” va “Qo‘qon superfosfat zavodi” korxonalarida ishlab chiqariladi. Mahalliy fosfat xomashyosini qayta ishlash va kon-metallurgiya sanoatining rivojlanishi sulfat kislotaga bo‘lgan talabni doimiy ravishda oshirmoqda. Muborak va Sho‘rtan gazni qayta ishlash zavodlarida tabiiy gazni oltingugurtsizlantirish natijasida yiliga yuz ming tonnalab gaz oltingugurti olinadi, u sulfat kislota ishlab chiqarish uchun eng qulay va arzon xomashyo hisoblanadi.'));
  add(P('Oltingugurtdan sulfat kislota ishlab chiqarish uch asosiy bosqichdan iborat: oltingugurtni o‘choqda yoqib SO₂ li gaz olish; SO₂ ni vanadiy katalizatorida SO₃ ga oksidlash; SO₃ ni konsentrlangan sulfat kislota bilan absorbsiyalash. Oltingugurtni yoqish o‘chog‘i sexning birinchi bosqichi bo‘lib, gaz tarkibini va issiqlik utilizatsiyasini belgilaydi. Absorbsiya bo‘limi esa tayyor mahsulot hosil bo‘ladigan yakuniy bosqich: SO₃ ning to‘liq yutilmasligi nafaqat mahsulot yo‘qotilishiga, balki atmosferaga sulfat kislota tumanining chiqishiga sabab bo‘ladi. Shuning uchun absorberni to‘g‘ri hisoblash va loyihalash sexning ekologik xavfsizligi uchun ham muhim.'));
  add(P(`Ushbu kurs loyihasining maqsadi – tabiiy (gaz) oltingugurtdan unumdorligi ${f(c.Gday / 1000, 0)} t/sutka (100 % H₂SO₄ hisobida) bo‘lgan sulfat kislota ishlab chiqarish sexining o‘choq bo‘limini va asosiy apparati – monogidrat absorberni hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['oltingugurt yonishi, SO₂ ning oksidlanishi va SO₃ ning absorbsiyasi jarayonlarining nazariy asoslarini tahlil qilish;',
    'oltingugurt, oraliq mahsulotlar va sulfat kislotaning fizik-kimyoviy xossalarini o‘rganish;',
    'sulfat kislota ishlab chiqarish tizimlarini solishtirib, maqbul sxemani tanlash;',
    'o‘choq, kontakt apparat va absorberlarning moddiy va issiqlik balanslarini SI tizimida hisoblash;',
    'monogidrat absorberning diametri, nasadka balandligi, gidravlik qarshiligi va kislota sirkulyatsiyasini, shuningdek, oltingugurt o‘chog‘ini hisoblash;',
    'asosiy jihozlar sonini aniqlash, ro‘yxatini va tahliliy nazorat sxemasini tuzish.']));
  add(P('Barcha hisoblar SI xalqaro birliklar tizimida bajarilgan: massa – kg, modda miqdori – mol (kmol), harorat – K, bosim – Pa, energiya – J (kJ), quvvat – W (kW), hajm – m³, vaqt – s. Oqimlar qulaylik uchun soatlik miqdorda ham keltirilgan va g/s, kW ga o‘tkazilgan. Gaz hajmlari normal sharoitga (273,15 K; 101 325 Pa) keltirilgan, V_{m} = 22,414 m³/kmol. Yillik ish vaqti 8000 soat.'));

  // ============ 2
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. Oltingugurtning yonishi'));
  add(P('Suyuq oltingugurt o‘choqqa forsunkalar orqali purkaladi, bug‘lanadi va havo kislorodi bilan yonadi:'));
  add(F('S (g) + O₂ = SO₂;   ΔH°_{298} = –296,9 kJ/mol (rombik S uchun)', '2.1'));
  add(P('Yonish gaz fazasida boradi: oltingugurt tomchilari 717,8 K (qaynash harorati) da bug‘lanadi, bug‘lar esa kislorod bilan tez reaksiyaga kirishadi. Yonish tezligi tomchilarning bug‘lanish tezligi bilan cheklanadi, shuning uchun oltingugurtni mayda purkash (tomchi o‘lchami 50–100 mkm) va havo bilan yaxshi aralashtirish muhim. Oltingugurt ortiqcha havo bilan yondiriladi; havo miqdori gazdagi SO₂ konsentratsiyasini belgilaydi. Nazariy jihatdan havo bilan yondirilganda maksimal SO₂ miqdori 20,9 % ga yetadi, amalda 9–12 % li gaz olinadi, chunki kontakt apparatda SO₂ ni oksidlash uchun ortiqcha kislorod kerak va birinchi qatlam harorati katalizator uchun ruxsat etilgan qiymatdan oshmasligi kerak.'));
  add(P('O‘choqda oz miqdorda (SO₂ ning 1–2 % i) SO₃ ham hosil bo‘ladi. Agar havo yaxshi quritilmagan bo‘lsa, SO₃ suv bug‘i bilan sulfat kislota bug‘ini hosil qiladi va u qozon-utilizatorning sovuq yuzalarida kondensatsiyalanib, kuchli korroziyaga sabab bo‘ladi. Shuning uchun o‘choqqa beriladigan havo konsentrlangan sulfat kislota bilan quritiladi (namlik ≤ 0,01 % hajm).'));
  add(H2('2.2. SO₂ oksidlanishining termodinamikasi'));
  add(F('SO₂ + 0,5O₂ ⇄ SO₃;   ΔH°_{298} = –98,9 kJ/mol', '2.2'));
  add(P('Reaksiya qaytar, ekzotermik va gaz hajmining kamayishi bilan boradi. Le-Shatelye prinsipiga ko‘ra harorat pasayishi va bosim ortishi muvozanatni SO₃ hosil bo‘lishi tomoniga suradi. Muvozanat konstantasi:'));
  add(F('K_{p} = p_{SO₃}/(p_{SO₂}·p^{0,5}_{O₂});   lg K_{p} = 4905,5/T – 4,6455', '2.3'));
  add(P('Muvozanat konversiya darajasi gazning boshlang‘ich tarkibi (a – SO₂, b – O₂, % hajm) va umumiy bosim P (atm) orqali quyidagi tenglamadan ketma-ket yaqinlashish bilan topiladi:'));
  add(F('x_{m} = K_{p}/(K_{p} + [(100 – 0,5a·x_{m})/(P·(b – 0,5a·x_{m}))]^{0,5})', '2.4'));
  {
    const Ts = [673, 698, 723, 773, 823, 873, 923];
    add(T('2.1', `SO₂ oksidlanishining muvozanat konstantasi va muvozanat konversiya darajasi (a = ${f(c.a, 1)} %, b = ${f(c.b, 2)} %, P = ${f(c.P / 1e6, 2)} MPa)`, ['T, K', ...Ts.map(String)],
      [['K_{p}, atm⁻⁰·⁵', ...Ts.map(x => f(c.Kp(x), x < 760 ? 1 : 2))], ['x_{m}', ...Ts.map(x => f(c.xeq(x, c.a, c.b, Patm), 3))]], [1.4, 1, 1, 1, 1, 1, 1, 1]));
  }
  add(P('Jadvaldan ko‘rinadiki, 693–713 K da muvozanat konversiya darajasi 0,98–0,99 ga yetadi, 873 K da esa 0,72 gacha kamayadi. Shuning uchun jarayon bir necha adiabatik katalizator qatlamlarida, qatlamlar orasida gazni sovitib olib boriladi; birinchi qatlamda yuqori haroratda (reaksiya tezligi katta) asosiy konversiya, oxirgi qatlamlarda past haroratda (muvozanat qulay) chuqur konversiya amalga oshiriladi.'));
  add(H2('2.3. Kataliz va kinetika'));
  add(P('Sanoatda vanadiy katalizatorlari (СВД, СВС, ИК-1-6, ИК-4-6) ishlatiladi. Ularning faol komponenti – kaliy pirosulfatida eritilgan V₂O₅ (6–8 %), tashuvchi – kremnezem. Ish sharoitida faol modda suyuq plyonka holida bo‘lib, reaksiya mexanizmi vanadiyning oksidlanish-qaytarilish sikliga asoslangan: SO₂ + 2V⁵⁺ + O²⁻ → SO₃ + 2V⁴⁺; 2V⁴⁺ + 0,5O₂ → 2V⁵⁺ + O²⁻. Katalizatorning yonish (zajiganiye) harorati 653–693 K, yuqori chegaraviy harorati 873–903 K. Kinetika uchun G.K. Boreskov tenglamasi qo‘llaniladi:'));
  add(F('r = k·p_{O₂}·(p_{SO₂}/p_{SO₃})^{0,8}·[1 – p²_{SO₃}/(K²_{p}·p²_{SO₂}·p_{O₂})]', '2.5'));
  add(P('Tenglamadan ko‘rinadiki, SO₃ reaksiyani sekinlashtiradi. Shu sababli ikki marta kontaktlash (IK/IA) sxemasida uchinchi qatlamdan keyin SO₃ oraliq absorberda yutiladi va to‘rtinchi qatlamda qolgan SO₂ yuqori tezlik bilan oksidlanadi. Natijada umumiy konversiya darajasi 99,5–99,8 % ga yetadi.'));
  add(H2('2.4. SO₃ ning absorbsiyasi'));
  add(F('SO₃ (g) + H₂O (s) = H₂SO₄ (s);   ΔH = –132,4 kJ/mol', '2.6'));
  add(P('SO₃ ni suv yoki suyultirilgan kislota bilan yutish mumkin emas: bunda SO₃ gaz fazasida suv bug‘i bilan reaksiyaga kirishib, mayda sulfat kislota tumani (aerozol) hosil qiladi, u esa absorberdan tutilmasdan o‘tib ketadi. Eng yaxshi yutuvchi – 98,3 % li sulfat kislota (monogidrat): uning ustida H₂O, SO₃ va H₂SO₄ bug‘larining yig‘indi bosimi minimal (azeotrop tarkib). Undan kuchsizroq kislota ustida suv bug‘i bosimi, kuchliroq kislota (oleum) ustida esa SO₃ bosimi ortadi, ikkala holda ham absorbsiya darajasi pasayadi.'));
  add(P('Absorbsiya tezligi gaz fazasidagi diffuziya bilan cheklanadi, chunki monogidrat ustidagi SO₃ ning muvozanat bosimi amalda nolga teng. Shuning uchun massa uzatish birliklari soni n_{oy} = ln(y₁/y₂) ga teng bo‘ladi. Absorberga beriladigan kislota harorati 333–353 K da saqlanadi: past haroratda tuman hosil bo‘lishi xavfi oshadi, yuqori haroratda esa H₂SO₄ bug‘ining bosimi ortadi.'));
  add(H2('2.5. Jarayonga ta’sir etuvchi omillar'));
  add(P('SO₂ konsentratsiyasi: uning ortishi apparatlar hajmini kamaytiradi, lekin birinchi qatlam haroratini oshiradi va muvozanat konversiya darajasini pasaytiradi; oltingugurt gazi uchun maqbul qiymat 9–11 %. Havoning namligi: quritish yetarli bo‘lmasa, kontakt apparat va absorberda tuman hosil bo‘ladi. Gazning tozaligi: oltingugurtdagi bitum va kul katalizator qatlamini ifloslantiradi, shuning uchun suyuq oltingugurt filtrlanadi. Absorber kislotasining konsentratsiyasi va harorati: 98,3 ± 0,2 % va 333–353 K oralig‘ida ushlab turiladi.'));

  add(H2('2.6. Sulfat kislota tumanining hosil bo‘lishi'));
  add(P('Agar gazda suv bug‘i bo‘lsa, gaz sovitilganda SO₃ va H₂O bug‘lari gaz hajmida reaksiyaga kirishib, H₂SO₄ bug‘ini hosil qiladi. Gaz harorati sulfat kislota bug‘ining shudring nuqtasidan pasayganda bug‘ hajmiy kondensatsiyalanadi va o‘lchami 0,1–1 mkm bo‘lgan tuman tomchilari paydo bo‘ladi. Shudring nuqtasi gazdagi SO₃ va H₂O miqdoriga bog‘liq: masalan, 0,01 % H₂O va 9 % SO₃ li gaz uchun u ≈ 433–453 K ni tashkil etadi. Shuning uchun absorberga kiradigan gaz harorati shudring nuqtasidan yuqori (453–473 K) saqlanadi va havo puxta quritiladi; hosil bo‘lgan tuman esa absorber tepasidagi shishatola yoki polimer tolali sham filtrlarda 99 % gacha ushlanadi.'));
  add(H2('2.7. Oltingugurtni tayyorlash'));
  add(P('Gaz oltingugurti korxonaga qattiq (donador yoki bo‘lak) holda yoki isitiladigan sisternalarda suyuq holda keladi. Qattiq oltingugurt bug‘ zmeyevikli eritgichlarda 408–418 K da suyuqlantiriladi. Suyuq oltingugurt tarkibidagi kul, bitum va mexanik aralashmalar katalizator qatlamini ifloslantirmasligi uchun u bosim ostida ishlaydigan barg (yaproq) filtrlarida diatomit qatlami orqali filtrlanadi; kislotalikni neytrallash uchun eritgichga oz miqdorda ohak qo‘shiladi. Tozalangan oltingugurt bug‘ g‘ilofli quvurlar orqali o‘choq forsunkalariga beriladi; quvurlarda harorat 433 K dan oshmasligi kerak, aks holda qovushoqlik keskin ortib, quvur tiqilib qoladi.'));
  // ============ 3
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Oltingugurt'));
  add(P(`Xomashyo – texnik gaz oltingugurti (GOST 127.1, 9998 navi): S ≥ ${f(c.purS * 100, 1)} %, kul ≤ 0,02 %, organik moddalar ≤ 0,01 %, namlik ≤ 0,2 %, mishyak va selen izlari. Oltingugurt – sariq kristall modda, ikki allotropik shaklda (rombik va monoklin) bo‘ladi. Suyuq oltingugurtning qovushoqligi o‘ziga xos tarzda o‘zgaradi: 413–433 K da minimal (≈ 7 mPa·s), 433 K dan yuqorida S₈ halqalarining polimerlanishi hisobiga keskin ortadi (460 K da 93 000 mPa·s). Shuning uchun oltingugurt 408–423 K da bug‘ bilan isitiladigan quvurlarda tashiladi va forsunkalarga beriladi.`));
  add(T('3.1', 'Oltingugurtning asosiy xossalari [13]', ['Ko‘rsatkich', 'Qiymati'], [
    ['Molyar massa, kg/kmol', '32,06'], ['Zichlik (rombik, 293 K), kg/m³', '2070'], ['Suyuqlanish harorati (monoklin), K', '392,2'],
    ['Qaynash harorati, K', '717,8'], ['Suyuqlanish issiqligi, kJ/mol', '1,72'], ['Rombik → monoklin o‘tish issiqligi, kJ/mol', '0,40'],
    ['Suyuq S issiqlik sig‘imi (413 K), kJ/(kg·K)', '1,09'], ['Suyuq S qovushoqligi (413 K), mPa·s', '7,0'], ['Alangalanish harorati, K', '505'],
    ['Yonish issiqligi (SO₂ gacha), kJ/kg', '9260'],
  ], [3, 1.4]));
  add(H2('3.2. Oltingugurt oksidlari'));
  add(T('3.2', 'SO₂ va SO₃ ning xossalari', ['Ko‘rsatkich', 'SO₂', 'SO₃'], [
    ['Molyar massa, kg/kmol', '64,07', '80,07'], ['Zichlik (n.sh.), kg/m³', '2,927', '3,57*'], ['Qaynash harorati, K', '263,1', '317,9'],
    ['Suyuqlanish harorati, K', '197,7', '289,9 (γ-shakl)'], ['Kritik harorat, K / bosim, MPa', '430,8 / 7,88', '491,0 / 8,21'],
    ['ΔH°_{f,298} (gaz), kJ/mol', '–296,9', '–395,8'], ['Ish zonasida YuChK, mg/m³', '10', '1 (H₂SO₄ hisobida)'],
  ], [2.4, 1.2, 1.4]));
  add(P('* – hisobiy qiymat. SO₂ – rangsiz, o‘tkir bo‘g‘uvchi hidli zaharli gaz, suvda yaxshi eriydi (293 K da 1 hajm suvda 40 hajm). SO₃ – kuchli suvni tortib oluvchi modda, nam havoda oq tuman hosil qiladi.', { noIndent: true, size: 24 }));
  add(H2('3.3. Sulfat kislota'));
  add(P('Suvsiz sulfat kislota (monogidrat) – rangsiz moysimon suyuqlik, zichligi 1830 kg/m³ (293 K), suyuqlanish harorati 283,4 K. Suv bilan 98,3 % H₂SO₄ tarkibli azeotrop hosil qiladi (qaynash harorati 609 K). Kuchli suvni tortib oluvchi va oksidlovchi xossaga ega; uglerodli po‘lat 75 % dan kuchli kislotada passivlanadi, shuning uchun konsentrlangan kislota idishlari po‘latdan, kislota sovitgichlari esa cho‘yan yoki anod himoyali zanglamas po‘latdan tayyorlanadi.'));
  add(T('3.3', 'Sulfat kislota eritmalarining xossalari', ['H₂SO₄, %', '75', '93', '96', '98,3', '100'], [
    ['Zichlik (293 K), kg/m³', '1669', '1829', '1835', '1836', '1831'], ['Kristallanish harorati, K', '232', '238', '259', '272', '283'],
    ['Issiqlik sig‘imi, kJ/(kg·K)', '1,78', '1,50', '1,48', '1,46', '1,42'], ['Qovushoqlik (343 K), mPa·s', '5,0', '7,6', '8,2', '9,0', '9,8'],
  ], [2.2, 1, 1, 1, 1, 1]));
  add(P('Mahsulot – texnik sulfat kislota (GOST 2184-2013), “kontakt” navi: H₂SO₄ ≥ 92,5 % (minorali kislota) yoki ≥ 98,0 % (monogidrat); temir ≤ 0,02 %, prokalitdan keyingi qoldiq ≤ 0,05 %, azot oksidlari ≤ 0,0001 %. Loyihada mahsulot 98,3 % li monogidrat ko‘rinishida chiqariladi; zarur bo‘lsa, quritish minorasining 93 % li kislotasi ham mahsulot sifatida berilishi mumkin.'));
  add(T('3.4', 'Vanadiy katalizatorlarining tavsifi', ['Ko‘rsatkich', 'СВД', 'ИК-1-6', 'ИК-4-6 (halqa)'], [
    ['V₂O₅, %', '7–8', '6–7', '6–7'], ['Granula shakli va o‘lchami, mm', 'silindr 5×5', 'silindr 5×(5–15)', 'halqa 10×4×10'],
    ['To‘kma zichlik, kg/m³', '600–650', '550–600', '450–500'], ['Yonish harorati, K', '683–693', '663–673', '673–683'],
    ['Maksimal ish harorati, K', '873', '893', '893'], ['Xizmat muddati, yil', '4–5', '5–7', '5–7'],
  ], [2.4, 1, 1, 1.2]));

  // ============ 4
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. Xomashyo turlari'));
  add(P('Sulfat kislota ishlab chiqarish uchun elementar oltingugurt, temir kolchedani (pirit), rangli metallurgiya chiqindi gazlari, vodorod sulfidi va gips ishlatiladi. Xomashyo turlarining qiyosiy tavsifi 4.1-jadvalda keltirilgan.'));
  add(T('4.1', 'Sulfat kislota xomashyolarini solishtirish', ['Ko‘rsatkich', 'Oltingugurt', 'Kolchedan', 'Metallurgiya gazlari', 'H₂S'], [
    ['Gazdagi SO₂, %', '9–12', '8–10', '4–8 (o‘zgaruvchan)', '6–8'], ['Gazni tozalash', 'kerak emas', 'murakkab (chang, As, Se)', 'murakkab', 'kerak emas'],
    ['Sxema', 'qisqa (quruq)', 'uzun (yuvish bo‘limi)', 'uzun', 'nam kataliz'], ['Chiqindilar', 'yo‘q', 'kuyindi 0,7 t/t', 'shlam', 'yo‘q'],
    ['Utilizatsiya qilinadigan issiqlik', 'ko‘p', 'o‘rtacha', 'kam', 'ko‘p'], ['Kapital xarajatlar', 'past', 'yuqori', 'yuqori', 'o‘rtacha'],
  ], [2, 1.1, 1.3, 1.4, 1]));
  add(P('Oltingugurt eng toza va qulay xomashyo: gaz tozalash bo‘limi kerak emas, sxema qisqa, kapital xarajatlar 1,5–2 marta kam, oltingugurt yonishi va SO₂ oksidlanishi issiqligidan yuqori bosimli bug‘ olinadi. O‘zbekistonda gaz oltingugurti mahalliy ishlab chiqariladi, shuning uchun loyihada oltingugurt xomashyosi qabul qilinadi.'));
  add(H2('4.2. Kontaktlash sxemalari'));
  add(T('4.2', 'Kontaktlash sxemalarini solishtirish', ['Ko‘rsatkich', 'Bir marta kontaktlash (OK/OA)', 'Ikki marta kontaktlash (IK/IA)', 'Nam kataliz'], [
    ['Umumiy konversiya darajasi, %', '97,5–98,0', '99,5–99,8', '98–98,5'], ['Dum gazda SO₂, %', '0,2–0,3', '0,02–0,05', '0,15–0,2'],
    ['Dum gazni tozalash', 'kerak', 'kerak emas', 'kerak'], ['Katalizator qatlamlari', '4–5', '3 + 1 (yoki 3 + 2)', '3–4'],
    ['Absorberlar soni', '1–2', '2', 'kondensator'], ['Issiqlik almashtirgichlar yuzasi', 'kichik', 'katta', 'o‘rtacha'],
  ], [2, 1.4, 1.4, 1.2]));
  add(P('Bir marta kontaktlashda dum gazdagi SO₂ sanitariya me’yorlaridan ancha yuqori bo‘ladi va qo‘shimcha ammiakli yoki ohakli tozalashni talab qiladi. IK/IA sxemasida esa SO₂ chiqindisi 5–10 marta kam bo‘lib, qo‘shimcha tozalash kerak emas, xomashyodan foydalanish darajasi yuqori. Shuning uchun loyihada “3 + 1” qatlamli ikki marta kontaktlash va ikki marta absorbsiyalash (IK/IA) sxemasi tanlandi.'));
  add(H2('4.3. O‘choq va absorber turini tanlash'));
  add(P('Oltingugurt o‘choqlari kamerali (forsunkali), siklonli va qatlamli turlarga bo‘linadi. Forsunkali gorizontal o‘choq oddiy, ishonchli va kichik unumdorlik uchun qulay; siklonli o‘choqlar yirik qurilmalarda qo‘llaniladi. Loyihada mexanik forsunkali gorizontal silindrik o‘choq qabul qilindi. Absorber sifatida keramik halqalar bilan to‘ldirilgan nasadkali minora tanlandi: u kichik gidravlik qarshilikka, katta absorbsiya yuzasiga ega, issiq gaz va konsentrlangan kislota ta’siriga chidamli (po‘lat korpus kislotabardosh g‘isht bilan futerovkalanadi). Tumanni ushlash uchun absorber tepasiga shamli tola filtrlari o‘rnatiladi.'));

  add(T('4.3', 'SO₃ absorberlari turlarini solishtirish', ['Ko‘rsatkich', 'Nasadkali minora', 'Venturi absorberi', 'Barbotajli (tarelkali)', 'Plyonkali'], [
    ['Absorbsiya darajasi, %', '99,9–99,99', '99,5–99,9', '99,8–99,95', '99,5–99,8'], ['Gidravlik qarshilik, kPa', '1–2', '6–10', '4–8', '1–2'],
    ['Tuman hosil bo‘lishiga sezgirlik', 'o‘rtacha', 'kam (tumanni ushlaydi)', 'o‘rtacha', 'yuqori'], ['Konstruksiya', 'oddiy', 'ixcham', 'murakkab', 'murakkab'],
    ['Kislota sirkulyatsiyasi', 'katta', 'juda katta', 'o‘rtacha', 'kichik'], ['Qo‘llanish', 'keng', 'yordamchi', 'cheklangan', 'cheklangan'],
  ], [2, 1.2, 1.2, 1.3, 1]));
  // ============ 5
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Tabiiy oltingugurtdan sulfat kislota ishlab chiqarish sexining texnologik sxemasi 5.1-rasmda keltirilgan.'));
  add(IMG(path.join(FIG, 'sxema5.png'), 620, 372, '5.1-rasm. Oltingugurtdan IK/IA usulida sulfat kislota ishlab chiqarish sexining texnologik sxemasi',
    '1 – quritish minorasi; 2 – havo kompressori (gazoduvka); 3 – suyuq oltingugurt yig‘gichi; 4 – oltingugurt nasosi; 5 – oltingugurt yoqish o‘chog‘i; 6 – qozon-utilizator; 7 – to‘rt qatlamli kontakt apparat; 8 – issiqlik almashtirgichlar; 9 – ekonomayzer; 10 – oraliq (birinchi) monogidrat absorber; 11 – yakuniy monogidrat absorber; 12 – sirkulyatsion yig‘gich; 13 – kislota sovitgichi.'));
  add(P(`Atmosfera havosi quritish minorasi 1 da 93–94 % li sulfat kislota bilan quritiladi va gazoduvka 2 bilan ${f(c.Tairin, 0)} K da o‘choq 5 ga beriladi. Suyuq oltingugurt (${f(c.mS, 1)} kg/soat) yig‘gich 3 dan bug‘ bilan isitiladigan nasos 4 orqali ${f(c.TS, 0)} K da o‘choq forsunkasiga uzatiladi. O‘choqda oltingugurt yonib, ${f(c.ySO2 * 100, 0)} % SO₂ li gaz hosil bo‘ladi; gaz harorati ${f(c.Tf, 0)} K.`));
  add(P(`Issiq gaz qozon-utilizator 6 da ${f(c.T1in, 0)} K gacha sovitiladi, bunda 4 MPa bosimli bug‘ olinadi (${f(c.G_steam, 0)} kg/soat). So‘ngra gaz kontakt apparat 7 ning birinchi qatlamiga kiradi. Qatlamlar orasida gaz issiqlik almashtirgichlar 8 da sovitiladi: I qatlamda konversiya darajasi ${f(c.x[0], 2)}, II da ${f(c.x[1], 2)}, III da ${f(c.x[2], 2)} ga yetadi.`));
  add(P(`Uchinchi qatlamdan chiqqan gaz ekonomayzer 9 da ${f(c.TgA, 0)} K gacha sovitilib, oraliq monogidrat absorber 10 ga yuboriladi. Bu yerda SO₃ ${f(c.TL1, 0)} K li 98,3 % li kislota bilan ${f(c.etaA * 100, 2)} % ga yutiladi. Absorberdan chiqqan gaz issiqlik almashtirgichlarda issiq gaz hisobiga ${f(c.bed4.Tin, 0)} K gacha isitilib, kontakt apparatning IV qatlamiga qaytadi; bu yerda qolgan SO₂ ning ${f(c.x4 * 100, 0)} % i oksidlanadi. Umumiy konversiya darajasi ${f(c.xTot * 100, 1)} %. Gaz yakuniy absorber 11 da SO₃ dan tozalanib, quvur orqali atmosferaga chiqariladi.`));
  add(P('Absorberlardan chiqqan isigan kislota sirkulyatsion yig‘gich 12 ga tushadi; bu yerda unga konsentratsiyani 98,3 % da ushlab turish uchun quritish minorasining 93 % li kislotasi va suv qo‘shiladi. Kislota nasos bilan sovitgich 13 orqali (anod himoyali plastinkali sovitgich) qaytadan absorberlarga beriladi. Ortiqcha kislota mahsulot sifatida omborga chiqariladi.'));
  add(P('Sexni ishga tushirishda kontakt apparat katalizator qatlamlari ishga tushirish isitgichi orqali issiq havo bilan yonish haroratigacha (693–713 K) isitiladi, so‘ngra o‘choqqa oltingugurt berish boshlanadi. Absorberlarda kislota sirkulyatsiyasi gaz berishdan oldin yo‘lga qo‘yiladi.'));

  add(T('5.1', 'Sexning asosiy texnologik rejim normalari', ['Parametr', 'Me’yor'], [
    ['Suyuq oltingugurt harorati, K', '408–423'], ['O‘choq gazida SO₂, %', '9,5–10,5'], [`O‘choqdan chiqishdagi gaz harorati, K`, `${f(c.Tf - 30, 0)}–${f(c.Tf + 30, 0)}`],
    ['I qatlamga kirish harorati, K', '683–703'], ['I qatlamdan chiqish harorati, K, ko‘p emas', '893'], ['IV qatlamga kirish harorati, K', '688–703'],
    ['Absorberlarga kiruvchi gaz harorati, K', '443–473'], ['Absorber kislotasi konsentratsiyasi, %', '98,1–98,5'], ['Absorberga kiruvchi kislota harorati, K', '333–353'],
    ['Quritish kislotasi konsentratsiyasi, %', '93–95'], ['Quritilgan havodagi namlik, % (hajm)', '≤ 0,01'], ['Qozon barabanidagi bosim, MPa', '3,9–4,0'],
  ], [3, 1.5]));
  // ============ 6
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`unumdorlik G = ${f(c.Gday, 0)} kg/sutka 100 % H₂SO₄ = ${f(c.G, 2)} kg/soat = ${f(c.G / 3600 * 1000, 2)} g/s;`,
    `oltingugurt tozaligi ${f(c.purS * 100, 1)} %; mexanik yo‘qotishlar ${f(c.lossMech * 100, 1)} %;`,
    `o‘choq gazida SO₂ – ${f(c.ySO2 * 100, 0)} % (hajm); havo quritilgan, quritishdan oldin 303 K, φ = 50 %;`,
    `konversiya darajasi: I qatlam – ${f(c.x[0], 2)}, II – ${f(c.x[1], 2)}, III – ${f(c.x[2], 2)}; IV qatlamda qolgan SO₂ ning ${f(c.x4 * 100, 0)} % i;`,
    `absorbsiya darajasi (har bir absorberda) ${f(c.etaA * 100, 2)} %; absorberga beriladigan kislota – 98,3 %, ${f(c.TL1, 0)} K;`,
    `kontakt apparatdagi bosim ${f(c.P / 1e6, 2)} MPa, absorberdagi ${f(c.Pa / 1e6, 2)} MPa.`]));
  add(H2('6.2. Oltingugurt va havo sarfi'));
  add(F(`n_{H₂SO₄} = G/M = ${f(c.G, 2)}/98,08 = ${f(c.nP, 4)} kmol/soat`, '6.1'));
  add(P(`Umumiy konversiya darajasi x = x₃ + (1 – x₃)·x₄ = ${f(c.x[2], 2)} + 0,05·${f(c.x4, 2)} = ${f(c.xTot, 3)}. Oltingugurt sarfi:`));
  add(F(`n_{S} = n_{H₂SO₄}/(x·η_{a}·(1 – δ)) = ${f(c.nP, 4)}/(${f(c.xTot, 3)}·${f(c.etaA, 4)}·${f(1 - c.lossMech, 3)}) = ${f(c.nS, 4)} kmol/soat`, '6.2'));
  add(P(`Texnik oltingugurt massasi m_{S} = n_{S}·32,06/${f(c.purS, 3)} = ${f(c.mS, 2)} kg/soat (${ks(c.mS)} g/s); 1 t H₂SO₄ ga ${f(c.mS / c.G * 1000, 1)} kg (nazariy 327 kg). Oltingugurt yonganda (2.1) reaksiya bo‘yicha 1 mol O₂ ga 1 mol SO₂ hosil bo‘ladi, shuning uchun quruq havo sarfi:`));
  add(F(`n_{havo} = n_{S}/y_{SO₂} = ${f(c.nS, 4)}/${f(c.ySO2, 2)} = ${f(c.nAirDry, 3)} kmol/soat (${f(c.nAirDry * Vm, 1)} m³/soat)`, '6.3'));
  add(P(`Quritishdan oldingi havoda suv bug‘i ${f(c.yW * 100, 2)} %, ya’ni ${f(c.wetAir.H2O, 4)} kmol/soat (${f(c.wetAir.H2O * 18.015, 2)} kg/soat); u quritish minorasida 93 % li kislota bilan yutiladi.`));
  add(T('6.1', 'O‘choqdan chiqadigan gaz tarkibi', gHead, rowsOf(c.furn), W5));
  add(P(`O‘choqning moddiy balansi: kirim – oltingugurt ${f(c.nS * 32.06, 2)} kg/soat va quruq havo ${f(t.mass(c.dryAir), 2)} kg/soat, jami ${f(c.nS * 32.06 + t.mass(c.dryAir), 2)} kg/soat; sarf – o‘choq gazi ${f(t.mass(c.furn), 2)} kg/soat (${ks(t.mass(c.furn))} g/s). Gazdagi O₂ : SO₂ nisbati ${f(c.furn.O2 / c.furn.SO2, 3)}.`));
  add(H2('6.3. Kontakt apparat'));
  add(T('6.2', 'Kontakt apparat qatlamlari bo‘yicha konversiya', ['Qatlam', 'x_{kir}', 'x_{chiq}', 'Oksidlangan SO₂, kmol/soat', 'O₂ sarfi, kmol/soat'],
    c.beds.map((b, i) => [['I', 'II', 'III'][i], f(i ? c.x[i - 1] : 0, 2), f(b.x, 2), f(b.dx, 4), f(0.5 * b.dx, 4)]).concat([['IV', '0', f(c.x4, 2) + ' (qoldiqdan)', f(c.x4 * c.absOut.SO2, 4), f(0.5 * c.x4 * c.absOut.SO2, 4)]]), [0.8, 0.8, 1.2, 1.4, 1.3]));
  add(T('6.3', 'III qatlamdan chiqadigan (oraliq absorberga kiradigan) gaz', gHead, rowsOf(c.absIn), W5));
  add(H2('6.4. Oraliq (birinchi) monogidrat absorber'));
  add(P(`Absorberda yutiladigan SO₃: n_{SO₃} = ${f(c.etaA, 4)}·${f(c.absIn.SO3, 4)} = ${f(c.SO3abs1, 4)} kmol/soat (${f(c.mSO3a, 2)} kg/soat). Bunda (2.6) bo‘yicha ${f(c.SO3abs1, 4)} kmol/soat (${f(c.SO3abs1 * 98.08, 2)} kg/soat) H₂SO₄ hosil bo‘ladi va kislotadagi ${f(c.SO3abs1 * 18.015, 2)} kg/soat suv sarflanadi.`));
  add(T('6.4', 'Oraliq absorberdan chiqadigan gaz', gHead, rowsOf(c.absOut), W5));
  add(H2('6.5. IV qatlam va yakuniy absorber'));
  add(P(`IV qatlamga kiradigan gazda SO₂ – ${f(c.bed4.a4, 3)} %, O₂ – ${f(c.bed4.b4, 2)} %; O₂ : SO₂ nisbati ${f(c.bed4.b4 / c.bed4.a4, 1)} – juda qulay. Oksidlangan SO₂ ${f(c.x4 * c.absOut.SO2, 4)} kmol/soat. Yakuniy absorberda ${f(c.SO3abs2, 4)} kmol/soat SO₃ yutiladi.`));
  add(T('6.5', 'Atmosferaga chiqariladigan dum gaz', gHead, rowsOf(c.tail), W5));
  add(P(`Dum gazdagi SO₂ konsentratsiyasi ${f(c.tail.SO2 / t.sum(c.tail) * 100, 3)} % (${f(c.tail.SO2 / t.sum(c.tail) * 64066 / 0.022414, 0)} mg/m³), SO₃ – ${f(c.tail.SO3 / t.sum(c.tail) * 1e6, 1)} ppm. Bu IK/IA sxemasi uchun me’yoriy qiymatlarga mos; yer sathidagi konsentratsiya YuChK dan oshmasligi baland quvur orqali tarqatish bilan ta’minlanadi.`));
  {
    {
    const Sin = c.nS; const Sprod = c.G / 98.08; const Sloss = c.nH2SO4 - Sprod; const Sso2 = c.tail.SO2; const Sso3 = c.tail.SO3;
    const Snc = c.furn.SO2 - c.furn.SO2 * c.xTot - Sso2; // tekshiruv uchun
    add(T('6.6', 'Oltingugurt balansi (kmol S/soat)', ['Yo‘nalish', 'kmol/soat', 'kg/soat', '%'], [
      ['O‘choqqa kiradi', f(Sin, 4), f(Sin * 32.06, 3), '100,00'], ['Mahsulot H₂SO₄ tarkibida', f(Sprod, 4), f(Sprod * 32.06, 3), f(Sprod / Sin * 100, 2)],
      ['Mexanik yo‘qotishlar', f(Sloss, 4), f(Sloss * 32.06, 3), f(Sloss / Sin * 100, 2)], ['Dum gazdagi SO₂', f(Sso2, 5), f(Sso2 * 32.06, 3), f(Sso2 / Sin * 100, 2)],
      ['Dum gazdagi SO₃', f(Sso3, 6), f(Sso3 * 32.06, 4), f(Sso3 / Sin * 100, 3)],
      B(['Jami chiqish', f(Sprod + Sloss + Sso2 + Sso3, 4), f((Sprod + Sloss + Sso2 + Sso3) * 32.06, 3), f((Sprod + Sloss + Sso2 + Sso3) / Sin * 100, 2)]),
    ], [2.2, 1, 1, 0.8]));
    add(P(`Oltingugurtdan foydalanish darajasi ${f(Sprod / Sin * 100, 2)} %; asosiy yo‘qotish – konversiyalanmagan SO₂ (${f(Sso2 / Sin * 100, 2)} %) va mexanik yo‘qotishlar.`));
  }
  add(H2('6.6. Quritish minorasi'));
    const mW = c.wetAir.H2O * 18.015; const w1 = 0.94, w2 = 0.935;
    const Lsp = mW * w2 / (w1 - w2); // kislota sirkulyatsiyasi (konsentratsiya pasayishi bo'yicha)
    add(P(`Quritish minorasida havodan ${f(mW, 3)} kg/soat suv yutiladi. Kislota konsentratsiyasining minorada ${f(w1 * 100, 1)} % dan ${f(w2 * 100, 1)} % gacha pasayishiga ruxsat berilsa, sirkulyatsiya qilinadigan kislota sarfi L = m_{s}·w₂/(w₁ – w₂) = ${f(Lsp, 0)} kg/soat. Ammo nasadkani yetarli sug‘orish uchun (U ≥ 10 m³/(m²·soat)) sirkulyatsiya ${f(10 * Math.PI * 0.36 / 4 * 1830, 0)} kg/soat dan kam bo‘lmasligi kerak, shuning uchun L = 3000 kg/soat qabul qilinadi. Konsentratsiyani tiklash uchun quritish kislotasining bir qismi monogidrat yig‘gichiga uzatiladi, o‘rniga absorberdan 98,3 % li kislota qaytariladi (kislota almashinuvi).`));
    add(T('6.7', 'Quritish minorasining moddiy balansi', ['Kirim', 'kg/soat', 'g/s', 'Sarf', 'kg/soat', 'g/s'], [
      ['Nam havo', f(t.mass(c.wetAir), 2), ks(t.mass(c.wetAir)), 'Quritilgan havo', f(t.mass(c.dryAir), 2), ks(t.mass(c.dryAir))],
      ['Kislota (94 %)', '3000,00', ks(3000), 'Kislota (yutilgan suv bilan)', f(3000 + mW, 2), ks(3000 + mW)],
      B(['Jami', f(t.mass(c.wetAir) + 3000, 2), ks(t.mass(c.wetAir) + 3000), 'Jami', f(t.mass(c.dryAir) + 3000 + mW, 2), ks(t.mass(c.dryAir) + 3000 + mW)]),
    ], [1.7, 1, 0.9, 1.9, 1, 0.9]));
  }
  add(H2('6.7. Suv balansi va sexning moddiy balansi'));
  add(P(`Jami hosil bo‘ladigan H₂SO₄ ${f(c.nH2SO4, 4)} kmol/soat (${f(c.nH2SO4 * 98.08, 2)} kg/soat), shundan mexanik yo‘qotishlar ${f(c.nH2SO4 * 98.08 - c.G, 2)} kg/soat. Mahsulot 98,3 % li kislota sifatida chiqariladi: ${f(c.mProd, 2)} kg/soat. SO₃ ni gidratlash va mahsulotni suyultirish uchun kerak bo‘lgan suv: ${f(c.nH2SO4 * 18.015, 2)} + ${f(c.mProd - c.G, 2)} = ${f(c.nH2SO4 * 18.015 + c.mProd - c.G, 2)} kg/soat. Uning ${f(c.H2Oair * 18.015, 2)} kg/soat qismi havodan quritish minorasi orqali keladi, qolgan W = ${f(c.W, 2)} kg/soat texnologik suv sifatida sirkulyatsion yig‘gichga qo‘shiladi.`));
  {
    const mS = c.nS * 32.06 / c.purS, mAir = t.mass(c.wetAir), mIn = mS + mAir + c.W;
    const mTail = t.mass(c.tail), mLoss = c.nH2SO4 * 98.08 - c.G, mImp = mS - c.nS * 32.06;
    const mOut = mTail + c.mProd + mLoss + mImp;
    add(T('6.8', 'Sexning umumiy moddiy balansi', ['Kirim', 'kg/soat', 'g/s', 'Sarf', 'kg/soat', 'g/s'], [
      ['Texnik oltingugurt', f(mS, 2), ks(mS), 'Sulfat kislota 98,3 %', f(c.mProd, 2), ks(c.mProd)],
      ['Nam havo', f(mAir, 2), ks(mAir), 'Dum gaz', f(mTail, 2), ks(mTail)],
      ['Texnologik suv', f(c.W, 2), ks(c.W), 'Mexanik yo‘qotishlar', f(mLoss, 2), ks(mLoss)],
      ['', '', '', 'Oltingugurt aralashmalari (kul)', f(mImp, 2), ks(mImp)],
      B(['Jami', f(mIn, 2), ks(mIn), 'Jami', f(mOut, 2), ks(mOut)]),
    ], [1.7, 1, 0.9, 1.9, 1, 0.9]));
    add(P(`Kirim va sarf orasidagi farq ${f(Math.abs(mIn - mOut), 2)} kg/soat (${f(Math.abs(mIn - mOut) / mIn * 100, 2)} %) – hisoblashdagi yaxlitlashlar va dum gaz tarkibidagi kichik komponentlar hisobiga. Sarf koeffitsiyentlari (1 t 100 % H₂SO₄ ga): oltingugurt – ${f(c.mS / c.G, 3)} t; havo – ${f(c.nAirDry * Vm / c.G * 1000, 0)} m³; texnologik suv – ${f(c.W / c.G, 3)} t. Yillik ishlab chiqarish – ${f(c.G * 8000 / 1000, 0)} t H₂SO₄.`));
  }

  // ============ 7
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Hisoblash usuli'));
  add(P('Issiqlik balanslari Q_{kir} = Q_{sarf} tenglamasi asosida tuziladi; gazlarning fizik issiqligi 298,15 K ga nisbatan c_{p} = a + bT + c′/T² bog‘liqligi bo‘yicha hisoblanadi:'));
  add(F('ΔH_{i} = a(T – T₀) + b/2·(T² – T₀²) – c′(1/T – 1/T₀)', '7.1'));
  add(T('7.1', 'Issiqlik sig‘imi koeffitsiyentlari va entalpiya o‘zgarishlari [2, 13]', ['Modda', 'a', 'b·10³', 'c′·10⁻⁵', 'ΔH (693 K), kJ/kmol', 'ΔH (1201 K), kJ/kmol'],
    ['SO2', 'SO3', 'O2', 'N2', 'Ar'].map(s => { const k = t.CP[s]; return [NAMES[s], f(k.a, 2), f(k.b * 1e3, 2), k.d ? f(k.d / 1e5, 2) : '–', f(t.dH(s, 693.15), 0), f(t.dH(s, c.Tf), 0)]; }), [1, 0.9, 0.9, 0.9, 1.3, 1.3]));
  add(H2('7.2. O‘choqning issiqlik balansi'));
  add(P(`Kirim: suyuq oltingugurtning fizik issiqligi (${f(c.TS, 0)} K) Q₁ = ${f(c.HSin, 2)} kW; quritilgan havoning fizik issiqligi (${f(c.Tairin, 0)} K) Q₂ = ${f(c.Hair_f, 2)} kW; suyuq oltingugurt yonish issiqligi (rombik S yonish issiqligidan suyuqlanish va polimorf o‘tish issiqliklari ayirilgan):`));
  add(F(`Q₃ = n_{S}·(296,9 – 1,72 – 0,40)/3,6 = ${f(c.nS, 4)}·294,78/3,6 = ${f(c.Qr_f, 2)} kW`, '7.2'));
  add(P(`Sarf: o‘choq gazining fizik issiqligi Q₄ va yo‘qotishlar (kirimning ${f(c.lossF * 100, 0)} % i). Gaz harorati balans tenglamasidan topiladi:`));
  add(F(`(Q₁ + Q₂ + Q₃)·(1 – ${f(c.lossF, 2)}) = Σn_{i}·ΔH_{i}(T_{o‘}) / 3600  ⇒  T_{o‘} = ${f(c.Tf, 1)} K`, '7.3'));
  {
    const qin = c.HSin + c.Hair_f + c.Qr_f;
    add(T('7.2', 'O‘choqning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Oltingugurt bilan', f(c.HSin, 2), f(c.HSin / qin * 100, 1), 'O‘choq gazi bilan', f(t.Qphys(c.furn, c.Tf), 2), f(t.Qphys(c.furn, c.Tf) / qin * 100, 1)],
      ['Havo bilan', f(c.Hair_f, 2), f(c.Hair_f / qin * 100, 1), 'Yo‘qotishlar', f(qin * c.lossF, 2), f(c.lossF * 100, 1)],
      ['Yonish issiqligi', f(c.Qr_f, 2), f(c.Qr_f / qin * 100, 1), '', '', ''],
      B(['Jami', f(qin, 2), '100', 'Jami', f(t.Qphys(c.furn, c.Tf) + qin * c.lossF, 2), '100']),
    ], [1.8, 0.8, 0.6, 1.8, 0.8, 0.6]));
  }
  {
    add(H2('7.3. SO₂ konsentratsiyasining o‘choq rejimiga ta’siri'));
    const rows = [0.08, 0.09, 0.10, 0.11, 0.12].map(y => {
      const nA = c.nS / y; const fu = { SO2: c.nS, O2: nA * 0.2095 - c.nS, N2: nA * 0.7809, Ar: nA * 0.0096 };
      const Hair = t.Qphys({ N2: nA * 0.7809, O2: nA * 0.2095, Ar: nA * 0.0096 }, c.Tairin);
      const Tf = t.solveT(T => (c.HSin + c.Qr_f + Hair) * (1 - c.lossF) - t.Qphys(fu, T), 600, 2200);
      const b = (nA * 0.2095 - c.nS) / t.sum(fu) * 100;
      return [f(y * 100, 0), f(nA * Vm, 0), f(Tf, 0), f(b, 2), f(c.xeq(873.15, y * 100, b, c.P / 101325), 3)];
    });
    add(P('O‘choq gazidagi SO₂ konsentratsiyasi havo sarfi bilan rostlanadi. Uning o‘choq harorati, gazdagi kislorod va I qatlam chiqishidagi (873 K) muvozanat konversiya darajasiga ta’siri 7.3-jadvalda keltirilgan (oltingugurt sarfi o‘zgarmas).'));
    add(T('7.3', 'SO₂ konsentratsiyasining ta’siri', ['SO₂, %', 'Havo, m³/soat', 'T_{o‘}, K', 'O₂, %', 'x_{m} (873 K)'], rows, [1, 1.1, 1, 1, 1.1]));
    add(P('SO₂ konsentratsiyasi ortishi bilan havo sarfi va apparatlar o‘lchami kamayadi, o‘choq harorati esa ortadi; ammo kislorod miqdori kamayib, muvozanat konversiya darajasi pasayadi va I qatlamda harorat ruxsat etilgan qiymatdan oshish xavfi tug‘iladi. 10 % li gaz bu omillar o‘rtasidagi maqbul muvozanatni ta’minlaydi.'));
  }
  add(H2('7.4. Qozon-utilizator'));
  add(F(`Q_{qu} = Σn_{i}[ΔH_{i}(${f(c.Tf, 0)}) – ΔH_{i}(${f(c.T1in, 0)})]/3600 = ${f(c.Q_whb, 2)} kW`, '7.4'));
  add(P(`FIK 0,97, ta’minot suvi entalpiyasi 440,2 kJ/kg, 4 MPa to‘yingan bug‘ entalpiyasi 2800 kJ/kg bo‘lganda bug‘ chiqishi G_{b} = Q_{qu}·0,97·3600/(2800 – 440,2) = ${f(c.G_steam, 1)} kg/soat (${f(c.G_steam / 3600 * 1000, 2)} g/s), ya’ni 1 t H₂SO₄ ga ${f(c.G_steam / c.G, 2)} t bug‘.`));
  add(H2('7.5. Kontakt apparat qatlamlari'));
  add(P('Har bir qatlam adiabatik ishlaydi; chiqish harorati kirish gazi fizik issiqligi va reaksiya issiqligi (98,87 kJ/mol SO₂) yig‘indisidan, 1 % yo‘qotishlarni hisobga olib topiladi. Natijalar 7.4-jadvalda keltirilgan.'));
  add(T('7.4', 'Kontakt apparat qatlamlarining issiqlik balansi', ['Qatlam', 'T_{kir}, K', 'Q_{kir}, kW', 'Q_{r}, kW', 'T_{chiq}, K', 'ΔT/1 % x, K', 'x / x_{m}'],
    c.beds.map((b, i) => [['I', 'II', 'III'][i], f(b.Tin, 0), f(b.Qin, 2), f(b.Qr, 2), f(b.Tout, 1), f(b.dTper, 2), `${f(b.x, 2)} / ${f(b.xe, 3)}`])
      .concat([['IV', f(c.bed4.Tin, 0), f(c.bed4.Qin, 2), f(c.bed4.Qr, 2), f(c.bed4.Tout, 1), '–', `${f(c.x4, 2)} / ${f(c.bed4.xe, 3)}`]]), [0.7, 0.8, 0.9, 0.8, 0.9, 1, 1.2]));
  add(P(`Barcha qatlamlarda haqiqiy konversiya darajasi muvozanat qiymatidan kichik, ya’ni belgilangan konversiyaga erishish termodinamik jihatdan mumkin. I qatlamning chiqish harorati ${f(c.beds[0].Tout, 0)} K – katalizatorning ruxsat etilgan haroratidan (873–893 K) past. Qatlamlar orasida gazdan olinadigan issiqlik: I–II ${f(t.Qphys(c.beds[0].out, c.beds[0].Tout) - t.Qphys(c.beds[0].out, c.Tin[1]), 2)} kW, II–III ${f(t.Qphys(c.beds[1].out, c.beds[1].Tout) - t.Qphys(c.beds[1].out, c.Tin[2]), 2)} kW; III qatlamdan keyin ekonomayzerda ${f(t.Qphys(c.absIn, c.beds[2].Tout) - t.Qphys(c.absIn, c.TgA), 2)} kW.`));
  add(H2('7.6. Oraliq absorberning issiqlik balansi'));
  add(P(`Issiqlik kirimi: SO₃ absorbsiyasi issiqligi (2.6) Q_{a} = ${f(c.SO3abs1, 4)}·132,4/3,6 = ${f(c.Qr_abs, 2)} kW; gazni ${f(c.TgA, 0)} K dan ${f(c.TgAout, 0)} K gacha sovitishda ajraladigan issiqlik Q_{g} = ${f(c.Qg_in, 2)} – ${f(c.Qg_out, 2)} = ${f(c.Qg, 2)} kW. Yo‘qotishlar ${f(c.lossAb * 100, 0)} %. Kislota bilan olib chiqiladigan issiqlik:`));
  add(F(`Q_{k} = (Q_{a} + Q_{g})·(1 – 0,02) = ${f(c.Qacid, 2)} kW`, '7.5'));
  add(P(`Kislota absorberda ${f(c.TL1, 0)} K dan ${f(c.TL2, 0)} K gacha isiydi (c_{p} = ${f(c.cpAc, 2)} kJ/(kg·K)). Sirkulyatsiya qilinadigan kislota sarfi:`));
  add(F(`L = Q_{k}·3600/(c_{p}·ΔT) = ${f(c.Qacid, 2)}·3600/(${f(c.cpAc, 2)}·${f(c.TL2 - c.TL1, 0)}) = ${f(c.L, 0)} kg/soat (${f(c.L / 3600, 3)} kg/s)`, '7.6'));
  add(P(`Kislotaning hajmiy sarfi V_{L} = ${f(c.VL, 2)} m³/soat. Absorberdan chiqishda kislota konsentratsiyasi (0,983·L + 1,225·m_{SO₃})/(L + m_{SO₃}) = ${f(c.cOut * 100, 2)} % – ruxsat etilgan 98,8 % dan oshmaydi.`));
  {
    const qin = c.Qr_abs + c.Qg_in + 0;
    add(T('7.5', 'Oraliq absorberning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Gazning fizik issiqligi', f(c.Qg_in, 2), f(c.Qg_in / qin * 100, 1), 'Gaz bilan chiqadi', f(c.Qg_out, 2), f(c.Qg_out / qin * 100, 1)],
      ['Absorbsiya issiqligi', f(c.Qr_abs, 2), f(c.Qr_abs / qin * 100, 1), 'Kislotaning isishi', f(c.Qacid, 2), f(c.Qacid / qin * 100, 1)],
      ['', '', '', 'Yo‘qotishlar', f((c.Qr_abs + c.Qg) * c.lossAb, 2), f((c.Qr_abs + c.Qg) * c.lossAb / qin * 100, 1)],
      B(['Jami', f(qin, 2), '100', 'Jami', f(c.Qg_out + c.Qacid + (c.Qr_abs + c.Qg) * c.lossAb, 2), '100']),
    ], [1.8, 0.8, 0.6, 1.8, 0.8, 0.6]));
  }
  add(H2('7.7. Kislota sovitgichi'));
  add(P(`Sovitgichda kislota ${f(c.TL2, 0)} K dan ${f(c.TL1, 0)} K gacha sovitiladi, aylanma suv 293 → 303 K ga isiydi. Suv sarfi G_{s} = Q_{k}/(c_{s}·ΔT) = ${f(c.Gw, 0)} kg/soat. Δt_{o‘r} = ${f(c.dTlog, 1)} K, anod himoyali plastinkali sovitgich uchun K = ${c.Kc} W/(m²·K):`));
  add(F(`F = Q_{k}/(K·Δt_{o‘r}) = ${f(c.Qacid * 1000, 0)}/(${c.Kc}·${f(c.dTlog, 1)}) = ${f(c.Fc, 2)} m²`, '7.7'));

  {
    {
    add(H2('7.8. Sex bo‘yicha issiqlik utilizatsiyasi'));
    const q1 = c.Q_whb, q2 = t.Qphys(c.beds[0].out, c.beds[0].Tout) - t.Qphys(c.beds[0].out, c.Tin[1]), q3 = t.Qphys(c.beds[1].out, c.beds[1].Tout) - t.Qphys(c.beds[1].out, c.Tin[2]);
    const q4 = t.Qphys(c.absIn, c.beds[2].Tout) - t.Qphys(c.absIn, c.TgA); const q5 = c.Qacid; const tot = c.Qr_f + c.beds.reduce((a, b) => a + b.Qr, 0) + c.bed4.Qr + c.Qr_abs + c.SO3abs2 * 132.4 / 3.6;
    add(P(`Sexda ajraladigan umumiy kimyoviy issiqlik (oltingugurt yonishi, SO₂ oksidlanishi, SO₃ absorbsiyasi) ${f(tot, 1)} kW ni tashkil etadi. Uning taqsimlanishi 7.6-jadvalda keltirilgan.`));
    add(T('7.6', 'Issiqlikdan foydalanish', ['Issiqlik iste’molchisi / manbasi', 'Q, kW', 'Umumiydan %'], [
      ['Qozon-utilizator (4 MPa bug‘)', f(q1, 1), f(q1 / tot * 100, 1)], ['I–II qatlamlar orasidagi issiqlik almashtirgich', f(q2, 1), f(q2 / tot * 100, 1)],
      ['II–III qatlamlar orasidagi issiqlik almashtirgich', f(q3, 1), f(q3 / tot * 100, 1)], ['Ekonomayzer (III qatlamdan keyin)', f(q4, 1), f(q4 / tot * 100, 1)],
      ['Oraliq absorber kislotasi (past potensialli)', f(q5, 1), f(q5 / tot * 100, 1)],
    ], [3, 1, 1]));
    add(P('Yuqori potensialli issiqlikning asosiy qismi qozon-utilizator va ekonomayzerda bug‘ olishga sarflanadi; qatlamlar orasidagi issiqlik IV qatlamga qaytadigan gazni isitishga ishlatiladi. Absorber kislotasining past potensialli issiqligi aylanma suv bilan olib chiqiladi; zamonaviy qurilmalarda (HRS tizimi) bu issiqlikdan ham past bosimli bug‘ olinadi.'));
  }
  add(H2('7.9. Quritish minorasining issiqlik balansi'));
    const mW = c.wetAir.H2O * 18.015; const q = mW / 3600 * (2430 + 400); // bug' kondensatsiyasi + suyultirish issiqligi ~ 400 kJ/kg
    const dT = q / (3000 / 3600 * 1.5);
    add(P(`Minorada havodagi suv bug‘i kislotaga yutilganda bug‘ kondensatsiyasi issiqligi (≈ 2430 kJ/kg) va kislotani suyultirish issiqligi (≈ 400 kJ/kg suv) ajraladi: Q = ${f(mW, 3)}·(2430 + 400)/3600 = ${f(q, 2)} kW. Kislotaning isishi ΔT = Q/(L·c_{p}) = ${f(q, 2)}/(${f(3000 / 3600, 3)}·1,50) = ${f(dT, 1)} K. Bundan tashqari, havo kislotadan isiydi (303 → 313 K). Isish kichik bo‘lgani uchun quritish kislotasi sovitgichi kichik yuzali (F = 4 m²) qabul qilinadi; u kislota haroratini 313–318 K da ushlab turadi.`));
  }

  // ============ 8
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(H2('8.1. Monogidrat absorber: oqim xossalari'));
  add(P(`Absorberga kiradigan gaz: n = ${f(c.nG, 3)} kmol/soat, M = ${f(c.Mg, 2)} kg/kmol, massaviy sarf G = ${f(c.mG, 4)} kg/s. O‘rtacha harorat T = (${f(c.TgA, 0)} + ${f(c.TgAout, 0)})/2 = ${f(c.Tm, 0)} K, bosim ${f(c.Pa / 1e6, 2)} MPa:`));
  add(F(`ρ_{g} = P·M/(R·T) = ${f(c.Pa, 0)}·${f(c.Mg, 2)}/(8314·${f(c.Tm, 0)}) = ${f(c.rhoG, 3)} kg/m³;   V_{g} = ${f(c.Vg, 4)} m³/s`, '8.1'));
  add(P(`Kislota: L = ${f(c.L / 3600, 3)} kg/s, ρ_{L} = ${c.rhoL} kg/m³, μ_{L} = ${f(c.muL, 1)} mPa·s (343–363 K). Nasadka – keramik Rashig halqalari ${c.pk.name} mm: a = ${f(c.pk.a, 1)} m²/m³, ε = ${f(c.pk.e, 3)} m³/m³, d_{e} = ${f(c.pk.de, 3)} m.`));
  add(H2('8.2. Absorber diametri'));
  add(F('lg[w²_{t}·a·ρ_{g}·μ_{L}^{0,16}/(g·ε³·ρ_{L})] = A – 1,75·(L/G)^{0,25}·(ρ_{g}/ρ_{L})^{0,125}', '8.2'));
  add(P(`A = ${f(c.A, 3)}; L/G = ${f(c.L / 3600 / c.mG, 2)}; o‘ng tomon ${f(c.rhs, 4)}. Bundan tiqilish tezligi w_{t} = ${f(c.wt, 3)} m/s; ish tezligi w = 0,75·w_{t} = ${f(c.wr, 3)} m/s.`));
  add(F(`D = (4V_{g}/(π·w))^{0,5} = (4·${f(c.Vg, 4)}/(3,1416·${f(c.wr, 3)}))^{0,5} = ${f(c.Dcalc, 3)} m`, '8.3'));
  add(P(`Normallashtirilgan ichki diametr (futerovka ichidan) D = ${f(c.D * 1000, 0)} mm qabul qilinadi (D/d = ${f(c.D / c.pk.d, 0)}). Kesim S = ${f(c.S, 4)} m², haqiqiy gaz tezligi w = ${f(c.w, 3)} m/s (tiqilishning ${f(c.w / c.wt * 100, 0)} % i). Sug‘orish zichligi U = V_{L}/S = ${f(c.U, 1)} m³/(m²·soat), minimal samarali sug‘orish U_{min} = a·q_{ef} = ${f(c.Umin, 2)} m³/(m²·soat); U > U_{min} – nasadka to‘liq namlanadi (ψ = 1).`));
  add(H2('8.3. Massa berish koeffitsiyenti va nasadka balandligi'));
  add(P(`SO₃ ning havodagi diffuziya koeffitsiyenti (273 K, 0,1 MPa da 0,094·10⁻⁴ m²/s) ish sharoitiga qayta hisoblanadi: D = 0,094·10⁻⁴·(T/273)^{1,75}·(P₀/P) = ${e(c.DSO3, 3)} m²/s. Gaz qovushoqligi μ_{g} = ${e(c.muG, 1)} Pa·s.`));
  add(F(`Re = 4w·ρ_{g}/(a·μ_{g}) = ${f(c.Re, 0)};   Pr′ = μ_{g}/(ρ_{g}·D) = ${f(c.Pr, 3)}`, '8.4'));
  add(F(`Nu′ = 0,407·Re^{0,655}·Pr′^{0,33} = ${f(c.Nu, 2)};   β_{g} = Nu′·D/d_{e} = ${f(c.beta, 4)} m/s`, '8.5'));
  add(P(`Mol ulushlardagi massa berish koeffitsiyenti β_{y} = β_{g}·ρ_{g}/M = ${e(c.betaY, 3)} kmol/(m²·s). Monogidrat ustidagi SO₃ muvozanat bosimi amalda nolga teng bo‘lgani uchun jarayon gaz fazasi bilan cheklanadi:`));
  add(F(`n_{oy} = ln(y₁/y₂) = ln(${f(c.y1, 5)}/${e(c.y2, 3)}) = ${f(c.NOG, 2)}`, '8.6'));
  add(F(`h_{oy} = G_{n}/(β_{y}·a·ψ) = ${f(c.Gi, 5)}/(${e(c.betaY, 3)}·${f(c.pk.a, 1)}·1) = ${f(c.HOG, 3)} m`, '8.7'));
  add(F(`H_{n} = n_{oy}·h_{oy} = ${f(c.NOG, 2)}·${f(c.HOG, 3)} = ${f(c.Hn, 2)} m`, '8.8'));
  add(P(`bu yerda G_{n} = n/(3600·S) – gazning solishtirma molyar sarfi, kmol/(m²·s). Gaz va suyuqlikning notekis taqsimlanishini hisobga oluvchi zaxira koeffitsiyenti ${f(c.kz, 1)} bilan nasadka balandligi ${f(c.Hn * c.kz, 2)} m → ${f(c.Hpack, 1)} m qabul qilinadi. Sanoat monogidrat absorberlarida nasadka balandligi 3–4 m ni tashkil etadi, olingan natija bunga mos keladi.`));
  add(H2('8.4. Gidravlik qarshilik'));
  add(F(`λ = 16/Re^{0,2} = ${f(c.lam, 3)};   ΔP_{q} = λ·(H/d_{e})·ρ_{g}·w²/(2ε²) = ${f(c.dPdry, 0)} Pa`, '8.9'));
  add(F(`ΔP_{n} = ΔP_{q}·10^{b·U} = ${f(c.dPdry, 0)}·10^{${c.pk.b}·${f(c.U / 3600, 5)}} = ${f(c.dPwet, 0)} Pa`, '8.10'));
  add(P(`Kolosnik panjara, taqsimlagich va tola filtrlarning qarshiligini (≈ 1,5 kPa) qo‘shib, absorberning umumiy qarshiligi ≈ ${f((c.dPwet + 1500) / 1000, 2)} kPa.`));
  add(H2('8.5. Absorber konstruksiyasi va o‘lchamlari'));
  add(P(`Absorber – vertikal silindrik po‘lat korpus (Ст3, s = ${c.s} mm), ichidan ikki qavat kislotabardosh g‘isht bilan (qalinligi ${f(c.lin * 1000, 0)} mm) futerovkalangan; korpusning tashqi diametri ${f((c.D + 2 * c.lin + 2 * c.s / 1000) * 1000, 0)} mm. Nasadka cho‘yan kolosnik panjarada joylashadi; pastki qatlam 80 mm li halqalar bilan tartibli teriladi. Kislota quvurli taqsimlagich orqali (1 m² ga ≥ 40 nuqta) beriladi. Balandlik: nasadka ${f(c.Hpack, 1)} m; kislota taqsimlash zonasi 1,2 m; filtr zonasi 1,0 m; gaz kirish zonasi va kub 1,5 m; qopqoq 0,5 m; jami H ≈ ${f(c.Htot, 1)} m.`));
  add(P(`Shtutserlar: gaz uchun (w = 15 m/s, 453 K) d = ${f(c.dG * 1000, 0)} mm → Dy 150; kislota uchun (w = 1 m/s) d = ${f(c.dL * 1000, 0)} mm → Dy 65 (kislota chiqishi o‘z oqimi bilan, Dy 100).`));
  {
    const VL = c.VL / 3600, d0 = 0.012, h = 0.08, mu0 = 0.62; const w0 = mu0 * Math.sqrt(2 * 9.81 * h); const n = VL / (Math.PI * d0 * d0 / 4 * w0);
    add(P(`Kislota taqsimlagichi – quvurli kollektor, tarmoqlaridagi teshiklar diametri d₀ = 12 mm (tiqilib qolmasligi uchun), teshik ustidagi kislota ustuni h = 80 mm. Oqib chiqish tezligi w₀ = μ·(2gh)^{0,5} = ${f(w0, 3)} m/s, teshiklar soni n = V_{L}/(0,785·d₀²·w₀) = ${f(n, 1)} → ${Math.ceil(n)} ta (1 m² kesimga ${f(Math.ceil(n) / c.S, 0)} nuqta). Kolosnik panjaraga tushadigan yuk: nasadka massasi ${f(c.S * c.Hpack * c.pk.rho, 0)} kg va ushlanib turgan kislota (nasadka hajmining 5 % i) ${f(c.S * c.Hpack * 0.05 * c.rhoL, 0)} kg, jami ${f((c.S * c.Hpack * (c.pk.rho + 0.05 * c.rhoL)) * 9.81 / 1000, 1)} kN; cho‘yan kolosnik (erkin kesimi 70 %) bunga bemalol chidaydi.`));
  }
  add(IMG(path.join(FIG, 'absorber5.png'), 310, 400, '8.1-rasm. Monogidrat absorberning sxematik chizmasi'));
  add(T('8.1', 'Monogidrat absorber hisobining natijalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['Gaz sarfi, m³/s (ish sharoitida)', f(c.Vg, 4)], ['Yutiladigan SO₃, g/s', f(c.mSO3a / 3.6, 2)], ['Kislota sarfi, kg/s', f(c.L / 3600, 3)],
    ['Diametr (ichki), m', f(c.D, 2)], ['Gaz tezligi, m/s', f(c.w, 3)], ['Sug‘orish zichligi, m³/(m²·soat)', f(c.U, 1)],
    ['n_{oy} / h_{oy}, m', `${f(c.NOG, 2)} / ${f(c.HOG, 3)}`], ['Nasadka balandligi, m', f(c.Hpack, 1)], ['Umumiy balandlik, m', f(c.Htot, 1)],
    ['Gidravlik qarshilik, kPa', f((c.dPwet + 1500) / 1000, 2)], ['Kislota konsentratsiyasi (kirish/chiqish), %', `98,30 / ${f(c.cOut * 100, 2)}`],
  ], [2.5, 1.5]));
  {
    add(H2('8.6. Kislota isishining sirkulyatsiyaga ta’siri'));
    const rows = [10, 15, 20, 25, 30].map(dT => { const L = c.Qacid * 3600 / (c.cpAc * dT); const U = L / c.rhoL / c.S; const co = (0.983 * L + c.mSO3a * 98.08 / 80.066) / (L + c.mSO3a); return [String(dT), f(L, 0), f(U, 1), f(co * 100, 2)]; });
    add(T('8.2', 'Kislotaning absorberda isishi ΔT ning sirkulyatsiya, sug‘orish zichligi va chiqish konsentratsiyasiga ta’siri', ['ΔT, K', 'L, kg/soat', 'U, m³/(m²·soat)', 'c_{chiq}, % H₂SO₄'], rows, [1, 1, 1.2, 1.2]));
    add(P('ΔT ning ortishi kislota sirkulyatsiyasini kamaytiradi, ammo kislotaning chiqish konsentratsiyasi 98,8 % dan oshib, absorber pastida SO₃ ning muvozanat bosimi ortadi, shuningdek, sug‘orish zichligi kamayadi. ΔT = 20 K (343 → 363 K) maqbul qiymat sifatida qabul qilingan.'));
  }
  add(H2('8.7. Absorber balandligiga absorbsiya darajasining ta’siri'));
  {
    const rows = [0.999, 0.9995, 0.9998, 0.9999].map(eta => { const N = Math.log(1 / (1 - eta)); return [f(eta * 100, 2), f(N, 2), f(N * c.HOG, 2), f(N * c.HOG * c.kz, 2)]; });
    add(T('8.3', 'Absorbsiya darajasining zarur nasadka balandligiga ta’siri', ['η, %', 'n_{oy}', 'H_{n}, m', 'H_{n}·k_{z}, m'], rows, [1, 1, 1, 1]));
    add(P('Jadvaldan ko‘rinadiki, absorbsiya darajasini 99,9 % dan 99,99 % gacha oshirish nasadka balandligini atigi 1,3 marta oshiradi, chunki n_{oy} logarifmik bog‘liqlikka ega. Amalda absorbsiya darajasini nasadka balandligidan ko‘ra tuman hosil bo‘lishi cheklaydi, shuning uchun absorber tepasida tola filtrlar o‘rnatilishi shart.'));
  }
  add(H2('8.8. Oltingugurt yoqish o‘chog‘ining hisobi'));
  add(P(`O‘choq hajmi yonish kamerasining ruxsat etilgan issiqlik kuchlanishi bo‘yicha aniqlanadi. Forsunkali o‘choqlar uchun q_{V} = 0,5–1,0 MW/m³; q_{V} = ${c.qV} kW/m³ qabul qilamiz:`));
  add(F(`V_{o‘} = Q₃/q_{V} = ${f(c.Qr_f, 2)}/${c.qV} = ${f(c.Vf, 3)} m³`, '8.11'));
  add(P(`Ichki diametr D = ${f(c.Df, 1)} m bo‘lganda uzunlik L = V/(0,785·D²) = ${f(c.Lf, 2)} m → 1,5 m (L/D = 2,5). O‘choq gazining ish sharoitidagi hajmi (${f(c.Tf, 0)} K) ${f(c.Vfg, 3)} m³/s, gaz tezligi ${f(c.wf, 2)} m/s, bo‘lish vaqti τ = V/V_{g} = ${f(c.tauF, 2)} s (oltingugurtning to‘liq yonishi uchun ≥ 0,4 s talab qilinadi). O‘choq korpusi po‘latdan (s = 8 mm), ichidan shamotli g‘isht (230 mm) va diatomit (115 mm) bilan futerovkalanadi; ichida gazni aralashtirish uchun ikkita to‘siq devor joylashadi. Oltingugurt sarfi ${f(c.mS, 1)} kg/soat bo‘lgani uchun unumdorligi 150 kg/soat bo‘lgan bitta mexanik forsunka o‘rnatiladi.`));
  {
    add(H2('8.9. Quritish minorasining qisqacha hisobi'));
    const Vd = c.Vdry; const S = Math.PI * 0.36 / 4; const w = Vd / S; const y1 = c.yW, y2 = 0.0001; const N = Math.log(y1 / y2);
    add(P(`Havo sarfi (303 K, 0,105 MPa) V = ${f(Vd, 4)} m³/s. Gaz tezligi 0,8 m/s bo‘lganda D = ${f(c.Ddry, 3)} m → 0,6 m (w = ${f(w, 3)} m/s). 94 % li kislota ustidagi suv bug‘ining muvozanat bosimi juda kichik (313 K da ≈ 0,4 Pa), shuning uchun jarayon gaz fazasi bilan cheklanadi: n_{oy} = ln(y₁/y₂) = ln(${f(y1, 4)}/0,0001) = ${f(N, 2)}. Suv bug‘ining diffuziya koeffitsiyenti SO₃ nikidan taxminan 2,3 marta katta bo‘lgani uchun h_{oy} ≈ 0,25 m; nasadka balandligi ${f(N, 2)}·0,25·1,3 = ${f(N * 0.25 * 1.3, 2)} m → 2,5 m. Minoraning umumiy balandligi ≈ 7 m (nasadka, taqsimlash zonasi, tomchi ushlagich va kub bilan).`));
  }
  add(H2('8.10. Kontakt apparat katalizator qatlamlari'));
  add(P(`IK/IA sxemasi uchun katalizatorning solishtirma sarfi 0,18–0,22 m³ ga 1 t/sutka H₂SO₄; ${f(c.vcatSpec, 2)} m³/(t/sutka) qabul qilinib, umumiy hajm V_{k} = ${f(c.Vcat, 2)} m³. Qatlamlar bo‘yicha taqsimlanishi (20/25/30/25 %): ${c.Vbed.map(v => f(v, 3)).join('; ')} m³. Gazning normal sharoitdagi sarfi ${f(c.Vgn, 4)} m³/s, shartli kontakt vaqtlari ${c.tau0.map(v => f(v, 2)).join('; ')} s. Apparat diametri o‘rtacha haroratdagi gaz tezligi 0,45 m/s bo‘yicha D = ${f(c.Dc, 2)} m → ${f(c.Dcs, 1)} m; qatlam balandliklari ${c.hbed.map(v => f(v, 2)).join('; ')} m. Qatlamlardagi jarayon x–T diagrammada (8.2-rasm) tasvirlangan.`));
  add(IMG(path.join(FIG, 'xt5.png'), 430, 282, '8.2-rasm. Kontakt apparatning I–III qatlamlaridagi jarayonning x–T diagrammasi'));

  // ============ 9
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Jihozlar soni n = V_{talab}/V_{bir} formula bo‘yicha aniqlanadi; V_{talab} – talab etilgan unumdorlik, V_{bir} – bitta apparatning unumdorligi.'));
  {
    const vmax = c.wr * c.S;
    const Fwhb = c.Q_whb * 1000 / (40 * (((c.Tf - 523) - (c.T1in - 523)) / Math.log((c.Tf - 523) / (c.T1in - 523))));
    add(T('9.1', 'Asosiy jihozlar sonini hisoblash', ['Jihoz', 'Talab etilgan', 'Bitta apparat imkoniyati', 'n_{hisob}', 'Qabul'], [
      ['Oraliq absorber (D = 0,6 m)', `${f(c.Vg, 3)} m³/s`, `${f(vmax, 3)} m³/s`, f(c.Vg / vmax, 2), '1'],
      ['Yakuniy absorber (D = 0,6 m)', `${f(t.sum(c.bed4.out) / 3600 * 8.314 * 380 / c.Pa * 1000, 3)} m³/s`, `${f(vmax, 3)} m³/s`, f(t.sum(c.bed4.out) / 3600 * 8.314 * 380 / c.Pa * 1000 / vmax, 2), '1'],
      ['Quritish minorasi', `${f(c.Vdry, 3)} m³/s`, `${f(0.8 * Math.PI * 0.6 ** 2 / 4, 3)} m³/s (D = 0,6 m)`, f(c.Vdry / (0.8 * Math.PI * 0.36 / 4), 2), '1'],
      ['Oltingugurt o‘chog‘i', `${f(c.Vf, 3)} m³`, `${f(Math.PI * 0.36 / 4 * 1.5, 3)} m³`, f(c.Vf / (Math.PI * 0.36 / 4 * 1.5), 2), '1'],
      ['Qozon-utilizator', `${f(Fwhb, 1)} m²`, '20 m²', f(Fwhb / 20, 2), '1'],
      ['Kislota sovitgichi (har absorberga)', `${f(c.Fc, 2)} m²`, '8 m²', f(c.Fc / 8, 2), '1 + 1'],
      ['Kontakt apparat', `${f(c.Vcat, 2)} m³ katalizator`, `${f(c.Vcat, 2)} m³ (D = 1,0 m)`, '1,00', '1'],
    ], [2, 1.2, 1.6, 0.7, 0.6]));
    add(P(`Qozon-utilizator yuzasi gazdan suvga issiqlik uzatish koeffitsiyenti K = 40 W/(m²·K) va qaynayotgan suv harorati 523 K bo‘yicha hisoblandi. Gazoduvka: havo sarfi ${f(c.nAirDry * Vm, 0)} m³/soat, bosim 25 kPa, quvvati N = V·ΔP/η = ${f(c.nAirDry * Vm / 3600 * 25000 / 0.65 / 1000, 2)} kW → 4 kW li dvigatel; 1 ishchi + 1 zaxira. Kislota sirkulyatsiya nasoslari: Q = ${f(c.VL, 1)} m³/soat, H = 25 m, har bir absorber va quritish minorasi uchun 1 ishchi + 1 zaxira. Oltingugurt nasosi – bug‘ g‘ilofli, Q = 0,1 m³/soat, 1 ishchi + 1 zaxira.`));
  }

  // ============ 10
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Quritish minorasi', '1', 'D = 0,6 m, H = 7 m, nasadka 50×50×5, 93 % H₂SO₄', 'Ст3 + kislotabardosh g‘isht'],
    ['2', 'Gazoduvka', '2 (1 zaxira)', `V = ${f(c.nAirDry * Vm, 0)} m³/soat, ΔP = 25 kPa, N = 4 kW`, 'Uglerodli po‘lat'],
    ['3', 'Suyuq oltingugurt yig‘gichi', '1', 'V = 5 m³, bug‘ zmeyevikli', 'Ст3'],
    ['4', 'Oltingugurt nasosi', '2 (1 zaxira)', 'Bug‘ g‘ilofli, Q = 0,1 m³/soat, H = 50 m', '12Х18Н10Т'],
    ['5', 'Oltingugurt yoqish o‘chog‘i', '1', `D = 0,6 m, L = 1,5 m, q_{V} = 0,6 MW/m³, 1 forsunka`, 'Ст3 + shamot'],
    ['6', 'Qozon-utilizator', '1', `F = 20 m², bug‘ ${f(c.G_steam, 0)} kg/soat, 4 MPa`, '12ХМ / 20К'],
    ['7', 'Kontakt apparat', '1', `D = 1,0 m, 4 qatlam, katalizator ${f(c.Vcat, 2)} m³ (ИК-1-6)`, '12Х18Н10Т'],
    ['8', 'Issiqlik almashtirgichlar', '3', 'Qobiq-quvurli, F = 6–12 m²', '12Х18Н10Т / 20'],
    ['9', 'Ekonomayzer', '1', 'F = 5 m²', '20'],
    ['10', 'Oraliq monogidrat absorber', '1', `D = 0,6 m, H = ${f(c.Htot, 1)} m, nasadka ${f(c.Hpack, 1)} m, tola filtrlar`, 'Ст3 + kislotabardosh g‘isht'],
    ['11', 'Yakuniy monogidrat absorber', '1', 'D = 0,6 m, H = 8 m, tola filtrlar', 'Ст3 + kislotabardosh g‘isht'],
    ['12', 'Sirkulyatsion yig‘gichlar', '3', 'V = 2 m³, botiriladigan nasosli', 'Ст3 + futerovka'],
    ['13', 'Kislota sovitgichlari', '3', 'Plastinkali, anod himoyali, F = 8 m²', '12Х18Н10Т'],
    ['14', 'Kislota nasoslari', '6 (3 zaxira)', `Q = ${f(c.VL, 0)} m³/soat, H = 25 m`, 'ЭИ-943 qotishmasi'],
    ['15', 'Mahsulot ombori', '2', 'V = 50 m³', 'Ст3'],
  ], [0.5, 2.2, 1, 2.9, 1.6]));

  // ============ 11
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('Sulfat kislota sexida tahliliy nazorat xomashyo va mahsulot sifatini, gaz tarkibini va konversiya hamda absorbsiya darajalarini, shuningdek atmosferaga chiqariladigan zararli moddalar miqdorini nazorat qilish uchun olib boriladi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul, asbob', 'Davriyligi'], [
    ['Oltingugurt', 'S, kul, organik moddalar, namlik', 'S ≥ 99,8 %; kul ≤ 0,02 %', 'Gravimetrik, kuydirish', 'Har partiya'],
    ['Quritilgan havo', 'H₂O', '≤ 0,01 % (hajm)', 'Gigrometr (shudring nuqtasi)', 'Uzluksiz'],
    ['O‘choq gazi', 'SO₂', '9,5–10,5 %', 'Avtomatik gazanalizator, Rich usuli', 'Uzluksiz'],
    ['Kontakt apparat qatlamlari', 'SO₂ (kirish/chiqish), harorat', 'x bo‘yicha 6.2-jadval', 'Yod bilan titrlash (Rich), termoparalar', '2 soatda 1 marta'],
    ['Absorber oldidan va keyin', 'SO₃', 'η ≥ 99,98 %', 'Titrlash', '1 marta smenada'],
    ['Sirkulyatsion kislota', 'H₂SO₄', '98,3 ± 0,2 %', 'Konduktometrik konsentratomer, titrlash', 'Uzluksiz'],
    ['Quritish kislotasi', 'H₂SO₄', '93–94 %', 'Zichlik, titrlash', '2 soatda 1 marta'],
    ['Mahsulot kislota', 'H₂SO₄, Fe, qoldiq', 'GOST 2184', 'Titrlash, fotokolorimetrik', 'Har partiya'],
    ['Dum gaz', 'SO₂; tuman (H₂SO₄)', '≤ 0,05 %; ≤ 50 mg/m³', 'Avtomatik analizator; filtr usuli', 'Uzluksiz; 1 marta sutkada'],
    ['Ish zonasi havosi', 'SO₂; H₂SO₄', '≤ 10; ≤ 1 mg/m³', 'Signalizatorlar, aspirator', 'Uzluksiz'],
  ], [1.7, 1.6, 1.3, 1.8, 1.2]));
  add(P('SO₂ miqdori Rich usulida aniqlanadi: ma’lum hajmdagi yod eritmasi orqali gaz o‘tkaziladi va eritma rangsizlanguncha so‘rilgan gaz hajmi o‘lchanadi (SO₂ + I₂ + 2H₂O = H₂SO₄ + 2HI). Konversiya darajasi qatlamdan oldingi va keyingi SO₂ miqdorlari bo‘yicha x = (a – a′)/(a·(1 – 0,015a′)) formulasidan hisoblanadi. Absorber kislotasi konsentratsiyasi elektr o‘tkazuvchanlik bo‘yicha uzluksiz o‘lchanadi va sirkulyatsion yig‘gichga suv yoki 93 % li kislota qo‘shish avtomatik rostlanadi.'));
  add(P('Sulfat kislota konsentratsiyasi laboratoriyada namunani suv bilan suyultirib, 1 N natriy gidroksid eritmasi bilan metiloranj ishtirokida titrlash orqali aniqlanadi: X = V·N·0,04904·100/m. Monogidrat absorberi kislotasi uchun aniqroq usul – erkin SO₃ yoki erkin suvni oleum bilan titrlash (yoki bug‘lanish issiqligi bo‘yicha) qo‘llaniladi. Dum gazdagi tuman miqdori shisha tolali filtr orqali ma’lum hajmdagi gazni so‘rib, filtrda ushlangan kislotani titrlash orqali topiladi.'));
  add(H2('11.2. Avtomatlashtirish va blokirovkalar'));
  add(P('Asosiy rostlash konturlari: o‘choqqa oltingugurt sarfi – gazdagi SO₂ konsentratsiyasi bo‘yicha; havo sarfi – unumdorlik bo‘yicha; kontakt apparat qatlamlariga kirish harorati – issiqlik almashtirgichlarning bayponlari orqali; absorber kislotasining konsentratsiyasi va harorati; qozon-utilizator barabanidagi suv sathi. Blokirovkalar: gazoduvka to‘xtaganda oltingugurt berish to‘xtatiladi; kislota sirkulyatsiyasi to‘xtaganda gazoduvka o‘chiriladi (absorberga issiq SO₃ li gaz kislotasiz kirishiga yo‘l qo‘yilmaydi); qozon barabanida sath pasayganda signal va o‘choq to‘xtatiladi.'));

  // ============ 12
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Xomashyo turlari va kontaktlash sxemalari solishtirilib, unumdorligi ${f(c.Gday / 1000, 0)} t/sutka bo‘lgan sex uchun gaz oltingugurtini forsunkali o‘choqda yoqish, “3 + 1” qatlamli ikki marta kontaktlash va ikki marta absorbsiyalash (IK/IA) sxemasi hamda nasadkali monogidrat absorberlar asoslab tanlandi.`));
  add(P(`2. Moddiy balans bo‘yicha: oltingugurt sarfi ${f(c.mS, 2)} kg/soat (${ks(c.mS)} g/s; ${f(c.mS / c.G, 3)} t/t), havo sarfi ${f(c.nAirDry * Vm, 0)} m³/soat, o‘choq gazida SO₂ 10 %; umumiy konversiya darajasi ${f(c.xTot * 100, 1)} %, absorbsiya darajasi ${f(c.etaA * 100, 2)} %; 98,3 % li kislota chiqishi ${f(c.mProd, 1)} kg/soat; dum gazda SO₂ ${f(c.tail.SO2 / t.sum(c.tail) * 100, 3)} %.`));
  add(P(`3. Issiqlik balanslari bo‘yicha: o‘choq gazi harorati ${f(c.Tf, 0)} K; qozon-utilizatorda ${f(c.G_steam, 0)} kg/soat 4 MPa bug‘ olinadi; I qatlamda gaz ${f(c.beds[0].Tin, 0)} K dan ${f(c.beds[0].Tout, 0)} K gacha qiziydi; oraliq absorberda ${f(c.Qacid, 1)} kW issiqlik ajraladi, kislota sirkulyatsiyasi ${f(c.L / 1000, 2)} t/soat, sovitgich yuzasi ${f(c.Fc, 2)} m².`));
  add(P(`4. Monogidrat absorber hisoblandi: diametri ${f(c.D * 1000, 0)} mm, nasadka – keramik halqalar 50×50×5 mm, n_{oy} = ${f(c.NOG, 2)}, h_{oy} = ${f(c.HOG, 3)} m, nasadka balandligi ${f(c.Hpack, 1)} m, umumiy balandlik ${f(c.Htot, 1)} m, gidravlik qarshilik ${f((c.dPwet + 1500) / 1000, 2)} kPa. Oltingugurt o‘chog‘i: hajmi ${f(c.Vf, 3)} m³, D = 0,6 m, L = 1,5 m. Har bir apparatdan 1 tadan talab qilinadi.`));
  add(P('5. Asosiy jihozlar ro‘yxati va tahliliy nazorat sxemasi ishlab chiqildi. IK/IA sxemasi va tola filtrlar SO₂ va sulfat kislota tumanining atmosferaga chiqishini me’yoriy darajada ta’minlaydi, qozon-utilizatorda olingan bug‘ esa sexning energiya samaradorligini oshiradi.'));

  // ============ 13
  add(H1('13. Adabiyotlar ro‘yxati'));
  const refs = [
    'T.A. Otaqo‘ziyev, M. Iskandarova, R.A. Rahimov, E.T. Otaqo‘ziyev. Jihozlar va loyihalash asoslari. – T.: O‘zbekiston faylasuflari milliy jamiyati nashriyoti, 2010. – 320 b.',
    'Позин М.Е. Расчёты по технологии неорганических веществ. – Л.: Химия, 1977. – 496 с.',
    'Тетеревков А.И., Печковский В.В. Оборудование заводов неорганических веществ и основы проектирования. – Минск: Вышэйшая школа, 1981.',
    'Тетеревков А.И. Оборудование производств неорганических веществ. – Минск: Химия, 1987.',
    'Хуснутдинов В.А. и др. Оборудование производств неорганических веществ. – Л.: Химия, 1987. – 247 с.',
    'Yusupbekov N.R., Nurmuxamedov X.S., Zokirov S.G. Kimyoviy texnologiya asosiy jarayon va qurilmalari. – T.: Sharq, 2003. – 644 b.',
    'Shamshidinov I.T. Noorganik moddalar va mineral o‘g‘itlar texnologiyasi. – T.: «ILM ZIYO», 2015. – 400 b.',
    'Лащинский А.А., Толчинский А.Р. Основы конструирования и расчёта химической аппаратуры. Справочник. – Л.: Машиностроение, 1970.',
    'Yusupbekov N.R., Nurmuxamedov X.S., Ismatullayev P.R., Zokirov S.G., Mannonov U.V. Kimyo va oziq-ovqat sanoatlarining asosiy jarayon va qurilmalarini hisoblash va loyihalash. – T.: Jahon, 2000. – 231 b.',
    'Амелин А.Г. Технология серной кислоты. – 2-е изд. – М.: Химия, 1983. – 360 с.',
    'Васильев Б.Т., Отвагина М.И. Технология серной кислоты. – М.: Химия, 1985. – 384 с.',
    'Справочник сернокислотчика / Под ред. К.М. Малина. – 2-е изд. – М.: Химия, 1971. – 744 с.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Tabiiy oltingugurtdan sulfat kislota ishlab chiqarishning o‘choq bo‘limining absorber hisobi bilan loyihasi.', unum: 'Unumdorligi – 7 t/sutka (100 % H₂SO₄ hisobida)' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
