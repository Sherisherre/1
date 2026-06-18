import { motion, AnimatePresence } from 'motion/react';
import { PRESET_THEMES } from '../data';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  themeMode,
  setThemeMode,
  primaryColor,
  setPrimaryColor
}: SettingsModalProps) {

  // Conversions for applying theme to raw element style variables
  const hexToHsl = (H: string) => {
    let r = 0, g = 0, b = 0;
    if (H.length === 7) {
      r = parseInt(H[1] + H[2], 16);
      g = parseInt(H[3] + H[4], 16);
      b = parseInt(H[5] + H[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    return h;
  };

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : null;
  };

  const applyColors = (hex: string) => {
    setPrimaryColor(hex);
    const root = document.documentElement;
    root.style.setProperty('--primary-hue', String(hexToHsl(hex)));
    const rgb = hexToRgb(hex);
    if (rgb) {
      root.style.setProperty('--rgb-primary', rgb);
    }
    localStorage.setItem('eng-portal-theme', hex);
  };

  const applyThemeMode = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    document.body.classList.toggle('light-mode', mode === 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'light' ? '#f5f9ff' : '#0a0a0a');
    }
    localStorage.setItem('eng-portal-mode', mode);
  };

  const isPresetActive = (color: string) => {
    return primaryColor.toLowerCase() === color.toLowerCase();
  };

  const isCustomColor = !Object.values(PRESET_THEMES).map(c => c.toLowerCase()).includes(primaryColor.toLowerCase());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose} style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={onClose}
              title="إغلاق"
              aria-label="إغلاق"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-header">الإعدادات</h2>
            <div className="settings-content text-right">
              <div className="settings-section">
                <h3 className="settings-section-title">مظهر التطبيق</h3>
                <div className="settings-item">
                  <h4>الوضع</h4>
                  <div className="mode-toggle">
                    <button
                      className={`mode-btn ${themeMode === 'dark' ? 'active' : ''}`}
                      onClick={() => applyThemeMode('dark')}
                    >
                      ظلام
                    </button>
                    <button
                      className={`mode-btn ${themeMode === 'light' ? 'active' : ''}`}
                      onClick={() => applyThemeMode('light')}
                    >
                      نهار
                    </button>
                  </div>
                </div>
                <div className="settings-item flex justify-between items-center">
                  <h4>اختر السمة</h4>
                  <div className="theme-picker">
                    {Object.entries(PRESET_THEMES).map(([name, color]) => (
                      <div
                        key={name}
                        className={`theme-dot ${isPresetActive(color) ? 'active' : ''}`}
                        onClick={() => applyColors(color)}
                        style={{ backgroundColor: color }}
                        title={name}
                      />
                    ))}
                    <label
                      htmlFor="custom-color-picker"
                      className={`color-picker-label ${isCustomColor ? 'active' : ''}`}
                      title="اختر لونًا مخصصًا"
                      style={{ backgroundColor: isCustomColor ? primaryColor : 'transparent' }}
                    >
                      <input
                        id="custom-color-picker"
                        type="color"
                        className="color-picker-input"
                        value={primaryColor}
                        onChange={(e) => applyColors(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
