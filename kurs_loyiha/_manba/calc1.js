// 1-loyiha: tabiiy gaz konversiyasi tsexi, CO konvertori hisobi. Unumdorlik 150 m3/soat tabiiy gaz.
const t = require('./thermo');
const { Vm, Qphys, sum, mass, solveT, Kshift, Kref, dH, cp, CP } = t;

const R = {};
R.V_ng = 150;
R.ng = { CH4: 96.0, C2H6: 2.0, C3H8: 0.5, C4H10: 0.2, CO2: 0.3, N2: 1.0 };
R.n_ng = R.V_ng / Vm;
const n0 = {}; for (const s in R.ng) n0[s] = R.n_ng * R.ng[s] / 100;
R.n0 = n0;
R.nC = n0.CH4 + 2 * n0.C2H6 + 3 * n0.C3H8 + 4 * n0.C4H10;
R.SC = 3.7;
R.n_steam = R.SC * R.nC;
R.T_mix = 773; R.T1 = 1073; R.P1 = 3.4e6; R.CH4dry1 = 10.0;

// og'ir uglevodorodlar to'liq konversiyasi
const hc = { CO: 2 * n0.C2H6 + 3 * n0.C3H8 + 4 * n0.C4H10, H2: 5 * n0.C2H6 + 7 * n0.C3H8 + 9 * n0.C4H10, H2O: 2 * n0.C2H6 + 3 * n0.C3H8 + 4 * n0.C4H10 };
R.hc = hc;

function reformOut(base, x, y) {
  return { CH4: base.CH4 - x, H2O: base.H2O - x - y, CO: base.CO + x - y, CO2: base.CO2 + y, H2: base.H2 + 3 * x + y, N2: base.N2, Ar: base.Ar || 0 };
}
function solveY(base, x, K) {
  return t.solveT(y => { const o = reformOut(base, x, y); return o.CO2 * o.H2 - K * o.CO * o.H2O; }, -(base.CO2) + 1e-9, Math.min(base.CO + x, base.H2O - x) - 1e-9);
}
function solveReform(base, CH4dry, K) {
  const x = solveT(x => { const y = solveY(base, x, K); const o = reformOut(base, x, y); return o.CH4 / sum(o, ['H2O']) * 100 - CH4dry; }, 0, base.CH4 - 1e-9);
  const y = solveY(base, x, K); return { x, y, out: reformOut(base, x, y) };
}
const base1 = { CH4: n0.CH4, H2O: R.n_steam - hc.H2O, CO: hc.CO, CO2: n0.CO2, H2: hc.H2, N2: n0.N2, Ar: 0 };
R.Kp1_shift = Kshift(R.T1);
const r1 = solveReform(base1, R.CH4dry1, R.Kp1_shift);
R.x1 = r1.x; R.y1 = r1.y; R.out1 = r1.out;
R.inl1 = { CH4: n0.CH4, C2H6: n0.C2H6, C3H8: n0.C3H8, C4H10: n0.C4H10, CO2: n0.CO2, N2: n0.N2, H2O: R.n_steam };
// metan muvozanatiga yaqinlashish
function pp(o, P) { const n = sum(o); const p = {}; for (const s in o) p[s] = o[s] / n * P / 101325; return p; }
{ const p = pp(R.out1, R.P1); R.Kact1 = p.CO * p.H2 ** 3 / (p.CH4 * p.H2O); R.Keq1 = Kref(R.T1); }
// muvozanat harorati (metan bo'yicha)
R.Teq1 = solveT(T => Kref(T) - R.Kact1, 800, 1300);

// --- Ikkilamchi konversiya (havo bilan)
R.T2 = 1253; R.P2 = 3.3e6; R.CH4dry2 = 0.40; R.ratio = 3.10;
R.air = { N2: 78.09, O2: 20.95, Ar: 0.96 };
function secondary(A) {
  const O2 = A * R.air.O2 / 100;
  const b = { ...R.out1 };
  b.N2 += A * R.air.N2 / 100; b.Ar = A * R.air.Ar / 100;
  b.H2 -= 2 * O2; b.H2O += 2 * O2;
  const r = solveReform(b, R.CH4dry2, Kshift(R.T2));
  return { O2, b, ...r };
}
R.A = solveT(A => { const s = secondary(A); return (s.out.H2 + s.out.CO) / s.out.N2 - R.ratio; }, 1, 40);
{ const s = secondary(R.A); R.O2 = s.O2; R.x2 = s.x; R.y2 = s.y; R.out2 = s.out; R.afterComb = s.b; }
R.airFlow = { N2: R.A * R.air.N2 / 100, O2: R.O2, Ar: R.A * R.air.Ar / 100 };
{ const p = pp(R.out2, R.P2); R.Kact2 = p.CO * p.H2 ** 3 / (p.CH4 * p.H2O); R.Keq2 = Kref(R.T2); R.Teq2 = solveT(T => Kref(T) - R.Kact2, 900, 1500); }
// ikkilamchi konvertor issiqlik balansi: havo harorati
R.lossSec = 0.01;
R.Hin_gas2 = Qphys(R.out1, R.T1);
R.Hout2 = Qphys(R.out2, R.T2);
R.Qr2 = {
  comb: R.O2 * 2 * 241.81 / 3.6,         // H2 yonishi, kW (ekzo)
  ref: R.x2 * 206.14 / 3.6,              // endo
  shift: R.y2 * 41.16 / 3.6,             // ekzo (y2 musbat bo'lsa)
};
// Hin_gas + Hair + comb + shift = Hout + ref + loss
R.T_air = solveT(T => { const Hair = Qphys(R.airFlow, T); const qin = R.Hin_gas2 + Hair + R.Qr2.comb + R.Qr2.shift; return qin * (1 - R.lossSec) - R.Hout2 - R.Qr2.ref; }, 300, 1500);
R.Hair = Qphys(R.airFlow, R.T_air);

