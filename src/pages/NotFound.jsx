import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { Icon } from '../components/ui';
import { useSession } from '../lib/session';

export default function NotFound() {
  const { isAuthenticated } = useSession();
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--sp-6)',
        background: 'var(--smb-canvas)',
      }}
    >
      <div style={{ maxWidth: 440, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-6)' }}>
          <Logo size={38} />
        </div>
        <span className="state-icon" style={{ margin: '0 auto var(--sp-4)' }} aria-hidden="true">
          <Icon name="search" size={22} />
        </span>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>We could not find that page</h1>
        <p className="state-text" style={{ margin: '10px auto 0' }}>
          The link may have expired, or the page may have moved since it was shared with you.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 'var(--sp-6)', flexWrap: 'wrap' }}>
          <Link to={isAuthenticated ? '/overview' : '/login'} className="btn btn-primary" style={{ textDecoration: 'none' }}>
            {isAuthenticated ? 'Back to overview' : 'Go to sign in'}
          </Link>
          <a href="tel:+18889701210" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            <Icon name="phone" size={16} /> Call client care
          </a>
        </div>
      </div>
    </div>
  );
}
