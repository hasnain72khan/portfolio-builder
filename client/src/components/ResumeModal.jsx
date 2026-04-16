import { useState, useEffect, useRef } from 'react';
import { X, FileDown, Download, Eye, AlertCircle } from 'lucide-react';
import generateResumePDF from '../utils/generateResumePDF';
import generateResumeTwoCol from '../utils/generateResumeTwoCol';
import generateResumeModern from '../utils/generateResumeModern';
import generateResumeCreative from '../utils/generateResumeCreative';
import generateResumeExecutive from '../utils/generateResumeExecutive';
import generateResumeTech from '../utils/generateResumeTech';
import generateResumeMinimal from '../utils/generateResumeMinimal';
import generateResumeDOCX from '../utils/generateResumeDOCX';
import { needsDOCX } from '../utils/pdfFontLoader';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Spanish' }, { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' }, { code: 'pt', label: 'Portuguese' }, { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' }, { code: 'ja', label: 'Japanese' }, { code: 'ko', label: 'Korean' },
  { code: 'hi', label: 'Hindi' }, { code: 'ur', label: 'Urdu' }, { code: 'tr', label: 'Turkish' },
  { code: 'ru', label: 'Russian' }, { code: 'it', label: 'Italian' }, { code: 'nl', label: 'Dutch' },
];

const templates = [
  { key: 'classic', name: 'Classic', generate: generateResumePDF },
  { key: 'twocol', name: 'Two Column', generate: generateResumeTwoCol },
  { key: 'modern', name: 'Modern', generate: generateResumeModern },
  { key: 'creative', name: 'Creative', generate: generateResumeCreative },
  { key: 'executive', name: 'Executive', generate: generateResumeExecutive },
  { key: 'tech', name: 'Tech', generate: generateResumeTech },
  { key: 'minimal', name: 'Minimal', generate: generateResumeMinimal },
];

// Generate a thumbnail image from a jsPDF doc
function docToThumbnail(doc) {
  try {
    const pageData = doc.output('arraybuffer');
    // Use jsPDF's internal canvas to render page 1 as image
    const dataUri = doc.output('datauristring');
    // Extract first page as image via canvas
    return dataUri; // We'll use this for iframe preview
  } catch { return null; }
}

const ResumeModal = ({ open, onClose, data, isTranslating }) => {
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [thumbsLoading, setThumbsLoading] = useState(false);
  const busy = !!loading || isTranslating;
  const generated = useRef(false);

  const lang = data?.about?.language || 'en';
  const forceDOCX = needsDOCX(lang);
  const effectiveFormat = forceDOCX ? 'docx' : format;

  // Generate real PDF thumbnails when modal opens
  useEffect(() => {
    if (!open || !data || forceDOCX || generated.current) return;
    generated.current = true;
    setThumbsLoading(true);

    const genThumbs = async () => {
      const thumbs = {};
      for (const t of templates) {
        try {
          const result = await t.generate(data);
          if (result?.doc) {
            // Convert first page to blob URL for iframe thumbnail
            const blob = result.doc.output('blob');
            thumbs[t.key] = URL.createObjectURL(blob);
          }
        } catch { /* skip failed template */ }
      }
      setThumbnails(thumbs);
      setThumbsLoading(false);
    };
    genThumbs();

    return () => { generated.current = false; };
  }, [open, data]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(thumbnails).forEach(url => { try { URL.revokeObjectURL(url); } catch {} });
    };
  }, [thumbnails]);

  if (!open) return null;

  const handleAction = async (template, action) => {
    const key = template?.key || 'docx';
    setLoading(key + '-' + action);

    let previewWin = null;
    if (action === 'preview') {
      previewWin = window.open('', '_blank');
      if (previewWin) previewWin.document.write('<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#111;color:#fff;font-family:sans-serif"><p>Generating resume...</p></body></html>');
    }

    try {
      if (effectiveFormat === 'docx') {
        await generateResumeDOCX(data);
      } else {
        const result = await template.generate(data);
        if (result?.doc) {
          if (action === 'preview' && previewWin) {
            previewWin.location.href = URL.createObjectURL(result.doc.output('blob'));
          } else {
            result.doc.save(result.fileName);
          }
        }
      }
    } catch (err) {
      console.error('Resume action failed:', err);
      if (previewWin) previewWin.document.write('<p style="color:red">Failed. Try again.</p>');
    }
    setLoading(null);
    if (action === 'download') {
      // Track resume download
      if (data.username) {
        fetch(`${API}/analytics/track/${data.username}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'resume_download', section: effectiveFormat }),
        }).catch(() => {});
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-2xl w-full max-w-3xl overflow-hidden animate-slide-up"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-center px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-heading)' }}>Download Resume</h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Choose a template and format</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4 flex flex-wrap items-center gap-4">
          {!forceDOCX ? (
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
              {[{ id: 'pdf', label: 'PDF' }, { id: 'docx', label: 'DOCX' }].map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  className="px-5 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: format === f.id ? 'rgba(var(--brand-rgb), 0.2)' : 'transparent', color: format === f.id ? 'var(--color-brand)' : 'var(--color-text-muted)' }}>
                  {f.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
              <AlertCircle size={14} />
              <span>{LANGUAGES.find(l => l.code === lang)?.label} uses DOCX format</span>
            </div>
          )}
          {lang !== 'en' && !forceDOCX && (
            <span className="text-[10px]" style={{ color: 'var(--color-brand)' }}>
              Translated to {LANGUAGES.find(l => l.code === lang)?.label || lang}
            </span>
          )}
        </div>

        {isTranslating && (
          <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(var(--brand-rgb), 0.08)', border: '1px solid rgba(var(--brand-rgb), 0.15)', color: 'var(--color-brand)' }}>
            <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
            Translating resume...
          </div>
        )}

        {effectiveFormat === 'pdf' ? (
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[55vh] overflow-y-auto">
            {templates.map(t => (
              <div key={t.key} className="flex flex-col items-center gap-2.5 p-3 rounded-xl"
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                {/* Real PDF thumbnail or loading skeleton */}
                <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-white relative"
                  style={{ border: '1px solid var(--glass-border)' }}>
                  {thumbnails[t.key] ? (
                    <iframe src={thumbnails[t.key] + '#toolbar=0&navpanes=0&scrollbar=0'}
                      className="w-full h-full border-0 pointer-events-none"
                      style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                      title={t.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {thumbsLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--glass-border)', borderTopColor: 'transparent' }} />
                      ) : (
                        <span className="text-[9px] text-gray-400">Preview</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-heading)' }}>{t.name}</p>
                <div className="flex items-center gap-2 w-full">
                  <button onClick={() => handleAction(t, 'preview')} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-40"
                    style={{ background: 'var(--glass-bg)', color: 'var(--color-text-muted)', border: '1px solid var(--glass-border)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)'; e.currentTarget.style.color = 'var(--color-brand)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
                    {loading === t.key + '-preview' ? <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <><Eye size={12} /> Preview</>}
                  </button>
                  <button onClick={() => handleAction(t, 'download')} disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-white transition-all disabled:opacity-40"
                    style={{ background: 'var(--color-brand)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {loading === t.key + '-download' ? <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><Download size={12} /> Save</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <button onClick={() => handleAction(null, 'download')} disabled={busy}
              className="w-full flex items-center gap-4 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
              <div className="w-14 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                {loading === 'docx-download'
                  ? <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                  : <FileDown size={24} className="text-blue-400" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>Download as Word Document</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>ATS-optimized .docx — supports all languages.</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
