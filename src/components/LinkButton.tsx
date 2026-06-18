import React, { useState, useRef } from 'react';
import { BaseLink } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'motion/react';
import { SITE_DATA } from '../data';

interface LinkButtonProps {
  link: BaseLink;
  showSource?: boolean;
  key?: any;
}

export function findLinkSource(href: string) {
  for (const card of SITE_DATA) {
    if (card.links) {
      const match = card.links.find(l => l.href === href);
      if (match) {
        return { cardTitle: card.title, sectionTitle: '' };
      }
    }
    if (card.sections) {
      for (const section of card.sections) {
        if (section.links) {
          const match = section.links.find(l => l.href === href);
          if (match) {
            return { cardTitle: card.title, sectionTitle: section.title };
          }
        }
      }
    }
    if (card.initiatives && card.initiatives.links) {
      const match = card.initiatives.links.find(l => l.href === href);
      if (match) {
        return { cardTitle: card.title, sectionTitle: card.initiatives.title };
      }
    }
    if (card.departments) {
      for (const dept of card.departments) {
        if (dept.links) {
          const match = dept.links.find(l => l.href === href);
          if (match) {
            return { cardTitle: card.title, sectionTitle: dept.title };
          }
        }
      }
    }
  }
  return null;
}

const getTooltipText = (link: BaseLink) => {
  const text = (link.text || '').toLowerCase();
  
  if (text.includes('قناة كلية الحاسب') || text.includes('قناة الكلية') || text.includes('قناة كلية')) {
    return 'قناة تليجرام الرسمية لكلية الحاسب بجامعة القصيم لمتابعة الأخبار والقرارات الرسمية.';
  }
  if (text.includes('مناقشة كلية الحاسب') || text.includes('مناقشة الكلية')) {
    return 'مجموعة النقاش الكبرى لطلاب وطالبات الكلية للمناقشات التعاونية والمساعدة الدراسية.';
  }
  if (text.includes('قنوات المواد')) {
    return 'رابط إضافة تليجرام جماعي (Addlist) لجميع قنوات ومجموعات ومصادر المواد الأكاديمية لهذا المستوى بلمسة واحدة.';
  }
  if (text === 'it') {
    return 'مبادرة Moves الشاملة لجميع سلايدات، ملفات، وشروحات تخصص تقنية المعلومات للدفعة.';
  }
  if (text === 'cs') {
    return 'مبادرة CS Moves التي تقدم شروحات متميزة وحقائب متكاملة لمواد تخصص علوم الحاسب.';
  }
  if (text === 'ce') {
    return 'جدول ومبادرة Moves المخصصة لهندسة الحاسب مع الشروحات والحلول الأكاديمية.';
  }
  if (text === 'computer') {
    return 'قناة ومجموعة مبادرة Computer الطلابية لتوفير المخلصات، مقاطع الشرح، وتيسير مذاكرة المواد.';
  }
  if (text.includes('hkr')) {
    return 'مبادرة ومجهودات HKR لتوفير الكويزات التفاعلية، الملخصات والتجميعات للدفعة.';
  }
  if (text === 'جميع التخصصات') {
    return 'الحقيبة الموحدة ومبادرة Moves المميزة التي تغطي كافة متطلبات ومعامل ومحاضرات تخصصات الحاسب لهذا المستوى.';
  }
  if (text.includes('المستوى')) {
    if (link.type === 'channel') {
      return `قناة الإعلانات والتنبيهات المخصصة لطلاب ومستجدين ${link.text}.`;
    } else {
      return `مجموعة الاستفسارات المتبادلة والحلول السريعة لطلاب ${link.text}.`;
    }
  }

  // Fallback default message
  const typeText = link.type === 'channel'
    ? 'قناة تليجرام رسمية لمتابعة الإعلانات والأخبار والتنبيهات الأكاديمية.'
    : link.type === 'group'
    ? 'مجموعة تفاعلية للمناقشات، الاستفسارات، والمذاكرة الجماعية بين الطلاب.'
    : link.type === 'initiative'
    ? 'مبادرة طلابية ومجموعة مصادر دراسية شاملة لتسهيل المادة العلمية.'
    : 'رابط مباشر للوصول اللوجستي للمصادر الأكاديمية.';
    
  return typeText;
};

