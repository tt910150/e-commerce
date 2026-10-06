// 3-loyiha: Azot kislotasi ishlab chiqarish sexining absorber hisobi bilan loyihasi. 75 t/sutka (100 % HNO3)
const t = require('./thermo');
const { Vm, sum, solveT } = t;
Object.assign(t.CP, {
  NH3: { a: 29.80, b: 25.48e-3, c: 0, d: -1.67e5, Hf: -45.94, M: 17.031 },
  NO: { a: 29.58, b: 3.85e-3, c: 0, d: -0.59e5, Hf: 90.25, M: 30.006 },
  NO2: { a: 42.93, b: 8.54e-3, c: 0, d: -6.74e5, Hf: 33.18, M: 46.006 },
});
const R = {};
R.G_day = 75; // t/sutka
R.G = R.G_day * 1000 / 24; // kg/soat HNO3
R.nP = R.G / 63.013; // kmol/soat
R.wP = 0.58; // mahsulot konsentratsiyasi
R.mProd = R.G / R.wP;
R.yNH3 = 0.105; R.eta = 0.945; // NH3 -> NO selektivlik
R.Pc = 0.80e6; R.Pa = 0.75e6; R.Tabs = 308.15;
R.air = { N2: 78.09, O2: 20.95, Ar: 0.96 };
R.ps = T => 1000 * Math.exp(16.3872 - 3885.70 / (T - 273.15 + 230.170));
R.phi = 0.6; R.Tair = 293.15; R.yW = R.phi * R.ps(R.Tair) / 101325;
R.yNOx_tail = 0.0008; R.yO2_tail = 0.030;
R.Tcc = 313.15; R.wCond = 0.40; R.alphaCC = 0.60; R.Ttop = 303.15;

function model(nA) {
  const m = {};
  m.nA = nA; m.nAir = nA * (1 - R.yNH3) / R.yNH3;
  const dry = m.nAir * (1 - R.yW);
  m.mix = { NH3: nA, N2: dry * R.air.N2 / 100, O2: dry * R.air.O2 / 100, Ar: dry * R.air.Ar / 100, H2O: m.nAir * R.yW };
  const a1 = R.eta * nA, a2 = (1 - R.eta) * nA;
  m.a1 = a1; m.a2 = a2;
  m.conv = { NO: a1, N2: m.mix.N2 + a2 / 2, O2: m.mix.O2 - 1.25 * a1 - 0.75 * a2, Ar: m.mix.Ar, H2O: m.mix.H2O + 1.5 * nA };
  // sovitgich-kondensator
  const c = m.conv; const dryN = c.NO + c.N2 + c.O2 + c.Ar; // NO2 ham quruq
  const pv = R.ps(R.Tcc) / (R.Pa + 0.03e6);
  // kondensatsiya: chiqishdagi bug' ~ to'yingan (quruq gaz o'zgarishi kichik, iteratsiya)
  let wc = 0, n = 0, xox = 0, out = null;
  for (let it = 0; it < 50; it++) {
    const gasDry = out ? sum(out, ['H2O']) : dryN;
    const vOut = pv / (1 - pv) * gasDry;
    wc = c.H2O - vOut; // kondensatsiyalangan suv (kmol)
    // 63n = w(63n + 18(wc - n/2)) => n(63 - 63w + 9w) = 18 w wc
    n = 18.015 * R.wCond * wc / (63.013 * (1 - R.wCond) + 0.5 * 18.015 * R.wCond);
    // chiqishda NO2/(NO+NO2) = alpha
    // NO2 = xox - 1.5n ; NO = NO_in - xox + 0.5n ; NOx = NO_in - n
    xox = R.alphaCC * (c.NO - n) + 1.5 * n;
    out = { NO: c.NO - xox + 0.5 * n, NO2: xox - 1.5 * n, N2: c.N2, O2: c.O2 - 0.5 * xox, Ar: c.Ar, H2O: vOut };
  }
  m.wc = wc; m.nCond = n; m.xox = xox; m.ccOut = out;
  m.condAcid = { HNO3: n * 63.013, H2O: (wc - 0.5 * n) * 18.015 };
  // ikkilamchi havo: dum gazda O2 = 3 %
  const absorbFn = sa => {
    const sdry = sa * (1 - R.yW);
    const g = { ...out }; g.N2 += sdry * R.air.N2 / 100; g.O2 += sdry * R.air.O2 / 100; g.Ar += sdry * R.air.Ar / 100; g.H2O += sa * R.yW;
    const NOx = g.NO + g.NO2;
    // dum gaz: NOx_out, H2O to'yingan 303 K
    // absorbsiyalangan NOx = NOx - NOx_out ; O2 sarfi: 4NOx(as NO)+3O2.. NO2 uchun 0.25, NO uchun 0.75
    const dryOther = g.N2 + g.Ar;
    // iteratsiya: NOx_out, O2_out
    let NOxo = 0.0008 * (dryOther + g.O2), O2o = 0;
    for (let k = 0; k < 50; k++) {
      const absNOx = NOx - NOxo;
      // tail NOx deyarli to'liq NO deb qabul qilinadi; NO2 kirgan to'liq yutiladi
      const absNO = g.NO - NOxo; const absNO2 = g.NO2;
      O2o = g.O2 - 0.75 * absNO - 0.25 * absNO2;
      const tdry = dryOther + O2o + NOxo;
      NOxo = R.yNOx_tail * tdry;
    }
    const tdry = dryOther + O2o + NOxo;
    return { g, NOxo, O2o, tdry, yO2: O2o / tdry, sa };
  };
  m.sa = solveT(sa => absorbFn(sa).yO2 - R.yO2_tail, 0, 5 * nA);
  const ab = absorbFn(m.sa); m.absIn = ab.g; m.NOxo = ab.NOxo; m.O2o = ab.O2o;
  m.saFlow = { N2: m.sa * (1 - R.yW) * R.air.N2 / 100, O2: m.sa * (1 - R.yW) * R.air.O2 / 100, Ar: m.sa * (1 - R.yW) * R.air.Ar / 100, H2O: m.sa * R.yW };
  const pvt = R.ps(R.Ttop) / R.Pa;
  m.tail = { NO: ab.NOxo, N2: ab.g.N2, O2: ab.O2o, Ar: ab.g.Ar };
  m.tail.H2O = pvt / (1 - pvt) * sum(m.tail);
  m.nAbs = (ab.g.NO + ab.g.NO2) - ab.NOxo; // absorberda hosil bo'lgan HNO3, kmol
  m.nTot = m.nAbs + n;
  return m;
}
R.nA = solveT(nA => model(nA).nTot - R.nP, 10, 200);
Object.assign(R, model(R.nA));
const m = R;
R.mNH3 = R.nA * 17.031;
R.specNH3 = R.mNH3 / R.G; // t/t
R.etaAbs = R.nTot / (R.a1); // NO -> HNO3
R.etaTot = R.nTot / R.nA;
// absorberga suv
R.waterProd = R.mProd - R.G;
R.waterCond = R.condAcid.H2O;
R.waterReactAbs = 0.5 * R.nAbs * 18.015;
R.vapIn = R.absIn.H2O * 18.015; R.vapOut = R.tail.H2O * 18.015;
R.W = R.waterProd + R.waterReactAbs + R.vapOut - R.waterCond - R.vapIn;
// absorber kirishidagi va chiqishidagi massalar
R.mGasIn = t.mass(R.ccOut); R.mSA = t.mass(R.saFlow); R.mTail = t.mass(R.tail);

