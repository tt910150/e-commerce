/* Mohira — platforma ma'lumotlari.
   Haqiqiy backend ulanganda shu massivlar API javobi bilan almashtiriladi. */

const CATEGORIES = [
  { id: "all",      name: "Hammasi" },
  { id: "rasm",     name: "Rasmlar" },
  { id: "dekor",    name: "Dekor buyumlar" },
  { id: "shirinlik",name: "Uy shirinliklari" },
  { id: "tikuv",    name: "Tikuvchilik" },
  { id: "aksessuar",name: "Sumka, sham, bijuteriya" }
];

const MAKERS = [
  { id: "m1", name: "Dilnoza Rahimova", city: "Qarshi", since: 2021, craft: "Atlas va adrasdan sumkalar", sales: 412, rating: 4.9, color: "#9b1d3a",
    bio: "Ikki farzand onasi. Uyda kichik tikuv ustaxonasi ochgan, hozir ikki shogirdi bilan ishlaydi." },
  { id: "m2", name: "Gulnora Ergasheva", city: "Shahrisabz", since: 2019, craft: "Kashtachilik va so'zana", sales: 286, rating: 5.0, color: "#23306b",
    bio: "Shahrisabz kashtasining uchinchi avlod ustasi. Har bir so'zana 3–6 hafta qo'lda tikiladi." },
  { id: "m3", name: "Madina Xolmurodova", city: "Qarshi", since: 2023, craft: "Uy shirinliklari", sales: 1240, rating: 4.8, color: "#c27c1a",
    bio: "Chak-chak, pishiriq va bayram tortlari. Buyurtmalar ertalab pishirilib, o'sha kuni yetkaziladi." },
  { id: "m4", name: "Sevara Normatova", city: "Samarqand", since: 2022, craft: "Rasm, sham va dekor", sales: 198, rating: 4.9, color: "#6e8f55",
    bio: "Rassomlik kollejini bitirgan. Akvarel manzaralar va soya mumidan xushbo'y shamlar yasaydi." },
  { id: "m5", name: "Feruza Abdullayeva", city: "Kitob", since: 2024, craft: "Bijuteriya", sales: 96, rating: 4.7, color: "#7a1530",
    bio: "Kumush va tabiiy toshlardan sirg'a, bilaguzuk. Milliy naqshlarni zamonaviy shaklda beradi." }
];

