// 2-loyiha: Konvertlangan gazni monoetanolamin usulida tozalash sexining absorber hisobi bilan loyihasi. 105 m3/soat
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc2');
const t = require('./thermo');
const { Vm } = t;

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];

const NAMES = { CH4: 'CH₄', H2O: 'H₂O', CO: 'CO', CO2: 'CO₂', H2: 'H₂', N2: 'N₂', Ar: 'Ar' };
const ks = x => f(x / 3600, 5);
function gasRows(fl) {
  const n = t.sum(fl), nd = t.sum(fl, ['H2O']); let m = 0; const rows = [];
  for (const s of ['H2', 'N2', 'CO2', 'CO', 'CH4', 'Ar', 'H2O']) {
    const mi = fl[s] * t.CP[s].M; m += mi;
    rows.push([NAMES[s], f(fl[s], 4), f(fl[s] * Vm, 3), f(mi, 3), f(fl[s] / n * 100, 3), s === 'H2O' ? '–' : f(fl[s] / nd * 100, 3)]);
  }
  rows.push(B(['Jami', f(n, 4), f(n * Vm, 3), f(m, 3), '100,000', '100,000']));
  return rows;
}
const gHead = ['Komponent', 'n_{i}, kmol/soat', 'V_{i}, m³/soat', 'm_{i}, kg/soat', 'Nam gazda, %', 'Quruq gazda, %'];
const W6 = [1.2, 1.2, 1.2, 1.2, 1.1, 1.1];

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };
  const mG_in = t.mass(c.gin), mG_out = t.mass(c.gout);

  // ============ 1
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Ammiak ishlab chiqarishda tabiiy gazni bug‘ va havo bilan konversiyalash hamda uglerod oksidini konversiyalash natijasida olinadigan azot-vodorodli gaz tarkibida 17–19 % gacha uglerod (IV) oksidi (CO₂) bo‘ladi. CO₂ ammiak sintezi katalizatori uchun zahar hisoblanadi, bundan tashqari, u ammiak bilan reaksiyaga kirishib, sintez sxemasining quvurlari va apparatlarida qattiq ammoniy karbamati hosil qiladi. Shuning uchun sintezga yuboriladigan gazda CO₂ va CO ning yig‘indi miqdori 10–20 ppm dan oshmasligi kerak. Buning uchun gaz avval suyuq yutuvchilar bilan CO₂ dan tozalanadi, qoldiq CO va CO₂ esa metanlash bosqichida yo‘qotiladi.'));
  add(P('CO₂ ni yutishning keng tarqalgan usullaridan biri – monoetanolamin (MEA) ning suvli eritmasi bilan kimyoviy absorbsiya. MEA eritmasi yuqori yutish qobiliyatiga, katta reaksiya tezligiga ega, arzon va oson regeneratsiyalanadi, tozalangan gazda CO₂ miqdorini 0,01–0,03 % gacha kamaytirish imkonini beradi. Ajratib olingan toza CO₂ (98–99 %) karbamid ishlab chiqarish uchun xomashyo sifatida ishlatiladi – bu O‘zbekistondagi ammiak–karbamid majmualari (“Navoiyazot”, “Farg‘onaazot”, “Maxam-Chirchiq”) uchun ayniqsa muhim.'));
  add(P('MEA bilan tozalash bo‘limining asosiy apparati – absorber. Uning to‘g‘ri hisoblanishi tozalash darajasini, eritma aylanishi va regeneratsiyaga sarflanadigan bug‘ miqdorini, ya’ni butun bo‘limning energiya sarfini belgilaydi. Regeneratsiya issiqligi ammiak ishlab chiqarishdagi umumiy energiya sarfining 10–15 % ini tashkil etishini hisobga olsak, absorberni optimal loyihalash muhim amaliy vazifa hisoblanadi.'));
  add(P(`Ushbu kurs loyihasining maqsadi – unumdorligi konvertlangan gaz bo‘yicha ${c.V} m³/soat (normal sharoitda, quruq gaz) bo‘lgan, konvertlangan gazni monoetanolamin usulida CO₂ dan tozalash sexini loyihalash va uning asosiy apparati – absorberni hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['CO₂ ning MEA eritmalari bilan kimyoviy absorbsiyasi va desorbsiyasining nazariy asoslarini tahlil qilish;',
    'konvertlangan gaz, MEA va uning eritmalarining fizik-kimyoviy xususiyatlarini o‘rganish;',
    'CO₂ dan tozalash usullarini solishtirib, tanlangan sxemani asoslash;',
    'absorber va regeneratorning moddiy va issiqlik balanslarini SI tizimida hisoblash;',
    'absorberning diametri, nasadka balandligi, gidravlik qarshiligi, devor qalinligi va shtutserlarini hisoblash;',
    'asosiy jihozlar sonini aniqlash, ularning ro‘yxatini va tahliliy nazorat sxemasini tuzish.']));
  add(P('Barcha hisoblar SI xalqaro birliklar tizimida bajarilgan (kg, mol, K, Pa, J, W, m³, s); oqimlar qulaylik uchun soatlik miqdorda ham keltirilgan va kg/s, kW ga o‘tkazilgan. Gaz hajmlari normal sharoitga (273,15 K; 101 325 Pa) keltirilgan, V_{m} = 22,414 m³/kmol. Yillik ish vaqti 8000 soat.'));

  // ============ 2
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. MEA ning CO₂ bilan o‘zaro ta’siri'));
  add(P('Monoetanolamin HOCH₂CH₂NH₂ (qisqacha RNH₂) – birlamchi amin bo‘lib, kuchsiz asos xossasiga ega. Uning suvli eritmasi CO₂ ni kimyoviy reaksiyalar hisobiga yutadi. Asosiy reaksiya – karbamat hosil bo‘lishi:'));
  add(F('2RNH₂ + CO₂ ⇄ RNHCOO⁻ + RNH₃⁺', '2.1'));
  add(P('Reaksiya ikki bosqichda boradi: avval tsvitter-ion (RNH₂⁺COO⁻) hosil bo‘ladi, so‘ngra uni ikkinchi amin molekulasi deprotonlaydi. Eritmaning CO₂ bilan to‘yinish darajasi (α, mol CO₂/mol MEA) 0,5 dan oshganda karbamat gidrolizlanib, bikarbonat hosil bo‘ladi:'));
  add(F('RNHCOO⁻ + H₂O + CO₂ ⇄ RNH₃⁺ + 2HCO₃⁻', '2.2'));
  add(F('RNH₂ + CO₂ + H₂O ⇄ RNH₃⁺ + HCO₃⁻', '2.3'));
  add(P(`Shunday qilib, karbamat mexanizmi bo‘yicha MEA ning stexiometrik sig‘imi 0,5 mol CO₂/mol MEA ni tashkil etadi; bikarbonat hosil bo‘lishi hisobiga yuqori bosimda 0,6–0,7 ga yetishi mumkin. Absorbsiya issiqligi α ga bog‘liq bo‘lib, α < 0,5 da o‘rtacha ${f(c.dHabs, 0)} kJ/mol CO₂ (≈ 1,9 MJ/kg CO₂) ni tashkil etadi. Reaksiyalar ekzotermik bo‘lgani uchun past haroratda (308–323 K) muvozanat CO₂ ning yutilishi tomoniga, yuqori haroratda (383–398 K) esa desorbsiya tomoniga siljiydi. Bu xossa eritmani issiqlik bilan regeneratsiyalash imkonini beradi.`));
  add(H2('2.2. Absorbsiya muvozanati'));
  add(P('Eritma ustidagi CO₂ ning muvozanat partsial bosimi to‘yinish darajasi va haroratga bog‘liq. Karbamat reaksiyasi (2.1) muvozanat konstantasi ifodasidan erkin CO₂ konsentratsiyasi uchun [CO₂] ~ α²/(1 – 2α)² munosabati kelib chiqadi. Genri qonunini hisobga olib, muvozanat bosimi uchun quyidagi soddalashtirilgan tenglama qabul qilinadi (α < 0,5 da):'));
  add(F('p*_{CO₂} = F(T)·α²/(1 – 2α)²', '2.4'));
  add(F(`F(T) = ${f(c.F0, 2)}·exp[–${f(c.Eh, 0)}·(1/T – 1/313,15)], kPa`, '2.5'));
  add(P('Tenglama koeffitsiyentlari 15–20 % li MEA eritmalari uchun [10, 12] adabiyotlardagi tajriba ma’lumotlari asosida tanlangan; eksponenta ko‘rsatkichi absorbsiya issiqligiga mos keladi (ΔH/R ≈ 10 100 K). Hisoblangan muvozanat bosimlari 2.1-jadvalda keltirilgan.'));
  {
    const al = [0.10, 0.15, 0.20, 0.30, 0.40, 0.45, 0.48];
    const Ts = [313.15, 333.15, 353.15, 393.15];
    add(T('2.1', '20 % li MEA eritmasi ustidagi CO₂ ning muvozanat bosimi p*, kPa', ['α, mol/mol', ...Ts.map(x => f(x, 0) + ' K')],
      al.map(a => [f(a, 2), ...Ts.map(T_ => { const v = c.peq(a, T_); return v < 0.1 ? f(v, 4) : v < 10 ? f(v, 2) : f(v, 0); })]), [1, 1, 1, 1, 1]));
  }
  add(P('Jadvaldan ko‘rinib turibdiki, 313 K da α = 0,15 li regeneratsiyalangan eritma ustida CO₂ bosimi 0,01 kPa atrofida bo‘lib, bu tozalangan gazda 0,03 % CO₂ ni ta’minlash uchun yetarli (2,8 MPa da CO₂ ning partsial bosimi 0,84 kPa). 393 K da esa α = 0,45 eritma ustidagi bosim keskin ortadi va bu desorbsiyani ta’minlaydi.'));
  add(H2('2.3. Kimyoviy absorbsiya kinetikasi'));
  add(P('CO₂ ning MEA eritmasi bilan yutilishi suyuqlik fazasidagi tez kimyoviy reaksiya bilan murakkablashgan massa almashinish jarayonidir. MEA ning CO₂ bilan reaksiyasi ikkinchi tartibli bo‘lib, uning tezlik konstantasi 298 K da k₂ ≈ 6000 m³/(kmol·s) ni tashkil etadi. Natijada suyuqlik fazasidagi massa berish koeffitsiyenti fizik absorbsiyaga nisbatan E marta (tezlanish koeffitsiyenti) ortadi:'));
  add(F('k_{L}′ = E·k_{L};   E ≈ (D_{CO₂}·k₂·C_{MEA})^{0,5}/k_{L}  (Ha > 3 bo‘lganda)', '2.6'));
  add(P('Hatta soni Ha = (D·k₂·C)^{0,5}/k_{L} absorberning yuqori qismida 30–100 ga teng, ya’ni reaksiya diffuziya plyonkasida to‘liq tugaydi va jarayon tezligi asosan erkin aminning konsentratsiyasi bilan belgilanadi. Absorberning pastki qismida to‘yinish darajasi 0,4–0,5 ga yetganda erkin MEA kamayadi va massa almashinish koeffitsiyenti 3–5 marta pasayadi. Shuning uchun hisoblashda absorber balandligi bo‘yicha o‘rtacha hajmiy massa uzatish koeffitsiyenti K_{G}a dan foydalaniladi.'));
  add(H2('2.4. Eritmani regeneratsiyalash'));
  add(P('To‘yingan (boy) eritma regeneratorda 383–398 K da 0,15–0,2 MPa bosimda qaynatiladi. Issiqlik qaynatgichda bug‘ bilan beriladi va quyidagilarga sarflanadi: eritmani qaynash haroratigacha isitish; CO₂ ning desorbsiya issiqligi (absorbsiya issiqligiga teng); regenerator tepasidan CO₂ bilan chiqadigan suv bug‘ini hosil qilish (“puflovchi” bug‘ – u CO₂ ning eritma ustidagi partsial bosimini kamaytiradi). Regeneratsiyalangan eritmada α = 0,10–0,20 qoladi; chuqurroq regeneratsiya bug‘ sarfini keskin oshiradi.'));
  add(H2('2.5. Qo‘shimcha jarayonlar'));
  add(P('MEA kislorod, COS, CS₂ bilan qaytmas reaksiyalarga kirishib, termik barqaror tuzlar va oksazolidon, N-(2-gidroksietil)etilendiamin kabi degradatsiya mahsulotlarini hosil qiladi. Ular eritmaning yutish qobiliyatini kamaytiradi va korroziyani kuchaytiradi. Uglerodli po‘latlarning korroziyasini kamaytirish uchun MEA konsentratsiyasi 15–20 % dan, to‘yinish darajasi 0,5 dan oshirilmaydi, eritmaga ingibitorlar (natriy metavanadati va boshqalar) qo‘shiladi, eritmaning bir qismi doimiy ravishda haydash (rekuperatsiya) orqali tozalanadi.'));

  add(H2('2.6. Absorbsiya jarayoniga ta’sir etuvchi omillar'));
  add(P('Harorat. Haroratning pasayishi CO₂ ning muvozanat bosimini kamaytiradi va eritmaning yutish sig‘imini oshiradi, ammo reaksiya tezligini va diffuziya koeffitsiyentini pasaytiradi. Absorberga eritma 308–318 K da beriladi; absorbsiya issiqligi hisobiga eritma pastki qismda 328–338 K gacha qiziydi. Haroratning 343 K dan oshishi tozalash darajasini keskin pasaytiradi, shuning uchun yuqori CO₂ konsentratsiyasida eritma sarfi yetarli darajada katta olinadi.'));
  add(P('Bosim. Bosimning ortishi CO₂ ning partsial bosimini va demak harakatlantiruvchi kuchni oshiradi. Kimyoviy absorbsiyada eritma sig‘imi bosimga kuchsiz bog‘liq (α ≤ 0,5), shu sababli MEA usuli asosan CO₂ ning partsial bosimi 0,1–1,0 MPa bo‘lgan gazlar uchun samarali. 2,8 MPa da gaz hajmi kichrayib, apparat o‘lchamlari kamayadi.'));
  add(P('MEA konsentratsiyasi. Konsentratsiya ortishi bilan eritma aylanishi kamayadi, lekin korroziya, qovushoqlik va MEA yo‘qotilishi ortadi. Ingibitorsiz sxemalarda 15–20 % li, ingibitorli sxemalarda 25–30 % li eritmalar ishlatiladi. Loyihada 20 % li eritma qabul qilingan.'));
  add(P('To‘yinish darajasi. Regenerlangan eritmaning α₁ qiymati tozalangan gazdagi qoldiq CO₂ ni belgilaydi: α₁ = 0,10 da y₂ ≈ 0,005 %, α₁ = 0,20 da y₂ ≈ 0,1 % gacha bo‘lishi mumkin. Boy eritmaning α₂ qiymati esa eritma aylanishini va regeneratsiya issiqligini belgilaydi. α₂ ni 0,5 dan oshirish korroziyani kuchaytiradi. Optimal qiymatlar α₁ = 0,12–0,18, α₂ = 0,40–0,50.'));
  add(P('Suyuqlik va gaz oqimlarining nisbati (L/G) minimal qiymatdan 1,2–1,5 marta katta tanlanadi. Gaz tarkibidagi aralashmalar – kislorod, oltingugurt birikmalari, chang – MEA degradatsiyasini tezlashtiradi, sirt-faol moddalar va mexanik zarrachalar esa ko‘piklanishga sabab bo‘ladi; ko‘piklanish absorberning o‘tkazish qobiliyatini keskin kamaytiradi.'));
  {
    add(H2('2.7. Tozalash va metanlash bosqichlarining bog‘liqligi'));
    const co2 = c.CO2out, co = c.gout.CO; const h2m = 4 * co2 + 3 * co;
    add(P('MEA bilan tozalangan gazdagi qoldiq CO₂ va CO nikel katalizatorida metanlash reaksiyalari bo‘yicha yo‘qotiladi:'));
    add(F('CO₂ + 4H₂ → CH₄ + 2H₂O;   ΔH°_{298} = –165,0 kJ/mol', '2.7'));
    add(F('CO + 3H₂ → CH₄ + H₂O;   ΔH°_{298} = –206,1 kJ/mol', '2.8'));
    add(P(`Loyihadagi tozalangan gazda CO₂ ${f(co2, 5)} kmol/soat, CO ${f(co, 4)} kmol/soat bo‘lib, ularni metanlashga ${f(h2m, 4)} kmol/soat vodorod sarflanadi – bu gazdagi vodorodning ${f(h2m / c.gout.H2 * 100, 2)} % i. Agar tozalash darajasi pasayib, qoldiq CO₂ 0,1 % ga yetsa, vodorod sarfi CO₂ bo‘yicha ${f(0.001 / 0.0003, 1)} marta ortadi, metanatorda harorat esa har 0,1 % CO₂ uchun ≈ 6 K ga ko‘tariladi. Shu sababli absorber qoldiq CO₂ ≤ 0,03 % ni barqaror ta’minlashi kerak.`));
  }
  // ============ 3
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Konvertlangan gaz'));
  add(P('Tozalashga uglerod oksidi konversiyasi bosqichidan chiqqan, 313 K gacha sovitilgan va kondensatdan ajratilgan konvertlangan gaz keladi. Uning tarkibi 3.1-jadvalda keltirilgan.'));
  add(T('3.1', 'Konvertlangan gazning tarkibi (quruq gaz, hajmiy %)', ['H₂', 'N₂', 'CO₂', 'CO', 'CH₄', 'Ar', 'Jami'], [[...['H2', 'N2', 'CO2', 'CO', 'CH4', 'Ar'].map(s => f(c.yp[s], 2)), '100,00']], [1, 1, 1, 1, 1, 1, 1]));
  add(P(`Gazning bosimi 2,8 MPa, harorati 313 K, u suv bug‘i bilan to‘yingan (p_{H₂O} = ${f(c.pH2O_in / 1000, 2)} kPa). O‘rtacha molyar massa M = ${f(c.Mg, 2)} kg/kmol, ish sharoitidagi zichlik ρ_{g} = P·M/(R·T) = ${f(c.rhoG, 2)} kg/m³, dinamik qovushoqlik μ_{g} ≈ ${e(c.muG, 2)} Pa·s.`));
  add(H2('3.2. Monoetanolamin va uning eritmalari'));
  add(P('Monoetanolamin (2-aminoetanol) HOCH₂CH₂NH₂ – rangsiz, yopishqoq, ammiak hidli gigroskopik suyuqlik. U suv va spirtlar bilan istalgan nisbatda aralashadi. MEA ning asosiy xossalari 3.2-jadvalda keltirilgan.'));
  add(T('3.2', 'Monoetanolaminning fizik-kimyoviy xossalari [10, 12, 13]', ['Ko‘rsatkich', 'Qiymati'], [
    ['Molyar massa, kg/kmol', '61,08'], ['Zichlik (293 K), kg/m³', '1016'], ['Qaynash harorati (0,1 MPa), K', '443,5'],
    ['Suyuqlanish harorati, K', '283,5'], ['Bug‘ bosimi (333 K), Pa', '≈ 670'], ['Dinamik qovushoqlik (293 K), mPa·s', '24,1'],
    ['Issiqlik sig‘imi (293 K), kJ/(kg·K)', '2,72'], ['Bug‘lanish issiqligi, kJ/kg', '826'], ['Alangalanish harorati, K', '366'],
    ['Dissotsiatsiya konstantasi pK_{a} (298 K)', '9,50'], ['Ish zonasida YuChK, mg/m³', '0,5'],
  ], [3, 1.5]));
  add(T('3.3', '20 % li MEA eritmasining xossalari', ['Ko‘rsatkich', '313 K', '333 K', '393 K'], [
    ['Zichlik, kg/m³ (α = 0,15)', '1010', '1000', '960'], ['Zichlik, kg/m³ (α = 0,45)', '1060', '1050', '1010'],
    ['Dinamik qovushoqlik, mPa·s', '1,40', '0,95', '0,40'], ['Issiqlik sig‘imi, kJ/(kg·K)', '3,80', '3,85', '3,95'],
    ['Sirt tarangligi, mN/m', '62', '59', '52'], ['Issiqlik o‘tkazuvchanlik, W/(m·K)', '0,52', '0,54', '0,56'],
  ], [2.5, 1, 1, 1]));
  add(P(`20 % li eritmada MEA konsentratsiyasi C = ${f(c.CMEA, 2)} kmol/m³. Eritmaning 1 m³ i α = 0,15 dan 0,45 gacha to‘yinganda ${f(c.CMEA * 0.30 * Vm, 1)} m³ CO₂ (n.sh.) yutadi.`));
  add(H2('3.3. Mahsulotlar'));
  add(P('Tozalangan gaz – tarkibida CO₂ 0,03 % dan ko‘p bo‘lmagan azot-vodorodli aralashma; u metanlash bosqichiga yuboriladi. Uglerod (IV) oksidi – rangsiz, kuchsiz nordon ta’mli gaz, havodan 1,5 marta og‘ir, kritik harorati 304,2 K, kritik bosimi 7,38 MPa. Regeneratordan chiqadigan CO₂ ning tozaligi quruq holatda 98–99 % (qolgani H₂, N₂); u karbamid sintezi uchun kompressorlarga beriladi. CO₂ zaharli emas, lekin ish zonasida 0,5 % dan ortiq konsentratsiyada bo‘g‘ilishga olib keladi.'));
  add(T('3.4', 'Gazlarning asosiy xossalari', ['Modda', 'M, kg/kmol', 'ρ₀, kg/m³', 'T_{kr}, K', 'P_{kr}, MPa', 'Suvda eruvchanligi (293 K), m³/m³'], [
    ['H₂', '2,016', '0,090', '33,2', '1,30', '0,018'], ['N₂', '28,01', '1,251', '126,2', '3,39', '0,015'],
    ['CO₂', '44,01', '1,977', '304,2', '7,38', '0,88'], ['CO', '28,01', '1,250', '132,9', '3,50', '0,023'],
    ['CH₄', '16,04', '0,717', '190,6', '4,60', '0,033'], ['Ar', '39,95', '1,784', '150,9', '4,90', '0,034'],
  ], [1, 1, 1, 1, 1, 1.8]));

  add(H2('3.4. MEA eritmalarining korrozion xossalari va konstruksion materiallar'));
  add(P('CO₂ bilan to‘yingan MEA eritmalari, ayniqsa yuqori haroratda (regenerator, qaynatgich, issiqlik almashtirgichning issiq qismi), uglerodli po‘latlarga nisbatan agressiv bo‘ladi. Korroziya tezligi to‘yinish darajasi 0,5 dan oshganda, harorat 383 K dan yuqori bo‘lganda va eritmada degradatsiya mahsulotlari to‘planganda keskin ortadi. Erozion korroziya suyuqlik tezligi 1,5 m/s dan katta bo‘lgan joylarda (nasoslar, drossel klapanlari) kuzatiladi.'));
  add(P('Shu sababli boy eritma va bug‘-gaz aralashmasi bilan ishlaydigan apparatlar (absorberning pastki qismi, regenerator, qaynatgich, rekuperativ issiqlik almashtirgich quvurlari) 12Х18Н10Т, 08Х18Н10Т zanglamas po‘latlardan tayyorlanadi; regenerlangan sovuq eritma liniyalari uchun uglerodli po‘lat (20, 09Г2С) korroziyaga qo‘shimcha 3 mm bilan qo‘llanilishi mumkin. Nasadka uchun keramik yoki zanglamas po‘lat halqalar ishlatiladi; plastmassa nasadkalar 373 K dan yuqori haroratda qo‘llanilmaydi.'));
  // ============ 4
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. CO₂ dan tozalash usullari'));
  add(P('Konvertlangan gazni CO₂ dan tozalash usullari yutuvchining turiga ko‘ra uch guruhga bo‘linadi: fizik absorbsiya (suv, propilenkarbonat, Selexol, metanol – Rectisol), kimyoviy absorbsiya (MEA, DEA, aktivlangan MDEA, issiq kaliy karbonati – Benfield) va adsorbsion usullar (PSA). Ularning qiyosiy tavsifi 4.1-jadvalda keltirilgan.'));
  add(T('4.1', 'CO₂ dan tozalash usullarini solishtirish', ['Ko‘rsatkich', 'Suv bilan (1,6–2,8 MPa)', 'MEA 15–20 %', 'Issiq K₂CO₃ (Benfield)', 'aMDEA', 'Selexol'], [
    ['Qoldiq CO₂, %', '0,5–1,0', '0,01–0,03', '0,1–0,2', '0,005–0,05', '0,1'],
    ['Yutuvchining sig‘imi, m³ CO₂/m³', '2–3', '20–25', '20–30', '25–40', '3–5 (bosimga bog‘liq)'],
    ['Regeneratsiya issiqligi, MJ/kg CO₂', '–', '4,5–6,0', '2,5–3,5', '1,5–2,5', '0,5–1'],
    ['Energiya sarfi (elektr)', 'katta', 'kam', 'o‘rtacha', 'kam', 'o‘rtacha'],
    ['H₂ yo‘qotilishi', 'katta (1–2 %)', 'kam', 'kam', 'kam', 'o‘rtacha'],
    ['Korroziya', 'kam', 'o‘rtacha', 'kuchli', 'kam', 'kam'],
    ['Yutuvchi narxi', '–', 'arzon', 'arzon', 'qimmat', 'qimmat'],
  ], [1.9, 1.2, 1, 1.2, 1, 1.1]));
  add(P('Suv bilan tozalash eng oddiy, ammo yetarlicha tozalash darajasini bermaydi va vodorod yo‘qotilishi katta. Fizik yutuvchilar (Selexol, Rectisol) CO₂ ning partsial bosimi yuqori bo‘lgan gazlar uchun qulay. Issiq kaliy karbonati usuli energiya jihatidan tejamkor, ammo qoldiq CO₂ yuqori va kuchli korroziya beradi. MEA usuli eng yuqori tozalash darajasini ta’minlaydi, yutuvchi arzon va mavjud, jarayon yaxshi o‘rganilgan va O‘zbekiston korxonalarida ko‘p yillik ekspluatatsiya tajribasiga ega. Kichik unumdorlikdagi qurilmada esa sxemaning soddaligi va ishonchliligi asosiy ahamiyatga ega. Shuning uchun loyihada 20 % li MEA eritmasi bilan bir oqimli absorbsiya sxemasi qabul qilinadi.'));
  add(H2('4.2. Absorber turini tanlash'));
  add(P('MEA bilan tozalashda nasadkali, tarelkali (klapanli, elaksimon) va kombinatsiyalashgan absorberlar qo‘llaniladi. Tarelkali absorberlar katta diametrli (2 m dan ortiq) apparatlarda, eritma sarfi katta bo‘lganda qulay. Nasadkali absorberlar kichik gidravlik qarshilikka, katta fazalararo sirtga ega, ko‘piklanishga kam sezgir va kichik diametrda tayyorlanishi oson. Loyihadagi gaz sarfi kichik bo‘lgani sababli ikki seksiyali, keramik Rashig halqalari bilan to‘ldirilgan nasadkali absorber tanlandi; seksiyalar orasida eritmani qayta taqsimlagich o‘rnatiladi.'));
  add(H2('4.3. Sxema variantlari'));
  add(P('MEA tozalashning bir oqimli (barcha eritma absorber tepasiga beriladi), ikki oqimli (chuqur regeneratsiyalangan eritma tepaga, qisman regeneratsiyalangani o‘rtaga beriladi) va ikki bosqichli sxemalari mavjud. Ikki oqimli sxema regeneratsiya issiqligini 15–20 % ga kamaytiradi, lekin regenerator va nasoslar sonini oshiradi. Kichik unumdorlik uchun bir oqimli sxema iqtisodiy jihatdan maqbul, chunki qo‘shimcha jihozlar qiymati issiqlik tejamidan yuqori bo‘ladi.'));

  // ============ 5
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Konvertlangan gazni MEA eritmasi bilan CO₂ dan tozalash sexining texnologik sxemasi 5.1-rasmda keltirilgan.'));
  add(IMG(path.join(FIG, 'sxema2.png'), 620, 360, '5.1-rasm. Konvertlangan gazni MEA usulida tozalash sexining texnologik sxemasi',
    '1 – gaz separatori; 2 – absorber; 3 – ekspanzer; 4 – boy eritma nasosi (gidroturbina); 5 – regenerlangan eritma nasosi; 6 – rekuperativ issiqlik almashtirgich; 7 – regenerator (desorber); 8 – qaynatgich; 9 – CO₂ kondensator-sovitgichi; 10 – flegma yig‘gichi (separator); 11 – flegma nasosi; 12 – eritma sovitgichi; 13 – filtr.'));
  add(P(`CO konversiyasi bo‘limidan 2,8 MPa bosim va 313 K haroratda keladigan konvertlangan gaz (${c.V} m³/soat quruq gaz) separator 1 da tomchi suyuqlikdan ajratiladi va absorber 2 ning pastki qismiga beriladi. Absorberda gaz pastdan yuqoriga harakatlanib, ikki seksiyali nasadka qatlami orqali tepadan oqib tushayotgan 20 % li MEA eritmasi bilan qarama-qarshi oqimda o‘zaro ta’sirlashadi. Tozalangan gaz (CO₂ ≤ 0,03 %) absorber tepasidagi tomchi ushlagichdan o‘tib, metanlash bo‘limiga yuboriladi.`));
  add(P(`CO₂ bilan to‘yingan (α = ${f(c.aR, 2)}) boy eritma absorber kubidan ${f(c.TR, 0)} K haroratda chiqadi va ekspanzer 3 da bosim 0,6 MPa gacha tushiriladi; bunda eritmada fizik erigan H₂, N₂ va qisman CO₂ ajraladi (ekspanzer gazi yoqilg‘i tarmog‘iga yuboriladi). Eritma nasos 4 bilan rekuperativ issiqlik almashtirgich 6 ga uzatiladi, u yerda regeneratordan chiqqan issiq eritma hisobiga ${f(c.Trin, 0)} K gacha isitiladi va regenerator 7 ning yuqori qismiga beriladi.`));
  add(P(`Regeneratorda 0,18 MPa bosim va ${f(c.Treg, 0)} K da eritmadan CO₂ ajraladi. Issiqlik qaynatgich 8 da 0,4 MPa bosimli suv bug‘i bilan beriladi. Regenerator tepasidan chiqqan CO₂ va suv bug‘i aralashmasi kondensator 9 da 313 K gacha sovitiladi, flegma yig‘gichi 10 da kondensat ajratiladi va nasos 11 bilan regenerator tepasiga flegma sifatida qaytariladi (bu MEA yo‘qotilishini kamaytiradi). Toza CO₂ (98–99 %) karbamid sexiga yuboriladi.`));
  add(P(`Regeneratsiyalangan eritma (α = ${f(c.aL, 2)}) regenerator kubidan ${f(c.Treg, 0)} K da chiqib, issiqlik almashtirgich 6 da ${f(c.TlhxOut, 0)} K gacha, suvli sovitgich 12 da 313 K gacha sovitiladi, filtr 13 da mexanik aralashmalar va degradatsiya mahsulotlaridan tozalanadi va nasos 5 bilan 2,8 MPa bosimda absorber tepasiga beriladi. Eritmaning 1–2 % i doimiy ravishda haydash qurilmasiga (rekuperatorga) yuborilib, termik barqaror tuzlardan tozalanadi; MEA va suv yo‘qotilishi omborxonadan to‘ldirib turiladi.`));
  add(P('Sexda avtomatik ravishda quyidagilar rostlanadi: absorber kubidagi eritma sathi; regeneratsiyalangan eritma sarfi (gaz sarfiga nisbatan); qaynatgichga beriladigan bug‘ sarfi (regenerator kubidagi harorat bo‘yicha); flegma yig‘gichidagi sath; absorberga beriladigan eritma harorati. Absorber kubida sath keskin pasayganda yuqori bosimli gazning past bosimli tizimga o‘tib ketishini oldini olish uchun boy eritma liniyasidagi klapan avtomatik yopiladi.'));

  // ============ 6
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`konvertlangan gaz sarfi (quruq, n.sh.): V = ${c.V} m³/soat = ${f(c.V / 3600, 5)} m³/s;`,
    'gaz tarkibi – 3.1-jadval; bosim P = 2,8 MPa; gaz harorati 313 K, suv bug‘i bilan to‘yingan;',
    `tozalangan gazda CO₂ miqdori y₂ = ${f(c.yCO2out * 100, 2)} % (quruq gazda);`,
    `yutuvchi – 20 % (massa) li MEA eritmasi; regeneratsiyalangan eritmaning to‘yinish darajasi α₁ = ${f(c.aL, 2)}, boy eritmaniki α₂ = ${f(c.aR, 2)} mol CO₂/mol MEA;`,
    'absorberga beriladigan eritma harorati 313 K, tozalangan gaz harorati 315 K;',
    'H₂, N₂, CO, CH₄, Ar ning eritmada fizik erishi hisobga olinmaydi (ular ekspanzerda ajraladi).']));
  add(H2('6.2. Gazning moddiy balansi'));
  add(F(`n_{q} = V/V_{m} = ${c.V}/22,414 = ${f(c.n_dry, 4)} kmol/soat = ${f(c.n_dry / 3.6, 4)} mol/s`, '6.1'));
  add(P(`Komponentlar miqdori n_{i} = y_{i}·n_{q}: H₂ – ${f(c.gin.H2, 4)}; N₂ – ${f(c.gin.N2, 4)}; CO₂ – ${f(c.gin.CO2, 4)}; CO – ${f(c.gin.CO, 4)}; CH₄ – ${f(c.gin.CH4, 4)}; Ar – ${f(c.gin.Ar, 4)} kmol/soat. 313 K da to‘yingan suv bug‘ining bosimi (Antuan tenglamasi) p_{s} = ${f(c.pH2O_in, 0)} Pa, gazdagi suv bug‘i:`));
  add(F(`n_{H₂O} = n_{q}·p_{s}/(P – p_{s}) = ${f(c.n_dry, 4)}·${f(c.pH2O_in, 0)}/(2 800 000 – ${f(c.pH2O_in, 0)}) = ${f(c.gin.H2O, 5)} kmol/soat`, '6.2'));
  add(P('Tozalangan gazdagi CO₂ miqdori n′_{CO₂} quyidagi shartdan topiladi: n′_{CO₂}/(n_{inert} + n′_{CO₂}) = y₂, bu yerda n_{inert} – CO₂ dan tashqari quruq gaz komponentlari yig‘indisi:'));
  add(F(`n′_{CO₂} = y₂·n_{inert}/(1 – y₂) = 0,0003·${f(c.n_dry - c.gin.CO2, 4)}/0,9997 = ${f(c.CO2out, 5)} kmol/soat`, '6.3'));
  add(F(`n_{yut} = n_{CO₂} – n′_{CO₂} = ${f(c.gin.CO2, 4)} – ${f(c.CO2out, 5)} = ${f(c.nabs, 4)} kmol/soat`, '6.4'));
  add(P(`Yutilgan CO₂: ${f(c.nabs, 4)} kmol/soat = ${f(c.nabs * Vm, 2)} m³/soat = ${f(c.mAbsCO2, 3)} kg/soat (${f(c.mAbsCO2 / 3600, 5)} kg/s). Tozalash darajasi η = ${f(c.nabs, 4)}/${f(c.gin.CO2, 4)} = ${f(c.eta * 100, 2)} %. Tozalangan gaz 315 K da eritma ustidagi suv bug‘i bilan muvozanatda bo‘ladi (p_{H₂O} = 0,92·p_{s}(315 K) = ${f(c.pH2O_out, 0)} Pa), undagi suv bug‘i ${f(c.gout.H2O, 5)} kmol/soat; demak, gazdan eritmaga ${f(-c.dH2O, 5)} kmol/soat (${f(-c.dH2O * 18.015, 3)} kg/soat) suv o‘tadi.`));
  add(T('6.1', 'Absorberga kiradigan konvertlangan gaz', gHead, gasRows(c.gin), W6));
  add(T('6.2', 'Absorberdan chiqadigan tozalangan gaz', gHead, gasRows(c.gout), W6));
  add(H2('6.3. MEA eritmasi sarfi'));
  add(P('Aylanadigan MEA miqdori yutilgan CO₂ va to‘yinish darajalari farqidan aniqlanadi:'));
  add(F(`n_{MEA} = n_{yut}/(α₂ – α₁) = ${f(c.nabs, 4)}/(${f(c.aR, 2)} – ${f(c.aL, 2)}) = ${f(c.nMEA, 4)} kmol/soat`, '6.5'));
  add(P(`MEA massasi m_{MEA} = ${f(c.nMEA, 4)}·61,08 = ${f(c.mMEA, 2)} kg/soat; 20 % li eritmadagi suv m_{s} = m_{MEA}·0,8/0,2 = ${f(c.mW, 2)} kg/soat; regeneratsiyalangan eritmadagi CO₂ m_{CO₂} = n_{MEA}·α₁·44,01 = ${f(c.mCO2L, 2)} kg/soat. Regeneratsiyalangan eritma sarfi:`));
  add(F(`L₁ = ${f(c.mMEA, 2)} + ${f(c.mW, 2)} + ${f(c.mCO2L, 2)} = ${f(c.mLean, 2)} kg/soat (${f(c.mLean / 3600, 4)} kg/s)`, '6.6'));
  add(P(`Eritmaning hajmiy sarfi V_{L} = L₁/ρ = ${f(c.mLean, 2)}/1010 = ${f(c.VL, 4)} m³/soat (${e(c.VL / 3600, 3)} m³/s). Solishtirma sarf – 1 m³ yutilgan CO₂ ga ${f(c.Lm3perCO2 * 1000, 1)} l eritma yoki 1000 m³ gazga ${f(c.VL / c.V * 1000, 2)} m³ eritma. Boy eritma sarfi: L₂ = L₁ + m_{yut} + m_{s,kond} = ${f(c.mLean, 2)} + ${f(c.mAbsCO2, 2)} + ${f(-c.dH2O * 18.015, 2)} = ${f(c.mRich, 2)} kg/soat.`));
  add(T('6.3', 'Absorberning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
    ['Konvertlangan gaz', f(mG_in, 3), ks(mG_in), 'Tozalangan gaz', f(mG_out, 3), ks(mG_out)],
    ['Regenerlangan eritma:', '', '', 'Boy eritma:', '', ''],
    ['– MEA', f(c.mMEA, 3), ks(c.mMEA), '– MEA', f(c.mMEA, 3), ks(c.mMEA)],
    ['– suv', f(c.mW, 3), ks(c.mW), '– suv', f(c.mW - c.dH2O * 18.015, 3), ks(c.mW - c.dH2O * 18.015)],
    ['– CO₂ (bog‘langan)', f(c.mCO2L, 3), ks(c.mCO2L), '– CO₂ (bog‘langan)', f(c.mCO2L + c.mAbsCO2, 3), ks(c.mCO2L + c.mAbsCO2)],
    B(['Jami', f(mG_in + c.mLean, 3), ks(mG_in + c.mLean), 'Jami', f(mG_out + c.mRich, 3), ks(mG_out + c.mRich)]),
  ], [1.7, 1, 1, 1.7, 1, 1]));
  add(P(`Kirim va sarf orasidagi farq ${f(Math.abs(mG_in + c.mLean - mG_out - c.mRich), 4)} kg/soat bo‘lib, yaxlitlash xatoligi chegarasida.`));
  add(H2('6.4. Regeneratorning moddiy balansi'));
  {
    const mStrip = c.nabs * c.rflux * 18.015;
    add(P(`Regeneratorda boy eritmadan ${f(c.nabs, 4)} kmol/soat CO₂ ajraladi. Regenerator tepasidan CO₂ bilan birga chiqadigan suv bug‘i miqdori (flegma soni R = ${f(c.rflux, 1)} kmol H₂O/kmol CO₂) ${f(mStrip, 2)} kg/soat; u kondensatorda to‘liq kondensatsiyalanib, flegma sifatida qaytariladi. Regeneratorning moddiy balansi 6.4-jadvalda keltirilgan.`));
    add(T('6.4', 'Regeneratorning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Boy eritma', f(c.mRich, 3), ks(c.mRich), 'Regenerlangan eritma', f(c.mLean - c.dH2O * 18.015, 3), ks(c.mLean - c.dH2O * 18.015)],
      ['Flegma', f(mStrip, 3), ks(mStrip), 'CO₂ + suv bug‘i', f(c.mAbsCO2 + mStrip, 3), ks(c.mAbsCO2 + mStrip)],
      B(['Jami', f(c.mRich + mStrip, 3), ks(c.mRich + mStrip), 'Jami', f(c.mLean - c.dH2O * 18.015 + c.mAbsCO2 + mStrip, 3), ks(c.mLean - c.dH2O * 18.015 + c.mAbsCO2 + mStrip)]),
    ], [1.7, 1, 1, 1.7, 1, 1]));
    add(P(`Regenerlangan eritma tarkibidagi absorberda kondensatsiyalangan ${f(-c.dH2O * 18.015, 3)} kg/soat ortiqcha suv flegma yig‘gichidan qisman chiqarib turiladi. Yillik ko‘rsatkichlar (8000 soat): tozalangan gaz – ${f(c.gout_dry * Vm * 8000 / 1e6, 3)}·10⁶ m³/yil; ajratib olingan CO₂ – ${f(c.mAbsCO2 * 8000 / 1000, 1)} t/yil; MEA yo‘qotilishi (1 t CO₂ ga 1,5 kg hisobida) – ${f(c.mAbsCO2 * 8 * 1.5 / 1000, 0)} kg/yil.`));
  }

  {
    add(H2('6.5. Ekspanzer va sexning umumiy moddiy balansi'));
    const bun = { H2: 0.0164, N2: 0.0118, CO: 0.0177, CH4: 0.0273, Ar: 0.0252 };
    const nd = t.sum(c.gin, ['H2O']); const rows = []; let tot = 0; const exp = {};
    for (const s_ of ['H2', 'N2', 'CO', 'CH4', 'Ar']) {
      const p_ = c.gin[s_] / t.sum(c.gin) * c.P / 1e6; // MPa
      const V_ = bun[s_] * p_ / 0.101325 * (c.mRich / 1060); exp[s_] = V_ / Vm; tot += V_;
      rows.push([NAMES[s_], f(bun[s_], 4), f(p_, 4), f(V_, 4), f(V_ / Vm, 5)]);
    }
    const co2e = 0.01 * c.nabs; exp.CO2 = co2e;
    rows.push([NAMES.CO2 + ' (1 % yutilganidan)', '–', '–', f(co2e * Vm, 4), f(co2e, 5)]);
    rows.push(B(['Jami', '', '', f(tot + co2e * Vm, 4), f((tot + co2e * Vm) / Vm, 5)]));
    add(P('Boy eritmada fizik erigan gazlar miqdori Genri qonuni bo‘yicha Bunzen koeffitsiyentlari (313 K, suv uchun [13]) orqali hisoblanadi: V_{i} = β_{i}·(p_{i}/P₀)·V_{L2}, bu yerda V_{L2} = L₂/ρ_{R} – boy eritmaning hajmiy sarfi. Ekspanzerda bosim 0,6 MPa gacha tushirilganda erigan gazlarning deyarli hammasi va bog‘langan CO₂ ning taxminan 1 % i ajraladi.'));
    add(T('6.5', 'Ekspanzer gazining miqdori', ['Komponent', 'β_{i}, m³/m³', 'p_{i}, MPa', 'V_{i}, m³/soat', 'n_{i}, kmol/soat'], rows, [1.6, 1, 1, 1, 1]));
    const mExp = t.mass(exp); const mCO2p = (c.nabs - co2e) * 44.01; const mPur = mG_out - t.mass({ H2: exp.H2, N2: exp.N2, CO: exp.CO, CH4: exp.CH4, Ar: exp.Ar });
    add(P(`Ekspanzer gazida yo‘qotiladigan vodorod ${f(exp.H2 * Vm, 3)} m³/soat – kiruvchi vodorodning ${f(exp.H2 / c.gin.H2 * 100, 2)} % i. Shu tuzatishlar bilan sexning umumiy moddiy balansi 6.6-jadvalda keltirilgan (suv balansi flegma bilan yopiladi).`));
    const mWx = -c.dH2O * 18.015;
    add(T('6.6', 'Tozalash sexining umumiy moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Konvertlangan gaz', f(mG_in, 3), ks(mG_in), 'Tozalangan gaz', f(mPur, 3), ks(mPur)],
      ['', '', '', 'CO₂ mahsulot (quruq)', f(mCO2p, 3), ks(mCO2p)],
      ['', '', '', 'Ekspanzer gazi', f(mExp, 3), ks(mExp)],
      ['', '', '', 'Ortiqcha suv (flegma yig‘gichidan)', f(mWx, 3), ks(mWx)],
      B(['Jami', f(mG_in, 3), ks(mG_in), 'Jami', f(mPur + mCO2p + mExp + mWx, 3), ks(mPur + mCO2p + mExp + mWx)]),
    ], [1.8, 1, 1, 1.8, 1, 1]));
  }
  // ============ 7
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Absorberning issiqlik balansi'));
  add(P('Absorberning issiqlik balansi tenglamasi (fizik issiqliklar 273,15 K ga nisbatan):'));
  add(F('Q_{g,kir} + Q_{L,kir} + Q_{abs} = Q_{g,chiq} + Q_{L,chiq} + Q_{bug‘} + Q_{yo‘q}', '7.1'));
  add(P(`Gaz bilan kiradigan issiqlik: Q_{g,kir} = Σn_{i}·∫c_{p,i}dT/3600 = ${f(c.Hgin, 3)} kW (issiqlik sig‘imlari c_{p} = a + bT + cT² + c′/T² tenglamasi bo‘yicha [2, 13]). Regenerlangan eritma bilan kiradigan issiqlik (c_{p} = ${f(c.cpL, 2)} kJ/(kg·K)):`));
  add(F(`Q_{L,kir} = L₁·c_{p}·(T_{L} – 273,15)/3600 = ${f(c.mLean, 2)}·${f(c.cpL, 2)}·40/3600 = ${f(c.HLin, 3)} kW`, '7.2'));
  add(F(`Q_{abs} = n_{yut}·ΔH_{abs}/3,6 = ${f(c.nabs, 4)}·${f(c.dHabs, 0)}/3,6 = ${f(c.Qabs, 3)} kW`, '7.3'));
  add(P(`Tozalangan gaz bilan chiqadigan issiqlik Q_{g,chiq} = ${f(c.Hgout, 3)} kW; suv bug‘ining kondensatsiyasi issiqligi Q_{bug‘} = ${f(c.Qevap, 4)} kW (manfiy – ya’ni issiqlik ajraladi); yo‘qotishlar kirimning ${f(c.lossA * 100, 0)} % i: Q_{yo‘q} = ${f(c.Qloss, 3)} kW. Boy eritma bilan chiqadigan issiqlik balansdan:`));
  add(F(`Q_{L,chiq} = ${f(c.Qin, 3)} – ${f(c.Hgout, 3)} – (${f(c.Qevap, 4)}) – ${f(c.Qloss, 3)} = ${f(c.HLout, 3)} kW`, '7.4'));
  add(F(`T_{R} = 273,15 + Q_{L,chiq}·3600/(L₂·c_{p,R}) = 273,15 + ${f(c.HLout, 3)}·3600/(${f(c.mRich, 2)}·${f(c.cpLr, 2)}) = ${f(c.TR, 1)} K`, '7.5'));
  add(T('7.1', 'Absorberning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
    ['Gaz bilan', f(c.Hgin, 3), f(c.Hgin / c.Qin * 100, 1), 'Tozalangan gaz bilan', f(c.Hgout, 3), f(c.Hgout / c.Qin * 100, 1)],
    ['Regenerlangan eritma bilan', f(c.HLin, 3), f(c.HLin / c.Qin * 100, 1), 'Boy eritma bilan', f(c.HLout, 3), f(c.HLout / c.Qin * 100, 1)],
    ['Absorbsiya issiqligi', f(c.Qabs, 3), f(c.Qabs / c.Qin * 100, 1), 'Suv bug‘i kondensatsiyasi', f(c.Qevap, 3), f(c.Qevap / c.Qin * 100, 1)],
    ['', '', '', 'Yo‘qotishlar', f(c.Qloss, 3), f(c.Qloss / c.Qin * 100, 1)],
    B(['Jami', f(c.Qin, 3), '100', 'Jami', f(c.Hgout + c.HLout + c.Qevap + c.Qloss, 3), '100']),
  ], [1.9, 0.8, 0.6, 1.9, 0.8, 0.6]));
  add(P(`Boy eritma harorati ${f(c.TR, 1)} K. Bu haroratda α₂ = ${f(c.aR, 2)} li eritma ustidagi CO₂ ning muvozanat bosimi (2.4) bo‘yicha p* = ${f(c.peqR, 1)} kPa, absorber pastidagi gazda esa p_{CO₂} = ${f(c.pBot, 1)} kPa; muvozanat to‘yinish darajasi α* = ${f(c.aReq, 3)}. Demak, qabul qilingan α₂ = ${f(c.aR, 2)} muvozanat qiymatining ${f(c.aR / c.aReq * 100, 0)} % ini tashkil etadi va jarayon uchun yetarli harakatlantiruvchi kuch saqlanadi.`));
  add(H2('7.2. Rekuperativ issiqlik almashtirgich'));
  add(P(`Boy eritma ${f(c.TR, 1)} K dan ${f(c.Trin, 0)} K gacha isitiladi:`));
  add(F(`Q₆ = L₂·c_{p,R}·(T₂ – T₁)/3600 = ${f(c.mRich, 2)}·${f(c.cpLr, 2)}·(${f(c.Trin, 0)} – ${f(c.TR, 1)})/3600 = ${f(c.Qhx, 2)} kW`, '7.6'));
  add(P(`Regenerlangan eritmaning chiqish harorati T = ${f(c.Treg, 0)} – Q₆·3600/(L₁·c_{p}) = ${f(c.TlhxOut, 1)} K. Haroratlar farqi: issiq uchida ${f(c.dT1, 1)} K, sovuq uchida ${f(c.dT2, 1)} K, o‘rtacha logarifmik Δt = ${f(c.dTlog_hx, 1)} K. Issiqlik uzatish koeffitsiyenti K = ${c.Khx} W/(m²·K) (suyuqlik–suyuqlik, qobiq-quvurli) bo‘lganda kerakli yuza F₆ = Q₆/(K·Δt) = ${f(c.Fhx, 2)} m².`));
  add(H2('7.3. Eritma sovitgichi'));
  add(F(`Q₁₂ = L₁·c_{p}·(${f(c.TlhxOut, 1)} – 313,15)/3600 = ${f(c.Qcool, 2)} kW`, '7.7'));
  add(P(`Sovituvchi suv 298 K dan 308 K gacha isiydi, uning sarfi G_{s} = Q₁₂/(c_{s}·Δt) = ${f(c.Gw, 0)} kg/soat (${f(c.Gw / 3600, 3)} kg/s). Δt_{o‘r} = ${f(c.dTlog_c, 1)} K, K = ${c.Kc} W/(m²·K), yuza F₁₂ = ${f(c.Fc, 2)} m².`));
  add(H2('7.4. Regenerator va qaynatgich'));
  add(P(`Qaynatgichning issiqlik yuklamasi quyidagilardan iborat: boy eritmani ${f(c.Trin, 0)} K dan ${f(c.Treg, 0)} K gacha isitish Q_{1} = ${f(c.Qsens, 2)} kW; CO₂ desorbsiyasi Q_{2} = ${f(c.Qdes, 2)} kW; puflovchi suv bug‘ini hosil qilish Q_{3} = n_{yut}·R·18,015·2260/3600 = ${f(c.Qstrip, 2)} kW; yo‘qotishlar ${f(c.lossD * 100, 0)} %:`));
  add(F(`Q_{qay} = (Q₁ + Q₂ + Q₃)/(1 – 0,05) = ${f(c.Qreb, 2)} kW`, '7.8'));
  add(P(`0,4 MPa bosimli to‘yingan bug‘ (T = 416,8 K, r = ${c.r_st} kJ/kg) sarfi G_{b} = Q_{qay}·3600/r = ${f(c.Gst, 1)} kg/soat (${f(c.Gst / 3600, 4)} kg/s). Solishtirma issiqlik sarfi ${f(c.qspec, 2)} MJ/kg CO₂ – bu 20 % li MEA eritmasi uchun adabiyotdagi qiymatlarga (4,5–6 MJ/kg) mos keladi. Qaynatgich yuzasi (K = ${c.Kreb} W/(m²·K), Δt = ${f(c.dTreb, 1)} K) F₈ = ${f(c.Freb, 2)} m².`));
  add(P(`Kondensator 9 ning issiqlik yuklamasi (suv bug‘ini kondensatsiyalash, CO₂ va kondensatni 368 K dan 313 K gacha sovitish) Q₉ = ${f(c.Qcond, 2)} kW, Δt_{o‘r} = ${f(c.dTcond, 1)} K, K = ${c.Kcond} W/(m²·K), F₉ = ${f(c.Fcond, 2)} m².`));
  add(T('7.2', 'Regeneratorning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
    ['Qaynatgichda bug‘ bilan', f(c.Qreb, 2), '100', 'Eritmani isitish', f(c.Qsens, 2), f(c.Qsens / c.Qreb * 100, 1)],
    ['', '', '', 'CO₂ desorbsiyasi', f(c.Qdes, 2), f(c.Qdes / c.Qreb * 100, 1)],
    ['', '', '', 'Puflovchi bug‘', f(c.Qstrip, 2), f(c.Qstrip / c.Qreb * 100, 1)],
    ['', '', '', 'Yo‘qotishlar', f(c.Qreb * c.lossD, 2), f(c.lossD * 100, 1)],
    B(['Jami', f(c.Qreb, 2), '100', 'Jami', f(c.Qreb, 2), '100']),
  ], [1.9, 0.8, 0.6, 1.9, 0.8, 0.6]));

  add(H2('7.5. Energetik sarflar'));
  {
    const elec = c.Npump * 2 + 0.3 + 0.2;
    add(T('7.3', 'Tozalash sexining energetik sarflari (1 soatga va 1000 m³ gazga)', ['Energiya turi', '1 soatga', '1 sekundga (SI)', '1000 m³ gazga'], [
      ['Bug‘ 0,4 MPa, kg', f(c.Gst, 1), f(c.Gst / 3600, 4) + ' kg/s', f(c.Gst / c.V * 1000, 0)],
      ['Sovituvchi suv (eritma sovitgichi), kg', f(c.Gw, 0), f(c.Gw / 3600, 3) + ' kg/s', f(c.Gw / c.V * 1000, 0)],
      ['Sovituvchi suv (kondensator), kg', f(c.Qcond / (4.18 * 10) * 3600, 0), f(c.Qcond / (4.18 * 10), 3) + ' kg/s', f(c.Qcond / (4.18 * 10) * 3600 / c.V * 1000, 0)],
      ['Elektr energiyasi, kW·soat', f(elec, 2), f(elec, 2) + ' kW', f(elec / c.V * 1000, 1)],
      ['MEA (yo‘qotish), kg', f(c.mAbsCO2 * 1.5 / 1000, 3), e(c.mAbsCO2 * 1.5 / 1000 / 3600, 2) + ' kg/s', f(c.mAbsCO2 * 1.5 / 1000 / c.V * 1000, 2)],
    ], [2.4, 1, 1.2, 1]));
    add(P(`Asosiy energetik sarf – regeneratsiya uchun bug‘ (${f(c.Qreb, 1)} kW). Uni kamaytirish yo‘llari: rekuperativ issiqlik almashtirgichda haroratlar farqini 10 K gacha kamaytirish; ikki oqimli sxemani qo‘llash; regeneratsiya uchun CO konversiyasidan keyingi gaz issiqligidan (1-bosqich issiqlik almashtirgichi) foydalanish; aktivlangan MDEA eritmalariga o‘tish.`));
  }

  // ============ 8
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(P('Asosiy apparat – ikki seksiyali nasadkali absorber. Hisob quyidagi tartibda bajariladi: fizik xossalarni aniqlash; nasadka turini tanlash va tiqilish tezligi bo‘yicha diametrni hisoblash; massa uzatish birliklari sonini va nasadka balandligini aniqlash; gidravlik qarshilik, devor qalinligi va shtutserlarni hisoblash.'));
  add(H2('8.1. Gaz va suyuqlik oqimlari'));
  add(P(`Gazning massaviy sarfi G = ${f(mG_in, 3)}/3600 = ${f(c.mG, 5)} kg/s; ish sharoitida zichligi ρ_{g} = ${f(c.rhoG, 2)} kg/m³; hajmiy sarfi V_{g} = G/ρ_{g} = ${f(c.Vg, 6)} m³/s. Suyuqlik sarfi L = ${f(c.Lkg, 5)} kg/s, zichligi ρ_{L} = 1010 kg/m³, dinamik qovushoqligi μ_{L} = ${f(c.muL, 2)} mPa·s.`));
  add(H2('8.2. Absorber diametri'));
  add(P('Nasadkali kolonnada tiqilish (zahlanish) tezligi quyidagi tenglama bo‘yicha aniqlanadi [14]:'));
  add(F('lg[w²_{t}·a·ρ_{g}·μ_{L}^{0,16}/(g·ε³·ρ_{L})] = A – 1,75·(L/G)^{0,25}·(ρ_{g}/ρ_{L})^{0,125}', '8.1'));
  add(P(`bu yerda a – nasadkaning solishtirma yuzasi, m²/m³; ε – erkin hajm, m³/m³; μ_{L} – mPa·s; A = ${f(c.A, 3)} (tartibsiz to‘kilgan Rashig halqalari uchun). O‘ng tomon (L/G = ${f(c.Lkg / c.mG, 3)}, ρ_{g}/ρ_{L} = ${f(c.rhoG / 1010, 4)}): ${f(c.fl.rhs, 4)}. Ish tezligi tiqilish tezligining 75 % i deb olinib, diametr D = (4V_{g}/(π·w))^{0,5} formula bo‘yicha turli nasadkalar uchun hisoblandi (8.1-jadval).`));
  add(T('8.1', 'Turli nasadkalar uchun absorber diametrini hisoblash', ['Keramik Rashig halqalari, mm', 'a, m²/m³', 'ε, m³/m³', 'w_{t}, m/s', 'w = 0,75w_{t}, m/s', 'D, m', 'D/d'],
    c.flood.map(p => [p.name, f(p.a, 0), f(p.e, 3), f(p.w, 4), f(p.wr, 4), f(p.D, 3), f(p.Dd, 1)]), [1.6, 0.8, 0.8, 0.9, 1, 0.8, 0.7]));
  add(P(`Gazning bir tekis taqsimlanishi uchun kolonna diametrining nasadka o‘lchamiga nisbati D/d ≥ 10 bo‘lishi kerak. Bu shartni faqat 15×15×2 mm li halqalar qanoatlantiradi. Normallashtirilgan diametr D = ${f(c.D * 1000, 0)} mm qabul qilinadi (D/d = ${f(c.D / c.pk.d, 1)}). Kesim yuzasi S = ${f(c.S, 5)} m², gazning haqiqiy fiktiv tezligi w = ${f(c.w, 4)} m/s, ya’ni tiqilish tezligining ${f(c.wfrac * 100, 0)} % i – barqaror plyonkali rejim ta’minlanadi.`));
  add(P(`Nasadkaning namlanishini tekshiramiz. Sug‘orish zichligi U = V_{L}/S = ${f(c.VL, 4)}/${f(c.S, 5)} = ${f(c.U, 1)} m³/(m²·soat). Minimal samarali sug‘orish zichligi U_{min} = a·q_{ef} = ${f(c.pk.a, 0)}·2,2·10⁻⁵·3600 = ${f(c.Umin, 1)} m³/(m²·soat), bu yerda q_{ef} = 2,2·10⁻⁵ m²/s – halqali nasadkalar uchun samarali namlanish ko‘rsatkichi. U > U_{min}, demak nasadka to‘liq namlanadi (ψ = 1).`));
  add(H2('8.3. Massa uzatish birliklari soni'));
  add(P(`Gaz fazasidagi CO₂ konsentratsiyasini inert gazga nisbatan nisbiy mol ulushlarda ifodalaymiz: inert gaz G_{in} = ${f(c.Gin, 4)} kmol/soat, Y₁ = ${f(c.Y1, 5)}, Y₂ = ${f(c.Y2, 6)}. Ishchi chiziq tenglamasi (eritma to‘yinish darajasi bilan bog‘liqlik):`));
  add(F(`α = α₁ + (Y – Y₂)·G_{in}/n_{MEA} = ${f(c.aL, 2)} + ${f(c.Gin / c.nMEA, 4)}·(Y – Y₂)`, '8.2'));
  add(P('Eritma harorati absorber balandligi bo‘yicha 313 K dan T_{R} gacha α ga proporsional o‘zgaradi deb qabul qilinadi. Har bir Y uchun muvozanat qiymati Y* = y*/(1 – y*), y* = p*(α, T)/P (2.4) tenglama bo‘yicha topiladi. Umumiy massa uzatish birliklari soni:'));
  add(F('n_{oy} = ∫dY/(Y – Y*)  (Y₂ dan Y₁ gacha)', '8.3'));
  add(T('8.2', 'Absorber bo‘yicha konsentratsiyalar profili va integral osti funksiyasi', ['Y', 'α, mol/mol', 'T, K', 'Y*', '1/(Y – Y*)'],
    c.prof.map(r => [f(r[0], 5), f(r[1], 3), f(r[2], 1), e(r[3], 2), f(r[4], 2)]), [1, 1, 1, 1, 1]));
  add(P(`Integral trapetsiyalar usulida (2000 qadam) sonli hisoblandi: n_{oy} = ${f(c.NOY, 3)}. Taqqoslash uchun, agar muvozanat bosimi e’tiborga olinmasa (Y* = 0), n_{oy} = ln(Y₁/Y₂) = ${f(Math.log(c.Y1 / c.Y2), 3)}; farqning kichikligi kimyoviy absorbsiyada qarshi bosimning kichik ekanligini ko‘rsatadi.`));
  add(P('Ishchi va muvozanat chiziqlari 8.2-rasmda tasvirlangan. Ular orasidagi masofa butun absorber bo‘yicha katta, ya’ni jarayon asosan gaz fazasi va reaksiya zonasidagi massa uzatish bilan cheklanadi.'));
  add(IMG(path.join(FIG, 'chiziqlar.png'), 430, 282, '8.2-rasm. Absorbsiyaning ishchi va muvozanat chiziqlari (Y – logarifmik shkalada)'));
  add(H2('8.4. Nasadka balandligi'));
  add(P(`MEA eritmalari bilan CO₂ ni yutishda keramik halqali nasadkalar uchun o‘rtacha hajmiy massa uzatish koeffitsiyenti K_{G}a = (1,5–4,0)·10⁻⁵ mol/(m³·s·Pa) ni tashkil etadi [10, 12]; absorber pastki qismida eritmaning yuqori to‘yinishini hisobga olib K_{G}a = ${e(c.KGa, 1)} mol/(m³·s·Pa) qabul qilamiz. Nisbiy konsentratsiyalardagi koeffitsiyent:`));
  add(F(`K_{Y}a = K_{G}a·P = ${e(c.KGa, 1)}·2,8·10⁶ = ${f(c.KYa * 1000, 1)} mol/(m³·s) = ${f(c.KYa, 4)} kmol/(m³·s)`, '8.4'));
  add(F(`h_{oy} = G_{in}/(S·K_{Y}a·ψ) = ${f(c.Gin / 3600, 6)}/(${f(c.S, 5)}·${f(c.KYa, 4)}·1) = ${f(c.hOY, 3)} m`, '8.5'));
  add(F(`H_{n} = n_{oy}·h_{oy} = ${f(c.NOY, 3)}·${f(c.hOY, 3)} = ${f(c.Hn, 3)} m`, '8.6'));
  add(P(`Gaz va suyuqlikning notekis taqsimlanishi va eritma ko‘piklanishini hisobga olib, ${f(c.kres, 2)} zaxira koeffitsiyenti bilan nasadka balandligi ${f(c.Hnp, 2)} m. Nasadka har biri ${f(c.Hsec, 1)} m dan iborat ikki seksiyaga bo‘linadi (seksiya balandligi 15 mm li halqalar uchun ruxsat etilgan (15–20)·D = 3–4 m dan oshmaydi). Umumiy nasadka balandligi H = ${f(c.Hpack, 1)} m, hajmi V_{n} = ${f(c.Vpack, 4)} m³, massasi m = V_{n}·ρ_{n} = ${f(c.mpack, 1)} kg.`));
  {
    const dpl = (c.pBot - c.peqR - (c.pTop - c.peqL)) / Math.log((c.pBot - c.peqR) / (c.pTop - c.peqL)) * 1000;
    const Nchk = c.KGa * c.Vpack * dpl * 3.6;
    add(P(`Tekshiruv. Harakatlantiruvchi kuch absorber pastida Δp₁ = ${f(c.pBot, 1)} – ${f(c.peqR, 1)} = ${f(c.pBot - c.peqR, 1)} kPa, tepasida Δp₂ = ${f(c.pTop, 3)} – ${f(c.peqL, 3)} = ${f(c.pTop - c.peqL, 3)} kPa, o‘rtacha logarifmik Δp = ${f(dpl / 1000, 2)} kPa. Qabul qilingan nasadka hajmida yutilishi mumkin bo‘lgan CO₂: N = K_{G}a·V_{n}·Δp = ${e(c.KGa, 1)}·${f(c.Vpack, 4)}·${f(dpl, 0)} = ${f(Nchk / 3.6, 3)} mol/s (${f(Nchk, 3)} kmol/soat) > n_{yut} = ${f(c.nabs, 4)} kmol/soat. Shart bajariladi.`));
  }
  add(H2('8.5. Gidravlik qarshilik'));
  add(P(`Gaz uchun Reynolds soni Re = 4w·ρ_{g}/(a·μ_{g}) = 4·${f(c.w, 4)}·${f(c.rhoG, 2)}/(${f(c.pk.a, 0)}·${e(c.muG, 2)}) = ${f(c.Reg, 0)}. Re > 40 bo‘lgani uchun qarshilik koeffitsiyenti λ = 16/Re^{0,2} = ${f(c.lam, 3)}. Quruq nasadka qarshiligi:`));
  add(F(`ΔP_{q} = λ·(H/d_{e})·ρ_{g}·w²/(2ε²) = ${f(c.lam, 3)}·(${f(c.Hpack, 1)}/${f(c.pk.de, 4)})·${f(c.rhoG, 2)}·${f(c.w, 4)}²/(2·${f(c.pk.e, 2)}²) = ${f(c.dPdry, 1)} Pa`, '8.7'));
  add(F(`ΔP_{n} = ΔP_{q}·10^{b·U} = ${f(c.dPdry, 1)}·10^{${c.pk.b}·${f(c.Us, 5)}} = ${f(c.dPwet, 0)} Pa`, '8.8'));
  add(P(`bu yerda b = ${c.pk.b} – 15 mm li halqalar uchun koeffitsiyent, U = ${f(c.Us, 5)} m³/(m²·s). Taqsimlagichlar, tomchi ushlagich va shtutserlar qarshiligini qo‘shib (≈ 1,5 kPa), absorberning umumiy gidravlik qarshiligi ≈ ${f((c.dPwet + 1500) / 1000, 2)} kPa.`));
  add(H2('8.6. Absorberning umumiy balandligi'));
  add(P(`Absorber balandligi quyidagilardan tashkil topadi: nasadka seksiyalari 2·${f(c.Hsec, 1)} m; seksiyalar orasidagi qayta taqsimlagich zonasi 0,8 m; yuqori qism (suyuqlik taqsimlagich, tomchi ushlagich) 0,8 m; gaz kirish zonasi 0,6 m; kub qismi 1,0 m; elliptik qopqoq va tub 0,3 m. Umumiy balandlik H_{a} = ${f(c.Htot, 1)} m. Kubdagi suyuqlik sathi 0,6 m bo‘lganda boy eritmaning kubda bo‘lish vaqti τ = S·h/V_{L} = ${f(c.tauBot, 0)} s – bu sath rostlagichining barqaror ishlashi uchun yetarli; asosiy bufer hajm ekspanzer 3 da ko‘zda tutiladi.`));
  {
    add(H2('8.7. Boy eritma to‘yinish darajasining ta’siri'));
    const rows = [];
    for (const aR of [0.40, 0.45, 0.48]) {
      const nM = c.nabs / (aR - c.aL); const mL = nM * c.M_MEA / c.wMEA + nM * c.aL * c.M_CO2; const mR = mL + c.mAbsCO2 - c.dH2O * 18.015;
      const HL = (c.Hgin + mL * c.cpL * 40 / 3600 + c.Qabs) * (1 - c.lossA) - c.Hgout - c.Qevap;
      const TR = 273.15 + HL * 3600 / (mR * c.cpLr);
      let I = 0, prev = null; const N = 2000;
      for (let i = 0; i <= N; i++) {
        const Y = c.Y2 + (c.Y1 - c.Y2) * i / N; const a = c.aL + (Y - c.Y2) * c.Gin / nM;
        const Tt = c.Ttop - 2 + (TR - c.Ttop + 2) * (a - c.aL) / (aR - c.aL);
        const ys = c.peq(Math.min(a, 0.499), Tt) * 1000 / c.P; const fv = 1 / (Y - ys / (1 - ys));
        if (prev !== null) I += (fv + prev) / 2 * (c.Y1 - c.Y2) / N; prev = fv;
      }
      const H = I * c.hOY * c.kres;
      const Qreb = (mR * c.cpLr * (c.Treg - c.Trin) / 3600 + c.Qdes + c.Qstrip) / (1 - c.lossD);
      rows.push([f(aR, 2), f(mL, 1), f(mL / 3600, 4), f(TR, 1), f(I, 2), f(H, 2), f(Qreb, 1), f(Qreb * 3600 / c.mAbsCO2 / 1000, 2)]);
    }
    add(P('Boy eritmaning to‘yinish darajasi α₂ eritma sarfi, absorber balandligi va regeneratsiya issiqligiga qanday ta’sir etishini aniqlash uchun hisob α₂ ning uch qiymati uchun takrorlandi (α₁ = 0,15, D = 200 mm, qolgan shartlar o‘zgarmas). Natijalar 8.3-jadvalda keltirilgan.'));
    add(T('8.3', 'α₂ ning absorber va regenerator ko‘rsatkichlariga ta’siri', ['α₂', 'L₁, kg/soat', 'L₁, kg/s', 'T_{R}, K', 'n_{oy}', 'H_{n} (zaxira bilan), m', 'Q_{qay}, kW', 'q, MJ/kg CO₂'], rows, [0.6, 1, 0.9, 0.8, 0.7, 1.1, 0.9, 1]));
    add(P('Jadvaldan ko‘rinadiki, α₂ ning ortishi eritma sarfini va regeneratsiyaga issiqlik sarfini kamaytiradi. Massa uzatish birliklari soni va nasadka balandligi deyarli o‘zgarmaydi, chunki kimyoviy absorbsiyada eritma ustidagi CO₂ ning muvozanat bosimi gazdagi partsial bosimdan ancha kichik. Biroq α₂ ortgan sari boy eritma harorati ko‘tariladi, eritma muvozanat holatiga (α* ≈ 0,49) yaqinlashadi va gaz yuklamasi o‘zgarganda tozalash darajasi beqaror bo‘lib qoladi; bundan tashqari, α₂ > 0,45 da uglerodli po‘latlar korroziyasi keskin kuchayadi. Shu sababli α₂ = 0,45 maqbul qiymat sifatida qabul qilingan.'));
  }
  add(H2('8.8. Devor qalinligi va shtutserlar'));
  add(P(`Absorber korpusi 12Х18Н10Т zanglamas po‘latdan tayyorlanadi (MEA eritmasi va CO₂ korroziyasiga chidamli). Hisobiy bosim P_{h} = 1,1·2,8 = ${f(c.Pr, 2)} MPa, 333 K da [σ] = ${c.sigma} MPa, φ = ${f(c.phi, 1)}, c = ${c.cc} mm:`));
  add(F(`s = P_{h}·D/(2φ[σ] – P_{h}) + c = ${f(c.Pr, 2)}·${f(c.D * 1000, 0)}/(2·0,9·${c.sigma} – ${f(c.Pr, 2)}) + ${c.cc} = ${f(c.sR + c.cc, 2)} mm`, '8.9'));
  add(P(`Texnologik va montaj talablarini hisobga olib devor qalinligi s = ${c.s} mm qabul qilinadi (219×${c.s} mm quvurdan tayyorlash mumkin). Shtutserlar diametri d = (4V/(πw))^{0,5}: gaz uchun (w = 15 m/s) d = ${f(c.nozG.d * 1000, 1)} mm → Dy 25 mm; regenerlangan eritma uchun (w = 1 m/s) d = ${f(c.nozL.d * 1000, 1)} mm → Dy 25 mm; boy eritma uchun (w = 0,5 m/s, o‘z oqimi bilan) d = ${f(c.nozR.d * 1000, 1)} mm → Dy 32 mm.`));
  {
    add(H2('8.9. Suyuqlik taqsimlagichi va tayanch panjara'));
    const VLs = c.VL / 3600, h0 = 0.10, mu0 = 0.62, d0 = 0.005;
    const w0 = mu0 * Math.sqrt(2 * 9.81 * h0); const n0 = VLs / (Math.PI * d0 * d0 / 4 * w0);
    add(P(`Absorber tepasida trubkali (“o‘rgimchak” turidagi) suyuqlik taqsimlagich o‘rnatiladi. Teshiklar diametri d₀ = 5 mm, ulardagi suyuqlik ustuni h = 0,10 m, sarf koeffitsiyenti μ₀ = 0,62 bo‘lganda oqib chiqish tezligi w₀ = μ₀·(2gh)^{0,5} = ${f(w0, 3)} m/s. Teshiklar soni:`));
    add(F(`n = V_{L}/(0,785·d₀²·w₀) = ${e(VLs, 3)}/(0,785·0,005²·${f(w0, 3)}) = ${f(n0, 1)}`, '8.10'));
    add(P(`${Math.ceil(n0)} ta teshik qabul qilinadi; bu kolonna kesimining 1 m² iga ${f(Math.ceil(n0) / c.S, 0)} ta sug‘orish nuqtasini beradi (tavsiya etilgan qiymat ≥ 100 m⁻²). Seksiyalar orasida konus shaklidagi qayta taqsimlagich o‘rnatiladi – u devor bo‘ylab oqayotgan suyuqlikni markazga yo‘naltiradi.`));
    const ff = 0.75; const wpan = c.w / ff;
    add(P(`Nasadka 12Х18Н10Т po‘latidan tayyorlangan panjarasimon tayanchga to‘kiladi. Panjara erkin kesimi nasadka g‘ovakligidan kam bo‘lmasligi kerak: ${f(ff * 100, 0)} % qabul qilinadi (ε = ${f(c.pk.e * 100, 0)} %). Panjara teshiklarida gaz tezligi ${f(wpan, 3)} m/s, bu tiqilish tezligidan ancha past. Panjaraga tushadigan yuk: nasadka ${f(c.mpack / 2, 1)} kg va ushlanib turgan suyuqlik ${f(c.mL_hold / 2, 1)} kg (bir seksiya uchun), ya’ni ${f((c.mpack + c.mL_hold) / 2 * 9.81 / c.S / 1000, 1)} kPa solishtirma bosim – panjara qalinligi 4 mm bo‘lgan po‘lat polosalardan yasalganda mustahkamlik ta’minlanadi.`));
    add(H2('8.10. Regeneratorning qisqacha hisobi'));
    const rhoV = c.Pd * 0.018 / (8.314 * c.Treg);
    add(P(`Regenerator 0,18 MPa da ishlaydi. Kubdagi bug‘ zichligi ρ_{b} = P·M/(RT) = ${f(rhoV, 3)} kg/m³, bug‘ sarfi ${f(c.Vvap_bot, 4)} m³/s. 25×25×3 mm li halqalar uchun tiqilish tezligi (8.1) tenglama bo‘yicha ≈ 0,8 m/s, ish tezligi 0,6 m/s qabul qilinib, diametr D = ${f(c.Dd, 3)} m → 300 mm. Desorbsiya uchun kerakli nazariy tarelkalar soni MEA regeneratorlari uchun 8–12 [10]; 10 ta qabul qilinib, nasadkaning ekvivalent balandligi h_{ekv} = 0,6 m da nasadka balandligi H = 10·0,6 = 6,0 m (ikki seksiya × 3 m). Flegmani yuvish uchun nasadka ustida 2 ta elaksimon tarelka o‘rnatiladi. Regeneratorning umumiy balandligi ≈ 10 m.`));
  }
  add(IMG(path.join(FIG, 'absorber.png'), 300, 435, '8.1-rasm. Nasadkali absorberning sxematik chizmasi'));
  add(T('8.4', 'Absorber hisobining asosiy natijalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['Gaz sarfi, m³/s (n.sh.) / kg/s', `${f(c.V / 3600, 5)} / ${f(c.mG, 5)}`], ['Eritma sarfi, kg/s', f(c.Lkg, 4)],
    ['Bosim, MPa / harorat, K', `2,8 / 313–${f(c.TR, 0)}`], ['Nasadka', 'Keramik Rashig halqalari 15×15×2 mm'],
    ['Diametr, m', f(c.D, 2)], ['Gaz tezligi, m/s (tiqilishning %)', `${f(c.w, 4)} (${f(c.wfrac * 100, 0)} %)`],
    ['Massa uzatish birliklari soni', f(c.NOY, 2)], ['Nasadka balandligi, m', `${f(c.Hpack, 1)} (2 × ${f(c.Hsec, 1)})`],
    ['Apparat balandligi, m', f(c.Htot, 1)], ['Gidravlik qarshilik, kPa', f((c.dPwet + 1500) / 1000, 2)], ['Devor qalinligi, mm', String(c.s)],
  ], [2.5, 2]));

  // ============ 9
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Apparatlar soni n = V_{talab}/V_{bir} formula bo‘yicha aniqlanadi; V_{talab} – talab etilgan unumdorlik (gaz sarfi, issiqlik almashinish yuzasi), V_{bir} – bitta standart apparatning unumdorligi.'));
  add(P(`Absorber. D = 200 mm li apparat tiqilish tezligining ${f(c.wfrac * 100, 0)} % ida ishlaganda o‘tkazadigan maksimal gaz sarfi (w = 0,75w_{t}): V_{max} = 0,75·${f(c.fl.w, 4)}·${f(c.S, 5)}·3600 = ${f(0.75 * c.fl.w * c.S * 3600, 2)} m³/soat (ish sharoitida), talab etilgani ${f(c.Vg * 3600, 2)} m³/soat. n = ${f(c.Vg / (0.75 * c.fl.w * c.S), 2)} → 1 dona.`));
  add(P(`Regenerator. Kolonna kubida qaynatgichdan keladigan bug‘ sarfi V = ${f(c.Vvap_bot, 4)} m³/s, bug‘ning ruxsat etilgan tezligi 0,6 m/s; kerakli diametr D = ${f(c.Dd, 3)} m. D = 300 mm li 1 ta regenerator qabul qilinadi (nasadka – 25×25×3 mm halqalar, ikki seksiya, har biri 3 m).`));
  const Ftab = [[6, c.Fhx, 'Rekuperativ issiqlik almashtirgich', 4], [12, c.Fc, 'Eritma sovitgichi', 4], [8, c.Freb, 'Qaynatgich', 4], [9, c.Fcond, 'Kondensator', 2]];
  add(T('9.1', 'Issiqlik almashinish apparatlari sonini hisoblash', ['Poz.', 'Apparat', 'F_{hisob}, m²', 'F_{standart}, m²', 'n_{hisob}', 'Qabul qilingan'],
    Ftab.map(r => [String(r[0]), r[2], f(r[1], 2), f(r[3], 0), f(r[1] / r[3], 2), '1']), [0.5, 2.5, 1, 1, 0.8, 1]));
  add(P(`Nasoslar. Regenerlangan eritma nasosi 5: hajmiy sarf ${f(c.VL, 3)} m³/soat, napor H = (P_{abs} – P_{reg})/(ρg) + 20 = ${f(c.Hpump, 0)} m, FIK 0,55 bo‘lganda quvvat N = ρ·g·Q·H/η = ${f(c.Npump, 2)} kW. Plunjerli dozalovchi nasos (НД 1,0–1000/40) qabul qilinadi: 1 ishchi + 1 zaxira. Boy eritma nasosi 4 va flegma nasosi 11 – markazdan qochma, har biri 1 ishchi + 1 zaxira.`));
  add(P('Separator 1, ekspanzer 3, flegma yig‘gichi 10 va filtr 13 hajm va gaz tezligi bo‘yicha tanlanadi; ularning har biridan bitta o‘rnatiladi.'));  {
    const wdop = 0.06 * Math.sqrt((992 - c.rhoG) / c.rhoG); const Ds = Math.sqrt(4 * c.Vg / (Math.PI * wdop));
    const Vexp = (c.mRich / 1060) * 5 / 60 / 0.6;
    add(P(`Separator 1. Gazning ruxsat etilgan tezligi w = 0,06·((ρ_{s} – ρ_{g})/ρ_{g})^{0,5} = ${f(wdop, 3)} m/s, kerakli diametr D = (4V_{g}/(πw))^{0,5} = ${f(Ds, 3)} m. Tomchi ushlagich va sath o‘lchagichni joylashtirish uchun D = 200 mm, H = 1,0 m qabul qilinadi; n = 1.`));
    add(P(`Ekspanzer 3. Boy eritmaning bo‘lish vaqti 5 min, to‘ldirish koeffitsiyenti 0,6 bo‘lganda kerakli hajm V = V_{L2}·τ/φ = ${f(c.mRich / 1060, 3)}·5/(60·0,6) = ${f(Vexp, 3)} m³. Hajmi 0,1 m³ bo‘lgan gorizontal idish qabul qilinadi; n = 1.`));
  }


  // ============ 10
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Gaz separatori', '1', 'D = 200 mm, H = 1,0 m, setkali tomchi ushlagich, P = 2,8 MPa', '09Г2С'],
    ['2', 'Absorber', '1', `Nasadkali, D = ${f(c.D * 1000, 0)} mm, H = ${f(c.Htot, 1)} m, 2 seksiya × ${f(c.Hsec, 1)} m, Rashig halqalari 15×15×2`, '12Х18Н10Т'],
    ['3', 'Ekspanzer', '1', 'Gorizontal, V = 0,1 m³, P = 0,6 MPa', '12Х18Н10Т'],
    ['4', 'Boy eritma nasosi', '2 (1 zaxira)', `Markazdan qochma, Q = ${f(c.mRich / 1060, 2)} m³/soat, H = 60 m`, '12Х18Н10Т'],
    ['5', 'Regenerlangan eritma nasosi', '2 (1 zaxira)', `Plunjerli, Q = ${f(c.VL, 2)} m³/soat, P = 3,0 MPa, N = 1,5 kW`, '12Х18Н10Т'],
    ['6', 'Rekuperativ issiqlik almashtirgich', '1', `Qobiq-quvurli, F = 4 m² (hisob ${f(c.Fhx, 2)} m²)`, '12Х18Н10Т'],
    ['7', 'Regenerator (desorber)', '1', `Nasadkali, D = 300 mm, H = 10 m, P = 0,18 MPa`, '12Х18Н10Т'],
    ['8', 'Qaynatgich', '1', `Termosifonli, F = 4 m², Q = ${f(c.Qreb, 1)} kW`, '12Х18Н10Т'],
    ['9', 'CO₂ kondensatori', '1', `Qobiq-quvurli, F = 2 m², Q = ${f(c.Qcond, 1)} kW`, '12Х18Н10Т'],
    ['10', 'Flegma yig‘gichi', '1', 'D = 300 mm, H = 1,0 m', '12Х18Н10Т'],
    ['11', 'Flegma nasosi', '2 (1 zaxira)', 'Markazdan qochma, Q = 0,1 m³/soat, H = 30 m', '12Х18Н10Т'],
    ['12', 'Eritma sovitgichi', '1', `Qobiq-quvurli, F = 4 m², Q = ${f(c.Qcool, 1)} kW`, '12Х18Н10Т / 20'],
    ['13', 'Filtr', '1', 'Mexanik + ko‘mirli, Q = 0,1 m³/soat (yon oqim)', '12Х18Н10Т'],
    ['14', 'MEA eritmasi idishi', '1', 'V = 2 m³, azot yostig‘i ostida', '12Х18Н10Т'],
  ], [0.5, 2.2, 1, 3, 1.4]));

  // ============ 11
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('MEA bilan tozalash sexida tahliliy nazorat gaz tozalash darajasini, eritma sifatini va jihozlarning korroziyadan himoyasini ta’minlash uchun olib boriladi. Nazorat uzluksiz avtomatik analizatorlar va laboratoriya tahlillari orqali bajariladi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul, asbob', 'Davriyligi'], [
    ['Absorberga kiruvchi gaz', 'CO₂, CO', 'CO₂ 17–19 %; CO ≤ 0,5 %', 'Gaz xromatografi, IQ-analizator', 'Uzluksiz'],
    ['Tozalangan gaz', 'CO₂', '≤ 0,03 %', 'IQ-gazanalizator (ГИАМ-15)', 'Uzluksiz'],
    ['Regenerlangan eritma', 'MEA konsentratsiyasi', '18–20 %', 'Kislota bilan titrlash', '1 marta smenada'],
    ['Regenerlangan eritma', 'To‘yinish darajasi α₁', '0,10–0,20 mol/mol', 'Gazometrik (Kalpakov usuli)', '2 marta smenada'],
    ['Boy eritma', 'To‘yinish darajasi α₂', '0,40–0,50 mol/mol', 'Gazometrik', '2 marta smenada'],
    ['Eritma', 'Temir ionlari', '≤ 50 mg/l', 'Fotokolorimetrik', '1 marta sutkada'],
    ['Eritma', 'Termik barqaror tuzlar, ko‘piklanish', '≤ 1 %', 'Ion xromatografiya, ko‘pik testi', '1 marta haftada'],
    ['Eritma', 'Mexanik aralashmalar', '≤ 0,1 g/l', 'Gravimetrik', '1 marta sutkada'],
    ['Regeneratordan chiqqan CO₂', 'CO₂, H₂, N₂', 'CO₂ ≥ 98 %', 'Xromatograf', '1 marta smenada'],
    ['Ekspanzer gazi', 'H₂, CO₂', '–', 'Xromatograf', '1 marta sutkada'],
    ['Ish zonasi havosi', 'MEA bug‘lari; CO₂', '≤ 0,5 mg/m³; ≤ 0,5 %', 'Signalizatorlar, laboratoriya', 'Uzluksiz'],
  ], [1.7, 1.6, 1.3, 1.8, 1.2]));
  add(P('Texnologik parametrlarning nazorati va rostlanishi: absorber va regenerator kubidagi sathlar (differensial manometrli sath o‘lchagichlar); absorberning gidravlik qarshiligi (ko‘piklanishni erta aniqlash uchun – qarshilik keskin ortganda eritmaga ko‘pik so‘ndiruvchi qo‘shiladi); eritmaning absorber kirishidagi va chiqishidagi harorati; regenerator kubidagi harorat (bug‘ sarfi bilan rostlanadi); eritma sarfi (gaz sarfiga nisbatan avtomatik rostlanadi).'));
  add(P('Eritmadagi MEA konsentratsiyasi 0,5 N sulfat kislota bilan metiloranj ishtirokida titrlash orqali, to‘yinish darajasi esa eritmaga sulfat kislota qo‘shib ajralgan CO₂ hajmini gazometrik o‘lchash orqali aniqlanadi. Korroziya nazorati uchun absorber va regeneratorda nazorat namunalari (kuponlar) o‘rnatiladi va ular har 3 oyda tortib ko‘riladi.'));

  add(H2('11.2. Avtomatik boshqarish va blokirovkalar'));
  add(P('Sex texnologik jarayonlarni avtomatik boshqarish tizimi (TJABT) asosida boshqariladi. Asosiy rostlash konturlari: 1) regenerlangan eritma sarfi – gaz sarfiga nisbatan (L/G nisbatini ushlab turish); 2) absorber kubidagi sath – boy eritma liniyasidagi rostlovchi klapan orqali; 3) regenerator kubidagi harorat – qaynatgichga beriladigan bug‘ sarfi orqali; 4) absorberga beriladigan eritma harorati – sovitgichdagi suv sarfi orqali; 5) flegma yig‘gichidagi sath – flegma nasosi orqali.'));
  add(P('Avariya blokirovkalari: absorber kubida sath minimal qiymatgacha pasayganda boy eritma liniyasidagi kesuvchi klapan yopiladi (yuqori bosimli gazning past bosimli apparatlarga o‘tishiga yo‘l qo‘yilmaydi); regenerlangan eritma nasosi to‘xtaganda tozalangan gazdagi CO₂ ortib ketmasligi uchun zaxira nasos avtomatik ishga tushadi, CO₂ miqdori 0,1 % dan oshganda metanlash bo‘limiga gaz berish to‘xtatiladi; regenerator bosimi 0,3 MPa dan oshganda saqlovchi klapan ishga tushadi.'));
  // ============ 12
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Konvertlangan gazni CO₂ dan tozalash usullari tahlil qilinib, unumdorligi ${c.V} m³/soat bo‘lgan qurilma uchun 20 % li MEA eritmasi bilan bir oqimli absorbsiya sxemasi va nasadkali absorber asoslab tanlandi.`));
  add(P(`2. Moddiy balans hisobi bo‘yicha yutiladigan CO₂ miqdori ${f(c.nabs, 4)} kmol/soat (${f(c.mAbsCO2, 2)} kg/soat; ${f(c.mAbsCO2 / 3600, 5)} kg/s), tozalash darajasi ${f(c.eta * 100, 2)} %, regenerlangan eritma sarfi ${f(c.mLean, 1)} kg/soat (${f(c.Lkg, 4)} kg/s), boy eritma sarfi ${f(c.mRich, 1)} kg/soat.`));
  add(P(`3. Issiqlik balanslaridan: boy eritma harorati ${f(c.TR, 1)} K; rekuperativ issiqlik almashtirgich yuklamasi ${f(c.Qhx, 1)} kW; qaynatgich yuklamasi ${f(c.Qreb, 1)} kW, 0,4 MPa bug‘ sarfi ${f(c.Gst, 1)} kg/soat (${f(c.qspec, 2)} MJ/kg CO₂); eritma sovitgichi yuklamasi ${f(c.Qcool, 1)} kW.`));
  add(P(`4. Absorber hisoblandi: diametri ${f(c.D * 1000, 0)} mm, nasadka – keramik Rashig halqalari 15×15×2 mm, massa uzatish birliklari soni ${f(c.NOY, 2)}, nasadka balandligi ${f(c.Hpack, 1)} m (ikki seksiya), apparat balandligi ${f(c.Htot, 1)} m, gidravlik qarshilik ≈ ${f((c.dPwet + 1500) / 1000, 2)} kPa, devor qalinligi ${c.s} mm. Talab qilinadigan absorberlar soni – 1.`));
  add(P('5. Sexning asosiy jihozlari ro‘yxati va tahliliy nazorat sxemasi ishlab chiqildi. Tozalangan gazdagi CO₂ miqdori (≤ 0,03 %) metanlash bosqichining me’yoriy ishlashini ta’minlaydi, ajratib olingan CO₂ esa karbamid ishlab chiqarishda ishlatiladi.'));

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
    'Kohl A.L., Nielsen R.B. Gas Purification. – 5th ed. – Houston: Gulf Publishing, 1997. – 1395 p.',
    'Справочник азотчика. Т. 1. – 2-е изд. – М.: Химия, 1986. – 512 с.',
    'Рамм В.М. Абсорбция газов. – 2-е изд. – М.: Химия, 1976. – 656 с.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Konvertlangan gazni monoetanolamin usulida tozalash sexining absorber hisobi bilan loyihasi.', unum: 'Unumdorligi – konvertlangan gaz bo‘yicha 105 m³/soat' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
