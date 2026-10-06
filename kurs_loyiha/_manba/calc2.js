// 2-loyiha: konvertlangan gazni MEA eritmasi bilan tozalash, absorber hisobi. 105 m3/soat konvertlangan gaz.
const t = require('./thermo');
const c1 = require('./calc1');
const { Vm, sum, solveT } = t;

const R = {};
R.V = 105; // m3/soat quruq gaz (n.sh.)
// 1-loyihadagi past haroratli konvertor chiqishidagi quruq gaz tarkibi
const lt = c1.LT.out; const dry = sum(lt, ['H2O']);
R.y = {}; for (const s of ['H2', 'N2', 'CO2', 'CO', 'CH4', 'Ar']) R.y[s] = lt[s] / dry;
// yaxlitlangan tarkib (%)
R.yp = { H2: 61.27, N2: 19.88, CO2: 17.91, CO: 0.35, CH4: 0.35, Ar: 0.24 };
R.P = 2.8e6; R.Tg = 313.15; R.TL = 313.15; R.Ttop = 315.15;
R.yCO2out = 0.0003; // 0,03 % hajm
R.n_dry = R.V / Vm;
R.gin = {}; for (const s in R.yp) R.gin[s] = R.n_dry * R.yp[s] / 100;
R.ps = T => 1000 * Math.exp(16.3872 - 3885.70 / (T - 273.15 + 230.170)); // Antuan, Pa
R.pH2O_in = R.ps(R.Tg); R.gin.H2O = R.n_dry * R.pH2O_in / (R.P - R.pH2O_in);
const other = R.n_dry - R.gin.CO2;
R.CO2out = R.yCO2out * other / (1 - R.yCO2out);
R.nabs = R.gin.CO2 - R.CO2out;
R.gout = { ...R.gin, CO2: R.CO2out };
R.pH2O_out = 0.92 * R.ps(R.Ttop); // MEA eritmasi ustida (x_H2O ~0,92)
R.gout.H2O = (sum(R.gout, ['H2O'])) * R.pH2O_out / (R.P - R.pH2O_out);
R.dH2O = R.gout.H2O - R.gin.H2O; // eritmadan bug'langan suv, kmol/soat
R.gout_dry = sum(R.gout, ['H2O']);
R.eta = R.nabs / R.gin.CO2;

// MEA eritmasi
R.wMEA = 0.20; R.aL = 0.15; R.aR = 0.45; R.M_MEA = 61.08; R.M_CO2 = 44.01; R.M_H2O = 18.015;
R.nMEA = R.nabs / (R.aR - R.aL);
R.mMEA = R.nMEA * R.M_MEA;
R.mW = R.mMEA * (1 - R.wMEA) / R.wMEA;
R.mCO2L = R.nMEA * R.aL * R.M_CO2;
R.mLean = R.mMEA + R.mW + R.mCO2L;
R.mAbsCO2 = R.nabs * R.M_CO2;
R.mRich = R.mLean + R.mAbsCO2 - R.dH2O * R.M_H2O;
R.rhoL = 1010; R.rhoR = 1060;
R.VL = R.mLean / R.rhoL; // m3/soat
R.CMEA = R.nMEA / R.VL; // kmol/m3
R.spec = R.mLean / (R.nabs * Vm); // kg eritma / m3 CO2 ... (ma'lumot)
R.Lm3perCO2 = R.VL / (R.nabs * Vm);

// muvozanat: p* = F(T)*a^2/(1-2a)^2, kPa
R.F0 = 0.20; R.Eh = 10100; // K
R.Feq = T => R.F0 * Math.exp(-R.Eh * (1 / T - 1 / 313.15));
R.peq = (a, T) => R.Feq(T) * a * a / ((1 - 2 * a) ** 2);