// --- Birlamchi konvertor issiqlik yuki
R.Hin1 = Qphys(R.inl1, R.T_mix);
R.Hout1 = Qphys(R.out1, R.T1);
R.Qr1 = { ref: R.x1 * 206.14 / 3.6, shift: R.y1 * 41.16 / 3.6, hc: (n0.C2H6 * 347.23 + n0.C3H8 * 497.69 + n0.C4H10 * 651.27) / 3.6 };
R.Q1 = R.Hout1 + R.Qr1.ref + R.Qr1.hc - R.Qr1.shift - R.Hin1;
R.LHV = (0.96 * 802.3 + 0.02 * 1428.6 + 0.005 * 2043.1 + 0.002 * 2657.3) * 1000 / Vm / 1000; // MJ/m3 (kJ/mol -> MJ/m3)
R.eta_rad = 0.55;
R.V_fuel = R.Q1 / 1000 / (R.eta_rad * R.LHV) * 3600; // m3/soat

// --- Utilizator qozon
R.T_HTin = 643; R.P_HT = 3.15e6;
R.Q_whb = Qphys(R.out2, R.T2) - Qphys(R.out2, R.T_HTin);
R.eta_whb = 0.97; R.h_fw = 440.2; R.h_st = 2800.8; // 4 MPa to'yingan bug', 378 K ta'minot suvi
R.G_steam = R.Q_whb * R.eta_whb / (R.h_st - R.h_fw) * 3600; // kg/soat

// --- CO konversiyasi
function shiftOut(inl, y) { return { ...inl, CO: inl.CO - y, H2O: inl.H2O - y, CO2: inl.CO2 + y, H2: inl.H2 + y }; }
function shiftStage(inl, Tin, COdry, loss) {
  const dry = sum(inl, ['H2O']);
  const c = COdry / 100; const y = (inl.CO - c * dry) / (1 + c); // har 1 mol CO konversiyasida quruq gaz 1 molga ortadi
  const out = shiftOut(inl, y);
  const Qin = Qphys(inl, Tin); const Qr = y * 41.16 / 3.6;
  const Tout = solveT(T => (Qin + Qr) * (1 - loss) - Qphys(out, T), Tin - 50, Tin + 300);
  const Kact = out.CO2 * out.H2 / (out.CO * out.H2O);
  const Keq = Kshift(Tout);
  const Teq = solveT(T => Kshift(T) - Kact, 400, 1200);
  // muvozanat tarkibi chiqish haroratida
  const yeq = solveT(z => { const o = shiftOut(inl, z); return o.CO2 * o.H2 - Keq * o.CO * o.H2O; }, 0, inl.CO - 1e-9);
  const COeq = (inl.CO - yeq) / (dry + yeq) * 100;
  return { inl, out, y, Tin, Tout, Qin, Qr, Qloss: (Qin + Qr) * loss, Qout: Qphys(out, Tout), Kact, Keq, Teq, yeq, COeq, conv: y / inl.CO, conveq: yeq / inl.CO, dry, dryOut: dry + y };
}
R.lossHT = 0.013; R.lossLT = 0.01;
R.HT = shiftStage(R.out2, R.T_HTin, 3.2, R.lossHT);
R.T_LTin = 478; R.P_LT = 3.0e6;
R.Q_cool = Qphys(R.HT.out, R.HT.Tout) - Qphys(R.HT.out, R.T_LTin);
R.LT = shiftStage(R.HT.out, R.T_LTin, 0.35, R.lossLT);
// shudring nuqtasi (LT kirish)
{ const pH2O = R.HT.out.H2O / sum(R.HT.out) * R.P_LT; R.pH2O_LT = pH2O; }

