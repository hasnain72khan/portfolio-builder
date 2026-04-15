import { jsPDF } from 'jspdf';
import { getLabels } from './resumeI18n';
import { addPortfolioQR } from './resumeQR';
import { registerNotoSans, needsUnicodeFont } from './pdfFontLoader';

const C = {
  black:  [0, 0, 0],
  dark:   [34, 34, 34],
  text:   [51, 51, 51],
  muted:  [119, 119, 119],
  link:   [51, 51, 51],
  line:   [180, 180, 180],
  light:  [220, 220, 220],
  white:  [255, 255, 255],
};

const PW = 210, PH = 297;
const ML = 24, MR = 24, MT = 28, MB = 22;
const CW = PW - ML - MR;

export default async function generateResumeExecutive({ about, skills, experience, education, services, username }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const labels = getLabels(about?.language);
  const useNoto = needsUnicodeFont(about?.language);
  if (useNoto) await registerNotoSans(doc, about?.language);
  let y = MT;

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont(useNoto ? 'NotoSans' : 'times', style === 'italic' && useNoto ? 'normal' : style);
    doc.setFontSize(size);
  };

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); y = MT; }
  };

  const sectionTitle = (title) => {
    checkPage(16);
    y += 5;
    setFont('bold', 11);
    doc.setTextColor(...C.black);
    doc.text(title.toUpperCase(), PW / 2, y, { align: 'center' });
    y += 2.5;
    // Elegant thin double line
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.3);
    doc.line(ML + 20, y, PW - MR - 20, y);
    doc.setLineWidth(0.15);
    doc.line(ML + 20, y + 1, PW - MR - 20, y + 1);
    y += 7;
  };

  // ── HEADER ──
  // Top thin border
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.4);
  doc.line(ML, y - 6, PW - MR, y - 6);
  doc.setLineWidth(0.15);
  doc.line(ML, y - 5, PW - MR, y - 5);

  // Name — centered, large serif
  setFont('bold', 26);
  doc.setTextColor(...C.black);
  doc.text((about?.name || 'Resume').toUpperCase(), PW / 2, y + 2, { align: 'center' });
  y += 10;

  // Title
  if (about?.title) {
    setFont('italic', 12);
    doc.setTextColor(...C.muted);
    doc.text(about.title, PW / 2, y, { align: 'center' });
    y += 7;
  }

  // Bottom border under name
  doc.setDrawColor(...C.line);
  doc.setLineWidth(0.15);
  doc.line(ML, y, PW - MR, y);
  doc.setLineWidth(0.4);
  doc.line(ML, y + 1, PW - MR, y + 1);
  y += 5;

  // Contact — centered
  const contactParts = [];
  if (about?.phone) contactParts.push(about.phone);
  if (about?.email) contactParts.push(about.email);
  if (about?.city && about?.country) contactParts.push(`${about.city}, ${about.country}`);

  if (contactParts.length) {
    setFont('normal', 9);
    doc.setTextColor(...C.text);
    doc.text(contactParts.join('     |     '), PW / 2, y, { align: 'center' });
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
    let sx = (PW - socialParts.reduce((w, s, i) => w + doc.getTextWidth(s.label) + (i > 0 ? doc.getTextWidth('     |     ') : 0), 0)) / 2;
    socialParts.forEach((item, i) => {
      if (i > 0) {
        doc.setTextColor(...C.muted);
        const sep = '     |     ';
        doc.text(sep, sx, y);
        sx += doc.getTextWidth(sep);
      }
      doc.setTextColor(...C.link);
      doc.textWithLink(item.label, sx, y, { url: item.url });
      sx += doc.getTextWidth(item.label);
    });
    y += 5;
  }

  // ── PROFILE ──
  if (about?.bio) {
    sectionTitle(labels.summary);
    setFont('normal', 10.5);
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
      checkPage(22);

      setFont('bold', 10.5);
      doc.setTextColor(...C.black);
      doc.text(exp.title, ML, y);

      setFont('italic', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 5;

      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, ML, y);
      y += 5.5;

      if (exp.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW - 6);
        checkPage(dl.length * 4.5 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) { doc.text('•', ML + 2, y); doc.text(line, ML + 6, y); }
          else { doc.text(line, ML + 6, y); }
          y += 4.5;
        });
      }

      if (idx < experience.length - 1) {
        y += 2;
        doc.setDrawColor(...C.light);
        doc.setLineWidth(0.15);
        doc.line(ML + 10, y, PW - MR - 10, y);
        y += 4;
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

      setFont('bold', 10.5);
      doc.setTextColor(...C.black);
      doc.text(edu.degree, ML, y);

      setFont('italic', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 5;

      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(edu.institution, ML, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW - 6);
        checkPage(dl.length * 4.5 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) { doc.text('•', ML + 2, y); doc.text(line, ML + 6, y); }
          else { doc.text(line, ML + 6, y); }
          y += 4.5;
        });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // ── SKILLS ──
  if (skills?.length) {
    sectionTitle(labels.skills);

    // Elegant 3-column layout
    const colW = Math.floor(CW / 3);
    const rows = Math.ceil(skills.length / 3);

    for (let row = 0; row < rows; row++) {
      checkPage(6);
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        if (idx >= skills.length) break;
        const xBase = ML + col * colW;
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        doc.text('•', xBase, y);
        doc.text(skills[idx].name || '', xBase + 4, y);
      }
      y += 5.5;
    }
    y += 2;
  }

  // ── SERVICES ──
  if (services?.length) {
    sectionTitle(labels.services);
    services.forEach((s, idx) => {
      checkPage(14);
      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text('•', ML + 2, y);
      doc.text(s.title, ML + 6, y);
      y += 4.5;

      if (s.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW - 6);
        checkPage(dl.length * 4.5 + 4);
        doc.text(dl, ML + 6, y);
        y += dl.length * 4.5;
      }
      y += idx < services.length - 1 ? 3 : 1;
    });
  }

  // ── FOOTER ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont('normal', 7.5);
    doc.setTextColor(...C.muted);
    doc.text(`Page ${i} of ${pageCount}`, PW / 2, PH - 10, { align: 'center' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  await addPortfolioQR(doc, username, labels.scanPortfolio, PW, MR);
  return { doc, fileName: `${fileName}_resume.pdf` };
}