// --- Kontakt apparat issiqlik balansi
R.Tc = 1163; R.lossC = 0.015;
R.Qr_c = (R.a1 * 226.5 + R.a2 * 316.8) / 3.6; // kW (4NH3+5O2: -906 kJ/4 mol = -226,5 ; 4NH3+3O2: -1267/4 = -316,8)
R.Hout_c = t.Qphys(R.conv, R.Tc);
R.Tmix = solveT(T => (t.Qphys(R.mix, T) + R.Qr_c) * (1 - R.lossC) - R.Hout_c, 300, 900);
R.Hin_c = t.Qphys(R.mix, R.Tmix);
R.dTad = R.Tc - R.Tmix;
// qozon-utilizator va boshqa issiqlik almashtirgichlar
R.T_whb = 523;
R.Q_whb = t.Qphys(R.conv, R.Tc) - t.Qphys(R.conv, R.T_whb);
R.G_steam = R.Q_whb * 0.97 / (2793 - 440.2) * 3600; // 1,6 MPa to'yingan bug'
R.T_th = 423; R.Q_th = t.Qphys(R.conv, R.T_whb) - t.Qphys(R.conv, R.T_th);
// sovitgich-kondensator
R.cpAcid40 = 2.9;
R.Q_cc_gas = t.Qphys(R.conv, R.T_th) - t.Qphys(R.ccOut, R.Tcc); // fizik + reaksiya alohida
R.Q_cc = (() => {
  // entalpiya (hosil bo'lish bilan) farqi: kirish gaz 423 K -> chiqish gaz 313 K + kondensat 313 K
  const Hf = (fl, T) => { let h = 0; for (const s in fl) h += fl[s] * (t.CP[s].Hf * 1000 + t.dH(s, T)); return h / 3600; };
  const Hin = Hf(R.conv, R.T_th);
  const Hout = Hf(R.ccOut, R.Tcc);
  // kondensat: HNO3(eritma 40 %) va suyuq suv
  const HHNO3aq = -174.1 - 25.5; // kJ/mol, 40 % eritmada (erish issiqligi bilan)
  const Hc = (R.nCond * (HHNO3aq * 1000) + (R.wc - 0.5 * R.nCond) * (-285.83e3)) / 3600 + (R.condAcid.HNO3 + R.condAcid.H2O) * 2.9 * (R.Tcc - 298.15) / 3600;
  return Hin - Hout - Hc;
})();
// --- Absorberning issiqlik balansi
R.dH_ox = 57.07; // kJ/mol NO
R.dH_abs = 56.7; // kJ/mol HNO3 (3NO2+H2O(s)->2HNO3(aq)+NO)
// absorberda oksidlangan NO: NO_in - NO_out + (hosil bo'lgan NO = nAbs/2)
R.nOxAbs = R.absIn.NO - R.NOxo + 0.5 * R.nAbs;
R.Q1 = R.nOxAbs * R.dH_ox / 3.6; // kW
R.Q2 = R.nAbs * R.dH_abs / 3.6;
R.Qvap = (R.absIn.H2O - R.tail.H2O) * 18.015 * 2410 / 3600; // kondensatsiya
R.Hg_in = t.Qphys(R.ccOut, R.Tcc) + t.Qphys(R.saFlow, 333.15); // ikkilamchi havo 333 K (oqartirish kolonnasidan keyin)
R.Hg_out = t.Qphys(R.tail, R.Ttop);
R.cpW = 4.19; R.cpP = 2.75;
R.HL_in = (R.W * R.cpW * (303.15 - 298.15) + (R.condAcid.HNO3 + R.condAcid.H2O) * R.cpAcid40 * (R.Tcc - 298.15)) / 3600;
R.HL_out = R.mProd * R.cpP * (R.Tabs + 5 - 298.15) / 3600;
R.lossA = 0.01;
R.QinA = R.Hg_in + R.HL_in + R.Q1 + R.Q2 + R.Qvap;
R.Qcool = R.QinA * (1 - R.lossA) - R.Hg_out - R.HL_out;
R.Tw1 = 291.15; R.Tw2 = 301.15; R.Gw = R.Qcool / (4.19 * 10) * 3600;
R.dTlog = ((313.15 - R.Tw2) - (313.15 - R.Tw1)) / Math.log((313.15 - R.Tw2) / (313.15 - R.Tw1));
R.Kcoil = 1000; R.Fcoil = R.Qcool * 1000 / (R.Kcoil * R.dTlog);