/* art: rasm turi (art.js), palette: ranglar to'plami */
const PRODUCTS = [
  { id: 1,  cat: "aksessuar", art: "bag",     pal: 0, title: "Atlas sumka \"Anor\"", maker: "m1", price: 285000, rating: 4.9, reviews: 64, added: 12, pop: 98,
    desc: "Marg'ilon atlasidan tikilgan, ichi paxta astarli. Ichki cho'ntak va magnit qulf bor.", size: "32 × 26 × 10 sm", material: "Atlas, paxta, charm tutqich", time: "Tayyor, 1 kunda jo'natiladi" },
  { id: 2,  cat: "tikuv",     art: "suzani",  pal: 1, title: "Shahrisabz so'zanasi, devorga", maker: "m2", price: 1850000, rating: 5.0, reviews: 21, added: 30, pop: 90,
    desc: "Ipak ip bilan qo'lda tikilgan an'anaviy so'zana. Anor va lola naqshlari.", size: "120 × 90 sm", material: "Paxta mato, ipak ip", time: "Tayyor, bitta nusxa" },
  { id: 3,  cat: "shirinlik", art: "sweets",  pal: 2, title: "Asalli chak-chak, 1 kg", maker: "m3", price: 95000, rating: 4.8, reviews: 312, added: 2, pop: 99,
    desc: "Tabiiy tog' asali va yong'oq bilan. Bayram va to'ylar uchun chiroyli qutida.", size: "1 kg, quti Ø 24 sm", material: "Un, tuxum, asal, yong'oq", time: "Buyurtma kuni pishiriladi" },
  { id: 4,  cat: "aksessuar", art: "candle",  pal: 3, title: "Soya mumidan sham \"Rayhon\"", maker: "m4", price: 68000, rating: 4.9, reviews: 88, added: 5, pop: 85,
    desc: "Rayhon va limon efir moyi qo'shilgan. Taxminan 40 soat yonadi, shisha idishi qayta ishlatiladi.", size: "200 ml", material: "Soya mumi, paxta pilik", time: "Tayyor, 1 kunda jo'natiladi" },
  { id: 5,  cat: "rasm",      art: "painting",pal: 1, title: "Akvarel: \"Kitob tog'lari tongda\"", maker: "m4", price: 650000, rating: 5.0, reviews: 9, added: 8, pop: 70,
    desc: "Original akvarel ishi, yog'och ramkada. Orqasida rassom imzosi va sertifikati.", size: "40 × 50 sm", material: "Akvarel qog'oz, yog'och ramka", time: "Tayyor, bitta nusxa" },
  { id: 6,  cat: "dekor",     art: "plate",   pal: 0, title: "Qo'lda bo'yalgan lagan", maker: "m4", price: 340000, rating: 4.8, reviews: 17, added: 14, pop: 75,
    desc: "Rishton uslubidagi naqsh bilan qo'lda bo'yalgan sopol lagan. Devorga osish uchun ilgagi bor.", size: "Ø 32 sm", material: "Sopol, sir", time: "Tayyor" },
  { id: 7,  cat: "aksessuar", art: "earrings",pal: 1, title: "Kumush sirg'a \"Lola\"", maker: "m5", price: 230000, rating: 4.7, reviews: 33, added: 1, pop: 80,
    desc: "925-proba kumush, lazurit tosh bilan. Sovg'a qutisida.", size: "Uzunligi 4,5 sm", material: "Kumush 925, lazurit", time: "Tayyor" },
  { id: 8,  cat: "tikuv",     art: "pillow",  pal: 2, title: "Kashta yostiq jildi", maker: "m2", price: 175000, rating: 4.9, reviews: 46, added: 10, pop: 83,
    desc: "Divan uchun dekorativ yostiq jildi. Yashirin molniya, yuvishga chidamli.", size: "45 × 45 sm", material: "Zig'ir mato, paxta ip", time: "Tayyor" },
  { id: 9,  cat: "shirinlik", art: "cake",    pal: 0, title: "Bayram torti \"Gilos\"", maker: "m3", price: 260000, rating: 4.8, reviews: 140, added: 3, pop: 92,
    desc: "Biskvit, qaymoqli krem va yangi gilos. Ustiga ism yoki tabrik yozib beriladi.", size: "1,8 kg, 8–10 kishilik", material: "Biskvit, qaymoq, gilos", time: "Kamida 1 kun oldin buyurtma" },
  { id: 10, cat: "aksessuar", art: "bag",     pal: 3, title: "To'qilgan plyaj sumkasi", maker: "m1", price: 190000, rating: 4.8, reviews: 29, added: 20, pop: 66,
    desc: "Paxta ipdan qo'lda to'qilgan, yengil va keng. Bozorlik va dam olish uchun.", size: "40 × 35 sm", material: "Paxta ip", time: "3 kunda tayyorlanadi" },
  { id: 11, cat: "dekor",     art: "vase",    pal: 1, title: "Sopol guldon, nil rangli", maker: "m4", price: 210000, rating: 4.9, reviews: 12, added: 6, pop: 64,
    desc: "Charxda yasalgan va qo'lda bo'yalgan guldon. Quruq gul kompozitsiyasi bilan sotiladi.", size: "Balandligi 24 sm", material: "Sopol, sir", time: "Tayyor" },
  { id: 12, cat: "rasm",      art: "painting",pal: 2, title: "Akvarel: \"Registon oqshomi\"", maker: "m4", price: 720000, rating: 4.9, reviews: 7, added: 25, pop: 60,
    desc: "Samarqand manzarasi, original asar. Ofis yoki mehmonxona uchun.", size: "50 × 40 sm", material: "Akvarel qog'oz, yog'och ramka", time: "Tayyor, bitta nusxa" },
  { id: 13, cat: "tikuv",     art: "dress",   pal: 0, title: "Adras bolalar ko'ylagi", maker: "m1", price: 240000, rating: 4.9, reviews: 38, added: 4, pop: 78,
    desc: "3–6 yoshli qizlar uchun milliy uslubdagi ko'ylak. O'lchamingizga moslab tikiladi.", size: "104–122 bo'y", material: "Adras, paxta astar", time: "5 kunda tikiladi" },
  { id: 14, cat: "shirinlik", art: "sweets",  pal: 3, title: "Pishiriqlar to'plami, 24 dona", maker: "m3", price: 120000, rating: 4.7, reviews: 96, added: 9, pop: 81,
    desc: "Bodomli pechenye, xolva va pashmak aralashmasi. Choy dasturxoniga tayyor quti.", size: "24 dona", material: "Un, bodom, sariyog'", time: "Buyurtma kuni pishiriladi" },
  { id: 15, cat: "aksessuar", art: "candle",  pal: 0, title: "Sham to'plami \"Anor gullari\", 3 dona", maker: "m4", price: 165000, rating: 5.0, reviews: 41, added: 11, pop: 77,
    desc: "Anor, vanil va sandal hidli uchta sham. Sovg'a uchun karton qutida.", size: "3 × 120 ml", material: "Soya mumi", time: "Tayyor" },
  { id: 16, cat: "aksessuar", art: "necklace",pal: 2, title: "Marjon \"Tumor\"", maker: "m5", price: 310000, rating: 4.8, reviews: 15, added: 7, pop: 62,
    desc: "An'anaviy tumor shaklidagi kumush marjon, marjon toshlari bilan.", size: "Zanjir 45 sm", material: "Kumush 925, qizil marjon", time: "Tayyor" },
  { id: 17, cat: "dekor",     art: "plate",   pal: 3, title: "Devoriy panno, 3 ta likopcha", maker: "m4", price: 390000, rating: 4.7, reviews: 8, added: 18, pop: 55,
    desc: "Oshxona devori uchun turli o'lchamdagi uchta bo'yalgan likopcha.", size: "Ø 15, 20, 25 sm", material: "Sopol", time: "4 kunda tayyorlanadi" },
  { id: 18, cat: "tikuv",     art: "suzani",  pal: 3, title: "Kashta stol yo'lagi", maker: "m2", price: 420000, rating: 5.0, reviews: 11, added: 15, pop: 58,
    desc: "Dasturxon ustiga yoyiladigan uzun kashta. Mehmonlar uchun dasturxonni bezaydi.", size: "180 × 40 sm", material: "Paxta, ipak ip", time: "Tayyor" }
];

