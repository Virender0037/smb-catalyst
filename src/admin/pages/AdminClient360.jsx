import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, EmptyState } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Sparkline from '../../components/charts/Sparkline';
import DataTable from '../components/DataTable';
import { ActionMenu, DetailList, PageHeader, PrototypeNote, Section, Toggle } from '../components/controls';
import InviteUserDialog from '../dialogs/InviteUserDialog';
import CreateRequestDialog from '../dialogs/CreateRequestDialog';
import UploadDocumentDialog from '../dialogs/UploadDocumentDialog';
import { useAdminState } from '../lib/adminState';
import { engagementStages, staffById } from '../data';
import { activityEventTypes } from '../data/activity';
import {
  accountStatusTone,
  crmStatusTone,
  docStatusTone,
  dueLabel,
  fileClass,
  invitationTone,
  marketingStatusTone,
  portalStatusTone,
  priorityTone,
  requestStatusTone,
  stageTone,
  visibilityTone,
} from '../lib/adminFormat';
import { formatNumber } from '../../lib/format';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'visibility', label: 'Portal Visibility' },
  { id: 'users', label: 'Users' },
  { id: 'documents', label: 'Documents' },
  { id: 'requests', label: 'Requests' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'activity', label: 'Activity' },
];

const markFor = (type) => activityEventTypes.find((t) => t.id === type) ?? { icon: 'activity', tone: 'neutral' };

