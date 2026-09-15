import Icon from '../ui/Icon';

const STEPS = ['Credentials', 'Mobile', 'Code'];

/** Compact 3-step indicator for the sign-in journey. */
export default function MfaSteps({ current = 1 }) {
  return (
    <ol className="mfa-steps" aria-label={`Step ${current + 1} of ${STEPS.length}`}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <li key={label} className="row" style={{ gap: 8 }}>
            <span
              className={`mfa-step-dot ${done ? 'mfa-step-dot-done' : ''} ${isCurrent ? 'mfa-step-dot-current' : ''}`}
              aria-hidden="true"
            >
              {done ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
            </span>
            <span style={{ color: isCurrent ? 'var(--smb-text)' : undefined, fontWeight: isCurrent ? 600 : 400 }}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mfa-step-bar" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
