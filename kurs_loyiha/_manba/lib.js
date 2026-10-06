// Kurs loyihasi uchun docx yordamchi funksiyalari (TNR 14, 1,5 interval, GOST chegaralari)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel,
  BorderStyle, ShadingType, Footer, PageNumber, TabStopType, LevelFormat, ImageRun, PageBreak, VerticalAlign,
  PositionalTab, PositionalTabAlignment, PositionalTabLeader, PositionalTabRelativeTo } = D;

const FONT = 'Times New Roman';
const TW = 11906 - 1701 - 850; // matn kengligi, DXA

// ---- son formatlash: o'nli vergul, minglik bo'sh joy
function f(x, d = 2) {
  if (x === undefined || x === null || isNaN(x)) return '–';
  let s = Math.abs(x).toFixed(d);
  let [i, fr] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (x < 0 && +s !== 0 ? '–' : '') + i + (fr ? ',' + fr : '');
}
// ilmiy ko'rinish: 1,23·10⁻⁵
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function e(x, d = 2) {
  const p = Math.floor(Math.log10(Math.abs(x)));
  const m = x / Math.pow(10, p);
  return f(m, d) + '·10' + String(p).split('').map(c => SUP[c]).join('');
}

// ---- belgilash: **qalin**, _{indeks}, ^{daraja}, //kursiv//
function runs(text, o = {}) {
  const out = [];
  let bold = !!o.bold, ital = !!o.italics;
  const parts = String(text).split(/(\*\*|\/\/|_\{[^}]*\}|\^\{[^}]*\})/);
  for (const p of parts) {
    if (!p) continue;
    if (p === '**') { bold = !bold; continue; }
    if (p === '//') { ital = !ital; continue; }
    const base = { font: FONT, size: o.size || 28, bold, italics: ital };
    if (p.startsWith('_{')) out.push(new TextRun({ ...base, text: p.slice(2, -1), subScript: true }));
    else if (p.startsWith('^{')) out.push(new TextRun({ ...base, text: p.slice(2, -1), superScript: true }));
    else out.push(new TextRun({ ...base, text: p }));
  }
  return out;
}

const SP = { line: 360, before: 0, after: 0 };
const P = (text, o = {}) => new Paragraph({
  alignment: o.align || AlignmentType.JUSTIFIED, spacing: { ...SP, ...(o.spacing || {}) },
  indent: o.noIndent ? undefined : { firstLine: 709 }, keepNext: o.keepNext, children: runs(text, o),
});
const H1 = (text, o = {}) => new Paragraph({
  heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, pageBreakBefore: !!o.pageBreak,
  spacing: { line: 360, before: o.pageBreak ? 0 : 360, after: 240 }, keepNext: true, children: runs(text.toUpperCase(), { bold: true }),
});
const H2 = text => new Paragraph({
  heading: HeadingLevel.HEADING_2, alignment: AlignmentType.LEFT, indent: { firstLine: 709 },
  spacing: { line: 360, before: 180, after: 120 }, keepNext: true, children: runs(text, { bold: true }),
});
// formula: markazda, raqami o'ng chetda
const F = (text, num) => new Paragraph({
  spacing: { line: 360, before: 60, after: 60 },
  tabStops: [{ type: TabStopType.CENTER, position: Math.round(TW / 2) }, { type: TabStopType.RIGHT, position: TW }],
  children: [new TextRun({ text: '\t', font: FONT, size: 28 }), ...runs(text), new TextRun({ text: num ? '\t(' + num + ')' : '', font: FONT, size: 28 })],
});
// ro'yxat (tire bilan)
const L = items => items.map(it => new Paragraph({
  numbering: { reference: 'dash', level: 0 }, alignment: AlignmentType.JUSTIFIED, spacing: SP, children: runs(it),
}));

const border = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(text, w, o = {}) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    columnSpan: o.span, shading: o.head ? { fill: 'F2F2F2', type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 30, bottom: 30, left: 70, right: 70 },
    children: [new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, spacing: { line: 240 }, keepNext: !!o.keep, children: runs(text, { size: 24, bold: o.head || o.bold }) })],
  });
}
// jadval: no – raqami, title – nomi, head – sarlavhalar, rows – qatorlar, w – ustun nisbatlari
function T(no, title, head, rows, w) {
  const tot = w.reduce((a, b) => a + b, 0);
  const cw = w.map(x => Math.floor(x / tot * TW));
  cw[cw.length - 1] += TW - cw.reduce((a, b) => a + b, 0);
  const keepAll = rows.length <= 9;
  const tr = [new TableRow({ tableHeader: true, children: head.map((h, i) => cell(h, cw[i], { head: true, keep: keepAll })) })];
  rows.forEach((r, ri) => {
    const bold = r._bold; const cells = r._bold ? r.slice() : r;
    const keep = keepAll && ri < rows.length - 1;
    tr.push(new TableRow({ cantSplit: true, children: cells.map((c, i) => cell(c, cw[i], { left: i === 0, bold, keep })) }));
  });
  return [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { line: 360, before: 120 }, keepNext: true, children: runs(no + '-jadval', { italics: true }) }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 300, after: 60 }, keepNext: true, children: runs(title, { bold: true }) }),
    new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: cw, rows: tr }),
    new Paragraph({ spacing: { line: 240, after: 60 }, children: [] }),
  ];
}
const B = r => { r._bold = true; return r; }; // qalin qator