// --- Absorber: diametr
R.inGas = { ...R.absIn };
R.nG = sum(R.inGas); R.Mg = t.mass(R.inGas) / R.nG;
R.rhoG = R.Pa * R.Mg / 1000 / (8.314 * R.Tabs);
R.Vg = R.nG / 3600 * 8.314 * R.Tabs / R.Pa * 1000; // m3/s
R.rhoL = 1300; R.C = 0.060;
R.wdop = R.C * Math.sqrt((R.rhoL - R.rhoG) / R.rhoG);
R.Dcalc = Math.sqrt(4 * R.Vg / (Math.PI * R.wdop));
R.D = 1.0; R.S = Math.PI * R.D ** 2 / 4; R.w = R.Vg / R.S;
// --- Oksidlanish kinetikasi bo'yicha erkin hajm
R.kT = T => Math.pow(10, 652.1 / T - 0.7356); // atm^-2 s^-1
R.k = R.kT(R.Tabs);
{
  // dastlab kirgan NO2 pastki tarelkalarda yutiladi
  let NO = R.inGas.NO + R.inGas.NO2 / 3, O2 = R.inGas.O2 - 0, inert = R.inGas.N2 + R.inGas.Ar + R.inGas.H2O;
  const NO0 = NO;
  let V = 0; const dV = 0.0005; const prof = [[0, NO, O2, inert]];
  const Patm = R.Pa / 101325;
  const NOtarget = R.NOxo;
  let steps = 0;
  while (NO > NOtarget && steps < 5e6) {
    const n = NO + O2 + inert;
    const pNO = NO / n * Patm, pO2 = O2 / n * Patm;
    const Vdot = n / 3600 * 8.314 * R.Tabs / R.Pa * 1000; // m3/s
    const rate = 2 * R.k * pNO * pNO * pO2; // atm/s NO oksidlanishi
    const dxi = rate / Patm * n * (dV / Vdot); // kmol/soat
    NO -= (2 / 3) * dxi; O2 -= 0.5 * dxi;
    V += dV; steps++;
    if (steps % 200 === 0) prof.push([V, NO, O2, inert]);
  }
  R.Vfree = V; R.prof = prof; R.NOstart = NO0;
}
R.Ht = 0.6; R.hf = 0.2; R.Vtray = R.S * (R.Ht - R.hf);
R.Nth = R.Vfree / R.Vtray;
R.kz = 1.4; R.N = Math.ceil(R.Nth * R.kz);
R.Nbleach = 4;
// tarelka gidravlikasi
R.d0 = 0.003; R.fs = 0.06; R.w0 = R.w / R.fs; R.xi = 1.8;
R.dPdry = R.xi * R.rhoG * R.w0 ** 2 / 2;
R.hL = 0.04; R.dPliq = R.rhoL * 9.81 * R.hL;
R.sigma = 0.065; R.dPsig = 4 * R.sigma / R.d0;
R.dPtray = R.dPdry + R.dPliq + R.dPsig;
R.dPtot = R.dPtray * (R.N + R.Nbleach);
R.w0min = 0.67 * Math.sqrt(9.81 * R.rhoL * R.hL / (R.xi * R.rhoG));
R.nHoles = R.fs * R.S * 0.85 / (Math.PI * R.d0 ** 2 / 4);
R.Htot = R.N * R.Ht + R.Nbleach * R.Ht + 1.5 + 1.2 + 2.0;
// devor
R.Pr = 1.1 * R.Pa / 1e6; R.sig = 152; R.ph = 0.9; R.cc = 1;
R.sR = R.Pr * R.D * 1000 / (2 * R.ph * R.sig - R.Pr); R.s = Math.max(Math.ceil(R.sR + R.cc), 8);
// zmeyevik
R.coilPerTray = (() => { const pitch = 0.05, d = 0.025; const Lr = R.S * 0.85 / pitch; return { L: Lr * 2, F: Math.PI * d * Lr * 2 }; })();
R.nCoilTrays = Math.ceil(R.Fcoil / R.coilPerTray.F);
// suyuqlik
R.VL = R.mProd / 1350; // m3/soat
// shtutserlar
R.nozG = Math.sqrt(4 * R.Vg / (Math.PI * 15));
R.nozL = Math.sqrt(4 * (R.VL / 3600) / (Math.PI * 0.5));
// kontakt apparat
R.qNH3 = 2200; // kg NH3/(m2 soat), 0,7-0,8 MPa
R.Fset = R.mNH3 / R.qNH3; R.Dset = Math.sqrt(4 * R.Fset / Math.PI);
R.nSet = 9; R.mPt = R.Fset * R.nSet * 0.82; // ~0,82 kg/m2 setka (d=0,09 mm, 1024 yacheyka/sm2)? taxminiy
R.lossPt = 0.14; // g/t HNO3
module.exports = R;
if (require.main === module) {
  for (const k of Object.keys(R)) { const v = R[k]; if (typeof v === 'function' || k === 'prof') continue; console.log(k, typeof v === 'object' ? JSON.stringify(v, (kk, vv) => typeof vv === 'number' ? +vv.toPrecision(5) : vv) : v); }
}
if (process.argv[2] === '--prof') require('fs').writeFileSync(process.argv[3], JSON.stringify({ prof: R.prof.map(r => [r[0] / R.Vtray, r[1] / (r[1] + r[2] + r[3]) * 100, r[2] / (r[1] + r[2] + r[3]) * 100]), N: R.N }));

