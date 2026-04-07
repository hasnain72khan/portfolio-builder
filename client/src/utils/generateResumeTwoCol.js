import { jsPDF } from 'jspdf';

const C = {
  black:   [0, 0, 0],
  dark:    [34, 34, 34],
  text:    [68, 68, 68],
  muted:   [119, 119, 119],
  link:    [0, 102, 204],
  line:    [200, 200, 200],
  white:   [255, 255, 255],
  sidebar: [38, 40, 48],
  sideText:[210, 210, 220],
  sideMuted:[160, 160, 175],
  accent:  [124, 58, 237],
};

const PW = 210, PH = 297;
const SIDE_W = 68;
const MAIN_L = SIDE_W + 8, MAIN_R = 12;
const MAIN_W = PW - MAIN_L - MAIN_R;
const SL = 8, SR = 8;
const SW = SIDE_W - SL - SR;
const MT = 18, MB = 16;

export default function generateResumeTwoCol({ about, skills, experience, education, services }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont('times', style);
    doc.setFontSize(size);
  };

  // Draw sidebar background on every page
  const drawSidebarBg = () => {
    doc.setFillColor(...C.sidebar);
    doc.rect(0, 0, SIDE_W, PH, 'F');
  };

  drawSidebarBg();

  // ══════════════════════════════════════════════════════════
  //  SIDEBAR
  // ══════════════════════════════════════════════════════════
  let sy = MT + 5;

  // Avatar circle with initials
  const initials = (about?.name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  doc.setFillColor(...C.accent);
  doc.circle(SIDE_W / 2, sy + 12, 14, 'F');
  setFont('bold', 18);
  doc.setTextColor(...C.white);
  doc.text(initials, SIDE_W / 2, sy + 16, { align: 'center' });
  sy += 32;

  // Name
  setFont('bold', 12);
  doc.setTextColor(...C.white);
  const nameLines = doc.splitTextToSize(about?.name || '', SW);
  nameLines.forEach(line => {
    doc.text(line, SIDE_W / 2, sy, { align: 'center' });
    sy += 5;
  });
  sy += 1;

  // Title
  if (about?.title) {
    setFont('normal', 8.5);
    doc.setTextColor(...C.sideMuted);
    const titleLines = doc.splitTextToSize(about.title, SW);
    titleLines.forEach(line => {
      doc.text(line, SIDE_W / 2, sy, { align: 'center' });
      sy += 4;
    });
    sy += 4;
  }

  // Divider
  const sideDivider = () => {
    doc.setDrawColor(70, 72, 82);
    doc.setLineWidth(0.2);
    doc.line(SL, sy, SIDE_W - SR, sy);
    sy += 6;
  };

  const sideSection = (title) => {
    setFont('bold', 9);
    doc.setTextColor(...C.accent);
    doc.text(title.toUpperCase(), SL, sy);
    sy += 5;
  };

  // Contact
  sideDivider();
  sideSection('Contact');

  const contactItems = [];
  if (about?.email) contactItems.push(about.email);
  if (about?.phone) contactItems.push(about.phone);
  if (about?.city && about?.country) contactItems.push(`${about.city}, ${about.country}`);

  setFont('normal', 8);
  doc.setTextColor(...C.sideText);
  contactItems.forEach(item => {
    const lines = doc.splitTextToSize(item, SW);
    lines.forEach(line => {
      doc.text(line, SL, sy);
      sy += 3.8;
    });
    sy += 1.5;
  });

  // Social links
  if (about?.linkedin || about?.github) {
    sy += 2;
    sideSection('Links');
    setFont('normal', 8);

    if (about?.linkedin) {
      const url = about.linkedin.startsWith('http') ? about.linkedin : `https://www.linkedin.com/in/${about.linkedin}`;
      const label = `linkedin.com/in/${about.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`;
      doc.setTextColor(...C.link);
      const linkLines = doc.splitTextToSize(label, SW);
      linkLines.forEach(line => {
        doc.textWithLink(line, SL, sy, { url });
        sy += 3.8;
      });
      sy += 1.5;
    }
    if (about?.github) {
      const url = about.github.startsWith('http') ? about.github : `https://github.com/${about.github}`;
      const label = `github.com/${about.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`;
      doc.setTextColor(...C.link);
      const linkLines = doc.splitTextToSize(label, SW);
      linkLines.forEach(line => {
        doc.textWithLink(line, SL, sy, { url });
        sy += 3.8;
      });
      sy += 1.5;
    }
  }

  // Skills in sidebar
  if (skills?.length) {
    sy += 2;
    sideDivider();
    sideSection('Skills');
    setFont('normal', 8);
    doc.setTextColor(...C.sideText);
    skills.forEach(s => {
      if (sy > PH - MB - 5) return; // prevent overflow
      doc.text(`•  ${s.name}`, SL, sy);
      sy += 4.2;
    });
  }

  // Services in sidebar (if space)
  if (services?.length && sy < PH - MB - 30) {
    sy += 2;
    sideDivider();
    sideSection('Services');
    setFont('normal', 8);
    doc.setTextColor(...C.sideText);
    services.forEach(s => {
      if (sy > PH - MB - 5) return;
      doc.text(`•  ${s.title}`, SL, sy);
      sy += 4.2;
    });
  }

  // ══════════════════════════════════════════════════════════
  //  MAIN CONTENT (right side)
  // ══════════════════════════════════════════════════════════
  let y = MT;

  const checkPage = (need = 14) => {
    if (y + need > PH - MB) {
      doc.addPage();
      drawSidebarBg();
      y = MT;
    }
  };

  const mainDivider = () => {
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.25);
    doc.line(MAIN_L, y, PW - MAIN_R, y);
    y += 5;
  };

  const mainSection = (title) => {
    checkPage(14);
    y += 2;
    setFont('bold', 12);
    doc.setTextColor(...C.black);
    doc.text(title.toUpperCase(), MAIN_L, y);
    y += 1.5;
    doc.setDrawColor(...C.black);
    doc.setLineWidth(0.4);
    doc.line(MAIN_L, y, PW - MAIN_R, y);
    y += 6;
  };

  // Profile
  if (about?.bio) {
    mainSection('Profile');
    setFont('normal', 10);
    doc.setTextColor(...C.text);
    const lines = doc.splitTextToSize(about.bio, MAIN_W);
    checkPage(lines.length * 4.5 + 4);
    doc.text(lines, MAIN_L, y);
    y += lines.length * 4.5 + 4;
  }

  // Experience
  if (experience?.length) {
    mainSection('Experience');
    experience.forEach((exp, idx) => {
      checkPage(22);

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(exp.title, MAIN_L, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${exp.startDate} – ${exp.endDate || 'Present'}`, PW - MAIN_R, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, MAIN_L, y);
      y += 5;

      if (exp.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(exp.description, MAIN_W - 4);
        checkPage(dl.length * 4.3 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('•', MAIN_L, y);
            doc.text(line, MAIN_L + 4, y);
          } else {
            doc.text(line, MAIN_L + 4, y);
          }
          y += 4.3;
        });
      }
      y += idx < experience.length - 1 ? 4 : 2;
    });
  }

  // Education
  if (education?.length) {
    mainSection('Education');
    education.forEach((edu, idx) => {
      checkPage(18);

      setFont('bold', 10.5);
      doc.setTextColor(...C.dark);
      doc.text(edu.degree, MAIN_L, y);

      setFont('normal', 9);
      doc.setTextColor(...C.muted);
      doc.text(`${edu.startDate} – ${edu.endDate || 'Present'}`, PW - MAIN_R, y, { align: 'right' });
      y += 4.5;

      setFont('italic', 10);
      doc.setTextColor(...C.text);
      doc.text(edu.institution, MAIN_L, y);
      y += 5;

      if (edu.description) {
        setFont('normal', 10);
        doc.setTextColor(...C.text);
        const dl = doc.splitTextToSize(edu.description, MAIN_W - 4);
        checkPage(dl.length * 4.3 + 4);
        dl.forEach((line, li) => {
          checkPage(5);
          if (li === 0) {
            doc.text('•', MAIN_L, y);
            doc.text(line, MAIN_L + 4, y);
          } else {
            doc.text(line, MAIN_L + 4, y);
          }
          y += 4.3;
        });
      }
      y += idx < education.length - 1 ? 4 : 2;
    });
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont('normal', 8);
    doc.setTextColor(...C.muted);
    doc.text(`Page ${i} of ${pageCount}`, PW - MAIN_R, PH - 8, { align: 'right' });
  }

  const fileName = (about?.name || 'resume').replace(/\s+/g, '_').toLowerCase();
  doc.save(`${fileName}_resume.pdf`);
}
