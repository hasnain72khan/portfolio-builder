import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  black:  [0, 0, 0],
  dark:   [38, 38, 38],
  text:   [64, 64, 64],
  muted:  [128, 128, 128],
  link:   [64, 64, 64],
  line:   [210, 210, 210],
  white:  [255, 255, 255],
};

const PW = 210, PH = 297;
const ML = 28, MR = 28, MT = 32, MB = 24;
const CW = PW - ML - MR;

export default async function generateResumeMinimal({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc, about?.language);
  let y = MT;

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'helvetica', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); y = MT; }
  };

  const thinLine = () => {
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.15);
    doc.line(ML, y, PW - MR, y);
    y += 8;
  };

  const sectionTitle = (title) => {
    checkPage(18);
    y += 6;
    setFont('normal', 8);
    doc.setTextColor(...C.muted);
    doc.text(title.toUpperCase(), ML, y);
    y += 3;
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.15);
    doc.line(ML, y, PW - MR, y);
    y += 8;
  };

  // ── HEADER ──
  // Name — large, left-aligned, clean
  setFont('bold', 28);
  doc.setTextColor(...C.black);
  doc.text((about?.name || 'Resume'), ML, y);
  y += 10;

  // Title — light weight
  if (about?.title) {
    setFont('normal', 12);
    doc.setTextColor(...C.muted);
    doc.text(about.title, ML, y);
    y += 8;
  }

  // Contact — single line, minimal
  const contactParts = [];
  if (about?.email) contactParts.push(about.email);
  if (about?.phone) contactParts.push(about.phone);
  if (about?.city && about?.country) contactParts.push(`${about.city}, ${about.country}`);

  if (contactParts.length) {
    setFont('normal', 8.5);
    doc.setTextColor(...C.text);
    doc.text(contactParts.join('    /    '), ML, y);
    y += 5;
  }

  // Social links
  const socialParts = [];
  if (about?.linkedin) {
    const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
    const label = `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`;
    socialParts.push({ label, url });
  }
  if (about?.github) {
    const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
    const label = `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`;
    socialParts.push({ label, url });
  }

  if (socialParts.length) {
    setFont('normal', 8.5);
    let sx = ML;
    socialParts.forEach((item, i) => {
      if (i > 0) {
        doc.setTextColor(...C.muted);
        const sep = '    /    ';
        doc.text(sep, sx, y);
        sx += doc.getTextWidth(sep);
      }
      doc.setTextColor(...C.link);
      doc.textWithLink(item.label, sx, y, { url: item.url });
      sx += doc.getTextWidth(item.label);
    });
    y += 6;
  }

  y += 2;
  thinLine();

  // ── PROFILE ──
  if (about?.bio) {
    sectionTitle(labels.summary);
    setFont('normal', 10);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, CW);
    checkPage(lines.length * 4.8 + 4);
    doc.text(lines, ML, y);
    y += lines.length * 4.8 + 4;
  }

  // ── EXPERIENCE ──
  if (experience?.length) {
    sectionTitle(labels.experience);
    experience.forEach((exp, idx) => {
      checkPage(20);

      // Date on its own line, small
      setFont('normal', 8);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, ML, y);
      y += 4.5;

      // Title
      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, ML, y);
      y += 4.5;

      // Company
      setFont('normal', 9.5);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, ML, y);
      y += 5.5;

      // Description
      if (exp.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW);
        checkPage(dl.length * 4.3 + 4);
        doc.text(dl, ML, y);
        y += dl.length * 4.3;
      }

      if (idx < experience.length - 1) {
        y += 6;
      } else {
        y += 2;
      }
    });
  }

  // ── EDUCATION ──
  if (education?.length) {
    sectionTitle(labels.education);
    education.forEach((edu, idx) => {
      checkPage(18);

      setFont('normal', 8);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, ML, y);
      y += 4.5;

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, ML, y);
      y += 4.5;

      setFont('normal', 9.5);
      doc.setTextColor(...C.muted);
      doc.text(edu.institution, ML, y);
      y += 5.5;

      if (edu.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW);
        checkPage(dl.length * 4.3 + 4);
        doc.text(dl, ML, y);
        y += dl.length * 4.3;
      }

      y += idx < education.length - 1 ? 6 : 2;
    });
  }

  // ── SKILLS ──
  if (skills?.length) {
    sectionTitle(labels.skills);
    setFont('normal', 9.5);
    doc.setTextColor(...C.text);

    // Simple comma-separated list for ultra-minimal feel
    const skillNames = skills.map(s => s.name).join('  ·  ');
    const lines = doc.splitTextToSize(skillNames, CW);
    checkPage(lines.length * 4.5 + 4);
    doc.text(lines, ML, y);
    y += lines.length * 4.5 + 4;
  }

  // ── SERVICES ──
  if (services?.length) {
    sectionTitle(labels.services);
    services.forEach((s, idx) => {
      checkPage(14);

      setFont('bold', 9.5);
      doc.setTextColor(...C.dark);
      doc.text(s.title, ML, y);
      y += 4.5;

      if (s.description) {
        setFont('normal', 9.5);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW);
        checkPage(dl.length * 4.3 + 4);
        doc.text(dl, ML, y);
        y += dl.length * 4.3;
      }
      y += idx < services.length - 1 ? 5 : 1;
    });
  }

  // ── FOOTER ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont('normal', 7);
    doc.setTextColor(...C.muted);
    doc.text(`${i} / ${pageCount}`, PW / 2, PH - 12, { align: 'center' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MR);
  return { doc, fileName: `${fileName}_resume.pdf` };
}