// --- Konvertor (o'rta haroratli, YuH) apparat hisobi
function reactor(stage, P, SV, kz, extra) {
  const r = {};
  r.Vdry = stage.dry * Vm; // m3/soat (n.sh.)
  r.Vwet = sum(stage.inl) * Vm;
  r.SV = SV; r.kz = kz;
  r.Vcat0 = r.Vdry / SV; r.Vcat = r.Vcat0 * kz;
  r.tau = 3600 / SV; // s (n.sh.)
  const Tm = (stage.Tin + stage.Tout) / 2; r.Tm = Tm;
  r.Vact = r.Vwet * (101325 / P) * (Tm / 273.15) / 3600; // m3/s
  r.tau_act = r.Vcat * (extra.eps) / r.Vact; // s, erkin hajmda
  r.HD = extra.HD;
  r.Dcalc = Math.cbrt(4 * r.Vcat / (Math.PI * r.HD));
  r.D = extra.Dstd; r.S = Math.PI * r.D ** 2 / 4;
  r.Hcat = r.Vcat / r.S;
  r.w = r.Vact / r.S; // fiktiv tezlik, m/s
  // gaz xossalari
  const n = sum(stage.inl); const M = mass(stage.inl) / n; r.M = M;
  r.rho = P * M / 1000 / (8.314 * Tm);
  r.mu = extra.mu; r.dp = extra.dp; r.eps = extra.eps; r.phi = 1;
  // Ergun
  r.dPdL = 150 * (1 - r.eps) ** 2 / r.eps ** 3 * r.mu * r.w / r.dp ** 2 + 1.75 * (1 - r.eps) / r.eps ** 3 * r.rho * r.w ** 2 / r.dp;
  r.dP = r.dPdL * r.Hcat;
  r.Re = r.rho * r.w * r.dp / r.mu;
  r.mcat = r.Vcat * extra.rhoCat;
  return r;
}
R.HTr = reactor(R.HT, R.P_HT, 3000, 1.25, { HD: 1.5, Dstd: 0.6, mu: 2.6e-5, dp: 0.009, eps: 0.40, rhoCat: 1300 });
R.LTr = reactor(R.LT, R.P_LT, 2200, 1.30, { HD: 1.5, Dstd: 0.7, mu: 1.9e-5, dp: 0.005, eps: 0.38, rhoCat: 1200 });

// devor qalinligi
function wall(P, D, sigma, phi, c) { const Pr = 1.1 * P / 1e6; const s = Pr * D * 1000 / (2 * phi * sigma - Pr); return { Pr, sR: s, s: Math.ceil(s + c), c }; }
R.HTw = wall(R.P_HT, R.HTr.D, 120, 0.9, 2);
R.LTw = wall(R.P_LT, R.LTr.D, 130, 0.9, 2);
// tubliklar (elliptik): s = P*D/(2*phi*sigma - 0.5P)
R.HTbottom = (() => { const Pr = 1.1 * R.P_HT / 1e6; return Pr * R.HTr.D * 1000 / (2 * 0.9 * 120 - 0.5 * Pr); })();
// shtutserlar
function nozzle(Vs, w) { const d = Math.sqrt(4 * Vs / (Math.PI * w)); return d; }
R.HTnoz = { Vin: sum(R.HT.inl) * Vm * (101325 / R.P_HT) * (R.HT.Tin / 273.15) / 3600, Vout: sum(R.HT.out) * Vm * (101325 / (R.P_HT - 0.05e6)) * (R.HT.Tout / 273.15) / 3600, w: 20 };
R.HTnoz.din = nozzle(R.HTnoz.Vin, 20); R.HTnoz.dout = nozzle(R.HTnoz.Vout, 20);
// izolyatsiya
R.ins = (() => { const lam = 0.07, Tw = R.HT.Tout, Ts = 318, Ta = 293, alpha = 9.74 + 0.07 * (Ts - Ta); const q = alpha * (Ts - Ta); const d = lam * (Tw - Ts) / q; return { lam, Tw, Ts, Ta, alpha, q, d }; })();
// issiqlik yo'qotish tekshiruvi (izolyatsiya sirtidan)
R.ins.F = Math.PI * (R.HTr.D + 2 * R.HTw.s / 1000 + 2 * 0.1) * (R.HTr.Hcat + 2.0) + 2 * Math.PI * (R.HTr.D / 2 + 0.1) ** 2;
R.ins.Qloss = R.ins.alpha * (R.ins.Ts - R.ins.Ta) * R.ins.F / 1000; // kW

// apparat umumiy balandligi
R.HTr.Htot = R.HTr.Hcat + 0.25 /*inert shar qatlami*/ + 0.3 /*kollosnik*/ + 0.6 /*yuqori bo'shliq*/ + 2 * 0.25 * R.HTr.D + 0.4;
module.exports = R;

if (require.main === module) {
  const f = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? +v.toPrecision(5) : v]));
  for (const k of Object.keys(R)) { const v = R[k]; console.log(k, typeof v === 'object' ? JSON.stringify(f(v)) : v); }
}
