import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { useFocusTrap, useLockBodyScroll } from '../../lib/hooks';

export default function Modal({ open, onClose, title, description, children, footer, labelledBy }) {
  const autoId = useId();
  const titleId = labelledBy ?? `${autoId}-title`;
  const trapRef = useFocusTrap(open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={trapRef}>
        <div className="modal-head">
          <div style={{ minWidth: 0 }}>
            <h2 id={titleId} style={{ fontSize: 'var(--fs-lg)' }}>
              {title}
            </h2>
            {description && <p className="card-sub" style={{ marginTop: 4 }}>{description}</p>}
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
