// 1-loyiha: Tabiiy gaz konversiyasi tsexining (uglerod oksidi) konvertori hisobi bilan loyihasi. 150 m3/soat
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc1');
const t = require('./thermo');
const { Vm } = t;

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];

const NAMES = { CH4: 'CH₄', C2H6: 'C₂H₆', C3H8: 'C₃H₈', C4H10: 'C₄H₁₀', H2O: 'H₂O', CO: 'CO', CO2: 'CO₂', H2: 'H₂', N2: 'N₂', O2: 'O₂', Ar: 'Ar' };
const sumF = (o, skip = []) => t.sum(o, skip);
// tarkib jadvali qatorlari
function compRows(flow, withDry = true) {
  const n = sumF(flow), nd = sumF(flow, ['H2O']);
  const rows = [];
  let m = 0;
  for (const s in flow) {
    if (flow[s] < 1e-9) continue;
    const mi = flow[s] * t.CP[s].M; m += mi;
    rows.push([NAMES[s], f(flow[s], 3), f(flow[s] * Vm, 2), f(mi, 2), f(flow[s] / n * 100, 2), withDry ? (s === 'H2O' ? '–' : f(flow[s] / nd * 100, 2)) : '']);
  }
  rows.push(B(['Jami', f(n, 3), f(n * Vm, 2), f(m, 2), '100,00', withDry ? '100,00' : '']));
  return rows;
}
const compHead = ['Komponent', 'n_{i}, kmol/soat', 'V_{i}, m³/soat', 'm_{i}, kg/soat', 'Nam gazda, %', 'Quruq gazda, %'];
const W6 = [1.3, 1.2, 1.2, 1.2, 1.1, 1.1];
const kg = fl => t.mass(fl);
const ks = x => f(x / 3600, 4); // kg/soat -> kg/s

