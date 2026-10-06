// 4-loyiha: Qizilqum fosforitlaridan oddiy superfosfat, superfosfat kamerasi hisobi. 5 t/sutka
const R = {};
R.Gday = 5000; // kg/sutka tayyor superfosfat
R.G = R.Gday / 24; // kg/soat
// YuKFK tarkibi, %
R.comp = { P2O5: 26.0, CaO: 52.5, CO2: 2.0, F: 3.0, MgO: 0.6, Al2O3: 1.0, Fe2O3: 0.9, SO3: 2.8, SiO2: 9.0, H2O: 1.0, other: 2.46, OF: -1.26 };
const M = { P2O5: 141.94, CaO: 56.08, CO2: 44.01, F: 19.00, MgO: 40.30, Al2O3: 101.96, Fe2O3: 159.69, SO3: 80.06, SiO2: 60.08, H2O: 18.015,
  ap: 504.30, CaF2: 78.07, CaSO4: 136.14, CaCO3: 100.09, H2SO4: 98.08, H3PO4: 98.00, MCP: 252.07, MgSO4: 120.37, Fe2SO4: 399.88, Al2SO4: 342.15, HF: 20.01, SiF4: 104.08, H2SiF6: 144.09 };
R.M = M;
const n = {}; for (const k of ['P2O5', 'CaO', 'CO2', 'F', 'MgO', 'Al2O3', 'Fe2O3', 'SO3', 'SiO2', 'H2O']) n[k] = R.comp[k] / M[k];
R.n = n;
// mineral tarkib
R.ap = n.P2O5 / 1.5; R.CaF2 = (n.F - R.ap) / 2; R.CaSO4_0 = n.SO3; R.CaCO3 = n.CO2;
R.CaOf = n.CaO - 5 * R.ap - R.CaSO4_0 - R.CaCO3 - R.CaF2;
// kislota normasi
R.acidRows = [
  ['Ca₅(PO₄)₃F', R.ap, 3.5], ['CaO (erkin)', R.CaOf, 1], ['CaCO₃', R.CaCO3, 1], ['CaF₂', R.CaF2, 1],
  ['MgO', n.MgO, 1], ['Fe₂O₃', n.Fe2O3, 3], ['Al₂O₃', n.Al2O3, 3]];
