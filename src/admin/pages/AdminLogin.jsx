import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Field, PasswordField } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Logo from '../../components/ui/Logo';
import { useAdminSession } from '../lib/adminSession';
import { mockAdminUser } from '../data';

/**
 * Internal staff sign-in — PROTOTYPE ONLY.
 *
 * No credentials are checked and nothing is transmitted. It exists so the
 * internal console has its own front door, separate from the client portal.
 * The fields are pre-filled so a reviewer is one click from the console.
 */
export default function AdminLogin() {
  const { isAuthenticated, signIn } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(mockAdminUser.email);
  const [password, setPassword] = useState('demo-password');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Staff sign-in · SMB Admin';
  }, []);

  if (isAuthenticated) return <Navigate to={location.state?.from ?? '/admin/dashboard'} replace />;

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      signIn(email);
      navigate(location.state?.from ?? '/admin/dashboard', { replace: true });
    }, 500);
  };

  return (
    <div className="ad-login">
      <div className="ad-login-card">
        <div className="ad-login-head">
          <Logo height={42} />
          <h1 className="ad-login-title">Admin console</h1>
          <p className="ad-login-sub">
            Internal access for Strategic Medical Brokers staff. Client portal users should sign in at the client
            portal instead.
          </p>
        </div>

        <form className="ad-login-body" onSubmit={submit}>
          <Field
            label="Work email"
            type="email"
            autoComplete="username"
            leadingIcon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordField
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" block loading={busy} iconRight="arrowRight">
            {busy ? 'Signing in…' : 'Sign in to the console'}
          </Button>
          <p className="field-hint" style={{ textAlign: 'center' }}>
            <Icon name="lock" size={12} /> Prototype build — any credentials are accepted and nothing is verified.
          </p>
        </form>

        <div className="ad-login-foot">
          Production will require SSO and multi-factor authentication for every staff account. No authentication
          backend exists in this build.
        </div>
      </div>
    </div>
  );
}
