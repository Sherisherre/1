import React, { useState, useRef } from 'react';
import { BaseLink } from '../types';

interface LinkButtonProps {
  link: BaseLink;
  key?: any;
}

export default function LinkButton({ link }: LinkButtonProps) {
  const [clickState, setClickState] = useState<'normal' | 'loading' | 'failed' | 'fading-out' | 'removed'>('normal');
  const lastClickTime = useRef<number>(0);
  const timeouts = useRef<number[]>([]);

  if (clickState === 'removed') return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (link.specialAction === 'ghim-fail') {
      e.preventDefault();

      const DBL_CLICK_THRESHOLD = 400;
      const now = new Date().getTime();
      const lastClick = lastClickTime.current;

      if (now - lastClick < DBL_CLICK_THRESHOLD) {
        // Double click bypasses the loading/failing state and opens the URL!
        timeouts.current.forEach(t => window.clearTimeout(t));
        setClickState('normal');
        window.open(link.href, '_blank', 'noopener,noreferrer');
      } else {
        lastClickTime.current = now;

        if (clickState !== 'normal') return;

        // Transition 1: Loading
        const t1 = window.setTimeout(() => setClickState('loading'), 10);
        
        // Transition 2: Failed after 1.5 seconds
        const t2 = window.setTimeout(() => setClickState('failed'), 1500);
        
        // Transition 3: Fading out after 3.5 seconds
        const t3 = window.setTimeout(() => setClickState('fading-out'), 3500);
        
        // Transition 4: Removed after 4.1 seconds
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

  const isGhim = link.specialAction === 'ghim-fail';

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={getButtonClass()}
      onClick={handleClick}
    >
      <span className="btn-content-wrapper">
        <span className="btn-content original">
          {link.icon && <i className={`fas ${link.icon}`}></i>}
          <span>{link.text}</span>
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
  );
}
