import { motion, AnimatePresence } from 'motion/react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLevel1?: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
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
            <button
              className="modal-close-btn"
              onClick={onClose}
              title="إغلاق"
              aria-label="إغلاق"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-header">أهلاً بك في كلية الحاسب! 💻💫</h2>
            <div className="welcome-modal-body text-right">
              <p>دليل لكافة القنوات والمجموعات والمبادرات الطلابية لمساعدتكم في الوصول إلى مصادركم الأكاديمية بكل سهولة خلال رحلتكم الجامعية.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