export default function LinkButton({ link, showSource = false }: LinkButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [clickState, setClickState] = useState<'normal' | 'loading' | 'failed' | 'fading-out' | 'removed'>('normal');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const timeouts = useRef<number[]>([]);
  const longPressTimeout = useRef<number | null>(null);

  const favorited = isFavorite(link.href);
  const source = showSource ? findLinkSource(link.href) : null;

  if (clickState === 'removed') return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If long press is happening and tooltip is showing on touch, we prevent triggering link immediately
    if (showTooltip && 'ontouchstart' in window) {
      e.preventDefault();
      return;
    }

    if (link.specialAction === 'ghim-fail') {
      e.preventDefault();

      const DBL_CLICK_THRESHOLD = 400;
      const now = new Date().getTime();
      const lastClick = lastClickTime.current;

      if (now - lastClick < DBL_CLICK_THRESHOLD) {
        timeouts.current.forEach(t => window.clearTimeout(t));
        setClickState('normal');
        window.open(link.href, '_blank', 'noopener,noreferrer');
      } else {
        lastClickTime.current = now;

        if (clickState !== 'normal') return;

        const t1 = window.setTimeout(() => setClickState('loading'), 10);
        const t2 = window.setTimeout(() => setClickState('failed'), 1500);
        const t3 = window.setTimeout(() => setClickState('fading-out'), 3500);
        const t4 = window.setTimeout(() => setClickState('removed'), 4100);

        timeouts.current = [t1, t2, t3, t4];
      }
    }
  };

  const getButtonClass = () => {
    let cls = 'link-button';
    if (clickState === 'loading') cls += ' is-loading';
    if (clickState === 'failed') cls += ' is-failed';
    if (clickState === 'fading-out') cls += ' is-fading-out';
    return cls;
  };

  const startLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    longPressTimeout.current = window.setTimeout(() => {
      setShowTooltip(true);
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch (err) {}
      }
    }, 450);
  };

  const endLongPress = () => {
    if (longPressTimeout.current) {
      window.clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const isGhim = link.specialAction === 'ghim-fail';

  return (
    <div className={`relative w-full group ${showTooltip ? 'z-30' : 'z-10'}`}>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-72 p-3.5 rounded-2xl bg-slate-950/95 border border-[var(--primary)] text-slate-100 text-xs text-center shadow-2xl backdrop-blur-md pointer-events-none select-none leading-relaxed"
            style={{
              boxShadow: '0 12px 30px -4px rgba(0,0,0,0.5), 0 0 20px -3px hsla(var(--primary-hue), var(--primary-sat), var(--primary-light), 0.25)',
              zIndex: 99
            }}
          >
            {/* Arrow Element */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-slate-950/95" />
            
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[var(--primary-light)] flex items-center justify-center gap-1.5 text-[13px] border-b border-white/10 pb-1.5">
                <i className={`fas ${link.icon || 'fa-info-circle'} text-[11px]`} />
                {link.text}
              </span>
              <span className="text-slate-300 font-sans leading-[1.6]">
                {getTooltipText(link)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                <i className="fas fa-external-link-alt text-[8px] text-[var(--primary-light)]"></i>
                <span>انقر أو اضغط لعرض القناة/المجموعة</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${getButtonClass()} pl-14 pr-6`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          setShowTooltip(false);
          endLongPress();
        }}
        onTouchStart={startLongPress}
        onTouchEnd={() => {
          endLongPress();
          // Hide after 3 seconds on mobile touch screens
          const touchCloseTimeout = window.setTimeout(() => {
            setShowTooltip(false);
          }, 3000);
          timeouts.current.push(touchCloseTimeout);
        }}
        onTouchMove={endLongPress}
      >
        <span className="btn-content-wrapper">
          <span className="btn-content original flex flex-col md:flex-row md:items-center justify-center gap-1.5 md:gap-3">
            <span className="flex items-center gap-2">
              {link.icon && <i className={`fas ${link.icon}`}></i>}
              <span>{link.text}</span>
            </span>
            {showSource && source && (
              <span className="inline-flex items-center text-[10px] md:text-[11px] font-medium bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/20 whitespace-nowrap self-center transition-all leading-none">
                {source.cardTitle}{source.sectionTitle ? ` • ${source.sectionTitle}` : ''}
              </span>
            )}
          </span>
          
          {isGhim && (
            <>
              <span className="btn-content loading">
                <i className="fas fa-spinner fa-spin"></i>
                <span>جاري التحميل...</span>
              </span>
              <span className="btn-content failed">
                <i className="fas fa-exclamation-circle"></i>
                <span>فشل التحميل</span>
              </span>
            </>
          )}
        </span>
      </a>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(link);
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-amber-400 cursor-pointer hover:bg-amber-400/20 hover:border-amber-400/40 active:scale-90 transition-all duration-200"
        aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        title={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      >
        <i className={`${favorited ? 'fas fa-star text-amber-400' : 'far fa-star text-gray-400 group-hover:text-amber-400/80'} text-base`} />
      </button>
    </div>
  );
}