/* ---------------------------------------------------------------- stepper */
function StageStepper({ current }) {
  const currentIndex = engagementStages.indexOf(current);
  return (
    <div className="stepper" style={{ marginTop: 0 }}>
      <div className="stepper-track">
        {engagementStages.map((s, i) => {
          const done = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div
              key={s}
              className={`stepper-seg ${done ? 'stepper-seg-done' : ''} ${isCurrent ? 'stepper-seg-current' : ''}`}
            >
              <div className="stepper-bar" style={{ background: '#E7ECF2' }}>
                <div
                  className="stepper-bar-fill"
                  style={{
                    width: done ? '100%' : isCurrent ? '55%' : '0%',
                    background: done ? 'var(--brand-primary)' : 'var(--brand-accent)',
                  }}
                />
              </div>
              <span
                className="stepper-label"
                style={{ color: isCurrent ? 'var(--smb-text)' : 'var(--smb-text-3)' }}
                title={s}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminClient360() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const state = useAdminState();
  const [tab, setTab] = useState('overview');
  const [dialog, setDialog] = useState(null);

  const client = state.clientById(clientId);

  const users = useMemo(() => (client ? state.usersForClient(client.id) : []), [client, state]);
  const documents = useMemo(() => (client ? state.documentsForClient(client.id) : []), [client, state]);
  const requests = useMemo(() => (client ? state.requestsForClient(client.id) : []), [client, state]);
  const listing = useMemo(() => (client ? state.listingForClient(client.id) : null), [client, state]);
  const events = useMemo(() => (client ? state.activityForClient(client.id) : []), [client, state]);

  if (!client) {
    return (
      <Section>
        <EmptyState
          icon="building"
          title="Client not found"
          text="This client reference does not exist in the prototype data set."
          action={
            <Button variant="secondary" onClick={() => navigate('/admin/clients')}>
              Back to clients
            </Button>
          }
        />
      </Section>
    );
  }

  const openRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Overdue');
  const visibleDocs = documents.filter(
    (d) => d.visibility !== 'Internal only' && client.visibility.documentCategories[d.category] !== false,
  );
  const lead = staffById(client.leadAdvisorId);
  const support = staffById(client.supportAdvisorId);

  const setVis = (mutate) => state.updateVisibility(client.id, mutate);

  return (
    <>
      <PageHeader
        back={
          <button
            type="button"
            className="ad-back"
            onClick={() => navigate('/admin/clients')}
            aria-label="Back to clients"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
        }
        eyebrow={`${client.id} · ${client.engagementRef}`}
        title={client.practice.name}
        sub={`${client.owner} · ${client.ownerTitle} · ${client.practice.specialty} · ${client.practice.location}`}
        actions={
          <>
            <Button variant="primary" icon="eye" onClick={() => navigate(`/admin/clients/${client.id}/preview`)}>
              Preview as client
            </Button>
            <ActionMenu
              label="Client actions"
              items={[
                { label: 'Invite portal user', icon: 'mail', onClick: () => setDialog('invite') },
                { label: 'Create request', icon: 'request', onClick: () => setDialog('request') },
                { label: 'Upload document', icon: 'upload', onClick: () => setDialog('upload') },
                { separator: true },
                {
                  label: client.portalStatus === 'Suspended' ? 'Restore portal access' : 'Suspend portal access',
                  icon: 'slash',
                  danger: client.portalStatus !== 'Suspended',
                  onClick: () =>
                    state.updateClient(client.id, {
                      portalStatus: client.portalStatus === 'Suspended' ? 'Active' : 'Suspended',
                    }),
                },
              ]}
            />
          </>
        }
      />

      {/* ---------------------------------------------------- summary strip */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="ad-kv-strip" style={{ borderTop: 'none' }}>
          <div className="ad-kv">
            <p className="ad-kv-label">Engagement stage</p>
            <p className="ad-kv-value" style={{ fontSize: 'var(--fs-md)' }}>
              <Badge tone={stageTone(client.crmStage)}>{client.crmStage}</Badge>
            </p>
            <p className="ad-kv-note">
              <Badge tone={crmStatusTone(client.crmStatus)} dot>
                {client.crmStatus}
              </Badge>
            </p>
          </div>
          <div className="ad-kv">
            <p className="ad-kv-label">Next milestone</p>
            <p className="ad-kv-value" style={{ fontSize: 'var(--fs-md)' }}>
              {client.nextMilestone}
            </p>
            <p className="ad-kv-note">Target {client.targetDate}</p>
          </div>
          <div className="ad-kv">
            <p className="ad-kv-label">Portal</p>
            <p className="ad-kv-value" style={{ fontSize: 'var(--fs-md)' }}>
              <Badge tone={portalStatusTone(client.portalStatus)}>{client.portalStatus}</Badge>
            </p>
            <p className="ad-kv-note">
              {users.filter((u) => u.accountStatus === 'Active').length} active of {users.length} users
            </p>
          </div>
          <div className="ad-kv">
            <p className="ad-kv-label">Outstanding requests</p>
            <p className="ad-kv-value">{openRequests.length}</p>
            <p className="ad-kv-note">
              {requests.filter((r) => r.status === 'Overdue').length} overdue ·{' '}
              {requests.filter((r) => r.status === 'Received').length} awaiting review
            </p>
          </div>
        </div>

        <nav className="ad-tabs" role="tablist" aria-label="Client 360 sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className="ad-tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'users' && <span className="ad-tab-count">{users.length}</span>}
              {t.id === 'documents' && <span className="ad-tab-count">{documents.length}</span>}
              {t.id === 'requests' && <span className="ad-tab-count">{requests.length}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* ==================================================== OVERVIEW */}
      {tab === 'overview' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section title="Engagement" sub={`Engaged ${client.engagedOn} · ${client.engagementType}`}>
              <StageStepper current={client.crmStage} />
              <div style={{ marginTop: 'var(--sp-6)' }}>
                <DetailList
                  columns={2}
                  items={[
                    { label: 'Engagement reference', value: client.engagementRef },
                    {
                      label: 'CRM status',
                      value: <Badge tone={crmStatusTone(client.crmStatus)}>{client.crmStatus}</Badge>,
                    },
                    { label: 'Next milestone', value: client.nextMilestone },
                    { label: 'Target date', value: client.targetDate },
                    { label: 'Lead advisor', value: lead ? `${lead.name} — ${lead.role}` : '—' },
                    { label: 'Supporting advisor', value: support ? `${support.name} — ${support.role}` : '—' },
                    client.notes && { label: 'Internal notes', value: client.notes, full: true },
                  ]}
                />
              </div>
            </Section>

            <Section title="Client & practice details">
              <DetailList
                columns={2}
                items={[
                  { label: 'Owner', value: `${client.owner} · ${client.ownerTitle}` },
                  { label: 'Email', value: client.ownerEmail },
                  { label: 'Phone', value: client.ownerPhone },
                  { label: 'Practice', value: client.practice.name },
                  { label: 'Specialty', value: client.practice.specialty },
                  { label: 'Location', value: client.practice.location },
                  { label: 'Sites', value: `${client.practice.locations} location(s)` },
                  { label: 'Providers', value: client.practice.providers },
                  { label: 'Established', value: client.practice.established },
                  { label: 'Annual revenue', value: client.practice.annualRevenue },
                  { label: 'EBITDA', value: client.practice.ebitda },
                  { label: 'Client reference', value: client.id },
                ]}
              />
            </Section>

            <Section
              title="Outstanding requests"
              sub="What the client still owes SMB."
              actions={
                <Button variant="secondary" size="sm" icon="plus" onClick={() => setDialog('request')}>
                  New request
                </Button>
              }
              flush
            >
              {openRequests.length === 0 ? (
                <EmptyState icon="checkCircle" title="Nothing outstanding" text="This client has no open requests." />
              ) : (
                openRequests.map((r) => (
                  <div className="ad-mini-row" key={r.id}>
                    <div className="ad-mini-body">
                      <p className="ad-mini-title">{r.title}</p>
                      <p className="ad-mini-meta">
                        {r.category} · Due {r.dueDate} · {dueLabel(r.dueDate)}
                      </p>
                    </div>
                    <Badge tone={priorityTone(r.priority)}>{r.priority}</Badge>
                    <Badge tone={requestStatusTone(r.status)}>{r.status}</Badge>
                  </div>
                ))
              )}
            </Section>

            <Section title="Recent activity" sub="Latest events on this engagement." flush>
              <div className="ad-timeline">
                {events.slice(0, 6).map((e) => {
                  const mark = markFor(e.type);
                  return (
                    <div className="ad-event" key={e.id}>
                      <span className={`ad-event-mark ad-event-mark-${mark.tone}`}>
                        <Icon name={mark.icon} size={16} />
                      </span>
                      <div className="ad-event-body">
                        <p className="ad-event-title">{e.summary}</p>
                        {e.detail && <p className="ad-event-detail">{e.detail}</p>}
                        <p className="ad-event-meta">
                          <span>{e.actor}</span>
                          <span>·</span>
                          <span>{e.actorType}</span>
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
                {events.length === 0 && <EmptyState icon="activity" title="No activity yet" />}
              </div>
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Buyer activity" sub="Traction from the buyer side of the engagement." flush>
              <div className="ad-kv-strip" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div className="ad-kv">
                  <p className="ad-kv-label">NDAs executed</p>
                  <p className="ad-kv-value">{client.buyerActivity.ndas}</p>
                </div>
                <div className="ad-kv">
                  <p className="ad-kv-label">CIM views</p>
                  <p className="ad-kv-value">{client.buyerActivity.cimViews}</p>
                </div>
                <div className="ad-kv">
                  <p className="ad-kv-label">Active diligence</p>
                  <p className="ad-kv-value">{client.buyerActivity.activeDiligence}</p>
                </div>
                <div className="ad-kv">
                  <p className="ad-kv-label">Indications</p>
                  <p className="ad-kv-value">{client.buyerActivity.indications}</p>
                </div>
              </div>
              <div style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                <p className="ad-cell-sub">
                  Buyer identities are shown to this client as: <strong>{client.visibility.buyerIdentities}</strong>
                </p>
              </div>
            </Section>

            <Section
              title="Marketing summary"
              sub={listing ? `${listing.listingId} · ${listing.periodLabel}` : 'No listing assigned'}
              actions={
                <Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => navigate('/admin/marketing')}>
                  Manage
                </Button>
              }
              flush
            >
              {listing ? (
                <>
                  <div className="ad-kv-strip" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Impressions</p>
                      <p className="ad-kv-value">{formatNumber(listing.impressions)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Detail views</p>
                      <p className="ad-kv-value">{formatNumber(listing.detailViews)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Leads</p>
                      <p className="ad-kv-value">{formatNumber(listing.leads)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Favourites</p>
                      <p className="ad-kv-value">{formatNumber(listing.favorites)}</p>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                    <Sparkline values={listing.trend} height={40} />
                    <p className="ad-cell-sub" style={{ marginTop: 8 }}>
                      <Badge tone={marketingStatusTone(listing.status)}>{listing.status}</Badge> Last synchronised{' '}
                      {listing.lastSync}
                    </p>
                  </div>
                </>
              ) : (
                <EmptyState
                  icon="chart"
                  title="No listing assigned"
                  text="Assign a listing from Marketing Activity to report performance to this client."
                />
              )}
            </Section>

            <Section title="Portal users" sub={`${users.length} people can reach this engagement.`} flush>
              {users.length === 0 ? (
                <EmptyState
                  icon="team"
                  title="No portal users"
                  text="Invite the owner to open the portal for this engagement."
                  action={
                    <Button variant="secondary" size="sm" icon="mail" onClick={() => setDialog('invite')}>
                      Invite user
                    </Button>
                  }
                />
              ) : (
                users.map((u) => (
                  <div className="ad-mini-row" key={u.id}>
                    <Avatar name={u.name} size="sm" tone="soft" />
                    <div className="ad-mini-body">
                      <p className="ad-mini-title">{u.name}</p>
                      <p className="ad-mini-meta">
                        {u.role} · {u.lastLogin ? `Last login ${u.lastLogin}` : 'Never signed in'}
                      </p>
                    </div>
                    <Badge tone={accountStatusTone(u.accountStatus)}>{u.accountStatus}</Badge>
                  </div>
                ))
              )}
            </Section>
          </div>
        </div>
      )}

      {/* ==================================================== VISIBILITY */}
      {tab === 'visibility' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section
              title="Fields visible to the client"
              sub="Overrides the portal-wide defaults in Settings → Client Experience for this engagement only."
            >
              {[
                ['engagementStage', 'Engagement stage', 'The pipeline stage name and progress bar.'],
                ['nextMilestone', 'Next milestone', 'The name of the next scheduled milestone.'],
                ['targetDate', 'Target date', 'The date attached to the next milestone.'],
                ['advisorContact', 'Deal team contact details', 'Lead advisor name, phone and email.'],
                ['valuationRange', 'Valuation range', 'Headline valuation range from the valuation report.'],
                ['dealTerms', 'Headline deal terms', 'Offer structure and terms under negotiation.'],
              ].map(([key, label, hint]) => (
                <Toggle
                  key={key}
                  label={label}
                  hint={hint}
                  checked={client.visibility.overviewFields[key]}
                  onChange={(v) =>
                    setVis((vis) => {
                      vis.overviewFields[key] = v;
                      return vis;
                    })
                  }
                />
              ))}
            </Section>

            <Section
              title="Documents visible to the client"
              sub={`${visibleDocs.length} of ${documents.length} filed documents currently reach this client's portal.`}
            >
              {Object.keys(client.visibility.documentCategories).map((cat) => {
                const count = documents.filter((d) => d.category === cat).length;
                return (
                  <Toggle
                    key={cat}
                    label={cat}
                    hint={`${count} document${count === 1 ? '' : 's'} filed in this category`}
                    checked={client.visibility.documentCategories[cat]}
                    onChange={(v) =>
                      setVis((vis) => {
                        vis.documentCategories[cat] = v;
                        return vis;
                      })
                    }
                  />
                );
              })}
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote icon="shield">
                  Category visibility is the coarse control. Individual documents can still be marked “Internal only”
                  or restricted to specific roles from the Documents screen — the stricter setting always wins.
                </PrototypeNote>
              </div>
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Buyer identity visibility" sub="How buyers are labelled everywhere this client can see them.">
              <div className="field">
                <label className="field-label" htmlFor="buyer-identity">
                  Show buyers as
                </label>
                <select
                  id="buyer-identity"
                  className="select"
                  value={client.visibility.buyerIdentities}
                  onChange={(e) =>
                    setVis((vis) => {
                      vis.buyerIdentities = e.target.value;
                      return vis;
                    })
                  }
                >
                  <option value="Anonymised">Anonymised — Buyer #1, Buyer #2…</option>
                  <option value="Named">Named buyers</option>
                  <option value="Hidden">Hide buyer activity entirely</option>
                </select>
                <p className="field-hint">
                  Named buyers should only be enabled where the client has asked for it in writing.
                </p>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Toggle
                  label="Show buyer activity counts"
                  hint="NDA count, CIM views and diligence progress."
                  checked={client.visibility.buyerActivity}
                  onChange={(v) =>
                    setVis((vis) => {
                      vis.buyerActivity = v;
                      return vis;
                    })
                  }
                />
                <Toggle
                  label="Show marketing activity"
                  hint="Listing impressions, detail views, leads and favourites."
                  checked={client.visibility.marketingActivity}
                  onChange={(v) =>
                    setVis((vis) => {
                      vis.marketingActivity = v;
                      return vis;
                    })
                  }
                />
              </div>
            </Section>

            <Section title="What the client sees" sub="A summary of the effect of the settings on this page.">
              <DetailList
                items={[
                  {
                    label: 'Overview fields shown',
                    value: Object.values(client.visibility.overviewFields).filter(Boolean).length,
                  },
                  { label: 'Buyer identities', value: client.visibility.buyerIdentities },
                  { label: 'Marketing tab', value: client.visibility.marketingActivity ? 'Visible' : 'Hidden' },
                  { label: 'Buyer activity', value: client.visibility.buyerActivity ? 'Visible' : 'Hidden' },
                  {
                    label: 'Document categories visible',
                    value: `${Object.values(client.visibility.documentCategories).filter(Boolean).length} of ${
                      Object.keys(client.visibility.documentCategories).length
                    }`,
                  },
                  { label: 'Documents reaching the client', value: `${visibleDocs.length} of ${documents.length}` },
                ]}
              />
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Button
                  variant="primary"
                  icon="eye"
                  block
                  onClick={() => navigate(`/admin/clients/${client.id}/preview`)}
                >
                  Preview as client
                </Button>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ==================================================== USERS */}
      {tab === 'users' && (
        <Section
          title="Portal users"
          sub="People with access to this engagement."
          actions={
            <Button variant="primary" size="sm" icon="mail" onClick={() => setDialog('invite')}>
              Invite user
            </Button>
          }
          flush
        >
          <DataTable
            minWidth={900}
            caption="Portal users for this client"
            rows={users}
            columns={[
              {
                key: 'name',
                header: 'Name',
                primary: true,
                width: '26%',
                cell: (u) => (
                  <div className="ad-cell-main">
                    <Avatar name={u.name} size="sm" tone="soft" />
                    <div style={{ minWidth: 0 }}>
                      <div className="ad-cell-title">{u.name}</div>
                      <div className="ad-cell-sub">{u.email}</div>
                    </div>
                  </div>
                ),
              },
              { key: 'role', header: 'Role', width: '18%', cell: (u) => u.role },
              {
                key: 'status',
                header: 'Account',
                width: '15%',
                cardBadge: true,
                cell: (u) => <Badge tone={accountStatusTone(u.accountStatus)}>{u.accountStatus}</Badge>,
              },
              {
                key: 'invite',
                header: 'Invitation',
                width: '14%',
                cell: (u) => <Badge tone={invitationTone(u.invitationStatus)}>{u.invitationStatus}</Badge>,
              },
              { key: 'login', header: 'Last login', width: '17%', nowrap: true, cell: (u) => u.lastLogin ?? 'Never' },
              { key: 'mfa', header: 'MFA', width: '10%', cell: (u) => u.mfa },
            ]}
            empty={
              <EmptyState
                icon="team"
                title="No portal users"
                text="Invite the owner to open the portal for this engagement."
              />
            }
          />
        </Section>
      )}

      {/* ==================================================== DOCUMENTS */}
      {tab === 'documents' && (
        <Section
          title="Documents"
          sub="Everything filed against this engagement."
          actions={
            <Button variant="primary" size="sm" icon="upload" onClick={() => setDialog('upload')}>
              Upload
            </Button>
          }
          flush
        >
          <DataTable
            minWidth={940}
            caption="Documents for this client"
            rows={documents}
            columns={[
              {
                key: 'name',
                header: 'Document',
                primary: true,
                width: '34%',
                cell: (d) => (
                  <div className="ad-cell-main">
                    <span className={`file-icon ${fileClass(d.type)}`} aria-hidden="true">
                      {d.type}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="ad-cell-title">{d.name}</div>
                      <div className="ad-cell-sub">
                        {d.type.toUpperCase()} · {d.size} · v{d.version}
                      </div>
                    </div>
                  </div>
                ),
              },
              { key: 'cat', header: 'Category', width: '15%', cell: (d) => d.category },
              {
                key: 'vis',
                header: 'Visibility',
                width: '16%',
                cardBadge: true,
                cell: (d) => <Badge tone={visibilityTone(d.visibility)}>{d.visibility}</Badge>,
              },
              { key: 'by', header: 'Uploaded by', width: '18%', cell: (d) => `${d.uploadedBy} (${d.uploadedByType})` },
              { key: 'on', header: 'Date', width: '12%', nowrap: true, cell: (d) => d.uploadedOn },
              {
                key: 'status',
                header: 'Status',
                width: '10%',
                cell: (d) => <Badge tone={docStatusTone(d.status)}>{d.status}</Badge>,
              },
            ]}
            empty={<EmptyState icon="document" title="No documents filed yet" />}
          />
        </Section>
      )}

      {/* ==================================================== REQUESTS */}
      {tab === 'requests' && (
        <Section
          title="Requests"
          sub="Everything SMB has asked this client for."
          actions={
            <Button variant="primary" size="sm" icon="plus" onClick={() => setDialog('request')}>
              New request
            </Button>
          }
          flush
        >
          <DataTable
            minWidth={900}
            caption="Requests for this client"
            rows={requests}
            columns={[
              {
                key: 'title',
                header: 'Request',
                primary: true,
                width: '38%',
                cell: (r) => (
                  <div style={{ minWidth: 0 }}>
                    <div className="ad-cell-title">{r.title}</div>
                    <div className="ad-cell-sub">
                      {r.category} · Assigned to {r.assignedTo || 'any portal user'}
                    </div>
                  </div>
                ),
              },
              {
                key: 'priority',
                header: 'Priority',
                width: '12%',
                cell: (r) => <Badge tone={priorityTone(r.priority)}>{r.priority}</Badge>,
              },
              {
                key: 'status',
                header: 'Status',
                width: '13%',
                cardBadge: true,
                cell: (r) => <Badge tone={requestStatusTone(r.status)}>{r.status}</Badge>,
              },
              { key: 'created', header: 'Created', width: '12%', nowrap: true, cell: (r) => r.createdOn },
              {
                key: 'due',
                header: 'Due',
                width: '15%',
                nowrap: true,
                cell: (r) => (
                  <div className="ad-cell-stack">
                    <span>{r.dueDate}</span>
                    {(r.status === 'Pending' || r.status === 'Overdue') && (
                      <span className="ad-cell-sub">{dueLabel(r.dueDate)}</span>
                    )}
                  </div>
                ),
              },
              { key: 'done', header: 'Completed', width: '10%', nowrap: true, cell: (r) => r.completedOn ?? '—' },
            ]}
            empty={<EmptyState icon="request" title="No requests raised yet" />}
          />
        </Section>
      )}

      {/* ==================================================== MARKETING */}
      {tab === 'marketing' && (
        <Section
          title="Marketing activity"
          sub="Listing performance for this engagement."
          actions={
            <Button variant="secondary" size="sm" iconRight="arrowRight" onClick={() => navigate('/admin/marketing')}>
              Open Marketing Activity
            </Button>
          }
        >
          {listing ? (
            <>
              <DetailList
                columns={2}
                items={[
                  { label: 'Listing name', value: listing.name },
                  { label: 'Listing ID', value: listing.listingId },
                  {
                    label: 'Status',
                    value: <Badge tone={marketingStatusTone(listing.status)}>{listing.status}</Badge>,
                  },
                  { label: 'Reporting period', value: listing.periodLabel },
                  { label: 'Published', value: listing.publishedOn },
                  { label: 'Last synchronised', value: listing.lastSync },
                  {
                    label: 'Visible to this client',
                    value: listing.clientVisible ? 'Yes' : 'No — hidden in the client portal',
                  },
                  { label: 'Mapping confirmed', value: listing.mappingConfirmed ? 'Yes' : 'Not confirmed' },
                ]}
              />
              <div style={{ marginTop: 'var(--sp-5)' }}>
                <Sparkline values={listing.trend} height={60} />
              </div>
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote icon="chart">
                  All listing figures are mock data. No BizBuySell integration or scraping exists in this build.
                </PrototypeNote>
              </div>
            </>
          ) : (
            <EmptyState
              icon="chart"
              title="No listing assigned"
              text="This engagement has no marketing listing mapped to it yet."
              action={
                <Button variant="secondary" size="sm" onClick={() => navigate('/admin/marketing')}>
                  Assign a listing
                </Button>
              }
            />
          )}
        </Section>
      )}

      {/* ==================================================== ACTIVITY */}
      {tab === 'activity' && (
        <Section title="Activity" sub="Every recorded event on this engagement." flush>
          <div className="ad-timeline">
            {events.map((e) => {
              const mark = markFor(e.type);
              return (
                <div className="ad-event" key={e.id}>
                  <span className={`ad-event-mark ad-event-mark-${mark.tone}`}>
                    <Icon name={mark.icon} size={16} />
                  </span>
                  <div className="ad-event-body">
                    <p className="ad-event-title">{e.summary}</p>
                    {e.detail && <p className="ad-event-detail">{e.detail}</p>}
                    <p className="ad-event-meta">
                      <span>{e.actor}</span>
                      <span>·</span>
                      <span>{e.actorType}</span>
                      {e.ip !== '—' && (
                        <>
                          <span>·</span>
                          <span>IP {e.ip}</span>
                        </>
                      )}
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
            {events.length === 0 && <EmptyState icon="activity" title="No activity recorded" />}
          </div>
        </Section>
      )}

      <InviteUserDialog open={dialog === 'invite'} onClose={() => setDialog(null)} clientId={client.id} />
      <CreateRequestDialog open={dialog === 'request'} onClose={() => setDialog(null)} clientId={client.id} />
      <UploadDocumentDialog open={dialog === 'upload'} onClose={() => setDialog(null)} clientId={client.id} />
    </>
  );
}