// sezgirlik: erkin hajm harorat va bosimga bog'liq
R.integrate = (T, P) => {
  let NO = R.inGas.NO + R.inGas.NO2 / 3, O2 = R.inGas.O2; const inert = R.inGas.N2 + R.inGas.Ar + R.inGas.H2O;
  const k = R.kT(T), Patm = P / 101325; let V = 0; const dV = 0.0005;
  while (NO > R.NOxo) {
    const n = NO + O2 + inert; const pNO = NO / n * Patm, pO2 = O2 / n * Patm;
    const Vdot = n / 3600 * 8.314 * T / P * 1000; const dxi = 2 * k * pNO * pNO * pO2 / Patm * n * (dV / Vdot);
    NO -= (2 / 3) * dxi; O2 -= 0.5 * dxi; V += dV;
    if (V > 5000) break;
  }
  return V;
};
// energetika: kompressor va turbina
R.energy = (() => {
  const mAir = (R.nAir + R.sa) * 28.85 / 3600; const k = 1.4, cp = 1.005;
  const T2s = R.Tair * Math.pow(0.85e6 / 0.1e6, (k - 1) / k); const wC = cp * (T2s - R.Tair) / 0.80; const NC = mAir * wC;
  const mT = R.mTail / 3600; const Tt = 543; const T2t = Tt * Math.pow(0.105e6 / 0.72e6, (k - 1) / k); const wT = 1.05 * (Tt - T2t) * 0.85; const NT = mT * wT;
  return { mAir, T2s, wC, NC, mT, Tt, T2t, wT, NT };
})();