R.nAcid0 = R.acidRows.reduce((s, r) => s + r[1] * r[2], 0);
R.norm = 1.00; R.nAcid = R.nAcid0 * R.norm; R.mAcid = R.nAcid * M.H2SO4;
R.wA = 0.68; R.mAcidSol = R.mAcid / R.wA; R.mAcidW = R.mAcidSol - R.mAcid;
// kamera reaksiyalari
R.Kch = 0.82; R.Kcur = 0.92;
R.impAcid = R.CaOf + R.CaCO3 + R.CaF2 + n.MgO + 3 * n.Fe2O3 + 3 * n.Al2O3;
R.n1 = (R.nAcid - R.impAcid) / 5; // apatit + H2SO4
R.H3PO4f = 3 * R.n1;
R.n2 = R.Kch * R.ap - R.n1; // apatit + H3PO4
R.MCP = 5 * R.n2; R.H3PO4 = R.H3PO4f - 7 * R.n2; R.apRest = R.ap - R.n1 - R.n2;
// ftor
R.HF = R.n1 + R.n2 + 2 * R.CaF2;
R.fGas1 = 0.15; R.fGas2 = 0.25;
R.SiF4 = R.fGas1 * n.F / 4; R.H2SiF6 = (R.HF - 4 * R.SiF4) / 6;
R.SiO2used = R.SiF4 + R.H2SiF6;
// suv
R.Win = n.H2O + R.mAcidW / M.H2O;
R.Wform = R.CaCO3 + R.CaOf + n.MgO + 3 * n.Fe2O3 + 3 * n.Al2O3 + 2 * R.SiF4 + 2 * R.H2SiF6;
R.Wcons = 5 * R.n2;
// --- Issiqlik balansi (100 kg fosforitga, kJ) va bug'lanadigan suv
R.dH = { ap1: 86.9, ap2: 118.4, CaO: 224.8, CaCO3: 46.5, MgO: 109.1, Fe: 34.6, Al: 42.5, CaF2: -107.3, SiF4: 182.5, H2SiF6: 351.9 }; // kJ/mol (ajraladigan)
R.Qr = {
  ap1: R.n1 * R.dH.ap1 * 1000, ap2: R.n2 * R.dH.ap2 * 1000, CaO: R.CaOf * R.dH.CaO * 1000, CaCO3: R.CaCO3 * R.dH.CaCO3 * 1000,
  MgO: n.MgO * R.dH.MgO * 1000, Fe: n.Fe2O3 * R.dH.Fe * 1000, Al: n.Al2O3 * R.dH.Al * 1000, CaF2: R.CaF2 * R.dH.CaF2 * 1000,
  SiF4: R.SiF4 * R.dH.SiF4 * 1000, H2SiF6: R.H2SiF6 * R.dH.H2SiF6 * 1000,
};
R.QrSum = Object.values(R.Qr).reduce((a, b) => a + b, 0);
R.T0 = 273.15; R.Tph = 298.15; R.TA = 338.15; R.Tch = 388.15; R.Tg = 368.15;
R.cph = 0.80; R.cpA = 2.20; R.cpS = 1.80; // kJ/(kg K)
R.Qph = 100 * R.cph * (R.Tph - R.T0);
R.QA = R.mAcidSol * R.cpA * (R.TA - R.T0);
R.mCO2 = R.CaCO3 * M.CO2; R.mSiF4 = R.SiF4 * M.SiF4;
R.loss = 0.05;
R.Qin = R.Qph + R.QA + R.QrSum;
R.rW = 2258 + 1.97 * (R.Tg - 373.15) + 4.19 * (373.15 - R.T0) - 4.19 * 0; // bug' entalpiyasi (273 K suvga nisbatan) ~ 2675
R.hV = 2501 + 1.89 * (R.Tg - R.T0); // kJ/kg, suv bug'i entalpiyasi
// sarf: superfosfat issiqligi + gazlar + bug' + yo'qotish; superfosfat massasi W ga bog'liq
R.solveW = () => {
  const mBase = 100 + R.mAcidSol - R.mCO2 - R.mSiF4; // W ni ayirishdan oldin
  // Qin*(1-loss) = (mBase - W)*cpS*(Tch-T0) + W*hV + gases
  const Qgas = (R.mCO2 * 0.92 + R.mSiF4 * 0.75) * (R.Tg - R.T0);
  const Wkg = (R.Qin * (1 - R.loss) - mBase * R.cpS * (R.Tch - R.T0) - Qgas) / (R.hV - R.cpS * (R.Tch - R.T0));
  return { mBase, Qgas, Wkg };
};
{ const s = R.solveW(); R.mBase = s.mBase; R.Qgas = s.Qgas; R.Wev = s.Wkg; }
R.Qsf = (R.mBase - R.Wev) * R.cpS * (R.Tch - R.T0);
R.Qvap = R.Wev * R.hV;
R.Qloss = R.Qin * R.loss;
R.Wfree = R.Win + R.Wform - R.Wcons - R.Wev / M.H2O; // kmol
// kamera superfosfati
R.mKSF = R.mBase - R.Wev;
// yetiltirish
R.n2c = (R.Kcur - R.Kch) * R.ap; // qo'shimcha parchalangan apatit (H3PO4 bilan)
R.SiF4c = (R.fGas2 - R.fGas1) * n.F / 4;
R.Wev2kg = 0.06 * R.mKSF; // omborda 6 % suv bug'lanadi (qabul)
R.mSF = R.mKSF - R.Wev2kg - R.SiF4c * M.SiF4;
R.yield = R.mSF / 100;
R.Gph = R.G / R.yield; // kg/soat fosforit
R.k = R.Gph / 100; // 100 kg -> soatlik
// tarkib jadvallari (kg/100 kg fosforit)
R.compKSF = {
  'Ca(H₂PO₄)₂·H₂O': R.MCP * M.MCP, 'H₃PO₄ (erkin)': R.H3PO4 * M.H3PO4, 'Ca₅(PO₄)₃F (parchalanmagan)': R.apRest * M.ap,
  'CaSO₄': (R.CaSO4_0 + 5 * R.n1 + R.CaOf + R.CaCO3 + R.CaF2) * M.CaSO4, 'MgSO₄': n.MgO * M.MgSO4, 'Fe₂(SO₄)₃': n.Fe2O3 * M.Fe2SO4,
  'Al₂(SO₄)₃': n.Al2O3 * M.Al2SO4, 'H₂SiF₆': R.H2SiF6 * M.H2SiF6, 'SiO₂ (qoldiq)': (n.SiO2 - R.SiO2used) * M.SiO2, 'H₂O (erkin)': R.Wfree * M.H2O,
};
const s1 = Object.values(R.compKSF).reduce((a, b) => a + b, 0);
R.compKSF['Boshqalar'] = R.mKSF - s1;
// yetiltirilgan
{
  const c = { ...R.compKSF };
  c['Ca(H₂PO₄)₂·H₂O'] += 5 * R.n2c * M.MCP; c['H₃PO₄ (erkin)'] -= 7 * R.n2c * M.H3PO4; c['Ca₅(PO₄)₃F (parchalanmagan)'] -= R.n2c * M.ap;
  // HF yetiltirishda: n2c, SiF4c bilan chiqadi; H2SiF6 ga qolgan qism
  const dHSF = (R.n2c - 4 * R.SiF4c) / 6; c['H₂SiF₆'] += dHSF * M.H2SiF6; c['SiO₂ (qoldiq)'] -= (R.SiF4c + dHSF) * M.SiO2;
  c['H₂O (erkin)'] += (-5 * R.n2c + 2 * R.SiF4c + 2 * dHSF) * M.H2O - R.Wev2kg;
  const s2 = Object.values(c).reduce((a, b) => a + b, 0) - c['Boshqalar'];
  c['Boshqalar'] = R.mSF - s2;
  R.compSF = c;
}
// P2O5 ko'rsatkichlari (kg/100 kg fosforit)
R.P2O5tot = R.comp.P2O5;
R.P2O5ws = (c => (c['Ca(H₂PO₄)₂·H₂O'] / M.MCP + c['H₃PO₄ (erkin)'] / M.H3PO4 / 2) * M.P2O5);
R.P2O5free = (c => c['H₃PO₄ (erkin)'] / M.H3PO4 / 2 * M.P2O5);
R.P2O5as = (c => R.P2O5tot - (c['Ca₅(PO₄)₃F (parchalanmagan)'] / M.ap * 1.5 * M.P2O5));