// absorber issiqlik balansi (273,15 K ga nisbatan)
R.cpL = 3.80; // kJ/(kg K), 20 % MEA
R.cpLr = 3.70;
R.dHabs = 84.0; // kJ/mol CO2
R.rH2O = 2406; // kJ/kg, 313 K da bug'lanish
function Hgas(flow, T) { let q = 0; for (const s in flow) q += flow[s] * (t.dH(s, T) - t.dH(s, 273.15)); return q / 3600; } // kW
R.Hgin = Hgas(R.gin, R.Tg);
R.HLin = R.mLean * R.cpL * (R.TL - 273.15) / 3600;
R.Qabs = R.nabs * R.dHabs * 1000 / 3600; // kW
R.Hgout = Hgas(R.gout, R.Ttop);
R.Qevap = R.dH2O * R.M_H2O * R.rH2O / 3600;
R.lossA = 0.02;
R.Qin = R.Hgin + R.HLin + R.Qabs;
R.Qloss = R.Qin * R.lossA;
R.HLout = R.Qin - R.Hgout - R.Qevap - R.Qloss;
R.TR = 273.15 + R.HLout * 3600 / (R.mRich * R.cpLr);
R.pBot = R.gin.CO2 / sum(R.gin) * R.P / 1000; // kPa
R.peqR = R.peq(R.aR, R.TR);
R.pTop = R.CO2out / sum(R.gout) * R.P / 1000;
R.peqL = R.peq(R.aL, R.Ttop);
R.aReq = solveT(a => R.peq(a, R.TR) - R.pBot, 0.01, 0.499);

// NOY ni sonli integrallash (nisbiy mol ulushlar)
R.Gin = sum(R.gin, ['CO2', 'H2O']); // inert gaz, kmol/soat
R.Y1 = R.gin.CO2 / R.Gin; R.Y2 = R.CO2out / R.Gin;
{
  const N = 2000; let I = 0; const pts = [];
  for (let i = 0; i <= N; i++) {
    const Y = R.Y2 + (R.Y1 - R.Y2) * i / N;
    const a = R.aL + (Y - R.Y2) * R.Gin / R.nMEA;
    const T = R.Ttop - 2 + (R.TR - R.Ttop + 2) * (a - R.aL) / (R.aR - R.aL);
    const p = R.peq(Math.min(a, 0.499), T) * 1000; const ys = p / R.P; const Ys = ys / (1 - ys);
    const f = 1 / (Y - Ys); pts.push([Y, a, T, Ys, f]);
    if (i > 0) I += (pts[i][4] + pts[i - 1][4]) / 2 * (R.Y1 - R.Y2) / N;
  }
  R.NOY = I; R.prof = [0, 400, 800, 1200, 1600, 1800, 1900, 1950, 2000].map(i => pts[i]);
  R.dYavg = (R.Y1 - R.Y2) / R.NOY;
}

// Diametr: nasadka tiqilishi (Kafarov tenglamasi)
R.packs = [
  { name: '15×15×2', d: 0.015, a: 330, e: 0.70, de: 0.0085, rho: 690, b: 69 },
  { name: '25×25×3', d: 0.025, a: 200, e: 0.74, de: 0.015, rho: 530, b: 51 },
  { name: '35×35×4', d: 0.035, a: 140, e: 0.78, de: 0.022, rho: 505, b: 49 },
  { name: '50×50×5', d: 0.050, a: 87.5, e: 0.785, de: 0.036, rho: 530, b: 47 },
];
R.Mg = t.mass(R.gin) / sum(R.gin);
R.rhoG = R.P * R.Mg / 1000 / (8.314 * R.Tg);
R.mG = t.mass(R.gin) / 3600; // kg/s
R.Vg = R.mG / R.rhoG; // m3/s
R.muL = 1.40; // mPa s
R.muG = 1.25e-5;
R.Lkg = R.mLean / 3600;
R.A = -0.073;
R.flood = R.packs.map(p => {
  const rhs = R.A - 1.75 * Math.pow(R.Lkg / R.mG, 0.25) * Math.pow(R.rhoG / R.rhoL, 0.125);
  const w = Math.sqrt(Math.pow(10, rhs) * 9.81 * p.e ** 3 * R.rhoL / (p.a * R.rhoG * Math.pow(R.muL, 0.16)));
  const wr = 0.75 * w; const D = Math.sqrt(4 * R.Vg / (Math.PI * wr));
  return { ...p, rhs, w, wr, D, Dd: D / p.d };
});
R.pk = R.packs[0]; R.fl = R.flood[0];
R.D = 0.20; R.S = Math.PI * R.D ** 2 / 4;
R.w = R.Vg / R.S; R.wfrac = R.w / R.fl.w;
R.U = R.VL / R.S; // m3/(m2 soat)
R.Umin = R.pk.a * 2.2e-5 * 3600; // m3/(m2 soat)
R.psi = Math.min(1, R.U / R.Umin);

