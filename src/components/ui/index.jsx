import { forwardRef, useId, useState } from 'react';
import Icon from './Icon';
import { initialsOf } from '../../lib/format';

/* ---------------------------------------------------------- Button */
export function Button({
  variant = 'secondary',
  size,
  block,
  loading,
  icon,
  iconRight,
  children,
  className = '',
  type = 'button',
  ...rest
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cls} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={16} /> : null}
      {children}
      {iconRight && !loading ? <Icon name={iconRight} size={16} /> : null}
    </button>
  );
}

export function IconButton({ icon, label, className = '', size = 18, ...rest }) {
  return (
    <button type="button" className={`btn btn-icon ${className}`} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  );
}

/* ---------------------------------------------------------- Field */
export const Field = forwardRef(function Field(
  { label, hint, error, id, type = 'text', leadingIcon, trailing, className = '', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="input-wrap">
        {leadingIcon && (
          <span className="input-affix input-affix-l">
            <Icon name={leadingIcon} size={17} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input ${error ? 'input-invalid' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined}
          {...rest}
        />
        {trailing}
      </div>
      {hint && !error && (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={errorId} role="alert">
          <Icon name="alert" size={13} /> {error}
        </p>
      )}
    </div>
  );
});

export function PasswordField({ label = 'Password', ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field
      label={label}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="input-action"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          title={visible ? 'Hide password' : 'Show password'}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={17} />
        </button>
      }
      {...rest}
    />
  );
}

export function Checkbox({ label, id, ...rest }) {
  const autoId = useId();
  return (
    <label className="checkbox" htmlFor={id ?? autoId}>
      <input type="checkbox" id={id ?? autoId} {...rest} />
      <span className="checkbox-box" aria-hidden="true">
        <Icon name="check" size={12} strokeWidth={3} />
      </span>
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

export function Select({ label, id, hint, children, className = '', ...rest }) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className="select" {...rest}>
        {children}
      </select>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

/* ---------------------------------------------------------- Card */
export function Card({ as: Tag = 'section', className = '', children, interactive, ...rest }) {
  return (
    <Tag className={`card ${interactive ? 'card-interactive' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHead({ title, sub, action, icon, id }) {
  return (
    <header className="card-head">
      <div className="row" style={{ minWidth: 0, gap: 12 }}>
        {icon}
        <div style={{ minWidth: 0 }}>
          <h3 className="card-title" id={id}>
            {title}
          </h3>
          {sub && <p className="card-sub">{sub}</p>}
        </div>
      </div>
      {action && <div className="row" style={{ flex: 'none', gap: 8 }}>{action}</div>}
    </header>
  );
}

/* ---------------------------------------------------------- Badge */
export function Badge({ tone = 'neutral', dot, children, className = '' }) {
  return (
    <span className={`badge badge-${tone} ${className}`}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------- Avatar */
export function Avatar({ name, initials, size = 'md', tone = '', className = '' }) {
  const sizeCls = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : size === 'xl' ? 'avatar-xl' : '';
  const toneCls = tone ? `avatar-${tone}` : '';
  return (
    <span className={`avatar ${sizeCls} ${toneCls} ${className}`} aria-hidden="true" title={name}>
      {initials ?? initialsOf(name)}
    </span>
  );
}

/* ---------------------------------------------------------- Delta */
export function Delta({ value, direction, label }) {
  const icon = direction === 'up' ? 'trendUp' : direction === 'down' ? 'trendDown' : null;
  return (
    <span className={`delta delta-${direction}`}>
      {icon && <Icon name={icon} size={13} strokeWidth={2} />}
      {value}
      {label && <span className="muted-3" style={{ fontWeight: 400, marginLeft: 3 }}>{label}</span>}
    </span>
  );
}

/* ---------------------------------------------------------- Skeleton */
export function Skeleton({ w = '100%', h = 12, r, style, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ display: 'block', width: w, height: h, borderRadius: r, ...style }}
      aria-hidden="true"
    />
  );
}

/* ---------------------------------------------------------- States */
export function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="state">
      <span className="state-icon">
        <Icon name={icon} size={22} />
      </span>
      <p className="state-title">{title}</p>
      {text && <p className="state-text">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'We could not load this', text, onRetry }) {
  return (
    <div className="state" role="alert">
      <span className="state-icon state-icon-danger">
        <Icon name="alert" size={22} />
      </span>
      <p className="state-title">{title}</p>
      {text && <p className="state-text">{text}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- Meter */
export function Meter({ value, onDark, label }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div
      className={`meter ${onDark ? 'meter-on-dark' : ''}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="meter-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export { default as Icon } from './Icon';
