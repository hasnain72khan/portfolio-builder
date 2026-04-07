import { jsPDF } from 'jspdf';

// Market-standard resume colors (ATS-friendly, clean)
const C = {
  black:   [0, 0, 0],
  dark:    [34, 34, 34],
  text:    [68, 68, 68],
  muted:   [119, 119, 119],
  link:    [0, 102, 204],
  line:    [200, 200, 200],
  white:   [255, 255, 255],
};

const PW = 210, PH = 297;
const ML = 20, MR = 20, MT = 22, MB = 20;
const CW = PW - ML - MR;

export default function generateResumePDF({ about, skills, experience, education, services }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MT;

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) { doc.addPage(); y = MT; }
  };

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont('times', style);
    doc.setFontSize(size);
  };

  const divider = () => {
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.3);
    doc.line(ML, y, PW - MR, y);
    y += 5;
  };

  const sectionTitle = (title) => {
    checkPage(14);
    y += 2;
    setFont('bold', 12);
    doc.setTextColor(...C.black);
    doc.text(title.toUpperCase(), ML, y);
    y += 1.5;
    doc.setDrawColor(...C.black);
    doc.setLineWidth(0.5);
    doc.line(ML, y, PW - MR, y);
    y += 6;
  };

  // ─────────────────────────────────────────────────────────
  //  HEADER
  // ─────────────────────────────────────────────────────────
  // Name — large, centered
  setFont('bold', 22);
  doc.setTextColor(...C.black);
  doc.text((about?.name || 'Resume'), PW / 2, y, { align: 'center' });
  y += 7;

  // Title — centered
  if (about?.title) {
    setFont('normal', 12);
    doc.setTextColor(...C.muted);
    doc.text(about.title, PW / 2, y, { align: 'center' });
    y += 7;
  }

  // Contact line — centered
  const contactParts = [];
  if (about?.phone) contactParts.push(about.phone);
  if (about?.email) contactParts.push(about.email);
  if (about?.city && about?.country) contactParts.push(`${about.city}, ${about.country}`);

  if (contactParts.length) {
    setFont('normal', 9);
    doc.setTextColor(...C.text);
    doc.text(contactParts.join('   |   '), PW / 2, y, { align: 'center' });
    y += 5;
  }

  // LinkedIn & GitHub — centered, clickable
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
    setFont('normal', 9);
    const fullText = socialParts.map(s => s.label).join('   |   ');
    const totalW = doc.getTextWidth(fullText);
    let sx = (PW - totalW) / 2;

    socialParts.forEach((item, i) => {
      if (i > 0) {
        doc.setTextColor(...C.muted);
        const sep = '   |   ';
        doc.text(sep, sx, y);
        sx += doc.getTextWidth(sep);
      }
      doc.setTextColor(...C.link);
      const linkW = doc.getTextWidth(item.label);
      doc.textWithLink(item.label, sx, y, { url: item.url });
      // Underline the link
      doc.setDrawColor(...C.link);
      doc.setLineWidth(0.2);
      doc.line(sx, y + 0.8, sx + linkW, y + 0.8);
      sx += linkW;
    });
    y += 5;
  }

  y += 1;
  divider();

  // ─────────────────────────────────────────────────────────
  //  PROFILE
  // ─────────────────────────────────────────────────────────
  if (about?.bio) {
    sectionTitle('Professional Summary');
    setFont('normal', 10.5);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, CW);
    checkPage(lines.length * 4.8 + 4);
    doc.text(lines, ML, y);
    y += lines.length * 4.8 + 4;
  }

  // ─────────────────────────────────────────────────────────
  //  EXPERIENCE
  // ─────────────────────────────────────────────────────────
  if (experience?.length) {
    sectionTitle('Work Experience');
    experience.forEach((exp, idx) => {
      checkPage(22);

      // Row 1: Title (left) — Date (right)
      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, ML, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      // Row 2: Company + Location
      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, ML, y);
      y += 5.5;

      // Description
      if (exp.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, CW - 4);
        checkPage(dl.length * 4.3 + 4);
        // Add as bullet point
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('•', ML, y);
            doc.text(line, ML + 4, y);
          } else {
            doc.text(line, ML + 4, y);
          }
          y += 4.3;
        });
      }
      y += idx < experience.length - 1 ? 4 : 2;
    });
  }

  // ─────────────────────────────────────────────────────────
  //  EDUCATION
  // ─────────────────────────────────────────────────────────
  if (education?.length) {
    sectionTitle('Education');
    education.forEach((edu, idx) => {
      checkPage(18);

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, ML, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MR, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(edu.institution, ML, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, CW - 4);
        checkPage(dl.length * 4.3 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('•', ML, y);
            doc.text(line, ML + 4, y);
          } else {
            doc.text(line, ML + 4, y);
          }
          y += 4.3;
        });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // ─────────────────────────────────────────────────────────
  //  SKILLS — flat bullet list, no categories
  // ─────────────────────────────────────────────────────────
  if (skills?.length) {
    sectionTitle('Skills');

    // 3-column bullet layout
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
        doc.text(skills[idx].name, xBase + 4, y);
      }
      y += 5;
    }
    y += 2;
  }

  // ─────────────────────────────────────────────────────────
  //  SERVICES
  // ─────────────────────────────────────────────────────────
  if (services?.length) {
    sectionTitle('Services');
    services.forEach((s, idx) => {
      checkPage(14);

      setFont('bold', 10);
      doc.setTextColor(...C.dark);
      doc.text('•', ML, y);
      doc.text(s.title, ML + 4, y);
      y += 4.5;

      if (s.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(s.description, CW - 4);
        checkPage(dl.length * 4.3 + 4);
        doc.text(dl, ML + 4, y);
        y += dl.length * 4.3;
      }
      y += idx < services.length - 1 ? 3 : 1;
    });
  }

  // ─────────────────────────────────────────────────────────
  //  FOOTER — minimal, every page
  // ─────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont('normal', 7.5);
    doc.setTextColor(...C.muted);
    doc.text(`Page ${i} of ${pageCount}`, PW / 2, PH - 10, { align: 'center' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  doc.save(`${fileName}_resume.pdf`);
}
