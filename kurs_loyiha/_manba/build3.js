// 3-loyiha: Azot kislotasi ishlab chiqarish sexining (absorber) hisobi bilan loyihasi. 75 t/sutka
const path = require('path');
const L_ = require('./lib');
const { f, e, P, H1, H2, F, L, T, B, IMG } = L_;
const c = require('./calc3');
const t = require('./thermo');
const { Vm } = t;

const FIG = process.argv[2];
const OUT = process.argv[3];
const TMP = process.argv[4];

const NAMES = { NH3: 'NH₃', NO: 'NO', NO2: 'NO₂', O2: 'O₂', N2: 'N₂', Ar: 'Ar', H2O: 'H₂O' };
const ORDER = ['NH3', 'NO', 'NO2', 'O2', 'N2', 'Ar', 'H2O'];
const ks = x => f(x / 3600, 4);
function rowsOf(fl) {
  const n = t.sum(fl); let m = 0; const rows = [];
  for (const s of ORDER) {
    if (!fl[s] || fl[s] < 1e-9) continue;
    const mi = fl[s] * t.CP[s].M; m += mi;
    rows.push([NAMES[s], f(fl[s], 3), f(fl[s] * Vm, 1), f(mi, 2), f(fl[s] / n * 100, 2)]);
  }
  rows.push(B(['Jami', f(n, 3), f(n * Vm, 1), f(m, 2), '100,00']));
  return rows;
}
const gHead = ['Komponent', 'n_{i}, kmol/soat', 'V_{i}, m³/soat', 'm_{i}, kg/soat', 'y_{i}, % (hajm)'];
const W5 = [1.3, 1.1, 1.1, 1.1, 1.1];
const kgOf = fl => t.mass(fl);

const ENTRIES = ['1. Kirish', '2. Ishlab chiqarishning nazariy asoslari', '3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari',
  '4. Texnologik tizimlarni solishtirish va tanlash', '5. Tanlangan texnologik tizimning bayoni', '6. Moddiy balanslar hisobi',
  '7. Issiqlik balanslar hisobi', '8. Asosiy apparatlarning hisobi', '9. Asosiy texnologik jihozlarni sonini hisoblari',
  '10. Asosiy texnologik jihozlar ro‘yxati', '11. Ishlab chiqarishning tahliliy nazorati', '12. Kurs loyihasi bo‘yicha xulosalar', '13. Adabiyotlar ro‘yxati'];

