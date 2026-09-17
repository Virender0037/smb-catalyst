import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Sparkline from '../../components/charts/Sparkline';
import { PageHeader, PrototypeNote, Section, StatTile } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import {
  attentionItems,
  dashboardKpis,
  marketingSummary,
  quickActions,
  recentPortalActivity,
  recentUploads,
  stageBreakdown,
} from '../data';
import { activityEventTypes } from '../data/activity';
import { docStatusTone, fileClass } from '../lib/adminFormat';
import { formatNumber } from '../../lib/format';
import InviteUserDialog from '../dialogs/InviteUserDialog';
import CreateRequestDialog from '../dialogs/CreateRequestDialog';
import UploadDocumentDialog from '../dialogs/UploadDocumentDialog';
import AddClientDialog from '../dialogs/AddClientDialog';

const markFor = (type) => activityEventTypes.find((t) => t.id === type) ?? { icon: 'activity', tone: 'neutral' };

export default function AdminDashboard() {
  const state = useAdminState();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null);

  const kpis = useMemo(() => dashboardKpis(state), [state]);
  const attention = useMemo(() => attentionItems(state), [state]);
  const stages = useMemo(() => stageBreakdown(state), [state]);
  const uploads = useMemo(() => recentUploads(state, 5), [state]);
  const portalActivity = useMemo(() => recentPortalActivity(state, 6), [state]);
  const marketing = useMemo(() => marketingSummary(state), [state]);

  /* Bars read as a share of the portfolio, not of the busiest stage — otherwise
     an evenly spread pipeline renders as eight identical full-width bars. */
  const stageTotal = stages.reduce((a, s) => a + s.count, 0) || 1;

  return (
    <>
      <PageHeader
        eyebrow={`Operations · ${state.today}`}
        title="Good morning, Daniel"
        sub="Everything below is drawn from the live admin state of this prototype. Start with the attention queue — it is the list of things only SMB can unblock."
        actions={
          <div className="ad-quick">
            {quickActions.map((a) => (
              <Button
                key={a.id}
                variant={a.variant}
                icon={a.icon}
                onClick={() => setDialog(a.id)}
              >
                {a.label}
              </Button>
            ))}
          </div>
        }
      />

      {/* -------------------------------------------------- KPIs */}
      <div className="ad-stat-grid">
        {kpis.map((k) => (
          <StatTile
            key={k.id}
            label={k.label}
            value={formatNumber(k.value)}
            note={k.note}
            icon={k.icon}
            tone={k.tone}
            onClick={() => navigate(k.to)}
          />
        ))}
      </div>

      <div className="ad-grid ad-grid-main">
        <div className="ad-col">
          {/* ---------------------------------------------- attention */}
          <Section
            title="Requires SMB attention"
            sub="Ranked by urgency. Every row links to the screen where it can be cleared."
            actions={<Badge tone={attention.length ? 'warn' : 'success'}>{attention.length} open</Badge>}
            flush
          >
            <div className="ad-attention-list">
              {attention.length === 0 && (
                <p className="ad-search-empty" style={{ padding: 'var(--sp-7)' }}>
                  Nothing outstanding across the portfolio.
                </p>
              )}
              {attention.map((item) => (
                <div className="ad-attention" key={item.id}>
                  <span className={`ad-attention-mark ad-attention-${item.severity}`}>
                    <Icon name={item.icon} size={17} />
                  </span>
                  <div className="ad-attention-body">
                    <p className="ad-attention-title">{item.title}</p>
                    <p className="ad-attention-detail">{item.detail}</p>
                  </div>
                  <div className="ad-attention-action">
                    <Button
                      variant="secondary"
                      size="sm"
                      iconRight="arrowRight"
                      onClick={() => navigate(item.to)}
                    >
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ---------------------------------------------- uploads */}
          <Section
            title="Recent client uploads"
            sub="Newest first, across every engagement."
            actions={
              <Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => navigate('/admin/documents/incoming')}>
                Open inbox
              </Button>
            }
            flush
          >
            {uploads.map((u) => (
              <div className="ad-mini-row" key={u.id}>
                <span className={`file-icon ${fileClass(u.type)}`} aria-hidden="true">
                  {u.type}
                </span>
                <div className="ad-mini-body">
                  <p className="ad-mini-title">{u.name}</p>
                  <p className="ad-mini-meta">
                    {state.clientName(u.clientId)} · {u.by} · {u.on}
                  </p>
                </div>
                <Badge tone={docStatusTone(u.status)}>{u.status}</Badge>
              </div>
            ))}
          </Section>

          {/* ---------------------------------------------- activity */}
          <Section
            title="Recent portal activity"
            sub="Client-side events only — staff actions are in the full audit timeline."
            actions={
              <Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => navigate('/admin/activity')}>
                View all
              </Button>
            }
            flush
          >
            <div className="ad-timeline">
              {portalActivity.map((e) => {
                const mark = markFor(e.type);
                return (
                  <div className="ad-event" key={e.id}>
                    <span className={`ad-event-mark ad-event-mark-${mark.tone}`}>
                      <Icon name={mark.icon} size={16} />
                    </span>
                    <div className="ad-event-body">
                      <p className="ad-event-title">{e.summary}</p>
                      <p className="ad-event-meta">
                        <span>{state.clientName(e.clientId)}</span>
                        <span>·</span>
                        <span>{e.actor}</span>
                      </p>
                    </div>
                    <span className="ad-event-time">
                      {e.date}
                      <br />
                      {e.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* ================================================ right rail */}
        <div className="ad-col">
          <Section title="Engagements by status" sub="Across all clients in the portfolio." >
            {stages.map((s) => (
              <div className="ad-stage-row" key={s.stage}>
                <div style={{ minWidth: 0 }}>
                  <span className="ad-stage-label">{s.stage}</span>
                  <div className="ad-stage-bar">
                    <div
                      className="ad-stage-fill"
                      style={{ width: `${Math.max((s.count / stageTotal) * 100, 3)}%` }}
                    />
                  </div>
                </div>
                <span className="ad-stage-count">{s.count}</span>
              </div>
            ))}
          </Section>

          <Section
            title="Marketing activity"
            sub={`${marketing.listings} listings · ${marketing.visibleToClients} visible to clients`}
            actions={
              <Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => navigate('/admin/marketing')}>
                Manage
              </Button>
            }
            flush
          >
            <div className="ad-kv-strip" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div className="ad-kv">
                <p className="ad-kv-label">Impressions</p>
                <p className="ad-kv-value">{formatNumber(marketing.impressions)}</p>
              </div>
              <div className="ad-kv">
                <p className="ad-kv-label">Detail views</p>
                <p className="ad-kv-value">{formatNumber(marketing.detailViews)}</p>
              </div>
              <div className="ad-kv">
                <p className="ad-kv-label">Leads</p>
                <p className="ad-kv-value">{formatNumber(marketing.leads)}</p>
              </div>
              <div className="ad-kv">
                <p className="ad-kv-label">Favourites</p>
                <p className="ad-kv-value">{formatNumber(marketing.favorites)}</p>
              </div>
            </div>

            {marketing.top.map((l) => (
              <Link className="ad-mini-row" to="/admin/marketing" key={l.id}>
                <div className="ad-mini-body">
                  <p className="ad-mini-title">{state.clientName(l.clientId)}</p>
                  <p className="ad-mini-meta">
                    {l.listingId} · {formatNumber(l.detailViews)} detail views
                  </p>
                </div>
                <span style={{ width: 74, flex: 'none' }}>
                  <Sparkline values={l.trend} height={26} />
                </span>
              </Link>
            ))}

            <div style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
              <PrototypeNote>
                Marketing figures are mock data. No BizBuySell integration exists in this build — last simulated
                sync {marketing.lastSync}.
              </PrototypeNote>
            </div>
          </Section>

          <Section title="Portfolio at a glance">
            <div className="ad-details">
              <div className="ad-detail">
                <dt>Clients with portal access</dt>
                <dd>
                  {state.clients.filter((c) => c.portalStatus === 'Active').length} of {state.clients.length}
                </dd>
              </div>
              <div className="ad-detail">
                <dt>Portal users</dt>
                <dd>
                  {state.portalUsers.filter((u) => u.accountStatus === 'Active').length} active ·{' '}
                  {state.portalUsers.length} total
                </dd>
              </div>
              <div className="ad-detail">
                <dt>Documents under management</dt>
                <dd>{state.documents.length} filed · {state.incoming.length} awaiting filing</dd>
              </div>
              <div className="ad-detail">
                <dt>Open requests</dt>
                <dd>
                  {state.requests.filter((r) => r.status === 'Pending' || r.status === 'Overdue').length} across{' '}
                  {new Set(
                    state.requests
                      .filter((r) => r.status === 'Pending' || r.status === 'Overdue')
                      .map((r) => r.clientId),
                  ).size}{' '}
                  clients
                </dd>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* -------------------------------------------------- dialogs */}
      <AddClientDialog open={dialog === 'add-client'} onClose={() => setDialog(null)} />
      <InviteUserDialog open={dialog === 'invite-user'} onClose={() => setDialog(null)} />
      <CreateRequestDialog open={dialog === 'create-request'} onClose={() => setDialog(null)} />
      <UploadDocumentDialog open={dialog === 'upload-document'} onClose={() => setDialog(null)} />
    </>
  );
}

