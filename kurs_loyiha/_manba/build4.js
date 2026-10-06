// 4-loyiha: Qizilqum fosforitlaridan oddiy superfosfat ishlab chiqarish tsexining superfosfat kamerasi hisobi bilan loyihasi. 5 t/sutka
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc4');

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];
const k = c.k; // 100 kg -> 1 soat
const kd = k * 24; // 100 kg -> 1 sutka
const kW = q => q * k / 3600; // kJ/100kg -> kW
const kgs = m => f(m * k / 3600 * 1000, 3); // kg/100kg -> g/s

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };
  const M = c.M;
  const sumO = o => Object.values(o).reduce((a, b) => a + b, 0);
  const P2O5ksf = 26 / c.mKSF * 100, P2O5sf = 26 / c.mSF * 100;
  const wsK = c.P2O5ws(c.compKSF), wsS = c.P2O5ws(c.compSF), frK = c.P2O5free(c.compKSF), frS = c.P2O5free(c.compSF);

  // ============ 1
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Fosfor o‘simliklar uchun eng muhim oziq elementlaridan biri: u nuklein kislotalar, fosfolipidlar va energiya tashuvchi ATF tarkibiga kiradi, ildiz tizimining rivojlanishini, hosilning pishishini va sifatini ta’minlaydi. Tuproqdagi fosforning katta qismi o‘simliklar o‘zlashtira olmaydigan shaklda bo‘lgani uchun fosforli o‘g‘itlarni muntazam qo‘llash zarur. O‘zbekiston sharoitida, ayniqsa paxta va g‘alla yetishtirishda, fosforli o‘g‘itlarga bo‘lgan yillik ehtiyoj yuz ming tonnalab P₂O₅ ni tashkil etadi.'));
  add(P('Oddiy superfosfat – eng qadimgi va hozirgacha keng ishlatiladigan fosforli o‘g‘it. Uning tarkibida fosfordan tashqari kalsiy, oltingugurt (gips ko‘rinishida) va mikroelementlar bo‘ladi, bu esa oltingugurtga muhtoj ekinlar va sho‘rlangan tuproqlar uchun qo‘shimcha afzallik beradi. Superfosfat ishlab chiqarish texnologiyasi nisbatan oddiy, kam energiya talab qiladi va kichik quvvatli qurilmalarda ham iqtisodiy jihatdan samarali.'));
  add(P('Respublikamizning asosiy fosfat xomashyo bazasi – Markaziy Qizilqumdagi Jeroy-Sardara koni. Uning fosforitlari Qizilqum fosforit kompleksida boyitilib, yuvilgan kuydirilgan fosfokonsentrat (YuKFK) ko‘rinishida “Ammofos-Maxam” (Olmaliq), “Samarqandkimyo”, “Qo‘qon superfosfat zavodi” va boshqa korxonalarga yetkazib beriladi. Qizilqum fosforitlari karbonatlar va kalsiyga boy, P₂O₅ miqdori nisbatan past bo‘lgani sababli ularni sulfat kislota bilan qayta ishlash o‘ziga xos texnologik yechimlarni talab qiladi: kislota sarfi yuqori, parchalanish darajasi esa apatit konsentratiga nisbatan pastroq.'));
  add(P('Superfosfat ishlab chiqarishning asosiy apparati – superfosfat kamerasi. Unda fosfat-kislota pulpasi qotadi, parchalanish reaksiyalari davom etadi va kalsiy sulfati kristallanadi. Kameraning o‘lchamlari va undagi bo‘lish vaqti mahsulot sifatini, ya’ni o‘zlashtiriladigan P₂O₅ miqdorini va superfosfatning fizik xossalarini belgilaydi.'));
  add(P('Superfosfat sanoati XIX asr o‘rtalarida Angliyada (J. Louz, 1842 y.) suyak uni va fosforitlarni sulfat kislota bilan ishlash orqali boshlangan. O‘zbekistonda superfosfat ishlab chiqarish 1930-yillarda Qo‘qon va Samarqand zavodlarining ishga tushirilishi bilan yo‘lga qo‘yilgan; dastlab import qilinadigan Qoratog‘ fosforitlari va Kola apatitlari ishlatilgan. Qizilqum fosforit kompleksi ishga tushirilgandan so‘ng (1990-yillar) respublika zavodlari mahalliy xomashyoga o‘tkazildi va Qizilqum fosforitlarini qayta ishlash texnologiyasini takomillashtirish bo‘yicha O‘zbekiston Fanlar akademiyasining Umumiy va noorganik kimyo instituti olimlari (Sh.S. Namazov, B.M. Beglov va boshqalar) tomonidan keng ilmiy tadqiqotlar olib borildi.'));
  add(P(`Ushbu kurs loyihasining maqsadi – Qizilqum fosforitlaridan unumdorligi ${f(c.Gday / 1000, 0)} t/sutka (tayyor mahsulot bo‘yicha) bo‘lgan oddiy superfosfat ishlab chiqarish tsexini loyihalash va uning asosiy apparati – superfosfat kamerasini hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['fosfatlarni sulfat kislota bilan parchalash jarayonining kimyosi, termodinamikasi va kinetikasini tahlil qilish;',
    'Qizilqum fosfokonsentrati, sulfat kislota va superfosfatning fizik-kimyoviy xossalarini o‘rganish;',
    'superfosfat ishlab chiqarish usullarini solishtirib, maqbul texnologik sxemani tanlash;',
    'aralashtirgich, kamera va yetiltirish bosqichlarining moddiy va issiqlik balanslarini SI tizimida hisoblash;',
    'superfosfat kamerasining hajmi, o‘lchamlari, aylanish chastotasi, frezer va korpus hisobini bajarish;',
    'asosiy jihozlar sonini aniqlash, ro‘yxatini va tahliliy nazorat sxemasini tuzish.']));
  add(P('Barcha hisoblar SI xalqaro birliklar tizimida bajarilgan: massa – kg, modda miqdori – mol (kmol), harorat – K, bosim – Pa, energiya – J (kJ), quvvat – W (kW), hajm – m³, vaqt – s. Moddiy balans avval 100 kg fosforitga hisoblanib, so‘ngra berilgan unumdorlikka (kg/soat, kg/sutka, kg/s) o‘tkazilgan. Yillik ish vaqti 330 sutka.'));

  // ============ 2
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. Fosfatlarni sulfat kislota bilan parchalash kimyosi'));
  add(P('Oddiy superfosfat tabiiy fosfatlarni sulfat kislota bilan parchalab olinadi. Bunda kislota miqdori fosfatdagi kalsiyni to‘liq sulfat shaklida bog‘lash uchun yetarli emas, natijada hosil bo‘lgan fosfat kislota fosfatning qolgan qismini parchalab, monokalsiyfosfat hosil qiladi. Jarayon ikki bosqichda boradi:'));
  add(F('Ca₅(PO₄)₃F + 5H₂SO₄ = 3H₃PO₄ + 5CaSO₄ + HF', '2.1'));
  add(F('Ca₅(PO₄)₃F + 7H₃PO₄ + 5H₂O = 5Ca(H₂PO₄)₂·H₂O + HF', '2.2'));
  add(P('Ikkala reaksiyaning yig‘indisi:'));
  add(F('2Ca₅(PO₄)₃F + 7H₂SO₄ + 3H₂O = 3Ca(H₂PO₄)₂·H₂O + 7CaSO₄ + 2HF', '2.3'));
  add(P('Birinchi bosqich (2.1) tez – aralashtirgichda va kameraning dastlabki 20–40 daqiqasida tugaydi. Bunda suyuq faza H₃PO₄ bilan to‘yinadi, kalsiy sulfati esa avval yarimgidrat, so‘ngra angidrit shaklida kristallanadi va massa qotadi. Ikkinchi bosqich (2.2) sekin boradi: u kamerada boshlanib, omborda yetiltirish davomida 15–25 sutka davom etadi. Uning tezligi fosfat donachalari sirtida hosil bo‘ladigan monokalsiyfosfat po‘stlog‘i orqali diffuziya bilan cheklanadi.'));
  add(P('Fosforit tarkibidagi qo‘shimchalar ham sulfat kislota bilan reaksiyaga kirishadi:'));
  add(F('CaCO₃ + H₂SO₄ = CaSO₄ + H₂O + CO₂', '2.4'));
  add(F('CaO + H₂SO₄ = CaSO₄ + H₂O;   MgO + H₂SO₄ = MgSO₄ + H₂O', '2.5'));
  add(F('R₂O₃ + 3H₂SO₄ = R₂(SO₄)₃ + 3H₂O  (R = Fe, Al);   CaF₂ + H₂SO₄ = CaSO₄ + 2HF', '2.6'));
  add(P('Ajralgan vodorod ftorid fosforitdagi kremniy dioksidi bilan reaksiyaga kirishadi; hosil bo‘lgan SiF₄ ning bir qismi gaz fazasiga chiqadi, qolgani kremniyftorid kislota sifatida superfosfatda qoladi:'));
  add(F('4HF + SiO₂ = SiF₄ + 2H₂O;   6HF + SiO₂ = H₂SiF₆ + 2H₂O', '2.7'));
  add(F('3SiF₄ + 2H₂O = 2H₂SiF₆ + SiO₂', '2.8'));
  add(P('(2.8) reaksiya chiqindi gazlarni suv bilan yutib, ftorni ushlashga asoslangan. Olingan kremniyftorid kislotadan natriy kremniyftorid va alyuminiy ftorid ishlab chiqariladi.'));
  add(H2('2.2. Jarayonning termodinamikasi'));
  add(P('Parchalanish reaksiyalari ekzotermik. Gess qonuni bo‘yicha (hosil bo‘lish entalpiyalari: ftorapatit –6872, H₂SO₄ (68 % li eritmada) –860, H₃PO₄ –1271,7, CaSO₄ –1434,1, Ca(H₂PO₄)₂·H₂O –3409,6, HF (g) –273,3, H₂O (s) –285,8 kJ/mol) hisoblangan reaksiya issiqliklari 2.1-jadvalda keltirilgan.'));
  add(T('2.1', 'Superfosfat hosil bo‘lish reaksiyalarining issiqlik effektlari (298 K)', ['Reaksiya', 'Ajraladigan issiqlik, kJ/mol'], [
    ['Ftorapatit + H₂SO₄ (2.1)', f(c.dH.ap1, 1)], ['Ftorapatit + H₃PO₄ (2.2)', f(c.dH.ap2, 1)], ['CaO + H₂SO₄', f(c.dH.CaO, 1)],
    ['CaCO₃ + H₂SO₄', f(c.dH.CaCO3, 1)], ['MgO + H₂SO₄', f(c.dH.MgO, 1)], ['Fe₂O₃ + 3H₂SO₄', f(c.dH.Fe, 1)], ['Al₂O₃ + 3H₂SO₄', f(c.dH.Al, 1)],
    ['CaF₂ + H₂SO₄', f(c.dH.CaF2, 1) + ' (yutiladi)'], ['4HF + SiO₂ → SiF₄', f(c.dH.SiF4, 1)], ['6HF + SiO₂ → H₂SiF₆ (eritma)', f(c.dH.H2SiF6, 1)],
  ], [3, 1.5]));
  add(P('Jadvaldan ko‘rinadiki, Qizilqum kuydirilgan konsentrati uchun asosiy issiqlik manbai – erkin CaO ning neytrallanishi. Shu sababli bunday xomashyoda massa 383–393 K gacha qiziydi va kamerada katta miqdorda suv bug‘lanadi, bu esa superfosfatning fizik xossalarini yaxshilaydi.'));
  add(H2('2.3. Jarayonning kinetikasi va ta’sir etuvchi omillar'));
  add(P('Parchalanish tezligi va darajasi quyidagi omillarga bog‘liq: fosfatning maydalik darajasi (0,16 mm dan mayda donachalar ulushi 85–90 % dan kam bo‘lmasligi kerak); kislota konsentratsiyasi (65–70 %; kuchsizroq kislotada massa yaxshi qotmaydi va nam bo‘ladi, kuchliroq kislotada esa donachalar sirtida zich angidrit po‘stlog‘i hosil bo‘lib, parchalanishni sekinlashtiradi); kislota harorati (333–343 K); kislota normasi (stexiometrik normaning 100–105 %); aralashtirish intensivligi va pulpaning kamerada bo‘lish vaqti (1–1,5 soat).'));
  add(P('Parchalanish darajasi vaqt bo‘yicha to‘yinish xarakteriga ega. Kamerada (1,5 soat) Qizilqum YuKFK uchun K_{p} = 0,80–0,85 ga, omborda 15–20 sutka yetiltirilgandan so‘ng esa 0,90–0,93 ga yetadi. Yetiltirish jarayonini tezlashtirish uchun superfosfat omborda vaqti-vaqti bilan aralashtiriladi (greyfer kran bilan qayta to‘kiladi): bunda massa soviydi, suv bug‘lanadi va suyuq fazadagi fosfat kislota konsentratsiyasi ortadi.'));

  add(H2('2.4. CaO–P₂O₅–H₂O sistemasi va superfosfatning suyuq fazasi'));
  add(P('Superfosfat hosil bo‘lishini CaO–P₂O₅–H₂O sistemasining eruvchanlik izotermalari asosida tushuntirish mumkin. Sistemada fosfat kislota eritmasi bilan muvozanatda bo‘lishi mumkin bo‘lgan qattiq fazalar: CaHPO₄ (dikalsiyfosfat), Ca(H₂PO₄)₂·H₂O (monokalsiyfosfat monogidrati) va Ca(H₂PO₄)₂ (suvsiz monokalsiyfosfat). 298 K da 40–42 % P₂O₅ li fosfat kislota eritmasi monokalsiyfosfat bilan to‘yinadi; harorat ortishi bilan to‘yinish nuqtasi kuchliroq kislota tomoniga siljiydi va eritmada ko‘proq CaO erishi mumkin bo‘ladi.'));
  add(P('Kamerada parchalanish jarayonida suyuq fazadagi fosfat kislota CaO bilan to‘yinadi va monokalsiyfosfat kristallana boshlaydi. Shu paytdan boshlab apatit donachalari sirtida monokalsiyfosfat po‘stlog‘i hosil bo‘ladi va parchalanish tezligi keskin kamayadi. Suyuq fazadagi kislota konsentratsiyasi qancha yuqori bo‘lsa (ya’ni massa qanchalik ko‘p suvsizlansa), uning to‘yinishi shunchalik kech yuz beradi va fosfatni ko‘proq parchalaydi. Shuning uchun kamerada suvning bug‘lanishi va yetiltirishda superfosfatni aralashtirib, sovitish va quritish parchalanishni chuqurlashtiradi.'));
  add(P('Kalsiy sulfati superfosfat kamerasining harorat sharoitida (373–393 K) va yuqori kislotalikda avval yarimgidrat CaSO₄·0,5H₂O shaklida cho‘kadi, so‘ngra tezda angidritga aylanadi. Mayda, igna shaklidagi angidrit kristallari massada mustahkam karkas hosil qiladi, shu sababli pulpa 10–20 daqiqada qotadi va kamera chiqishida g‘ovak, yaxshi sochiluvchan massa olinadi. Agar kislota konsentratsiyasi past bo‘lsa, gips CaSO₄·2H₂O cho‘kib, massa yopishqoq bo‘lib qoladi va qiyin frezerlanadi.'));
  add(H2('2.5. Ftor birikmalarining xatti-harakati'));
  add(P('Fosfatdagi ftorning taqdiri superfosfat ishlab chiqarishda ham ekologik, ham iqtisodiy ahamiyatga ega. Parchalanishda ajralgan HF darhol SiO₂ bilan reaksiyaga kirishadi, shuning uchun gaz fazasiga asosan SiF₄ o‘tadi. Gazga o‘tadigan ftor ulushi harorat, kislota konsentratsiyasi va massaning g‘ovakligiga bog‘liq: aralashtirgich va kamerada 10–20 %, omborda yana 5–15 % ajraladi. Superfosfatda qolgan ftor H₂SiF₆ va uning kalsiy, natriy, kaliy tuzlari (CaSiF₆, Na₂SiF₆) shaklida bo‘ladi.'));
  add(P('SiF₄ suv bilan yutilganda (2.8) reaksiya bo‘yicha kremniy kislotasi gel holida ajraladi va absorbsion apparatlarni to‘sib qo‘yishi mumkin. Shu sababli birinchi bosqichda suyuqlikni purkovchi ichi bo‘sh kameralar (gel cho‘kmasi uchun xavfsiz), ikkinchi bosqichda esa yirik nasadkali skrubberlar qo‘llaniladi; aylanma eritma vaqti-vaqti bilan filtrlanadi.'));
  // ============ 3
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Qizilqum fosforitlari'));
  add(P('Jeroy-Sardara koni fosforitlari donador tipdagi dengiz cho‘kindi fosforitlari bo‘lib, asosiy fosfat minerali – karbonatli ftorapatit (frankolit). Rudada 16–19 % P₂O₅, 45–47 % CaO va 14–18 % CO₂ bo‘ladi. Boyitish (quruq saralash, yuvish, 1173–1223 K da kuydirish) natijasida karbonatlar parchalanadi, xlor va organik moddalar yo‘qotiladi, P₂O₅ miqdori 26–28 % gacha ko‘tariladi. Kuydirilgan konsentratda erkin CaO qoladi, u sulfat kislota sarfini oshiradi. Loyihada qabul qilingan YuKFK tarkibi 3.1-jadvalda keltirilgan.'));
  add(T('3.1', 'Qizilqum yuvilgan kuydirilgan fosfokonsentrati (YuKFK) tarkibi', ['Komponent', 'Massa ulushi, %', 'M, kg/kmol', 'n, kmol/100 kg'],
    ['P2O5', 'CaO', 'CO2', 'F', 'MgO', 'Al2O3', 'Fe2O3', 'SO3', 'SiO2', 'H2O'].map(s => [
      { P2O5: 'P₂O₅', CaO: 'CaO', CO2: 'CO₂', F: 'F', MgO: 'MgO', Al2O3: 'Al₂O₃', Fe2O3: 'Fe₂O₃', SO3: 'SO₃', SiO2: 'SiO₂ (erimaydigan qoldiq)', H2O: 'H₂O' }[s],
      f(c.comp[s], 1), f(M[s], 2), f(c.n[s], 5)]).concat([['Boshqalar (Na₂O, K₂O, SrO va b.)', f(c.comp.other, 2), '–', '–'], ['O = F₂ tuzatmasi', f(c.comp.OF, 2), '–', '–'], B(['Jami', '100,0', '', ''])]),
    [2.4, 1.1, 1, 1.2]));
  add(P(`YuKFK ning fizik xossalari: rangi och kulrang; zichligi 2900–3000 kg/m³; uyuma zichligi 1400–1500 kg/m³; namligi 1 % gacha; 0,16 mm li elakdagi qoldiq 10–15 % dan ko‘p emas. CaO : P₂O₅ massaviy nisbati ${f(c.comp.CaO / c.comp.P2O5, 2)} (apatit konsentratida 1,3–1,35), MgO : P₂O₅ = ${f(c.comp.MgO / c.comp.P2O5, 3)}, R₂O₃ : P₂O₅ = ${f((c.comp.Al2O3 + c.comp.Fe2O3) / c.comp.P2O5, 3)}. Ftorapatit Ca₅(PO₄)₃F – geksagonal mineral, M = 504,30 kg/kmol, zichligi 3180 kg/m³, qattiqligi (Moos bo‘yicha) 5, suvda amalda erimaydi.`));
  add(T('3.2', 'YuKFK ning granulometrik tarkibi', ['Fraksiya, mm', '> 0,25', '0,16–0,25', '0,10–0,16', '0,074–0,10', '< 0,074'], [['Ulushi, %', '2', '8', '18', '22', '50']], [1.3, 1, 1, 1, 1, 1]));
  add(P('Maydalik parchalanish tezligiga kuchli ta’sir etadi: 0,25 mm dan yirik donachalar kamerada amalda parchalanmaydi va omborda ham sekin reaksiyaga kirishadi. Qo‘shimchalarning ta’siri: erkin CaO va karbonatlar kislota sarfini oshiradi, lekin issiqlik ajralishi hisobiga massani quritadi; R₂O₃ (Fe, Al) suvda erimaydigan fosfatlar hosil qilib, o‘zlashtiriladigan P₂O₅ ning bir qismini “retrogradatsiya”ga uchratadi; MgO superfosfatning gigroskopikligini oshiradi.'));
  add(H2('3.2. Sulfat kislota'));
  add(P('Superfosfat ishlab chiqarishga 92,5–94 % li minorali yoki kontakt sulfat kislotasi (GOST 2184) keltiriladi va suv bilan 65–70 % gacha suyultiriladi. Loyihada 68 % li kislota qabul qilingan. Sulfat kislota – rangsiz, moysimon suyuqlik; suv bilan aralashganda ko‘p issiqlik ajraladi, shuning uchun suyultirish sovitiladigan aralashtirgichda bajariladi. Kislota eritmalarining asosiy xossalari 3.2-jadvalda keltirilgan.'));
  add(T('3.3', 'Sulfat kislota eritmalarining xossalari', ['H₂SO₄, %', '60', '65', '68', '70', '93'], [
    ['Zichlik (293 K), kg/m³', '1498', '1553', '1587', '1611', '1830'], ['Qaynash harorati, K', '414', '425', '432', '438', '558'],
    ['Issiqlik sig‘imi, kJ/(kg·K)', '2,31', '2,22', '2,20', '2,15', '1,50'], ['Dinamik qovushoqlik (313 K), mPa·s', '4,8', '5,9', '6,6', '7,2', '13,5'],
    ['Muzlash harorati, K', '209', '212', '226', '231', '236'],
  ], [2.4, 1, 1, 1, 1, 1]));
  add(H2('3.3. Oddiy superfosfat'));
  add(P('Oddiy superfosfat – kulrang, kukunsimon yoki donador o‘g‘it. Uning asosiy komponentlari: monokalsiyfosfat Ca(H₂PO₄)₂·H₂O (suvda eriydi, o‘simliklar oson o‘zlashtiradi), erkin fosfat kislota, kalsiy sulfati (angidrit va yarimgidrat, massaning 50–55 % i), parchalanmagan fosfat, temir va alyuminiy fosfatlari, kremniyftorid kislota. Superfosfatning sifati o‘zlashtiriladigan P₂O₅ miqdori, erkin kislotalik va namlik bilan baholanadi.'));
  add(T('3.4', 'Oddiy superfosfatga qo‘yiladigan talablar (kukunsimon, Qizilqum xomashyosidan)', ['Ko‘rsatkich', 'Me’yor'], [
    ['O‘zlashtiriladigan P₂O₅, % kam emas', '13,0–14,0'], ['Suvda eriydigan P₂O₅, % kam emas', '11,0'], ['Erkin fosfat kislota (P₂O₅ hisobida), % ko‘p emas', '5,0'],
    ['Namlik, % ko‘p emas', '15,0'], ['Parchalanish darajasi, % kam emas', '90'], ['Ftor (F), % ko‘p emas', '2,5'],
  ], [3, 1.5]));
  add(T('3.5', 'Oddiy superfosfatning fizik xossalari', ['Ko‘rsatkich', 'Kukunsimon', 'Donador'], [
    ['Uyuma zichligi, kg/m³', '1050–1200', '1100–1250'], ['Tabiiy qiyalik burchagi, grad', '40–45', '30–35'], ['Gigroskopik nuqta (298 K), %', '62–70', '65–72'],
    ['Mustahkamlik (granula), MPa', '–', '2–4'], ['Issiqlik sig‘imi, kJ/(kg·K)', '1,6–1,9', '1,6–1,9'], ['Yopishqoqligi (namlik 15 % da)', 'o‘rtacha', 'kam'],
  ], [2.4, 1.2, 1.2]));
  add(P('Monokalsiyfosfat Ca(H₂PO₄)₂·H₂O: M = 252,07 kg/kmol, zichligi 2220 kg/m³, 382 K da kristall suvini yo‘qotadi, suvda yaxshi eriydi (291 K da 1,8 %, inkongruent erish bilan). Kalsiy sulfati angidrit CaSO₄: M = 136,14 kg/kmol, zichligi 2960 kg/m³; superfosfat massasining asosiy “karkasi” bo‘lib, uning qotishi va g‘ovakligini belgilaydi.'));

  // ============ 4
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. Superfosfat ishlab chiqarish usullari'));
  add(P('Oddiy superfosfat ishlab chiqarishning davriy va uzluksiz kamerali usullari, shuningdek, kamerasiz (oqim) usullari mavjud. Davriy usulda pulpa yig‘ma (betonli) kameraga to‘ldiriladi, qotgandan so‘ng kamera ochilib, massa ekskavator bilan tushiriladi. Uzluksiz usulda aylanuvchi (karusel) kamera yoki konveyerli (lentali) kamera ishlatiladi. Kamerasiz usulda fosfat va kislota aralashmasi kuchli aralashtiriladigan reaktorlarda yoki barabanli granulyatorda qayta ishlanib, darhol donadorlanadi va quritiladi. Usullarning qiyosiy tavsifi 4.1-jadvalda keltirilgan.'));
  add(T('4.1', 'Superfosfat ishlab chiqarish usullarini solishtirish', ['Ko‘rsatkich', 'Davriy kamera', 'Aylanuvchi (karusel) kamera', 'Konveyerli kamera', 'Kamerasiz (oqim)'], [
    ['Ish rejimi', 'davriy', 'uzluksiz', 'uzluksiz', 'uzluksiz'], ['Bo‘lish vaqti', '2–3 soat', '1–1,5 soat', '0,5–1 soat', '–'],
    ['Mexanizatsiya darajasi', 'past', 'yuqori', 'yuqori', 'yuqori'], ['Ftorning gazga ajralishi va ushlanishi', 'yomon', 'yaxshi', 'yaxshi', 'yaxshi'],
    ['Ish sharoiti (zararli gazlar)', 'og‘ir', 'qoniqarli', 'qoniqarli', 'yaxshi'], ['Kamera mahsulotida K_{p}', '0,80–0,85', '0,82–0,87', '0,78–0,82', '0,85–0,92*'],
    ['Energiya sarfi', 'kam', 'kam', 'kam', 'yuqori (quritish)'], ['Qo‘llanish', 'eskirgan', 'keng tarqalgan', 'cheklangan', 'yirik zavodlar'],
  ], [2.2, 1.1, 1.4, 1.2, 1.2]));
  add(P('* – qo‘shimcha issiqlik ishlov berish (quritish) bilan.', { noIndent: true, size: 24 }));
  add(P('Davriy kameralar zararli ftorli gazlar ajralishi va og‘ir qo‘l mehnati tufayli eskirgan. Kamerasiz usul energiya talab qiladi va katta unumdorlik uchun mo‘ljallangan. Konveyerli kameralarda bo‘lish vaqti qisqa bo‘lib, Qizilqum fosforitlari uchun yetarli parchalanishni ta’minlamaydi. Uzluksiz aylanuvchi kamera esa ixcham, ishonchli, to‘liq mexanizatsiyalashgan bo‘lib, gazlarni markazlashtirilgan holda so‘rib olib, ftorni ushlash imkonini beradi. Shuning uchun loyihada uzluksiz ishlaydigan aylanuvchi (karusel) superfosfat kamerasi va kamerasini omborda yetiltirish sxemasi tanlandi.'));
  add(H2('4.2. Kislota tayyorlash va ftorni ushlash usullarini tanlash'));
  add(P('Sulfat kislotani suyultirish uchun grafitli sovitgichli aralashtirgich yoki suv bilan sovitiladigan quvurli suyultirgich qo‘llaniladi. Loyihada 93 % li kislota suv bilan quvurli suyultirgichda aralashtirilib, issiqlik almashtirgichda 338 K gacha sovitiladi va o‘lchov idishida konsentratsiyasi nazorat qilinadi. Ftorli gazlarni ushlash uchun ketma-ket ulangan ikki bosqichli absorbsiya (birinchisi – ichi bo‘sh purkagichli kamera, ikkinchisi – nasadkali skrubber) qabul qilindi; u ftorni 95–98 % gacha ushlaydi va 8–10 % li H₂SiF₆ eritmasini beradi.'));

  add(H2('4.3. Kislota konsentratsiyasi va normasini tanlash'));
  add(P('Sulfat kislota konsentratsiyasi superfosfatning sifatiga ikki xil ta’sir etadi. Konsentratsiya oshirilganda pulpa tez qotadi, kamera superfosfati quruq va g‘ovak bo‘ladi, namlik kamayadi; ammo kislota ortiqcha kuchli bo‘lsa (72 % dan yuqori), fosfat donachalari sirtida zich kalsiy sulfati po‘stlog‘i hosil bo‘lib, kamerada parchalanish darajasi pasayadi. Qizilqum kuydirilgan konsentrati katta miqdorda issiqlik ajratishini va suv bug‘lanishini hisobga olib, 65–70 % oralig‘idagi kislota maqbul hisoblanadi.'));
  add(T('4.2', 'Kislota konsentratsiyasining Qizilqum YuKFK dan olinadigan superfosfat ko‘rsatkichlariga ta’siri (adabiyot ma’lumotlari [11, 12])', ['H₂SO₄, %', 'Qotish vaqti, min', 'K_{p} (kamera)', 'K_{p} (15 sutka)', 'Namlik, %', 'Fizik holati'], [
    ['60', '30–40', '0,84', '0,92', '17–19', 'yopishqoq'], ['65', '20–25', '0,83', '0,92', '15–16', 'qoniqarli'], ['68', '15–20', '0,82', '0,92', '13–15', 'yaxshi'],
    ['70', '12–15', '0,80', '0,91', '12–13', 'yaxshi'], ['75', '8–10', '0,76', '0,88', '10–11', 'qattiq, bo‘laklar'],
  ], [1, 1.1, 1, 1.1, 1, 1.3]));
  add(P('Jadval ma’lumotlariga ko‘ra 68 % li kislota yaxshi fizik xossalar va yetarli parchalanish darajasini ta’minlaydi. Kislota normasi stexiometrikning 100 % i qilib olindi: uning ortishi parchalanishni tezlashtiradi, lekin tayyor mahsulotning erkin kislotaligini va gigroskopikligini oshiradi.'));
  // ============ 5
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Oddiy superfosfat ishlab chiqarish tsexining texnologik sxemasi 5.1-rasmda keltirilgan.'));
  add(IMG(path.join(FIG, 'sxema4.png'), 620, 360, '5.1-rasm. Qizilqum fosforitlaridan oddiy superfosfat ishlab chiqarish tsexining texnologik sxemasi',
    '1 – fosforit bunkeri; 2 – lentali tarozili dozator; 3 – 93 % li sulfat kislota idishi; 4 – suv idishi; 5 – kislota suyultirgichi-sovitgichi; 6 – 68 % li kislota dozalovchi idishi; 7 – uzluksiz aralashtirgich; 8 – aylanuvchi superfosfat kamerasi; 9 – frezer; 10 – lentali konveyer; 11 – yetiltirish ombori; 12 – ftor absorbsiyasining 1-bosqichi (purkagichli kamera); 13 – 2-bosqich (nasadkali skrubber); 14 – ventilyator.'));
  add(P(`Fosforit (YuKFK) temir yo‘l vagonlarida keltirilib, pnevmotransport bilan bunker 1 ga yuklanadi. Undan lentali tarozili dozator 2 orqali ${f(c.Gph, 1)} kg/soat (${f(c.Gph / 3600 * 1000, 2)} g/s) miqdorida uzluksiz aralashtirgich 7 ga beriladi. 93 % li sulfat kislota idish 3 dan, suv esa idish 4 dan quvurli suyultirgich 5 ga yuboriladi; bu yerda 68 % li kislota tayyorlanib, aylanma suv bilan 338 K gacha sovitiladi va dozalovchi idish 6 orqali avtomatik ravishda aralashtirgichga beriladi. Kislota sarfi fosforit sarfiga nisbatan rostlanadi.`));
  add(P('Aralashtirgich 7 – uch seksiyali gorizontal apparat bo‘lib, ikki valga o‘rnatilgan kurakchalar bilan jihozlangan. Pulpa aralashtirgichda 5 daqiqa bo‘ladi, bunda (2.1) va qo‘shimchalar bilan reaksiyalar boshlanadi, CO₂ ajraladi va massa 363–373 K gacha qiziydi. Hosil bo‘lgan bo‘tqasimon pulpa aylanuvchi kamera 8 ga quyiladi.'));
  add(P(`Kamera 8 – sekin aylanuvchi halqasimon silindr bo‘lib, uning markazida qo‘zg‘almas quvur joylashgan. Pulpa kamerada ${f(c.tauR / 3600, 2)} soat bo‘ladi, bu vaqt ichida u qotadi, harorat ${f(c.Tch, 0)} K gacha ko‘tariladi, ${f(c.Wev * k, 1)} kg/soat suv bug‘lanadi. Kamera bir marta to‘liq aylanganda qotgan massa qo‘zg‘almas frezer 9 bilan qatlam-qatlam qirqilib, markaziy quvur orqali lentali konveyer 10 ga tushadi va yetiltirish ombori 11 ga yuboriladi. Omborda superfosfat 15 sutka saqlanadi, bu davrda 2–3 marta greyfer kran bilan aralashtiriladi; parchalanish darajasi ${f(c.Kch, 2)} dan ${f(c.Kcur, 2)} gacha ortadi.`));
  add(P('Tsexni ishga tushirishda avval ventilyator va absorbsiya tizimi, so‘ngra kamera aylantirish yuritmasi va frezer yoqiladi. Fosforit berish boshlangandan keyin 1–2 daqiqa o‘tib kislota beriladi; kamera to‘lgunga qadar (bir aylanish) frezer ishlamaydi. To‘xtatishda avval kislota, keyin fosforit berish to‘xtatiladi, aralashtirgich fosforit bilan tozalanadi, kamera bo‘shatilgunga qadar aylanaveradi.'));
  add(P('Aralashtirgich va kameradan ajraladigan gazlar (suv bug‘i, CO₂, SiF₄, HF) ventilyator 14 yordamida absorbsiya bo‘limiga so‘riladi. Purkagichli kamera 12 va nasadkali skrubber 13 da gazlar suv bilan yuviladi, ftor kremniyftorid kislota sifatida ushlanadi. Tozalangan gaz (F ≤ 10 mg/m³) quvur orqali atmosferaga chiqariladi, H₂SiF₆ eritmasi esa natriy kremniyftorid ishlab chiqarishga yuboriladi.'));

  // ============ 6
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`tayyor (yetiltirilgan) superfosfat unumdorligi G_{sf} = ${f(c.Gday, 0)} kg/sutka = ${f(c.G, 2)} kg/soat = ${f(c.G / 3600, 5)} kg/s;`,
    'fosforit – Qizilqum YuKFK, tarkibi 3.1-jadval bo‘yicha;',
    `sulfat kislota – ${f(c.wA * 100, 0)} % li, kislota normasi stexiometrik normaning ${f(c.norm * 100, 0)} % i;`,
    `parchalanish darajasi: kamera chiqishida K_{p} = ${f(c.Kch, 2)}, yetiltirilgandan so‘ng K_{p} = ${f(c.Kcur, 2)};`,
    `ftorning gaz fazasiga (SiF₄) o‘tishi: kamerada ${f(c.fGas1 * 100, 0)} %, jami ${f(c.fGas2 * 100, 0)} %;`,
    'karbonatlar kamerada to‘liq parchalanadi; kalsiy sulfati angidrit shaklida kristallanadi;',
    'omborda yetiltirishda kamera superfosfati massasining 6 % i miqdorida suv bug‘lanadi.']));
  add(P('Hisob avval 100 kg fosforit uchun bajariladi, so‘ngra berilgan unumdorlikka o‘tkaziladi.'));
  add(H2('6.2. Fosforitning mineral tarkibi'));
  add(F(`n_{ap} = n_{P₂O₅}/1,5 = ${f(c.n.P2O5, 5)}/1,5 = ${f(c.ap, 5)} kmol Ca₅(PO₄)₃F (${f(c.ap * M.ap, 2)} kg)`, '6.1'));
  add(F(`n_{CaF₂} = (n_{F} – n_{ap})/2 = (${f(c.n.F, 5)} – ${f(c.ap, 5)})/2 = ${f(c.CaF2, 5)} kmol (${f(c.CaF2 * M.CaF2, 2)} kg)`, '6.2'));
  add(P(`Dastlabki kalsiy sulfati n_{CaSO₄} = n_{SO₃} = ${f(c.CaSO4_0, 5)} kmol (${f(c.CaSO4_0 * M.CaSO4, 2)} kg), kalsiy karbonati n_{CaCO₃} = n_{CO₂} = ${f(c.CaCO3, 5)} kmol (${f(c.CaCO3 * M.CaCO3, 2)} kg). Qolgan kalsiy erkin CaO va silikatlar ko‘rinishida:`));
  add(F(`n_{CaO}^{erk} = n_{CaO} – 5n_{ap} – n_{CaSO₄} – n_{CaCO₃} – n_{CaF₂} = ${f(c.CaOf, 5)} kmol (${f(c.CaOf * M.CaO, 2)} kg)`, '6.3'));
  add(H2('6.3. Sulfat kislota normasi'));
  add(T('6.1', 'Sulfat kislotaning stexiometrik normasi (100 kg fosforitga)', ['Komponent', 'n, kmol', 'Koeffitsiyent', 'H₂SO₄, kmol', 'H₂SO₄, kg'],
    c.acidRows.map(r => [r[0], f(r[1], 5), f(r[2], 1), f(r[1] * r[2], 5), f(r[1] * r[2] * M.H2SO4, 2)]).concat([B(['Jami', '', '', f(c.nAcid0, 5), f(c.nAcid0 * M.H2SO4, 2)])]), [1.6, 1, 1, 1, 1]));
  add(F(`m_{k} = m_{H₂SO₄}/w = ${f(c.mAcid, 2)}/${f(c.wA, 2)} = ${f(c.mAcidSol, 2)} kg;   m_{H₂O}^{k} = ${f(c.mAcidW, 2)} kg`, '6.4'));
  add(P(`Demak, 100 kg fosforitga ${f(c.mAcid, 2)} kg monogidrat yoki ${f(c.mAcidSol, 2)} kg ${f(c.wA * 100, 0)} % li kislota talab qilinadi. Bu qiymat apatit konsentrati uchun (≈ 70 kg/100 kg) qiymatdan yuqori bo‘lib, Qizilqum konsentratidagi ortiqcha kalsiy (erkin CaO) bilan izohlanadi – kislotaning ${f(c.CaOf / c.nAcid0 * 100, 1)} % i erkin CaO ni neytrallashga sarflanadi.`));
  add(H2('6.4. Aralashtirgich va kameradagi jarayonlar'));
  add(P(`Kislota avval tez reaksiyaga kirishuvchi qo‘shimchalar (CaO, CaCO₃, CaF₂, MgO, R₂O₃) bilan to‘liq reaksiyaga kirishadi; bunga ${f(c.impAcid, 5)} kmol H₂SO₄ sarflanadi. Qolgan kislota apatitni (2.1) bo‘yicha parchalaydi:`));
  add(F(`n_{ap}^{(1)} = (${f(c.nAcid, 5)} – ${f(c.impAcid, 5)})/5 = ${f(c.n1, 5)} kmol;   n_{H₃PO₄} = 3·${f(c.n1, 5)} = ${f(c.H3PO4f, 5)} kmol`, '6.5'));
  add(P(`Kamerada K_{p} = ${f(c.Kch, 2)} bo‘lganda parchalangan apatit ${f(c.Kch, 2)}·${f(c.ap, 5)} = ${f(c.Kch * c.ap, 5)} kmol, shundan (2.2) bo‘yicha fosfat kislota bilan parchalangani:`));
  add(F(`n_{ap}^{(2)} = ${f(c.Kch * c.ap, 5)} – ${f(c.n1, 5)} = ${f(c.n2, 5)} kmol`, '6.6'));
  add(P(`Bunda 7·n_{ap}^{(2)} = ${f(7 * c.n2, 5)} kmol H₃PO₄ va 5·n_{ap}^{(2)} = ${f(5 * c.n2, 5)} kmol suv sarflanadi, ${f(c.MCP, 5)} kmol Ca(H₂PO₄)₂·H₂O hosil bo‘ladi. Erkin fosfat kislota ${f(c.H3PO4, 5)} kmol, parchalanmagan apatit ${f(c.apRest, 5)} kmol.`));
  add(P(`Ftor balansi. Hosil bo‘lgan HF: n_{ap}^{(1)} + n_{ap}^{(2)} + 2n_{CaF₂} = ${f(c.HF, 5)} kmol. Gaz fazasiga ftorning ${f(c.fGas1 * 100, 0)} % i o‘tadi: n_{SiF₄} = ${f(c.fGas1, 2)}·${f(c.n.F, 5)}/4 = ${f(c.SiF4, 5)} kmol (${f(c.mSiF4, 3)} kg). Qolgan HF ${f(c.H2SiF6, 5)} kmol H₂SiF₆ hosil qiladi.`));
  add(P(`Suv balansi (kmol/100 kg): kirim – fosforit namligi ${f(c.n.H2O, 5)} va kislota suvi ${f(c.mAcidW / M.H2O, 5)}, jami ${f(c.Win, 5)}; reaksiyalarda hosil bo‘ladi ${f(c.Wform, 5)}; (2.2) da sarflanadi ${f(c.Wcons, 5)}. Kamerada bug‘lanadigan suv issiqlik balansidan topiladi (7-bo‘lim): W = ${f(c.Wev, 2)} kg (${f(c.Wev / M.H2O, 5)} kmol). Kamera superfosfatida qolgan erkin suv ${f(c.Wfree, 5)} kmol (${f(c.Wfree * M.H2O, 2)} kg).`));
  add(H2('6.5. Kamera va yetiltirilgan superfosfat'));
  add(F(`m_{ksf} = 100 + ${f(c.mAcidSol, 2)} – ${f(c.mCO2, 2)} (CO₂) – ${f(c.mSiF4, 2)} (SiF₄) – ${f(c.Wev, 2)} (H₂O) = ${f(c.mKSF, 2)} kg`, '6.7'));
  add(P(`Omborda parchalanish darajasi ${f(c.Kcur, 2)} gacha ortadi (qo‘shimcha ${f(c.n2c, 5)} kmol apatit parchalanadi), ${f(c.Wev2kg, 2)} kg suv bug‘lanadi va ${f(c.SiF4c * M.SiF4, 3)} kg SiF₄ ajraladi. Yetiltirilgan superfosfat massasi ${f(c.mSF, 2)} kg, ya’ni chiqish ${f(c.yield, 4)} kg/kg fosforit. Berilgan unumdorlik uchun fosforit sarfi va qayta hisoblash koeffitsiyenti:`));
  add(F(`G_{f} = G_{sf}/${f(c.yield, 4)} = ${f(c.G, 2)}/${f(c.yield, 4)} = ${f(c.Gph, 2)} kg/soat (${f(c.Gph / 3600, 5)} kg/s);   k = ${f(k, 4)}`, '6.8'));
  {
    const rows = Object.keys(c.compKSF).map(kk => [kk, f(c.compKSF[kk] * kd, 1), f(c.compKSF[kk] / c.mKSF * 100, 2), f(c.compSF[kk] * kd, 1), f(c.compSF[kk] / c.mSF * 100, 2)]);
    rows.push(B(['Jami', f(c.mKSF * kd, 1), '100,00', f(c.mSF * kd, 1), '100,00']));
    add(T('6.2', 'Kamera va yetiltirilgan superfosfatning tarkibi', ['Komponent', 'Kamera, kg/sutka', '%', 'Yetiltirilgan, kg/sutka', '%'], rows, [2.2, 1, 0.8, 1.1, 0.8]));
  }
  add(P(`Superfosfatdagi P₂O₅: umumiy – ${f(26 * kd, 1)} kg/sutka (kamerada ${f(P2O5ksf, 2)} %, tayyor mahsulotda ${f(P2O5sf, 2)} %); suvda eriydigan – kamerada ${f(wsK / c.mKSF * 100, 2)} %, tayyor mahsulotda ${f(wsS / c.mSF * 100, 2)} %; erkin kislotalik (P₂O₅ hisobida) – ${f(frK / c.mKSF * 100, 2)} % va ${f(frS / c.mSF * 100, 2)} %; namlik tayyor mahsulotda ${f(c.compSF['H₂O (erkin)'] / c.mSF * 100, 1)} %. Barcha ko‘rsatkichlar 3.4-jadval talablariga mos keladi.`));
  {
    add(T('6.3', 'P₂O₅ ning shakllar bo‘yicha taqsimlanishi (kg/sutka)', ['P₂O₅ shakli', 'Kamera superfosfati', '%', 'Tayyor superfosfat', '%'], (() => {
      const r = (cc) => { const mcp = cc['Ca(H₂PO₄)₂·H₂O'] / M.MCP * M.P2O5, fa = cc['H₃PO₄ (erkin)'] / M.H3PO4 / 2 * M.P2O5, ap = cc['Ca₅(PO₄)₃F (parchalanmagan)'] / M.ap * 1.5 * M.P2O5; return [mcp, fa, ap]; };
      const a = r(c.compKSF), b = r(c.compSF); const names = ['Monokalsiyfosfat', 'Erkin fosfat kislota', 'Parchalanmagan apatit'];
      const rows = names.map((nm, i) => [nm, f(a[i] * kd, 1), f(a[i] / 26 * 100, 1), f(b[i] * kd, 1), f(b[i] / 26 * 100, 1)]);
      rows.push(B(['Jami P₂O₅', f(26 * kd, 1), '100,0', f(26 * kd, 1), '100,0'])); return rows;
    })(), [2, 1.1, 0.8, 1.1, 0.8]));
    const Ftot = c.n.F * 19 * kd;
    add(T('6.4', 'Ftor balansi (kg/sutka F hisobida)', ['Yo‘nalish', 'F, kg/sutka', '%'], [
      ['Fosforit bilan keladi', f(Ftot, 2), '100,0'], ['Kamerada gazga (SiF₄)', f(c.fGas1 * Ftot, 2), f(c.fGas1 * 100, 1)],
      ['Omborda gazga (SiF₄)', f((c.fGas2 - c.fGas1) * Ftot, 2), f((c.fGas2 - c.fGas1) * 100, 1)], ['Superfosfatda qoladi', f((1 - c.fGas2) * Ftot, 2), f((1 - c.fGas2) * 100, 1)],
      ['Absorbsiyada ushlanadi (95 % kamera gazidan)', f(0.95 * c.fGas1 * Ftot, 2), f(0.95 * c.fGas1 * 100, 1)],
    ], [2.6, 1, 0.8]));
    add(P('Omborda ajraladigan ftor ombor ventilyatsiyasi orqali chiqadi; uni ham ushlash uchun yirik zavodlarda ombor havosi absorbsiyaga yuboriladi. Kichik tsexda ombor havosidagi ftor konsentratsiyasi ish zonasi me’yoridan oshmaydi.'));
  }
  add(H2('6.6. Tsexning moddiy balansi'));
  {
    const ph = 100 * kd, ac = c.mAcidSol * kd, ksf = c.mKSF * kd, co2 = c.mCO2 * kd, sif = c.mSiF4 * kd, w = c.Wev * kd;
    const g = x => f(x / 86400 * 1000, 3);
    add(T('6.5', 'Aralashtirgich va kameraning moddiy balansi', ['Kirim', 'kg/sutka', 'g/s', 'Sarf', 'kg/sutka', 'g/s'], [
      ['Fosforit (YuKFK)', f(ph, 1), g(ph), 'Kamera superfosfati', f(ksf, 1), g(ksf)],
      [`Sulfat kislota ${f(c.wA * 100, 0)} %:`, f(ac, 1), g(ac), 'CO₂', f(co2, 1), g(co2)],
      ['– H₂SO₄ (100 %)', f(c.mAcid * kd, 1), g(c.mAcid * kd), 'SiF₄', f(sif, 2), g(sif)],
      ['– H₂O', f(c.mAcidW * kd, 1), g(c.mAcidW * kd), 'Suv bug‘i', f(w, 1), g(w)],
      B(['Jami', f(ph + ac, 1), g(ph + ac), 'Jami', f(ksf + co2 + sif + w, 1), g(ksf + co2 + sif + w)]),
    ], [1.8, 1, 0.8, 1.8, 1, 0.8]));
    const sf = c.mSF * kd, w2 = c.Wev2kg * kd, s2 = c.SiF4c * M.SiF4 * kd;
    add(T('6.6', 'Yetiltirish bosqichining moddiy balansi', ['Kirim', 'kg/sutka', 'g/s', 'Sarf', 'kg/sutka', 'g/s'], [
      ['Kamera superfosfati', f(ksf, 1), g(ksf), 'Tayyor superfosfat', f(sf, 1), g(sf)],
      ['', '', '', 'Suv bug‘i', f(w2, 1), g(w2)], ['', '', '', 'SiF₄', f(s2, 2), g(s2)],
      B(['Jami', f(ksf, 1), g(ksf), 'Jami', f(sf + w2 + s2, 1), g(sf + w2 + s2)]),
    ], [1.8, 1, 0.8, 1.8, 1, 0.8]));
  }
  add(P(`93 % li kislotadan 68 % li kislota tayyorlash uchun: 93 % li kislota ${f(c.mA93 * 24, 1)} kg/sutka, suyultirish suvi ${f(c.mWdil * 24, 1)} kg/sutka. Ftorni ushlash darajasi 95 % bo‘lganda (2.8) reaksiya bo‘yicha ${f((c.SiF4 + c.SiF4c) * kd * 2 / 3 * M.H2SiF6 * 0.95, 1)} kg/sutka H₂SiF₆ (9 % li eritma sifatida ${f((c.SiF4 + c.SiF4c) * kd * 2 / 3 * M.H2SiF6 * 0.95 / 0.09, 0)} kg/sutka) olinadi. Sarf koeffitsiyentlari (1 t superfosfatga): fosforit – ${f(c.specPh, 3)} t; sulfat kislota (monogidrat) – ${f(c.specAcid, 3)} t; 68 % li kislota – ${f(c.specAcid / c.wA, 3)} t. Yillik ishlab chiqarish (330 sutka) – ${f(c.Gday * 330 / 1000, 0)} t superfosfat, fosforit sarfi ${f(c.Gph * 24 * 330 / 1000, 0)} t/yil.`));

  // ============ 7
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Hisoblash usuli'));
  add(P('Aralashtirgich va kameraning issiqlik balansi umumiy tarzda tuziladi (fizik issiqliklar 273,15 K ga nisbatan, 100 kg fosforitga):'));
  add(F('Q_{f} + Q_{k} + Q_{r} = Q_{sf} + Q_{g} + Q_{b} + Q_{yo‘q}', '7.1'));
  add(P('bu yerda Q_{f}, Q_{k} – fosforit va kislota bilan kiradigan issiqlik; Q_{r} – reaksiyalar issiqligi; Q_{sf} – kamera superfosfati bilan chiqadigan issiqlik; Q_{g} – CO₂ va SiF₄ bilan chiqadigan issiqlik; Q_{b} – bug‘langan suv bilan chiqadigan issiqlik; Q_{yo‘q} – atrof-muhitga yo‘qotishlar (kirimning 5 % i). Bug‘lanadigan suv miqdori W shu tenglamadan topiladi.'));
  add(H2('7.2. Issiqlik kirimi'));
  add(F(`Q_{f} = 100·c_{f}·(T_{f} – T₀) = 100·${f(c.cph, 2)}·${f(c.Tph - c.T0, 0)} = ${f(c.Qph, 0)} kJ`, '7.2'));
  add(F(`Q_{k} = m_{k}·c_{k}·(T_{k} – T₀) = ${f(c.mAcidSol, 2)}·${f(c.cpA, 2)}·${f(c.TA - c.T0, 0)} = ${f(c.QA, 0)} kJ`, '7.3'));
  add(T('7.1', 'Reaksiyalar issiqligi (100 kg fosforitga)', ['Reaksiya', 'n, kmol', 'q, kJ/mol', 'Q, kJ'], [
    ['Apatit + H₂SO₄', f(c.n1, 5), f(c.dH.ap1, 1), f(c.Qr.ap1, 0)], ['Apatit + H₃PO₄', f(c.n2, 5), f(c.dH.ap2, 1), f(c.Qr.ap2, 0)],
    ['CaO + H₂SO₄', f(c.CaOf, 5), f(c.dH.CaO, 1), f(c.Qr.CaO, 0)], ['CaCO₃ + H₂SO₄', f(c.CaCO3, 5), f(c.dH.CaCO3, 1), f(c.Qr.CaCO3, 0)],
    ['MgO + H₂SO₄', f(c.n.MgO, 5), f(c.dH.MgO, 1), f(c.Qr.MgO, 0)], ['Fe₂O₃ + 3H₂SO₄', f(c.n.Fe2O3, 5), f(c.dH.Fe, 1), f(c.Qr.Fe, 0)],
    ['Al₂O₃ + 3H₂SO₄', f(c.n.Al2O3, 5), f(c.dH.Al, 1), f(c.Qr.Al, 0)], ['CaF₂ + H₂SO₄', f(c.CaF2, 5), f(c.dH.CaF2, 1), f(c.Qr.CaF2, 0)],
    ['SiF₄ hosil bo‘lishi', f(c.SiF4, 5), f(c.dH.SiF4, 1), f(c.Qr.SiF4, 0)], ['H₂SiF₆ hosil bo‘lishi', f(c.H2SiF6, 5), f(c.dH.H2SiF6, 1), f(c.Qr.H2SiF6, 0)],
    B(['Jami', '', '', f(c.QrSum, 0)]),
  ], [2, 1, 1, 1]));
  add(P(`Jami kirim Q_{kir} = ${f(c.Qph, 0)} + ${f(c.QA, 0)} + ${f(c.QrSum, 0)} = ${f(c.Qin, 0)} kJ/100 kg fosforit, ya’ni ${f(kW(c.Qin), 2)} kW.`));
  add(H2('7.3. Issiqlik sarfi va bug‘lanadigan suv'));
  add(P(`Kamera superfosfatining harorati T_{sf} = ${f(c.Tch, 0)} K, issiqlik sig‘imi c_{sf} = ${f(c.cpS, 2)} kJ/(kg·K); gazlar ${f(c.Tg, 0)} K da chiqadi; suv bug‘ining entalpiyasi h_{b} = 2501 + 1,89·(T_{g} – 273,15) = ${f(c.hV, 1)} kJ/kg. Bug‘lanmagan massa m₀ = 100 + m_{k} – m_{CO₂} – m_{SiF₄} = ${f(c.mBase, 2)} kg. Balans tenglamasi:`));
  add(F('Q_{kir}·(1 – 0,05) = (m₀ – W)·c_{sf}·(T_{sf} – T₀) + Q_{g} + W·h_{b}', '7.4'));
  add(F(`W = (${f(c.Qin * 0.95, 0)} – ${f(c.mBase, 2)}·${f(c.cpS, 2)}·${f(c.Tch - c.T0, 0)} – ${f(c.Qgas, 0)})/(${f(c.hV, 1)} – ${f(c.cpS * (c.Tch - c.T0), 1)}) = ${f(c.Wev, 2)} kg`, '7.5'));
  add(P(`Demak, kamerada 100 kg fosforitga ${f(c.Wev, 2)} kg suv bug‘lanadi; tsex unumdorligi bo‘yicha – ${f(c.Wev * k, 2)} kg/soat (${f(c.Wev * k / 3600 * 1000, 3)} g/s). Issiqlik balansi 7.2-jadvalda keltirilgan.`));
  add(T('7.2', 'Aralashtirgich va kameraning issiqlik balansi', ['Kirim', 'kJ/100 kg', 'kW', '%', 'Sarf', 'kJ/100 kg', 'kW', '%'], [
    ['Fosforit bilan', f(c.Qph, 0), f(kW(c.Qph), 3), f(c.Qph / c.Qin * 100, 1), 'Superfosfat bilan', f(c.Qsf, 0), f(kW(c.Qsf), 3), f(c.Qsf / c.Qin * 100, 1)],
    ['Kislota bilan', f(c.QA, 0), f(kW(c.QA), 3), f(c.QA / c.Qin * 100, 1), 'CO₂ va SiF₄ bilan', f(c.Qgas, 0), f(kW(c.Qgas), 3), f(c.Qgas / c.Qin * 100, 1)],
    ['Reaksiyalar issiqligi', f(c.QrSum, 0), f(kW(c.QrSum), 3), f(c.QrSum / c.Qin * 100, 1), 'Suv bug‘i bilan', f(c.Qvap, 0), f(kW(c.Qvap), 3), f(c.Qvap / c.Qin * 100, 1)],
    ['', '', '', '', 'Yo‘qotishlar', f(c.Qloss, 0), f(kW(c.Qloss), 3), '5,0'],
    B(['Jami', f(c.Qin, 0), f(kW(c.Qin), 3), '100', 'Jami', f(c.Qsf + c.Qgas + c.Qvap + c.Qloss, 0), f(kW(c.Qsf + c.Qgas + c.Qvap + c.Qloss), 3), '100']),
  ], [1.6, 0.9, 0.7, 0.6, 1.6, 0.9, 0.7, 0.6]));
  add(H2('7.4. Kislota suyultirgichining issiqlik balansi'));
  add(P(`93 % li kislotani 68 % gacha suyultirishda ajraladigan issiqlik integral erish issiqliklari farqidan aniqlanadi: H₂SO₄ ning n = 0,41 mol suvdagi (93 %) erish issiqligi ≈ 14 kJ/mol, n = 2,56 mol suvdagi (68 %) ≈ 46 kJ/mol; ajraladigan issiqlik 32 kJ/mol H₂SO₄:`));
  add(F(`Q_{suy} = n_{H₂SO₄}·k·32/3,6 = ${f(c.nAcid * k, 4)}·32/3,6 = ${f(c.Qdil, 2)} kW`, '7.6'));
  {
    const mT = (c.mA93 + c.mWdil) / 3600; const Tad = 298.15 + c.Qdil / (mT * c.cpA); const Qc = mT * c.cpA * (Tad - c.TA);
    const dT = ((Tad - 303) - (c.TA - 293)) / Math.log((Tad - 303) / (c.TA - 293)); const F_ = Qc * 1000 / (350 * dT);
    add(P(`Boshlang‘ich komponentlar 298 K da bo‘lganda aralashma adiabatik ravishda T = 298 + Q_{suy}/(m·c_{p}) = ${f(Tad, 0)} K gacha qizigan bo‘lar edi. Kislotani ${f(c.TA, 0)} K gacha sovitish uchun olib chiqiladigan issiqlik Q = ${f(Qc, 2)} kW; sovituvchi suv 293 → 303 K, uning sarfi ${f(Qc / (4.19 * 10) * 3600, 0)} kg/soat. Grafitli sovitgich uchun K = 350 W/(m²·K), Δt_{o‘r} = ${f(dT, 1)} K, sovitish yuzasi F = ${f(F_, 2)} m².`));
  }
  add(H2('7.5. Kamera devori orqali yo‘qotishlarni tekshirish'));
  add(P(`Kameraning tashqi yuzasi (yon devor, qopqoq va tub, futerovka bilan) F = ${f(c.Fch, 2)} m². Tashqi yuza harorati 323 K, havo 293 K, issiqlik berish koeffitsiyenti α = 9,74 + 0,07·Δt = ${f(c.alpha, 2)} W/(m²·K):`));
  add(F(`Q_{yo‘q} = α·F·Δt = ${f(c.alpha, 2)}·${f(c.Fch, 2)}·30 = ${f(c.QlossW, 0)} W`, '7.7'));
  add(P(`Bu qiymat issiqlik balansida qabul qilingan yo‘qotishlarga (${f(kW(c.Qloss) * 1000, 0)} W) yaqin; qolgan qismi aralashtirgich va pulpa quvurlaridan yo‘qotiladi. Demak, 5 % li yo‘qotish asoslangan.`));

  {
    add(H2('7.6. Yetiltirish omborining issiqlik balansi'));
    const m = c.mKSF * k / 3600; const Q1 = m * c.cpS * (c.Tch - 303); const Qev = c.Wev2kg * k / 3600 * 2400; const Qr = c.n2c * k / 3600 * c.dH.ap2 * 1000;
    add(P(`Kamera superfosfati omborga ${f(c.Tch, 0)} K da tushadi va yetiltirish davomida atrof-muhit haroratiga yaqin (≈ 303 K) gacha soviydi. Bunda ajraladigan fizik issiqlik Q₁ = m·c·ΔT = ${f(m * 1000, 2)}·10⁻³·${f(c.cpS, 2)}·${f(c.Tch - 303, 0)} = ${f(Q1, 3)} kW, qo‘shimcha parchalanish (2.2) issiqligi Q₂ = ${f(Qr, 4)} kW. Bu issiqlik omborda ${f(c.Wev2kg * k, 2)} kg/soat suvni bug‘latishga (Q₃ = ${f(Qev, 3)} kW) va havoga konvektiv uzatishga sarflanadi. Ombor tabiiy ventilyatsiya bilan jihozlanadi; uyumni aralashtirish sovish va bug‘lanishni tezlashtiradi.`));
  }

  {
    add(H2('7.7. Kislota konsentratsiyasining issiqlik rejimiga ta’siri'));
    const rows = [0.62, 0.65, 0.68, 0.70, 0.72].map(w => {
      const mAS = c.mAcid / w; const QA = mAS * c.cpA * (c.TA - c.T0); const Qin = c.Qph + QA + c.QrSum; const mBase = 100 + mAS - c.mCO2 - c.mSiF4;
      const W = (Qin * 0.95 - mBase * c.cpS * (c.Tch - c.T0) - c.Qgas) / (c.hV - c.cpS * (c.Tch - c.T0));
      const wf = (c.Win * M.H2O - c.mAcidW + (mAS - c.mAcid) + (c.Wform - c.Wcons) * M.H2O - W) / (mBase - W) * 100;
      return [f(w * 100, 0), f(mAS, 1), f(W, 2), f(mBase - W, 1), f(wf, 1)];
    });
    add(P('(7.4) balans tenglamasi turli kislota konsentratsiyalari uchun yechildi (superfosfat harorati 388 K, qolgan shartlar o‘zgarmas). Natijalar 7.3-jadvalda keltirilgan: kislota kuchsizlanganda kameraga ko‘proq suv kiradi, uning bir qismi bug‘lanadi, ammo kamera superfosfatining namligi baribir ortadi.'));
    add(T('7.3', 'Kislota konsentratsiyasining bug‘lanadigan suv va namlikka ta’siri (100 kg fosforitga)', ['H₂SO₄, %', 'Kislota, kg', 'Bug‘langan suv W, kg', 'Kamera superfosfati, kg', 'Namlik, %'], rows, [1, 1, 1.2, 1.3, 1]));
  }

  // ============ 8
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(P('Asosiy apparat – uzluksiz ishlaydigan aylanuvchi superfosfat kamerasi (8.1-rasm). U halqasimon korpus, qo‘zg‘almas markaziy quvur, qopqoq, frezer, tayanch roliklar va aylantirish yuritmasidan iborat.'));
  add(IMG(path.join(FIG, 'kamera4.png'), 600, 300, '8.1-rasm. Aylanuvchi superfosfat kamerasining sxemasi',
    '1 – pulpa quyish patrubkasi; 2 – gaz chiqarish patrubkasi; 3 – tayanch roliklar; 4 – superfosfat chiqarish; 5 – qo‘zg‘almas markaziy quvur; 6 – kislotabardosh futerovka.'));
  add(H2('8.1. Kameraning ish hajmi'));
  add(P(`Kameraga kiruvchi massa (fosforit + kislota) G_{kir} = ${f(c.Gin, 2)} kg/soat, chiquvchi kamera superfosfati G_{chiq} = ${f(c.Gout, 2)} kg/soat; o‘rtacha sarf G_{o‘r} = ${f(c.Gav, 2)} kg/soat (${f(c.Gav / 3600, 5)} kg/s). Bo‘lish vaqti τ = 1,5 soat (5400 s), kameradagi massa zichligi ρ = ${c.rho} kg/m³:`));
  add(F(`V_{m} = G_{o‘r}·τ/ρ = ${f(c.Gav / 3600, 5)}·5400/${c.rho} = ${f(c.Vm, 4)} m³`, '8.1'));
  add(H2('8.2. Kameraning geometrik o‘lchamlari'));
  add(P(`Kamera – tashqi diametri D va markaziy quvur diametri d bo‘lgan halqasimon silindr. Massa balandligi H = ${f(c.H, 1)} m, markaziy quvur diametri d = ${f(c.d, 1)} m, to‘lish koeffitsiyenti φ = ${f(c.phi, 1)}:`));
  add(F('V_{m} = φ·(π/4)·(D² – d²)·H', '8.2'));
  add(F(`D = [V_{m}/(φ·0,785·H) + d²]^{0,5} = [${f(c.Vm, 4)}/(${f(c.phi, 1)}·0,785·${f(c.H, 1)}) + ${f(c.d ** 2, 2)}]^{0,5} = ${f(c.Dcalc, 3)} m`, '8.3'));
  add(P(`D = ${f(c.D, 1)} m qabul qilinadi. Haqiqiy ko‘rsatkichlar: halqa hajmi V_{h} = 0,785·(${f(c.D, 1)}² – ${f(c.d, 1)}²)·${f(c.H, 1)} = ${f(c.Vring, 4)} m³; ish hajmi V_{ish} = ${f(c.Vw, 4)} m³; haqiqiy bo‘lish vaqti τ = V_{ish}·ρ/G_{o‘r} = ${f(c.tauR, 0)} s (${f(c.tauR / 3600, 2)} soat).`));
  add(H2('8.3. Aylanish chastotasi'));
  add(F(`n = 1/τ = 1/${f(c.tauR, 0)} = ${e(c.nrot, 2)} s⁻¹ (bir aylanish ${f(c.tauR / 60, 0)} daqiqada)`, '8.4'));
  add(P(`Tashqi devorning chiziqli tezligi v = π·D·n = ${e(c.vlin, 2)} m/s. Kamera chervyakli reduktor va elektr dvigatel orqali aylantiriladi; tezlik chastota o‘zgartirgich bilan 0,8–1,2 marta rostlanadi, bu bo‘lish vaqtini ${f(c.tauR / 3600 / 1.2, 2)}–${f(c.tauR / 3600 / 0.8, 2)} soat oralig‘ida o‘zgartirish imkonini beradi.`));
  add(H2('8.4. Frezer hisobi'));
  add(F(`V_{fr} = G_{chiq}/ρ = ${f(c.Gout, 2)}/(3600·${c.rho}) = ${e(c.Vfr, 3)} m³/s`, '8.5'));
  add(P(`Frezer – radial joylashgan ikki pichoqli (z = 2) kesuvchi shnek, aylanish chastotasi n_{f} = ${f(c.nf, 2)} s⁻¹. O‘rtacha radiusda (r = (D + d)/4 = ${f(c.rm, 3)} m) kameraning chiziqli tezligi v_{r} = 2π·r·n = ${e(c.vr, 3)} m/s; har bir pichoq kesadigan qatlam qalinligi:`));
  add(F(`δ = v_{r}/(n_{f}·z) = ${e(c.vr, 3)}/(${f(c.nf, 2)}·2) = ${e(c.delta, 2)} m`, '8.6'));
  add(F(`N_{fr} = V_{fr}·e/η = ${e(c.Vfr, 3)}·1,5·10⁶/0,6 = ${f(c.Nfr, 0)} W`, '8.7'));
  add(P('bu yerda e = 1,5 MJ/m³ – qotgan superfosfatni kesishning solishtirma energiyasi, η = 0,6 – uzatma FIK. Ishga tushirish va massa qattiqligining o‘zgarishini hisobga olib, N = 0,75 kW li dvigatel qabul qilinadi. Kamerani aylantirish uchun 0,55 kW li motor-reduktor yetarli.'));
  add(H2('8.5. Korpus mustahkamligi'));
  add(P(`Massaning devorga gidrostatik bosimi p = ρ·g·H = ${c.rho}·9,81·${f(c.H, 1)} = ${f(c.pH, 0)} Pa. Korpus Ст3 po‘latidan ([σ] = 140 MPa, φ_{ch} = 0,8, c = 0,002 m):`));
  add(F(`s = p·D/(2[σ]·φ_{ch}) + c = ${f(c.pH, 0)}·${f(c.D, 1)}/(2·140·10⁶·0,8) + 0,002 = ${f(c.sR, 5)} m`, '8.8'));
  add(P('Hisobiy qalinlik kichik bo‘lgani uchun konstruktiv talablarga ko‘ra s = 0,006 m qabul qilinadi. Ichki yuzalar kislotabardosh diabaz plitkalari (0,035 m) bilan arzamit tsementida qoplanadi. Qopqoq qo‘zg‘almas, gaz chiqarish patrubkasi va pulpa quyish teshigi bilan jihozlanadi; qopqoq va aylanuvchi korpus orasidagi tirqish gidravlik zatvor bilan germetiklanadi.'));
  add(H2('8.6. Gaz chiqarish patrubkasi'));
  add(P(`Kameradan ajraladigan bug‘-gaz aralashmasi (${f(c.Tg, 0)} K) hajmi V_{g} = ${f(c.Vgas, 4)} m³/s. Kamera ostida bosim saqlash va ish zonasiga gaz chiqmasligi uchun so‘riladigan havo hisobiga gaz 15 marta suyultiriladi: V = ${f(c.Vsuck, 3)} m³/s. Gaz tezligi 10 m/s bo‘lganda patrubka diametri d = (4V/(πw))^{0,5} = ${f(c.dPipe, 3)} m → D_{y} = 150 mm.`));
  add(H2('8.7. Aralashtirgich hisobi'));
  add(P(`Pulpaning aralashtirgichda bo‘lish vaqti 5 daqiqa (300 s), zichligi ${c.rhoPulp} kg/m³. Kerakli ish hajmi V = G_{kir}·τ/ρ = ${f(c.Gin / 3600, 5)}·300/${c.rhoPulp} = ${f(c.Vmix, 4)} m³; to‘lish koeffitsiyenti 0,6 bo‘lganda geometrik hajm ${f(c.VmixG, 4)} m³. Uch seksiyali aralashtirgich o‘lchamlari: uzunligi 0,8 m, eni 0,25 m, balandligi 0,25 m (V = 0,05 m³), ikki val, kurakchalarning aylanish chastotasi 1,5 s⁻¹, dvigatel quvvati 1,1 kW.`));
  {
    add(H2('8.8. Bo‘lish vaqtining kamera o‘lchamlariga ta’siri'));
    const rows = [1.0, 1.25, 1.5, 1.75, 2.0].map(h => { const V = c.Gav / 3600 * h * 3600 / c.rho; const D = Math.sqrt(V / (c.phi * 0.785 * c.H) + c.d ** 2); return [f(h, 2), f(V, 4), f(D, 3), f(Math.ceil(D * 10) / 10, 1), f(1 / (h * 3600), 6)]; });
    add(P('Kamerada bo‘lish vaqti fosfatning reaksiyaga kirishish qobiliyatiga va talab qilinadigan parchalanish darajasiga qarab 1–2 soat oralig‘ida tanlanadi. Turli bo‘lish vaqtlari uchun kamera o‘lchamlari (8.1)–(8.3) formulalar bo‘yicha hisoblandi (H = 0,7 m, d = 0,4 m).'));
    add(T('8.1', 'Bo‘lish vaqtining kamera hajmi va diametriga ta’siri', ['τ, soat', 'V_{m}, m³', 'D_{hisob}, m', 'D_{qabul}, m', 'n, s⁻¹'], rows, [1, 1, 1, 1, 1]));
    add(P('Bo‘lish vaqtining 1,5 dan 2,0 soatga oshirilishi kamerada parchalanish darajasini 1–2 % ga oshiradi, lekin apparat diametrini 15 % ga kattalashtiradi. Qizilqum YuKFK uchun asosiy parchalanish yetiltirish bosqichida yuz berishini hisobga olib, τ = 1,5 soat qabul qilindi.'));
    add(H2('8.9. Yetiltirish ombori hisobi'));
    const days = [0, 1, 3, 5, 7, 10, 15, 20];
    const Kd = t_ => c.Kcur - (c.Kcur - c.Kch) * Math.exp(-t_ / 5.0);
    add(P(`Omborda parchalanish darajasining vaqt bo‘yicha o‘sishi eksponensial tenglama bilan yaqinlashtirildi (sanoat ma’lumotlari asosida): K_{p}(t) = K_{∞} – (K_{∞} – K₀)·exp(–t/t₀), bu yerda K₀ = ${f(c.Kch, 2)} – kamera chiqishidagi qiymat, K_{∞} = ${f(c.Kcur, 2)}, t₀ = 5 sutka – xarakteristik vaqt. Hisob natijalari 8.2-jadvalda va 8.2-rasmda keltirilgan.`));
    add(T('8.2', 'Yetiltirish davomida parchalanish darajasining o‘zgarishi', ['t, sutka', ...days.map(String)], [['K_{p}', ...days.map(d => f(Kd(d), 3))]], [1.1, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]));
    add(IMG(path.join(FIG, 'yetiltirish4.png'), 430, 255, '8.2-rasm. Yetiltirish davomida parchalanish darajasi va namlikning o‘zgarishi'));
    add(P(`15 sutkadan so‘ng K_{p} = ${f(Kd(15), 3)} ga yetadi, ya’ni loyihaviy qiymatga (${f(c.Kcur, 2)}) amalda erishiladi; shu sababli yetiltirish muddati 15 sutka qabul qilindi. Ombor sig‘imi ${f(c.Gday * 15 / 1000, 0)} t, uyuma hajmi ${f(c.Vstore, 1)} m³ (9-bo‘lim).`));
  }
  add(T('8.3', 'Superfosfat kamerasi hisobining asosiy natijalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['O‘rtacha massa sarfi, kg/s', f(c.Gav / 3600, 5)], ['Kameradagi massa hajmi, m³', f(c.Vm, 4)], ['Tashqi diametr D, m', f(c.D, 1)],
    ['Markaziy quvur diametri d, m', f(c.d, 1)], ['Massa balandligi H, m', f(c.H, 1)], ['Haqiqiy bo‘lish vaqti, s (soat)', `${f(c.tauR, 0)} (${f(c.tauR / 3600, 2)})`],
    ['Aylanish chastotasi, s⁻¹', e(c.nrot, 2)], ['Frezer quvvati (hisob / qabul), W', `${f(c.Nfr, 0)} / 750`],
    ['Bug‘lanadigan suv, kg/s', f(c.Wev * k / 3600, 5)], ['Korpus qalinligi, m', '0,006 + futerovka 0,035'],
  ], [2.5, 1.5]));

  // ============ 9
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Jihozlar soni n = V_{talab}/V_{bir} formula bo‘yicha aniqlanadi, bu yerda V_{talab} – talab etilgan unumdorlik, V_{bir} – bitta apparatning unumdorligi.'));
  add(P(`Superfosfat kamerasi. D = ${f(c.D, 1)} m li kamera 1,5 soatlik bo‘lish vaqtida ${f(c.Vw * c.rho / 1.5, 0)} kg/soat massani qayta ishlay oladi; talab etilgani ${f(c.Gav, 1)} kg/soat. n = ${f(c.Gav / (c.Vw * c.rho / 1.5), 2)} → 1 dona.`));
  add(P(`Aralashtirgich. Hajmi 0,05 m³ li aralashtirgich 5 daqiqalik bo‘lish vaqtida ${f(0.05 * 0.6 * c.rhoPulp / 300 * 3600, 0)} kg/soat pulpani o‘tkazadi; talab etilgani ${f(c.Gin, 1)} kg/soat. n = ${f(c.Gin / (0.05 * 0.6 * c.rhoPulp / 300 * 3600), 2)} → 1 dona.`));
  {
    const Vb = c.Gph * 24 * 1 / 1450; // 1 sutkalik zaxira
    add(P(`Fosforit bunkeri. Bir sutkalik zaxira (${f(c.Gph * 24, 0)} kg) uchun, uyuma zichligi 1450 kg/m³ va to‘lish koeffitsiyenti 0,8 bo‘lganda bunker hajmi V = ${f(Vb / 0.8, 2)} m³; V = 2,5 m³ li bunker – 1 dona. Lentali tarozili dozator (unumdorlik 0,05–0,3 t/soat) – 1 dona.`));
  }
  add(P(`Aralashtirgich yuritmasi quvvati. Pulpaning kurakchalarga ko‘rsatadigan qarshiligi bo‘yicha N = K·ρ·n³·d⁵·z, bu yerda K = 0,8 – quvvat koeffitsiyenti, ρ = ${c.rhoPulp} kg/m³, n = 1,5 s⁻¹, d = 0,22 m – kurakcha diametri, z = 6 – bitta valdagi kurakchalar juftlari soni: N = 0,8·${c.rhoPulp}·1,5³·0,22⁵·6 = ${f(0.8 * c.rhoPulp * 1.5 ** 3 * 0.22 ** 5 * 6, 0)} W. Ikki val va uzatma FIK (0,7) hisobga olinsa ${f(2 * 0.8 * c.rhoPulp * 1.5 ** 3 * 0.22 ** 5 * 6 / 0.7, 0)} W; ishga tushirish zaxirasi bilan 1,1 kW li dvigatel qabul qilinadi.`));
  add(P(`Lentali konveyer. Unumdorlik Q = ${f(c.Gout / 1000, 3)} t/soat; lenta kengligi 400 mm, tezligi 0,5 m/s bo‘lganda maksimal unumdorlik Q = 3600·S·v·ρ = 3600·0,01·0,5·1100 = 19,8 t/soat, ya’ni konveyer katta zaxira bilan ishlaydi. Konveyer uzunligi 15 m, quvvati ≈ 0,4 kW → 0,55 kW li motor-baraban; soni – 1.`));
  add(P(`Kislota idishlari. 93 % li kislota sarfi ${f(c.mA93, 1)} kg/soat (${f(c.mA93 / 1830, 3)} m³/soat); 3 sutkalik zaxira uchun V = ${f(c.mA93 / 1830 * 72 / 0.85, 2)} m³ → 5 m³ li idish, 1 dona. Dozalovchi idish (68 % li kislota) 0,2 m³ – 1 dona.`));
  add(P(`Yetiltirish ombori. Omborda 15 sutkalik mahsulot (${f(c.Gday * 15 / 1000, 0)} t) saqlanadi; uyuma zichligi ${c.rhoBulk} kg/m³, uyum balandligi ${f(c.hPile, 1)} m, maydondan foydalanish koeffitsiyenti 0,6 bo‘lganda ombor maydoni S = ${f(c.Vstore, 1)}/(${f(c.hPile, 1)}·0,6) = ${f(c.Astore, 1)} m². 6 × 7 m (42 m²) o‘lchamli bitta ombor seksiyasi qabul qilinadi.`));
  {
    const Vg = c.Vsuck; const Dsc = Math.sqrt(4 * Vg / (Math.PI * 1.2));
    add(P(`Ftor absorbsiyasi apparatlari. Gaz sarfi ${f(Vg, 3)} m³/s; purkagichli kamerada gaz tezligi 1,2 m/s bo‘lganda diametr D = ${f(Dsc, 3)} m → 0,4 m; skrubber ham shu diametrda, nasadka – 25 mm li keramik halqalar, balandligi 2 m. Har biridan 1 dona. Ventilyator: V = ${f(Vg * 3600, 0)} m³/soat, bosim 2 kPa, quvvat ${f(Vg * 2000 / 0.6 / 1000, 2)} kW → 0,75 kW, 1 ishchi + 1 zaxira.`));
  }

  add(T('9.1', 'Asosiy jihozlar sonini hisoblash natijalari', ['Jihoz', 'Talab etilgan', 'Bitta apparat imkoniyati', 'n_{hisob}', 'Qabul'], [
    ['Superfosfat kamerasi', `${f(c.Gav, 1)} kg/soat`, `${f(c.Vw * c.rho / 1.5, 0)} kg/soat`, f(c.Gav / (c.Vw * c.rho / 1.5), 2), '1'],
    ['Aralashtirgich', `${f(c.Gin, 1)} kg/soat`, `${f(0.05 * 0.6 * c.rhoPulp / 300 * 3600, 0)} kg/soat`, f(c.Gin / (0.05 * 0.6 * c.rhoPulp / 300 * 3600), 2), '1'],
    ['Fosforit bunkeri', `${f(c.Gph * 24 / 1450 / 0.8, 2)} m³`, '2,5 m³', f(c.Gph * 24 / 1450 / 0.8 / 2.5, 2), '1'],
    ['Kislota idishi (93 %)', `${f(c.mA93 / 1830 * 72 / 0.85, 2)} m³`, '5 m³', f(c.mA93 / 1830 * 72 / 0.85 / 5, 2), '1'],
    ['Yetiltirish ombori', `${f(c.Astore, 1)} m²`, '42 m²', f(c.Astore / 42, 2), '1'],
    ['Lentali konveyer', `${f(c.Gout / 1000, 3)} t/soat`, '19,8 t/soat', f(c.Gout / 1000 / 19.8, 3), '1'],
  ], [1.8, 1.3, 1.4, 0.8, 0.7]));

  // ============ 10
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Fosforit bunkeri', '1', 'V = 2,5 m³, konus tubli', 'Ст3'],
    ['2', 'Lentali tarozili dozator', '1', 'Unumdorlik 0,05–0,3 t/soat', 'Ст3'],
    ['3', '93 % li kislota idishi', '1', 'V = 5 m³', 'Ст3'],
    ['4', 'Suv idishi', '1', 'V = 1 m³', 'Ст3'],
    ['5', 'Kislota suyultirgichi-sovitgichi', '1', 'Quvurli, grafitli sovitgich F = 1 m²', 'Grafit / 12Х18Н10Т'],
    ['6', 'Dozalovchi idish (68 % H₂SO₄)', '1', 'V = 0,2 m³, sath rostlagichli', 'Ст3 + futerovka'],
    ['7', 'Uzluksiz aralashtirgich', '1', '3 seksiyali, V = 0,05 m³, N = 1,1 kW', 'Ст3 + diabaz'],
    ['8', 'Aylanuvchi superfosfat kamerasi', '1', `D = ${f(c.D * 1000, 0)} mm, d = ${f(c.d * 1000, 0)} mm, H = ${f(c.H * 1000, 0)} mm, N = 0,55 kW`, 'Ст3 + diabaz plitka'],
    ['9', 'Frezer', '1', 'z = 2, n = 0,2 s⁻¹, N = 0,75 kW', '12Х18Н10Т'],
    ['10', 'Lentali konveyer', '1', 'B = 400 mm, L = 15 m', 'Rezina lenta'],
    ['11', 'Yetiltirish ombori', '1', 'S = 42 m², greyfer kran Q = 1 t', 'Temir-beton'],
    ['12', 'Purkagichli absorbsiya kamerasi', '1', 'D = 400 mm, H = 2,5 m', 'Polipropilen / vinilplast'],
    ['13', 'Nasadkali skrubber', '1', 'D = 400 mm, H = 3 m, nasadka 25×25×3', 'Vinilplast'],
    ['14', 'Ventilyator', '2 (1 zaxira)', `V = ${f(c.Vsuck * 3600, 0)} m³/soat, ΔP = 2 kPa, N = 0,75 kW`, 'Kislotabardosh'],
    ['15', 'Sirkulyatsion nasos (absorbsiya)', '2 (1 zaxira)', 'Q = 2 m³/soat, H = 20 m', 'Polipropilen'],
  ], [0.5, 2.4, 1, 2.8, 1.5]));

  // ============ 11
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('Superfosfat tsexida tahliliy nazorat xomashyo sifatini, kislota normasini, parchalanish jarayonining borishini, tayyor mahsulot sifatini va atmosferaga chiqariladigan ftor miqdorini nazorat qilish uchun olib boriladi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul, asbob', 'Davriyligi'], [
    ['Fosforit (YuKFK)', 'P₂O₅, CaO, CO₂, namlik', '3.1-jadval', 'Fotokolorimetrik, kompleksonometrik', 'Har partiya'],
    ['Fosforit', 'Maydalik (0,16 mm elak qoldig‘i)', '≤ 15 %', 'Elak tahlili', '1 marta smenada'],
    ['Sulfat kislota (93 %)', 'H₂SO₄', '92,5–94 %', 'Titrlash, zichlik', 'Har partiya'],
    ['Suyultirilgan kislota', 'H₂SO₄; harorat', '68 ± 0,5 %; 333–343 K', 'Konsentratomer, termometr', 'Uzluksiz'],
    ['Kislota normasi', 'Kislota : fosforit nisbati', `${f(c.mAcidSol / 100, 3)} ± 0,01`, 'Sarf o‘lchagichlar', 'Uzluksiz'],
    ['Kamera superfosfati', 'P₂O₅ umumiy va o‘zlashtiriladigan, K_{p}', `K_{p} ≥ ${f(c.Kch, 2)}`, 'Fotokolorimetrik', 'Har 2 soatda'],
    ['Kamera superfosfati', 'Erkin kislotalik, namlik', '≤ 6 %; ≤ 16 %', 'Titrlash; quritish', 'Har 2 soatda'],
    ['Tayyor superfosfat', 'O‘zlashtiriladigan P₂O₅', '≥ 13,5 %', 'Fotokolorimetrik (molibdat)', 'Har partiya'],
    ['Tayyor superfosfat', 'Erkin kislotalik; namlik', '≤ 5 %; ≤ 15 %', 'Titrlash; quritish', 'Har partiya'],
    ['Absorbsiyadan chiqqan gaz', 'F (HF + SiF₄)', '≤ 10 mg/m³', 'Ionselektiv elektrod', '1 marta smenada'],
    ['H₂SiF₆ eritmasi', 'H₂SiF₆', '8–10 %', 'Titrlash', '1 marta smenada'],
    ['Ish zonasi havosi', 'HF; H₂SO₄ tumani; chang', '≤ 0,5; ≤ 1; ≤ 6 mg/m³', 'Gaz analizator, aspirator', '1 marta smenada'],
  ], [1.7, 1.7, 1.3, 1.8, 1.1]));
  add(P('Superfosfatdagi o‘zlashtiriladigan P₂O₅ namunani limon kislotasi yoki Peterman eritmasi bilan ishlab, eritmaga o‘tgan fosforni ammoniy molibdat bilan sariq (yoki askorbin kislota bilan qaytarilgan ko‘k) kompleks hosil qilib fotokolorimetrik o‘lchash orqali aniqlanadi. Erkin kislotalik namunaning suvli ajratmasini 0,1 N NaOH bilan bromkrezol yashili ishtirokida (pH 4,5) titrlash orqali aniqlanadi. Namlik 373–378 K da quritish orqali topiladi.'));
  add(P('Texnologik parametrlar nazorati: fosforit va kislota sarflari (tarozili dozator, induksion sarf o‘lchagich), kislota harorati va konsentratsiyasi, aralashtirgich va kamera harorati (termoparalar), kamera aylanish chastotasi, kamera ostidagi siyraklanish (50–100 Pa), absorbsiya bo‘limida suv sarfi. Kislota : fosforit nisbati avtomatik ravishda ushlab turiladi; kamera to‘xtaganda kislota berilishi blokirovka orqali to‘xtatiladi.'));

  add(H2('11.2. Avtomatlashtirish va xavfsizlik'));
  add(P('Tsexda quyidagi avtomatik rostlash konturlari ko‘zda tutiladi: fosforit sarfi (tarozili dozator tezligi orqali); kislota sarfi – fosforit sarfiga nisbatan (kislota normasini ushlab turish); kislota konsentratsiyasi – suyultirgichga beriladigan suv sarfi orqali; kislota harorati – sovitgichdagi suv sarfi orqali; kamera ostidagi siyraklanish – ventilyator zaslonkasi orqali.'));
  add(P('Blokirovkalar: kamera yoki frezer to‘xtaganda fosforit va kislota berilishi avtomatik to‘xtatiladi; ventilyator to‘xtaganda ham shunday; kislota harorati 353 K dan oshganda signal beriladi. Sulfat kislota va ftorli gazlar bilan ishlashda ishchilar maxsus kiyim, rezina qo‘lqop, ko‘zoynak va respirator bilan ta’minlanadi; kislota quvurlari himoya qoplamalari bilan jihozlanadi.'));
  // ============ 12
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Superfosfat ishlab chiqarish usullari solishtirilib, Qizilqum fosforitlaridan unumdorligi ${f(c.Gday / 1000, 0)} t/sutka bo‘lgan tsex uchun ${f(c.wA * 100, 0)} % li sulfat kislota bilan uzluksiz aralashtirgich, aylanuvchi superfosfat kamerasi va omborda yetiltirish sxemasi asoslab tanlandi.`));
  add(P(`2. Moddiy balans hisobi bo‘yicha: fosforit sarfi ${f(c.Gph, 2)} kg/soat (${f(c.Gph / 3600 * 1000, 2)} g/s), sulfat kislota (monogidrat) ${f(c.mAcid * k, 2)} kg/soat, ${f(c.wA * 100, 0)} % li kislota ${f(c.mAcidSol * k, 2)} kg/soat; kamera superfosfati ${f(c.mKSF * kd, 0)} kg/sutka; tayyor mahsulotda umumiy P₂O₅ ${f(P2O5sf, 2)} %, suvda eriydigan ${f(wsS / c.mSF * 100, 2)} %, parchalanish darajasi ${f(c.Kcur, 2)}. Sarf koeffitsiyentlari: fosforit – ${f(c.specPh, 3)} t/t, monogidrat – ${f(c.specAcid, 3)} t/t.`));
  add(P(`3. Issiqlik balansi bo‘yicha reaksiyalar issiqligi ${f(kW(c.QrSum), 2)} kW (uning ${f(c.Qr.CaO / c.QrSum * 100, 0)} % i erkin CaO ning neytrallanishi hisobiga), kamerada ${f(c.Wev * k, 2)} kg/soat suv bug‘lanadi, superfosfat harorati ${f(c.Tch, 0)} K; kislotani suyultirishda ${f(c.Qdil, 2)} kW issiqlik ajraladi.`));
  add(P(`4. Superfosfat kamerasi hisoblandi: massa hajmi ${f(c.Vm, 4)} m³, diametri ${f(c.D, 1)} m, markaziy quvur ${f(c.d, 1)} m, massa balandligi ${f(c.H, 1)} m, bo‘lish vaqti ${f(c.tauR / 3600, 2)} soat, aylanish chastotasi ${e(c.nrot, 2)} s⁻¹, frezer quvvati 0,75 kW. Talab qilinadigan kameralar soni – 1.`));
  add(P('5. Asosiy jihozlar ro‘yxati va tahliliy nazorat sxemasi tuzildi. Ftorli gazlarni ikki bosqichli absorbsiya bilan ushlash atmosferaga chiqindilarni sanitariya me’yorlari darajasiga tushiradi va qo‘shimcha mahsulot – kremniyftorid kislota olish imkonini beradi.'));

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
    'Позин М.Е. Технология минеральных удобрений. – 6-е изд. – Л.: Химия, 1989. – 352 с.',
    'Кармышов В.Ф. Химическая переработка фосфоритов. – М.: Химия, 1983. – 304 с.',
    'Намазов Ш.С., Беглов Б.М. и др. Переработка фосфоритов Центральных Кызылкумов. – Ташкент: Фан, 2010.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Qizilqum fosforitlaridan oddiy superfosfat ishlab chiqarish tsexining superfosfat kamerasi hisobi bilan loyihasi.', unum: 'Unumdorligi – 5 t/sutka (tayyor superfosfat bo‘yicha)' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
