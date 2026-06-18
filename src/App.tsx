import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData } from './types';
import { SITE_DATA, PRIMARY_FILTERS, LEVEL_FILTERS, PRESET_THEMES } from './data';
import StarfieldCanvas from './components/StarfieldCanvas';
import LinkCard from './components/LinkCard';
import LinkButton from './components/LinkButton';
import WelcomeModal from './components/WelcomeModal';
import { useFavorites } from './context/FavoritesContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    }
  }
};

export default function App() {
  const { favorites } = useFavorites();
  const [activePrimaryFilter, setActivePrimaryFilter] = useState<string>('college');
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('level-1');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  
  // Custom Theme & mode states
  const [themeMode] = useState<'light' | 'dark'>('dark');
  const [primaryColor] = useState<string>(PRESET_THEMES.blue);


  useEffect(() => {
    // 1. Initial configuration for CSS variables and Mode classes
    const savedMode = 'dark';
    const savedTheme = PRESET_THEMES.blue;

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
    document.body.classList.remove('light-mode');

    // Update Meta color theme
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', '#0a0a0a');
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
          <div className="aurora-dot aurora-dot-3"></div>
        </div>

        <div className="container">
          {/* Header */}
          <header className="page-header">
            <h1 className="page-title">دليل الحاسب</h1>
            <p className="page-subtitle">دليلك الأكاديمي لجميع المجموعات والمبادرات الطلابية</p>
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
              
              <button
                className={`filter-btn flex items-center justify-center gap-2 ${activePrimaryFilter === 'favorites' ? 'is-active' : ''}`}
                onClick={() => setActivePrimaryFilter('favorites')}
                role="button"
                aria-pressed={activePrimaryFilter === 'favorites'}
              >
                <i className={`${favorites.length > 0 ? 'fas fa-star text-amber-400' : 'far fa-star text-slate-400'}`}></i>
                <span>المفضلة</span>
                {favorites.length > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-bold text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-md">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Levels secondary Filters */}
          <AnimatePresence initial={false}>
            {activePrimaryFilter === 'levels' && (
              <motion.div
                key="level-carousel"
                initial={{ height: 0, opacity: 0, y: -12, marginBottom: 0 }}
                animate={{ height: 80, opacity: 1, y: 0, marginBottom: '2.5rem' }}
                exit={{ height: 0, opacity: 0, y: -12, marginBottom: 0 }}
                transition={{
                  height: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.18, ease: 'easeOut' },
                  y: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                  marginBottom: { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%' }}
                className="filter-carousel-wrapper is-visible"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Cards Grid */}
          <main className="min-h-[400px] w-full relative">
            <AnimatePresence mode="wait">
              {activePrimaryFilter === 'favorites' ? (
                <motion.div
                  key="favorites-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-2xl mx-auto"
                >
                  <div className="link-card span-full-width p-6 md:p-8">
                    <div className="card-header border-b border-[var(--border)] pb-4 mb-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-star text-amber-400 text-2xl animate-pulse"></i>
                        <h2 className="card-title m-0">روابطي المفضلة</h2>
                      </div>
                      {favorites.length > 0 && (
                        <span className="text-sm bg-amber-400/10 text-amber-300 font-mono font-medium px-3 py-1 rounded-full border border-amber-400/20">
                          {favorites.length} {favorites.length === 1 ? 'رابط' : 'روابط'}
                        </span>
                      )}
                    </div>

                    {favorites.length > 0 ? (
                      <div className="button-group">
                        {favorites.map((link, idx) => (
                          <LinkButton key={link.href + '-' + idx} link={link} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400/80 text-3xl">
                          <i className="far fa-star"></i>
                        </div>
                        <div className="max-w-md">
                          <h3 className="text-lg font-bold text-[var(--text-light)] mb-2">قائمة التفضيل فارغة</h3>
                          <p className="text-[var(--text-medium)] text-sm leading-relaxed mb-4">
                            لم تقم بحفظ أي روابط في المفضلة بعد. يمكنك حفظ وتفضيل أي قناة، مجموعة، أو مبادرة أكاديمية من خلال الضغط على زر النجمة (⭐) الموجود على الأزرار ليسهل عليك تصفحها مباشرة من هنا!
                          </p>
                          <button 
                            onClick={handleResetFilter}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            تصفح الكلية والمستويات
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activePrimaryFilter + '-' + activeLevelFilter}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="links-grid"
                >
                  {filteredCards.map((card, idx) => (
                    <LinkCard key={idx} card={card} index={idx} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredCards.length === 0 && activePrimaryFilter !== 'favorites' && (
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
    </>
  );
}
