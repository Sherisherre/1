import { motion, AnimatePresence } from 'motion/react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLevel1: () => void;
}

export default function WelcomeModal({ isOpen, onClose, onGoToLevel1 }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose} style={{ pointerEvents: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-header">✨ مرحبًا بك في كلية الحاسب ✨</h2>
            <div className="welcome-modal-body text-right">
              <p>نهنئك على قبولك ونتمنى لك رحلة أكاديمية مليئة بالنجاح والإنجاز. هذا الدليل هو بوابتك للوصول إلى جميع الروابط والموارد الهامة التي ستحتاجها كطالب مستجد.</p>
              <p>لبدء رحلتك، يمكنك الانتقال مباشرةً إلى مجموعات ومبادرات المستوى الأول.</p>
            </div>
            <button
              id="go-to-level1-btn"
              className="link-button w-full mt-4 flex items-center justify-center gap-2 flex-row-reverse"
              onClick={onGoToLevel1}
              style={{ padding: '0.9rem 1.5rem' }}
            >
              <span>الانتقال لمجموعات المستوى الأول</span>
              <i className="fas fa-arrow-left"></i>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
