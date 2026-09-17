import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../components/ui/Icon';
import { useFocusTrap, useLockBodyScroll } from '../../lib/hooks';

/**
 * Right-hand detail / edit panel.
 *
 * Wide records (a document, a request, a listing) get a drawer rather than a
 * modal so the list behind stays visible for context. Below 640px it becomes
 * a full-height sheet.
 */
export default function Drawer({ open, onClose, title, subtitle, eyebrow, footer, width = 520, children }) {
  const autoId = useId();
  const titleId = `${autoId}-title`;
  const trapRef = useFocusTrap(open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="ad-drawer-layer">
      <div className="ad-drawer-scrim" onClick={onClose} aria-hidden="true" />
      <aside
        className="ad-drawer"
        style={{ width: `min(${width}px, 100vw)` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={trapRef}
      >
        <header className="ad-drawer-head">
          <div style={{ minWidth: 0 }}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={titleId} className="ad-drawer-title">
              {title}
            </h2>
            {subtitle && <p className="ad-drawer-sub">{subtitle}</p>}
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close panel">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="ad-drawer-body">{children}</div>

        {footer && <div className="ad-drawer-foot">{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}
