// 6-loyiha: Soda ishlab chiqarishning namakob tizimini filtratsiya bo'limining filtr hisobi bilan loyihasi. 8,07 t/soat
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc6');

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];
const M = c.M;
const ks = x => f(x / 3600, 4); // kg/soat -> kg/s
const NM = { NaHCO3: 'NaHCO₃', NH4HCO3: 'NH₄HCO₃', NaCl: 'NaCl', NH4Cl: 'NH₄Cl', H2O: 'H₂O', other: 'Erimaydigan aralashmalar' };
const sumO = o => Object.values(o).reduce((a, b) => a + b, 0);
function compRows(o, extraCols) {
  const tot = sumO(o); const rows = Object.keys(o).map(k => [NM[k] || k, f(o[k], 1), ks(o[k]), f(o[k] / tot * 100, 2)]);
  rows.push(B(['Jami', f(tot, 1), ks(tot), '100,00'])); return rows;
}
const cH = ['Komponent', 'kg/soat', 'kg/s', '% (massa)'];

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };
  const perT = x => x / (c.G / 1000); // 1 t sodaga

  // ============ 1
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Kalsinatsiyalangan soda (natriy karbonati Na₂CO₃) – kimyo sanoatining eng muhim asosiy mahsulotlaridan biri. U shisha ishlab chiqarishda (umumiy iste’molning 45–50 % i), sintetik yuvish vositalari, sovun, rangli metallurgiya (alyuminiy oksidi, volfram, molibden), qog‘oz, to‘qimachilik, oziq-ovqat sanoatida, suvni yumshatishda va boshqa ko‘plab kimyoviy mahsulotlar (natriy silikatlari, fosfatlari, xromatlari) olishda ishlatiladi. Jahonda yiliga 60 mln tonnadan ortiq soda ishlab chiqariladi, uning 70 % ga yaqini ammiakli (Solve) usulida olinadi.'));
  add(P('O‘zbekistonda kalsinatsiyalangan soda 2015-yilda ishga tushirilgan Qo‘ng‘irot soda zavodida (Qoraqalpog‘iston Respublikasi) ammiakli usulda ishlab chiqariladi. Zavod xomashyosi – Barsakelmes osh tuzi koni namakobi va mahalliy ohaktosh. Zavod respublikaning shisha, kimyo va metallurgiya korxonalarini mahalliy soda bilan ta’minlab, importni almashtirishga xizmat qiladi. Soda ishlab chiqarishni kengaytirish va texnologiyasini takomillashtirish Qoraqalpog‘iston mintaqasining rivojlanishi uchun ham muhim ahamiyatga ega.'));
  add(P('Ammiakli usulda soda ishlab chiqarish namakobni tozalash, uni ammiaklash, ammiaklangan namakobni karbonizatsiyalash, hosil bo‘lgan natriy bikarbonati suspenziyasini filtrlash, bikarbonatni kalsinatsiyalash va filtrlangan suyuqlikdan ammiakni regeneratsiya qilish bosqichlaridan iborat. Filtratsiya bo‘limi namakob tizimi (karbonizatsiya) bilan kalsinatsiya bo‘limi orasidagi bog‘lovchi bosqich bo‘lib, unda kristall NaHCO₃ ona suyuqlikdan ajratiladi va xlorid ionlaridan yuviladi. Filtrlangan bikarbonatning namligi kalsinatsiyaga sarflanadigan bug‘ miqdorini, yuvish sifati esa tayyor sodadagi NaCl miqdorini belgilaydi. Shuning uchun barabanli vakuum-filtrlarni to‘g‘ri hisoblash va tanlash butun ishlab chiqarishning texnik-iqtisodiy ko‘rsatkichlariga bevosita ta’sir etadi.'));
  add(P(`Ushbu kurs loyihasining maqsadi – unumdorligi ${f(c.G / 1000, 2)} t/soat kalsinatsiyalangan soda bo‘lgan ammiakli soda ishlab chiqarishning namakob tizimiga bog‘liq filtratsiya bo‘limini loyihalash va uning asosiy apparati – barabanli vakuum-filtrni hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['ammiakli soda ishlab chiqarish, NaHCO₃ kristallanishi va suspenziyalarni filtrlash jarayonlarining nazariy asoslarini tahlil qilish;',
    'namakob, oraliq mahsulotlar va sodaning fizik-kimyoviy xossalarini o‘rganish;',
    'soda ishlab chiqarish usullari va filtr turlarini solishtirib, maqbul variantni tanlash;',
    'namakob tizimi, filtratsiya va kalsinatsiya bosqichlarining moddiy va issiqlik balanslarini SI tizimida hisoblash;',
    'barabanli vakuum-filtrning filtrlash yuzasi, aylanish chastotasi, kek qalinligi, yuvish va vakuum tizimini hisoblash;',
    'asosiy jihozlar sonini aniqlash, ro‘yxatini va tahliliy nazorat sxemasini tuzish.']));
  add(P('Barcha hisoblar SI xalqaro birliklar tizimida bajarilgan: massa – kg, modda miqdori – mol (kmol), harorat – K, bosim – Pa, energiya – J (kJ), quvvat – W (kW), hajm – m³, vaqt – s. Oqimlar qulaylik uchun soatlik miqdorda ham keltirilgan va kg/s ga o‘tkazilgan. Yillik ish vaqti 8000 soat.'));

  // ============ 2
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. Ammiakli usulning kimyoviy asoslari'));
  add(P('Ammiakli usul NaCl va NH₄HCO₃ orasidagi almashinish reaksiyasiga asoslangan bo‘lib, bunda kamroq eriydigan natriy bikarbonati cho‘kmaga tushadi:'));
  add(F('NaCl + NH₃ + CO₂ + H₂O ⇄ NaHCO₃↓ + NH₄Cl', '2.1'));
  add(P('Jarayon bir necha bosqichda boradi. Namakob ammiak bilan to‘yintiriladi (ammiaklash), so‘ngra karbonizatsiya kolonnasida CO₂ bilan to‘yintiriladi:'));
  add(F('NH₃ + H₂O + CO₂ = NH₄HCO₃;   NH₄HCO₃ + NaCl ⇄ NaHCO₃ + NH₄Cl', '2.2'));
  add(P('Filtrlangan NaHCO₃ kalsinatsiya qilinadi, ajralgan CO₂ karbonizatsiyaga qaytariladi:'));
  add(F('2NaHCO₃ = Na₂CO₃ + CO₂ + H₂O;   ΔH°_{298} = +135,6 kJ (H₂O – gaz)', '2.3'));
  add(P('Filtr suyuqligidagi NH₄Cl dan ammiak ohak suti bilan regeneratsiya qilinadi:'));
  add(F('2NH₄Cl + Ca(OH)₂ = CaCl₂ + 2NH₃ + 2H₂O;   CaCO₃ = CaO + CO₂', '2.4'));
  add(P('Umumiy natijada osh tuzi va ohaktoshdan soda va kalsiy xlorid (chiqindi) olinadi: 2NaCl + CaCO₃ = Na₂CO₃ + CaCl₂. Ammiak jarayonda aylanadi va faqat yo‘qotishlar o‘rni to‘ldiriladi (1 t sodaga 2–4 kg).'));
  add(H2('2.2. Na⁺, NH₄⁺ ∥ Cl⁻, HCO₃⁻ – H₂O sistemasi'));
  add(P('(2.1) reaksiya qaytar bo‘lib, uning chuqurligi o‘zaro sistemadagi fazalar muvozanati bilan belgilanadi. Fedotyev tadqiqotlari bo‘yicha 303–305 K da NaHCO₃ ning maksimal chiqishi suyuq faza tarkibi P₁ nuqtaga (NaHCO₃, NH₄HCO₃ va NH₄Cl bilan birgalikda to‘yingan eritma) yaqin bo‘lganda erishiladi. Jarayonning samaradorligi natriy va ammiakdan foydalanish darajalari bilan baholanadi:'));
  add(F('U_{Na} = [NH₄Cl]/[Cl⁻]_{umumiy};   U_{NH₃} = [NH₄Cl]/[NH₃]_{umumiy}', '2.5'));
  add(P(`Nazariy jihatdan U_{Na} 84 % ga yetishi mumkin, amalda esa ammiaklangan namakobning suyultirilishi va kinetik cheklovlar tufayli 70–75 % ni tashkil etadi; loyihada U_{Na} = ${f(c.U * 100, 0)} % qabul qilingan. Demak, namakobdagi NaCl ning to‘rtdan bir qismdan ko‘prog‘i reaksiyaga kirishmay, filtr suyuqligi bilan chiqib ketadi va CaCl₂ bilan birga chiqindiga tashlanadi – bu usulning asosiy kamchiligi.`));
  add(H2('2.3. Natriy bikarbonatining kristallanishi'));
  add(P('NaHCO₃ karbonizatsiya kolonnasining o‘rta qismida eritma o‘ta to‘yinganda kristallana boshlaydi. Filtrlash uchun yirik va bir xil o‘lchamli (0,1–0,3 mm) kristallar olish muhim: mayda kristallar filtr to‘qimasini to‘sib qo‘yadi, kekning solishtirma qarshiligini va namligini oshiradi, yuvishni qiyinlashtiradi. Yirik kristallar olish uchun kolonnaning kristallanish zonasida harorat 333–335 K da ushlab turiladi (o‘ta to‘yinish sekin yo‘qoladi), so‘ngra suspenziya kolonnaning pastki qismidagi sovitgichlarda asta-sekin 301–303 K gacha sovitiladi. Kolonnada suspenziyaning bo‘lish vaqti 1,5–2 soat.'));
  add(H2('2.4. Suspenziyalarni filtrlash nazariyasi'));
  add(P('Filtrlash – suspenziyani g‘ovak to‘siq (filtr to‘qimasi) orqali bosimlar farqi ta’sirida o‘tkazib, qattiq fazani ushlab qolish jarayoni. Barabanli vakuum-filtrda bosimlar farqi baraban ichidagi siyraklanish hisobiga hosil qilinadi. Filtrlash tezligi Darsi qonuniga bo‘ysunadi:'));
  add(F('dV/(S·dτ) = ΔP/[μ·(R_{ch} + R_{f})]', '2.6'));
  add(P('bu yerda V – filtrat hajmi, m³; S – filtrlash yuzasi, m²; ΔP – bosimlar farqi, Pa; μ – filtratning dinamik qovushoqligi, Pa·s; R_{ch} = r₀·x₀·V/S – cho‘kma (kek) qarshiligi, m⁻¹; R_{f} – filtr to‘qimasi qarshiligi, m⁻¹; r₀ – kekning solishtirma hajmiy qarshiligi, m⁻²; x₀ – 1 m³ filtratga to‘g‘ri keladigan kek hajmi, m³/m³. O‘zgarmas bosimda integrallab, Rut tenglamasi olinadi:'));
  add(F('q² + 2q·q_{e} = K·τ;   K = 2ΔP/(μ·r₀·x₀);   q_{e} = R_{f}/(r₀·x₀)', '2.7'));
  add(P('bu yerda q = V/S – solishtirma filtrat hajmi, m³/m²; K – filtrlash konstantasi, m²/s; q_{e} – filtr to‘qimasiga ekvivalent filtrat hajmi, m³/m². NaHCO₃ keki kam siqiladigan (siqiluvchanlik ko‘rsatkichi s ≈ 0,1–0,2) kristall cho‘kma bo‘lgani uchun r₀ ni bosimga bog‘liq emas deb hisoblash mumkin.'));
  add(H2('2.5. Kekni yuvish va quritish'));
  add(P('Kek g‘ovaklaridagi ona suyuqlikda 70 kg/m³ NaCl va 165 kg/m³ NH₄Cl bo‘ladi. Agar u yuvilmasa, tayyor sodada NaCl miqdori 1,5–2 % gacha ko‘tariladi. Yuvish ona suyuqlikni toza suv bilan siqib chiqarish (porshenli siljitish) va diffuzion yuvish orqali boradi. Yuvish tezligi filtrlash oxiridagi tezlikka teng deb qabul qilinadi; yuvish suvi miqdori odatda 1 t sodaga 0,6–0,9 m³. Ortiqcha yuvish NaHCO₃ ning erishi hisobiga yo‘qotishlarni oshiradi (1 m³ suvda ≈ 0,06 kmol NaHCO₃ eriydi). Yuvishdan keyin kek orqali havo so‘rilib, namlik 16–20 % gacha kamaytiriladi, kek pichoq bilan olinadi; kekni yaxshi olish uchun pichoq oldida baraban ichiga siqilgan havo bilan qisqa puflash beriladi.'));
  add(H2('2.6. Filtrlash jarayoniga ta’sir etuvchi omillar'));
  add(P('Filtr unumdorligi va kek sifati quyidagilarga bog‘liq: bikarbonat kristallarining o‘lchami va shakli; suspenziya harorati (haroratning ko‘tarilishi filtrat qovushoqligini kamaytiradi, ammo NaHCO₃ eruvchanligini oshiradi, shuning uchun 301–305 K tanlanadi); vakuum chuqurligi (40–60 kPa); barabanning aylanish chastotasi (oshganda unumdorlik ortadi, kek yupqalashadi, namligi ortadi); suspenziyaning vannada aralashtirilishi (cho‘kib qolmasligi uchun); filtr to‘qimasining holati (vaqti-vaqti bilan bug‘ va issiq suv bilan yuviladi).'));

  add(H2('2.7. Namakobni tozalash'));
  add(P('Tabiiy namakob tarkibida kalsiy va magniy tuzlari (CaSO₄, MgCl₂, MgSO₄) bo‘ladi. Agar ular chiqarilmasa, ammiaklash va karbonizatsiyada Mg(OH)₂, MgCO₃·(NH₄)₂CO₃ va CaCO₃ cho‘kib, apparatlar va quvurlarni ifloslantiradi, bikarbonatni ifloslantiradi va filtrlashni yomonlashtiradi. Soda sanoatida asosan soda-ohak usuli qo‘llaniladi: magniy ohak suti bilan gidroksid holida, kalsiy esa soda bilan karbonat holida cho‘ktiriladi:'));
  add(F('MgCl₂ + Ca(OH)₂ = Mg(OH)₂↓ + CaCl₂', '2.8'));
  add(F('CaCl₂ + Na₂CO₃ = CaCO₃↓ + 2NaCl;   CaSO₄ + Na₂CO₃ = CaCO₃↓ + Na₂SO₄', '2.9'));
  add(P('Reagentlar stexiometrik miqdordan 5–10 % ortiq beriladi. Hosil bo‘lgan Mg(OH)₂ amorf, sekin cho‘kadigan cho‘kma bo‘lgani uchun reaktordan keyingi suspenziya Dorr tipidagi tindirgichlarda (bo‘lish vaqti 8–12 soat) koagulyant (poliakrilamid) qo‘shib tindiriladi. Tozalangan namakob tindirgichdan quyib olinadi, shlam esa shlam yig‘gichga tashlanadi. Tozalash darajasi Ca²⁺ va Mg²⁺ bo‘yicha 98–99 % ni tashkil etadi.'));
  add(H2('2.8. Filtratdan ammiakni regeneratsiyalash'));
  add(P('Filtrat (filtr suyuqligi) tarkibidagi erkin ammiak (NH₄HCO₃, (NH₄)₂CO₃) issiqlik ta’sirida oson ajraladi, bog‘langan ammiak (NH₄Cl) esa ohak suti bilan parchalanadi. Distillyatsiya ikki bosqichda olib boriladi: issiqlik distilleri (filtrat 343–363 K gacha isitiladi, erkin NH₃ va CO₂ ajraladi) va ohak suti bilan aralashtirgichdan keyin bug‘ bilan haydash kolonnasi (383–388 K). Distillyatsiyadan chiqqan suyuqlikda (distiller suyuqligi) CaCl₂ va reaksiyaga kirishmagan NaCl bo‘ladi; u shlam yig‘gichlarga tashlanadi yoki undan kalsiy xlorid ajratib olinadi. Filtrat hajmi va undagi suv miqdori distillyatsiyaga sarflanadigan bug‘ni belgilaydi, shuning uchun yuvish suvini haddan tashqari oshirish iqtisodiy jihatdan noqulay.'));
  add(H2('2.9. Filtrlangan bikarbonat tarkibiga ta’sir etuvchi omillar'));
  add(P('Nam bikarbonat tarkibida NaHCO₃ dan tashqari ona suyuqlik qoldig‘i (NaCl, NH₄Cl), ammoniy karbonat birikmalari (NH₄HCO₃, NH₂COONH₄) va suv bo‘ladi. Ammiak miqdori (0,6–1,0 % NH₃) kalsinatsiya gazi bilan qaytariladi, ammo kekdagi NH₄Cl kalsinatorda NaHCO₃ bilan reaksiyaga kirishib (NaHCO₃ + NH₄Cl = NaCl + NH₃ + CO₂ + H₂O), sodadagi NaCl miqdorini oshiradi va ammiak yo‘qotilishiga sabab bo‘ladi. Shuning uchun yuvish nafaqat NaCl ni, balki NH₄Cl ni ham kamaytirishi kerak. Kek namligi kristallar o‘lchamiga, vakuumga va quritish zonasining davomiyligiga bog‘liq; kristallar qanchalik yirik va bir xil bo‘lsa, kapillyar namlik shunchalik kam bo‘ladi.'));
  // ============ 3
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Namakob'));
  add(P(`Xomashyo – Barsakelmes koni tabiiy osh tuzi namakobi. U kalsiy va magniy ionlaridan (soda-ohak usuli bilan: Mg²⁺ + Ca(OH)₂ = Mg(OH)₂↓ + Ca²⁺; Ca²⁺ + Na₂CO₃ = CaCO₃↓ + 2Na⁺) tozalanadi, chunki ular karbonizatsiya kolonnalari va filtrlarda cho‘kma hosil qiladi. Tozalangan namakob tarkibi: NaCl – ${c.cBrine} kg/m³ (≥ 5,2 kmol/m³), Ca²⁺ + Mg²⁺ ≤ 0,02 kg/m³, SO₄²⁻ ≤ 5 kg/m³; zichligi ${c.rhoBrine} kg/m³.`));
  add(T('3.1', 'Osh tuzi va uning to‘yingan eritmasining xossalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['NaCl molyar massasi, kg/kmol', '58,44'], ['Kristall zichligi, kg/m³', '2165'], ['Suyuqlanish harorati, K', '1074'],
    ['Eruvchanligi (293 K), kg/100 kg suv', '35,9'], ['To‘yingan eritma (293 K): NaCl, kg/m³', '317'], ['To‘yingan eritma zichligi, kg/m³', '1200'],
    ['Namakob qovushoqligi (293 K), mPa·s', '1,93'], ['Namakob issiqlik sig‘imi, kJ/(kg·K)', '3,30'],
  ], [3, 1.4]));
  add(H2('3.2. Ammiak, uglerod dioksidi va ohak'));
  add(P('Ammiak jarayonda aylanadi; yo‘qotishlarni to‘ldirish uchun suyuq ammiak yoki ammiakli suv (25 %) beriladi. Karbonizatsiya uchun ikki xil gaz ishlatiladi: kalsinatsiya gazi (CO₂ 90–95 %) va ohak pechi gazi (CO₂ 38–42 %). Ohaktosh (CaCO₃ ≥ 95 %) ohak pechlarida 1273–1373 K da kuydiriladi; olingan CaO dan ohak suti tayyorlanib, distillyatsiyada ishlatiladi.'));
  add(H2('3.3. Natriy bikarbonati va oraliq mahsulotlar'));
  add(T('3.2', 'Asosiy moddalarning xossalari', ['Ko‘rsatkich', 'NaHCO₃', 'Na₂CO₃', 'NH₄Cl', 'NH₄HCO₃'], [
    ['Molyar massa, kg/kmol', '84,01', '105,99', '53,49', '79,06'], ['Zichlik, kg/m³', '2200', '2533', '1527', '1586'],
    ['Eruvchanlik (303 K), kg/100 kg suv', '11,1', '39,7', '41,4', '27,0'], ['ΔH°_{f,298}, kJ/mol', '–950,8', '–1130,7', '–314,4', '–849,4'],
    ['Issiqlik sig‘imi, kJ/(kg·K)', '1,05', '1,05', '1,57', '1,70'], ['Parchalanish harorati, K', '> 373', '1124 (suyuql.)', '611 (sublim.)', '> 309'],
  ], [2.2, 1, 1, 1, 1]));
  add(P(`Karbonizatsiya kolonnasidan chiqadigan suspenziya – qattiq faza (NaHCO₃ kristallari, ${f(c.xSolid * 100, 1)} % massa) va ona suyuqlikdan iborat. Ona suyuqlik tarkibi (kg/m³): NaCl – ${f(c.cML.NaCl, 1)}; NH₄Cl – ${f(c.cML.NH4Cl, 1)}; NH₄HCO₃ (erkin ammiak birikmalari) – ${f(c.cML.NH4HCO3, 1)}; erigan NaHCO₃ – ${f(c.cML.NaHCO3, 1)}; zichligi ${c.rhoML} kg/m³, qovushoqligi (303 K) ${f(c.mu * 1000, 2)} mPa·s.`));
  add(H2('3.4. Mahsulot – kalsinatsiyalangan soda'));
  add(T('3.3', 'Texnik kalsinatsiyalangan soda talablari (GOST 5100-85, A markasi)', ['Ko‘rsatkich', 'Me’yor'], [
    ['Na₂CO₃, % kam emas', '99,0'], ['Kuydirishdagi yo‘qotish (273–543 K), % ko‘p emas', '0,7'], ['NaCl, % ko‘p emas', '0,8'],
    ['Fe₂O₃, % ko‘p emas', '0,003'], ['Suvda erimaydigan moddalar, % ko‘p emas', '0,04'], ['Uyuma zichligi, kg/m³ (yengil / og‘ir soda)', '500–600 / 1000–1100'],
  ], [3, 1.5]));
  add(P(`Loyihada qabul qilingan mahsulot tarkibi: Na₂CO₃ – ${f(c.wSoda.Na2CO3 * 100, 1)} %, NaCl – ${f(c.wSoda.NaCl * 100, 1)} %, erimaydigan aralashmalar – ${f(c.wSoda.other * 100, 1)} %. Kalsinatsiyalangan soda – oq kukun, gigroskopik, havodan suv va CO₂ yutib, NaHCO₃ va kristallogidratlarga aylanadi, shuning uchun germetik qoplarda saqlanadi.`));

  add(H2('3.5. Filtr to‘qimalari'));
  add(T('3.4', 'Bikarbonat filtrlari uchun to‘qima materiallari', ['Ko‘rsatkich', 'Paxta', 'Lavsan (PET)', 'Polipropilen', 'Kapron (PA)'], [
    ['NH₄Cl eritmalariga chidamlilik', 'past', 'yuqori', 'yuqori', 'o‘rtacha'], ['Ishqoriy muhitga chidamlilik', 'o‘rtacha', 'o‘rtacha', 'yuqori', 'yuqori'],
    ['Maksimal ish harorati, K', '363', '403', '363', '373'], ['Mexanik mustahkamlik', 'past', 'yuqori', 'yuqori', 'yuqori'],
    ['Kek ajralishi', 'yomon', 'yaxshi', 'juda yaxshi', 'yaxshi'], ['Xizmat muddati, oy', '0,5–1', '2–3', '3–4', '2–3'],
  ], [2, 1, 1, 1.1, 1]));
  add(P('Polipropilen to‘qima eng uzoq xizmat qiladi va kek undan oson ajraladi, shuning uchun loyihada polipropilen mato qabul qilindi; bug‘ bilan regeneratsiya harorati 363 K dan oshmasligi kerak.'));
  // ============ 4
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. Soda ishlab chiqarish usullari'));
  add(T('4.1', 'Soda ishlab chiqarish usullarini solishtirish', ['Ko‘rsatkich', 'Ammiakli (Solve)', 'Tabiiy trona', 'Kombinatsiyalangan (Hou)', 'Nefelindan'], [
    ['Xomashyo', 'NaCl, CaCO₃', 'tabiiy soda', 'NaCl, NH₃, CO₂', 'nefelin'], ['Na dan foydalanish, %', '70–75', '95', '95–98', '–'],
    ['Qo‘shimcha mahsulot', 'CaCl₂ (chiqindi)', 'yo‘q', 'NH₄Cl (o‘g‘it)', 'Al₂O₃, potash, sement'], ['Energiya sarfi, GJ/t', '10–14', '5–7', '8–10', 'yuqori'],
    ['Mahalliy xomashyo mavjudligi', 'bor', 'yo‘q', 'bor', 'yo‘q'], ['Qo‘llanish', 'keng', 'AQSh, Turkiya', 'Xitoy', 'Rossiya'],
  ], [1.8, 1.2, 1.1, 1.3, 1.1]));
  add(P('O‘zbekistonda tabiiy soda konlari yo‘q, NH₄Cl ni o‘g‘it sifatida keng ishlatish an’anasi ham shakllanmagan, osh tuzi va ohaktosh esa yetarli. Shu sababli Qo‘ng‘irot soda zavodida ham qo‘llanilgan ammiakli (Solve) usuli tanlandi.'));
  add(H2('4.2. Bikarbonat suspenziyasini ajratish uchun filtr turlarini tanlash'));
  add(T('4.2', 'Ajratish apparatlarini solishtirish', ['Ko‘rsatkich', 'Barabanli vakuum-filtr', 'Lentali vakuum-filtr', 'Avtomatik sentrifuga', 'Diskli vakuum-filtr'], [
    ['Ish rejimi', 'uzluksiz', 'uzluksiz', 'uzluksiz', 'uzluksiz'], ['Kek namligi, %', '16–20', '14–18', '10–14', '18–22'],
    ['Yuvish sifati', 'yaxshi', 'juda yaxshi', 'o‘rtacha (kristallar sinadi)', 'yomon'], ['Solishtirma unumdorlik', 'yuqori', 'o‘rtacha', 'yuqori', 'yuqori'],
    ['Ammiak yo‘qotilishi (havo bilan)', 'o‘rtacha', 'yuqori', 'kam', 'o‘rtacha'], ['Ekspluatatsiya', 'oddiy, ishonchli', 'lenta tez yeyiladi', 'murakkab', 'oddiy'],
  ], [1.9, 1.3, 1.2, 1.3, 1.1]));
  add(P('Soda sanoatida bikarbonatni ajratish uchun tashqi filtrlash yuzali barabanli vakuum-filtrlar (БОУ tipidagi) an’anaviy ravishda ishlatiladi: ular uzluksiz ishlaydi, kekni yaxshi yuvadi, oddiy va ishonchli. Sentrifugalar kek namligini kamaytiradi, ammo kristallarni maydalab, yuvishni yomonlashtiradi. Shuning uchun loyihada barabanli vakuum-filtr БОУ 20-2,6 (filtrlash yuzasi 20 m², baraban diametri 2,6 m) tanlandi. Filtrdan so‘rilgan havo ammiakni ushlash uchun filtr gazini yuvish skrubberiga yuboriladi.'));

  add(T('4.3', 'Tashqi filtrlash yuzali barabanli vakuum-filtrlar (БОУ) tavsifi', ['Tipi', 'S, m²', 'D × L, m', 'n, ayl/min', 'Quvvat, kW', 'Massa, t'], [
    ['БОУ 5-1,75', '5', '1,75 × 0,9', '0,13–2,0', '1,1', '4,5'], ['БОУ 10-2,6', '10', '2,6 × 1,3', '0,13–2,0', '1,5', '7,8'],
    ['БОУ 20-2,6', '20', '2,6 × 2,6', '0,13–2,0', '1,5', '10,5'], ['БОУ 40-3', '40', '3,0 × 4,4', '0,1–1,6', '3,0', '19,0'],
  ], [1.4, 0.8, 1.2, 1.1, 1, 0.9]));
  add(P('Taxminiy hisob bo‘yicha zarur filtrlash yuzasi 15–20 m² (8-bo‘lim), shuning uchun bitta БОУ 20-2,6 filtri ishchi sifatida, bitta – zaxira sifatida (regeneratsiya va ta’mir uchun) qabul qilinadi.'));
  add(H2('4.3. Namakobni tozalash usullarini tanlash'));
  add(T('4.4', 'Namakobni tozalash usullarini solishtirish', ['Ko‘rsatkich', 'Soda-ohak', 'Soda-kaustik', 'Ammiak-karbonat (Shreyb)'], [
    ['Mg²⁺ ni cho‘ktiruvchi reagent', 'Ca(OH)₂', 'NaOH', 'NH₃ + CO₂ (gaz)'], ['Ca²⁺ ni cho‘ktiruvchi reagent', 'Na₂CO₃', 'Na₂CO₃', 'CO₂ + NH₃'],
    ['Reagentlar narxi', 'past', 'yuqori', 'past'], ['Tozalash darajasi, %', '98–99', '99', '95–97'],
    ['Cho‘kma xossalari', 'sekin cho‘kadi', 'sekin cho‘kadi', 'yaxshi cho‘kadi'], ['Qo‘llanish', 'keng', 'cheklangan', 'cheklangan'],
  ], [2, 1.2, 1.2, 1.5]));
  add(P('Soda-ohak usuli arzon va mahalliy reagentlardan (ohak – ishlab chiqarishning o‘zida olinadi, soda – mahsulot) foydalanadi, shuning uchun u loyihada qabul qilindi.'));
  // ============ 5
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Namakob tizimi va filtratsiya bo‘limining texnologik sxemasi 5.1-rasmda keltirilgan.'));
  add(IMG(path.join(FIG, 'sxema6.png'), 620, 360, '5.1-rasm. Ammiakli soda ishlab chiqarishning namakob tizimi va filtratsiya bo‘limi sxemasi',
    '1 – tozalangan namakob idishi; 2 – ammiaklash absorberi; 3 – karbonizatsiya kolonnasi; 4 – barabanli vakuum-filtr; 5 – vakuum-separator (filtrat yig‘gich); 6 – vakuum-nasos; 7 – filtrat idishi; 8 – filtrat nasosi; 9 – lentali konveyer; 10 – bug‘li kalsinator.'));
  add(P(`Tozalangan namakob (${f(c.Vbrine, 2)} m³/soat) idish 1 dan ammiaklash absorberi 2 ga beriladi va distillyatsiya bo‘limidan keladigan NH₃ va CO₂ bilan to‘yintiriladi. Ammiaklangan namakob karbonizatsiya kolonnasi 3 ning yuqori qismiga kiradi; kolonnaning pastki qismiga kalsinatsiya va ohak pechi gazlari beriladi. Kolonnada NaHCO₃ kristallanadi, suspenziya kolonnaning pastki sovitgichlarida 301–303 K gacha sovitiladi va o‘z oqimi bilan filtr vannasiga tushadi.`));
  add(P(`Barabanli vakuum-filtr 4 da suspenziya (${f(c.Vsusp, 1)} m³/soat) filtrlanadi. Baraban 0,5 ayl/min chastota bilan aylanadi; filtrlash zonasida yuzada ${f(c.hW * 1000, 0)} mm qalinlikdagi kek hosil bo‘ladi, yuvish zonasida u forsunkalar orqali ${c.Twash} K li suv bilan yuviladi, quritish zonasida havo so‘riladi. Kek pichoq bilan olinib, lentali konveyer 9 orqali bug‘li kalsinator 10 ga yuboriladi. Kalsinatorda 443–453 K da NaHCO₃ parchalanadi; olingan soda sovitilib omborga, kalsinatsiya gazi (CO₂, NH₃, H₂O) esa sovitilib, yuvilib, karbonizatsiyaga qaytariladi.`));
  add(P('Filtrat va havo baraban ichidan taqsimlash boshchasi orqali vakuum-separator 5 ga so‘riladi. Separatorda suyuqlik havodan ajratiladi va barometrik quvur orqali idish 7 ga tushadi, nasos 8 bilan distillyatsiya bo‘limiga (ammiakni regeneratsiyalash uchun) yuboriladi. Havo vakuum-nasos 6 orqali ammiakni ushlovchi skrubberga beriladi.'));
  add(P('Filtrni ishga tushirishda avval vakuum-nasos yoqilib, siyraklanish 40–50 kPa ga yetkaziladi, baraban aylantiriladi va vannaga suspenziya berila boshlaydi; sath belgilangan qiymatga yetgach, yuvish suvi beriladi. Filtrni to‘xtatishda suspenziya zaxira filtrga yo‘naltiriladi, vanna bo‘shatiladi, baraban va to‘qima issiq suv bilan yuviladi.'));
  add(T('5.1', 'Filtratsiya bo‘limining texnologik rejim normalari', ['Parametr', 'Me’yor'], [
    ['Suspenziya harorati, K', '301–305'], ['Suspenziyadagi qattiq faza, % (massa)', '17–20'], ['Vakuum (siyraklanish), kPa', '45–60'],
    ['Barabanning aylanish chastotasi, ayl/min', '0,3–1,0'], ['Kek qalinligi, mm', '12–20'], ['Yuvish suvi harorati, K', '308–318'],
    ['Yuvish suvi sarfi, m³/t soda', '0,6–0,9'], ['Kek namligi, % ko‘p emas', '20'], ['Kekda NaCl, % ko‘p emas', '0,4'], ['Filtratdagi qattiq faza, kg/m³ ko‘p emas', '1,0'],
  ], [3, 1.5]));

  // ============ 6
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`unumdorlik – kalsinatsiyalangan soda G = ${f(c.G, 0)} kg/soat = ${f(c.G / 3600, 3)} kg/s;`,
    `soda tarkibi: Na₂CO₃ – ${f(c.wSoda.Na2CO3 * 100, 1)} %, NaCl – ${f(c.wSoda.NaCl * 100, 1)} %, erimaydigan – ${f(c.wSoda.other * 100, 1)} %;`,
    `kalsinatsiyada chang bilan yo‘qotish ${f(c.lossCalc * 100, 1)} %; filtrda NaHCO₃ yo‘qotilishi ${f(c.lossFilt * 100, 1)} %;`,
    `filtrlangan kekda: NH₄HCO₃ – ${f(c.wNH4 * 100, 1)} %, suv – ${f(c.wW * 100, 1)} %;`,
    `natriydan foydalanish darajasi U_{Na} = ${f(c.U, 2)}; namakobda NaCl – ${c.cBrine} kg/m³;`,
    `ammiaklash va karbonizatsiyada suyuqlik hajmining ortish koeffitsiyenti ${f(c.kV, 2)}; yuvish suvi – ${f(c.wash, 2)} m³/t soda.`]));
  add(H2('6.2. Kalsinatsiya bo‘limi'));
  add(F(`n_{Na₂CO₃} = G·w/M = ${f(c.G, 0)}·${f(c.wSoda.Na2CO3, 3)}/105,99 = ${f(c.nSoda, 3)} kmol/soat`, '6.1'));
  add(F(`n_{NaHCO₃} = 2·n_{Na₂CO₃}/(1 – δ_{k}) = 2·${f(c.nSoda, 3)}/${f(1 - c.lossCalc, 3)} = ${f(c.nBic, 3)} kmol/soat (${f(c.mBic, 1)} kg/soat)`, '6.2'));
  add(P(`Sodadagi NaCl va erimaydigan aralashmalar kekdan o‘tadi: NaCl – ${f(c.mNaClCake, 2)} kg/soat, aralashmalar – ${f(c.mOtherCake, 2)} kg/soat. Nam kek massasi (NH₄HCO₃ va suv ulushlari ma’lum bo‘lganda):`));
  add(F(`m_{kek} = (m_{NaHCO₃} + m_{NaCl} + m_{ar})/(1 – ${f(c.wNH4, 2)} – ${f(c.wW, 2)}) = ${f(c.mCake, 1)} kg/soat`, '6.3'));
  add(T('6.1', 'Yuvilgan nam kekning (filtrlangan bikarbonatning) tarkibi', cH, compRows(c.cake), [2, 1, 1, 1]));
  add(P(`Kalsinatsiyada ajraladigan gazlar: CO₂ – ${f(c.calc.CO2, 1)} kg/soat; suv bug‘i – ${f(c.calc.H2O, 1)} kg/soat (kek namligi va reaksiya suvi); NH₃ – ${f(c.calc.NH3, 1)} kg/soat; chang bilan ${f(c.calc.dust, 1)} kg/soat soda ushlanib qaytariladi. 1 t sodaga ${f(perT(c.mCake) / 1000, 3)} t nam bikarbonat kerak bo‘ladi.`));
  {
    const mIn = c.mCake, mOut = c.G + c.calc.CO2 + c.calc.H2O + c.calc.NH3 + c.calc.dust;
    add(T('6.2', 'Kalsinatorning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Nam bikarbonat', f(mIn, 1), ks(mIn), 'Soda', f(c.G, 1), ks(c.G)], ['', '', '', 'CO₂', f(c.calc.CO2, 1), ks(c.calc.CO2)],
      ['', '', '', 'Suv bug‘i', f(c.calc.H2O, 1), ks(c.calc.H2O)], ['', '', '', 'NH₃', f(c.calc.NH3, 1), ks(c.calc.NH3)],
      ['', '', '', 'Chang (ushlanadi)', f(c.calc.dust, 1), ks(c.calc.dust)], B(['Jami', f(mIn, 1), ks(mIn), 'Jami', f(mOut, 1), ks(mOut)]),
    ], [1.6, 1, 0.9, 1.6, 1, 0.9]));
    add(P(`Farq ${f(Math.abs(mIn - mOut), 1)} kg/soat (${f(Math.abs(mIn - mOut) / mIn * 100, 2)} %) – NH₄HCO₃ parchalanishidagi massa yaxlitlashlari hisobiga.`));
  }
  {
    const nCO2 = c.calc.CO2 / M.CO2, nH2O = c.calc.H2O / M.H2O, nNH3 = c.calc.NH3 / M.NH3; const n = nCO2 + nH2O + nNH3;
    const dry = nCO2 + nNH3;
    add(T('6.3', 'Kalsinatsiya gazining tarkibi (kalsinatordan chiqishda)', ['Komponent', 'kmol/soat', 'kg/soat', 'Nam gazda, %', 'Quruq gazda, %'], [
      ['CO₂', f(nCO2, 2), f(c.calc.CO2, 1), f(nCO2 / n * 100, 1), f(nCO2 / dry * 100, 1)], ['H₂O', f(nH2O, 2), f(c.calc.H2O, 1), f(nH2O / n * 100, 1), '–'],
      ['NH₃', f(nNH3, 2), f(c.calc.NH3, 1), f(nNH3 / n * 100, 1), f(nNH3 / dry * 100, 1)], B(['Jami', f(n, 2), f(c.calc.CO2 + c.calc.H2O + c.calc.NH3, 1), '100,0', '100,0']),
    ], [1.2, 1, 1, 1, 1]));
    add(P(`Gaz sovitgich-kondensatorda 303–308 K gacha sovitiladi; kondensatda NH₃ va CO₂ eriydi (u distillyatsiyaga yuboriladi), quruq gaz (CO₂ ≈ ${f(nCO2 / dry * 100, 0)} %, havo so‘rilishi bilan 90–93 %) kompressor bilan karbonizatsiya kolonnalarining pastki qismiga beriladi. 1 t sodaga ${f(perT(nCO2 * 22.414), 0)} m³ CO₂ qaytariladi.`));
  }
  add(H2('6.3. Namakob tizimi va karbonizatsiya'));
  add(F(`n_{NaHCO₃}^{kr} = n_{NaHCO₃}/(1 – δ_{f}) = ${f(c.nBic, 3)}/${f(1 - c.lossFilt, 3)} = ${f(c.nBicCryst, 3)} kmol/soat`, '6.4'));
  add(F(`n_{NaCl} = n_{NaHCO₃}^{kr}/U_{Na} = ${f(c.nBicCryst, 3)}/${f(c.U, 2)} = ${f(c.nNaClFeed, 3)} kmol/soat (${f(c.nNaClFeed * M.NaCl, 0)} kg/soat)`, '6.5'));
  add(F(`V_{n} = m_{NaCl}/C_{NaCl} = ${f(c.nNaClFeed * M.NaCl, 0)}/${c.cBrine} = ${f(c.Vbrine, 2)} m³/soat (${f(c.Vbrine / 3600 * 1000, 2)} l/s)`, '6.6'));
  add(P(`Namakob massasi ${f(c.mBrine, 0)} kg/soat; 1 t sodaga ${f(perT(c.Vbrine), 2)} m³ namakob. Ammiaklash va karbonizatsiyadan keyin suyuqlik hajmi ${f(c.kV, 2)} marta ortadi: ona suyuqlik V = ${f(c.Vml, 2)} m³/soat. Uning tarkibi NaCl (reaksiyaga kirishmagan), NH₄Cl (hosil bo‘lgan) va qolgan komponentlar bo‘yicha hisoblandi.`));
  add(T('6.4', 'Karbonizatsiya kolonnasidan chiqadigan ona suyuqlik', ['Komponent', 'kg/soat', 'kg/s', 'kg/m³'], Object.keys(c.ml).map(k => [NM[k], f(c.ml[k], 1), ks(c.ml[k]), f(c.cML[k], 1)]).concat([B(['Jami', f(c.mML, 1), ks(c.mML), f(c.rhoML, 0)])]), [2, 1, 1, 1]));
  add(P(`Suspenziya: NaHCO₃ kristallari ${f(c.mCryst, 1)} kg/soat va aralashmalar ${f(c.mOtherCake, 1)} kg/soat, ona suyuqlik ${f(c.mML, 1)} kg/soat; jami ${f(c.mSusp, 1)} kg/soat (${ks(c.mSusp)} kg/s). Qattiq faza ulushi x = ${f(c.xSolid, 4)}; suspenziya zichligi ρ = 1/(x/ρ_{q} + (1 – x)/ρ_{s}) = ${f(c.rhoSusp, 0)} kg/m³; hajmiy sarfi ${f(c.Vsusp, 2)} m³/soat.`));
  {
    add(H2('6.4. Namakobni tozalash balansi'));
    const Ca = 1.20, Mg = 0.45; // kg/m3 xom namakobda
    const V = c.Vbrine; const nMg = Mg * V / 24.31, nCa = Ca * V / 40.08; const ex = 1.08;
    const mCaOH = nMg * 74.09 * ex, mSoda = (nCa + nMg) * 105.99 * ex; const mSl = nMg * 58.32 + (nCa + nMg) * 100.09; const slW = mSl / 0.25;
    add(P(`Xom namakobda Ca²⁺ – ${f(Ca, 2)} kg/m³, Mg²⁺ – ${f(Mg, 2)} kg/m³ deb qabul qilinadi. ${f(V, 2)} m³/soat namakobda: Mg²⁺ ${f(nMg, 3)} kmol/soat, Ca²⁺ ${f(nCa, 3)} kmol/soat. (2.8) reaksiya bo‘yicha Mg²⁺ dan ekvivalent miqdorda Ca²⁺ hosil bo‘lishini hisobga olib, 8 % ortiqcha bilan reagentlar sarfi:`));
    add(F(`m_{Ca(OH)₂} = ${f(nMg, 3)}·74,09·1,08 = ${f(mCaOH, 1)} kg/soat;   m_{Na₂CO₃} = (${f(nCa, 3)} + ${f(nMg, 3)})·105,99·1,08 = ${f(mSoda, 1)} kg/soat`, '6.8'));
    add(P(`Hosil bo‘ladigan cho‘kma (Mg(OH)₂ + CaCO₃) ${f(mSl, 1)} kg/soat; 25 % qattiq fazali shlam ko‘rinishida ${f(slW, 0)} kg/soat chiqariladi va shlam yig‘gichga yuboriladi. Tozalashga sarflanadigan soda – mahsulotning ${f(mSoda / c.G * 100, 2)} % i. Tindirgich maydoni (tindirish tezligi 0,6 m³/(m²·soat)) ${f(V / 0.6, 0)} m² → D = ${f(Math.sqrt(4 * V / 0.6 / Math.PI), 1)} m li bitta Dorr tindirgichi.`));
    add(T('6.5', 'Namakobni tozalash bo‘limining moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Xom namakob', f(c.mBrine + slW * 0.75 - mCaOH * 0, 0), ks(c.mBrine + slW * 0.75), 'Tozalangan namakob', f(c.mBrine, 0), ks(c.mBrine)],
      ['Ohak suti (Ca(OH)₂ hisobida)', f(mCaOH, 1), ks(mCaOH), 'Shlam (25 %)', f(slW, 0), ks(slW)],
      ['Soda eritmasi (Na₂CO₃ hisobida)', f(mSoda, 1), ks(mSoda), '', '', ''],
    ], [1.9, 1, 0.9, 1.7, 1, 0.9]));
    add(P('Izoh: balansda reagentlar quruq modda hisobida ko‘rsatilgan; ularni eritish suvi xom namakob tarkibidagi suv bilan birga hisobga olingan.', { size: 24 }));
  }
  add(H2('6.5. Filtrning moddiy balansi'));
  add(P(`Yuvish suvi sarfi V_{yu} = ${f(c.wash, 2)}·${f(c.G / 1000, 2)} = ${f(c.Vwash, 3)} m³/soat (${f(c.mWash, 0)} kg/soat). Filtrat – suspenziya suyuqligi va yuvish suvidan kek bilan chiqib ketgan suyuqlik ayirilgan qism, shuningdek, filtr to‘qimasidan o‘tgan va erigan NaHCO₃:`));
  add(F(`m_{f} = m_{sus} + m_{yu} – m_{kek} = ${f(c.mSusp, 0)} + ${f(c.mWash, 0)} – ${f(c.mCake, 0)} = ${f(c.mFiltrate, 0)} kg/soat`, '6.7'));
  add(T('6.6', 'Filtratning tarkibi', cH, compRows(c.filt), [2, 1, 1, 1]));
  add(P(`Filtrat hajmi (ρ = ${c.rhoF} kg/m³) ${f(c.Vfiltrate, 2)} m³/soat; 1 t sodaga ${f(perT(c.Vfiltrate), 2)} m³. Filtrat distillyatsiya bo‘limiga yuboriladi. Yuvish natijasida kek suyuqligidagi NaCl ning ${f(c.washEff * 100, 1)} % i chiqarib yuborilgan.`));
  {
    const mIn = c.mSusp + c.mWash, mOut = c.mCake + c.mFiltrate;
    add(T('6.7', 'Barabanli vakuum-filtrning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Suspenziya:', f(c.mSusp, 1), ks(c.mSusp), 'Nam kek (bikarbonat)', f(c.mCake, 1), ks(c.mCake)],
      ['– NaHCO₃ kristallari', f(c.mCryst, 1), ks(c.mCryst), 'Filtrat', f(c.mFiltrate, 1), ks(c.mFiltrate)],
      ['– ona suyuqlik', f(c.mML, 1), ks(c.mML), '', '', ''], ['– aralashmalar', f(c.mOtherCake, 1), ks(c.mOtherCake), '', '', ''],
      ['Yuvish suvi', f(c.mWash, 1), ks(c.mWash), '', '', ''],
      B(['Jami', f(mIn, 1), ks(mIn), 'Jami', f(mOut, 1), ks(mOut)]),
    ], [1.7, 1, 0.9, 1.7, 1, 0.9]));
  }
  add(H2('6.6. Komponentlar bo‘yicha balans va sarf koeffitsiyentlari'));
  add(T('6.8', 'Natriy va xlor balansi (kmol/soat)', ['Yo‘nalish', 'Na', 'Cl'], [
    ['Namakob bilan keladi', f(c.nNaClFeed, 2), f(c.nNaClFeed, 2)],
    ['Kek (NaHCO₃ + NaCl) bilan', f(c.nBic + c.mNaClCake / M.NaCl, 2), f(c.mNaClCake / M.NaCl, 2)],
    ['Filtrat bilan (NaCl, NaHCO₃, NH₄Cl)', f(c.filt.NaCl / M.NaCl + c.filt.NaHCO3 / M.NaHCO3, 2), f(c.filt.NaCl / M.NaCl + c.filt.NH4Cl / M.NH4Cl, 2)],
    B(['Jami chiqish', f(c.nBic + c.mNaClCake / M.NaCl + c.filt.NaCl / M.NaCl + c.filt.NaHCO3 / M.NaHCO3, 2), f(c.mNaClCake / M.NaCl + c.filt.NaCl / M.NaCl + c.filt.NH4Cl / M.NH4Cl, 2)]),
  ], [2.6, 1, 1]));
  add(P(`Sarf koeffitsiyentlari (1 t sodaga): namakob – ${f(perT(c.Vbrine), 2)} m³ (NaCl ${f(perT(c.nNaClFeed * M.NaCl) / 1000, 3)} t; nazariy 1,103 t); nam bikarbonat – ${f(perT(c.mCake) / 1000, 3)} t; yuvish suvi – ${f(c.wash, 2)} m³; filtrat – ${f(perT(c.Vfiltrate), 2)} m³. Yillik ishlab chiqarish (8000 soat) – ${f(c.G * 8 / 1000, 1)} ming t soda.`));

  // ============ 7
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Barabanli vakuum-filtrning issiqlik balansi'));
  add(P('Filtrda kimyoviy reaksiyalar bormaydi, issiqlik balansi oqimlarning fizik issiqligi, so‘rilgan havo bilan bug‘langan suv va atrof-muhitga yo‘qotishlardan iborat (273,15 K ga nisbatan):'));
  add(F('Q_{sus} + Q_{yu} + Q_{h} = Q_{kek} + Q_{f} + Q_{h}′ + Q_{bug‘} + Q_{yo‘q}', '7.1'));
  add(F(`Q_{sus} = m_{sus}·c_{sus}·(T – T₀)/3600 = ${f(c.mSusp, 0)}·${f(c.cpSusp, 2)}·${f(c.Tsusp - c.T0, 0)}/3600 = ${f(c.Q1, 1)} kW`, '7.2'));
  add(F(`Q_{yu} = ${f(c.mWash, 0)}·${f(c.cpWash, 2)}·${f(c.Twash - c.T0, 0)}/3600 = ${f(c.Q2, 1)} kW;   Q_{h} = ${f(c.Q3, 2)} kW`, '7.3'));
  add(P(`So‘rilgan havo miqdori (8-bo‘lim) ${f(c.mAir, 0)} kg/soat; u filtrda namlanib, har kg havoga 0,012 kg suv bug‘latadi: W = ${f(c.Wev, 1)} kg/soat, bug‘lanish issiqligi Q_{bug‘} = W·2430/3600 = ${f(c.Qev, 2)} kW. Yo‘qotishlar kirimning ${f(c.lossQ * 100, 0)} % i. Chiqish oqimlarining umumiy harorati balans tenglamasidan topiladi:`));
  add(F(`T = T₀ + (Q_{kir}·0,98 – Q_{bug‘})·3600/(m_{kek}c_{kek} + m_{f}c_{f} + m_{h}c_{h}) = ${f(c.Tout, 1)} K`, '7.4'));
  {
    const qin = c.Qin, ql = qin * c.lossQ;
    add(T('7.1', 'Filtrning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Suspenziya bilan', f(c.Q1, 1), f(c.Q1 / qin * 100, 1), 'Kek bilan', f(c.Qcake, 1), f(c.Qcake / qin * 100, 1)],
      ['Yuvish suvi bilan', f(c.Q2, 1), f(c.Q2 / qin * 100, 1), 'Filtrat bilan', f(c.Qfilt, 1), f(c.Qfilt / qin * 100, 1)],
      ['Havo bilan', f(c.Q3, 2), f(c.Q3 / qin * 100, 2), 'Havo bilan', f(c.QairOut, 2), f(c.QairOut / qin * 100, 2)],
      ['', '', '', 'Suv bug‘lanishiga', f(c.Qev, 2), f(c.Qev / qin * 100, 2)], ['', '', '', 'Yo‘qotishlar', f(ql, 1), f(c.lossQ * 100, 1)],
      B(['Jami', f(qin, 1), '100', 'Jami', f(c.Qcake + c.Qfilt + c.QairOut + c.Qev + ql, 1), '100']),
    ], [1.7, 0.8, 0.6, 1.7, 0.8, 0.6]));
  }
  add(P(`Kek va filtrat filtrdan ${f(c.Tout, 1)} K da chiqadi, ya’ni yuvish suvi suspenziyani ${f(c.Tout - c.Tsusp, 1)} K ga isitadi. Bu NaHCO₃ ning eruvchanligini sezilarli oshirmaydi, shu bilan birga filtrat qovushoqligini biroz kamaytiradi.`));
  {
    add(H2('7.2. Karbonizatsiya kolonnasining issiqlik balansi'));
    const dHr = 83.6; const Qr = c.nBicCryst * dHr / 3.6;
    const mL = c.Vbrine * c.rhoBrine * 1.22; const Qph = mL * 3.2 * (335 - 303) / 3600;
    const Qc = Qr * 0.9; const Gw = Qc / (4.19 * 10) * 3600;
    add(P(`Karbonizatsiya reaksiyasi (2.1) issiqligi hosil bo‘lish entalpiyalari bo‘yicha (NaCl (eritma) –407,3; NH₃ (eritma) –80,3; CO₂ (g) –393,5; H₂O (s) –285,8; NaHCO₃ (q) –950,8; NH₄Cl (eritma) –299,7 kJ/mol): ΔH = (–950,8 – 299,7) – (–407,3 – 80,3 – 393,5 – 285,8) = –83,6 kJ/mol NaHCO₃. Kolonnada ajraladigan issiqlik Q_{r} = ${f(c.nBicCryst, 2)}·83,6/3,6 = ${f(Qr, 0)} kW.`));
    add(P(`Bu issiqlikning bir qismi suyuqlikni kristallanish zonasida 335 K gacha qizdirishga ketadi (≈ ${f(Qph, 0)} kW), so‘ngra kolonnaning pastki qismidagi quvurli sovitgichlarda suspenziya 301–303 K gacha sovitiladi. Gaz bilan chiqib ketadigan va yo‘qotiladigan issiqlikni 10 % deb olsak, sovitgichlar bilan olib chiqiladigan issiqlik ${f(Qc, 0)} kW; sovituvchi suv (293 → 303 K) sarfi ${f(Gw / 1000, 1)} t/soat. Suspenziya harorati filtrlash rejimini belgilaydi: sovitish yetarli bo‘lmasa, NaHCO₃ ning eruvchanligi ortib, kristallar chiqishi kamayadi va filtrat bilan yo‘qotishlar ko‘payadi.`));
  }
  add(H2('7.3. Yuvish suvini isitish'));
  {
    const Q = c.mWash * 4.19 * (c.Twash - 288.15) / 3600; const G = Q * 3600 / 2133;
    add(P(`Yuvish suvi (bug‘ kondensati yoki tozalangan suv) 288 K dan ${c.Twash} K gacha 0,4 MPa li bug‘ bilan isitiladi: Q = m·c·ΔT = ${f(c.mWash, 0)}·4,19·${f(c.Twash - 288.15, 0)}/3600 = ${f(Q, 1)} kW; bug‘ sarfi G = Q·3600/r = ${f(G, 0)} kg/soat (r = 2133 kJ/kg). Isitgich – qobiq-quvurli, K = 1200 W/(m²·K), Δt_{o‘r} ≈ 120 K, F = ${f(Q * 1000 / (1200 * 120), 2)} m².`));
  }
  add(H2('7.4. Kalsinatorning issiqlik sarfi'));
  {
    const q1 = c.nBic / 2 * 135.6 / 3.6, q2 = c.cake.H2O / M.H2O * 44.0 / 3.6, q3 = c.cake.NH4HCO3 / M.NH4HCO3 * 167.0 / 3.6;
    const q4 = c.G * 1.05 * (443 - 303) / 3600, q5 = (c.calc.CO2 * 0.92 + c.calc.H2O * 1.95 + c.calc.NH3 * 2.2) * (383 - 303) / 3600;
    add(P('Kalsinatsiyalash uchun zarur issiqlik quyidagilardan iborat: NaHCO₃ ning (2.3) reaksiya bo‘yicha parchalanishi (135,6 kJ/mol Na₂CO₃); kek namligining bug‘lanishi (44,0 kJ/mol); NH₄HCO₃ ning parchalanishi (167 kJ/mol); sodani 443 K gacha va gazlarni 383 K gacha isitish.'));
    add(T('7.2', 'Kalsinatorning issiqlik sarfi', ['Issiqlik iste’moli', 'kW', '%'], [
      ['NaHCO₃ parchalanishi', f(q1, 1), f(q1 / c.Qcalc * 100, 1)], ['Kek namligining bug‘lanishi', f(q2, 1), f(q2 / c.Qcalc * 100, 1)],
      ['NH₄HCO₃ parchalanishi', f(q3, 1), f(q3 / c.Qcalc * 100, 1)], ['Sodani isitish', f(q4, 1), f(q4 / c.Qcalc * 100, 1)],
      ['Gazlarni isitish', f(q5, 1), f(q5 / c.Qcalc * 100, 1)], B(['Jami foydali issiqlik', f(c.Qcalc, 1), '100']),
    ], [2.5, 1, 1]));
    add(P(`Kalsinatorning issiqlik FIK η = ${f(c.etaCalc, 2)} bo‘lganda umumiy issiqlik sarfi ${f(c.QcalcTot, 0)} kW; 3 MPa li bug‘ sarfi (kondensat sovishi bilan foydali issiqlik 1580 kJ/kg) ${f(c.steamCalc / 1000, 2)} t/soat, ya’ni 1 t sodaga ${f(c.steamCalc / c.G, 2)} t bug‘. Bu qiymat bevosita kek namligiga bog‘liq: namlikning 1 % ga kamayishi bug‘ sarfini taxminan 2 % ga kamaytiradi – filtrlash sifatining ahamiyati shundan iborat.`));
  }

  // ============ 8
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(P('Asosiy apparat – tashqi filtrlash yuzali barabanli vakuum-filtr (8.1-rasm). U vannaga qisman botirilgan, sekin aylanuvchi gorizontal baraban, filtr to‘qimasi bilan qoplangan seksiyali sirt, taqsimlash boshchasi, yuvish forsunkalari, kek olish pichog‘i va vannadagi aralashtirgichdan iborat.'));
  add(IMG(path.join(FIG, 'filtr6.png'), 380, 308, '8.1-rasm. Barabanli vakuum-filtrning zonalar sxemasi'));
  add(H2('8.1. Dastlabki ma’lumotlar va filtrlash konstantalari'));
  add(P(`Filtrlash zonasida ajraladigan ona suyuqlik (kek tarkibida qolgan suyuqlik ayirilgan) V_{f} = ${f(c.Vml_filt, 2)} m³/soat (${e(c.Vml_filt / 3600, 3)} m³/s). Yuvilmagan kek hajmi V_{kek} = m_{kek}/ρ_{kek} = ${f(c.mCake, 0)}/${c.rhoCake} = ${f(c.Vcake, 2)} m³/soat. 1 m³ filtratga to‘g‘ri keladigan kek hajmi:`));
  add(F(`x₀ = V_{kek}/V_{f} = ${f(c.Vcake, 2)}/${f(c.Vml_filt, 2)} = ${f(c.x0, 4)} m³/m³`, '8.1'));
  add(P(`Siyraklanish ΔP = ${f(c.dP / 1000, 0)} kPa; filtrat qovushoqligi μ = ${e(c.mu, 2)} Pa·s; NaHCO₃ kekining solishtirma hajmiy qarshiligi r₀ = ${e(c.r0, 1)} m⁻² va filtr to‘qimasining qarshiligi R_{f} = ${e(c.Rf, 1)} m⁻¹ (laboratoriya va sanoat ma’lumotlari asosida [10, 11]):`));
  add(F(`K = 2ΔP/(μ·r₀·x₀) = 2·${f(c.dP, 0)}/(${e(c.mu, 2)}·${e(c.r0, 1)}·${f(c.x0, 4)}) = ${e(c.Kf, 3)} m²/s`, '8.2'));
  add(F(`q_{e} = R_{f}/(r₀·x₀) = ${e(c.Rf, 1)}/(${e(c.r0, 1)}·${f(c.x0, 4)}) = ${f(c.qe * 1000, 2)}·10⁻³ m³/m²`, '8.3'));
  add(H2('8.2. Baraban zonalari va aylanish chastotasi'));
  add(P(`Baraban yuzasi quyidagi zonalarga bo‘linadi (burchaklar): filtrlash φ₁ = ${c.ang.filt}°, yuvish φ₂ = ${c.ang.wash}°, quritish φ₃ = ${c.ang.dry}°, kekni olish φ₄ = ${c.ang.disch}°, o‘lik (oraliq) zonalar φ₅ = ${c.ang.dead}°. Barabanning aylanish chastotasi n (s⁻¹) bo‘lganda filtrlash vaqti τ_{f} = φ₁/(360·n). Bir aylanishda 1 m² yuzadan olinadigan filtrat (2.7) dan:`));
  add(F('q = –q_{e} + (q_{e}² + K·τ_{f})^{0,5}', '8.4'));
  add(P('Filtrning unumdorligi (filtrat bo‘yicha) va zarur yuza:'));
  add(F('V_{f} = q·n·S   ⇒   S = V_{f}/(q·n)', '8.5'));
  add(T('8.1', 'Aylanish chastotasining filtr ko‘rsatkichlariga ta’siri', ['n, ayl/min', 'τ_{f}, s', 'q, l/m²', 'Kek qalinligi h, mm', 'Unumdorlik, m³/(m²·soat)', 'Zarur yuza S, m²'],
    c.nTable.map(r => [f(r.rpm, 1), f(r.tf, 1), f(r.q * 1000, 1), f(r.h * 1000, 1), f(r.prod, 2), f(r.F, 1)]), [0.9, 0.8, 0.8, 1.1, 1.3, 1.1]));
  add(P(`Aylanish chastotasi ortishi bilan solishtirma unumdorlik oshadi, ammo kek yupqalashadi: 6–8 mm dan yupqa kekni pichoq bilan olish qiyin va u namroq bo‘ladi. Standart БОУ 20-2,6 filtri (S = ${c.Fst} m²) uchun ish chastotasi n = 0,5 ayl/min (${e(c.nW, 2)} s⁻¹) qabul qilinadi:`));
  add(F(`τ_{f} = ${c.ang.filt}/(360·${e(c.nW, 2)}) = ${f(c.tfW, 1)} s;   q = ${f(c.qW * 1000, 1)}·10⁻³ m³/m²;   h = q·x₀ = ${f(c.hW * 1000, 1)} mm`, '8.6'));
  add(F(`S_{talab} = V_{f}/(q·n) = ${e(c.Vml_filt / 3600, 3)}/(${f(c.qW, 4)}·${e(c.nW, 2)}) = ${f(c.FW, 1)} m²`, '8.7'));
  add(P(`Bitta filtrning yuklanish koeffitsiyenti S_{talab}/S = ${f(c.loadW, 2)}. Kek qalinligi ${f(c.hW * 1000, 0)} mm tavsiya etilgan 12–20 mm oralig‘ida. Barabanning chiziqli tezligi v = π·D·n = 3,1416·${f(c.Dd, 1)}·${e(c.nW, 2)} = ${f(Math.PI * c.Dd * c.nW, 4)} m/s.`));
  add(IMG(path.join(FIG, 'chart6.png'), 430, 262, '8.2-rasm. Filtrlash egri chizig‘i (Rut tenglamasi bo‘yicha)'));
  add(H2('8.3. Yuvish zonasini tekshirish'));
  add(P('Yuvish tezligi filtrlash oxiridagi tezlikka teng deb qabul qilinadi:'));
  add(F(`w_{yu} = (dq/dτ)_{oxir} = K/(2(q + q_{e})) = ${e(c.Kf, 3)}/(2·(${f(c.qW, 4)} + ${f(c.qe, 4)})) = ${e(c.rateEndW, 3)} m³/(m²·s)`, '8.8'));
  add(P(`Bir aylanishda 1 m² yuzaga beriladigan yuvish suvi q_{yu} = V_{yu}/(S·n·3600) = ${f(c.qWashW * 1000, 2)} l/m². Zarur yuvish vaqti τ_{yu} = q_{yu}/w_{yu} = ${f(c.tWashNeedW, 1)} s; yuvish zonasining mavjud vaqti φ₂/(360·n) = ${f(c.tWashAvailW, 1)} s. τ_{yu} < τ_{mav} – yuvish zonasi yetarli, qolgan vaqtda kek qisman quritiladi. Yuvish suvining kek g‘ovaklari hajmiga nisbati ${f(c.qWashW / (c.hW * 0.4), 2)} (g‘ovaklik 0,4), ya’ni ona suyuqlik deyarli to‘liq siqib chiqariladi.`));
  add(H2('8.4. Quritish zonasi va vakuum tizimi'));
  add(P(`Quritish zonasida kek orqali havo so‘rilib, namlik ${f(c.wW * 100, 0)} % gacha kamayadi. Bikarbonat filtrlari uchun havo sarfi vakuum ostida 1,0–1,5 m³/(m²·min); ${f(c.airSpec, 1)} m³/(m²·min) qabul qilinadi:`));
  add(F(`V_{h} = ${f(c.airSpec, 1)}·${c.Fst}/60 = ${f(c.Vair, 3)} m³/s (${f(c.Vair * 60, 1)} m³/min) – 45 kPa absolyut bosimda`, '8.9'));
  {
    const Vatm = c.Vair * 45 / 101.3; const N = c.Vair * Math.log(101.3 / 45) * 45e3 / 0.5 / 1000;
    const Dsep = Math.sqrt(4 * c.Vair / (Math.PI * 1.2));
    add(P(`Atmosfera bosimiga keltirilgan havo sarfi ${f(Vatm * 60, 1)} m³/min. Suv halqali vakuum-nasos (izotermik siqish, FIK 0,5) quvvati N = V·P₁·ln(P₂/P₁)/η = ${f(c.Vair, 3)}·45 000·ln(101,3/45)/0,5 = ${f(N, 1)} kW; ВВН-25 tipidagi nasos (25 m³/min, 37 kW) qabul qilinadi. Vakuum-separator diametri havo tezligi 1,2 m/s bo‘yicha D = ${f(Dsep, 2)} m → 0,8 m, balandligi 2,0 m; filtrat barometrik quvur (balandligi ≥ 10 m) orqali idishga tushadi.`));
  }
  add(H2('8.5. Baraban yuritmasi, vanna va aralashtirgich'));
  {
    const mCakeOn = c.hW * c.rhoCake * Math.PI * c.Dd * c.Ld * 0.5; const Mfr = (mCakeOn * 9.81) * 0.3 * c.Dd / 2; const w = 2 * Math.PI * c.nW;
    add(P(`Baraban sirtidagi kek massasi (sirtning yarmida) ≈ ${f(mCakeOn, 0)} kg. Kekning og‘irlik momenti, vanna suspenziyasidagi qarshilik, pichoq va taqsimlash boshchasidagi ishqalanishni hisobga olgan holda (ishqalanish koeffitsiyenti 0,3) moment M ≈ ${f(Mfr, 0)} N·m, quvvat N = M·ω/η = ${f(Mfr * w / 0.5, 0)} W (η = 0,5). Tezlikni rostlash va ishga tushirish zaxirasi bilan 1,5 kW li motor-reduktor qabul qilinadi. Vannada suspenziya kristallari cho‘kmasligi uchun tebranuvchi aralashtirgich (0,25 s⁻¹, 0,75 kW) o‘rnatiladi; vannadagi suspenziya sathi barabanning ${f(c.ang.filt / 360 * 100, 0)} % ini botirish uchun ushlab turiladi.`));
  }
  add(P(`Taqsimlash boshchasi baraban seksiyalarini navbat bilan filtrlash (filtrat liniyasi), yuvish (yuvish filtrati liniyasi), quritish (havo liniyasi) va kekni olish (siqilgan havo bilan puflash) zonalariga ulaydi. Baraban sirti 24 ta seksiyaga bo‘lingan; har bir seksiya taqsimlash boshchasiga alohida quvur bilan ulanadi. Seksiyadan chiqadigan filtrat va havo aralashmasining tezligi 15–20 m/s dan oshmasligi kerak: bir vaqtda filtrlash zonasida ${f(24 * c.ang.filt / 360, 0)} ta seksiya bo‘lganda bitta seksiyadan o‘tadigan filtrat ${f(c.Vml_filt / 3600 / (24 * c.ang.filt / 360) * 1000, 2)} l/s, quvur diametri 50 mm bilan tezlik ${f(c.Vml_filt / 3600 / (24 * c.ang.filt / 360) / (Math.PI * 0.05 ** 2 / 4), 2)} m/s – ruxsat etilgan chegarada.`));
  add(H2('8.6. Filtr to‘qimasi va ishlash sikli'));
  add(P('Filtr to‘qimasi sifatida polipropilen yoki lavsan (poliefir) mato ishlatiladi (havo o‘tkazuvchanligi 200–400 dm³/(m²·s) 49 Pa da); u NH₄Cl va ammiak eritmalariga chidamli. Kristallar to‘qima g‘ovaklarini asta-sekin to‘sgani sababli filtr har 24–48 soatda to‘xtatilib, 343–353 K li suv yoki bug‘ bilan yuviladi (regeneratsiya), shu vaqtda zaxira filtr ishga tushiriladi. Mato 2–3 oyda almashtiriladi.'));
  {
    add(H2('8.7. Vakuum va kek qarshiligining filtr unumdorligiga ta’siri'));
    const qOf = (K, qe, tf) => -qe + Math.sqrt(qe * qe + K * tf);
    const rows1 = [30e3, 40e3, 55e3, 65e3, 75e3].map(dp => { const K = 2 * dp / (c.mu * c.r0 * c.x0); const q = qOf(K, c.qe, c.tfW); return [f(dp / 1000, 0), e(K, 2), f(q * 1000, 1), f(q * c.x0 * 1000, 1), f(c.Vml_filt / 3600 / (q * c.nW), 1)]; });
    add(T('8.2', 'Siyraklanishning filtr ko‘rsatkichlariga ta’siri (n = 0,5 ayl/min)', ['ΔP, kPa', 'K, m²/s', 'q, l/m²', 'h, mm', 'S_{talab}, m²'], rows1, [1, 1.1, 1, 1, 1.1]));
    add(P('Siyraklanishni oshirish unumdorlikni ΔP^{0,5} ga proporsional ravishda oshiradi, lekin vakuum-nasos quvvati va havo bilan ammiak yo‘qotilishi ortadi; bundan tashqari, 70 kPa dan yuqori siyraklanishda filtrat 303 K da qaynay boshlaydi (NH₃ va CO₂ desorbsiyasi). Shuning uchun 50–60 kPa maqbul hisoblanadi.'));
    const rows2 = [[0.05, 6.0e12], [0.10, 3.5e12], [0.15, 2.0e12], [0.25, 8.0e11]].map(([d, r]) => { const K = 2 * c.dP / (c.mu * r * c.x0); const qe = c.Rf / (r * c.x0); const q = qOf(K, qe, c.tfW); return [f(d, 2), e(r, 1), e(K, 2), f(q * 1000, 1), f(c.Vml_filt / 3600 / (q * c.nW), 1)]; });
    add(T('8.3', 'Kristallar o‘lchamining (kek solishtirma qarshiligining) ta’siri', ['Kristall o‘lchami, mm', 'r₀, m⁻²', 'K, m²/s', 'q, l/m²', 'S_{talab}, m²'], rows2, [1.2, 1, 1, 1, 1]));
    add(P('Jadvaldan ko‘rinadiki, kristallar maydalashganda (kek qarshiligi ortganda) zarur filtrlash yuzasi keskin ortadi. Shuning uchun karbonizatsiya kolonnasida kristallanish rejimini (harorat profili, sovitish tezligi) to‘g‘ri saqlash filtratsiya bo‘limi ishining asosiy sharti hisoblanadi; loyihada qabul qilingan r₀ = 2·10¹² m⁻² o‘rtacha o‘lchami ≈ 0,15 mm bo‘lgan kristallarga mos keladi.'));
    {
    add(H2('8.8. Filtr to‘qimasining ifloslanishi va regeneratsiya davri'));
    const qOf = (K, qe, tf) => -qe + Math.sqrt(qe * qe + K * tf);
    const rows = [1, 2, 4, 6, 8].map(k => { const qe = c.Rf * k / (c.r0 * c.x0); const q = qOf(c.Kf, qe, c.tfW); const S = c.Vml_filt / 3600 / (q * c.nW); return [f(k, 0), e(c.Rf * k, 1), f(q * 1000, 1), f(S, 1), f(S / c.Fst * 100, 0)]; });
    add(P('Ishlash davomida NaHCO₃ kristallari va kalsiy-magniy cho‘kmalari to‘qima g‘ovaklarida to‘planib, uning qarshiligi R_{f} ortadi. R_{f} ning ortishi filtrga qanday ta’sir etishi 8.4-jadvalda ko‘rsatilgan (n = 0,5 ayl/min, ΔP = 55 kPa).'));
    add(T('8.4', 'Filtr to‘qimasi qarshiligining filtr yuklanishiga ta’siri', ['R_{f}/R_{f0}', 'R_{f}, m⁻¹', 'q, l/m²', 'S_{talab}, m²', 'Yuklanish, %'], rows, [1, 1, 1, 1, 1]));
    add(P('Jadvaldan ko‘rinadiki, n = 0,5 ayl/min da to‘qima qarshiligi ikki marta ortishi bilan filtr yuklanishi 100 % dan oshadi. Unumdorlikni saqlash uchun aylanish chastotasi 0,7–1,0 ayl/min gacha oshiriladi (8.1-jadvalga qarang), qarshilik 4–6 marta ortganda esa bu ham yetarli bo‘lmaydi va filtr regeneratsiyaga to‘xtatiladi. Amalda bu 24–48 soatlik ish davriga to‘g‘ri keladi; shu sababli zaxira filtr majburiy.'));
    add(P(`Kekni olishda pichoq oldida baraban seksiyasiga siqilgan havo (0,02–0,05 MPa) qisqa muddat beriladi. Puflash havosi sarfi 1 m² ga bir aylanishda 0,03 m³ qabul qilinganda V = 0,03·${c.Fst}·${f(c.nW * 60, 1)}/60 = ${f(0.03 * c.Fst * c.nW, 4)} m³/s; u umumzavod siqilgan havo tarmog‘idan olinadi.`));
  }
  add(H2('8.9. Barometrik quvur va filtrat liniyasi'));
    const Hb = c.dP / (c.rhoF * 9.81) + 0.5 + 0.3;
    add(P(`Filtrat vakuum-separatordan barometrik quvur orqali o‘z oqimi bilan atmosfera bosimidagi idishga tushadi. Quvurning minimal balandligi gidrostatik muvozanat shartidan: H = ΔP/(ρ·g) + h_{zax} + h_{qarsh} = ${f(c.dP, 0)}/(${c.rhoF}·9,81) + 0,5 + 0,3 = ${f(Hb, 2)} m; ${f(Math.ceil(Hb * 2) / 2, 1)} m qabul qilinadi. Filtrat sarfi ${f(c.Vfiltrate, 1)} m³/soat, quvurdagi tezlik 0,8 m/s bo‘lganda diametri d = (4V/(πw))^{0,5} = ${f(Math.sqrt(4 * c.Vfiltrate / 3600 / (Math.PI * 0.8)) * 1000, 0)} mm → Dy 175 mm.`));
  }
  add(T('8.5', 'Barabanli vakuum-filtr hisobining asosiy natijalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['Filtr tipi', 'БОУ 20-2,6'], ['Filtrlash yuzasi, m²', String(c.Fst)], ['Baraban diametri × uzunligi, m', `${f(c.Dd, 1)} × ${f(c.Ld, 1)}`],
    ['Suspenziya sarfi, kg/s', f(c.mSusp / 3600, 3)], ['Filtrat (ona suyuqlik), m³/s', e(c.Vml_filt / 3600, 3)], ['Filtrlash konstantasi K, m²/s', e(c.Kf, 3)],
    ['Aylanish chastotasi, ayl/min (s⁻¹)', `0,5 (${e(c.nW, 2)})`], ['Kek qalinligi, mm', f(c.hW * 1000, 1)], ['Zarur filtrlash yuzasi, m²', f(c.FW, 1)],
    ['Yuvish vaqti (zarur / mavjud), s', `${f(c.tWashNeedW, 1)} / ${f(c.tWashAvailW, 1)}`], ['Havo sarfi, m³/s', f(c.Vair, 3)], ['Yuritma quvvati, kW', '1,5'],
  ], [2.5, 1.5]));

  // ============ 9
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Jihozlar soni n = V_{talab}/V_{bir} formula bo‘yicha aniqlanadi; zaxira apparatlar uzluksiz ishlash va regeneratsiya (filtrni yuvish) uchun ko‘zda tutiladi.'));
  {
    const kolV = c.Vml * 1.8; // m3 kolonna hajmi bo'yicha (bo'lish vaqti 1,8 soat)
    add(T('9.1', 'Asosiy jihozlar sonini hisoblash', ['Jihoz', 'Talab etilgan', 'Bitta apparat imkoniyati', 'n_{hisob}', 'Qabul'], [
      ['Barabanli vakuum-filtr БОУ 20-2,6', `${f(c.FW, 1)} m²`, `${c.Fst} m²`, f(c.FW / c.Fst, 2), '1 + 1 zaxira'],
      ['Vakuum-nasos ВВН-25', `${f(c.Vair * 45 / 101.3 * 60, 1)} m³/min`, '25 m³/min', f(c.Vair * 45 / 101.3 * 60 / 25, 2), '1 + 1 zaxira'],
      ['Vakuum-separator', `${f(c.Vair, 2)} m³/s`, '0,60 m³/s (D = 0,8 m)', f(c.Vair / 0.6, 2), '1'],
      ['Filtrat nasosi', `${f(c.Vfiltrate, 1)} m³/soat`, '63 m³/soat', f(c.Vfiltrate / 63, 2), '1 + 1 zaxira'],
      ['Karbonizatsiya kolonnasi (D = 2,0 m)', `${f(kolV, 0)} m³ suyuqlik hajmi`, '80 m³', f(kolV / 80, 2), '2 + 1 (yuvishda)'],
      ['Lentali konveyer', `${f(c.mCake / 1000, 1)} t/soat`, '40 t/soat', f(c.mCake / 1000 / 40, 2), '1'],
      ['Bug‘li kalsinator', `${f(c.G / 1000, 2)} t/soat soda`, '10 t/soat', f(c.G / 1000 / 10, 2), '1 + 1 zaxira'],
    ], [2.2, 1.3, 1.4, 0.7, 1.1]));
  }
  add(P(`Karbonizatsiya kolonnasi soni suspenziyaning kolonnada bo‘lish vaqti (1,8 soat) va bitta kolonnaning ish hajmi bo‘yicha aniqlandi. Kolonnalar vaqti-vaqti bilan (har 3–4 sutkada) NaHCO₃ inkrustatsiyalaridan yuvib tozalanadi, shuning uchun bitta kolonna yuvish rejimida ishlaydi. Filtrat idishi hajmi 15 daqiqalik zaxira uchun ${f(c.Vfiltrate / 4, 1)} m³ → 20 m³ – 1 dona; yuvish suvi idishi 10 m³ – 1 dona.`));

  // ============ 10
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Tozalangan namakob idishi', '1', 'V = 200 m³', 'Ст3 + epoksid qoplama'],
    ['2', 'Ammiaklash absorberi', '1', 'D = 2,0 m, H = 18 m, tarelkali', 'Cho‘yan'],
    ['3', 'Karbonizatsiya kolonnasi', '3 (1 yuvishda)', 'D = 2,0 m, H = 25 m, sovitgichli', 'Cho‘yan / titan quvurlar'],
    ['4', 'Barabanli vakuum-filtr', '2 (1 zaxira)', `БОУ 20-2,6: S = 20 m², n = 0,13–1,0 ayl/min, N = 1,5 kW`, '12Х18Н10Т'],
    ['5', 'Vakuum-separator', '1', 'D = 0,8 m, H = 2,0 m', 'Ст3 + rezina'],
    ['6', 'Suv halqali vakuum-nasos', '2 (1 zaxira)', 'ВВН-25: 25 m³/min, 37 kW', 'Cho‘yan'],
    ['7', 'Filtrat idishi', '1', 'V = 20 m³', 'Ст3'],
    ['8', 'Filtrat nasosi', '2 (1 zaxira)', 'Markazdan qochma, Q = 63 m³/soat, H = 30 m', 'Cho‘yan'],
    ['9', 'Lentali konveyer', '1', 'B = 800 mm, L = 20 m', 'Rezina lenta'],
    ['10', 'Bug‘li kalsinator', '2 (1 zaxira)', 'Aylanuvchi, quvur ichida bug‘ 3 MPa, 10 t/soat', '12Х18Н10Т / Ст3'],
    ['11', 'Yuvish suvi isitgichi', '1', 'Qobiq-quvurli, F = 2 m²', '12Х18Н10Т'],
    ['12', 'Filtr gazini yuvish skrubberi', '1', 'D = 0,8 m, H = 6 m, nasadkali', 'Ст3'],
  ], [0.5, 2.2, 1.1, 2.9, 1.5]));

  // ============ 11
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('Filtratsiya bo‘limida tahliliy nazorat suspenziya va filtrlangan bikarbonatning sifatini, yuvish samaradorligini, filtrat tarkibini va ammiak yo‘qotilishini nazorat qilish uchun olib boriladi. Soda sanoatida konsentratsiyalar an’anaviy ravishda “normal birliklar” (n.b. = 1/20 g-ekv/l) da ifodalanadi; hisobotlarda ular kg/m³ ga o‘tkaziladi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul', 'Davriyligi'], [
    ['Tozalangan namakob', 'NaCl; Ca²⁺ + Mg²⁺', '≥ 305 kg/m³; ≤ 0,02 kg/m³', 'Argentometrik (Mor); trilonometrik', '2 soatda 1 marta'],
    ['Suspenziya', 'Qattiq faza ulushi, harorat', '17–20 %; 301–305 K', 'Hajmiy cho‘ktirish, termometr', '1 marta smenada'],
    ['Ona suyuqlik', 'Cl⁻, umumiy va bog‘langan NH₃, CO₂', 'U_{Na} ≥ 70 %', 'Titrlash', '2 soatda 1 marta'],
    ['Nam bikarbonat', 'Namlik, NaCl, NH₃', '≤ 20 %; ≤ 0,4 %; ≤ 1,0 %', 'Quritish; Mor; distillyatsiya', '2 soatda 1 marta'],
    ['Nam bikarbonat', 'Kristallar o‘lchami', '0,1–0,3 mm (80 %)', 'Mikroskop, elak tahlili', '1 marta sutkada'],
    ['Filtrat', 'Qattiq faza (loyqa)', '≤ 1 kg/m³', 'Gravimetrik', '1 marta smenada'],
    ['Filtrat', 'NH₃ (umumiy), Cl⁻', '6.6-jadval', 'Titrlash', '1 marta smenada'],
    ['Filtr gazi', 'NH₃, CO₂', '–', 'Gaz analizator', '1 marta smenada'],
    ['Vakuum, aylanish chastotasi', 'ΔP, n', '45–60 kPa; 0,3–1,0 ayl/min', 'Vakuummetr, taxometr', 'Uzluksiz'],
    ['Tayyor soda', 'Na₂CO₃, NaCl, Fe₂O₃', 'GOST 5100', 'Titrlash, fotokolorimetrik', 'Har partiya'],
  ], [1.6, 1.7, 1.5, 1.7, 1.1]));
  add(P('Bikarbonatdagi NaCl xlorid ionini kumush nitrat bilan kaliy xromat ishtirokida titrlash (Mor usuli) orqali aniqlanadi; uning ko‘payishi yuvish suvining yetishmasligi yoki forsunkalar tiqilib qolganini bildiradi. Bikarbonatdagi ammiak namunani ishqor bilan distillyatsiya qilib, ajralgan NH₃ ni sulfat kislota bilan titrlash orqali topiladi. Kek namligi namunani 378 K da quritish yoki tezkor nazorat uchun infraqizil namlik o‘lchagich bilan aniqlanadi.'));
  add(P('Namakob tahlili: NaCl – Mor usulida (AgNO₃ bilan K₂CrO₄ indikatorida titrlash); Ca²⁺ va Mg²⁺ yig‘indisi – trilon B bilan eriokrom qora T indikatorida (pH 10) titrlash; Ca²⁺ alohida – murexid indikatorida (pH 12); SO₄²⁻ – bariy xlorid bilan gravimetrik yoki turbidimetrik usulda. Ona suyuqlikda umumiy ammiak namunani ishqor bilan distillyatsiya qilib, bog‘langan ammiak (NH₄Cl) esa umumiy va erkin ammiak farqi orqali aniqlanadi; erkin ammiak metiloranj bilan kislota orqali to‘g‘ridan-to‘g‘ri titrlanadi.'));
  add(P('Avtomatik boshqarish: filtr vannasidagi suspenziya sathi – karbonizatsiya kolonnasidan suspenziya chiqarish klapani orqali; yuvish suvi sarfi – soda unumdorligiga nisbatan; vakuum – havo so‘rish zaslonkasi orqali; barabanning aylanish chastotasi – chastota o‘zgartirgich orqali kek qalinligiga qarab rostlanadi. Filtr to‘xtaganda suspenziya avtomatik ravishda zaxira filtrga yo‘naltiriladi.'));

  // ============ 12
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Soda ishlab chiqarish usullari va ajratish apparatlari solishtirilib, unumdorligi ${f(c.G / 1000, 2)} t/soat bo‘lgan ishlab chiqarish uchun ammiakli (Solve) usul va bikarbonat suspenziyasini filtrlash uchun barabanli vakuum-filtr БОУ 20-2,6 asoslab tanlandi.`));
  add(P(`2. Moddiy balans bo‘yicha: nam bikarbonat ${f(c.mCake, 0)} kg/soat (${f(c.mCake / 3600, 3)} kg/s), namakob sarfi ${f(c.Vbrine, 2)} m³/soat (${f(perT(c.Vbrine), 2)} m³/t soda), suspenziya ${f(c.mSusp, 0)} kg/soat (${f(c.Vsusp, 1)} m³/soat), yuvish suvi ${f(c.Vwash, 2)} m³/soat, filtrat ${f(c.Vfiltrate, 1)} m³/soat. Natriydan foydalanish darajasi ${f(c.U * 100, 0)} %.`));
  add(P(`3. Issiqlik balansi bo‘yicha: filtrdan chiqadigan kek va filtrat harorati ${f(c.Tout, 1)} K; kalsinatsiya uchun issiqlik sarfi ${f(c.QcalcTot, 0)} kW, bug‘ sarfi ${f(c.steamCalc / c.G, 2)} t/t soda.`));
  add(P(`4. Barabanli vakuum-filtr hisoblandi: filtrlash konstantasi K = ${e(c.Kf, 3)} m²/s, n = 0,5 ayl/min da kek qalinligi ${f(c.hW * 1000, 1)} mm, zarur yuza ${f(c.FW, 1)} m², yuvish zonasi yetarli (${f(c.tWashNeedW, 1)} s < ${f(c.tWashAvailW, 1)} s), havo sarfi ${f(c.Vair, 2)} m³/s. 1 ta ishchi va 1 ta zaxira БОУ 20-2,6 filtri qabul qilindi.`));
  add(P('5. Asosiy jihozlar ro‘yxati va tahliliy nazorat sxemasi ishlab chiqildi. Filtrlash rejimini (aylanish chastotasi, vakuum, yuvish) optimallashtirish kek namligini va sodadagi NaCl miqdorini kamaytirib, kalsinatsiyaga bug‘ sarfini qisqartirishga imkon beradi.'));

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
    'Зайцев И.Д., Ткач Г.А., Стоев Н.Д. Производство соды. – М.: Химия, 1986. – 312 с.',
    'Шокин И.Н., Крашенинников С.А. Технология соды. – 2-е изд. – М.: Химия, 1975. – 288 с.',
    'Жужиков В.А. Фильтрование. Теория и практика разделения суспензий. – 4-е изд. – М.: Химия, 1980. – 400 с.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Soda ishlab chiqarishning namakob tizimini filtratsiya bo‘limining filtr hisobi bilan loyihasi.', unum: 'Unumdorligi – 8,07 t/soat kalsinatsiyalangan soda' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