const LOANS = [
  { title: "Oilaviy tadbirkorlik krediti", org: "Hamkor davlat banki orqali", rate: 14, max: 100000000, term: 60,
    points: ["Uyda ishlab chiqarishni kengaytirish uchun: tikuv mashinasi, pech, xomashyo", "6 oygacha imtiyozli davr — faqat foiz to'lanadi", "Garov o'rniga kafillik yoki sug'urta polisi"] },
  { title: "Ayollar tadbirkorligi uchun mikroqarz", org: "Mikromoliya tashkiloti", rate: 18, max: 30000000, term: 24,
    points: ["Birinchi marta biznes boshlayotganlar uchun", "Ariza 3 ish kunida ko'rib chiqiladi", "Platformadagi savdo tarixi daromad isboti sifatida qabul qilinadi"] },
  { title: "Yoshlar va ayollar uchun startap krediti", org: "Tijorat banki hamkorligida", rate: 12, max: 50000000, term: 36,
    points: ["18–35 yoshdagi ayollar uchun", "Biznes reja talab qilinadi — moliya mentori yozishga yordam beradi", "Uskunalar lizingi ham mumkin"] }
];

const COURSES = [
  { day: 4,  month: "noyabr", title: "Telefonda mahsulotni suratga olish", who: "Marketing mentori bilan, Qarshi ofisi", hours: "2 soat", seats: 6, mentor: "marketing" },
  { day: 9,  month: "noyabr", title: "Instagram va Telegram do'kon ochish", who: "Onlayn, video qo'ng'iroq", hours: "3 dars × 1,5 soat", seats: 14, mentor: "marketing" },
  { day: 16, month: "noyabr", title: "Tannarx va narx belgilash", who: "Moliya mentori bilan, onlayn", hours: "2 soat", seats: 3, mentor: "moliya" },
  { day: 23, month: "noyabr", title: "Biznes reja yozish: kredit uchun", who: "Moliya mentori bilan, Qarshi ofisi", hours: "2 dars × 2 soat", seats: 9, mentor: "moliya" },
  { day: 30, month: "noyabr", title: "Mijoz bilan muloqot va qaytgan xaridor", who: "Marketing mentori bilan, onlayn", hours: "1,5 soat", seats: 20, mentor: "marketing" }
];

