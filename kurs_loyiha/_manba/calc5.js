// 5-loyiha: Tabiiy oltingugurtdan sulfat kislota (IK/IA sxema), absorber va o'choq hisobi. 7 t/sutka (100 % H2SO4)
const t = require('./thermo');
const { Vm, sum, solveT } = t;
Object.assign(t.CP, {
  SO2: { a: 46.19, b: 7.87e-3, c: 0, d: -7.70e5, Hf: -296.90, M: 64.066 },
  SO3: { a: 64.98, b: 11.75e-3, c: 0, d: -16.37e5, Hf: -395.77, M: 80.066 },
});
const R = {};
R.Gday = 7000; R.G = R.Gday / 24; R.nP = R.G / 98.08; // kmol/soat H2SO4
R.purS = 0.998; R.lossMech = 0.003;
R.ySO2 = 0.100; // o'choq gazida SO2 (quruq)
R.air = { N2: 78.09, O2: 20.95, Ar: 0.96 };
R.Tair = 303.15; R.phi = 0.5;
R.ps = T => 1000 * Math.exp(16.3872 - 3885.70 / (T - 273.15 + 230.170));
R.yW = R.phi * R.ps(R.Tair) / 101325;
R.x = [0.65, 0.85, 0.95]; R.x4 = 0.94; // 4-qatlam: qolgan SO2 ning konversiyasi
R.xTot = R.x[2] + (1 - R.x[2]) * R.x4;
R.etaA = 0.9998; // absorbsiya darajasi (har ikki absorber)
R.nS = R.nP / (R.xTot * R.etaA * (1 - R.lossMech));
R.mS = R.nS * 32.06 / R.purS;
// o'choq
R.nAirDry = R.nS / R.ySO2; // SO2 = S, O2 almashinadi
R.dryAir = { N2: R.nAirDry * 0.7809, O2: R.nAirDry * 0.2095, Ar: R.nAirDry * 0.0096 };
R.wetAir = { ...R.dryAir, H2O: R.nAirDry * R.yW / (1 - R.yW) };
R.furn = { SO2: R.nS, O2: R.dryAir.O2 - R.nS, N2: R.dryAir.N2, Ar: R.dryAir.Ar };
R.Pfurn = 0.115e6;
// o'choq issiqlik balansi: S(s, 413 K) + O2
R.TS = 413.15; R.dHS = 296.9; // kJ/mol (rombik S, 298 K)
R.cpSliq = 1.09; R.HSfus = 1.72; // kJ/(kg K) va kJ/mol erish (+ polimorf o'tish 0,40)
R.Tairin = 333.15; // quritilgan havo (kompressordan keyin)
R.HSin = R.nS * (32.06 * (0.73 * (388.4 - 298.15) + R.cpSliq * (R.TS - 388.4)) + (1.72 + 0.40) * 1000 * 0) / 3600; // kW fizik (qattiqdan suyuq holatga o'tish issiqligi reaksiyadan ayiriladi)
R.Qr_f = R.nS * (R.dHS - 1.72 - 0.40) / 3.6; // kW (suyuq S yonishi)
R.Hair_f = t.Qphys(R.dryAir, R.Tairin);
R.lossF = 0.03;
R.Tf = solveT(T => (R.HSin + R.Qr_f + R.Hair_f) * (1 - R.lossF) - t.Qphys(R.furn, T), 600, 2000);
// qozon-utilizator: Tf -> 693 K
R.T1in = 693.15; R.P = 0.12e6;
R.Q_whb = t.Qphys(R.furn, R.Tf) - t.Qphys(R.furn, R.T1in);
R.G_steam = R.Q_whb * 0.97 / (2800 - 440.2) * 3600;
// muvozanat
R.Kp = T => Math.pow(10, 4905.5 / T - 4.6455); // atm^-0.5
R.xeq = (T, a, b, Patm) => solveT(x => x - R.Kp(T) / (R.Kp(T) + Math.sqrt((100 - 0.5 * a * x) / (Patm * (b - 0.5 * a * x)))), 0, 0.99999);
// kontakt apparat qatlamlari
function bed(inl, Tin, x0, x1, nSO2_0, loss) {
  const dx = (x1 - x0) * nSO2_0; const out = { ...inl, SO2: inl.SO2 - dx, SO3: (inl.SO3 || 0) + dx, O2: inl.O2 - 0.5 * dx };
  const Qin = t.Qphys(inl, Tin), Qr = dx * 98.87 / 3.6;
  const Tout = solveT(T => (Qin + Qr) * (1 - loss) - t.Qphys(out, T), Tin, Tin + 400);
  return { inl, out, Tin, Tout, Qin, Qr, Qout: t.Qphys(out, Tout), Qloss: (Qin + Qr) * loss, dx };
}
R.lossB = 0.01;
R.Tin = [693.15, 713.15, 703.15];
R.beds = [];
{
  let g = { ...R.furn, SO3: 0 }; let x0 = 0; const a = R.furn.SO2 / sum(R.furn) * 100, b = R.furn.O2 / sum(R.furn) * 100;
  R.a = a; R.b = b;
  for (let i = 0; i < 3; i++) {
    const bd = bed(g, R.Tin[i], x0, R.x[i], R.furn.SO2, R.lossB);
    bd.x = R.x[i]; bd.xe = R.xeq(bd.Tout, a, b, R.P / 101325); bd.dTper = (bd.Tout - bd.Tin) / ((R.x[i] - x0) * 100);
    R.beds.push(bd); g = bd.out; x0 = R.x[i];
  }
  R.gas3 = g;
}
// oraliq absorber (asosiy apparat)
R.TgA = 453.15; R.TgAout = 343.15;
R.absIn = { ...R.gas3 };
R.SO3abs1 = R.absIn.SO3 * R.etaA;
R.absOut = { ...R.absIn, SO3: R.absIn.SO3 - R.SO3abs1 };
// 4-qatlam
{
  const g = { ...R.absOut }; const nSO2 = g.SO2; const a4 = nSO2 / sum(g) * 100, b4 = g.O2 / sum(g) * 100;
  const dx = R.x4 * nSO2; const out = { ...g, SO2: nSO2 - dx, SO3: g.SO3 + dx, O2: g.O2 - 0.5 * dx };
  const Tin = 698.15; const Qin = t.Qphys(g, Tin), Qr = dx * 98.87 / 3.6;
  const Tout = solveT(T => (Qin + Qr) * (1 - R.lossB) - t.Qphys(out, T), Tin, Tin + 200);
  R.bed4 = { inl: g, out, Tin, Tout, Qin, Qr, Qout: t.Qphys(out, Tout), Qloss: (Qin + Qr) * R.lossB, x: R.x4, xe: R.xeq(Tout, a4, b4, R.P / 101325), a4, b4 };
}
R.SO3abs2 = R.bed4.out.SO3 * R.etaA;
R.tail = { ...R.bed4.out, SO3: R.bed4.out.SO3 - R.SO3abs2 };
R.nH2SO4 = R.SO3abs1 + R.SO3abs2; // = nP/(1-lossMech)
// suv balansi va quritish minorasi
R.wP = 0.983; R.mProd = R.G / R.wP; // monogidrat (98,3 %) ko'rinishida
R.H2Oair = R.wetAir.H2O; // quritish minorasida yutiladi
R.W = R.nH2SO4 * 18.015 + (R.mProd - R.G) - R.H2Oair * 18.015; // qo'shiladigan suv, kg/soat (yo'qotishlarni hisobga olmay)
// --- Asosiy absorber (oraliq monogidrat absorber)
R.cpAc = 1.47; // kJ/(kg K) 98 % kislota
R.TL1 = 343.15; R.TL2 = 363.15;
R.Qr_abs = R.SO3abs1 * 132.4 / 3.6; // kW
R.Qg_in = t.Qphys(R.absIn, R.TgA); R.Qg_out = t.Qphys(R.absOut, R.TgAout);
R.Qg = R.Qg_in - R.Qg_out;
R.lossAb = 0.02;
R.Qacid = (R.Qr_abs + R.Qg) * (1 - R.lossAb);
R.L = R.Qacid * 3600 / (R.cpAc * (R.TL2 - R.TL1)); // kg/soat
R.rhoL = 1800; R.muL = 9.0; // mPa s (343 K, 98 %)
R.VL = R.L / R.rhoL;
R.dc = R.SO3abs1 * 80.066 / R.L * 100; // kislota konsentratsiyasi ortishi (SO3 bo'yicha, %)
// gaz xossalari
R.nG = sum(R.absIn); R.Mg = t.mass(R.absIn) / R.nG;
R.Tm = (R.TgA + R.TgAout) / 2; R.Pa = 0.110e6;
R.rhoG = R.Pa * R.Mg / 1000 / (8.314 * R.Tm);
R.Vg = R.nG / 3600 * 8.314 * R.Tm / R.Pa * 1000;
R.mG = t.mass(R.absIn) / 3600;
// nasadka 50x50x5
R.pk = { name: '50×50×5', d: 0.05, a: 87.5, e: 0.785, de: 0.036, rho: 530, b: 47 };
R.A = -0.073;
R.rhs = R.A - 1.75 * Math.pow(R.L / 3600 / R.mG, 0.25) * Math.pow(R.rhoG / R.rhoL, 0.125);
R.wt = Math.sqrt(Math.pow(10, R.rhs) * 9.81 * R.pk.e ** 3 * R.rhoL / (R.pk.a * R.rhoG * Math.pow(R.muL, 0.16)));
R.wr = 0.75 * R.wt; R.Dcalc = Math.sqrt(4 * R.Vg / (Math.PI * R.wr));
R.D = 0.6; R.S = Math.PI * R.D ** 2 / 4; R.w = R.Vg / R.S;
R.U = R.VL / R.S; R.Umin = R.pk.a * 2.2e-5 * 3600; // m3/(m2 soat)
R.psi = Math.min(1, R.U / R.Umin);
// massa berish (gaz fazasi), Nu = 0,407 Re^0,655 Pr^0,33
R.muG = 2.4e-5; R.DSO3 = 0.094e-4 * Math.pow(R.Tm / 273.15, 1.75) * (101325 / R.Pa);
R.Re = 4 * R.w * R.rhoG / (R.pk.a * R.muG);
R.Pr = R.muG / (R.rhoG * R.DSO3);
R.Nu = 0.407 * Math.pow(R.Re, 0.655) * Math.pow(R.Pr, 0.33);
R.beta = R.Nu * R.DSO3 / R.pk.de; // m/s
R.betaY = R.beta * R.rhoG / R.Mg; // kmol/(m2 s) (birlik mol ulushi)
R.y1 = R.absIn.SO3 / R.nG; R.y2 = R.absOut.SO3 / sum(R.absOut);
R.NOG = Math.log(R.y1 / R.y2) + 0; // muvozanat bosimi ~0
R.Gi = R.nG / 3600 / R.S; // kmol/(m2 s)
R.HOG = R.Gi / (R.betaY * R.pk.a * R.psi);
R.Hn = R.NOG * R.HOG; R.kz = 1.3; R.Hpack = Math.ceil(R.Hn * R.kz * 2) / 2;
// gidravlik qarshilik
R.lam = 16 / Math.pow(R.Re, 0.2);
R.dPdry = R.lam * R.Hpack / R.pk.de * R.rhoG * R.w ** 2 / (2 * R.pk.e ** 2);
R.dPwet = R.dPdry * Math.pow(10, R.pk.b * R.U / 3600);
R.Htot = R.Hpack + 1.2 + 1.0 + 1.5 + 0.5;
// devor: po'lat + kislotabardosh futerovka
R.s = 8; R.lin = 0.115;
// shtutserlar
R.dG = Math.sqrt(4 * R.nG / 3600 * 8.314 * R.TgA / R.Pa * 1000 / (Math.PI * 15));
R.dL = Math.sqrt(4 * R.VL / 3600 / (Math.PI * 1.0));
// kislota sovitgichi
R.Kc = 450; R.Tw1 = 293.15; R.Tw2 = 303.15;
R.dTlog = ((R.TL2 - R.Tw2) - (R.TL1 - R.Tw1)) / Math.log((R.TL2 - R.Tw2) / (R.TL1 - R.Tw1));
R.Fc = R.Qacid * 1000 / (R.Kc * R.dTlog); R.Gw = R.Qacid / (4.19 * 10) * 3600;
// o'choq hisobi
R.qV = 600; // kW/m3 issiqlik kuchlanishi
R.Vf = R.Qr_f / R.qV;
R.Df = 0.8; R.Lf = R.Vf / (Math.PI * R.Df ** 2 / 4);
R.Vfg = sum(R.furn) / 3600 * 8.314 * R.Tf / R.Pfurn * 1000; R.wf = R.Vfg / (Math.PI * R.Df ** 2 / 4);
R.tauF = R.Vf / R.Vfg;
R.nNoz = 1; R.qNoz = 150; // kg/soat forsunka
// quritish minorasi
R.Vdry = R.nAirDry / 3600 * 8.314 * 303.15 / 0.105e6 * 1000;
R.Ddry = Math.sqrt(4 * R.Vdry / (Math.PI * 0.8));
module.exports = R;
if (require.main === module) {
  const fmt = (kk, vv) => typeof vv === 'number' ? +vv.toPrecision(5) : vv;
  for (const k of Object.keys(R)) { const v = R[k]; if (typeof v === 'function') continue; if (k === 'beds') { v.forEach((b, i) => console.log('bed' + (i + 1), JSON.stringify({ Tin: b.Tin, Tout: b.Tout, x: b.x, xe: b.xe, dT: b.dTper, Qr: b.Qr }, fmt))); continue; } console.log(k, typeof v === 'object' ? JSON.stringify(v, fmt) : v); }
}
// chiqishdagi kislota konsentratsiyasi
R.mSO3a = R.SO3abs1 * 80.066;
R.cOut = (0.983 * R.L + R.mSO3a * 98.08 / 80.066) / (R.L + R.mSO3a);
// kontakt apparat: katalizator hajmi
R.vcatSpec = 0.20; // m3 / (t/sutka)
R.Vcat = R.vcatSpec * R.Gday / 1000;
R.bedShare = [0.20, 0.25, 0.30, 0.25];
R.Vbed = R.bedShare.map(s => s * R.Vcat * 1.0);
R.Vgn = sum(R.furn) * Vm / 3600; // m3/s n.sh.
R.tau0 = R.Vbed.map(v => v / R.Vgn);
R.wc = 0.45; // m/s (o'rtacha haroratda haqiqiy)
R.Vgc = sum(R.furn) / 3600 * 8.314 * 773 / R.P * 1000;
R.Dc = Math.sqrt(4 * R.Vgc / (Math.PI * R.wc));
R.Dcs = 1.0; R.Sc = Math.PI * R.Dcs ** 2 / 4; R.hbed = R.Vbed.map(v => v / R.Sc);
R.Df = 0.6; R.Lf = R.Vf / (Math.PI * R.Df ** 2 / 4); R.wf = R.Vfg / (Math.PI * R.Df ** 2 / 4);
if (require.main === module) console.log('cOut', R.cOut, 'bed4', R.bed4.Tout, R.bed4.xe, 'Vbed', R.Vbed, R.tau0, 'Dc', R.Dc, R.hbed, 'Lf', R.Lf, R.wf);
if (process.argv[2] === '--xt') {
  const eq = []; for (let T = 650; T <= 900; T += 5) eq.push([T, R.xeq(T, R.a, R.b, R.P / 101325)]);
  const beds = R.beds.map((b, i) => [[b.Tin, i ? R.x[i - 1] : 0], [b.Tout, b.x]]);
  require('fs').writeFileSync(process.argv[3], JSON.stringify({ eq, beds }));
}
