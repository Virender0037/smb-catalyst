import { useId, useState } from 'react';
import Icon from './AdminIcon';
import { useDismissable } from '../../lib/hooks';

/* ------------------------------------------------------------ Page header */
export function PageHeader({ eyebrow, title, sub, actions, back }) {
  return (
    <header className="ad-page-head">
      <div className="ad-page-head-main">
        {back}
        <div style={{ minWidth: 0 }}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="ad-page-title">{title}</h2>
          {sub && <p className="ad-page-sub">{sub}</p>}
        </div>
      </div>
      {actions && <div className="ad-page-head-actions">{actions}</div>}
    </header>
  );
}

/* ------------------------------------------------------------ Search */
export function SearchInput({ value, onChange, placeholder = 'Search', label }) {
  const id = useId();
  return (
    <div className="ad-search">
      <label className="sr-only" htmlFor={id}>
        {label ?? placeholder}
      </label>
      <div className="input-wrap">
        <span className="input-affix input-affix-l">
          <Icon name="search" size={17} />
        </span>
        <input
          id={id}
          className="input"
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Filter select */
export function FilterSelect({ label, value, onChange, options, allLabel }) {
  const id = useId();
  return (
    <div className="ad-filter">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="select ad-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {allLabel && <option value="all">{allLabel}</option>}
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------ Toolbar */
export function Toolbar({ children, meta }) {
  return (
    <div className="ad-toolbar">
      <div className="ad-toolbar-controls">{children}</div>
      {meta && <div className="ad-toolbar-meta">{meta}</div>}
    </div>
  );
}

/* ------------------------------------------------------------ Filter chips */
export function ChipFilter({ options, value, onChange, ariaLabel = 'Filter' }) {
  return (
    <div className="chip-row" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="chip"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {typeof o.count === 'number' && <span className="chip-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ Toggle */
export function Toggle({ checked, onChange, label, hint, disabled, size = 'md' }) {
  const id = useId();
  return (
    <div className={`ad-toggle-row ${disabled ? 'is-disabled' : ''}`}>
      <div className="ad-toggle-copy">
        <label className="ad-toggle-label" htmlFor={id}>
          {label}
        </label>
        {hint && <p className="ad-toggle-hint">{hint}</p>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={`ad-switch ${size === 'sm' ? 'ad-switch-sm' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span className="ad-switch-knob" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ Kebab menu */
export function ActionMenu({ items, label = 'Row actions', align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useDismissable(open, () => setOpen(false));

  return (
    <div className="ad-action-menu" ref={ref}>
      <button
        type="button"
        className="btn btn-icon"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <Icon name="more" size={18} />
      </button>
      {open && (
        <div className={`menu ad-menu ${align === 'left' ? 'ad-menu-left' : ''}`} role="menu">
          {items.map((item, i) =>
            item.separator ? (
              // eslint-disable-next-line react/no-array-index-key
              <div className="menu-sep" key={`sep-${i}`} />
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`menu-item ${item.danger ? 'menu-item-danger' : ''}`}
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                {item.icon && <Icon name={item.icon} size={16} />}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Stat tile */
export function StatTile({ label, value, note, icon, tone = 'neutral', onClick, footer }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`ad-stat ad-stat-${tone}`} onClick={onClick}>
      <div className="ad-stat-top">
        <span className="ad-stat-label">{label}</span>
        {icon && (
          <span className="ad-stat-icon" aria-hidden="true">
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <span className="ad-stat-value num">{value}</span>
      {note && <span className="ad-stat-note">{note}</span>}
      {footer}
    </Tag>
  );
}

/* ------------------------------------------------------------ Definition list */
export function DetailList({ items, columns = 1 }) {
  return (
    <dl className={`ad-details ${columns === 2 ? 'ad-details-2' : ''}`}>
      {items
        .filter(Boolean)
        .map(({ label, value, full }) => (
          <div className={`ad-detail ${full ? 'ad-detail-full' : ''}`} key={label}>
            <dt>{label}</dt>
            <dd>{value ?? '—'}</dd>
          </div>
        ))}
    </dl>
  );
}

/* ------------------------------------------------------------ Section */
export function Section({ title, sub, actions, children, className = '', flush }) {
  return (
    <section className={`card ad-section ${className}`}>
      {(title || actions) && (
        <header className="ad-section-head">
          <div style={{ minWidth: 0 }}>
            {title && <h3 className="ad-section-title">{title}</h3>}
            {sub && <p className="ad-section-sub">{sub}</p>}
          </div>
          {actions && <div className="ad-section-actions">{actions}</div>}
        </header>
      )}
      <div className={flush ? '' : 'ad-section-body'}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ Prototype note */
export function PrototypeNote({ children, icon = 'info' }) {
  return (
    <p className="ad-proto-note">
      <Icon name={icon} size={15} />
      <span>{children}</span>
    </p>
  );
}
