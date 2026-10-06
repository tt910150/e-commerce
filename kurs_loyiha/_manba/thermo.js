// Termodinamik ma'lumotlar va yordamchi funksiyalar (SI: J, mol, K, Pa)
const T0 = 298.15;
const Vm = 22.414; // m3/kmol (n.sh.)
const R = 8.314;

// cp = a + b*T + c*T^2 + d/T^2, J/(mol*K)
const CP = {
  CH4:   { a: 14.32, b: 74.66e-3, c: -17.43e-6, d: 0, Hf: -74.85, M: 16.043 },
  C2H6:  { a: 5.75, b: 175.11e-3, c: -57.85e-6, d: 0, Hf: -84.67, M: 30.069 },
  C3H8:  { a: 1.72, b: 270.75e-3, c: -94.48e-6, d: 0, Hf: -103.85, M: 44.096 },
  C4H10: { a: 18.23, b: 303.56e-3, c: -92.65e-6, d: 0, Hf: -126.15, M: 58.123 },
  H2O:   { a: 30.00, b: 10.71e-3, c: 0, d: 0.33e5, Hf: -241.81, M: 18.015 },
  CO:    { a: 28.41, b: 4.10e-3, c: 0, d: -0.46e5, Hf: -110.53, M: 28.010 },
  CO2:   { a: 44.14, b: 9.04e-3, c: 0, d: -8.54e5, Hf: -393.51, M: 44.010 },
  H2:    { a: 27.28, b: 3.26e-3, c: 0, d: 0.50e5, Hf: 0, M: 2.016 },
  N2:    { a: 27.88, b: 4.27e-3, c: 0, d: 0, Hf: 0, M: 28.013 },
  O2:    { a: 31.46, b: 3.39e-3, c: 0, d: -3.77e5, Hf: 0, M: 31.999 },
  Ar:    { a: 20.79, b: 0, c: 0, d: 0, Hf: 0, M: 39.948 },
};

function cp(s, T) { const k = CP[s]; return k.a + k.b * T + k.c * T * T + k.d / (T * T); }
// J/mol, 298.15 K ga nisbatan
function dH(s, T) {
  const k = CP[s];
  return k.a * (T - T0) + k.b / 2 * (T * T - T0 * T0) + k.c / 3 * (T ** 3 - T0 ** 3) - k.d * (1 / T - 1 / T0);
}
// oqim: {s: kmol/soat}; natija kW (fizik issiqlik)
function Qphys(flow, T) { let q = 0; for (const s in flow) q += flow[s] * dH(s, T); return q / 3600; }
function sum(flow, skip = []) { let t = 0; for (const s in flow) if (!skip.includes(s)) t += flow[s]; return t; }
function mass(flow) { let m = 0; for (const s in flow) m += flow[s] * CP[s].M; return m; }
function solveT(f, lo, hi) { // f monoton, f(T)=0
  let flo = f(lo);
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; }
  return (lo + hi) / 2;
}
// CO + H2O = CO2 + H2 (Moe)
const Kshift = T => Math.exp(4577.8 / T - 4.33);
// CH4 + H2O = CO + 3H2, atm^2 (Moe)
const Kref = T => Math.exp(30.114 - 26830 / T);

module.exports = { T0, Vm, R, CP, cp, dH, Qphys, sum, mass, solveT, Kshift, Kref };