// Massa almashinish
R.KGa = 2.0e-5; // mol/(m3 s Pa)
R.KYa = R.KGa * R.P / 1000; // kmol/(m3 s) = mol/(m3 s Pa)*Pa /1000
R.Gi = R.Gin / 3600 / R.S; // kmol/(m2 s)
R.hOY = R.Gi / (R.KYa * R.psi);
R.Hn = R.NOY * R.hOY;
R.kres = 1.25; R.Hnp = R.Hn * R.kres;
R.Hsec = Math.ceil(R.Hnp / 2 * 2) / 2; // har seksiya, 0,5 m gacha yaxlitlash
R.Hpack = 2 * R.Hsec;
// tekshiruv: yutilgan CO2 = KGa*V*dp_ort
R.Vpack = R.S * R.Hpack;
// gidravlik qarshilik
R.Reg = 4 * R.w * R.rhoG / (R.pk.a * R.muG);
R.lam = 16 / Math.pow(R.Reg, 0.2);
R.dPdry = R.lam * R.Hpack / R.pk.de * R.rhoG * R.w ** 2 / (2 * R.pk.e ** 2);
R.Us = R.U / 3600;
R.dPwet = R.dPdry * Math.pow(10, R.pk.b * R.Us);
// apparat balandligi
R.hLiq = 0.6; R.tauBot = R.S * R.hLiq / (R.mRich / R.rhoR / 3600); // s
R.Htot = R.Hpack + 0.8 /*seksiyalar orasi qayta taqsimlagich*/ + 0.8 /*yuqori: taqsimlagich+tomchi ushlagich*/ + 0.6 /*gaz kirish zonasi*/ + 1.0 + 0.3;
R.Hbot = 1.0;
// devor
R.Pr = 1.1 * R.P / 1e6; R.sigma = 146; R.phi = 0.9; R.cc = 2;
R.sR = R.Pr * R.D * 1000 / (2 * R.phi * R.sigma - R.Pr); R.s = Math.max(Math.ceil(R.sR + R.cc), 6);
// shtutserlar
const noz = (V, w) => Math.sqrt(4 * V / (Math.PI * w));
R.nozG = { V: R.Vg, w: 15, d: noz(R.Vg, 15) };
R.nozL = { V: R.VL / 3600, w: 1.0, d: noz(R.VL / 3600, 1.0) };
R.nozR = { V: R.mRich / R.rhoR / 3600, w: 0.5, d: noz(R.mRich / R.rhoR / 3600, 0.5) };
// massa
R.mpack = R.Vpack * R.pk.rho;
R.mL_hold = 0.05 * R.Vpack * R.rhoL; // ushlanib turuvchi suyuqlik ~5%