function body() {
  const out = [];
  const add = (...x) => { for (const i of x) Array.isArray(i) ? out.push(...i) : out.push(i); };
  const condM = c.condAcid.HNO3 + c.condAcid.H2O;
  const VairTot = (c.nAir + c.sa) * Vm;

  // ============ 1
  add(H1('1. Kirish', { pageBreak: true }));
  add(P('Azot kislotasi – kimyo sanoatining eng muhim mahsulotlaridan biri. Uning asosiy qismi (75–80 %) azotli o‘g‘itlar – ammiakli selitra, kalsiyli selitra, nitroammofoska va murakkab o‘g‘itlar ishlab chiqarishda ishlatiladi. Bundan tashqari, azot kislotasi portlovchi moddalar, bo‘yoqlar, dori vositalari, polimer materiallar (kaprolaktam, adipin kislota) ishlab chiqarishda, metallarni qayta ishlash va rangli metallurgiyada qo‘llaniladi.'));
  add(P('O‘zbekiston Respublikasida azot kislotasi “Navoiyazot”, “Farg‘onaazot”, “Maxam-Chirchiq” aksiyadorlik jamiyatlarida ishlab chiqariladi va deyarli to‘liq ammiakli selitra hamda boshqa azotli o‘g‘itlar ishlab chiqarishga sarflanadi. Respublika qishloq xo‘jaligining azotli o‘g‘itlarga bo‘lgan ehtiyoji yildan-yilga ortib borayotgani, shuningdek, eskirgan agregatlarni yangi, tejamkor UKL-7 va AK-72M turidagi qurilmalar bilan almashtirish dasturlari azot kislotasi ishlab chiqarish texnologiyasini chuqur o‘rganishni talab qiladi.'));
  add(P('Zamonaviy usulda suyultirilgan azot kislotasi ammiakni havo kislorodi bilan platina katalizatorida oksidlash, hosil bo‘lgan azot (II) oksidini azot (IV) oksidigacha oksidlash va azot oksidlarini suv bilan yutish orqali olinadi. Jarayonning eng sekin va eng ko‘p hajm talab qiladigan bosqichi – absorbsiya bo‘lib, u balandligi 30–45 m bo‘lgan tarelkali absorberda olib boriladi. Absorber azot oksidlarining yutilish darajasini, ya’ni ammiak sarfini, mahsulot konsentratsiyasini va atmosferaga chiqariladigan dum gazlardagi azot oksidlari miqdorini belgilaydi. Shuning uchun absorberni to‘g‘ri hisoblash butun sexning iqtisodiy va ekologik ko‘rsatkichlari uchun hal qiluvchi ahamiyatga ega.'));
  add(P(`Ushbu kurs loyihasining maqsadi – unumdorligi ${c.G_day} t/sutka (100 % HNO₃ hisobida) bo‘lgan suyultirilgan azot kislotasi ishlab chiqarish sexini loyihalash va uning asosiy apparati – absorberni hisoblashdan iborat.`));
  add(P('Qo‘yilgan maqsadga erishish uchun quyidagi vazifalar belgilandi:', { keepNext: true }));
  add(L(['ammiakni oksidlash, NO ni oksidlash va azot oksidlarini absorbsiyalash jarayonlarining nazariy asoslarini tahlil qilish;',
    'xomashyo va mahsulotning fizik-kimyoviy xususiyatlarini o‘rganish;',
    'azot kislotasi ishlab chiqarish tizimlarini solishtirib, eng maqbulini tanlash;',
    'kontakt apparat, sovitgich-kondensator va absorberning moddiy va issiqlik balanslarini SI tizimida hisoblash;',
    'absorberning diametri, tarelkalar soni, gidravlik qarshiligi, sovitish yuzasi va devor qalinligini hisoblash;',
    'asosiy jihozlar sonini aniqlash, ularning ro‘yxati va tahliliy nazorat sxemasini tuzish.']));
  add(P('Barcha hisoblar SI xalqaro birliklar tizimida bajarilgan: massa – kg, modda miqdori – mol (kmol), harorat – K, bosim – Pa (MPa), energiya – J (kJ), quvvat – W (kW), hajm – m³, vaqt – s. Oqimlar qulaylik uchun soatlik miqdorda ham keltirilgan va kg/s, kW ga o‘tkazilgan. Gaz hajmlari normal sharoitga (273,15 K; 101 325 Pa) keltirilgan, V_{m} = 22,414 m³/kmol. Yillik ish vaqti 8000 soat (333 sutka).'));

  // ============ 2
  add(H1('2. Ishlab chiqarishning nazariy asoslari'));
  add(H2('2.1. Ammiakni oksidlash'));
  add(P('Ammiakni havo kislorodi bilan oksidlashda sharoitga qarab quyidagi reaksiyalar borishi mumkin:'));
  add(F('4NH₃ + 5O₂ = 4NO + 6H₂O;   ΔH°_{298} = –906,1 kJ', '2.1'));
  add(F('4NH₃ + 4O₂ = 2N₂O + 6H₂O;   ΔH°_{298} = –1105 kJ', '2.2'));
  add(F('4NH₃ + 3O₂ = 2N₂ + 6H₂O;   ΔH°_{298} = –1267,1 kJ', '2.3'));
  add(P('Barcha reaksiyalar amalda qaytmas, muvozanat konstantalari juda katta (10⁵³–10⁶⁷ tartibida). Shuning uchun jarayon natijasi termodinamika bilan emas, balki reaksiyalarning nisbiy tezligi, ya’ni katalizatorning selektivligi bilan belgilanadi. Platina va uning qotishmalari (Pt – 92,5 %, Rh – 3,5 %, Pd – 4 %) 1123–1193 K haroratda (2.1) reaksiyani tanlab tezlashtiradi; NO chiqishi atmosfera bosimida 97–98 %, 0,7–0,8 MPa da 94–95 % ga yetadi. Katalizator 0,09 mm diametrli simdan to‘qilgan (1 sm² da 1024 katak) setkalar ko‘rinishida ishlatiladi.'));
  add(P('Jarayon tashqi diffuziya sohasida boradi: ammiak katalizator sirtiga yetib kelishi bilanoq oksidlanadi. Kontakt vaqti 10⁻⁴ s atrofida bo‘lib, uning oshishi NO ning ammiak bilan reaksiyasi (6NO + 4NH₃ = 5N₂ + 6H₂O) va parchalanishi hisobiga chiqishni kamaytiradi. Ammiak-havo aralashmasida NH₃ miqdori 10–11 % (hajm) olinadi: bu O₂ : NH₃ nisbatini 1,7–1,9 ga teng qiladi (nazariy 1,25) va aralashmani portlash chegarasidan (14–15 %) xavfsiz masofada saqlaydi.'));
  add(H2('2.2. Azot (II) oksidining oksidlanishi'));
  add(F('2NO + O₂ = 2NO₂;   ΔH°_{298} = –114,1 kJ', '2.4'));
  add(F('2NO₂ ⇄ N₂O₄;   ΔH°_{298} = –57,2 kJ', '2.5'));
  add(P('(2.4) reaksiya – kam uchraydigan uch molekulali reaksiya bo‘lib, uning tezligi harorat ortishi bilan kamayadi (manfiy harorat koeffitsiyenti). Kinetik tenglama:'));
  add(F('–dp_{NO}/dτ = 2k·p²_{NO}·p_{O₂}', '2.6'));
  add(F('lg k = 652,1/T – 0,7356,   k – atm⁻²·s⁻¹', '2.7'));
  {
    const Ts = [283, 293, 303, 313, 323, 333, 373];
    add(T('2.1', 'NO oksidlanish tezlik konstantasining haroratga bog‘liqligi', ['T, K', ...Ts.map(String)], [['k, atm⁻²·s⁻¹', ...Ts.map(x => f(c.kT(x), 1))]], [1.4, 1, 1, 1, 1, 1, 1, 1]));
  }
  add(P('Reaksiya tezligi NO partsial bosimining kvadratiga va O₂ bosimiga proporsional, ya’ni umumiy bosimning kubiga proporsional. Shu sababli bosimning 0,1 MPa dan 0,75 MPa gacha oshirilishi oksidlanish tezligini 400 marta oshiradi va absorber hajmini keskin kamaytiradi. Konsentratsiya kamayishi bilan tezlik keskin pasayadi, shuning uchun NO ning oxirgi qismlarini oksidlash eng ko‘p hajm talab qiladi; absorber hisobi ham aynan shu bosqichga asoslanadi.'));
  add(H2('2.3. Azot oksidlarining suv bilan yutilishi'));
  add(P('Azot (IV) oksidi va uning dimeri suv bilan quyidagi reaksiyalar bo‘yicha o‘zaro ta’sirlashadi:'));
  add(F('2NO₂ + H₂O = HNO₃ + HNO₂', '2.8'));
  add(F('3HNO₂ = HNO₃ + 2NO + H₂O', '2.9'));
  add(F('3NO₂ + H₂O = 2HNO₃ + NO;   ΔH = –136 kJ (suyuq suvga)', '2.10'));
  add(P('(2.10) yig‘indi reaksiyadan ko‘rinadiki, yutilgan har 3 mol NO₂ dan 2 mol HNO₃ hosil bo‘ladi, 1 mol NO esa gazga qaytadi va uni yana oksidlash kerak bo‘ladi. Shu sababli absorbsiya jarayoni “oksidlanish – yutilish” sikllarining ko‘p marta takrorlanishidan iborat: gaz tarelkalar orasidagi bo‘shliqda oksidlanadi, tarelkadagi kislota qatlamida esa yutiladi. NO ni to‘liq HNO₃ ga aylantirish uchun yig‘indi tenglama:'));
  add(F('4NO + 3O₂ + 2H₂O = 4HNO₃', '2.11'));
  add(P('(2.10) reaksiya qaytar; uning muvozanati K₁ = p_{NO}/p³_{NO₂} kislota konsentratsiyasi va harorat ortishi bilan keskin kamayadi. Natijada atmosfera bosimida 47–50 % dan, 0,7–0,8 MPa da 58–60 % dan, 1,1 MPa da 62–65 % dan kuchli kislota olish mumkin emas. Absorbsiyani past haroratda (303–313 K) olib borish kerak, shuning uchun tarelkalarda sovitish zmeyeviklari o‘rnatiladi.'));
  add(H2('2.4. Jarayonga ta’sir etuvchi omillar'));
  add(P('Bosim. Bosim ortishi NO oksidlanishini tezlashtiradi, (2.10) muvozanatni o‘ngga suradi, mahsulot konsentratsiyasini va absorbsiya darajasini oshiradi, apparatlar hajmini kamaytiradi. Biroq ammiak oksidlanishida NO chiqishi kamayadi va platina yo‘qotilishi ortadi (0,1 MPa da 0,04–0,05 g/t, 0,73 MPa da 0,10–0,15 g/t HNO₃).'));
  add(P('Harorat. Ammiak oksidlanishida harorat 1153–1173 K da saqlanadi: past haroratda N₂ va N₂O ko‘p hosil bo‘ladi, yuqori haroratda platina yo‘qotilishi ortadi. NO oksidlanishi va absorbsiya uchun past harorat qulay, shu sababli nitroza gazlar 313 K gacha sovitiladi, absorber tarelkalari esa suv bilan sovitiladi.'));
  add(P('Kislorod miqdori. Absorbsiya oxirida NO ning oksidlanish tezligi O₂ bosimiga proporsional, shuning uchun absorber pastiga qo‘shimcha (ikkilamchi) havo beriladi va dum gazda 2,5–3,5 % O₂ saqlanadi. Ikkilamchi havo bir vaqtning o‘zida mahsulot kislotada erigan azot oksidlarini haydab chiqaradi (kislotani “oqartiradi”).'));

  add(H2('2.5. Katalizator yo‘qotilishi va qo‘shimcha jarayonlar'));
  add(P('Yuqori haroratda platina kislorod bilan uchuvchan PtO₂ oksidini hosil qiladi, u gaz oqimi bilan olib ketiladi. Shu sababli setkalar sirti “bo‘shashib”, g‘ovak strukturaga aylanadi va mexanik mustahkamligi kamayadi. Platina yo‘qotilishi harorat, bosim va gaz tezligi ortishi bilan ko‘payadi. Yo‘qotishni kamaytirish uchun kontakt apparatdan keyin palladiy-oltin qotishmasidan yasalgan platina tutuvchi setkalar (60–80 % platina ushlanadi) va mexanik filtrlar o‘rnatiladi; ishlatilgan setkalar qayta ishlash zavodiga yuboriladi.'));
  add(P('Katalizator zaharlari: fosfin (PH₃) – qaytmas zahar; vodorod sulfidi, asetilen, moy bug‘lari va temir oksidlari – vaqtinchalik zaharlar. Shu sababli ammiak va havo puxta tozalanadi, setkalar har 2–3 oyda 10–15 % li xlorid kislota bilan regeneratsiyalanadi. Ammiak oksidlanishida oz miqdorda (0,1–0,2 %) N₂O hosil bo‘ladi – u kuchli issiqxona gazi bo‘lgani uchun zamonaviy qurilmalarda kontakt apparatda maxsus katalizator bilan parchalanadi (2N₂O = 2N₂ + O₂).'));
  // ============ 3
  add(H1('3. Xomashyo va mahsulotning fizik-kimyoviy xususiyatlari'));
  add(H2('3.1. Ammiak'));
  add(P('Xomashyo sifatida suyuq ammiak (GOST 6221-90, A markasi; NH₃ ≥ 99,9 %, suv ≤ 0,1 %, moy ≤ 2 mg/kg) ishlatiladi. Ammiak – rangsiz, o‘tkir hidli, zaharli gaz (ish zonasida YuChK 20 mg/m³). Havo bilan 15–28 % (hajm) oralig‘ida (0,1 MPa, 293 K) portlovchi aralashma hosil qiladi; bosim va harorat ortishi bilan chegara kengayadi. Ammiakning asosiy xossalari 3.1-jadvalda keltirilgan.'));
  add(T('3.1', 'Ammiak, havo va azot oksidlarining fizik-kimyoviy xossalari [10, 13]', ['Modda', 'M, kg/kmol', 'ρ₀, kg/m³', 'T_{qay}, K', 'T_{kr}, K', 'P_{kr}, MPa', 'ΔH°_{f}, kJ/mol'], [
    ['Ammiak NH₃', '17,03', '0,771', '239,7', '405,5', '11,35', '–45,94'],
    ['Havo', '28,96', '1,293', '78,8', '132,5', '3,77', '0'],
    ['Azot (II) oksidi NO', '30,01', '1,340', '121,4', '180,2', '6,48', '+90,25'],
    ['Azot (IV) oksidi NO₂', '46,01', '2,054*', '294,3', '431,4', '10,13', '+33,18'],
    ['Diazot tetraoksidi N₂O₄', '92,01', '–', '294,3', '431,4', '10,13', '+9,16'],
    ['Diazot oksidi N₂O', '44,01', '1,978', '184,7', '309,6', '7,24', '+82,05'],
    ['Suv bug‘i H₂O', '18,02', '0,804', '373,2', '647,1', '22,06', '–241,81'],
  ], [2.2, 0.9, 0.9, 0.9, 0.9, 0.9, 1.1]));
  add(P('* – hisobiy qiymat (NO₂ normal sharoitda asosan N₂O₄ shaklida bo‘ladi).', { noIndent: true, size: 24 }));
  add(H2('3.2. Havo va katalizator'));
  add(P(`Havo tarkibi (quruq): N₂ – 78,09 %, O₂ – 20,95 %, Ar – 0,96 %. Havo atmosferadan olinadi va ko‘p bosqichli filtrlarda changdan tozalanadi, chunki chang va temir oksidlari platina katalizatorini zaharlaydi. Loyihada havo namligi 293 K da φ = 60 % deb qabul qilingan (suv bug‘i ${f(c.yW * 100, 2)} %). Katalizator – Pt–Rh–Pd qotishmasidan to‘qilgan setkalar (GIAP-1 qotishmasi: Pt 92,5 %, Rh 3,5 %, Pd 4 %), sim diametri 0,09 mm, 1 sm² da 1024 katak, setkaning faol sirti 1,8–1,9 m²/m².`));
  add(H2('3.3. Azot kislotasi'));
  add(P('Suvsiz azot kislotasi – rangsiz suyuqlik, zichligi 1513 kg/m³ (293 K), qaynash harorati 356 K, muzlash harorati 231,6 K. Yorug‘lik va issiqlik ta’sirida qisman parchalanadi (4HNO₃ = 4NO₂ + O₂ + 2H₂O), shuning uchun konsentrlangan kislota sarg‘ish rangda bo‘ladi. Suv bilan 68,4 % HNO₃ tarkibli azeotrop aralashma hosil qiladi (T_{qay} = 394,8 K, 0,1 MPa). Kuchli oksidlovchi; organik moddalar bilan aralashganda yonish xavfi bor. Suyultirilgan kislota uglerodli po‘latni kuchli korroziyaga uchratadi, xrom-nikelli zanglamas po‘latlar (12Х18Н10Т, 08Х18Н10Т, 08Х22Н6Т) va alyuminiy esa unga chidamli.'));
  add(T('3.2', 'Azot kislotasi suvli eritmalarining xossalari (293 K)', ['HNO₃, %', '10', '20', '30', '40', '50', '58', '60', '68,4'], [
    ['ρ, kg/m³', '1054', '1115', '1180', '1246', '1310', '1357', '1367', '1408'],
    ['T_{qay}, K (0,1 MPa)', '374', '377', '380', '385', '389', '393', '393', '395'],
    ['c_{p}, kJ/(kg·K)', '3,77', '3,47', '3,22', '2,97', '2,76', '2,64', '2,62', '2,47'],
    ['μ, mPa·s', '1,04', '1,13', '1,26', '1,42', '1,60', '1,80', '1,85', '1,92'],
  ], [1.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]));
  add(P(`Loyihaning mahsuloti – ${f(c.wP * 100, 0)} % li suyultirilgan azot kislotasi (GOST 53-91 va korxona texnik shartlari bo‘yicha: HNO₃ ≥ 56–58 %, erigan azot oksidlari N₂O₄ hisobida ≤ 0,07 %, prokalitdan keyingi qoldiq ≤ 0,004 %). Bunday kislota ammiakli selitra ishlab chiqarish uchun to‘g‘ridan-to‘g‘ri yaroqli: neytrallash issiqligi eritmadan ortiqcha suvni bug‘latishga yetarli.`));

  add(H2('3.4. Texnologik suv va yordamchi materiallar'));
  add(P('Absorberni sug‘orish uchun bug‘ kondensati yoki kimyoviy tuzsizlantirilgan suv ishlatiladi: xloridlar ≤ 0,5 mg/l (xlor ionlari zanglamas po‘latda nuqtali korroziyani keltirib chiqaradi), temir ≤ 0,05 mg/l, qattiqlik ≤ 5 mkg-ekv/l. Sovitish uchun aylanma suv (291–301 K) beriladi; zmeyeviklardan kislota oqib chiqishini aniqlash uchun suv pH i uzluksiz nazorat qilinadi. Dum gazlarni tozalash uchun gazsimon ammiak, ishga tushirishda va puflash uchun azot ishlatiladi.'));
  // ============ 4
  add(H1('4. Texnologik tizimlarni solishtirish va tanlash'));
  add(H2('4.1. Azot kislotasi ishlab chiqarish tizimlari'));
  add(P('Bosimga ko‘ra suyultirilgan azot kislotasi ishlab chiqarishning quyidagi tizimlari mavjud: 1) atmosfera bosimidagi tizim; 2) ammiak atmosfera bosimida oksidlanib, absorbsiya 0,35 MPa da olib boriladigan kombinatsiyalashgan tizim; 3) yagona o‘rtacha bosim (0,716–0,73 MPa) ostidagi tizim – UKL-7; 4) oksidlash 0,42 MPa, absorbsiya 1,1 MPa da olib boriladigan kombinatsiyalashgan tizim – AK-72. Ularning asosiy ko‘rsatkichlari 4.1-jadvalda keltirilgan [10, 14].'));
  add(T('4.1', 'Azot kislotasi ishlab chiqarish tizimlarini solishtirish', ['Ko‘rsatkich', '0,1 MPa', '0,1 / 0,35 MPa', 'UKL-7 (0,73 MPa)', 'AK-72 (0,42 / 1,1 MPa)'], [
    ['Kislota konsentratsiyasi, %', '45–48', '47–49', '55–60', '58–60'],
    ['NO chiqishi, %', '97–98', '97–98', '93–95', '95–96'],
    ['Absorbsiya darajasi, %', '92–93', '97–98', '99,0–99,5', '99,7–99,8'],
    ['NH₃ sarfi, t/t HNO₃', '0,300', '0,293', '0,285–0,290', '0,282–0,285'],
    ['Platina yo‘qotilishi, g/t', '0,045', '0,045', '0,10–0,15', '0,07–0,08'],
    ['Dum gazda NOx (tozalashsiz), %', '0,3–0,5', '0,15–0,2', '0,05–0,1', '0,005–0,01'],
    ['Energiya bilan o‘zini ta’minlashi', 'yo‘q', 'qisman', 'to‘liq (GTT-3)', 'to‘liq'],
    ['Agregat unumdorligi, ming t/yil', '45', '45–60', '120', '380'],
    ['Kapital xarajatlar', 'yuqori', 'yuqori', 'past', 'o‘rtacha'],
  ], [2.2, 1, 1.1, 1.3, 1.4]));
  add(P('Atmosfera bosimidagi tizim katta hajmli absorberlarni talab qiladi, kuchsiz kislota beradi va dum gazlarni ishqor bilan tozalashni taqozo etadi. AK-72 tizimi eng tejamkor, ammo yirik unumdorlik (380 ming t/yil) uchun mo‘ljallangan va murakkab ikki bosqichli kompressor agregatiga ega. UKL-7 tizimi esa ixcham, energiya jihatidan o‘zini to‘liq ta’minlaydi (dum gaz energiyasi gaz turbinasida havo kompressorini harakatga keltiradi), 55–60 % li kislota beradi va O‘zbekiston korxonalarida keng qo‘llaniladi, ekspluatatsiya tajribasi katta. Loyiha unumdorligi (75 t/sutka ≈ 25 ming t/yil) kichik bo‘lgani sababli, ixcham va oddiy yagona bosimli UKL-7 tipidagi sxema tanlandi.'));
  add(H2('4.2. Absorber turini tanlash'));
  add(P('Azot oksidlarini yutish uchun nasadkali va tarelkali absorberlar qo‘llaniladi. Nasadkali kolonnalarda reaksiya issiqligini olib chiqish qiyin va NO ni oksidlash uchun zarur erkin hajm kichik, shuning uchun ular faqat atmosfera bosimidagi eski tizimlarda ishlatilgan. Bosim ostida ishlovchi tizimlarda elaksimon (teshikli) tarelkali absorberlar qo‘llaniladi: tarelkalar orasidagi bo‘shliq NO ning oksidlanish hajmi bo‘lib xizmat qiladi, tarelkadagi barbotaj qatlamida esa azot oksidlari yutiladi va sovituvchi zmeyeviklar orqali issiqlik olinadi. Loyihada sovitish zmeyevikli, quyilish qurilmali elaksimon tarelkali absorber qabul qilindi; uning pastki qismida mahsulotni oqartirish tarelkalari joylashtiriladi.'));
  add(H2('4.3. Dum gazlarni tozalash usulini tanlash'));
  add(P('Dum gazlardagi azot oksidlarini tozalash uchun ishqoriy absorbsiya, yuqori haroratli katalitik qaytarish (tabiiy gaz bilan, 973–1073 K) va ammiak bilan selektiv katalitik qaytarish (523–573 K) qo‘llaniladi. Ammiak bilan selektiv qaytarish (4NO + 4NH₃ + O₂ = 4N₂ + 6H₂O) kam yoqilg‘i sarflaydi, CO va CH₄ chiqindisi bo‘lmaydi va NOx ni 0,005 % gacha kamaytiradi. Shuning uchun loyihada АВК-10 (alyumovanadiyli) katalizatorida selektiv tozalash qabul qilindi.'));

  // ============ 5
  add(H1('5. Tanlangan texnologik tizimning bayoni'));
  add(P('Azot kislotasi ishlab chiqarish sexining texnologik sxemasi 5.1-rasmda keltirilgan.'));
  add(IMG(path.join(FIG, 'sxema3.png'), 620, 372, '5.1-rasm. Suyultirilgan azot kislotasi ishlab chiqarish sexining texnologik sxemasi',
    '1 – havo filtri; 2 – havo kompressori (gaz turbinasi bilan bir valda); 3 – ammiak bug‘latgichi; 4 – ammiak qizdirgichi; 5 – filtrli aralashtirgich; 6 – kontakt apparat (platina setkalari); 7 – qozon-utilizator; B – bug‘ barabani; 8 – dum gaz isitgichi; 9 – sovitgich-kondensator; 10 – absorber; 11 – oqartirish qismi; 12 – kondensat nasosi; 13 – dum gaz isitgichi (2-bosqich); 14 – katalitik tozalash reaktori; 15 – gaz turbinasi.'));
  add(P(`Atmosfera havosi filtr 1 da tozalanib, kompressor 2 da ${f(c.Pc / 1e6, 2)} MPa gacha siqiladi. Havoning asosiy qismi (${f(c.nAir * Vm, 0)} m³/soat) aralashtirgich 5 ga, qolgan qismi (${f(c.sa * Vm, 0)} m³/soat) ikkilamchi havo sifatida absorberning oqartirish qismi 11 ga beriladi. Suyuq ammiak bug‘latgich 3 da bug‘latiladi, qizdirgich 4 da 373–393 K gacha isitiladi va aralashtirgich 5 da havo bilan aralashtiriladi. ${f(c.yNH3 * 100, 1)} % NH₃ li ammiak-havo aralashmasi keramik va metall-keramik filtrlardan o‘tib, ${f(c.Tmix, 0)} K haroratda kontakt apparat 6 ga kiradi.`));
  add(P(`Kontakt apparatda 9 ta Pt–Rh–Pd setkada ammiak ${c.Tc} K da oksidlanadi; NO chiqishi ${f(c.eta * 100, 1)} %. Kontakt apparat qozon-utilizator 7 bilan bir korpusda joylashgan: nitroza gazlar issiqligi hisobiga 1,6 MPa bosimli bug‘ olinadi. ${c.T_whb} K gacha sovigan gazlar dum gaz isitgichi 8 da ${c.T_th} K gacha soviydi va sovitgich-kondensator 9 ga kiradi. Bu yerda gaz ${f(c.Tcc, 0)} K gacha sovitiladi, suv bug‘i kondensatsiyalanadi va qisman oksidlangan azot oksidlari bilan reaksiyaga kirishib, ${f(c.wCond * 100, 0)} % li azot kislotasi (kondensat) hosil qiladi. Kondensat nasos 12 bilan absorberning shu konsentratsiyaga mos o‘rta tarelkasiga beriladi.`));
  add(P(`Nitroza gaz absorber 10 ning pastki qismiga (oqartirish tarelkalari ustiga) kiradi va ${c.N} ta elaksimon tarelka orqali yuqoriga ko‘tariladi. Absorber tepasiga texnologik suv (bug‘ kondensati) beriladi, u tarelkadan-tarelkaga oqib tushib, azot oksidlarini yutadi va konsentratsiyasi ortib boradi. Reaksiya issiqligi tarelkalardagi zmeyeviklar orqali aylanma suv bilan olinadi. ${f(c.wP * 100, 0)} % li kislota oqartirish qismida ikkilamchi havo bilan erigan azot oksidlaridan tozalanib, omborga yuboriladi.`));
  add(P(`Dum gaz (NOx ≈ ${f(c.yNOx_tail * 100, 2)} %, O₂ ≈ ${f(c.yO2_tail * 100, 1)} %) absorber tepasidan chiqib, isitgichlar 8 va 13 da 523–543 K gacha isitiladi, reaktor 14 da АВК-10 katalizatorida ammiak bilan selektiv qaytariladi (NOx ≤ 0,005 %) va gaz turbinasi 15 da kengayib, havo kompressori 2 ni (bug‘ turbinasi bilan birgalikda) harakatga keltiradi. Turbinadan keyin gaz quvur orqali atmosferaga chiqariladi.`));
  add(P('Sexda ammiak-havo aralashmasidagi NH₃ miqdori (avtomatik ravishda 11,5 % dan oshganda ammiak berilishi to‘xtatiladi), setkalar harorati, absorberga beriladigan suv sarfi, sovitish suvi harorati va dum gazdagi azot oksidlari uzluksiz nazorat qilinadi va rostlanadi.'));

  // ============ 6
  add(H1('6. Moddiy balanslar hisobi'));
  add(H2('6.1. Dastlabki ma’lumotlar'));
  add(L([`unumdorlik: G = ${c.G_day} t/sutka 100 % HNO₃ = ${f(c.G, 1)} kg/soat = ${f(c.G / 3600, 4)} kg/s;`,
    `mahsulot konsentratsiyasi ${f(c.wP * 100, 0)} % (massa);`,
    `ammiak-havo aralashmasida NH₃ – ${f(c.yNH3 * 100, 1)} % (hajm); kontakt apparatdagi bosim ${f(c.Pc / 1e6, 2)} MPa, harorat ${c.Tc} K;`,
    `NH₃ ning NO ga oksidlanish darajasi (selektivlik) η = ${f(c.eta, 3)}, qolgan ammiak N₂ gacha oksidlanadi;`,
    `havo namligi: 293 K, φ = 60 %; sovitgich-kondensator chiqishida T = ${f(c.Tcc, 0)} K, kondensat – ${f(c.wCond * 100, 0)} % li HNO₃, chiqishdagi gazning oksidlanish darajasi ${f(c.alphaCC * 100, 0)} %;`,
    `absorberdagi bosim ${f(c.Pa / 1e6, 2)} MPa, o‘rtacha harorat ${f(c.Tabs, 0)} K; dum gazda NOx – ${f(c.yNOx_tail * 100, 2)} %, O₂ – ${f(c.yO2_tail * 100, 1)} % (quruq gazda); dum gaz harorati ${f(c.Ttop, 0)} K.`]));
  add(H2('6.2. Ammiak va havo sarfi'));
  add(P('Ishlab chiqariladigan HNO₃ miqdori:'));
  add(F(`n_{HNO₃} = G/M_{HNO₃} = ${f(c.G, 1)}/63,013 = ${f(c.nP, 3)} kmol/soat`, '6.1'));
  add(P(`Ammiak sarfi n_{NH₃} = n_{HNO₃}/(η·β), bu yerda β – NO ning HNO₃ ga aylanish darajasi. β dum gazdagi NOx miqdoriga bog‘liq bo‘lgani uchun hisob ketma-ket yaqinlashish usulida bajarildi va quyidagi natija olindi:`));
  add(F(`n_{NH₃} = ${f(c.nA, 3)} kmol/soat = ${f(c.mNH3, 1)} kg/soat (${f(c.mNH3 / 3600, 4)} kg/s)`, '6.2'));
  add(P(`β = ${f(c.etaAbs, 4)}; umumiy chiqish (NH₃ → HNO₃) ${f(c.etaTot * 100, 2)} %; 1 t HNO₃ ga ammiak sarfi ${f(c.specNH3, 3)} t. Havo sarfi (nam havo):`));
  add(F(`n_{havo} = n_{NH₃}·(1 – y_{NH₃})/y_{NH₃} = ${f(c.nA, 3)}·0,895/0,105 = ${f(c.nAir, 2)} kmol/soat (${f(c.nAir * Vm, 0)} m³/soat)`, '6.3'));
  add(P(`Aralashmadagi O₂ : NH₃ nisbati = ${f(c.mix.O2 / c.nA, 3)}, bu (2.1) reaksiya uchun zarur 1,25 dan katta. Ammiak-havo aralashmasining tarkibi 6.1-jadvalda keltirilgan.`));
  add(T('6.1', 'Kontakt apparatga kiradigan ammiak-havo aralashmasi', gHead, rowsOf(c.mix), W5));
  add(H2('6.3. Kontakt apparat'));
  add(P(`(2.1) reaksiya bo‘yicha oksidlangan ammiak a₁ = η·n_{NH₃} = ${f(c.a1, 3)} kmol/soat, (2.3) bo‘yicha a₂ = ${f(c.a2, 3)} kmol/soat. Hosil bo‘ladi: NO – ${f(c.a1, 3)}; N₂ – a₂/2 = ${f(c.a2 / 2, 3)}; H₂O – 1,5·n_{NH₃} = ${f(1.5 * c.nA, 3)} kmol/soat. Kislorod sarfi 1,25·a₁ + 0,75·a₂ = ${f(1.25 * c.a1 + 0.75 * c.a2, 3)} kmol/soat.`));
  add(T('6.2', 'Kontakt apparatdan chiqadigan nitroza gaz', gHead, rowsOf(c.conv), W5));
  add(P(`Kontakt apparatning moddiy balansi: kirim ${f(kgOf(c.mix), 2)} kg/soat, sarf ${f(kgOf(c.conv), 2)} kg/soat (${ks(kgOf(c.conv))} kg/s); farq ${f(Math.abs(kgOf(c.mix) - kgOf(c.conv)), 3)} kg/soat. Nitroza gazdagi NO miqdori ${f(c.conv.NO / t.sum(c.conv) * 100, 2)} %.`));
  add(H2('6.4. Sovitgich-kondensator'));
  add(P(`313 K va ${f((c.Pa + 0.03e6) / 1e6, 2)} MPa da to‘yingan suv bug‘ining ulushi y = p_{s}/P = ${f(c.ps(c.Tcc), 0)}/${f(c.Pa + 0.03e6, 0)} = ${f(c.ps(c.Tcc) / (c.Pa + 0.03e6), 5)}. Gazdan kondensatsiyalanadigan suv w_{k} = ${f(c.wc, 3)} kmol/soat. Kondensatda hosil bo‘ladigan HNO₃ miqdori ${f(c.wCond * 100, 0)} % li konsentratsiya shartidan topiladi (har mol HNO₃ uchun (2.10) bo‘yicha 0,5 mol suv sarflanadi):`));
  add(F('63,013·n_{k} = 0,40·[63,013·n_{k} + 18,015·(w_{k} – 0,5n_{k})]', '6.4'));
  add(F(`n_{k} = 18,015·0,40·w_{k}/(63,013·0,60 + 0,5·18,015·0,40) = ${f(c.nCond, 3)} kmol/soat`, '6.5'));
  add(P(`Kondensat: HNO₃ – ${f(c.condAcid.HNO3, 2)} kg/soat, suv – ${f(c.condAcid.H2O, 2)} kg/soat, jami ${f(condM, 2)} kg/soat (${f(condM / 3600, 4)} kg/s). Bu jami mahsulotning ${f(c.nCond / c.nP * 100, 1)} % iga teng. Kondensatda yutilgan NO₂ – 1,5·n_{k} = ${f(1.5 * c.nCond, 3)}, gazga qaytgan NO – 0,5·n_{k} = ${f(0.5 * c.nCond, 3)} kmol/soat. Chiqishdagi gazning oksidlanish darajasi ${f(c.alphaCC * 100, 0)} % bo‘lishi uchun sovitgich-kondensatorda jami ${f(c.xox, 3)} kmol/soat NO oksidlanadi va ${f(0.5 * c.xox, 3)} kmol/soat O₂ sarflanadi.`));
  add(T('6.3', 'Sovitgich-kondensatordan chiqadigan nitroza gaz', gHead, rowsOf(c.ccOut), W5));
  {
    const mIn = kgOf(c.conv), mG = kgOf(c.ccOut);
    add(T('6.4', 'Sovitgich-kondensatorning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Nitroza gaz', f(mIn, 1), ks(mIn), 'Nitroza gaz', f(mG, 1), ks(mG)],
      ['', '', '', 'Kondensat: HNO₃', f(c.condAcid.HNO3, 1), ks(c.condAcid.HNO3)],
      ['', '', '', 'Kondensat: H₂O', f(c.condAcid.H2O, 1), ks(c.condAcid.H2O)],
      B(['Jami', f(mIn, 1), ks(mIn), 'Jami', f(mG + condM, 1), ks(mG + condM)]),
    ], [1.7, 1, 0.9, 1.7, 1, 0.9]));
    add(P(`Kirim va sarf orasidagi farq ${f(Math.abs(mIn - mG - condM), 3)} kg/soat – yaxlitlash xatoligi chegarasida. Kondensatga o‘tgan azot ${f(c.nCond * 14.007, 1)} kg/soat (jami azotning ${f(c.nCond / c.a1 * 100, 1)} % i).`));
  }
  add(H2('6.5. Absorber'));
  add(P(`Ikkilamchi havo miqdori dum gazdagi O₂ ulushi ${f(c.yO2_tail * 100, 1)} % bo‘lishi shartidan aniqlanadi. Absorberda NO₂ (2.10) bo‘yicha to‘liq, NO esa (2.11) bo‘yicha yutiladi: har mol NO uchun 0,75 mol, har mol NO₂ uchun 0,25 mol O₂ sarflanadi. Iteratsion hisob natijasi: ikkilamchi havo ${f(c.sa, 3)} kmol/soat (${f(c.sa * Vm, 0)} m³/soat), dum gazdagi NOx – ${f(c.NOxo, 4)} kmol/soat, O₂ – ${f(c.O2o, 3)} kmol/soat. Absorberda hosil bo‘lgan HNO₃:`));
  add(F(`n_{abs} = (n_{NO} + n_{NO₂})_{kir} – n_{NOx,chiq} = ${f(c.absIn.NO + c.absIn.NO2, 3)} – ${f(c.NOxo, 4)} = ${f(c.nAbs, 3)} kmol/soat`, '6.6'));
  add(P(`Tekshiruv: n_{abs} + n_{k} = ${f(c.nAbs, 3)} + ${f(c.nCond, 3)} = ${f(c.nTot, 3)} kmol/soat = ${f(c.nTot * 63.013, 1)} kg/soat HNO₃ – topshiriqqa mos.`));
  add(T('6.5', 'Absorberga kiradigan gaz (ikkilamchi havo bilan)', gHead, rowsOf(c.absIn), W5));
  add(T('6.6', 'Absorberdan chiqadigan dum gaz', gHead, rowsOf(c.tail), W5));
  add(P(`Absorberga beriladigan suv miqdori suv balansidan topiladi. Mahsulotdagi suv ${f(c.waterProd, 1)} kg/soat; (2.11) reaksiyaga sarflanadigan suv 0,5·n_{abs}·18,015 = ${f(c.waterReactAbs, 1)} kg/soat; dum gaz bilan chiqadigan bug‘ (303 K da to‘yingan) ${f(c.vapOut, 1)} kg/soat; kondensat bilan keladigan suv ${f(c.waterCond, 1)} kg/soat; gaz bilan keladigan bug‘ ${f(c.vapIn, 1)} kg/soat:`));
  add(F(`W = ${f(c.waterProd, 1)} + ${f(c.waterReactAbs, 1)} + ${f(c.vapOut, 1)} – ${f(c.waterCond, 1)} – ${f(c.vapIn, 1)} = ${f(c.W, 1)} kg/soat`, '6.7'));
  {
    const mIn = c.mGasIn + c.mSA + condM + c.W, mOut = c.mTail + c.mProd;
    add(T('6.7', 'Absorberning moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Nitroza gaz', f(c.mGasIn, 1), ks(c.mGasIn), 'Dum gaz', f(c.mTail, 1), ks(c.mTail)],
      ['Ikkilamchi havo', f(c.mSA, 1), ks(c.mSA), `HNO₃ ${f(c.wP * 100, 0)} %:`, f(c.mProd, 1), ks(c.mProd)],
      ['Kondensat (40 %)', f(condM, 1), ks(condM), '– HNO₃', f(c.G, 1), ks(c.G)],
      ['Texnologik suv', f(c.W, 1), ks(c.W), '– H₂O', f(c.waterProd, 1), ks(c.waterProd)],
      B(['Jami', f(mIn, 1), ks(mIn), 'Jami', f(mOut, 1), ks(mOut)]),
    ], [1.7, 1, 0.9, 1.7, 1, 0.9]));
    add(P(`Kirim va sarf orasidagi farq ${f(Math.abs(mIn - mOut), 2)} kg/soat (${f(Math.abs(mIn - mOut) / mIn * 100, 3)} %) – hisob aniqligi chegarasida.`));
  }
  add(H2('6.6. Sexning umumiy moddiy balansi va sarf koeffitsiyentlari'));
  {
    const mNH3 = c.mNH3, mAir = kgOf({ N2: c.mix.N2, O2: c.mix.O2, Ar: c.mix.Ar, H2O: c.mix.H2O }) + c.mSA;
    const mIn = mNH3 + mAir + c.W, mOut = c.mProd + c.mTail;
    add(T('6.8', 'Sexning umumiy moddiy balansi', ['Kirim', 'kg/soat', 'kg/s', 'Sarf', 'kg/soat', 'kg/s'], [
      ['Ammiak', f(mNH3, 1), ks(mNH3), `Azot kislotasi ${f(c.wP * 100, 0)} %`, f(c.mProd, 1), ks(c.mProd)],
      ['Havo (jami)', f(mAir, 1), ks(mAir), 'Dum gaz', f(c.mTail, 1), ks(c.mTail)],
      ['Texnologik suv', f(c.W, 1), ks(c.W), '', '', ''],
      B(['Jami', f(mIn, 1), ks(mIn), 'Jami', f(mOut, 1), ks(mOut)]),
    ], [1.7, 1, 0.9, 1.7, 1, 0.9]));
    add(P(`1 t 100 % li HNO₃ ga sarf koeffitsiyentlari: ammiak – ${f(c.specNH3, 3)} t; havo – ${f(VairTot / c.G * 1000, 0)} m³; texnologik suv – ${f(c.W / c.G, 3)} t; platina (qaytarilmaydigan yo‘qotish) – ${f(c.lossPt, 2)} g. Dum gazlarni tozalash uchun qo‘shimcha ammiak (NH₃ : NOx = 1,1) ${f(c.NOxo * 1.1 * 17.031, 1)} kg/soat. Yillik ishlab chiqarish (333 sutka) – ${f(c.G_day * 333, 0)} t 100 % HNO₃ yoki ${f(c.G_day * 333 / c.wP, 0)} t ${f(c.wP * 100, 0)} % li kislota.`));
  }

  // ============ 7
  add(H1('7. Issiqlik balanslar hisobi'));
  add(H2('7.1. Hisoblash usuli'));
  add(P('Issiqlik balanslari Q_{kir} = Q_{sarf} tenglamasi asosida tuziladi. Gazlarning fizik issiqligi 298,15 K ga nisbatan hisoblanadi; issiqlik sig‘imi c_{p} = a + bT + c′/T² tenglamasi bilan ifodalanadi, entalpiya o‘zgarishi:'));
  add(F('ΔH_{i} = a(T – T₀) + b/2·(T² – T₀²) – c′(1/T – 1/T₀)', '7.1'));
  add(T('7.1', 'Issiqlik sig‘imi koeffitsiyentlari [2, 13]', ['Modda', 'a', 'b·10³', 'c′·10⁻⁵', 'ΔH (473 K), kJ/kmol', 'ΔH (1163 K), kJ/kmol'],
    ['NH3', 'NO', 'NO2', 'O2', 'N2', 'Ar', 'H2O'].map(s => { const k = t.CP[s]; return [NAMES[s], f(k.a, 2), f(k.b * 1e3, 2), k.d ? f(k.d / 1e5, 2) : '–', f(t.dH(s, 473), 0), f(t.dH(s, 1163), 0)]; }), [1, 0.9, 0.9, 0.9, 1.3, 1.3]));
  add(H2('7.2. Kontakt apparatning issiqlik balansi'));
  add(P(`Reaksiyalar issiqligi: (2.1) bo‘yicha 906,1/4 = 226,5 kJ/mol NH₃, (2.3) bo‘yicha 1267,1/4 = 316,8 kJ/mol NH₃:`));
  add(F(`Q_{r} = (a₁·226,5 + a₂·316,8)/3,6 = (${f(c.a1, 3)}·226,5 + ${f(c.a2, 3)}·316,8)/3,6 = ${f(c.Qr_c, 1)} kW`, '7.2'));
  add(P(`Nitroza gaz bilan ${c.Tc} K da chiqadigan issiqlik Q_{chiq} = Σn_{i}ΔH_{i}/3600 = ${f(c.Hout_c, 1)} kW. Issiqlik yo‘qotishlari kirimning ${f(c.lossC * 100, 1)} % i. Setkalar harorati ${c.Tc} K bo‘lishi uchun aralashmaning zarur harorati balans tenglamasidan topiladi:`));
  add(F(`(Q_{aral}(T) + Q_{r})·(1 – 0,015) = Q_{chiq}  ⇒  T_{aral} = ${f(c.Tmix, 1)} K`, '7.3'));
  add(P(`Aralashmaning fizik issiqligi ${f(c.Hin_c, 1)} kW. Gazning adiabatik qizishi ΔT = ${f(c.dTad, 0)} K, ya’ni aralashmadagi har 1 % NH₃ ga ${f(c.dTad / (c.yNH3 * 100), 1)} K. Aralashma ${f(c.Tmix, 0)} K gacha havoni kompressorda siqishda qizishi (≈ 450–480 K) hisobiga isitiladi.`));
  {
    const qin = c.Hin_c + c.Qr_c;
    add(T('7.2', 'Kontakt apparatning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
      ['Aralashmaning fizik issiqligi', f(c.Hin_c, 1), f(c.Hin_c / qin * 100, 1), 'Nitroza gaz issiqligi', f(c.Hout_c, 1), f(c.Hout_c / qin * 100, 1)],
      ['Reaksiyalar issiqligi', f(c.Qr_c, 1), f(c.Qr_c / qin * 100, 1), 'Yo‘qotishlar', f(qin * c.lossC, 1), f(c.lossC * 100, 1)],
      B(['Jami', f(qin, 1), '100', 'Jami', f(c.Hout_c + qin * c.lossC, 1), '100']),
    ], [1.9, 0.8, 0.6, 1.9, 0.8, 0.6]));
  }
  add(H2('7.3. Qozon-utilizator va dum gaz isitgichi'));
  add(P(`Nitroza gaz qozon-utilizatorda ${c.Tc} K dan ${c.T_whb} K gacha sovitiladi:`));
  add(F(`Q_{qu} = Σn_{i}[ΔH_{i}(${c.Tc}) – ΔH_{i}(${c.T_whb})]/3600 = ${f(c.Q_whb, 1)} kW`, '7.4'));
  add(P(`FIK 0,97, ta’minot suvi entalpiyasi 440,2 kJ/kg (378 K), 1,6 MPa to‘yingan bug‘ entalpiyasi 2793 kJ/kg bo‘lganda bug‘ chiqishi G_{b} = Q_{qu}·0,97·3600/(2793 – 440,2) = ${f(c.G_steam, 0)} kg/soat (${f(c.G_steam / 3600, 3)} kg/s), ya’ni 1 t HNO₃ ga ${f(c.G_steam / c.G, 2)} t bug‘. Dum gaz isitgichi 8 da gaz ${c.T_whb} K dan ${c.T_th} K gacha soviydi va dum gazga ${f(c.Q_th, 1)} kW issiqlik beradi.`));
  add(H2('7.4. Sovitgich-kondensator'));
  add(P(`Sovitgich-kondensatorda gaz ${c.T_th} K dan ${f(c.Tcc, 0)} K gacha soviydi, suv bug‘i kondensatsiyalanadi, NO oksidlanadi va kislota hosil bo‘ladi. Issiqlik yuklamasi oqimlarning to‘liq entalpiyalari (hosil bo‘lish entalpiyasi bilan) farqi sifatida hisoblandi; 40 % li HNO₃ ning eritmadagi hosil bo‘lish entalpiyasi –199,6 kJ/mol (erish issiqligi bilan):`));
  add(F(`Q₉ = H_{gaz,kir} – H_{gaz,chiq} – H_{kond} = ${f(c.Q_cc, 1)} kW`, '7.5'));
  add(P(`Sovituvchi suv 291 K dan 301 K gacha isiydi, uning sarfi G_{s} = Q₉/(c_{s}·ΔT) = ${f(c.Q_cc / (4.19 * 10) * 3600 / 1000, 1)} t/soat.`));
  add(H2('7.5. Absorberning issiqlik balansi'));
  add(P('Absorberda issiqlik quyidagi manbalardan ajraladi: NO ning oksidlanishi (2.4) – 57,07 kJ/mol NO; NO₂ ning suvda yutilib, kislota hosil qilishi (2.10) – suyuq suvga va 58 % li eritmaga nisbatan 56,7 kJ/mol HNO₃; gazdagi suv bug‘ining kondensatsiyasi. Absorberda oksidlangan NO miqdori (kirgan NO, (2.10) bo‘yicha qayta hosil bo‘lgan NO va chiqqan NO farqi):'));
  add(F(`n_{oks} = n_{NO,kir} – n_{NO,chiq} + 0,5·n_{abs} = ${f(c.absIn.NO, 3)} – ${f(c.NOxo, 3)} + 0,5·${f(c.nAbs, 3)} = ${f(c.nOxAbs, 3)} kmol/soat`, '7.6'));
  add(F(`Q₁ = ${f(c.nOxAbs, 3)}·57,07/3,6 = ${f(c.Q1, 1)} kW;   Q₂ = ${f(c.nAbs, 3)}·56,7/3,6 = ${f(c.Q2, 1)} kW`, '7.7'));
  add(P(`Gaz va ikkilamchi havo bilan kiradigan fizik issiqlik ${f(c.Hg_in, 1)} kW, suyuqliklar (kondensat 313 K, suv 303 K) bilan ${f(c.HL_in, 1)} kW, bug‘ kondensatsiyasi ${f(c.Qvap, 1)} kW. Sarf: dum gaz bilan (303 K) ${f(c.Hg_out, 1)} kW, mahsulot kislota bilan (313 K, c_{p} = 2,75 kJ/(kg·K)) ${f(c.HL_out, 1)} kW, yo‘qotishlar 1 %. Sovituvchi suv bilan olib chiqilishi kerak bo‘lgan issiqlik:`));
  add(F(`Q_{sov} = Q_{kir}·0,99 – Q_{dum} – Q_{kisl} = ${f(c.Qcool, 1)} kW`, '7.8'));
  add(T('7.3', 'Absorberning issiqlik balansi', ['Kirim', 'kW', '%', 'Sarf', 'kW', '%'], [
    ['Gazlarning fizik issiqligi', f(c.Hg_in, 1), f(c.Hg_in / c.QinA * 100, 1), 'Dum gaz bilan', f(c.Hg_out, 1), f(c.Hg_out / c.QinA * 100, 1)],
    ['Suyuqliklar bilan', f(c.HL_in, 1), f(c.HL_in / c.QinA * 100, 1), 'Mahsulot kislota bilan', f(c.HL_out, 1), f(c.HL_out / c.QinA * 100, 1)],
    ['NO oksidlanishi', f(c.Q1, 1), f(c.Q1 / c.QinA * 100, 1), 'Sovituvchi suv bilan', f(c.Qcool, 1), f(c.Qcool / c.QinA * 100, 1)],
    ['HNO₃ hosil bo‘lishi', f(c.Q2, 1), f(c.Q2 / c.QinA * 100, 1), 'Yo‘qotishlar', f(c.QinA * c.lossA, 1), f(c.lossA * 100, 1)],
    ['Bug‘ kondensatsiyasi', f(c.Qvap, 1), f(c.Qvap / c.QinA * 100, 1), '', '', ''],
    B(['Jami', f(c.QinA, 1), '100', 'Jami', f(c.Hg_out + c.HL_out + c.Qcool + c.QinA * c.lossA, 1), '100']),
  ], [1.9, 0.8, 0.6, 1.9, 0.8, 0.6]));
  add(P(`Sovituvchi suv (291 → 301 K) sarfi G_{s} = Q_{sov}/(c_{s}·ΔT) = ${f(c.Qcool, 1)}/(4,19·10) = ${f(c.Gw / 3600, 2)} kg/s (${f(c.Gw / 1000, 1)} t/soat).`));

  {
    const en = c.energy;
    add(H2('7.6. Havo kompressori va gaz turbinasining energetik balansi'));
    add(P(`Havo kompressorida ${f(en.mAir, 3)} kg/s havo 0,1 MPa dan 0,85 MPa gacha siqiladi. Adiabatik siqishdagi oxirgi harorat T₂ = T₁·(P₂/P₁)^{(k–1)/k} = 293·8,5^{0,286} = ${f(en.T2s, 0)} K; adiabatik FIK 0,80 bo‘lganda solishtirma ish l = c_{p}(T₂ – T₁)/η = ${f(en.wC, 1)} kJ/kg, quvvat N_{k} = ${f(en.NC, 0)} kW.`));
    add(P(`Gaz turbinasida tozalangan dum gaz (${f(en.mT, 3)} kg/s) ${en.Tt} K va 0,72 MPa dan 0,105 MPa gacha kengayadi: T₂ = ${f(en.T2t, 0)} K, FIK 0,85 da solishtirma ish ${f(en.wT, 1)} kJ/kg, quvvat N_{t} = ${f(en.NT, 0)} kW. Turbina kompressor quvvatining ${f(en.NT / en.NC * 100, 0)} % ini qoplaydi; yetishmayotgan ${f(en.NC - en.NT, 0)} kW qozon-utilizatorda olingan bug‘ (${f(c.G_steam, 0)} kg/soat) bilan ishlaydigan bug‘ turbinasi yoki ishga tushirish elektr dvigateli orqali beriladi. Bug‘ turbinasining nazariy quvvati (1,6 MPa dan 0,15 MPa gacha, Δh ≈ 380 kJ/kg, FIK 0,7) ${f(c.G_steam / 3600 * 380 * 0.7, 0)} kW – bu yetishmovchilikni to‘liq qoplaydi. Shunday qilib sex energiya bo‘yicha o‘zini o‘zi ta’minlaydi.`));
  }

  // ============ 8
  add(H1('8. Asosiy apparatlarning hisobi'));
  add(P('Asosiy apparat – elaksimon tarelkali, sovitish zmeyevikli absorber (8.1-rasm). Hisob tartibi: gaz va suyuqlik xossalari; ruxsat etilgan gaz tezligi bo‘yicha diametr; tarelka gidravlikasi; NO ning oksidlanish kinetikasi bo‘yicha zarur erkin hajm va tarelkalar soni; sovitish yuzasi; apparat balandligi, devor qalinligi va shtutserlar.'));
  add(H2('8.1. Gaz oqimining xossalari'));
  add(P(`Absorberga kiradigan gaz (6.5-jadval): n = ${f(c.nG, 2)} kmol/soat, o‘rtacha molyar massa M = ${f(c.Mg, 2)} kg/kmol. Ish sharoitida (P = ${f(c.Pa / 1e6, 2)} MPa, T = ${f(c.Tabs, 0)} K) zichlik:`));
  add(F(`ρ_{g} = P·M/(R·T) = ${f(c.Pa, 0)}·${f(c.Mg, 2)}/(8314·${f(c.Tabs, 2)}) = ${f(c.rhoG, 3)} kg/m³`, '8.1'));
  add(F(`V_{g} = n·R·T/P = ${f(c.nG / 3600, 5)}·8314·${f(c.Tabs, 2)}/${f(c.Pa, 0)} = ${f(c.Vg, 4)} m³/s`, '8.2'));
  add(P(`Tarelkalardagi kislotaning o‘rtacha zichligi (30–58 % HNO₃) ρ_{L} = ${c.rhoL} kg/m³, mahsulot kislota sarfi ${f(c.VL, 2)} m³/soat.`));
  add(H2('8.2. Absorber diametri'));
  add(P('Elaksimon tarelkali kolonnada gazning ruxsat etilgan tezligi [14]:'));
  add(F(`w_{r} = C·((ρ_{L} – ρ_{g})/ρ_{g})^{0,5} = ${f(c.C, 3)}·((${c.rhoL} – ${f(c.rhoG, 2)})/${f(c.rhoG, 2)})^{0,5} = ${f(c.wdop, 3)} m/s`, '8.3'));
  add(P(`bu yerda C = ${f(c.C, 3)} – tarelkalar oralig‘i H_{t} = ${f(c.Ht, 1)} m bo‘lganda koeffitsiyent.`));
  add(F(`D = (4V_{g}/(π·w_{r}))^{0,5} = (4·${f(c.Vg, 4)}/(3,1416·${f(c.wdop, 3)}))^{0,5} = ${f(c.Dcalc, 3)} m`, '8.4'));
  add(P(`Normallashtirilgan diametr D = ${f(c.D * 1000, 0)} mm qabul qilinadi; kesim yuzasi S = ${f(c.S, 4)} m², gazning haqiqiy tezligi w = ${f(c.w, 3)} m/s (ruxsat etilganning ${f(c.w / c.wdop * 100, 0)} % i).`));
  add(H2('8.3. Tarelka gidravlikasi'));
  add(P(`Tarelkadagi teshiklar diametri d₀ = ${f(c.d0 * 1000, 0)} mm, nisbiy erkin kesim f = ${f(c.fs * 100, 0)} %. Teshiklardagi gaz tezligi w₀ = w/f = ${f(c.w0, 2)} m/s; teshiklar soni (ishchi yuza kesimning 85 % i) n₀ = f·0,85·S/(0,785·d₀²) ≈ ${f(c.nHoles, 0)}. Suyuqlik tomchilab tushmasligi uchun minimal tezlik:`));
  add(F(`w_{0,min} = 0,67·(g·ρ_{L}·h_{L}/(ξ·ρ_{g}))^{0,5} = ${f(c.w0min, 2)} m/s < w₀`, '8.5'));
  add(P(`Tarelka qarshiligi quruq tarelka, suyuqlik qatlami (h_{L} = ${f(c.hL * 1000, 0)} mm) va sirt tarangligi qarshiliklari yig‘indisidan iborat:`));
  add(F(`ΔP_{q} = ξ·ρ_{g}·w₀²/2 = 1,8·${f(c.rhoG, 2)}·${f(c.w0, 2)}²/2 = ${f(c.dPdry, 0)} Pa`, '8.6'));
  add(F(`ΔP_{s} = ρ_{L}·g·h_{L} = ${f(c.dPliq, 0)} Pa;   ΔP_{σ} = 4σ/d₀ = ${f(c.dPsig, 0)} Pa`, '8.7'));
  add(P(`Bitta tarelka qarshiligi ΔP_{t} = ${f(c.dPtray, 0)} Pa; ${c.N + c.Nbleach} ta tarelka uchun ΔP = ${f(c.dPtot / 1000, 1)} kPa – bu absorberdagi bosimning ${f(c.dPtot / c.Pa * 100, 1)} % i bo‘lib, UKL-7 absorberlari uchun odatiy qiymat.`));
  add(H2('8.4. Tarelkalar sonini NO oksidlanish kinetikasi bo‘yicha hisoblash'));
  add(P('Absorberdagi jarayon tezligi NO ning gaz fazasida oksidlanishi bilan belgilanadi: tarelkadagi barbotaj qatlamida NO₂ tez yutiladi, tarelkalar orasidagi bo‘shliqda esa NO sekin oksidlanadi. Hisobda quyidagi farazlar qabul qilinadi: absorberga kirgan NO₂ pastki tarelkalarda (2.10) bo‘yicha yutilib, 1/3 qismi NO sifatida gazga qaytadi; bo‘shliqda oksidlangan har dξ mol NO tarelkada yutilib, (2/3)dξ mol NO kamayadi va 0,5dξ mol O₂ sarflanadi; harorat o‘zgarmas (308 K). U holda erkin hajm bo‘yicha differensial tenglama:'));
  add(F('dξ/dV = 2k·p²_{NO}·p_{O₂}·n/(P·V̇_{g})', '8.8'));
  add(P(`bu yerda n – gaz oqimining molyar sarfi, V̇_{g} – uning hajmiy sarfi, P – bosim (atm). ${f(c.Tabs, 0)} K da (2.7) bo‘yicha k = ${f(c.k, 2)} atm⁻²·s⁻¹. Tenglama boshlang‘ich NO miqdori ${f(c.NOstart, 3)} kmol/soat dan dum gazdagi ${f(c.NOxo, 4)} kmol/soat gacha 0,0005 m³ qadam bilan sonli integrallandi. Natijada zarur erkin hajm:`));
  add(F(`V_{erk} = ${f(c.Vfree, 2)} m³`, '8.9'));
  {
    const pick = [0, 1, 2, 3, 5, 10, 15, 20, 25, 30].map(n => {
      let best = c.prof[0]; for (const r of c.prof) if (Math.abs(r[0] / c.Vtray - n) < Math.abs(best[0] / c.Vtray - n)) best = r; return best;
    });
    const last = c.prof[c.prof.length - 1];
    pick.push(last);
    add(T('8.1', 'Absorber bo‘yicha NO va O₂ miqdorining o‘zgarishi', ['Erkin hajm V, m³', 'Nazariy tarelka', 'n_{NO}, kmol/soat', 'y_{NO}, %', 'y_{O₂}, %'],
      pick.map(r => { const n = r[1] + r[2] + r[3]; return [f(r[0], 3), f(r[0] / c.Vtray, 1), f(r[1], 3), f(r[1] / n * 100, 3), f(r[2] / n * 100, 2)]; }), [1, 1, 1, 1, 1]));
  }
  add(IMG(path.join(FIG, 'chart3.png'), 430, 269, '8.2-rasm. Absorber bo‘yicha NO va O₂ konsentratsiyasining o‘zgarishi'));
  add(P(`Jadval va grafikdan ko‘rinadiki, NO ning asosiy qismi birinchi 3–5 tarelkada yutiladi, qolgan 0,5 % dan 0,08 % gacha kamaytirish esa umumiy hajmning 80 % dan ko‘prog‘ini talab qiladi. Bitta tarelka oralig‘idagi erkin hajm (ko‘pik qatlami balandligi h_{k} = ${f(c.hf, 1)} m ni chiqarib tashlab):`));
  add(F(`V_{t} = S·(H_{t} – h_{k}) = ${f(c.S, 4)}·(${f(c.Ht, 1)} – ${f(c.hf, 1)}) = ${f(c.Vtray, 4)} m³`, '8.10'));
  add(F(`N_{naz} = V_{erk}/V_{t} = ${f(c.Vfree, 2)}/${f(c.Vtray, 4)} = ${f(c.Nth, 1)}`, '8.11'));
  add(P(`Pastki tarelkalarda kuchli kislota ustidagi muvozanat bosimi tufayli NO₂ ning to‘liq yutilmasligi, harorat notekisligi va gazning tarelka bo‘yicha notekis taqsimlanishini hisobga oluvchi zaxira koeffitsiyenti k_{z} = ${f(c.kz, 1)}: N = ${f(c.Nth, 1)}·${f(c.kz, 1)} = ${f(c.Nth * c.kz, 1)} → ${c.N} ta absorbsion tarelka. Bundan tashqari, kislotani oqartirish uchun ${c.Nbleach} ta tarelka o‘rnatiladi. 40 % li kondensat konsentratsiyasi mos keladigan (pastdan taxminan 8–10-) tarelkaga beriladi.`));
  {
    add(H2('8.5. Harorat va bosimning absorber hajmiga ta’siri'));
    const Ts = [293.15, 303.15, 308.15, 313.15, 323.15];
    const Ps = [0.4e6, 0.6e6, 0.75e6, 1.0e6];
    const rows = Ts.map(T_ => { const V = c.integrate(T_, c.Pa); return [f(T_, 0), f(c.kT(T_), 1), f(V, 2), f(V / c.Vtray * c.kz, 0)]; });
    add(P('(8.8) tenglamani turli harorat va bosimlarda integrallash orqali zarur erkin hajm va tarelkalar soni qanday o‘zgarishi aniqlandi (gaz tarkibi o‘zgarmas, D = 1,0 m).'));
    add(T('8.2', `Absorberdagi haroratning zarur erkin hajmga ta’siri (P = ${f(c.Pa / 1e6, 2)} MPa)`, ['T, K', 'k, atm⁻²·s⁻¹', 'V_{erk}, m³', 'N (k_{z} = 1,4)'], rows, [1, 1, 1, 1]));
    const rows2 = Ps.map(P_ => { const V = c.integrate(c.Tabs, P_); return [f(P_ / 1e6, 2), f(V, 2), f(V / c.Vtray * c.kz, 0)]; });
    add(T('8.3', 'Bosimning zarur erkin hajmga ta’siri (T = 308 K)', ['P, MPa', 'V_{erk}, m³', 'N (D = 1,0 m)'], rows2, [1, 1, 1]));
    add(P('Jadvallardan ko‘rinadiki, haroratning 10 K ga pasayishi zarur hajmni 15–20 % ga kamaytiradi – bu absorberni samarali sovitish muhimligini tasdiqlaydi. Bosimning ta’siri yanada kuchli: 0,4 MPa dan 1,0 MPa gacha oshganda hajm 15 marta kamayadi (taxminan P^{–3} ga proporsional, chunki tezlik bosim kubiga, gaz hajmi esa bosimga teskari proporsional). Shuning uchun AK-72 tizimida absorbsiya 1,1 MPa da olib boriladi.'));
    add(H2('8.6. Oqartirish qismi'));
    add(P(`Absorberdan chiqqan kislotada 0,3–0,5 % gacha erigan azot oksidlari (asosan N₂O₄ va HNO₂) bo‘ladi, ular kislotaga sariq rang beradi va keyingi jarayonlarda korroziyani kuchaytiradi. Oqartirish ikkilamchi havo (${f(c.sa * Vm, 0)} m³/soat, 1 kg kislotaga ${f(c.sa * Vm / c.mProd, 3)} m³) bilan ${c.Nbleach} ta elaksimon tarelkada amalga oshiriladi. Desorbsiya darajasi 0,4 % dan 0,07 % gacha bo‘lishi uchun Kremser tenglamasi bo‘yicha (desorbsiya omili S ≈ 1,6) 3–4 nazariy tarelka kerak, ya’ni qabul qilingan ${c.Nbleach} ta tarelka yetarli. Haydalgan azot oksidlari ikkilamchi havo bilan birga absorbsiya qismiga o‘tadi va yutiladi.`));
  }
  add(H2('8.7. Sovitish zmeyeviklari'));
  add(P(`Sovitish yuzasi: Q_{sov} = ${f(c.Qcool, 1)} kW; tarelkadagi kislota harorati 313 K, suv 291 → 301 K; Δt_{o‘r} = ${f(c.dTlog, 1)} K; barbotaj qatlamidagi zmeyevik uchun issiqlik uzatish koeffitsiyenti K = ${c.Kcoil} W/(m²·K):`));
  add(F(`F = Q_{sov}/(K·Δt_{o‘r}) = ${f(c.Qcool * 1000, 0)}/(${c.Kcoil}·${f(c.dTlog, 1)}) = ${f(c.Fcoil, 1)} m²`, '8.12'));
  add(P(`Zmeyeviklar 25×2 mm li 08Х18Н10Т quvurdan, ikki qavat qilib, 50 mm qadam bilan yasaladi; bitta tarelkadagi zmeyevik uzunligi ${f(c.coilPerTray.L, 1)} m, sirti ${f(c.coilPerTray.F, 2)} m². Zmeyevikli tarelkalar soni ${f(c.Fcoil, 1)}/${f(c.coilPerTray.F, 2)} = ${f(c.Fcoil / c.coilPerTray.F, 1)} → ${c.nCoilTrays}; ular issiqlik asosan ajraladigan pastki va o‘rta tarelkalarga o‘rnatiladi, yuqori ${c.N - c.nCoilTrays} ta tarelka zmeyeviksiz.`));
  add(H2('8.8. Absorber balandligi, devor qalinligi va shtutserlar'));
  add(P(`Absorber balandligi: absorbsion tarelkalar ${c.N}·${f(c.Ht, 1)} = ${f(c.N * c.Ht, 1)} m; oqartirish tarelkalari ${c.Nbleach}·${f(c.Ht, 1)} = ${f(c.Nbleach * c.Ht, 1)} m; yuqori separatsiya qismi 1,5 m; gaz kirish zonasi 1,2 m; kub qismi 2,0 m. Umumiy balandlik H ≈ ${f(c.Htot, 1)} m.`));
  add(P(`Korpus 08Х18Н10Т po‘latidan tayyorlanadi. Hisobiy bosim P_{h} = 1,1·${f(c.Pa / 1e6, 2)} = ${f(c.Pr, 3)} MPa, [σ] = ${c.sig} MPa (313 K), φ = 0,9, korroziyaga qo‘shimcha c = 1 mm:`));
  add(F(`s = P_{h}·D/(2φ[σ] – P_{h}) + c = ${f(c.Pr, 3)}·1000/(2·0,9·${c.sig} – ${f(c.Pr, 3)}) + 1 = ${f(c.sR + 1, 2)} mm`, '8.13'));
  add(P(`Kolonnaning balandligi katta (${f(c.Htot, 0)} m) bo‘lgani uchun shamol yuklamasi va o‘z og‘irligini hisobga olib, devor qalinligi s = ${c.s} mm, pastki obechayka va tayanch qismi uchun 10 mm qabul qilinadi. Shtutserlar (d = (4V/(πw))^{0,5}): gaz uchun (w = 15 m/s) d = ${f(c.nozG * 1000, 0)} mm → Dy 200; mahsulot kislota uchun (w = 0,5 m/s) d = ${f(c.nozL * 1000, 0)} mm → Dy 50; suv va kondensat uchun Dy 32.`));
  {
    add(H2('8.9. Kontakt apparatning qisqacha hisobi'));
    const Fs = Math.PI * 0.8 ** 2 / 4; const nmix = t.sum(c.mix), nconv = t.sum(c.conv);
    const V1 = nmix / 3600 * 8.314 * c.Tmix / c.Pc * 1000, V2 = nconv / 3600 * 8.314 * c.Tc / c.Pc * 1000;
    const Lw = 2 * 3200, dw = 0.09e-3; const Fsp = Math.PI * dw * Lw; const mPt = Math.PI / 4 * dw * dw * Lw * 21400;
    const Vfree = Fs * 9 * 2 * dw * 0.6; const tau = Vfree / V2;
    add(P(`Setka diametri 800 mm, kesim yuzasi F = ${f(Fs, 4)} m². Ammiak-havo aralashmasining ish sharoitidagi sarfi (${f(c.Tmix, 0)} K, ${f(c.Pc / 1e6, 2)} MPa) V₁ = ${f(V1, 3)} m³/s, setkalar oldidagi tezlik w₁ = V₁/F = ${f(V1 / Fs, 2)} m/s; reaksiyadan keyingi gaz sarfi (${c.Tc} K) V₂ = ${f(V2, 3)} m³/s. Alanganing orqaga urilishi (proskok) xavfi bo‘lmasligi uchun w₁ ≥ 0,5 m/s bo‘lishi kerak – shart bajariladi.`));
    add(P(`Setka geometriyasi: 1 sm² da 1024 katak (1 sm da 32 sim), ya’ni 1 m² setkada simning umumiy uzunligi L = 2·3200 = ${f(Lw, 0)} m. Setkaning solishtirma sirti F_{s} = π·d·L = 3,1416·0,09·10⁻³·${f(Lw, 0)} = ${f(Fsp, 2)} m²/m²; 1 m² setka massasi (ρ = 21 400 kg/m³) m = 0,785·d²·L·ρ = ${f(mPt, 2)} kg. 9 ta setkaning platinoid massasi ${f(mPt * Fs * 9, 2)} kg.`));
    add(F(`τ = V_{erk}/V₂ = F·n·2d·ε/V₂ = ${f(Fs, 4)}·9·2·0,09·10⁻³·0,6/${f(V2, 3)} = ${e(tau, 2)} s`, '8.14'));
    add(P(`Kontakt vaqti 10⁻⁴ s tartibida bo‘lib, 0,7–0,8 MPa da NO ning maksimal chiqishi uchun tavsiya etilgan (1–3)·10⁻⁴ s oralig‘iga mos keladi. Setkalar paketining gidravlik qarshiligi 1,5–2,5 kPa. Yillik platina yo‘qotilishi ${f(c.lossPt, 2)}·${f(c.G_day * 333, 0)}/1000 = ${f(c.lossPt * c.G_day * 333 / 1000, 0)} g ni tashkil etadi; setkalar 4–6 oyda almashtiriladi.`));
  }
  add(IMG(path.join(FIG, 'absorber3.png'), 290, 440, '8.1-rasm. Elaksimon tarelkali absorberning sxematik chizmasi'));
  add(T('8.4', 'Absorber hisobining asosiy natijalari', ['Ko‘rsatkich', 'Qiymati'], [
    ['Gaz sarfi (ish sharoitida), m³/s', f(c.Vg, 4)], ['Bosim, MPa / harorat, K', `${f(c.Pa / 1e6, 2)} / 303–313`],
    ['Diametr, m', f(c.D, 1)], ['Gaz tezligi, m/s', f(c.w, 3)], ['Zarur erkin hajm, m³', f(c.Vfree, 2)],
    ['Tarelkalar soni (absorbsion + oqartirish)', `${c.N} + ${c.Nbleach}`], ['Tarelkalar oralig‘i, m', f(c.Ht, 1)],
    ['Umumiy balandlik, m', f(c.Htot, 1)], ['Gidravlik qarshilik, kPa', f(c.dPtot / 1000, 1)],
    ['Sovitish yuzasi, m²', f(c.Fcoil, 1)], ['Sovituvchi suv sarfi, kg/s', f(c.Gw / 3600, 2)], ['Devor qalinligi, mm', String(c.s)],
  ], [2.5, 1.5]));

  // ============ 9
  add(H1('9. Asosiy texnologik jihozlarni sonini hisoblari'));
  add(P('Jihozlar soni n = V_{talab}/V_{bir} formula bo‘yicha aniqlanadi: V_{talab} – talab etilgan unumdorlik (gaz sarfi, setka yuzasi, issiqlik almashinish yuzasi), V_{bir} – bitta standart apparatning unumdorligi.'));
  add(P(`Absorber. D = 1000 mm li bitta absorber ruxsat etilgan tezlikda V_{max} = w_{r}·S = ${f(c.wdop, 3)}·${f(c.S, 4)} = ${f(c.wdop * c.S, 4)} m³/s gazni o‘tkazadi; talab etilgani ${f(c.Vg, 4)} m³/s. n = ${f(c.Vg / (c.wdop * c.S), 2)} → 1 dona.`));
  const Fset = Math.PI * 0.8 ** 2 / 4;
  add(P(`Kontakt apparat. 0,7–0,8 MPa da setkalarning ammiak bo‘yicha ruxsat etilgan solishtirma yuklamasi q = ${c.qNH3} kg/(m²·soat) [10, 14]. Zarur setka yuzasi F = m_{NH₃}/q = ${f(c.mNH3, 1)}/${c.qNH3} = ${f(c.Fset, 3)} m², diametri ${f(c.Dset, 3)} m. Setka diametri 800 mm (F = ${f(Fset, 3)} m²) bo‘lgan bitta kontakt apparat qabul qilinadi; setkalar soni 9, platinoidlar yuklamasi ≈ ${f(Fset * 9 * 0.87, 1)} kg (8.9-bo‘limga qarang). n = ${f(c.Fset / Fset, 2)} → 1 dona.`));
  const items = [
    ['7', 'Qozon-utilizator', c.Q_whb, 60, ((c.Tc - 474) - (c.T_whb - 474)) / Math.log((c.Tc - 474) / (c.T_whb - 474)), 250],
    ['9', 'Sovitgich-kondensator', c.Q_cc, 200, ((c.T_th - 301) - (c.Tcc - 291)) / Math.log((c.T_th - 301) / (c.Tcc - 291)), 250],
    ['8', 'Dum gaz isitgichi', c.Q_th, 40, 100, 160],
  ];
  add(T('9.1', 'Issiqlik almashinish apparatlari sonini hisoblash', ['Poz.', 'Apparat', 'Q, kW', 'K, W/(m²·K)', 'Δt, K', 'F_{hisob}, m²', 'F_{st}, m²', 'n'],
    items.map(r => { const F_ = r[2] * 1000 / (r[3] * r[4]); return [r[0], r[1], f(r[2], 0), String(r[3]), f(r[4], 1), f(F_, 1), String(r[5]), `${f(F_ / r[5], 2)} → 1`]; }), [0.5, 2, 0.8, 0.9, 0.7, 0.9, 0.8, 0.9]));
  {
    const Qev = c.mNH3 * 1186 / 3600;
    add(P(`Ammiak bug‘latgichi 3. Issiqlik yuklamasi Q = m·r = ${f(c.mNH3, 1)}·1186/3600 = ${f(Qev, 1)} kW (r = 1186 kJ/kg, 293 K). Issiqlik tashuvchi – 313 K li aylanma suv, K = 700 W/(m²·K), Δt = 15 K; F = ${f(Qev * 1000 / (700 * 15), 1)} m². Standart bug‘latgich F = 32 m²: n = 1.`));
  }
  add(P(`Nasoslar. Mahsulot kislota nasosi: Q = ${f(c.VL, 2)} m³/soat, H = 40 m; kondensat nasosi 12: Q = ${f(condM / 1250, 2)} m³/soat, H = 60 m; texnologik suv nasosi: Q = ${f(c.W / 1000, 2)} m³/soat, H = 90 m. Har biridan 1 ishchi + 1 zaxira (zanglamas po‘latdan, germetik).`));
  add(P('Havo kompressori va gaz turbinasi bitta agregatda (GTT-3 tipidagi, kichik unumdorlik uchun moslashtirilgan) – 1 dona. Katalitik tozalash reaktori 14: dum gaz sarfi bo‘yicha hajmiy tezlik 15 000 soat⁻¹ da АВК-10 katalizatori hajmi ' + f(t.sum(c.tail) * Vm / 15000, 2) + ' m³ – 1 dona.'));

  // ============ 10
  add(H1('10. Asosiy texnologik jihozlar ro‘yxati'));
  add(T('10.1', 'Asosiy texnologik jihozlar ro‘yxati', ['Poz.', 'Nomi', 'Soni', 'Texnik tavsifi', 'Materiali'], [
    ['1', 'Havo filtri', '1', `Ko‘p bosqichli, V = ${f(VairTot, 0)} m³/soat`, 'Uglerodli po‘lat'],
    ['2, 15', 'Kompressor–gaz turbinasi agregati', '1', `V = ${f(VairTot, 0)} m³/soat, P = 0,8 MPa`, 'Legirlangan po‘lat'],
    ['3', 'Ammiak bug‘latgichi', '1', 'Qobiq-quvurli, F = 32 m²', '09Г2С'],
    ['4', 'Ammiak qizdirgichi', '1', 'Qobiq-quvurli, F = 6 m²', '09Г2С'],
    ['5', 'Filtrli aralashtirgich', '1', 'D = 800 mm, H = 3 m, metall-keramik filtr', '12Х18Н10Т'],
    ['6, 7', 'Kontakt apparat + qozon-utilizator', '1', `Setka D = 800 mm, 9 setka; KU: F = 250 m², bug‘ ${f(c.G_steam / 1000, 2)} t/soat`, '12Х18Н10Т / 12ХМ'],
    ['8', 'Dum gaz isitgichi', '1', 'Qobiq-quvurli, F = 160 m²', '08Х18Н10Т'],
    ['9', 'Sovitgich-kondensator', '1', 'Qobiq-quvurli, vertikal, F = 250 m²', '08Х22Н6Т'],
    ['10, 11', 'Absorber (oqartirish qismi bilan)', '1', `D = 1000 mm, H = ${f(c.Htot, 0)} m, ${c.N}+${c.Nbleach} elaksimon tarelka, zmeyeviklar F = ${f(c.Fcoil, 0)} m²`, '08Х18Н10Т'],
    ['12', 'Kondensat nasosi', '2 (1 zaxira)', 'Markazdan qochma, Q = 2 m³/soat, H = 60 m', '12Х18Н10Т'],
    ['13', 'Dum gaz isitgichi (2-bosqich)', '1', 'Qobiq-quvurli, F = 60 m²', '12Х18Н10Т'],
    ['14', 'Katalitik tozalash reaktori', '1', 'D = 600 mm, АВК-10 katalizatori', '12Х18Н10Т'],
    ['16', 'Mahsulot kislota nasosi', '2 (1 zaxira)', `Q = ${f(c.VL, 1)} m³/soat, H = 40 m`, '12Х18Н10Т'],
    ['17', 'Texnologik suv nasosi', '2 (1 zaxira)', 'Q = 1,5 m³/soat, H = 90 m', '12Х18Н10Т'],
    ['18', 'Kislota ombori (idish)', '2', 'V = 100 m³', '08Х18Н10Т'],
  ], [0.6, 2.2, 1, 3, 1.4]));

  // ============ 11
  add(H1('11. Ishlab chiqarishning tahliliy nazorati'));
  add(P('Azot kislotasi sexida tahliliy nazorat xomashyo sifatini, texnologik rejimga rioya qilinishini, mahsulot sifatini va atrof-muhitga chiqindilar miqdorini ta’minlash uchun olib boriladi. Ammiak-havo aralashmasi tarkibi va dum gazdagi azot oksidlari uzluksiz avtomatik gazanalizatorlar bilan, qolgan ko‘rsatkichlar laboratoriyada nazorat qilinadi.'));
  add(T('11.1', 'Tahliliy nazorat jadvali', ['Nazorat nuqtasi', 'Aniqlanadigan ko‘rsatkich', 'Me’yor', 'Usul, asbob', 'Davriyligi'], [
    ['Suyuq ammiak', 'NH₃, suv, moy', 'NH₃ ≥ 99,9 %; moy ≤ 2 mg/kg', 'Bug‘latish, gravimetrik', '1 marta sutkada'],
    ['Havo (filtrdan keyin)', 'Chang', '≤ 0,5 mg/m³', 'Gravimetrik', '1 marta haftada'],
    ['Ammiak-havo aralashmasi', 'NH₃', '10,0–11,0 %', 'Avtomatik gazanalizator; titrlash', 'Uzluksiz'],
    ['Nitroza gaz (kontaktdan keyin)', 'NO, NH₃ qoldig‘i', 'NO chiqishi ≥ 94 %', 'Titrlash (Lunge), xromatograf', '1 marta smenada'],
    ['Kondensat (9 dan)', 'HNO₃', '35–45 %', 'Ishqor bilan titrlash', '1 marta smenada'],
    ['Mahsulot kislota', 'HNO₃', '≥ 58 %', 'Titrlash, zichlik bo‘yicha', 'Har 2 soatda'],
    ['Mahsulot kislota', 'Erigan NOx (N₂O₄)', '≤ 0,07 %', 'Permanganatometrik', 'Har 2 soatda'],
    ['Dum gaz (absorberdan keyin)', 'NOx; O₂', '≤ 0,1 %; 2,5–3,5 %', 'Avtomatik analizator', 'Uzluksiz'],
    ['Dum gaz (tozalashdan keyin)', 'NOx; NH₃', '≤ 0,005 %; ≤ 20 mg/m³', 'Xemilyuminessent analizator', 'Uzluksiz'],
    ['Aylanma suv', 'HNO₃ (zmeyevik oqishi)', '0', 'pH-metr', 'Uzluksiz'],
    ['Ish zonasi havosi', 'NH₃; NOx', '≤ 20; ≤ 2 mg/m³', 'Signalizatorlar', 'Uzluksiz'],
  ], [1.8, 1.5, 1.4, 1.8, 1.1]));
  add(P('Texnologik parametrlar nazorati: kontakt apparatdagi setkalar harorati (termoparalar, 1153–1173 K; 1123 K dan pasayganda NO chiqishi kamayadi), ammiak va havo sarflari va ularning nisbati, kompressordan keyingi bosim, absorber tarelkalaridagi harorat va bosimlar farqi, sovituvchi suv harorati va sarfi, absorberga beriladigan suv sarfi (mahsulot konsentratsiyasini belgilaydi), dum gazning turbinaga kirish harorati.'));
  add(P('Avariya blokirovkalari: aralashmada NH₃ miqdori 11,5 % dan oshganda yoki havo bosimi pasayganda ammiak berish avtomatik to‘xtatiladi va tizim azot bilan puflanadi; setkalar harorati keskin pasayganda (alanga o‘chishi) ammiak berilishi to‘xtatiladi; absorber kubida kislota sathi pasayganda mahsulot chiqarish klapani yopiladi. Platina yo‘qotilishini kamaytirish uchun kontakt apparatdan keyin platina tutuvchi (palladiyli) setkalar o‘rnatiladi, ularning holati har ta’mirda nazorat qilinadi.'));

  add(H2('11.2. Mahsulot kislota konsentratsiyasini aniqlash'));
  add(P('Kislotaning namunasi (2–3 g) tortib olinadi, distillangan suv bilan suyultiriladi va 1 N natriy gidroksid eritmasi bilan metiloranj yoki metil qizili ishtirokida titrlanadi. HNO₃ ning massa ulushi X = V·N·0,06301·100/m formula bo‘yicha hisoblanadi, bu yerda V – sarflangan ishqor hajmi, ml; N – ishqor normalligi; m – namuna massasi, g. Erigan azot oksidlari (N₂O₄ hisobida) kislotani kaliy permanganat bilan titrlash orqali aniqlanadi. Tezkor nazorat uchun kislota zichligi areometr bilan o‘lchanadi va 3.2-jadvaldagi bog‘liqlik bo‘yicha konsentratsiyaga aylantiriladi.'));
  add(P('Dum gazdagi azot oksidlari miqdori avtomatik xemilyuminessent analizatorlarda (NO ozon bilan reaksiyaga kirishib, yorug‘lik chiqaradi) yoki laboratoriyada evakuatsiyalangan kolbaga namuna olib, vodorod peroksid bilan oksidlash va hosil bo‘lgan kislotani titrlash orqali aniqlanadi. Natijalar bo‘yicha absorberga beriladigan suv va ikkilamchi havo sarflari rostlanadi.'));
  // ============ 12
  add(H1('12. Kurs loyihasi bo‘yicha xulosalar'));
  add(P(`1. Azot kislotasi ishlab chiqarish tizimlari solishtirilib, unumdorligi ${c.G_day} t/sutka bo‘lgan sex uchun yagona bosimli (0,73–0,8 MPa) UKL-7 tipidagi sxema, elaksimon tarelkali sovitiladigan absorber va dum gazlarni ammiak bilan selektiv katalitik tozalash asoslab tanlandi.`));
  add(P(`2. Moddiy balans hisobi bo‘yicha: ammiak sarfi ${f(c.mNH3, 1)} kg/soat (${f(c.mNH3 / 3600, 4)} kg/s; ${f(c.specNH3, 3)} t/t), havo sarfi ${f(VairTot, 0)} m³/soat, texnologik suv ${f(c.W, 0)} kg/soat; ${f(c.wP * 100, 0)} % li kislota chiqishi ${f(c.mProd, 0)} kg/soat (${f(c.mProd / 3600, 4)} kg/s). NO chiqishi ${f(c.eta * 100, 1)} %, absorbsiya darajasi ${f(c.etaAbs * 100, 2)} %, umumiy chiqish ${f(c.etaTot * 100, 2)} %.`));
  add(P(`3. Issiqlik balanslari bo‘yicha: kontakt apparatda reaksiyalar issiqligi ${f(c.Qr_c, 0)} kW, aralashmaning zarur harorati ${f(c.Tmix, 0)} K; qozon-utilizatorda ${f(c.G_steam, 0)} kg/soat 1,6 MPa bug‘ olinadi; sovitgich-kondensatorning yuklamasi ${f(c.Q_cc, 0)} kW; absorberdan sovituvchi suv bilan ${f(c.Qcool, 0)} kW issiqlik olib chiqiladi (suv sarfi ${f(c.Gw / 1000, 1)} t/soat).`));
  add(P(`4. Absorber hisoblandi: diametr ${f(c.D * 1000, 0)} mm, NO oksidlanishi uchun zarur erkin hajm ${f(c.Vfree, 2)} m³, tarelkalar soni ${c.N} (absorbsion) + ${c.Nbleach} (oqartirish), tarelkalar oralig‘i ${f(c.Ht, 1)} m, balandlik ${f(c.Htot, 1)} m, gidravlik qarshilik ${f(c.dPtot / 1000, 1)} kPa, sovitish yuzasi ${f(c.Fcoil, 1)} m², devor qalinligi ${c.s} mm. Talab qilinadigan absorberlar soni – 1.`));
  add(P('5. Asosiy jihozlar ro‘yxati va tahliliy nazorat sxemasi ishlab chiqildi. Dum gazlarni katalitik tozalash atmosferaga chiqariladigan azot oksidlari miqdorini sanitariya me’yorlari darajasiga tushiradi, gaz va bug‘ turbinalari esa havo kompressorini harakatga keltirib, sexni energiya bo‘yicha o‘zini o‘zi ta’minlashga imkon beradi.'));

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
    'Атрощенко В.И., Каргин С.И. Технология азотной кислоты. – 3-е изд. – М.: Химия, 1970. – 496 с.',
    'Справочник азотчика. Т. 2. – 2-е изд. – М.: Химия, 1987. – 464 с.',
    'Олевский В.М. и др. Технология аммиачной селитры и азотной кислоты. – М.: Химия, 1978. – 312 с.',
    'Рабинович В.А., Хавин З.Я. Краткий химический справочник. – Л.: Химия, 1991. – 432 с.',
    'Павлов К.Ф., Романков П.Г., Носков А.А. Примеры и задачи по курсу процессов и аппаратов химической технологии. – Л.: Химия, 1987. – 576 с.',
  ];
  refs.forEach((r, i) => add(P(`${i + 1}. ${r}`, { noIndent: true })));
  return out;
}

L_.build(OUT, { mavzu: 'Azot kislotasi ishlab chiqarish sexining (absorber) hisobi bilan loyihasi.', unum: 'Unumdorligi – 75 t/sutka (100 % HNO₃ hisobida)' }, ENTRIES, body, TMP)
  .then(() => console.log('OK', OUT));
