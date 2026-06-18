import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData } from './types';
import { SITE_DATA, PRIMARY_FILTERS, LEVEL_FILTERS, PRESET_THEMES } from './data';
import StarfieldCanvas from './components/StarfieldCanvas';
import LinkCard from './components/LinkCard';
import WelcomeModal from './components/WelcomeModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activePrimaryFilter, setActivePrimaryFilter] = useState<string>('college');
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('level-1');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Custom Theme & mode states
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [primaryColor, setPrimaryColor] = useState<string>(PRESET_THEMES.blue);

  useEffect(() => {
    // 1. Initial configuration for CSS variables and Mode classes
    const savedMode = (localStorage.getItem('eng-portal-mode') as 'light' | 'dark') || 'dark';
    const savedTheme = localStorage.getItem('eng-portal-theme') || PRESET_THEMES.blue;

    setThemeMode(savedMode);
    setPrimaryColor(savedTheme);

    // Apply color theme roots
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

    const root = document.documentElement;
    root.style.setProperty('--primary-hue', String(hexToHsl(savedTheme)));
    const rgb = hexToRgb(savedTheme);
    if (rgb) {
      root.style.setProperty('--rgb-primary', rgb);
    }

    // Toggle light-mode class
    document.body.classList.toggle('light-mode', savedMode === 'light');

    // Update Meta color theme
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', savedMode === 'light' ? '#f5f9ff' : '#0a0a0a');
    }

    // 2. Open Welcome modal check
    const visited = localStorage.getItem('eng-portal-visited');
    if (!visited) {
      const timer = setTimeout(() => {
        setIsWelcomeOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem('eng-portal-visited', 'true');
  };

  const handleGoToLevel1 = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem('eng-portal-visited', 'true');
    setActivePrimaryFilter('levels');
    setActiveLevelFilter('level-1');

    setTimeout(() => {
      const card = document.querySelector('.link-card[data-level="level-1"]');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // Determine which cards to display
  const filteredCards = SITE_DATA.filter((card: CardData) => {
    if (activePrimaryFilter === 'levels') {
      return card.category === 'levels' && card.level === activeLevelFilter;
    }
    return card.category === activePrimaryFilter;
  });

  const handleResetFilter = () => {
    setActivePrimaryFilter('college');
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* 3D Cosmic Space and Parallax Starfield Canvas */}
      <StarfieldCanvas />

      <div className="app-wrapper">
        {/* Glowing Blurred Aurora blobs in background */}
        <div className="aurora-bg">
          <div className="aurora-dot aurora-dot-1"></div>
          <div className="aurora-dot aurora-dot-2"></div>
        </div>

        <div className="container">
          {/* Header */}
          <header className="page-header">
            <h1 className="page-title">دليل الحاسب</h1>
            <p className="page-subtitle">وصول سريع ومنظم لجميع روابط المجموعات التطوعية والمبادرات الطلابية لكلية الحاسب.</p>
          </header>

          {/* Primary Carousel-like Filters */}
          <div className="filter-carousel-wrapper" id="primary-carousel-wrapper">
            <div className="filter-carousel-track">
              {PRIMARY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${activePrimaryFilter === filter.id ? 'is-active' : ''}`}
                  onClick={() => setActivePrimaryFilter(filter.id)}
                  role="button"
                  aria-pressed={activePrimaryFilter === filter.id}
                >
                  {filter.text}
                </button>
              ))}
            </div>
          </div>

          {/* Levels secondary Filters */}
          <div
            className={`filter-carousel-wrapper ${activePrimaryFilter === 'levels' ? 'is-visible' : ''}`}
            id="level-carousel-wrapper"
          >
            <div className="filter-carousel-track">
              {LEVEL_FILTERS.map((level) => (
                <button
                  key={level.id}
                  className={`filter-btn ${activeLevelFilter === level.id ? 'is-active' : ''}`}
                  onClick={() => setActiveLevelFilter(level.id)}
                  role="button"
                  aria-pressed={activeLevelFilter === level.id}
                >
                  {level.text}
                </button>
              ))}
            </div>
          </div>

          {/* Main Cards Grid */}
          <main className="links-grid min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, idx) => (
                <LinkCard key={card.level + idx} card={card} index={idx} />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredCards.length === 0 && (
              <div className="empty-state is-visible">
                <i className="fas fa-compass icon"></i>
                <span>لا توجد نتائج تطابق هذا التصنيف.</span>
                <button className="link-button" onClick={handleResetFilter}>
                  عرض الكلية
                </button>
              </div>
            )}
          </main>

          {/* Footer Controls */}
          <footer className="page-footer flex items-center justify-between w-full" dir="rtl">
            <div className="footer-controls flex items-center gap-4">
              <a
                href="https://t.me/Sherisherre"
                className="footer-icon-btn text-2xl"
                target="_blank"
                rel="noopener noreferrer"
                title="تواصل معي على تليجرام"
                aria-label="تواصل معي على تليجرام"
              >
                <i className="fab fa-telegram-plane"></i>
              </a>
              <button
                id="settings-btn"
                className="footer-icon-btn text-xl"
                title="الإعدادات"
                aria-label="الإعدادات"
                onClick={() => setIsSettingsOpen(true)}
              >
                <i className="fas fa-cog"></i>
              </button>
            </div>
            
            <span className="footer-link text-base font-medium text-[var(--text-medium)] hover:text-[var(--text-light)] transition-colors duration-250">
              Developed by Sherisherre
            </span>
          </footer>
        </div>
      </div>

      {/* Popups & Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleWelcomeClose}
        onGoToLevel1={handleGoToLevel1}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
      />
    </>
  );
}