// --- Kamera hisobi
R.tau = 1.5 * 3600; R.rho = 1250;
R.Gin = (100 + R.mAcidSol) * R.k; R.Gout = R.mKSF * R.k; R.Gav = (R.Gin + R.Gout) / 2;
R.Vm = R.Gav / 3600 * R.tau / R.rho;
R.H = 0.7; R.d = 0.4; R.phi = 0.9;
R.Dcalc = Math.sqrt(R.Vm / (R.phi * 0.785 * R.H) + R.d ** 2);
R.D = Math.ceil(R.Dcalc * 10) / 10;
R.Vring = 0.785 * (R.D ** 2 - R.d ** 2) * R.H; R.Vw = R.phi * R.Vring;
R.tauR = R.Vw * R.rho / (R.Gav / 3600);
R.nrot = 1 / R.tauR; R.vlin = Math.PI * R.D * R.nrot;
// frezer
R.Vfr = R.Gout / 3600 / R.rho; R.zf = 2; R.nf = 0.20; R.rm = (R.D + R.d) / 4;
R.vr = 2 * Math.PI * R.rm * R.nrot; R.delta = R.vr / (R.nf * R.zf);
R.efr = 1.5e6; R.etaFr = 0.6; R.Nfr = R.Vfr * R.efr / R.etaFr;
// kamera aylantirish quvvati: massa og'irligi va ishqalanish
R.mMass = R.Vw * R.rho; R.mCh = 1800; R.fr = 0.1; R.rRoll = R.D / 2; // kg
R.Nrot = (R.mMass + R.mCh) * 9.81 * R.fr * 2 * Math.PI * R.rRoll * R.nrot / 0.5;
// issiqlik yo'qotish
R.Fch = Math.PI * (R.D + 0.1) * R.H + 2 * 0.785 * ((R.D + 0.1) ** 2 - R.d ** 2);
R.dTs = 30; R.alpha = 9.74 + 0.07 * R.dTs; R.QlossW = R.alpha * R.Fch * R.dTs;
// korpus
R.pH = R.rho * 9.81 * R.H; R.sig = 140e6; R.phiW = 0.8; R.c = 0.002;
R.sR = R.pH * R.D / (2 * R.sig * R.phiW) + R.c;
// gaz chiqarish
R.Vgas = (R.Wev / M.H2O + R.CaCO3 + R.SiF4) * R.k / 3600 * 8.314 * R.Tg / 101325 * 1000; // m3/s bug'-gaz
R.Vsuck = 15 * R.Vgas; // havo so'rilishi bilan (15 marta suyultirish)
R.dPipe = Math.sqrt(4 * R.Vsuck / (Math.PI * 10));
// aralashtirgich
R.tauMix = 5 * 60; R.rhoPulp = 1600; R.Vmix = R.Gin / 3600 * R.tauMix / R.rhoPulp; R.phiMix = 0.6;
R.VmixG = R.Vmix / R.phiMix;
// kislota suyultirgich: 93 % -> 68 %
R.w93 = 0.93; R.mA93 = R.mAcid / R.w93 * R.k; R.mWdil = (R.mAcidSol - R.mAcid / R.w93) * R.k;
// erish issiqligi: n(H2O/H2SO4) 93%: 0.41 ; 68%: 2.56 ; integral Q: 0.41 -> ~ -14 kJ/mol ; 2.56 -> ~ -46 kJ/mol
R.qDil = (46 - 14); // kJ/mol H2SO4
R.Qdil = R.nAcid * R.k * R.qDil * 1000 / 3600; // kW
R.TdilOut = 338.15;
// ftor absorbsiyasi
R.SiF4tot = (R.SiF4 + R.SiF4c) * R.k; // kmol/soat
R.H2SiF6abs = R.SiF4 * R.k * 2 / 3; // 3SiF4 + 2H2O -> 2H2SiF6 + SiO2 (faqat kamera gazidan)
R.etaF = 0.95;
// ombor
R.days = 15; R.rhoBulk = 1100; R.hPile = 3.0;
R.Vstore = R.Gday * R.days / R.rhoBulk; R.Astore = R.Vstore / (R.hPile * 0.6);
// sarf koeffitsiyentlari
R.specPh = R.Gph / R.G; R.specAcid = R.mAcid * R.k / R.G;
module.exports = R;
if (require.main === module) {
  for (const k of Object.keys(R)) { const v = R[k]; if (typeof v === 'function') continue; console.log(k, typeof v === 'object' ? JSON.stringify(v, (kk, vv) => typeof vv === 'number' ? +vv.toPrecision(5) : vv) : v); }
  console.log('P2O5ws ksf', R.P2O5ws(R.compKSF), 'sf', R.P2O5ws(R.compSF), 'free', R.P2O5free(R.compKSF), R.P2O5free(R.compSF));
}