const HT = c.HT, LT = c.LT, HTr = c.HTr, LTr = c.LTr;

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };

  // ============ 1. KIRISH
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Tabiiy gaz zamonaviy azot sanoatining asosiy xomashyosi hisoblanadi. Jahonda ishlab chiqarilayotgan ammiakning 75–80 % i tabiiy gaz tarkibidagi metanni bug‘ va havo bilan konversiyalash orqali olinadigan azot-vodorodli aralashmadan sintez qilinadi. Konversiya jarayonida hosil bo‘ladigan gaz tarkibida vodorod va azotdan tashqari 10–14 % gacha uglerod (II) oksidi (CO) bo‘ladi. Uglerod oksidi ammiak sintezi katalizatori uchun kuchli zahar bo‘lgani sababli u albatta yo‘qotilishi kerak. Buning eng tejamkor usuli – CO ni suv bug‘i bilan katalitik konversiyalashdir: bunda zaharli komponent qo‘shimcha vodorodga aylanadi, hosil bo‘lgan CO₂ esa keyingi bosqichlarda oson yutiladi va karbamid ishlab chiqarishda xomashyo sifatida ishlatiladi.'));
  add(P('O‘zbekiston Respublikasida “Navoiyazot”, “Farg‘onaazot”, “Maxam-Chirchiq” aksiyadorlik jamiyatlarida ammiak ishlab chiqarish tabiiy gazni ikki bosqichli (quvurli pechda bug‘ bilan va shaxtali konvertorda havo bilan) konversiyalash hamda uglerod oksidini ikki bosqichli (o‘rta haroratli va past haroratli) konversiyalash sxemasi bo‘yicha amalga oshiriladi. Respublikamizda azotli o‘g‘itlar ishlab chiqarishni kengaytirish, mavjud agregatlarni modernizatsiya qilish va energiya sarfini kamaytirish bo‘yicha qabul qilingan dasturlar ushbu jarayonlarni chuqur o‘rganishni va ularni hisoblash usullarini o‘zlashtirishni talab qiladi.'));
  add(P('Uglerod oksidi konvertori – sintez-gaz ishlab chiqarish tsexining asosiy apparatlaridan biri. Uning to‘g‘ri hisoblanishi CO ning qoldiq miqdorini, vodorod chiqishini, katalizatorning xizmat muddatini hamda keyingi tozalash bosqichlari (monoetanolamin bilan CO₂ ni yutish, metanlash) yuklamasini belgilaydi. Konvertorda CO ning 1 % ga ortiq qolishi metanlash bosqichida qo‘shimcha vodorod sarfiga va ammiak sintezida inert metan to‘planishiga olib keladi.'));
  add(P(`Ushbu kurs loyihasining maqsadi – tabiiy gaz bo‘yicha unumdorligi ${c.V_ng} m³/soat (normal sharoitda) bo‘lgan tabiiy gaz konversiyasi tsexini loyihalash va uning asosiy apparati – uglerod oksidi konvertorini hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['metan va uglerod oksidi konversiyasining termodinamik va kinetik qonuniyatlarini tahlil qilish;',
    'xomashyo, katalizatorlar va mahsulotlarning fizik-kimyoviy xususiyatlarini o‘rganish;',
    'mavjud texnologik tizimlarni solishtirib, eng maqbulini asoslab tanlash;',
    'birlamchi va ikkilamchi metan konversiyasi hamda CO konversiyasining moddiy va issiqlik balanslarini SI xalqaro birliklar tizimida hisoblash;',
    'o‘rta haroratli CO konvertorining katalizator hajmi, o‘lchamlari, gidravlik qarshiligi, devor qalinligi va issiqlik izolyatsiyasini hisoblash;',
    'asosiy texnologik jihozlar sonini aniqlash va ularning ro‘yxatini tuzish;',
    'ishlab chiqarishning tahliliy nazorati tizimini ishlab chiqish.']));
  add(P('Loyihadagi barcha hisoblar SI xalqaro birliklar tizimida bajarilgan: massa – kg, modda miqdori – mol (kmol), harorat – K, bosim – Pa (MPa), energiya – J (kJ), quvvat – W (kW), hajm – m³, vaqt – s. Qulaylik uchun oqimlar soatlik miqdorda ham ko‘rsatilgan va ular SI birliklariga (kg/s, kW) o‘tkazilgan. Gaz hajmlari normal sharoitga (T₀ = 273,15 K, P₀ = 101 325 Pa) keltirilgan; ideal gazning molyar hajmi V_{m} = 22,414 m³/kmol. Yillik ish vaqti 8000 soat deb qabul qilingan.'));

  // ============ 2. NAZARIY ASOSLAR
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. Metan konversiyasining asosiy reaksiyalari'));
  add(P('Ammiak ishlab chiqarishda tabiiy gaz ikki bosqichda konversiyalanadi. Birinchi bosqichda (quvurli pechda) metan nikel katalizatorida suv bug‘i bilan reaksiyaga kirishadi:'));
  add(F('CH₄ + H₂O ⇄ CO + 3H₂;   ΔH°_{298} = +206,1 kJ/mol', '2.1'));
  add(F('CO + H₂O ⇄ CO₂ + H₂;   ΔH°_{298} = –41,2 kJ/mol', '2.2'));
  add(F('C_{n}H_{2n+2} + nH₂O → nCO + (2n+1)H₂', '2.3'));
  add(P('Ikkinchi bosqichda (shaxtali konvertorda) qoldiq metan havo kislorodi ishtirokida konversiyalanadi. Havo bilan birga sintez uchun zarur azot ham kiritiladi. Kislorod asosan vodorod bilan reaksiyaga kirishadi va ajralgan issiqlik metanning (2.1) reaksiya bo‘yicha konversiyasiga sarflanadi:'));
  add(F('2H₂ + O₂ → 2H₂O;   ΔH°_{298} = –483,6 kJ/mol', '2.4'));
  add(F('CH₄ + 0,5O₂ → CO + 2H₂;   ΔH°_{298} = –35,7 kJ/mol', '2.5'));
  add(H2('2.2. Uglerod oksidi konversiyasining termodinamikasi'));
  add(P('Uglerod oksidining suv bug‘i bilan konversiyasi (2.2) – qaytar, ekzotermik va gaz hajmi o‘zgarmasdan boradigan reaksiya. Shuning uchun uning muvozanati bosimga deyarli bog‘liq emas, harorat pasayishi va suv bug‘i miqdorining ortishi esa muvozanatni o‘ngga – CO₂ va H₂ hosil bo‘lishi tomoniga suradi. Muvozanat konstantasi partsial bosimlar orqali quyidagicha ifodalanadi:'));
  add(F('K_{p} = (p_{CO₂}·p_{H₂}) / (p_{CO}·p_{H₂O})', '2.6'));
  add(P('K_{p} ning haroratga bog‘liqligi uchun quyidagi tenglamadan foydalaniladi [2, 12]:'));
  add(F('K_{p} = exp(4577,8/T – 4,33)', '2.7'));
  add(P('(2.7) tenglama bo‘yicha hisoblangan qiymatlar 2.1-jadvalda keltirilgan. Jadvaldan ko‘rinib turibdiki, harorat 473 K dan 773 K gacha ortganda muvozanat konstantasi qariyb 50 marta kamayadi. Shu sababli CO ni chuqur konversiyalash uchun jarayonni imkon qadar past haroratda olib borish kerak, ammo past haroratda reaksiya tezligi kichik bo‘ladi. Bu qarama-qarshilik jarayonni ikki bosqichda – avval faol, issiqbardosh temir-xromli katalizatorda 593–723 K da, so‘ngra past haroratda faol mis-ruxli katalizatorda 473–533 K da olib borish orqali hal qilinadi.'));
  {
    const Ts = [473, 498, 523, 573, 623, 673, 723, 773];
    add(T('2.1', 'CO konversiyasi muvozanat konstantasining haroratga bog‘liqligi', ['T, K', ...Ts.map(String)], [['K_{p}', ...Ts.map(x => f(t.Kshift(x), x < 600 ? 1 : 2))]], [1.2, 1, 1, 1, 1, 1, 1, 1, 1]));
  }
  add(P('Muvozanat holatdagi CO konversiya darajasi x_{m} boshlang‘ich gaz tarkibi (a – CO, b – H₂O, c – CO₂, d – H₂ mol ulushlari) orqali quyidagi tenglamadan topiladi:'));
  add(F('K_{p} = (c + a·x_{m})(d + a·x_{m}) / [a(1 – x_{m})(b – a·x_{m})]', '2.8'));
  add(P('Bug‘ : gaz nisbatining oshirilishi muvozanat konversiya darajasini oshiradi, lekin bug‘ sarfini va issiqlik yo‘qotishlarini ko‘paytiradi. Amaliyotda o‘rta haroratli konversiya bosqichiga kiradigan gazda bug‘ : quruq gaz nisbati 0,5–0,7 ni tashkil etadi va bu miqdor bug‘ ikkilamchi konvertordan o‘tib keladigan ortiqcha bug‘ hisobiga ta’minlanadi.'));
  add(H2('2.3. Katalizatorlar va jarayon kinetikasi'));
  add(P('O‘rta haroratli konversiya uchun temir-xromli katalizatorlar (СТК-1, ИК-4-9, KMC-24 va boshqalar) ishlatiladi. Ularning faol komponenti – magnetit Fe₃O₄, u katalizatorni ishchi sharoitda vodorod va CO bilan qaytarish natijasida Fe₂O₃ dan hosil bo‘ladi. 7–10 % Cr₂O₃ qo‘shimchasi faol fazani rekristallanishdan saqlab, sirt yuzasini barqarorlashtiradi. Katalizator 593–763 K da ishlaydi, 773 K dan yuqorida tez dezaktivlanadi. U oltingugurt birikmalariga nisbatan ancha chidamli (H₂S miqdori 2–3 mg/m³ gacha yo‘l qo‘yiladi).'));
  add(P('Past haroratli konversiyada mis-rux-alyuminiyli katalizatorlar (НТК-4, НТК-8, К-СО) qo‘llaniladi. Ular 453–533 K da yuqori faollikka ega, ammo oltingugurt, xlor birikmalariga va qizib ketishga juda sezgir: 553 K dan yuqorida misning rekristallanishi tufayli faolligini yo‘qotadi. Shuning uchun past haroratli bosqichga kiradigan gaz oltingugurtdan chuqur tozalangan (≤ 0,5 mg/m³) bo‘lishi va harorati gaz shudring nuqtasidan kamida 15–20 K yuqori bo‘lishi kerak.'));
  add(P('Temir-xromli katalizatorda CO konversiyasi tezligi uchun M. I. Temkin quyidagi kinetik tenglamani taklif qilgan:'));
  add(F('r = k·p_{CO}·(1 – K_{p}^{-1}·p_{CO₂}·p_{H₂}/(p_{CO}·p_{H₂O}))·(p_{H₂O}/p_{H₂})^{0,5}', '2.9'));
  add(P('Tenglamadan ko‘rinadiki, reaksiya tezligi CO ning partsial bosimiga to‘g‘ri proporsional bo‘lib, muvozanatga yaqinlashgan sari keskin kamayadi. Bosimning 0,1 MPa dan 3 MPa gacha oshirilishi katalizatorning hajmiy unumdorligini 2–3 marta oshiradi, chunki partsial bosimlar ortadi va diffuziya qarshiligi kamayadi. Reaksiyaning aktivlanish energiyasi temir-xromli katalizatorda 110–120 kJ/mol, mis-ruxli katalizatorda 50–70 kJ/mol ni tashkil etadi.'));
  add(H2('2.4. Qo‘shimcha reaksiyalar va uglerod ajralishi'));
  add(P('Konversiya jarayonida asosiy reaksiyalar bilan bir qatorda quyidagi nomaqbul reaksiyalar ham borishi mumkin:'));
  add(F('2CO ⇄ C + CO₂;   ΔH°_{298} = –172,5 kJ/mol', '2.10'));
  add(F('CH₄ ⇄ C + 2H₂;   ΔH°_{298} = +74,9 kJ/mol', '2.11'));
  add(F('CO + 3H₂ ⇄ CH₄ + H₂O;   ΔH°_{298} = –206,1 kJ/mol', '2.12'));
  add(P('(2.10) va (2.11) reaksiyalar bo‘yicha ajralgan uglerod (qurum) katalizator g‘ovaklarini to‘sib qo‘yadi, granulalarni yemiradi va qatlam gidravlik qarshiligini oshiradi. Uglerod ajralishining oldini olish uchun birlamchi konversiyada bug‘ : uglerod nisbati 3,0 dan kam bo‘lmasligi kerak; loyihada S/C = 3,7 qabul qilingan. O‘rta haroratli CO konversiyasida bug‘ : gaz nisbati 0,4 dan past bo‘lganda temir-xromli katalizatorda Fisher–Tropsh reaksiyalari bo‘yicha uglevodorodlar va temir karbidlari hosil bo‘ladi, shuning uchun bu nisbat 0,5–0,7 oralig‘ida saqlanadi. Past haroratli bosqichda mis-ruxli katalizatorda oz miqdorda metanol hosil bo‘ladi (0,05–0,2 g/m³), u kondensat bilan chiqariladi.'));
  add(P('(2.12) metanlash reaksiyasi CO konversiyasi sharoitida termodinamik jihatdan mumkin, ammo temir-xromli va mis-ruxli katalizatorlar unga nisbatan selektiv emas, shu sababli gazdagi metan miqdori konvertorlarda deyarli o‘zgarmaydi. Bu reaksiya keyinchalik nikel katalizatorida CO va CO₂ ning qoldiq miqdorini yo‘qotish uchun maxsus qo‘llaniladi.'));
  add(H2('2.5. Jarayonning maqbul texnologik rejimi'));
  add(P('Ekzotermik qaytar reaksiya uchun har bir konversiya darajasiga mos keladigan maqbul harorat mavjud bo‘lib, unda reaksiya tezligi maksimal bo‘ladi. Konversiya ortishi bilan maqbul harorat pasayadi. Adiabatik katalizator qatlamida esa reaksiya issiqligi hisobiga harorat ko‘tariladi (CO ning har 1 % konversiyasi gazni taxminan 8–10 K ga qizdiradi). Shu sababli ikki bosqichli sxema va bosqichlar orasida gazni sovitish haqiqiy harorat chizig‘ini maqbul chiziqqa yaqinlashtiradi.'));
  add(P('Mazkur loyihada quyidagi rejim qabul qilingan: o‘rta haroratli bosqichga kirish harorati 643 K, bosim 3,15 MPa, chiqishdagi CO miqdori 3,2 % (quruq gazda); past haroratli bosqichga kirish harorati 478 K, bosim 3,0 MPa, chiqishdagi CO miqdori 0,35 % (quruq gazda).'));

  // ============ 3. XOSSALAR
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Tabiiy gaz'));
  add(P('Xomashyo sifatida O‘zbekiston magistral gaz quvuridan keladigan tabiiy gaz ishlatiladi. Uning tarkibi asosan metandan iborat bo‘lib, oz miqdorda og‘ir uglevodorodlar, azot va CO₂ saqlaydi. Loyihada qabul qilingan tabiiy gaz tarkibi 3.1-jadvalda keltirilgan.'));
  add(T('3.1', 'Tabiiy gazning tarkibi (hajmiy %)', ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀', 'CO₂', 'N₂', 'Jami'], [['96,0', '2,0', '0,5', '0,2', '0,3', '1,0', '100,0']], [1, 1, 1, 1, 1, 1, 1]));
  {
    const M = 0.96 * 16.043 + 0.02 * 30.069 + 0.005 * 44.096 + 0.002 * 58.123 + 0.003 * 44.01 + 0.01 * 28.013;
    add(P(`Tabiiy gazning o‘rtacha molyar massasi M = Σy_{i}·M_{i} = ${f(M, 2)} kg/kmol, normal sharoitdagi zichligi ρ₀ = M/V_{m} = ${f(M / Vm, 3)} kg/m³, eng past yonish issiqligi Q_{q} = ${f(c.LHV, 2)} MJ/m³. Tabiiy gaz rangsiz, hidsiz (xavfsizlik uchun odorant qo‘shiladi), havo bilan 5–15 % (hajm) konsentratsiyada portlovchi aralashma hosil qiladi; o‘z-o‘zidan alangalanish harorati 810 K. Tabiiy gaz tarkibida 5–20 mg/m³ gacha oltingugurt birikmalari (H₂S, merkaptanlar, COS) bo‘ladi, ular nikel va mis katalizatorlari uchun zahar hisoblanadi va konversiyadan oldin 0,5 mg/m³ dan kam miqdorgacha tozalanadi.`));
  }
  add(H2('3.2. Konversiya jarayonida ishtirok etuvchi gazlarning xossalari'));
  add(P('Jarayonda ishtirok etuvchi asosiy moddalarning fizik-kimyoviy xossalari 3.2-jadvalda keltirilgan [2, 6, 13].'));
  add(T('3.2', 'Gazlarning asosiy fizik-kimyoviy xossalari', ['Modda', 'M, kg/kmol', 'ρ₀, kg/m³', 'T_{qay}, K', 'T_{kr}, K', 'P_{kr}, MPa', 'μ·10⁶ (273 K), Pa·s'], [
    ['Metan CH₄', '16,04', '0,717', '111,7', '190,6', '4,60', '10,3'],
    ['Vodorod H₂', '2,016', '0,090', '20,4', '33,2', '1,30', '8,4'],
    ['Uglerod oksidi CO', '28,01', '1,250', '81,6', '132,9', '3,50', '16,6'],
    ['Uglerod dioksidi CO₂', '44,01', '1,977', '194,7*', '304,2', '7,38', '13,8'],
    ['Azot N₂', '28,01', '1,251', '77,4', '126,2', '3,39', '16,6'],
    ['Kislorod O₂', '32,00', '1,429', '90,2', '154,6', '5,04', '19,2'],
    ['Argon Ar', '39,95', '1,784', '87,3', '150,9', '4,90', '21,0'],
    ['Suv bug‘i H₂O', '18,02', '0,804', '373,2', '647,1', '22,06', '8,7'],
  ], [2.2, 1, 1, 1, 1, 1, 1.3]));
  add(P('* – CO₂ uchun sublimatsiya harorati keltirilgan.', { noIndent: true, size: 24 }));
  add(P('Uglerod (II) oksidi – rangsiz, hidsiz, juda zaharli gaz (ishchi zonada yo‘l qo‘yiladigan konsentratsiya 20 mg/m³). Gemoglobin bilan barqaror karboksigemoglobin hosil qilib, qonning kislorod tashish qobiliyatini yo‘qotadi. Havo bilan 12,5–74 % (hajm) oralig‘ida portlovchi aralashma hosil qiladi. Vodorod – eng yengil gaz, havo bilan 4–75 % oralig‘ida portlaydi, po‘latlarda vodorodli mo‘rtlanishni keltirib chiqaradi; shuning uchun 473 K dan yuqori haroratda ishlaydigan apparatlar vodorodga chidamli legirlangan po‘latlardan tayyorlanadi.'));
  add(H2('3.3. Katalizatorlar'));
  add(T('3.3', 'CO konversiyasi katalizatorlarining tavsifi', ['Ko‘rsatkich', 'O‘rta haroratli (Fe–Cr)', 'Past haroratli (Cu–Zn–Al)'], [
    ['Tarkibi, %', 'Fe₂O₃ – 85–90; Cr₂O₃ – 7–10; CuO – 1–2', 'CuO – 50–55; ZnO – 25–30; Al₂O₃ – 15–20'],
    ['Granula o‘lchami, mm', '9×9 (tabletka)', '5×5 (tabletka)'],
    ['To‘kma zichligi, kg/m³', '1300', '1200'],
    ['Ishchi harorat, K', '593–763', '453–533'],
    ['Hajmiy tezlik (quruq gaz), soat⁻¹', '2000–4000', '1500–3000'],
    ['Xizmat muddati, yil', '3–5', '2–4'],
    ['Zaharlari', 'H₂S (> 3 mg/m³), suv tomchilari', 'S, Cl birikmalari, kondensat'],
  ], [2, 2, 2]));
  add(H2('3.4. Mahsulot – konvertlangan gaz'));
  add(P(`Tsexning mahsuloti – CO konversiyasidan chiqqan azot-vodorodli gaz. Uning quruq holatdagi tarkibi: H₂ – ${f(LT.out.H2 / LT.dryOut * 100, 2)} %, N₂ – ${f(LT.out.N2 / LT.dryOut * 100, 2)} %, CO₂ – ${f(LT.out.CO2 / LT.dryOut * 100, 2)} %, CO – ${f(LT.out.CO / LT.dryOut * 100, 2)} %, CH₄ – ${f(LT.out.CH4 / LT.dryOut * 100, 2)} %, Ar – ${f(LT.out.Ar / LT.dryOut * 100, 2)} %. Gazda H₂ : N₂ nisbati ${f(LT.out.H2 / LT.out.N2, 2)} ga teng bo‘lib, bu metanlash bosqichidagi vodorod sarfini hisobga olganda ammiak sintezi uchun stexiometrik nisbatga (3 : 1) mos keladi. Konvertlangan gaz monoetanolamin eritmasi bilan CO₂ dan tozalashga, so‘ngra metanlashga yuboriladi.`));

  add(H2('3.5. Yordamchi materiallar va texnik talablar'));
  add(P('Texnologik bug‘ 4,0 MPa bosimli, 653–673 K haroratli qizdirilgan bug‘ bo‘lib, tarkibida tuzlar miqdori 0,1 mg/kg dan, kremniy kislotasi 0,02 mg/kg dan oshmasligi kerak; aks holda tuzlar katalizator yuzasida cho‘kib, uning faolligini pasaytiradi. Havo atmosferadan olinib, chang va namlikdan filtrlarda tozalanadi. Qozonlarni ta’minlash uchun kimyoviy tozalangan va deaeratsiyalangan suv ishlatiladi (qattiqlik ≤ 3 mkg-ekv/kg, kislorod ≤ 20 mkg/kg).'));
  add(P('MEA bo‘limiga yuboriladigan konvertlangan gaz quyidagi talablarga javob berishi kerak: CO miqdori 0,5 % dan ko‘p emas; harorati 313 K dan yuqori emas; tomchi suyuqlik bo‘lmasligi; bosimi 2,8–2,9 MPa; H₂ : N₂ nisbati 3,0–3,1. Gazdagi qoldiq CO miqdori 0,1 % ga oshganda metanlashda ammiak sintezi uchun yo‘qotiladigan vodorod miqdori taxminan 0,3 % ga ko‘payadi.'));
  // ============ 4. SOLISHTIRISH
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. Sintez-gaz olish usullari'));
  add(P('Tabiiy gazdan ammiak sintezi uchun azot-vodorodli aralashma olishning quyidagi asosiy usullari mavjud: atmosfera bosimida metanni bug‘ bilan konversiyalash; bosim ostida bug‘-kislorodli (bug‘-havoli) shaxtali konversiya; yuqori haroratli kislorodli (nokatalitik) parsial oksidlanish; ikki bosqichli bug‘ va bug‘-havoli konversiya. Ularning qiyosiy tavsifi 4.1-jadvalda keltirilgan.'));
  add(T('4.1', 'Metan konversiyasi usullarini solishtirish', ['Ko‘rsatkich', 'Bug‘li (0,1 MPa)', 'Bug‘-kislorodli shaxtali', 'Parsial oksidlanish', 'Ikki bosqichli (bug‘ + havo)'], [
    ['Bosim, MPa', '0,1–0,2', '1,5–2,0', '3–8', '3–4'],
    ['Harorat, K', '1073–1123', '1173–1273', '1573–1673', '1073 / 1273'],
    ['Katalizator', 'Ni', 'Ni', 'yo‘q', 'Ni'],
    ['Kislorod talab qiladimi', 'yo‘q', 'ha (havo ajratish)', 'ha', 'yo‘q'],
    ['Qoldiq CH₄, %', '0,5–1,0', '0,5', '0,3', '0,3–0,5'],
    ['Gaz siqish energiyasi', 'katta', 'o‘rtacha', 'kam', 'kam'],
    ['Energiya sarfi, GJ/t NH₃', '42–45', '38–40', '38–42', '28–33'],
    ['Qo‘llanilishi', 'eskirgan', 'cheklangan', 'og‘ir xomashyo', 'zamonaviy agregatlar'],
  ], [2, 1.3, 1.4, 1.3, 1.6]));
  add(P('Jadvaldan ko‘rinib turibdiki, ikki bosqichli bosim ostidagi bug‘ va bug‘-havoli konversiya eng kam energiya sarfiga ega. Bunda kislorod ajratish qurilmasi talab qilinmaydi, chunki azot havo bilan birga bevosita jarayonga kiritiladi, gaz esa yuqori bosimda olinadi va uni siqish uchun energiya sarfi keskin kamayadi. Shuning uchun loyihada aynan shu usul qabul qilinadi.'));
  add(H2('4.2. Uglerod oksidi konversiyasi sxemalari'));
  add(P('CO konversiyasining quyidagi sxemalari mavjud: 1) bir bosqichli o‘rta haroratli konversiya (qoldiq CO 2–4 %), keyin gazni mis-ammiakli eritma bilan tozalash; 2) bosqichlar orasida suv purkash bilan sovitiladigan ikki-uch qatlamli o‘rta haroratli konversiya (qoldiq CO 1,5–2 %); 3) o‘rta haroratli va past haroratli bosqichlardan iborat ikki bosqichli konversiya (qoldiq CO 0,2–0,5 %); 4) izotermik (quvurli, ichki sovitiladigan) konvertorda konversiya.'));
  add(T('4.2', 'CO konversiyasi sxemalarini solishtirish', ['Ko‘rsatkich', '1-sxema', '2-sxema', '3-sxema', '4-sxema'], [
    ['Qoldiq CO, %', '2–4', '1,5–2', '0,2–0,5', '0,3–0,8'],
    ['Bug‘ : gaz nisbati', '1,0–1,2', '0,8–1,0', '0,5–0,6', '0,4–0,5'],
    ['Keyingi tozalash', 'mis-ammiakli', 'mis-ammiakli', 'metanlash', 'metanlash'],
    ['Issiqlik utilizatsiyasi', 'past', 'o‘rtacha', 'yuqori', 'yuqori'],
    ['Apparat tuzilishi', 'oddiy', 'oddiy', 'oddiy', 'murakkab'],
    ['Vodorod yo‘qotilishi', 'katta', 'o‘rtacha', 'kam', 'kam'],
  ], [2, 1, 1, 1, 1]));
  add(P('Uchinchi sxema eng kam qoldiq CO miqdorini ta’minlaydi, bu esa qimmat va murakkab mis-ammiakli tozalash o‘rniga oddiy metanlashni qo‘llash imkonini beradi. Bundan tashqari, past bug‘ : gaz nisbatida ishlash bug‘ sarfini 25–30 % ga kamaytiradi, bosqichlar orasidagi issiqlik esa yuqori bosimli bug‘ olish va ta’minot suvini isitish uchun foydalaniladi. Adiabatik shaxtali konvertorlar tuzilishi oddiy va ishonchli. Shu sababli loyihada o‘rta haroratli (Fe–Cr katalizator) va past haroratli (Cu–Zn–Al katalizator) adiabatik konvertorlardan iborat ikki bosqichli sxema tanlandi.'));
  add(P('Konvertor turi bo‘yicha bir qatlamli va ko‘p qatlamli (qatlamlar orasida sovitiladigan) apparatlar mavjud. O‘rta haroratli bosqichda CO miqdori 12–13 % dan 3–3,5 % gacha kamayganda gazning adiabatik qizishi 60–70 K ni tashkil etadi va chiqish harorati katalizator uchun ruxsat etilgan 763 K dan past bo‘ladi. Shuning uchun bir qatlamli vertikal silindrik apparat tanlandi.'));

  // ============ 5. BAYON
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Tabiiy gaz konversiyasi tsexining texnologik sxemasi 5.1-rasmda keltirilgan. Sxema quyidagi asosiy bosqichlardan iborat: tabiiy gazni siqish va oltingugurt birikmalaridan tozalash; birlamchi bug‘li konversiya; ikkilamchi bug‘-havoli konversiya; konvertlangan gaz issiqligini utilizatsiya qilish; CO ni ikki bosqichli konversiyalash; gazni sovitish va kondensatni ajratish.'));
  add(IMG(path.join(FIG, 'sxema1.png'), 620, 350, '5.1-rasm. Tabiiy gaz konversiyasi tsexining texnologik sxemasi',
    '1 – tabiiy gaz kompressori; 2 – pechning konveksion kamerasi (isitgichlar); 3a, 3b – gidrirlash reaktori va oltingugurtdan tozalash adsorberi; 4 – bug‘-gaz aralashtirgich; 5 – quvurli pech (birlamchi metan konvertori); 6 – havo kompressori; 7 – shaxtali (ikkilamchi) metan konvertori; 8 – qozon-utilizator; B – bug‘ barabani; 9 – o‘rta haroratli CO konvertori; 10 – issiqlik almashtirgich (ta’minot suvi isitgichi); 11 – past haroratli CO konvertori; 12 – issiqlik almashtirgich; 13 – suvli sovitgich; 14 – separator.'));
  add(P(`Magistral quvurdan 0,6–1,2 MPa bosim bilan keladigan tabiiy gaz (${c.V_ng} m³/soat) kompressor 1 da 4,0 MPa gacha siqiladi va pech konveksion kamerasi 2 dagi zmeyevikda 643–673 K gacha isitiladi. Isitilgan gazga 0,5–1 % hajmda vodorodli gaz qo‘shilib, gidrirlash reaktori 3a ga yuboriladi; bu yerda alyumokobaltmolibden katalizatorida organik oltingugurt birikmalari H₂S ga aylanadi. H₂S rux oksidi bilan to‘ldirilgan adsorber 3b da yutiladi (ZnO + H₂S → ZnS + H₂O). Tozalangan gazda oltingugurt miqdori 0,5 mg/m³ dan oshmaydi.`));
  add(P(`Tozalangan tabiiy gaz aralashtirgich 4 da S : C = ${f(c.SC, 1)} mol/mol nisbatda texnologik bug‘ bilan aralashtiriladi. Bug‘-gaz aralashmasi konveksion kamerada ${c.T_mix} K gacha qizdirilib, quvurli pech 5 ning reaksion quvurlariga taqsimlanadi. Nikel katalizatori bilan to‘ldirilgan quvurlarda metan ${c.T1} K va ${f(c.P1 / 1e6, 1)} MPa da konversiyalanadi; chiqishdagi gazda qoldiq metan ${f(c.CH4dry1, 1)} % (quruq gazda). Reaksiya uchun zarur issiqlik radiatsion kameradagi gorelkalarda tabiiy gazni yoqish hisobiga beriladi.`));
  add(P(`Birlamchi konvertordan chiqqan gaz shaxtali konvertor 7 ga yuboriladi. Bu yerga kompressor 6 da siqilgan va konveksion kamerada ${f(c.T_air, 0)} K gacha isitilgan havo beriladi. Havo miqdori shunday tanlanadiki, gazdagi (H₂ + CO) : N₂ nisbati ${f(c.ratio, 2)} ga teng bo‘lsin. Konvertorning yuqori qismida kislorod vodorod bilan yonadi, harorat 1473–1523 K gacha ko‘tariladi, so‘ngra nikel katalizatori qatlamida qoldiq metan konversiyalanib, gaz ${c.T2} K gacha soviydi. Chiqishdagi gazda CH₄ miqdori ${f(c.CH4dry2, 2)} % (quruq gazda) dan oshmaydi.`));
  add(P(`${c.T2} K haroratli konvertlangan gaz qozon-utilizator 8 da ${c.T_HTin} K gacha sovitiladi; bunda 4,0 MPa bosimli to‘yingan bug‘ hosil qilinadi, u bug‘ barabani B orqali umumzavod tarmog‘iga yoki texnologik ehtiyojga beriladi. Sovitilgan gaz o‘rta haroratli CO konvertori 9 ga kiradi. Temir-xromli katalizator qatlamida CO ning asosiy qismi konversiyalanadi, gaz ${f(HT.Tout, 0)} K gacha qiziydi, CO miqdori ${f(HT.out.CO / HT.dryOut * 100, 1)} % (quruq gazda) gacha kamayadi.`));
  add(P(`Konvertor 9 dan chiqqan gaz issiqlik almashtirgich 10 da ta’minot suvini isitib, ${c.T_LTin} K gacha sovitiladi va past haroratli CO konvertori 11 ga yuboriladi. Mis-rux-alyuminiyli katalizatorda CO miqdori ${f(LT.out.CO / LT.dryOut * 100, 2)} % gacha kamayadi, gaz ${f(LT.Tout, 0)} K gacha qiziydi. Konvertlangan gaz issiqlik almashtirgich 12 da (MEA eritmasini regeneratsiyalash uchun issiqlik beriladi) va suvli sovitgich 13 da 313 K gacha sovitiladi, separator 14 da kondensat ajratiladi. Tayyor konvertlangan gaz monoetanolamin eritmasi bilan CO₂ dan tozalash bo‘limiga yuboriladi. Kondensat tozalangandan so‘ng qozonlarni ta’minlash uchun qaytariladi.`));
  add(P('Agregatni ishga tushirishda konvertorlar azot bilan puflanadi va isitiladi. O‘rta haroratli katalizator (Fe₂O₃ shaklida yuklangan) 573–623 K da konvertlangan gaz va bug‘ aralashmasi bilan Fe₃O₄ gacha qaytariladi; bunda bug‘ : gaz nisbati 1 dan kam bo‘lmasligi kerak, aks holda temir metall holatgacha qaytarilib, metanlash va karbidlanish reaksiyalari boshlanadi. Past haroratli katalizator (CuO shaklida) azotga 0,5–2 % vodorod qo‘shilgan gaz bilan 443–503 K da ehtiyotkorlik bilan qaytariladi, chunki CuO ning qaytarilishi kuchli ekzotermik jarayondir. Katalizator qatlamlari qaytarilgandan so‘ng konvertorlar asta-sekin ish rejimiga o‘tkaziladi.'));
  add(P('Tsexda haroratlar, bosimlar, sarflar va gaz tarkibi avtomatik nazorat qilinadi; konvertorlarning katalizator qatlamlari bo‘ylab ko‘p nuqtali termoparalar o‘rnatilgan. Havoning bug‘-gaz aralashmasiga nisbati, S : C nisbati avtomatik rostlanadi; tabiiy gaz yoki bug‘ berilishi to‘xtaganda avariya blokirovkalari agregatni xavfsiz holatga o‘tkazadi.'));

  // ============ 6. MODDIY BALANS
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`tabiiy gaz sarfi (n.sh.): V_{tg} = ${c.V_ng} m³/soat = ${f(c.V_ng / 3600, 5)} m³/s;`,
    'tabiiy gaz tarkibi 3.1-jadval bo‘yicha;',
    `bug‘ : uglerod nisbati S/C = ${f(c.SC, 1)} mol/mol;`,
    `birlamchi konvertor: T = ${c.T1} K, P = ${f(c.P1 / 1e6, 1)} MPa, chiqishda CH₄ = ${f(c.CH4dry1, 1)} % (quruq gazda);`,
    `ikkilamchi konvertor: T = ${c.T2} K, P = ${f(c.P2 / 1e6, 1)} MPa, chiqishda CH₄ = ${f(c.CH4dry2, 2)} % (quruq gazda), (H₂ + CO) : N₂ = ${f(c.ratio, 2)};`,
    'havo tarkibi: N₂ – 78,09 %; O₂ – 20,95 %; Ar – 0,96 %;',
    `o‘rta haroratli CO konvertori: T_{kir} = ${c.T_HTin} K, P = ${f(c.P_HT / 1e6, 2)} MPa, chiqishda CO = 3,2 % (quruq gazda);`,
    `past haroratli CO konvertori: T_{kir} = ${c.T_LTin} K, P = ${f(c.P_LT / 1e6, 1)} MPa, chiqishda CO = 0,35 % (quruq gazda);`,
    'og‘ir uglevodorodlar birlamchi konvertorda to‘liq konversiyalanadi; ikkilamchi konvertorda kislorod to‘liq sarflanadi.']));
  add(H2('6.2. Tabiiy gaz va texnologik bug‘ miqdori'));
  add(P('Tabiiy gazning molyar sarfi:'));
  add(F(`n_{tg} = V_{tg} / V_{m} = ${c.V_ng} / 22,414 = ${f(c.n_ng, 3)} kmol/soat = ${f(c.n_ng / 3.6, 4)} mol/s`, '6.1'));
  add(P('Har bir komponent miqdori n_{i} = y_{i}·n_{tg}: CH₄ – ' + f(c.n0.CH4, 4) + '; C₂H₆ – ' + f(c.n0.C2H6, 4) + '; C₃H₈ – ' + f(c.n0.C3H8, 4) + '; C₄H₁₀ – ' + f(c.n0.C4H10, 4) + '; CO₂ – ' + f(c.n0.CO2, 4) + '; N₂ – ' + f(c.n0.N2, 4) + ' kmol/soat. Tabiiy gaz massasi m_{tg} = ' + f(kg(c.n0), 2) + ' kg/soat = ' + ks(kg(c.n0)) + ' kg/s.'));
  add(P('Uglevodorodlar tarkibidagi uglerod atomlari miqdori:'));
  add(F(`n_{C} = n_{tg}·(0,960 + 2·0,020 + 3·0,005 + 4·0,002) = ${f(c.nC, 3)} kmol/soat`, '6.2'));
  add(F(`n_{H₂O} = (S/C)·n_{C} = ${f(c.SC, 1)}·${f(c.nC, 3)} = ${f(c.n_steam, 3)} kmol/soat (${f(c.n_steam * 18.015, 2)} kg/soat)`, '6.3'));
  add(H2('6.3. Birlamchi metan konvertori'));
  add(P(`Og‘ir uglevodorodlar (2.3) reaksiya bo‘yicha to‘liq konversiyalanadi; bunda ${f(c.hc.CO, 4)} kmol/soat CO, ${f(c.hc.H2, 4)} kmol/soat H₂ hosil bo‘ladi va ${f(c.hc.H2O, 4)} kmol/soat suv bug‘i sarflanadi. Metanning (2.1) reaksiya bo‘yicha konversiyalangan miqdorini X, (2.2) reaksiya bo‘yicha CO₂ ga aylangan CO miqdorini Y bilan belgilaymiz. U holda chiqishdagi gaz tarkibi (kmol/soat):`));
  add(F('n_{CH₄} = 6,4246 – X;  n_{CO} = 0,4216 + X – Y;  n_{CO₂} = 0,0201 + Y', '6.4'));
  add(F(`n_{H₂} = 1,0239 + 3X + Y;  n_{H₂O} = ${f(c.n_steam - c.hc.H2O, 4)} – X – Y`, '6.5'));
  add(P(`Noma’lumlar X va Y quyidagi ikki shartdan topiladi: 1) quruq gazdagi metan ulushi ${f(c.CH4dry1, 1)} % ga teng; 2) chiqishda (2.2) reaksiya muvozanatda, ya’ni ${c.T1} K da K_{p} = exp(4577,8/${c.T1} – 4,33) = ${f(c.Kp1_shift, 4)}. Tenglamalar sistemasini ketma-ket yaqinlashish usulida yechib, X = ${f(c.x1, 4)} kmol/soat, Y = ${f(c.y1, 4)} kmol/soat ni olamiz. Metanning konversiya darajasi α = X/n⁰_{CH₄} = ${f(c.x1, 4)}/${f(c.n0.CH4, 4)} = ${f(c.x1 / c.n0.CH4 * 100, 1)} %.`));
  add(P(`Tekshiruv: metan konversiyasi reaksiyasi uchun haqiqiy bosimlar nisbati K_{p,haq} = p_{CO}·p³_{H₂}/(p_{CH₄}·p_{H₂O}) = ${f(c.Kact1, 1)} (bosim atm da), ${c.T1} K dagi muvozanat konstantasi esa K_{p1} = exp(30,114 – 26830/T) = ${f(c.Keq1, 1)}. Demak gaz tarkibi ${f(c.Teq1, 0)} K dagi muvozanatga mos keladi, muvozanatga yaqinlashish harorati ΔT = ${f(c.T1 - c.Teq1, 0)} K – bu sanoat pechlari uchun odatiy qiymat.`));
  add(T('6.1', 'Birlamchi konvertordan chiqqan gaz tarkibi va miqdori', compHead, compRows(c.out1), W6));
  add(H2('6.4. Ikkilamchi (shaxtali) metan konvertori'));
  add(P(`Havo sarfini A (kmol/soat) bilan belgilaymiz. Havo bilan ${f(c.air.O2 / 100, 4)}·A kislorod kiradi, u (2.4) reaksiya bo‘yicha 2·n_{O₂} vodorodni yoqib, shuncha suv bug‘i hosil qiladi. So‘ngra qoldiq metan (2.1) bo‘yicha konversiyalanadi (X₂), CO (2.2) bo‘yicha muvozanatga keladi (Y₂). Uchta noma’lum (A, X₂, Y₂) uchta shartdan topiladi: quruq gazda CH₄ = ${f(c.CH4dry2, 2)} %; ${c.T2} K da K_{p} = ${f(t.Kshift(c.T2), 4)}; (H₂ + CO) : N₂ = ${f(c.ratio, 2)}. Iteratsion yechim natijasi:`));
  add(F(`A = ${f(c.A, 3)} kmol/soat (${f(c.A * Vm, 2)} m³/soat);  X₂ = ${f(c.x2, 4)};  Y₂ = ${f(c.y2, 4)} kmol/soat`, '6.6'));
  add(P(`Havo tarkibi: N₂ – ${f(c.airFlow.N2, 4)}, O₂ – ${f(c.airFlow.O2, 4)}, Ar – ${f(c.airFlow.Ar, 4)} kmol/soat; havo massasi ${f(kg(c.airFlow), 2)} kg/soat (${ks(kg(c.airFlow))} kg/s). Yonish natijasida ${f(2 * c.O2, 4)} kmol/soat vodorod sarflanadi. Tekshiruv: metan muvozanati bo‘yicha K_{p,haq} = ${f(c.Kact2, 0)}, K_{p1}(${c.T2} K) = ${f(c.Keq2, 0)}, muvozanatga yaqinlashish ΔT = ${f(c.T2 - c.Teq2, 0)} K. 1 m³ tabiiy gazga havo sarfi ${f(c.A * Vm / c.V_ng, 3)} m³.`));
  add(T('6.2', 'Ikkilamchi konvertordan chiqqan gaz tarkibi va miqdori', compHead, compRows(c.out2), W6));
  add(H2('6.5. O‘rta haroratli CO konvertori'));
  add(P(`Konvertorga kiradigan gaz 6.2-jadval bo‘yicha. Quruq gaz miqdori n_{q} = ${f(HT.dry, 3)} kmol/soat, CO miqdori ${f(c.out2.CO, 4)} kmol/soat (${f(c.out2.CO / HT.dry * 100, 2)} % quruq gazda), bug‘ : quruq gaz nisbati ${f(c.out2.H2O / HT.dry, 3)}. (2.2) reaksiya bo‘yicha Y₃ kmol/soat CO konversiyalanganda quruq gaz miqdori Y₃ ga ortadi (CO o‘rniga CO₂ va H₂ hosil bo‘ladi). Chiqishdagi CO ulushi c = 0,032 shartidan:`));
  add(F('(n_{CO} – Y₃) / (n_{q} + Y₃) = c  ⇒  Y₃ = (n_{CO} – c·n_{q}) / (1 + c)', '6.7'));
  add(F(`Y₃ = (${f(c.out2.CO, 4)} – 0,032·${f(HT.dry, 3)}) / 1,032 = ${f(HT.y, 4)} kmol/soat`, '6.8'));
  add(P(`CO ning konversiya darajasi x = ${f(HT.y, 4)}/${f(c.out2.CO, 4)} = ${f(HT.conv * 100, 1)} %. Chiqish harorati (7-bo‘lim) T = ${f(HT.Tout, 1)} K da muvozanat konstantasi K_{p} = ${f(HT.Keq, 3)}, haqiqiy qiymat esa K_{p,haq} = (n_{CO₂}·n_{H₂})/(n_{CO}·n_{H₂O}) = ${f(HT.Kact, 3)} < K_{p}. Demak, belgilangan konversiya darajasi termodinamik jihatdan erishiladi. Shu haroratdagi muvozanat konversiya darajasi ${f(HT.conveq * 100, 1)} % (muvozanat CO = ${f(HT.COeq, 2)} %), muvozanatga yaqinlashish ΔT = ${f(HT.Teq - HT.Tout, 0)} K.`));
  add(T('6.3', 'O‘rta haroratli CO konvertoridan chiqqan gaz tarkibi', compHead, compRows(HT.out), W6));
  add(H2('6.6. Past haroratli CO konvertori'));
  add(F(`Y₄ = (${f(HT.out.CO, 4)} – 0,0035·${f(LT.dry, 3)}) / 1,0035 = ${f(LT.y, 4)} kmol/soat`, '6.9'));
  add(P(`CO konversiya darajasi ${f(LT.conv * 100, 1)} %; ikki bosqich bo‘yicha umumiy konversiya darajasi ${f((HT.y + LT.y) / c.out2.CO * 100, 2)} %. Chiqish harorati T = ${f(LT.Tout, 1)} K da K_{p} = ${f(LT.Keq, 1)}, haqiqiy K_{p,haq} = ${f(LT.Kact, 1)} – shart bajariladi (yaqinlashish ΔT = ${f(LT.Teq - LT.Tout, 0)} K). Kirishdagi suv bug‘ining partsial bosimi p_{H₂O} = ${f(c.pH2O_LT / 1e6, 3)} MPa, unga mos shudring nuqtasi ≈ 451 K; kirish harorati ${c.T_LTin} K shudring nuqtasidan 27 K yuqori, katalizatorda kondensatsiya xavfi yo‘q.`));
  add(T('6.4', 'Past haroratli CO konvertoridan chiqqan gaz tarkibi', compHead, compRows(LT.out), W6));
  add(H2('6.7. CO konvertorlarining va tsexning moddiy balansi'));
  {
    const mIn = kg(HT.inl), mHT = kg(HT.out), mLT = kg(LT.out);
    add(T('6.5', 'O‘rta haroratli CO konvertorining moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Quruq gaz', f(mIn - HT.inl.H2O * 18.015, 2), ks(mIn - HT.inl.H2O * 18.015), 'Quruq gaz', f(mHT - HT.out.H2O * 18.015, 2), ks(mHT - HT.out.H2O * 18.015)],
      ['Suv bug‘i', f(HT.inl.H2O * 18.015, 2), ks(HT.inl.H2O * 18.015), 'Suv bug‘i', f(HT.out.H2O * 18.015, 2), ks(HT.out.H2O * 18.015)],
      B(['Jami', f(mIn, 2), ks(mIn), 'Jami', f(mHT, 2), ks(mHT)]),
    ], [1.6, 1, 1, 1.6, 1, 1]));
    const mNG = kg(c.n0), mSt = c.n_steam * 18.015, mAir = kg(c.airFlow);
    add(T('6.6', 'Tabiiy gaz konversiyasi tsexining umumiy moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Tabiiy gaz', f(mNG, 2), ks(mNG), 'Quruq konvertlangan gaz', f(mLT - LT.out.H2O * 18.015, 2), ks(mLT - LT.out.H2O * 18.015)],
      ['Texnologik bug‘', f(mSt, 2), ks(mSt), 'Suv bug‘i (kondensat)', f(LT.out.H2O * 18.015, 2), ks(LT.out.H2O * 18.015)],
      ['Havo', f(mAir, 2), ks(mAir), '', '', ''],
      B(['Jami', f(mNG + mSt + mAir, 2), ks(mNG + mSt + mAir), 'Jami', f(mLT, 2), ks(mLT)]),
    ], [1.6, 1, 1, 1.6, 1, 1]));
    add(P(`Balansning kirim va sarf qismlari orasidagi farq ${f(Math.abs(mNG + mSt + mAir - mLT), 3)} kg/soat (${f(Math.abs(mNG + mSt + mAir - mLT) / mLT * 100, 3)} %) bo‘lib, yaxlitlash xatoligi bilan izohlanadi. Quruq konvertlangan gaz chiqishi ${f(LT.dryOut * Vm, 2)} m³/soat, ya’ni 1 m³ tabiiy gazdan ${f(LT.dryOut * Vm / c.V_ng, 2)} m³ gaz olinadi; shu jumladan vodorod ${f(LT.out.H2 * Vm, 2)} m³/soat. Yillik ko‘rsatkichlar (τ = 8000 soat): tabiiy gaz – ${f(c.V_ng * 8000 / 1e6, 2)}·10⁶ m³/yil; quruq konvertlangan gaz – ${f(LT.dryOut * Vm * 8000 / 1e6, 3)}·10⁶ m³/yil; nazariy ammiak chiqishi ≈ ${f(LT.out.N2 * 2 * 17.03 * 8000 / 1000 * 0.97, 0)} t/yil.`));
  }

  // ============ 7. ISSIQLIK BALANSI
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Hisoblash usuli'));
  add(P('Issiqlik balanslari quyidagi umumiy tenglama asosida tuziladi:'));
  add(F('Q_{f,kir} + Q_{r} = Q_{f,chiq} + Q_{yo‘q}', '7.1'));
  add(P('bu yerda Q_{f,kir}, Q_{f,chiq} – oqimlar bilan kiradigan va chiqadigan fizik issiqlik, kW; Q_{r} – kimyoviy reaksiyalar issiqligi, kW; Q_{yo‘q} – atrof-muhitga yo‘qotiladigan issiqlik, kW. Fizik issiqliklar 298,15 K ga nisbatan hisoblanadi. Komponentlarning issiqlik sig‘imi:'));
  add(F('c_{p} = a + b·T + c·T² + c′/T², J/(mol·K)', '7.2'));
  add(F('ΔH_{i} = a(T – T₀) + b/2·(T² – T₀²) + c/3·(T³ – T₀³) – c′(1/T – 1/T₀)', '7.3'));
  add(T('7.1', 'Issiqlik sig‘imi koeffitsiyentlari va hosil bo‘lish entalpiyalari [2, 13]', ['Modda', 'a', 'b·10³', 'c·10⁶', 'c′·10⁻⁵', 'ΔH°_{f,298}, kJ/mol'],
    ['CH4', 'H2O', 'CO', 'CO2', 'H2', 'N2', 'O2', 'Ar'].map(s => { const k = t.CP[s]; return [NAMES[s], f(k.a, 2), f(k.b * 1e3, 2), k.c ? f(k.c * 1e6, 2) : '–', k.d ? f(k.d / 1e5, 2) : '–', f(k.Hf, 2)]; }), [1.3, 1, 1, 1, 1, 1.4]));
  {
    const Ts = [478, 643, 705, 1073, 1253];
    add(T('7.2', 'Komponentlarning entalpiya o‘zgarishi ΔH_{i}, kJ/kmol (298,15 K ga nisbatan)', ['Modda', ...Ts.map(x => x + ' K')],
      ['CH4', 'H2O', 'CO', 'CO2', 'H2', 'N2', 'Ar'].map(s => [NAMES[s], ...Ts.map(T_ => f(t.dH(s, T_), 0))]), [1.2, 1, 1, 1, 1, 1]));
  }
  add(H2('7.2. Birlamchi konvertor va yoqilg‘i sarfi'));
  add(P(`Bug‘-gaz aralashmasi bilan ${c.T_mix} K da kiradigan fizik issiqlik Q₁ = Σn_{i}·ΔH_{i}/3600 = ${f(c.Hin1, 2)} kW; gaz bilan ${c.T1} K da chiqadigan issiqlik Q₂ = ${f(c.Hout1, 2)} kW. Reaksiyalar issiqligi: metan konversiyasi Q_{r1} = X·206,14/3,6 = ${f(c.Qr1.ref, 2)} kW (yutiladi); og‘ir uglevodorodlar konversiyasi ${f(c.Qr1.hc, 2)} kW (yutiladi); CO konversiyasi Q_{r2} = Y·41,16/3,6 = ${f(c.Qr1.shift, 2)} kW (ajraladi). Quvur devori orqali uzatilishi kerak bo‘lgan issiqlik:`));
  add(F(`Q_{pech} = Q₂ + Q_{r1} + Q_{r,og‘} – Q_{r2} – Q₁ = ${f(c.Q1, 2)} kW`, '7.4'));
  add(P(`Radiatsion kameraning foydali ish koeffitsiyenti η = ${f(c.eta_rad, 2)} va tabiiy gazning eng past yonish issiqligi Q_{q} = ${f(c.LHV, 2)} MJ/m³ bo‘lganda yoqilg‘i sarfi:`));
  add(F('V_{yoq} = Q_{pech}·3600/(η·Q_{q}·10³)', '7.5'));
  add(F(`V_{yoq} = ${f(c.Q1, 2)}·3600/(${f(c.eta_rad, 2)}·${f(c.LHV, 2)}·10³) = ${f(c.V_fuel, 1)} m³/soat`));
  add(P(`Demak, 1 m³ texnologik tabiiy gazga ${f(c.V_fuel / c.V_ng, 3)} m³ yoqilg‘i gazi sarflanadi. Tutun gazlarining issiqligi konveksion kamerada bug‘-gaz aralashmasini, havoni, tabiiy gazni isitish va bug‘ hosil qilish uchun ishlatiladi.`));
  add(H2('7.3. Ikkilamchi konvertor'));
  add(P(`Ikkilamchi konvertor adiabatik ishlaydi, shuning uchun issiqlik balansidan unga beriladigan havoning zarur harorati aniqlanadi. Kirim: birlamchi konvertordan kelgan gaz issiqligi ${f(c.Hin_gas2, 2)} kW; havo issiqligi Q_{havo}; vodorod yonish issiqligi Q_{yon} = 2·n_{O₂}·241,81/3,6 = ${f(c.Qr2.comb, 2)} kW; CO konversiyasi issiqligi ${f(c.Qr2.shift, 2)} kW. Sarf: chiqayotgan gaz issiqligi ${f(c.Hout2, 2)} kW; metan konversiyasiga ${f(c.Qr2.ref, 2)} kW; yo‘qotishlar kirimning 1 % i. Balans tenglamasidan Q_{havo} = ${f(c.Hair, 2)} kW, bunga mos havo harorati T_{havo} = ${f(c.T_air, 0)} K. Bu qiymat havoni pechning konveksion kamerasida isitish orqali osongina ta’minlanadi.`));
  {
    const qin = c.Hin_gas2 + c.Hair + c.Qr2.comb + c.Qr2.shift;
    const loss = qin * c.lossSec;
    add(T('7.3', 'Ikkilamchi konvertorning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Gazning fizik issiqligi', f(c.Hin_gas2, 2), f(c.Hin_gas2 / qin * 100, 1), 'Gazning fizik issiqligi', f(c.Hout2, 2), f(c.Hout2 / qin * 100, 1)],
      ['Havoning fizik issiqligi', f(c.Hair, 2), f(c.Hair / qin * 100, 1), 'Metan konversiyasi', f(c.Qr2.ref, 2), f(c.Qr2.ref / qin * 100, 1)],
      ['H₂ yonish issiqligi', f(c.Qr2.comb, 2), f(c.Qr2.comb / qin * 100, 1), 'Yo‘qotishlar', f(loss, 2), f(loss / qin * 100, 1)],
      ['CO konversiyasi', f(c.Qr2.shift, 2), f(c.Qr2.shift / qin * 100, 1), '', '', ''],
      B(['Jami', f(qin, 2), '100', 'Jami', f(c.Hout2 + c.Qr2.ref + loss, 2), '100']),
    ], [1.8, 0.9, 0.6, 1.8, 0.9, 0.6]));
  }
  add(H2('7.4. Qozon-utilizator'));
  add(P(`Konvertlangan gaz ${c.T2} K dan ${c.T_HTin} K gacha soviganda ajraladigan issiqlik:`));
  add(F(`Q_{qu} = Σn_{i}·[ΔH_{i}(${c.T2}) – ΔH_{i}(${c.T_HTin})]/3600 = ${f(c.Q_whb, 2)} kW`, '7.6'));
  add(P(`Qozonning FIK η = 0,97, ta’minot suvi entalpiyasi (378 K) h′ = 440,2 kJ/kg, 4,0 MPa bosimli to‘yingan bug‘ entalpiyasi h″ = 2800,8 kJ/kg bo‘lganda hosil bo‘ladigan bug‘ miqdori:`));
  add(F('G_{bug‘} = Q_{qu}·η·3600/(h″ – h′)', '7.7'));
  add(F(`G_{bug‘} = ${f(c.Q_whb, 2)}·0,97·3600/2360,6 = ${f(c.G_steam, 1)} kg/soat (${f(c.G_steam / 3600, 4)} kg/s)`));
  add(P(`Hosil bo‘lgan bug‘ texnologik bug‘ ehtiyojining ${f(c.G_steam / (c.n_steam * 18.015) * 100, 0)} % ini qoplaydi.`));
  add(H2('7.5. O‘rta haroratli CO konvertorining issiqlik balansi'));
  add(P(`Kirim. Gaz bilan ${c.T_HTin} K da kiradigan fizik issiqlik (6.2-jadval tarkibi bo‘yicha) 7.4-jadvalda hisoblangan: Q_{f,kir} = ${f(HT.Qin, 2)} kW. CO konversiyasi reaksiyasi issiqligi:`));
  add(F(`Q_{r} = Y₃·ΔH_{r}/3,6 = ${f(HT.y, 4)}·41,16/3,6 = ${f(HT.Qr, 2)} kW`, '7.8'));
  add(P(`Sarf. Issiqlik yo‘qotishlari (izolyatsiya hisobi bilan tekshirilgan, 8.7-bo‘lim) kirimning ${f(c.lossHT * 100, 1)} % i: Q_{yo‘q} = ${f(HT.Qloss, 2)} kW. Chiqayotgan gaz issiqligi Q_{f,chiq} = Q_{f,kir} + Q_{r} – Q_{yo‘q} = ${f(HT.Qout, 2)} kW. Chiqish harorati T_{chiq} quyidagi tenglamani yechish orqali topiladi:`));
  add(F(`Σn_{i,chiq}·ΔH_{i}(T_{chiq})/3600 = ${f(HT.Qout, 2)} kW  ⇒  T_{chiq} = ${f(HT.Tout, 1)} K`, '7.9'));
  {
    const rows = []; let s1 = 0, s2 = 0;
    for (const s of ['CH4', 'H2O', 'CO', 'CO2', 'H2', 'N2', 'Ar']) {
      const q1 = HT.inl[s] * t.dH(s, HT.Tin) / 3600, q2 = HT.out[s] * t.dH(s, HT.Tout) / 3600; s1 += q1; s2 += q2;
      rows.push([NAMES[s], f(HT.inl[s], 4), f(q1, 2), f(HT.out[s], 4), f(q2, 2)]);
    }
    rows.push(B(['Jami', f(t.sum(HT.inl), 4), f(s1, 2), f(t.sum(HT.out), 4), f(s2, 2)]));
    add(T('7.4', `Gaz oqimlarining fizik issiqligi (kirish ${HT.Tin} K, chiqish ${f(HT.Tout, 1)} K)`, ['Komponent', 'n_{kir}, kmol/soat', 'Q_{kir}, kW', 'n_{chiq}, kmol/soat', 'Q_{chiq}, kW'], rows, [1.3, 1, 1, 1, 1]));
  }
  add(P(`Gazning adiabatik qizishi ΔT = ${f(HT.Tout - HT.Tin, 1)} K, ya’ni har 1 % (quruq gazda) konversiyalangan CO ga ${f((HT.Tout - HT.Tin) / ((c.out2.CO / HT.dry - HT.out.CO / HT.dryOut) * 100), 1)} K to‘g‘ri keladi. Chiqish harorati ${f(HT.Tout, 0)} K temir-xromli katalizator uchun ruxsat etilgan 763 K dan ancha past.`));
  {
    const qin = HT.Qin + HT.Qr;
    add(T('7.5', 'O‘rta haroratli CO konvertorining issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Bug‘-gaz aralashmasi fizik issiqligi', f(HT.Qin, 2), f(HT.Qin / qin * 100, 1), 'Konvertlangan gaz fizik issiqligi', f(HT.Qout, 2), f(HT.Qout / qin * 100, 1)],
      ['CO konversiyasi reaksiyasi issiqligi', f(HT.Qr, 2), f(HT.Qr / qin * 100, 1), 'Atrof-muhitga yo‘qotish', f(HT.Qloss, 2), f(HT.Qloss / qin * 100, 1)],
      B(['Jami', f(qin, 2), '100', 'Jami', f(HT.Qout + HT.Qloss, 2), '100']),
    ], [2, 0.8, 0.6, 2, 0.8, 0.6]));
  }
  add(H2('7.6. Past haroratli CO konvertori va oraliq sovitgich'));
  add(P(`Issiqlik almashtirgich 10 da gaz ${f(HT.Tout, 0)} K dan ${c.T_LTin} K gacha sovitiladi, bunda Q₁₀ = ${f(c.Q_cool, 2)} kW issiqlik ta’minot suviga beriladi. Past haroratli konvertorda: Q_{f,kir} = ${f(LT.Qin, 2)} kW, Q_{r} = ${f(LT.y, 4)}·41,16/3,6 = ${f(LT.Qr, 2)} kW, Q_{yo‘q} = ${f(LT.Qloss, 2)} kW, Q_{f,chiq} = ${f(LT.Qout, 2)} kW; chiqish harorati T_{chiq} = ${f(LT.Tout, 1)} K (ΔT = ${f(LT.Tout - LT.Tin, 1)} K) – mis-ruxli katalizatorning ruxsat etilgan haroratidan (533 K) past.`));
  {
    const qin = LT.Qin + LT.Qr;
    add(T('7.6', 'Past haroratli CO konvertorining issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Gazning fizik issiqligi', f(LT.Qin, 2), f(LT.Qin / qin * 100, 1), 'Gazning fizik issiqligi', f(LT.Qout, 2), f(LT.Qout / qin * 100, 1)],
      ['Reaksiya issiqligi', f(LT.Qr, 2), f(LT.Qr / qin * 100, 1), 'Yo‘qotishlar', f(LT.Qloss, 2), f(LT.Qloss / qin * 100, 1)],
      B(['Jami', f(qin, 2), '100', 'Jami', f(LT.Qout + LT.Qloss, 2), '100']),
    ], [2, 0.8, 0.6, 2, 0.8, 0.6]));
  }

  // ============ 8. APPARAT HISOBI
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(P('Asosiy apparat sifatida o‘rta haroratli CO konvertori hisoblanadi. U vertikal silindrik po‘lat korpusdan, elliptik qopqoq va tubdan, katalizator qatlamini ushlab turuvchi kolosnik panjaradan, gaz taqsimlagichdan, himoya va tayanch inert sharlar qatlamidan iborat (8.1-rasm).'));
  add(H2('8.1. Katalizator hajmi'));
  add(P(`Katalizator hajmi quruq gaz bo‘yicha hajmiy tezlik orqali aniqlanadi. Temir-xromli katalizator uchun 3,0 MPa bosimda tavsiya etilgan hajmiy tezlik W = 2000–4000 soat⁻¹ [2, 7]; W = ${HTr.SV} soat⁻¹ qabul qilamiz. Quruq gaz sarfi V_{q} = ${f(HT.dry, 3)}·22,414 = ${f(HTr.Vdry, 2)} m³/soat (${f(HTr.Vdry / 3600, 4)} m³/s).`));
  add(F(`V_{k}⁰ = V_{q} / W = ${f(HTr.Vdry, 2)} / ${HTr.SV} = ${f(HTr.Vcat0, 4)} m³`, '8.1'));
  add(P(`Katalizator faolligining ekspluatatsiya davomida pasayishini va gaz notekis taqsimlanishini hisobga oluvchi zaxira koeffitsiyenti k_{z} = ${f(HTr.kz, 2)}:`));
  add(F(`V_{k} = k_{z}·V_{k}⁰ = ${f(HTr.kz, 2)}·${f(HTr.Vcat0, 4)} = ${f(HTr.Vcat, 4)} m³`, '8.2'));
  add(P(`Katalizator massasi m_{k} = V_{k}·ρ_{t} = ${f(HTr.Vcat, 4)}·1300 = ${f(HTr.mcat, 1)} kg. Kontakt vaqti (normal sharoitda) τ₀ = 3600/W = ${f(HTr.tau, 2)} s.`));
  add(P('Kinetik tekshiruv. (2.9) tenglamani adiabatik qatlam uchun integrallash, 3 MPa va 643–705 K oralig‘ida temir-xromli katalizator bo‘yicha [2] dagi tajriba ma’lumotlariga ko‘ra, CO ni 13 % dan 3,2 % gacha konversiyalash uchun zarur shartli kontakt vaqti 0,9–1,0 s ni tashkil etadi. Qabul qilingan τ₀ = 1,2 s (zaxira bilan 1,5 s) belgilangan konversiya darajasini ishonchli ta’minlaydi.'));
  {
    // muvozanat va adiabata chizig'i
    const inl = HT.inl; const lam = (HT.Tout - HT.Tin) / HT.conv;
    const rows = [];
    const zeq = T_ => { const K = t.Kshift(T_); return t.solveT(z => { const o = { CO: inl.CO - z, H2O: inl.H2O - z, CO2: inl.CO2 + z, H2: inl.H2 + z }; return o.CO2 * o.H2 - K * o.CO * o.H2O; }, 0, inl.CO - 1e-9); };
    const Tx = t.solveT(T_ => (T_ - HT.Tin) / lam - zeq(T_) / inl.CO, HT.Tin, 800); const xx = (Tx - HT.Tin) / lam;
    for (const T_ of [643, 663, 683, 703, 723, 743, 763]) {
      const K = t.Kshift(T_); const z = zeq(T_);
      const xa = (T_ - HT.Tin) / lam;
      rows.push([String(T_), f(K, 2), f(z / inl.CO * 100, 1), f((inl.CO - z) / (HT.dry + z) * 100, 2), xa <= z / inl.CO ? f(xa * 100, 1) : '–']);
    }
    add(H2('8.2. Muvozanat va adiabata chiziqlari'));
    add(P(`Konvertorga kiradigan gaz tarkibi (6.2-jadval) uchun turli haroratlardagi muvozanat konversiya darajasi (2.8) tenglama bo‘yicha, adiabatik qatlamdagi konversiya darajasi esa adiabata tenglamasi bo‘yicha hisoblandi:`));
    add(F(`T = T_{kir} + λ·x;   λ = (T_{chiq} – T_{kir})/x_{chiq} = ${f(HT.Tout - HT.Tin, 1)}/${f(HT.conv, 4)} = ${f(lam, 1)} K`, '8.3'));
    add(T('8.1', 'O‘rta haroratli konvertordagi muvozanat va adiabatik konversiya darajalari', ['T, K', 'K_{p}', 'x_{m}, %', 'CO_{m} (quruq), %', 'x_{ad}, %'], rows, [1, 1, 1, 1.3, 1]));
    add(P(`Jadvaldan ko‘rinib turibdiki, adiabata chizig‘i muvozanat chizig‘ini taxminan ${f(Tx, 0)} K da kesib o‘tadi (x ≈ ${f(xx * 100, 1)} %); undan yuqori haroratlarda adiabatik jarayon bo‘lishi mumkin emas (jadvalda “–”). Qabul qilingan chiqish konversiya darajasi ${f(HT.conv * 100, 1)} % (T = ${f(HT.Tout, 0)} K) shu haroratdagi muvozanat qiymatidan (${f(HT.conveq * 100, 1)} %) ${f((HT.conveq - HT.conv) * 100, 1)} % ga kam bo‘lib, bu katalizatorning ishchi davri oxirigacha zarur zaxirani ta’minlaydi.`));
  }
  add(H2('8.3. Konvertorning diametri va katalizator qatlami balandligi'));
  add(P(`Adiabatik konvertorlarda katalizator qatlami balandligining diametrga nisbati H/D = 1–2 tavsiya etiladi. H/D = ${f(HTr.HD, 1)} da:`));
  add(F(`D = (4·V_{k}/(π·H/D))^{1/3} = (4·${f(HTr.Vcat, 4)}/(3,1416·${f(HTr.HD, 1)}))^{1/3} = ${f(HTr.Dcalc, 3)} m`, '8.4'));
  add(P(`Normallashtirilgan qatordan ichki diametr D = ${f(HTr.D * 1000, 0)} mm qabul qilinadi. Kesim yuzasi S = πD²/4 = ${f(HTr.S, 4)} m², katalizator qatlami balandligi:`));
  add(F(`H_{k} = V_{k}/S = ${f(HTr.Vcat, 4)} / ${f(HTr.S, 4)} = ${f(HTr.Hcat, 3)} m`, '8.5'));
  add(P(`Ish sharoitidagi bug‘-gaz aralashmasining hajmiy sarfi (o‘rtacha harorat T_{o‘r} = ${f(HTr.Tm, 1)} K, P = ${f(c.P_HT / 1e6, 2)} MPa):`));
  add(F('V = V₀·(P₀/P)·(T_{o‘r}/T₀)', '8.6'));
  add(F(`V = ${f(HTr.Vwet, 2)}·(0,101325/${f(c.P_HT / 1e6, 2)})·(${f(HTr.Tm, 1)}/273,15)/3600 = ${f(HTr.Vact, 5)} m³/s`));
  add(F(`w = V/S = ${f(HTr.Vact, 5)} / ${f(HTr.S, 4)} = ${f(HTr.w, 4)} m/s`, '8.7'));
  add(P(`Gazning fiktiv tezligi ${f(HTr.w, 3)} m/s adiabatik konvertorlar uchun tavsiya etilgan 0,05–0,3 m/s oralig‘ida. Erkin hajmdagi haqiqiy kontakt vaqti τ = V_{k}·ε/V = ${f(HTr.Vcat, 4)}·${f(HTr.eps, 2)}/${f(HTr.Vact, 5)} = ${f(HTr.tau_act, 2)} s.`));
  add(H2('8.4. Katalizator qatlamining gidravlik qarshiligi'));
  add(P(`Gaz aralashmasining o‘rtacha molyar massasi M = ${f(HTr.M, 2)} kg/kmol, ish sharoitidagi zichligi ρ = P·M/(R·T) = ${f(c.P_HT, 0)}·${f(HTr.M, 2)}/(8314·${f(HTr.Tm, 1)}) = ${f(HTr.rho, 3)} kg/m³, dinamik qovushoqligi μ = ${e(HTr.mu, 1)} Pa·s. Katalizator granulasining ekvivalent diametri d = ${f(HTr.dp * 1000, 0)} mm, qatlam g‘ovakligi ε = ${f(HTr.eps, 2)}. Reynolds soni Re = w·d·ρ/μ = ${f(HTr.Re, 1)}. Qatlam qarshiligi Ergun tenglamasi bo‘yicha:`));
  add(F('ΔP/H = 150·(1–ε)²·μ·w/(ε³·d²) + 1,75·(1–ε)·ρ·w²/(ε³·d)', '8.8'));
  add(F(`ΔP = ${f(HTr.dPdL, 1)}·${f(HTr.Hcat, 3)} = ${f(HTr.dP, 1)} Pa`, '8.9'));
  add(P(`Kolosnik panjara, inert sharlar qatlami va shtutserlardagi qarshiliklarni hisobga olib (koeffitsiyent 1,5), apparatning umumiy gidravlik qarshiligi ≈ ${f(HTr.dP * 1.5, 0)} Pa ni tashkil etadi, bu kompressor bosimining arzimas qismi (< 0,01 %).`));
  add(H2('8.5. Korpus devori va tubining qalinligi'));
  add(P(`Konvertor korpusi vodorodga chidamli 12ХМ (yoki 09Г2С) po‘latidan tayyorlanadi. Hisobiy bosim P_{h} = 1,1·P = 1,1·${f(c.P_HT / 1e6, 2)} = ${f(c.HTw.Pr, 3)} MPa, hisobiy harorat 723 K da ruxsat etilgan kuchlanish [σ] = 120 MPa, payvand chok mustahkamlik koeffitsiyenti φ = 0,9, korroziyaga qo‘shimcha c = 2 mm [8]:`));
  add(F('s = P_{h}·D/(2φ[σ] – P_{h}) + c', '8.10'));
  add(F(`s = ${f(c.HTw.Pr, 3)}·${f(HTr.D * 1000, 0)}/(2·0,9·120 – ${f(c.HTw.Pr, 3)}) + 2 = ${f(c.HTw.sR + 2, 2)} mm`));
  add(P(`Devor qalinligi s = ${c.HTw.s} mm qabul qilinadi. Elliptik tub va qopqoq qalinligi s_{t} = P_{h}·D/(2φ[σ] – 0,5P_{h}) + c = ${f(c.HTbottom + 2, 2)} mm, ya’ni korpus bilan bir xil ${c.HTw.s} mm qabul qilinadi.`));
  add(H2('8.6. Shtutserlar diametri'));
  add(F('d = (4·V/(π·w))^{0,5}', '8.11'));
  add(P(`Gaz uchun shtutserdagi tezlik w = 20 m/s. Kirish shtutseri: V = ${f(c.HTnoz.Vin, 4)} m³/s, d = ${f(c.HTnoz.din * 1000, 1)} mm; chiqish shtutseri: V = ${f(c.HTnoz.Vout, 4)} m³/s, d = ${f(c.HTnoz.dout * 1000, 1)} mm. Standart bo‘yicha ikkala shtutser uchun Dy 50 mm (57×4 mm quvur) qabul qilinadi. Katalizator yuklash uchun yuqori qopqoqda Dy 400 mm lyuk, tushirish uchun pastki qismida Dy 150 mm lyuk ko‘zda tutiladi.`));
  add(H2('8.7. Issiqlik izolyatsiyasi'));
  add(P(`Izolyatsiya materiali – mineral paxta matlari (λ = ${f(c.ins.lam, 2)} W/(m·K)). Izolyatsiya tashqi sirtining harorati xavfsizlik talabiga ko‘ra T_{s} = 318 K, atrof-muhit harorati T_{a} = 293 K. Tashqi sirtdan issiqlik berish koeffitsiyenti α = 9,74 + 0,07·(T_{s} – T_{a}) = ${f(c.ins.alpha, 2)} W/(m²·K). Izolyatsiya qalinligi:`));
  add(F('δ = λ·(T_{d} – T_{s})/(α·(T_{s} – T_{a}))', '8.12'));
  add(F(`δ = ${f(c.ins.lam, 2)}·(${f(c.ins.Tw, 0)} – 318)/(${f(c.ins.alpha, 2)}·25) = ${f(c.ins.d, 3)} m`));
  add(P(`Izolyatsiya qalinligi 100 mm qabul qilinadi. Izolyatsiya sirti F ≈ ${f(c.ins.F, 2)} m², undan yo‘qotiladigan issiqlik Q = α·(T_{s} – T_{a})·F = ${f(c.ins.Qloss, 2)} kW – bu issiqlik balansida qabul qilingan Q_{yo‘q} = ${f(HT.Qloss, 2)} kW ga mos keladi.`));
  add(H2('8.8. Apparatning umumiy balandligi'));
  add(P(`Konvertorning silindrik qismi balandligi: katalizator qatlami ${f(HTr.Hcat, 2)} m; yuqori himoya qatlami (inert sharlar) 0,10 m; pastki inert sharlar qatlami 0,15 m; kolosnik panjara va uning ostidagi bo‘shliq 0,30 m; gaz taqsimlagich zonasi 0,60 m; montaj zaxirasi 0,40 m. Elliptik tub va qopqoq balandligi har biri 0,25·D = ${f(0.25 * HTr.D, 2)} m. Apparatning umumiy balandligi (tayanchlarsiz) H ≈ ${f(HTr.Htot, 2)} m. Konvertor chizmasi 8.1-rasmda keltirilgan.`));
  add(IMG(path.join(FIG, 'konvertor.png'), 330, 445, '8.1-rasm. O‘rta haroratli CO konvertorining sxematik chizmasi'));
  add(H2('8.9. Past haroratli CO konvertori'));
  add(P(`Past haroratli konvertor xuddi shu usulda hisoblanadi: quruq gaz sarfi ${f(LTr.Vdry, 2)} m³/soat, hajmiy tezlik W = ${LTr.SV} soat⁻¹, k_{z} = ${f(LTr.kz, 2)}; katalizator hajmi V_{k} = ${f(LTr.Vcat, 3)} m³ (${f(LTr.mcat, 0)} kg); hisobiy diametr ${f(LTr.Dcalc, 3)} m, qabul qilingan D = ${f(LTr.D * 1000, 0)} mm; qatlam balandligi ${f(LTr.Hcat, 3)} m; fiktiv tezlik ${f(LTr.w, 4)} m/s; qatlam qarshiligi (d = 5 mm, ε = 0,38) ${f(LTr.dP, 0)} Pa; devor qalinligi (P_{h} = ${f(c.LTw.Pr, 2)} MPa, [σ] = 130 MPa) ${c.LTw.s} mm.`));
  add(T('8.2', 'CO konvertorlari hisobining asosiy natijalari', ['Ko‘rsatkich', 'O‘rta haroratli', 'Past haroratli'], [
    ['Quruq gaz sarfi, m³/s (n.sh.)', f(HTr.Vdry / 3600, 4), f(LTr.Vdry / 3600, 4)],
    ['Katalizator', 'Fe–Cr', 'Cu–Zn–Al'],
    ['Hajmiy tezlik, s⁻¹ (soat⁻¹)', `${f(HTr.SV / 3600, 3)} (${HTr.SV})`, `${f(LTr.SV / 3600, 3)} (${LTr.SV})`],
    ['Katalizator hajmi, m³', f(HTr.Vcat, 3), f(LTr.Vcat, 3)],
    ['Katalizator massasi, kg', f(HTr.mcat, 0), f(LTr.mcat, 0)],
    ['Ichki diametr, m', f(HTr.D, 2), f(LTr.D, 2)],
    ['Qatlam balandligi, m', f(HTr.Hcat, 2), f(LTr.Hcat, 2)],
    ['Kirish/chiqish harorati, K', `${HT.Tin} / ${f(HT.Tout, 0)}`, `${LT.Tin} / ${f(LT.Tout, 0)}`],
    ['Qatlam qarshiligi, Pa', f(HTr.dP, 0), f(LTr.dP, 0)],
    ['Devor qalinligi, mm', String(c.HTw.s), String(c.LTw.s)],
  ], [2.2, 1, 1]));

  // ============ 9. JIHOZLAR SONI
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Apparatlar soni quyidagi formula bo‘yicha aniqlanadi:'));
  add(F('n = V_{talab} / V_{bir}', '9.1'));
  add(P('bu yerda V_{talab} – talab etiladigan unumdorlik (yoki katalizator hajmi, issiqlik almashinish yuzasi); V_{bir} – bitta standart apparatning unumdorligi.'));
  add(P(`O‘rta haroratli CO konvertori. Talab etilgan katalizator hajmi ${f(HTr.Vcat, 3)} m³. D = 600 mm li bitta apparatga katalizator qatlami balandligi ${f(HTr.Hcat, 2)} m bo‘lganda ${f(HTr.Vcat, 3)} m³ katalizator joylashadi: n = ${f(HTr.Vcat, 3)}/${f(HTr.Vcat, 3)} = 1. Katalizator almashtirish rejali ta’mirlash vaqtida bajarilgani uchun zaxira apparat ko‘zda tutilmaydi. Qabul qilinadi: 1 dona.`));
  add(P(`Past haroratli CO konvertori. Xuddi shunday, n = 1; qabul qilinadi: 1 dona.`));
  {
    const Ftube = Math.PI * 0.1 * 10; // quvur sirti m2 (D=100mm, L=10m)
    const qrad = 70; // kW/m2 issiqlik kuchlanishi
    const nt = c.Q1 / (qrad * Ftube);
    add(P(`Quvurli pech (birlamchi konvertor). Radiatsion kameradagi reaksion quvurlarning ruxsat etilgan o‘rtacha issiqlik kuchlanishi q = ${qrad} kW/m². Quvur o‘lchami 100×12 mm, isitiladigan uzunligi 10 m, bitta quvurning tashqi sirti F₁ = π·0,1·10 = ${f(Ftube, 2)} m². Kerakli quvurlar soni n = Q_{pech}/(q·F₁) = ${f(c.Q1, 2)}/(${qrad}·${f(Ftube, 2)}) = ${f(nt, 2)}. Gazni bir tekis taqsimlash uchun 2 ta quvur qabul qilinadi; pech soni – 1.`));
  }
  {
    const K = 60, dT = ((c.T2 - 523) - (c.T_HTin - 523)) / Math.log((c.T2 - 523) / (c.T_HTin - 523));
    const F_ = c.Q_whb * 1000 / (K * dT);
    add(P(`Qozon-utilizator. Issiqlik yuklamasi Q = ${f(c.Q_whb, 2)} kW, issiqlik uzatish koeffitsiyenti K = ${K} W/(m²·K), qaynayotgan suv harorati 523 K, o‘rtacha logarifmik haroratlar farqi Δt = ${f(dT, 1)} K. Kerakli yuza F = Q/(K·Δt) = ${f(F_, 2)} m². Standart qozon-utilizator yuzasi 10 m²: n = ${f(F_, 2)}/10 = ${f(F_ / 10, 2)} → 1 dona.`));
  }
  {
    const K = 80, dT1 = HT.Tout - 413, dT2 = c.T_LTin - 378, dT = (dT1 - dT2) / Math.log(dT1 / dT2); const F_ = c.Q_cool * 1000 / (K * dT);
    add(P(`Issiqlik almashtirgich 10 (gaz – ta’minot suvi). Q = ${f(c.Q_cool, 2)} kW, suv 378 K dan 413 K gacha isitiladi, K = ${K} W/(m²·K), Δt = ${f(dT, 1)} K, F = ${f(F_, 2)} m². Qobiq-quvurli standart issiqlik almashtirgich (F = 6 m², D = 273 mm): n = ${f(F_ / 6, 2)} → 1 dona.`));
  }
  {
    // suvli sovitgich 13 va separator 14
    const g = LT.out; const Tin = 400, Tout = 313;
    // 12-almashtirgichdan keyin 400 K; sovitishda suv bug'i kondensatsiyalanadi
    const ps = T_ => 1000 * Math.exp(16.3872 - 3885.70 / (T_ - 273.15 + 230.170));
    const P13 = 2.9e6; const nd = t.sum(g, ['H2O']);
    const nW313 = nd * ps(Tout) / (P13 - ps(Tout));
    const cond = g.H2O - nW313;
    const dry = { ...g }; delete dry.H2O;
    const Qs = (t.Qphys(dry, Tin) - t.Qphys(dry, Tout)) + nW313 * (t.dH('H2O', Tin) - t.dH('H2O', Tout)) / 3600 + cond * 18.015 * (2260 + 4.19 * (373 - Tout) + 2.0 * (Tin - 373)) / 3600;
    const K = 250, dT = ((Tin - 308) - (Tout - 298)) / Math.log((Tin - 308) / (Tout - 298)); const F_ = Qs * 1000 / (K * dT);
    const Gw = Qs / (4.18 * 10) * 3600;
    add(P(`Suvli sovitgich 13. Gaz issiqlik almashtirgich 12 dan keyin 400 K haroratda kiradi va 313 K gacha sovitiladi. 313 K va 2,9 MPa da gazda qoladigan suv bug‘i ${f(nW313, 4)} kmol/soat, kondensatsiyalanadigan suv ${f(cond, 3)} kmol/soat (${f(cond * 18.015, 1)} kg/soat). Issiqlik yuklamasi (gazni sovitish va bug‘ kondensatsiyasi) Q = ${f(Qs, 2)} kW; sovituvchi suv 298 K dan 308 K gacha isiydi, sarfi G = ${f(Gw, 0)} kg/soat. K = ${K} W/(m²·K), Δt_{o‘r} = ${f(dT, 1)} K bo‘lganda kerakli yuza F = ${f(F_, 2)} m². Standart qobiq-quvurli sovitgich (F = 25 m², D = 400 mm, quvurlar 25×2 mm, L = 4 m): n = ${f(F_ / 25, 2)} → 1 dona.`));
    const rhoG = 2.9e6 * (t.mass(dry) / nd) / 1000 / (8.314 * 313); const rhoL = 992;
    const wdop = 0.06 * Math.sqrt((rhoL - rhoG) / rhoG); const Vg = nd * 22.414 * (101325 / 2.9e6) * (313 / 273.15) / 3600; const Dsep = Math.sqrt(4 * Vg / (Math.PI * wdop));
    add(P(`Separator 14. Gaz zichligi ρ_{g} = ${f(rhoG, 2)} kg/m³, kondensat zichligi ρ_{s} = 992 kg/m³. Setkali tomchi ushlagichli vertikal separatorda gazning ruxsat etilgan tezligi w = 0,06·((ρ_{s} – ρ_{g})/ρ_{g})^{0,5} = ${f(wdop, 3)} m/s. Gazning hajmiy sarfi V = ${f(Vg, 5)} m³/s, separatorning minimal diametri D = (4V/(πw))^{0,5} = ${f(Dsep, 3)} m. Kondensatning bir tekis ajralishi va sath rostlagichini joylashtirish uchun D = 300 mm, H = 1,2 m qabul qilinadi; soni – 1 dona.`));
  }
  add(P('Kompressorlar va nasoslar uchun ishchi apparat bilan bir qatorda bitta zaxira ko‘zda tutiladi. Oltingugurtdan tozalash adsorberlari ikki dona bo‘lib, ular ketma-ket (“yetakchi – ergashuvchi”) sxemada ishlaydi.'));

  // ============ 10. RO'YXAT
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Tabiiy gaz kompressori', '2 (1 zaxira)', 'Porshenli, V = 150 m³/soat, P = 4,0 MPa', 'Uglerodli po‘lat'],
    ['2', 'Pechning konveksion kamerasi', '1', 'Zmeyevikli isitgichlar: tabiiy gaz, bug‘-gaz, havo', '12Х18Н10Т'],
    ['3a', 'Gidrirlash reaktori', '1', `D = 300 mm, H = 1,5 m, Al-Co-Mo katalizator`, '12ХМ'],
    ['3b', 'Oltingugurtdan tozalash adsorberi', '2', 'D = 400 mm, H = 2,0 m, ZnO yutuvchi', '12ХМ'],
    ['4', 'Bug‘-gaz aralashtirgich', '1', 'D = 100 mm, injektorli', '12Х18Н10Т'],
    ['5', 'Quvurli pech (birlamchi konvertor)', '1', `Q = ${f(c.Q1, 0)} kW, 2 reaksion quvur 100×12 mm, L = 10 m, Ni katalizator`, 'НХ35Н45Б (quvurlar)'],
    ['6', 'Havo kompressori', '2 (1 zaxira)', `V = ${f(c.A * Vm, 0)} m³/soat, P = 3,5 MPa`, 'Uglerodli po‘lat'],
    ['7', 'Shaxtali (ikkilamchi) metan konvertori', '1', 'D_{ich} = 400 mm, futerovkali, Ni katalizator', '09Г2С + olovbardosh beton'],
    ['8', 'Qozon-utilizator', '1', `Q = ${f(c.Q_whb, 0)} kW, F = 10 m², bug‘ ${f(c.G_steam, 0)} kg/soat, 4 MPa`, '12ХМ'],
    ['9', 'O‘rta haroratli CO konvertori', '1', `D = ${f(HTr.D * 1000, 0)} mm, H = ${f(HTr.Htot, 1)} m, V_{k} = ${f(HTr.Vcat, 2)} m³ Fe–Cr`, '12ХМ'],
    ['10', 'Issiqlik almashtirgich', '1', 'Qobiq-quvurli, F = 6 m²', '12ХМ / 20'],
    ['11', 'Past haroratli CO konvertori', '1', `D = ${f(LTr.D * 1000, 0)} mm, H = 3,1 m, V_{k} = ${f(LTr.Vcat, 2)} m³ Cu–Zn–Al`, '09Г2С'],
    ['12', 'Issiqlik almashtirgich (MEA regeneratsiyasi)', '1', 'Qobiq-quvurli, F = 4 m²', '12Х18Н10Т'],
    ['13', 'Suvli sovitgich', '1', 'Qobiq-quvurli, F = 25 m², D = 400 mm', '12Х18Н10Т / 20'],
    ['14', 'Separator', '1', 'D = 300 mm, H = 1,2 m, setkali tomchi ushlagich', '09Г2С'],
    ['15', 'Kondensat nasosi', '2 (1 zaxira)', 'Markazdan qochma, Q = 0,5 m³/soat', '12Х18Н10Т'],
  ], [0.5, 2.3, 1, 2.8, 1.5]));

  // ============ 11. TAHLILIY NAZORAT
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('Tabiiy gaz konversiyasi tsexida tahliliy nazorat xomashyo sifatini, texnologik rejimga rioya qilinishini, katalizatorlarning holatini va mahsulot sifatini ta’minlash maqsadida olib boriladi. Nazorat avtomatik analizatorlar (uzluksiz) va zavod laboratoriyasi tomonidan davriy namunalar olish orqali bajariladi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul, asbob', 'Davriyligi'], [
    ['Tabiiy gaz (kirish)', 'CH₄, C_{n}H_{m}, N₂, CO₂', '3.1-jadval', 'Gaz xromatografi (“Kristall-2000”)', '1 marta smenada'],
    ['Tabiiy gaz (kirish)', 'Oltingugurt birikmalari', '≤ 20 mg/m³', 'Fotokolorimetrik, yodometrik', '1 marta sutkada'],
    ['Adsorber 3b chiqishi', 'H₂S + RSH', '≤ 0,5 mg/m³', 'Avtomatik analizator', 'Uzluksiz'],
    ['Birlamchi konvertor chiqishi', 'CH₄ (quruq gazda)', '9–11 %', 'Xromatograf, IQ-analizator', 'Uzluksiz'],
    ['Ikkilamchi konvertor chiqishi', 'CH₄; O₂', '≤ 0,5 %; 0', 'Xromatograf; termomagnit', 'Uzluksiz'],
    ['Ikkilamchi konvertor chiqishi', '(H₂ + CO) : N₂', '3,05–3,15', 'Xromatograf', '2 soatda 1 marta'],
    ['YuH konvertor chiqishi', 'CO (quruq gazda)', '3,0–3,5 %', 'IQ-gazanalizator (ГИАМ)', 'Uzluksiz'],
    ['PH konvertor chiqishi', 'CO (quruq gazda)', '≤ 0,4 %', 'IQ-gazanalizator', 'Uzluksiz'],
    ['PH konvertor kirishi', 'S, Cl birikmalari', '≤ 0,1 mg/m³', 'Laboratoriya tahlili', '1 marta sutkada'],
    ['Separator 14 kondensati', 'NH₃, CH₃OH, pH', 'pH 8–9', 'Titrlash, pH-metr', '1 marta smenada'],
    ['Qozon suvi', 'Qattiqlik, O₂, pH', '≤ 3 mkg-ekv/kg; ≤ 20 mkg/kg', 'Trilonometrik, kislorodomer', '1 marta smenada'],
    ['Ish zonasi havosi', 'CO; CH₄', '≤ 20 mg/m³; ≤ 1 % (hajm)', 'Signalizatorlar (СТМ-10)', 'Uzluksiz'],
  ], [1.7, 1.6, 1.2, 1.8, 1.2]));
  add(P('Texnologik parametrlar nazorati: konvertorlarning kirish va chiqish haroratlari hamda katalizator qatlami bo‘yicha harorat profili (XA turidagi termoparalar, har bir konvertorda 3–5 nuqta); bosim va bosimlar farqi (gidravlik qarshilik ortishi katalizator yemirilganini bildiradi); tabiiy gaz, bug‘ va havo sarflari (diafragmali sarf o‘lchagichlar). S : C nisbati 3,3 dan pastga tushganda katalizatorda uglerod ajralishini oldini olish uchun blokirovka ishga tushadi.'));
  add(P('O‘rta haroratli konvertorda katalizator faolligi pasayishi “issiq nuqta” (maksimal harorat) ning qatlam bo‘ylab pastga siljishi va chiqishdagi CO miqdorining ortishi orqali aniqlanadi. Past haroratli katalizatorni qaytarish (aktivlash) jarayonida azotdagi vodorod miqdori 0,5–2 % oralig‘ida qat’iy nazorat qilinadi, qatlam harorati 503 K dan oshmasligi kerak.'));

  // ============ 12. XULOSA
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Tabiiy gaz bo‘yicha unumdorligi ${c.V_ng} m³/soat bo‘lgan konversiya tsexi uchun bosim ostida ikki bosqichli (bug‘li va bug‘-havoli) metan konversiyasi hamda ikki bosqichli (o‘rta va past haroratli) CO konversiyasi sxemasi asoslab tanlandi.`));
  add(P(`2. Moddiy balans hisobi natijasida: texnologik bug‘ sarfi ${f(c.n_steam * 18.015, 1)} kg/soat (${f(c.n_steam * 18.015 / 3600, 4)} kg/s), havo sarfi ${f(c.A * Vm, 1)} m³/soat, quruq konvertlangan gaz chiqishi ${f(LT.dryOut * Vm, 1)} m³/soat (${f(LT.dryOut * Vm / 3600, 4)} m³/s) ekanligi aniqlandi. Gaz tarkibida CO ${f(LT.out.CO / LT.dryOut * 100, 2)} %, H₂ : N₂ = ${f(LT.out.H2 / LT.out.N2, 2)}. CO ning umumiy konversiya darajasi ${f((HT.y + LT.y) / c.out2.CO * 100, 1)} %.`));
  add(P(`3. Issiqlik balanslari asosida: birlamchi konvertor issiqlik yuklamasi ${f(c.Q1, 1)} kW, yoqilg‘i gazi sarfi ${f(c.V_fuel, 1)} m³/soat; ikkilamchi konvertorga beriladigan havo harorati ${f(c.T_air, 0)} K; qozon-utilizatorda ${f(c.G_steam, 0)} kg/soat 4 MPa bug‘ olinadi; o‘rta haroratli konvertorda gaz ${HT.Tin} K dan ${f(HT.Tout, 0)} K gacha, past haroratlida ${LT.Tin} K dan ${f(LT.Tout, 0)} K gacha qiziydi.`));
  add(P(`4. O‘rta haroratli CO konvertori hisoblandi: katalizator hajmi ${f(HTr.Vcat, 3)} m³ (${f(HTr.mcat, 0)} kg), ichki diametr ${f(HTr.D * 1000, 0)} mm, katalizator qatlami balandligi ${f(HTr.Hcat, 2)} m, apparat balandligi ${f(HTr.Htot, 1)} m, gidravlik qarshilik ${f(HTr.dP, 0)} Pa, devor qalinligi ${c.HTw.s} mm, izolyatsiya qalinligi 100 mm. Talab qilinadigan apparatlar soni – 1.`));
  add(P('5. Tsexning asosiy jihozlari ro‘yxati tuzildi va tahliliy nazorat sxemasi ishlab chiqildi. Loyihada qabul qilingan yechimlar Respublikamiz azot sanoati korxonalarida qo‘llanilayotgan zamonaviy texnologiyalarga mos keladi, olingan konvertlangan gaz esa monoetanolamin bilan tozalash va metanlashdan so‘ng ammiak sintezi uchun yaroqli.'));

  // ============ 13. ADABIYOTLAR
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
    'Справочник азотчика. Т. 1. – 2-е изд. – М.: Химия, 1986. – 512 с.',
    'Семенов В.П. и др. Производство аммиака. – М.: Химия, 1985. – 368 с.',
    'Twigg M.V. Catalyst Handbook. – 2nd ed. – London: Wolfe Publishing, 1989. – 608 p.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Tabiiy gaz konversiyasi tsexining (uglerod oksidi) konvertori hisobi bilan loyihasi.', unum: 'Unumdorligi – tabiiy gaz bo‘yicha 150 m³/soat' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
