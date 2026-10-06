// 6-loyiha: Ammiakli soda ishlab chiqarish, filtratsiya bo'limi (barabanli vakuum-filtr). 8,07 t/soat kalsinatsiyalangan soda
const R = {};
const M = { Na2CO3: 105.99, NaHCO3: 84.01, NaCl: 58.44, NH4Cl: 53.49, NH4HCO3: 79.06, H2O: 18.015, CO2: 44.01, NH3: 17.03 };
R.M = M;
R.G = 8070; // kg/soat soda
R.wSoda = { Na2CO3: 0.990, NaCl: 0.006, other: 0.004 };
R.nSoda = R.G * R.wSoda.Na2CO3 / M.Na2CO3; // kmol/soat
R.lossCalc = 0.005; // kalsinatsiyada chang yo'qotish
R.nBic = 2 * R.nSoda / (1 - R.lossCalc); // kekdagi NaHCO3, kmol
R.mBic = R.nBic * M.NaHCO3;
R.mNaClCake = R.G * R.wSoda.NaCl / (1 - R.lossCalc);
R.wNH4 = 0.040; R.wW = 0.180; // kekdagi NH4HCO3 va suv ulushi
R.mOtherCake = R.G * R.wSoda.other / (1 - R.lossCalc);
R.mCake = (R.mBic + R.mNaClCake + R.mOtherCake) / (1 - R.wNH4 - R.wW);
R.cake = { NaHCO3: R.mBic, NH4HCO3: R.wNH4 * R.mCake, NaCl: R.mNaClCake, other: R.mOtherCake, H2O: R.wW * R.mCake };
// kalsinatsiya: 2NaHCO3 -> Na2CO3 + CO2 + H2O ; NH4HCO3 -> NH3 + CO2 + H2O
R.calc = {
  CO2: R.nBic / 2 * M.CO2 + R.cake.NH4HCO3 / M.NH4HCO3 * M.CO2, H2O: R.nBic / 2 * M.H2O + R.cake.NH4HCO3 / M.NH4HCO3 * M.H2O + R.cake.H2O,
  NH3: R.cake.NH4HCO3 / M.NH4HCO3 * M.NH3, dust: R.G * R.lossCalc / (1 - R.lossCalc),
};
// karbonizatsiya va namakob
R.U = 0.72; // Na bo'yicha foydalanish darajasi
R.lossFilt = 0.012; // filtrda NaHCO3 yo'qotish (filtratda erigan + o'tib ketgan)
R.nBicCryst = R.nBic / (1 - R.lossFilt);
R.nNaClFeed = R.nBicCryst / R.U;
R.cBrine = 305; R.rhoBrine = 1198; // kg/m3 NaCl va zichlik (tozalangan namakob)
R.Vbrine = R.nNaClFeed * M.NaCl / R.cBrine; // m3/soat
R.mBrine = R.Vbrine * R.rhoBrine;
R.kV = 1.22; R.Vml = R.Vbrine * R.kV; // ona suyuqlik hajmi
R.rhoML = 1170;
R.ml = {
  NaCl: R.nNaClFeed * (1 - R.U) * M.NaCl - 0, NH4Cl: R.nBicCryst * M.NH4Cl, NH4HCO3: 1.0 * R.Vml * M.NH4HCO3, NaHCO3: 0.08 * R.Vml * M.NaHCO3,
};
R.ml.H2O = R.rhoML * R.Vml - R.ml.NaCl - R.ml.NH4Cl - R.ml.NH4HCO3 - R.ml.NaHCO3;
R.mML = R.rhoML * R.Vml;
R.cML = Object.fromEntries(Object.entries(R.ml).map(([k, v]) => [k, v / R.Vml])); // kg/m3
// suspenziya
R.mCryst = R.nBicCryst * M.NaHCO3;
R.mSusp = R.mCryst + R.mOtherCake + R.mML;
R.xSolid = (R.mCryst + R.mOtherCake) / R.mSusp;
R.rhoS = 2200; R.rhoSusp = 1 / (R.xSolid / R.rhoS + (1 - R.xSolid) / R.rhoML);
R.Vsusp = R.mSusp / R.rhoSusp;
// yuvish suvi
R.wash = 0.75; // m3 / t soda
R.Vwash = R.wash * R.G / 1000; R.mWash = R.Vwash * 994;
R.bicDissWash = 0.06 * R.Vwash * M.NaHCO3; // yuvish suvida eriydigan NaHCO3
// filtrat = suspenziya suyuqligi + yuvish suvi + o'tib ketgan kristall - kek suyuqligi
R.mFiltrate = R.mSusp + R.mWash - R.mCake;
R.filt = {
  NaCl: R.ml.NaCl - R.mNaClCake, NH4Cl: R.ml.NH4Cl, NH4HCO3: R.ml.NH4HCO3 - R.cake.NH4HCO3, NaHCO3: R.mCryst - R.mBic + R.ml.NaHCO3,
};
R.filt.H2O = R.mFiltrate - Object.values(R.filt).reduce((a, b) => a + b, 0);
R.rhoF = 1140; R.Vfiltrate = R.mFiltrate / R.rhoF;
R.washEff = 1 - (R.mNaClCake / (R.cML.NaCl / R.rhoML * (R.cake.H2O + R.cake.NH4HCO3)));
// --- Filtr hisobi (Rut tenglamasi)
R.dP = 55e3; R.mu = 1.25e-3; R.r0 = 2.0e12; R.Rf = 5.0e9;
R.rhoCake = 1650; // nam kek zichligi
R.Vcake = R.mCake / R.rhoCake; // m3/soat (yuvilgan kek)
R.Vml_filt = R.Vml * (R.mML - (R.cake.H2O + R.cake.NH4HCO3 + R.mNaClCake)) / R.mML; // filtrlash zonasida ajraladigan filtrat (ona suyuqlik), m3/soat
R.x0 = R.Vcake / R.Vml_filt; // m3 kek / m3 filtrat
R.Kf = 2 * R.dP / (R.mu * R.r0 * R.x0); // m2/s
R.qe = R.Rf / (R.r0 * R.x0); // m3/m2
R.ang = { filt: 130, wash: 70, dry: 80, disch: 40, dead: 40 };
R.n = 2.0 / 60; // s^-1 (2 ayl/min)
R.tf = R.ang.filt / 360 / R.n;
R.q = -R.qe + Math.sqrt(R.qe * R.qe + R.Kf * R.tf); // m3/m2 bir siklda
R.h = R.q * R.x0; // kek qalinligi, m
R.qPerArea = R.q * R.n; // m3/(m2 s)
R.F = R.Vml_filt / 3600 / R.qPerArea; // m2
R.rateEnd = R.Kf / (2 * (R.q + R.qe)); // m3/(m2 s) filtrlash oxirida
R.qWash = R.Vwash / 3600 / (R.F * R.n); // m3/m2 bir siklda yuvish suvi
R.tWashNeed = R.qWash / R.rateEnd; R.tWashAvail = R.ang.wash / 360 / R.n;
R.Fst = 20; R.nF = R.F / R.Fst; R.nFwork = Math.ceil(R.nF * 1.0);
R.Dd = 2.6; R.Ld = 2.6; // BOU 20-2,6
R.vPer = Math.PI * R.Dd * R.n;
// havo (vakuum-nasos)
R.airSpec = 1.2; // m3/(m2 min) vakuumda
R.Vair = R.airSpec * R.Fst * R.nFwork / 60; // m3/s
// quvvat
R.Ndrum = 1.5; // kW
// issiqlik balansi (filtr)
R.cpSusp = 3.10; R.cpWash = 4.19; R.cpCake = 2.10; R.cpF = 3.30;
R.Tsusp = 301.15; R.Twash = 313.15; R.T0 = 273.15;
R.Q1 = R.mSusp * R.cpSusp * (R.Tsusp - R.T0) / 3600; R.Q2 = R.mWash * R.cpWash * (R.Twash - R.T0) / 3600;
R.Tair = 298.15; R.mAir = R.Vair * 0.045e6 / (287 * 298.15) * 3600; // kg/soat (vakuum ostida)
R.Q3 = R.mAir * 1.005 * (R.Tair - R.T0) / 3600;
R.Wev = R.mAir / 3600 * 0.012 * 3600; // havo bilan bug'langan suv kg/soat (namlik 0,012 kg/kg ga oshadi)
R.Qev = R.Wev * 2430 / 3600;
R.lossQ = 0.02;
R.Qin = R.Q1 + R.Q2 + R.Q3;
// chiqish haroratlari: kek va filtrat bir xil harorat T, havo T bilan chiqadi
R.Tout = R.T0 + (R.Qin * (1 - R.lossQ) - R.Qev) * 3600 / (R.mCake * R.cpCake + R.mFiltrate * R.cpF + R.mAir * 1.005);
// kalsinator issiqligi (qisqa)
R.dHcalc = 129.0; // kJ/mol NaHCO3 juftiga (2NaHCO3 -> Na2CO3 + CO2 + H2O(g)): +135,6 ; suyuq suvdan +... qabul
R.Qcalc = (R.nBic / 2 * 135.6 + R.cake.H2O / M.H2O * 44.0 + R.cake.NH4HCO3 / M.NH4HCO3 * 167.0) / 3.6
  + (R.G * 1.05 * (443 - 303) + (R.calc.CO2 * 0.92 + R.calc.H2O * 1.95 + R.calc.NH3 * 2.2) * (383 - 303)) / 3600;
