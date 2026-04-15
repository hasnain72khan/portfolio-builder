import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  black: [0,0,0], dark: [34,34,34], text: [68,68,68],
  muted: [119,119,119], link: [0,102,204], line: [200,200,200], white: [255,255,255],
};
const PW = 210, PH = 297, ML = 20, MR = 20, MT = 22, MB = 20;
const CW = PW - ML - MR;

export default async function generateResumePDF({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc);
  let y = MT;

  const checkPage = (need = 14) => { if (y + need > PH - MB) { doc.addPage(); y = MT; } };
  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'times', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };
  const divider = () => { doc.setDrawColor(...C.line); doc.setLineWidth(0.3); doc.line(ML, y, PW - MR, y); y += 5; };
  const sectionTitle = (title) => {
    checkPage(14); y += 2; setFont('bold', 12); doc.setTextColor(...C.black);
    doc.text(title.toUpperCase(), ML, y); y += 1.5;
    doc.setDrawColor(...C.black); doc.setLineWidth(0.5); doc.line(ML, y, PW - MR, y); y += 6;
  };

  // ── HEADER ──
  setFont('bold', 22); doc.setTextColor(...C.black);
  doc.text(about?.name || 'Resume', PW / 2, y, { align: 'center' }); y += 7;

  if (about?.title) {
    setFont('normal', 12); doc.setTextColor(...C.muted);
    const tl = doc.splitTextToSize(about.title, CW);
    tl.forEach(l => { doc.text(l, PW / 2, y, { align: 'center' }); y += 5; }); y += 2;
  }

  const cp = [];
  if (about?.phone) cp.push(about.phone);
  if (about?.email) cp.push(about.email);
  if (about?.city && about?.country) cp.push(`${about.city}, ${about.country}`);
  if (cp.length) { setFont('normal', 9); doc.setTextColor(...C.text); doc.text(cp.join('   |   '), PW / 2, y, { align: 'center' }); y += 5; }

  const sp = [];
  if (about?.linkedin) {
    const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
    sp.push({ label: `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`, url });
  }
  if (about?.github) {
    const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
    sp.push({ label: `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`, url });
  }
  if (sp.length) {
    setFont('normal', 9);
    const full = sp.map(s => s.label).join('   |   ');
    let sx = (PW - doc.getTextWidth(full)) / 2;
    sp.forEach((item, i) => {
      if (i > 0) { doc.setTextColor(...C.muted); const sep = '   |   '; doc.text(sep, sx, y); sx += doc.getTextWidth(sep); }
      doc.setTextColor(...C.link); const lw = doc.getTextWidth(item.label);
      doc.textWithLink(item.label, sx, y, { url: item.url });
      doc.setDrawColor(...C.link); doc.setLineWidth(0.2); doc.line(sx, y + 0.8, sx + lw, y + 0.8); sx += lw;
    }); y += 5;
  }
  y += 1; divider();

  // ── PROFILE ──
  if (about?.bio) {
    sectionTitle(labels.summary); setFont('normal', 10.5); doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, CW);
    checkPage(lines.length * 4.8 + 4); doc.text(lines, ML, y); y += lines.length * 4.8 + 4;
  }

  // ── EXPERIENCE ──
  if (experience?.length) {
    sectionTitle(labels.experience);
    experience.forEach((exp, idx) => {
      checkPage(22);
      const ds = `${exp.startDate} – ${exp.endDate || 'Present'}`;
      setFont('normal', 9); doc.setTextColor(...C.muted);
      const dw = doc.getTextWidth(ds) + 4;
      doc.text(ds, PW - MR, y, { align: 'right' });
      setFont('bold', 10.5); doc.setTextColor(...C.dark);
      const tl = doc.splitTextToSize(exp.title || '', CW - dw);
      doc.text(tl[0] || '', ML, y);
      if (tl.length > 1) { y += 4.5; doc.text(tl.slice(1).join(' '), ML, y); }
      y += 4.5;
      setFont('italic', 10); doc.setTextColor(...C.text);
      doc.text(`${exp.company || ''}${exp.location ? ', ' + exp.location : ''}`, ML, y); y += 5.5;
      if (exp.description) {
        setFont('normal', 10); doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW - 4);
        checkPage(dl.length * 4.3 + 4);
        dl.forEach((line, li) => { checkPage(5); doc.text(li === 0 ? '•' : '', ML, y); doc.text(line, ML + 4, y); y += 4.3; });
      }
      y += idx < experience.length - 1 ? 4 : 2;
    });
  }

  // ── EDUCATION ──
  if (education?.length) {
    sectionTitle(labels.education);
    education.forEach((edu, idx) => {
      checkPage(18);
      const ds = `${edu.startDate} – ${edu.endDate || 'Present'}`;
      setFont('normal', 9); doc.setTextColor(...C.muted);
      const dw = doc.getTextWidth(ds) + 4;
      doc.text(ds, PW - MR, y, { align: 'right' });
      setFont('bold', 10.5); doc.setTextColor(...C.dark);
      const dl2 = doc.splitTextToSize(edu.degree || '', CW - dw);
      doc.text(dl2[0] || '', ML, y);
      if (dl2.length > 1) { y += 4.5; doc.text(dl2.slice(1).join(' '), ML, y); }
      y += 4.5;
      setFont('italic', 10); doc.setTextColor(...C.text);
      doc.text(edu.institution || '', ML, y); y += 5;
      if (edu.description) {
        setFont('normal', 10); doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW - 4);
        checkPage(dl.length * 4.3 + 4);
        dl.forEach((line, li) => { checkPage(5); doc.text(li === 0 ? '•' : '', ML, y); doc.text(line, ML + 4, y); y += 4.3; });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // ── SKILLS ──
  if (skills?.length) {
    sectionTitle(labels.skills);
    const colW = Math.floor(CW / 3);
    const rows = Math.ceil(skills.length / 3);
    for (let row = 0; row < rows; row++) {
      checkPage(6);
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        if (idx >= skills.length) break;
        setFont('normal', 10); doc.setTextColor(...C.text);
        doc.text('•', ML + col * colW, y); doc.text(skills[idx].name || '', ML + col * colW + 4, y);
      }
      y += 5;
    }
    y += 2;
  }

  // ── SERVICES ──
  if (services?.length) {
    sectionTitle(labels.services);
    services.forEach((s, idx) => {
      checkPage(14);
      setFont('bold', 10); doc.setTextColor(...C.dark);
      const stl = doc.splitTextToSize(s.title || '', CW - 4);
      doc.text('•', ML, y); doc.text(stl[0] || '', ML + 4, y); y += 4.5;
      if (s.description) {
        setFont('normal', 10); doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW - 4);
        checkPage(dl.length * 4.3 + 4); doc.text(dl, ML + 4, y); y += dl.length * 4.3;
      }
      y += idx < services.length - 1 ? 3 : 1;
    });
  }

  // ── FOOTER ──
  const pc = doc.getNumberOfPages();
  for (let i = 1; i <= pc; i++) { doc.setPage(i); setFont('normal', 7.5); doc.setTextColor(...C.muted); doc.text(`Page ${i} of ${pc}`, PW / 2, PH - 10, { align: 'center' }); }

  const fn = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MR);
  return { doc, fileName: `${fn}_resume.pdf` };
}