function IMG(file, wPx, hPx, caption, legend) {
  const out = [new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true,
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: wPx, height: hPx }, altText: { title: caption, description: caption, name: path.basename(file) } })],
  })];
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 300, after: 60 }, keepNext: !!legend, children: runs(caption, { bold: true }) }));
  if (legend) out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 300, after: 120 }, children: runs(legend, { size: 24 }) }));
  return out;
}

function titlePage(t) {
  const c = (text, o = {}) => new Paragraph({ alignment: o.align || AlignmentType.CENTER, spacing: { line: 360, before: o.before || 0, after: o.after || 0 }, indent: o.indent, children: runs(text, o) });
  return [
    c('O‘ZBEKISTON RESPUBLIKASI', { bold: true }),
    c('OLIY TA’LIM, FAN VA INNOVATSIYALAR VAZIRLIGI', { bold: true }),
    c('________________________________ INSTITUTI', { bold: true, before: 240 }),
    c('“Noorganik moddalar kimyoviy texnologiyasi” kafedrasi', { before: 240 }),
    c('KURS LOYIHASI', { bold: true, size: 36, before: 1800, after: 240 }),
    c('Fan: “Noorganik moddalar kimyoviy texnologiyasi jihozlari va loyihalash asoslari”'),
    c('Mavzu: “' + t.mavzu + '”', { bold: true, before: 360 }),
    c(t.unum, { bold: true }),
    c('Bajardi: ______ guruh talabasi', { align: AlignmentType.LEFT, indent: { left: 5000 }, before: 1500 }),
    c('______________________________', { align: AlignmentType.LEFT, indent: { left: 5000 } }),
    c('Qabul qildi: _________________', { align: AlignmentType.LEFT, indent: { left: 5000 } }),
    c('______________________________', { align: AlignmentType.LEFT, indent: { left: 5000 } }),
    c('Baho: _______  Imzo: _________', { align: AlignmentType.LEFT, indent: { left: 5000 } }),
    c('______________ – 2026', { bold: true, before: 1800 }),
  ];
}

function toc(entries, pages) {
  const out = [new Paragraph({ alignment: AlignmentType.CENTER, pageBreakBefore: true, spacing: { line: 360, after: 240 }, children: runs('MUNDARIJA', { bold: true }) })];
  for (const en of entries) {
    out.push(new Paragraph({
      spacing: { line: 360 }, tabStops: [{ type: TabStopType.RIGHT, position: TW, leader: 'dot' }],
      children: [...runs(en), new TextRun({ font: FONT, size: 28, text: '\t' + String(pages[en] || '00') })],
    }));
  }
  return out;
}

function makeDoc(children) {
  return new Document({
    creator: 'Talaba', title: 'Kurs loyihasi',
    styles: {
      default: { document: { run: { font: FONT, size: 28 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 28, bold: true, color: '000000' }, paragraph: { outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 28, bold: true, color: '000000' }, paragraph: { outlineLevel: 1 } },
      ],
    },
    numbering: { config: [{ reference: 'dash', levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 993, hanging: 284 } } } }] }] },
    sections: [{
      properties: { titlePage: true, page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 850, bottom: 1134, left: 1701 } } },
      footers: {
        first: new Footer({ children: [new Paragraph({ children: [] })] }),
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ font: FONT, size: 24, children: [PageNumber.CURRENT] })] })] }),
      },
      children,
    }],
  });
}

// Ikki bosqichli yig'ish: 1) PDF ga aylantirib sarlavhalar sahifasini topish, 2) mundarijani to'ldirish
async function build(out, info, entries, bodyFn, tmpDir) {
  let pages = {};
  for (let pass = 0; pass < 2; pass++) {
    const children = [...titlePage(info), ...toc(entries, pages), ...bodyFn()];
    const buf = await Packer.toBuffer(makeDoc(children));
    fs.writeFileSync(out, buf);
    execSync(`soffice --headless --convert-to pdf --outdir "${tmpDir}" "${out}"`, { stdio: 'ignore' });
    const pdf = path.join(tmpDir, path.basename(out).replace(/\.docx$/, '.pdf'));
    const n = +execSync(`pdfinfo "${pdf}"`).toString().match(/Pages:\s+(\d+)/)[1];
    const np = {};
    for (let p = 3; p <= n; p++) {
      const txt = execSync(`pdftotext -f ${p} -l ${p} -layout "${pdf}" -`).toString().replace(/\s+/g, ' ').toUpperCase();
      for (const en of entries) {
        const key = en.replace(/\*\*|_\{|\^\{|\}/g, '').toUpperCase();
        if (!np[en] && txt.includes(key)) np[en] = p;
      }
    }
    pages = np;
    console.log('pass', pass, 'pages', n, JSON.stringify(np));
  }
}

module.exports = { f, e, runs, P, H1, H2, F, L, T, B, IMG, build, TW, AlignmentType };