R.etaCalc = 0.75; R.QcalcTot = R.Qcalc / R.etaCalc;
R.steamCalc = R.QcalcTot * 3600 / 1580; // 3 MPa bug' kondensatsiyasi (r ≈ 1795, kondensat issiqligidan foydalanish yo'q) — 1580 qabul
module.exports = R;
if (require.main === module) {
  for (const k of Object.keys(R)) { const v = R[k]; if (typeof v === 'function') continue; console.log(k, typeof v === 'object' ? JSON.stringify(v, (kk, vv) => typeof vv === 'number' ? +vv.toPrecision(5) : vv) : v); }
}
// BOU 20-2,6 uchun zarur aylanish chastotasi
R.qOf = n => { const tf = R.ang.filt / 360 / n; return -R.qe + Math.sqrt(R.qe * R.qe + R.Kf * tf); };
R.nReq = (() => { let lo = 0.002, hi = 0.2; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (R.qOf(m) * m * R.Fst * R.nFwork > R.Vml_filt / 3600) hi = m; else lo = m; } return (lo + hi) / 2; })();
R.nFwork = 1;
R.nReq = (() => { let lo = 0.002, hi = 0.2; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (R.qOf(m) * m * R.Fst > R.Vml_filt / 3600) hi = m; else lo = m; } return (lo + hi) / 2; })();
R.qReq = R.qOf(R.nReq); R.hReq = R.qReq * R.x0; R.tfReq = R.ang.filt / 360 / R.nReq;
R.Vair = R.airSpec * R.Fst / 60;
R.mAir = R.Vair * 0.045e6 / (287 * 298.15) * 3600;
// n bo'yicha jadval
R.nTable = [0.5, 1.0, 1.5, 2.0, 3.0].map(rpm => { const n = rpm / 60; const q = R.qOf(n); return { rpm, tf: R.ang.filt / 360 / n, q, h: q * R.x0, prod: q * n * 3600, F: R.Vml_filt / (q * n * 3600) }; });
if (require.main === module) console.log('nReq rpm', R.nReq * 60, 'h', R.hReq, R.tfReq, JSON.stringify(R.nTable));
// ish rejimi: n = 0,5 ayl/min
R.nW = 0.5 / 60; R.qW = R.qOf(R.nW); R.hW = R.qW * R.x0; R.tfW = R.ang.filt / 360 / R.nW; R.FW = R.Vml_filt / 3600 / (R.qW * R.nW);
R.rateEndW = R.Kf / (2 * (R.qW + R.qe)); R.qWashW = R.Vwash / 3600 / (R.Fst * R.nW); R.tWashNeedW = R.qWashW / R.rateEndW; R.tWashAvailW = R.ang.wash / 360 / R.nW;
R.loadW = R.FW / R.Fst;
// issiqlik balansini qayta hisoblash
R.Q3 = R.mAir * 1.005 * (R.Tair - R.T0) / 3600; R.Wev = R.mAir * 0.012; R.Qev = R.Wev * 2430 / 3600;
R.Qin = R.Q1 + R.Q2 + R.Q3;
R.Tout = R.T0 + (R.Qin * (1 - R.lossQ) - R.Qev) * 3600 / (R.mCake * R.cpCake + R.mFiltrate * R.cpF + R.mAir * 1.005);
R.Qcake = R.mCake * R.cpCake * (R.Tout - R.T0) / 3600; R.Qfilt = R.mFiltrate * R.cpF * (R.Tout - R.T0) / 3600; R.QairOut = R.mAir * 1.005 * (R.Tout - R.T0) / 3600;
if (require.main === module) console.log('W', R.qW, R.hW, R.tfW, R.FW, R.tWashNeedW, R.tWashAvailW, R.loadW, 'air', R.mAir, R.Tout);
