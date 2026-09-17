import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo, { LogoMark } from '../../components/ui/Logo';
import Icon from '../../components/ui/Icon';
import { Avatar, Badge } from '../../components/ui';
import { useDismissable, useIsTabletDown, useLockBodyScroll } from '../../lib/hooks';
import { adminNavGroups, metaForPath } from './adminNav';
import { useAdminState } from '../lib/adminState';
import { useAdminSession } from '../lib/adminSession';

/* ------------------------------------------------------------ nav */
function NavGroups({ onNavigate }) {
  const state = useAdminState();
  const counts = {
    pendingInvites: state.pendingInviteCount,
    inbox: state.inboxCount,
    overdue: state.overdueCount,
  };

  return (
    <nav className="ad-nav" aria-label="Admin sections">
      {adminNavGroups.map((group) => (
        <div className="ad-nav-group" key={group.id}>
          <p className="ad-nav-group-label">{group.label}</p>
          {group.items.map((item) => {
            const badge = item.badgeKey ? counts[item.badgeKey] : 0;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `ad-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={onNavigate}
                title={item.label}
              >
                <Icon name={item.icon} size={18} className="ad-nav-icon" />
                <span className="ad-nav-label">{item.label}</span>
                {badge > 0 && (
                  <span className="ad-nav-badge" aria-label={`${badge} needing attention`}>
                    {badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function ConsoleBlock() {
  const { user } = useAdminSession();
  return (
    <div className="ad-console-block">
      <span className="ad-console-eyebrow">Internal console</span>
      <span className="ad-console-title">Strategic Medical Brokers</span>
      <span className="ad-console-meta">
        {user.name} · {user.adminRole}
      </span>
    </div>
  );
}

function SidebarFoot() {
  return (
    <div className="ad-sidebar-foot">
      <div className="ad-env">
        <Icon name="info" size={15} />
        <div>
          <p className="ad-env-title">UI prototype</p>
          <p className="ad-env-text">Mock data only — no CRM, storage or email is connected.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ global search */
function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const state = useAdminState();
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismissable(open, close);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out = [];

    state.clients.forEach((c) => {
      if (
        c.practice.name.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.engagementRef.toLowerCase().includes(q)
      ) {
        out.push({
          id: c.id,
          group: 'Client',
          title: c.practice.name,
          sub: `${c.owner} · ${c.engagementRef}`,
          to: `/admin/clients/${c.id}`,
          icon: 'building',
        });
      }
    });

    state.portalUsers.forEach((u) => {
      if (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) {
        out.push({
          id: u.id,
          group: 'Portal user',
          title: u.name,
          sub: `${u.email} · ${state.clientName(u.clientId)}`,
          to: '/admin/users',
          icon: 'team',
        });
      }
    });

    state.documents.forEach((d) => {
      if (d.name.toLowerCase().includes(q)) {
        out.push({
          id: d.id,
          group: 'Document',
          title: d.name,
          sub: `${d.category} · ${state.clientName(d.clientId)}`,
          to: '/admin/documents',
          icon: 'document',
        });
      }
    });

    state.requests.forEach((r) => {
      if (r.title.toLowerCase().includes(q)) {
        out.push({
          id: r.id,
          group: 'Request',
          title: r.title,
          sub: `${r.status} · ${state.clientName(r.clientId)}`,
          to: '/admin/requests',
          icon: 'request',
        });
      }
    });

    return out.slice(0, 8);
  }, [query, state]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="ad-global-search" ref={ref}>
      <div className="input-wrap">
        <span className="input-affix input-affix-l">
          <Icon name="search" size={16} />
        </span>
        <input
          ref={inputRef}
          className="input ad-global-input"
          type="search"
          placeholder="Search clients, users, documents…"
          aria-label="Search the admin portal"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        <kbd className="ad-kbd" aria-hidden="true">
          ⌘K
        </kbd>
      </div>

      {open && query.trim().length >= 2 && (
        <div className="menu ad-search-panel" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <p className="ad-search-empty">No matches for “{query}”.</p>
          ) : (
            results.map((r) => (
              <button
                key={`${r.group}-${r.id}`}
                type="button"
                className="ad-search-row"
                onClick={() => {
                  navigate(r.to);
                  setQuery('');
                  setOpen(false);
                }}
              >
                <span className="ad-search-icon">
                  <Icon name={r.icon} size={16} />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="ad-search-title truncate">{r.title}</span>
                  <span className="ad-search-sub truncate">{r.sub}</span>
                </span>
                <Badge tone="neutral">{r.group}</Badge>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ alerts tray */
function AlertsMenu({ open, onClose }) {
  const ref = useDismissable(open, onClose);
  const state = useAdminState();

  const alerts = useMemo(
    () =>
      [
        state.overdueCount > 0 && {
          id: 'a1',
          title: `${state.overdueCount} overdue requests`,
          text: 'Client responses are past their agreed due date.',
          to: '/admin/requests',
          tone: 'danger',
        },
        state.inboxCount > 0 && {
          id: 'a2',
          title: `${state.inboxCount} documents awaiting filing`,
          text: 'Client uploads in the incoming inbox need a category.',
          to: '/admin/documents/incoming',
          tone: 'warn',
        },
        state.pendingInviteCount > 0 && {
          id: 'a3',
          title: `${state.pendingInviteCount} invitations outstanding`,
          text: 'Users invited but not yet activated.',
          to: '/admin/users',
          tone: 'info',
        },
      ].filter(Boolean),
    [state.overdueCount, state.inboxCount, state.pendingInviteCount],
  );

  if (!open) return null;

  return (
    <div className="menu ad-alerts" ref={ref} role="dialog" aria-label="Operational alerts">
      <div className="ad-alerts-head">
        <strong>Requires attention</strong>
        <Badge tone="accent">{alerts.length}</Badge>
      </div>
      {alerts.length === 0 ? (
        <p className="ad-search-empty">Nothing outstanding. Good morning.</p>
      ) : (
        alerts.map((a) => (
          <Link key={a.id} to={a.to} className="ad-alert-row" onClick={onClose}>
            <span className={`ad-alert-dot ad-alert-${a.tone}`} aria-hidden="true" />
            <span style={{ minWidth: 0 }}>
              <span className="ad-alert-title">{a.title}</span>
              <span className="ad-alert-text">{a.text}</span>
            </span>
          </Link>
        ))
      )}
      <div className="menu-sep" />
      <Link to="/admin/dashboard" className="menu-item" onClick={onClose}>
        <Icon name="overview" size={16} /> Open the attention queue
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------ profile */
function ProfileMenu({ open, onClose, onSignOut }) {
  const ref = useDismissable(open, onClose);
  const { user } = useAdminSession();
  if (!open) return null;
  return (
    <div className="menu" ref={ref} role="menu" aria-label="Staff account">
      <div className="menu-head">
        <p className="menu-head-name">{user.name}</p>
        <p className="menu-head-mail">{user.email}</p>
        <p className="menu-head-mail" style={{ marginTop: 4 }}>
          {user.adminRole} · MFA: {user.mfa}
        </p>
        <p className="menu-head-mail" style={{ marginTop: 2 }}>
          Last sign-in {user.lastLogin}
        </p>
      </div>
      <Link to="/admin/settings" className="menu-item" role="menuitem" onClick={onClose}>
        <Icon name="settings" size={17} /> Portal settings
      </Link>
      <Link to="/admin/roles" className="menu-item" role="menuitem" onClick={onClose}>
        <Icon name="shield" size={17} /> Roles &amp; permissions
      </Link>
      <div className="menu-sep" />
      <button type="button" className="menu-item menu-item-danger" role="menuitem" onClick={onSignOut}>
        <Icon name="logout" size={17} /> Sign out
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ shell */
export default function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAdminSession();
  const isTabletDown = useIsTabletDown();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useLockBodyScroll(drawerOpen);

  useEffect(() => {
    setDrawerOpen(false);
    setAlertsOpen(false);
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
    navigate('/admin/login', { replace: true });
  }, [signOut, navigate]);

  const meta = metaForPath(location.pathname);

  return (
    <div className="ad-shell">
      <a className="skip-link" href="#admin-main">
        Skip to main content
      </a>

      <aside className="ad-sidebar">
        <div className="ad-brand">
          <Logo height={40} className="ad-brand-full" />
          <LogoMark size={32} className="ad-brand-compact" />
          <span className="ad-brand-tag">Admin</span>
        </div>
        <ConsoleBlock />
        <NavGroups />
        <SidebarFoot />
      </aside>

      {drawerOpen && (
        <>
          <div className="ad-drawer-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="ad-mobile-nav" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <div className="ad-mobile-nav-head">
              <div className="row" style={{ gap: 10 }}>
                <Logo height={36} />
                <span className="ad-brand-tag">Admin</span>
              </div>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <ConsoleBlock />
            <NavGroups onNavigate={() => setDrawerOpen(false)} />
            <SidebarFoot />
          </div>
        </>
      )}

      <div className="ad-main">
        <header className="ad-topbar">
          <button
            type="button"
            className="btn btn-icon ad-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <Icon name="menu" size={21} />
          </button>

          <div className="ad-topbar-title">
            <h1>{meta.title}</h1>
            {meta.crumb && <span className="ad-topbar-crumb">{meta.crumb}</span>}
          </div>

          <GlobalSearch />

          <div className="ad-topbar-actions">
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-icon ad-alert-btn"
                aria-label="Operational alerts"
                aria-expanded={alertsOpen}
                onClick={() => {
                  setAlertsOpen((v) => !v);
                  setProfileOpen(false);
                }}
              >
                <Icon name="bell" size={19} />
                <span className="ad-alert-pip" aria-hidden="true" />
              </button>
              <AlertsMenu open={alertsOpen} onClose={() => setAlertsOpen(false)} />
            </div>

            <div className="profile">
              <button
                type="button"
                className="profile-btn"
                aria-label="Staff account menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setAlertsOpen(false);
                }}
              >
                <Avatar name={user.name} initials={user.initials} size="sm" tone="accent" />
                <span className="profile-name">{user.name}</span>
                <Icon name="chevronDown" size={15} className="chevron" />
              </button>
              <ProfileMenu open={profileOpen} onClose={() => setProfileOpen(false)} onSignOut={handleSignOut} />
            </div>
          </div>
        </header>

        <main className="ad-page" id="admin-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