const GRANTS = [
  { title: "Hunarmand ayollar uchun boshlang'ich grant", sum: 15000000, deadline: "2026-11-20", from: "Xalqaro hamkor jamg'arma",
    text: "Uyda ishlayotgan va kamida 3 oy platformada sotgan ayollar uchun. Mablag' uskuna va xomashyoga beriladi, qaytarilmaydi." },
  { title: "Qishloq ayollari tashabbusi", sum: 25000000, deadline: "2026-12-15", from: "Viloyat hokimligi dasturi",
    text: "Tuman va qishloqlarda 2 va undan ortiq ayolni ishga oladigan kichik ustaxonalar uchun. Hisobot har chorakda topshiriladi." },
  { title: "Yosh dizaynerlar tanlovi", sum: 8000000, deadline: "2027-01-31", from: "Mohira va hamkor brendlar",
    text: "Milliy naqshni zamonaviy mahsulotda qo'llagan eng yaxshi 10 ta ish taqdirlanadi va katalog bosh sahifasiga chiqadi." }
];

const MENTORS = [
  { id: "marketing", role: "Marketing mentori", name: "Nigora Tursunova", color: "#e3a33b",
    text: "SMM, reklama va mijoz jalb qilish. Sahifangizni tahlil qiladi, kontent rejasi tuzib beradi va birinchi reklamani birga ishga tushirasiz.",
    tags: ["Instagram, Telegram", "Target reklama", "Mahsulot surati", "Mijoz bilan yozishma"], years: 7, clients: 140 },
  { id: "moliya", role: "Moliya mentori", name: "Kamola Yusupova", color: "#6e8f55",
    text: "Xarajat va daromadni hisoblash, narx belgilash, biznes reja. Kredit yoki grantga ariza topshirishdan oldin hujjatlaringizni tekshiradi.",
    tags: ["Tannarx hisobi", "Biznes reja", "Kredit arizasi", "Soliq va o'zini o'zi band qilish"], years: 11, clients: 95 }
];

const FAQ = [
  ["Sotuvchi bo'lish pullikmi?", "Yo'q. Ro'yxatdan o'tish, do'kon sahifasi va mentor konsultatsiyasi bepul. Birinchi 3 oy komissiya olinmaydi, keyin faqat sotilgan buyumdan 7% olinadi."],
  ["Soliq masalasi qanday?", "Uyda ishlayotgan hunarmandlar \"o'zini o'zi band qilgan shaxs\" sifatida ro'yxatdan o'tishi mumkin. Moliya mentori bu jarayonni bosqichma-bosqich tushuntiradi."],
  ["Yetkazib berishni kim qiladi?", "Hamkor kuryer xizmati buyumni ustaning uyidan olib, xaridorga yetkazadi. Qashqadaryo ichida 1–2 kun, boshqa viloyatlarga 2–4 kun."],
  ["Kredit olish uchun nima kerak?", "Pasport, platformadagi savdo tarixi (daromad isboti sifatida) va qisqa biznes reja. Biznes rejani moliya mentori bilan birga tuzasiz."],
  ["Xaridor buyumni qaytara oladimi?", "Agar buyum tavsifga mos kelmasa, 3 kun ichida qaytarish mumkin. Oziq-ovqat mahsulotlari sifat muammosi bo'lmasa qaytarilmaydi."]
];
