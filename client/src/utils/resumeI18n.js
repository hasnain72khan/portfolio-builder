/**
 * Multi-language section headings for resume generation.
 * Includes Contact and Links labels for sidebar templates.
 */
const translations = {
  en: { summary: 'Professional Summary', experience: 'Work Experience', education: 'Education', skills: 'Skills', services: 'Services', contact: 'Contact', links: 'Links', scanPortfolio: 'Scan for Portfolio' },
  es: { summary: 'Resumen Profesional', experience: 'Experiencia Laboral', education: 'Educación', skills: 'Habilidades', services: 'Servicios', contact: 'Contacto', links: 'Enlaces', scanPortfolio: 'Escanear para Portafolio' },
  fr: { summary: 'Résumé Professionnel', experience: 'Expérience Professionnelle', education: 'Formation', skills: 'Compétences', services: 'Services', contact: 'Contact', links: 'Liens', scanPortfolio: 'Scanner pour Portfolio' },
  de: { summary: 'Berufliches Profil', experience: 'Berufserfahrung', education: 'Ausbildung', skills: 'Fähigkeiten', services: 'Dienstleistungen', contact: 'Kontakt', links: 'Links', scanPortfolio: 'Scannen fur Portfolio' },
  pt: { summary: 'Resumo Profissional', experience: 'Experiência Profissional', education: 'Educação', skills: 'Competências', services: 'Serviços', contact: 'Contato', links: 'Links', scanPortfolio: 'Escaneie para Portfolio' },
  ar: { summary: 'الملخص المهني', experience: 'الخبرة العملية', education: 'التعليم', skills: 'المهارات', services: 'الخدمات', contact: 'الاتصال', links: 'الروابط', scanPortfolio: 'امسح للمحفظة' },
  zh: { summary: '专业概述', experience: '工作经历', education: '教育背景', skills: '技能', services: '服务', contact: '联系方式', links: '链接', scanPortfolio: '扫描查看作品集' },
  ja: { summary: '職務概要', experience: '職務経歴', education: '学歴', skills: 'スキル', services: 'サービス', contact: '連絡先', links: 'リンク', scanPortfolio: 'ポートフォリオをスキャン' },
  ko: { summary: '전문 요약', experience: '경력', education: '학력', skills: '기술', services: '서비스', contact: '연락처', links: '링크', scanPortfolio: '포트폴리오 스캔' },
  hi: { summary: 'पेशेवर सारांश', experience: 'कार्य अनुभव', education: 'शिक्षा', skills: 'कौशल', services: 'सेवाएं', contact: 'संपर्क', links: 'लिंक', scanPortfolio: 'पोर्टफोलियो के लिए स्कैन करें' },
  ur: { summary: 'پیشہ ورانہ خلاصہ', experience: 'کام کا تجربہ', education: 'تعلیم', skills: 'مہارتیں', services: 'خدمات', contact: 'رابطہ', links: 'لنکس', scanPortfolio: 'پورٹ فولیو کے لیے اسکین کریں' },
  tr: { summary: 'Profesyonel Özet', experience: 'İş Deneyimi', education: 'Eğitim', skills: 'Beceriler', services: 'Hizmetler', contact: 'İletişim', links: 'Bağlantılar', scanPortfolio: 'Portfolyo icin Tarayin' },
  ru: { summary: 'Профессиональное резюме', experience: 'Опыт работы', education: 'Образование', skills: 'Навыки', services: 'Услуги', contact: 'Контакты', links: 'Ссылки', scanPortfolio: 'Сканируйте для портфолио' },
  it: { summary: 'Profilo Professionale', experience: 'Esperienza Lavorativa', education: 'Istruzione', skills: 'Competenze', services: 'Servizi', contact: 'Contatti', links: 'Link', scanPortfolio: 'Scansiona per Portfolio' },
  nl: { summary: 'Professioneel Profiel', experience: 'Werkervaring', education: 'Opleiding', skills: 'Vaardigheden', services: 'Diensten', contact: 'Contact', links: 'Links', scanPortfolio: 'Scan voor Portfolio' },
};

/** For PDF — Latin-script languages only, non-Latin falls back to English */
export function getLabels(lang = 'en') {
  if (['zh', 'ja', 'ko', 'ar', 'ur', 'hi', 'ru'].includes(lang)) return translations.en;
  return translations[lang] || translations.en;
}

/** For DOCX — returns native translations for ALL languages */
export function getNativeLabels(lang = 'en') {
  return translations[lang] || translations.en;
}