// Regenerator (desorber) va issiqlik almashtirgichlar
R.Treg = 393.15; R.Trin = 368.15; R.Pd = 0.18e6;
R.cpm = 3.85;
R.Qhx = R.mRich * R.cpLr * (R.Trin - R.TR) / 3600; // kW
R.mLeanHot = R.mLean; // regeneratsiyadan
R.TlhxOut = R.Treg - R.Qhx * 3600 / (R.mLeanHot * R.cpL);
R.dT1 = R.Treg - R.Trin; R.dT2 = R.TlhxOut - R.TR;
R.dTlog_hx = (R.dT1 - R.dT2) / Math.log(R.dT1 / R.dT2);
R.Khx = 600; R.Fhx = R.Qhx * 1000 / (R.Khx * R.dTlog_hx);
R.Qcool = R.mLean * R.cpL * (R.TlhxOut - R.TL) / 3600;
R.Tw1 = 298.15; R.Tw2 = 308.15; R.Gw = R.Qcool / (4.18 * (R.Tw2 - R.Tw1)) * 3600;
R.dTa = R.TlhxOut - R.Tw2; R.dTb = R.TL - R.Tw1; R.dTlog_c = (R.dTa - R.dTb) / Math.log(R.dTa / R.dTb);
R.Kc = 500; R.Fc = R.Qcool * 1000 / (R.Kc * R.dTlog_c);
// qaynatgich
R.Qsens = R.mRich * R.cpLr * (R.Treg - R.Trin) / 3600;
R.Qdes = R.Qabs; // desorbsiya issiqligi = absorbsiya issiqligi
R.rflux = 1.2; // kmol H2O / kmol CO2 regenerator tepasida
R.Qstrip = R.nabs * R.rflux * R.M_H2O * 2260 / 3600;
R.lossD = 0.05;
R.Qreb = (R.Qsens + R.Qdes + R.Qstrip) / (1 - R.lossD);
R.r_st = 2133; // kJ/kg, 0,4 MPa to'yingan bug'
R.Gst = R.Qreb * 3600 / R.r_st;
R.qspec = R.Qreb * 3600 / (R.mAbsCO2) / 1000; // MJ/kg CO2
R.dTreb = 416.8 - R.Treg; R.Kreb = 900; R.Freb = R.Qreb * 1000 / (R.Kreb * R.dTreb);
// kondensator
R.Qcond = R.Qstrip + R.nabs * (t.dH('CO2', 368.15) - t.dH('CO2', 313.15)) / 3600 + R.nabs * R.rflux * R.M_H2O * 4.19 * (368.15 - 313.15) / 3600;
R.Kcond = 350; R.dTcond = ((368.15 - 308.15) - (313.15 - 298.15)) / Math.log(60 / 15); R.Fcond = R.Qcond * 1000 / (R.Kcond * R.dTcond);
// nasos
R.Hpump = (R.P - 0.25e6) / (R.rhoL * 9.81) + 20; R.Npump = R.rhoL * 9.81 * (R.VL / 3600) * R.Hpump / 0.55 / 1000;
// desorber diametri (bug' bo'yicha)
R.Vvap = (R.nabs * (1 + R.rflux)) * 8.314 * 368.15 / R.Pd * 1000 / 3600; // m3/s top
R.Vvap_bot = (R.Qreb * 0.95 / 2200) / (R.Pd * 0.018 / (8.314 * R.Treg)); // m3/s qaynatgichdan bug'
R.wd = 0.6; R.Dd = Math.sqrt(4 * Math.max(R.Vvap, R.Vvap_bot) / (Math.PI * 0.6));

// yillik
R.tau = 8000;
module.exports = R;
if (require.main === module) {
  for (const k of Object.keys(R)) { const v = R[k]; if (typeof v === 'function') continue; console.log(k, typeof v === 'object' ? JSON.stringify(v, (kk, vv) => typeof vv === 'number' ? +vv.toPrecision(5) : vv) : v); }
}

// grafik uchun ishchi va muvozanat chiziqlari
R.lines = (() => {
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const Y = R.Y2 + (R.Y1 - R.Y2) * i / 60;
    const a = R.aL + (Y - R.Y2) * R.Gin / R.nMEA;
    const T = R.Ttop - 2 + (R.TR - R.Ttop + 2) * (a - R.aL) / (R.aR - R.aL);
    const ys = R.peq(Math.min(a, 0.499), T) * 1000 / R.P;
    pts.push([a, Y, ys / (1 - ys), T]);
  }
  return pts;
})();
if (process.argv[2] === '--lines') require('fs').writeFileSync(process.argv[3], JSON.stringify(R.lines));
