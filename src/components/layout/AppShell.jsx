import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo, { LogoMark } from '../ui/Logo';
import Icon from '../ui/Icon';
import { Avatar, Badge } from '../ui';
import { navItems, pageMeta } from './nav';
import { mockClient, mockUser } from '../../data/client';
import { mockNotifications } from '../../data/notifications';
import { mockSupport } from '../../data/support';
import { useDismissable, useIsTabletDown, useLockBodyScroll } from '../../lib/hooks';
import { useSession } from '../../lib/session';
import { usePortalState } from '../../lib/portalState';

function NavList({ onNavigate }) {
  const state = usePortalState();
  const badgeFor = (item) => (item.badgeKey === 'openRequests' ? state.openRequests.length : 0);

  return (
    <nav className="sidebar-nav" aria-label="Portal sections">
      {navItems.map((item) => {
        const badge = badgeFor(item);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
            onClick={onNavigate}
            title={item.label}
          >
            <Icon name={item.icon} size={19} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
            {badge > 0 && (
              <span className="nav-badge" aria-label={`${badge} needing attention`}>
                {badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function ClientBlock() {
  return (
    <div className="sidebar-client">
      <span className="eyebrow" style={{ fontSize: 10 }}>
        Engagement
      </span>
      <span className="sidebar-client-name truncate">{mockClient.practice.name}</span>
      <span className="sidebar-client-meta">
        {mockClient.name} · {mockClient.engagementRef}
      </span>
    </div>
  );
}

function NotificationsMenu({ open, onClose }) {
  const ref = useDismissable(open, onClose);
  const unread = mockNotifications.filter((n) => n.unread).length;
  if (!open) return null;
  return (
    <div className="menu notif-panel" ref={ref} role="dialog" aria-label="Notifications">
      <div className="notif-panel-head">
        <strong style={{ fontSize: 'var(--fs-base)' }}>Notifications</strong>
        {unread > 0 && <Badge tone="accent">{unread} new</Badge>}
      </div>
      <div className="notif-list">
        {mockNotifications.map((n) => (
          <Link key={n.id} to={n.link} className={`notif-row ${n.unread ? 'notif-row-unread' : ''}`} onClick={onClose}>
            <span style={{ minWidth: 0, flex: 1 }}>
              <span className="notif-title" style={{ display: 'block' }}>
                {n.title}
              </span>
              <span className="notif-text" style={{ display: 'block' }}>
                {n.text}
              </span>
              <span className="notif-time" style={{ display: 'block' }}>
                {n.time}
              </span>
            </span>
            {n.unread && <span className="notif-unread-dot" aria-label="Unread" />}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProfileMenu({ open, onClose, onSignOut }) {
  const ref = useDismissable(open, onClose);
  if (!open) return null;
  return (
    <div className="menu" ref={ref} role="menu" aria-label="Account">
      <div className="menu-head">
        <p className="menu-head-name">{mockUser.name}</p>
        <p className="menu-head-mail">{mockUser.email}</p>
        <p className="menu-head-mail" style={{ marginTop: 4 }}>
          Last sign-in {mockUser.lastLogin}
        </p>
      </div>
      <button type="button" className="menu-item" role="menuitem" onClick={onClose}>
        <Icon name="settings" size={17} /> Account settings
      </button>
      <button type="button" className="menu-item" role="menuitem" onClick={onClose}>
        <Icon name="help" size={17} /> Help &amp; support
      </button>
      <div className="menu-sep" />
      <button type="button" className="menu-item menu-item-danger" role="menuitem" onClick={onSignOut}>
        <Icon name="logout" size={17} /> Sign out
      </button>
    </div>
  );
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useSession();
  const isTabletDown = useIsTabletDown();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useLockBodyScroll(drawerOpen);

  // Close transient UI whenever the route changes or we leave mobile widths.
  useEffect(() => {
    setDrawerOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isTabletDown) setDrawerOpen(false);
  }, [isTabletDown]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const handleSignOut = useCallback(() => {
    signOut();
    navigate('/login', { replace: true });
  }, [signOut, navigate]);

  const meta = pageMeta[location.pathname] ?? { title: 'Portal', crumb: '' };

  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Desktop / laptop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          {/* Full lockup on the wide sidebar; the monogram alone once the rail
              collapses, so the logo is never cropped or squashed. */}
          <Logo height={44} className="brand-full" />
          <LogoMark size={34} className="brand-compact" />
        </div>
        <ClientBlock />
        <NavList />
        <div className="sidebar-foot">
          <div className="sidebar-support">
            <Icon name="phone" size={17} style={{ color: 'var(--brand-primary)', flex: 'none', marginTop: 2 }} />
            <div style={{ minWidth: 0 }}>
              <p className="sidebar-support-title">Client care</p>
              <p className="sidebar-support-text">{mockSupport.line}</p>
              <p className="sidebar-support-text">{mockSupport.hours}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Portal navigation">
            <div className="drawer-head">
              <Logo height={44} />
              <button type="button" className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
                <Icon name="close" size={20} />
              </button>
            </div>
            <ClientBlock />
            <NavList onNavigate={() => setDrawerOpen(false)} />
            <div className="sidebar-foot">
              <div className="sidebar-support">
                <Icon name="phone" size={17} style={{ color: 'var(--brand-primary)', flex: 'none', marginTop: 2 }} />
                <div style={{ minWidth: 0 }}>
                  <p className="sidebar-support-title">Client care</p>
                  <p className="sidebar-support-text">{mockSupport.line}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            style={{ display: isTabletDown ? 'flex' : 'none' }}
          >
            <Icon name="menu" size={21} />
          </button>

          <div className="topbar-mobile-brand">
            <Logo height={32} />
            <span className="truncate" style={{ fontSize: 'var(--fs-base)', fontWeight: 600 }}>
              {meta.title}
            </span>
          </div>

          <div className="topbar-title">
            <h1>{meta.title}</h1>
            {meta.crumb && <span className="topbar-crumb">{meta.crumb}</span>}
          </div>

          <div className="topbar-actions">
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-icon notif-btn"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
              >
                <Icon name="bell" size={19} />
                <span className="notif-dot" aria-hidden="true" />
              </button>
              <NotificationsMenu open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            <div className="profile">
              <button
                type="button"
                className="profile-btn"
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
              >
                <Avatar name={mockUser.name} initials={mockClient.initials} size="sm" />
                <span className="profile-name">{mockUser.name}</span>
                <Icon name="chevronDown" size={15} className="chevron" />
              </button>
              <ProfileMenu open={profileOpen} onClose={() => setProfileOpen(false)} onSignOut={handleSignOut} />
            </div>
          </div>
        </header>

        <main className="page" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
