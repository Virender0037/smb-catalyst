import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Button, Checkbox, Field, Icon, PasswordField } from '../components/ui';
import { useSession } from '../lib/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const navigate = useNavigate();
  const { startVerification } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = 'Enter the email address on your engagement.';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    else if (password.length < 6) next.password = 'Passwords are at least 6 characters.';

    setErrors(next);
    setFormError('');
    if (Object.keys(next).length) return;

    setSubmitting(true);
    // Prototype only — no credentials are checked and nothing leaves the browser.
    setTimeout(() => {
      setSubmitting(false);
      startVerification(email.trim());
      navigate('/verify');
    }, 850);
  };

  return (
    <AuthLayout
      headline="Your practice transaction, in one place."
      sub="Expert brokers for medical practice sales, guiding you to smooth transitions."
    >
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-title-sub">Sign in to your private client portal.</p>

      <form className="auth-form" onSubmit={submit} noValidate>
        {formError && (
          <div className="auth-alert" role="alert">
            <Icon name="alert" size={16} />
            <span>{formError}</span>
          </div>
        )}

        <Field
          label="Email address"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="you@yourpractice.com"
          leadingIcon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="auth-row">
          <Checkbox label="Remember this device" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setFormError('Password reset is not enabled in this preview. Your advisory team can help you regain access.')}
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="primary" size="lg" block loading={submitting} disabled={submitting}>
          {submitting ? 'Verifying…' : 'Sign in'}
        </Button>
      </form>

      <div className="auth-secure-note">
        <Icon name="shield" size={16} />
        <span>
          This portal is used to exchange confidential practice and financial information. Please sign out when you have
          finished, particularly on a shared or public device.
        </span>
      </div>
    </AuthLayout>
  );
}
