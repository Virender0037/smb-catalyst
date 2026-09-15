import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import MfaSteps from '../components/layout/MfaSteps';
import { Button, Checkbox, Icon } from '../components/ui';
import { mockClient } from '../data/client';
import { useSession } from '../lib/session';

const LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyCode() {
  const navigate = useNavigate();
  const { session, completeVerification } = useSession();

  const [digits, setDigits] = useState(Array(LENGTH).fill(''));
  const [trust, setTrust] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resentAt, setResentAt] = useState(0);

  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (!session) return <Navigate to="/login" replace />;

  const code = digits.join('');

  const setAt = (index, value) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const onChange = (i) => (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setAt(i, '');
      return;
    }
    setError('');
    if (raw.length > 1) {
      // handles paste into any box
      const chars = raw.slice(0, LENGTH - i).split('');
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, k) => {
          next[i + k] = c;
        });
        return next;
      });
      inputs.current[Math.min(i + chars.length, LENGTH - 1)]?.focus();
      return;
    }
    setAt(i, raw);
    if (i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i) => (e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, '');
      inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault();
      inputs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      e.preventDefault();
      inputs.current[i + 1]?.focus();
    }
  };

  const confirm = (e) => {
    e.preventDefault();
    if (code.length < LENGTH) {
      setError(`Enter all ${LENGTH} digits of the code we sent you.`);
      inputs.current[digits.findIndex((d) => !d)]?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      completeVerification();
      navigate('/overview', { replace: true });
    }, 900);
  };

  const resend = () => {
    setCountdown(RESEND_SECONDS);
    setResentAt((n) => n + 1);
    setDigits(Array(LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
  };

  return (
    <AuthLayout
      headline="A quick security check."
      sub="We confirm the device before releasing access to confidential transaction materials."
    >
      <MfaSteps current={2} />

      <h2 className="auth-title">Enter your verification code</h2>
      <p className="auth-title-sub">
        We sent a {LENGTH}-digit code to <strong>{mockClient.phoneMasked}</strong>. It expires in 10 minutes.
      </p>

      <form className="auth-form" onSubmit={confirm} noValidate>
        {resentAt > 0 && !error && (
          <div className="auth-alert auth-alert-info" role="status">
            <Icon name="checkCircle" size={16} />
            <span>A new code is on its way to {mockClient.phoneMasked}.</span>
          </div>
        )}

        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="field-label" style={{ marginBottom: 8, display: 'block' }}>
            Verification code
          </legend>
          <div className="otp-row">
            {digits.map((d, i) => (
              <input
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                className={`otp-input ${d ? 'otp-input-filled' : ''} ${error ? 'otp-input-error' : ''}`}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={LENGTH}
                value={d}
                onChange={onChange(i)}
                onKeyDown={onKeyDown(i)}
                onFocus={(e) => e.target.select()}
                aria-label={`Digit ${i + 1} of ${LENGTH}`}
                aria-invalid={error ? true : undefined}
              />
            ))}
          </div>
          {error && (
            <p className="field-error" role="alert" style={{ marginTop: 8 }}>
              <Icon name="alert" size={13} /> {error}
            </p>
          )}
        </fieldset>

        <div className="otp-resend">
          <button type="button" className="btn btn-link" onClick={() => setHelpOpen((v) => !v)} aria-expanded={helpOpen}>
            Didn&apos;t receive a code?
            <Icon name="chevronDown" size={14} style={{ transform: helpOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
          {countdown > 0 ? (
            <span className="muted-3" style={{ fontSize: 'var(--fs-sm)' }}>
              Resend available in {countdown}s
            </span>
          ) : (
            <Button variant="link" onClick={resend}>
              Resend code
            </Button>
          )}
        </div>

        {helpOpen && (
          <div className="trust-box" style={{ flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--smb-text-2)' }}>
              Codes can take up to a minute to arrive. Check that {mockClient.phoneMasked} is still your mobile number,
              and that your device has signal.
            </p>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--smb-text-2)' }}>
              Still nothing? Call client care on <strong>888-970-1210</strong>.
            </p>
          </div>
        )}

        <div className="trust-box">
          <Checkbox
            label="Trust this device for 30 days"
            checked={trust}
            onChange={(e) => setTrust(e.target.checked)}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" block loading={submitting} disabled={submitting}>
          {submitting ? 'Confirming…' : 'Confirm and continue'}
        </Button>

        <Button variant="ghost" block onClick={() => navigate('/verify')}>
          Back
        </Button>
      </form>
    </AuthLayout>
  );
}
