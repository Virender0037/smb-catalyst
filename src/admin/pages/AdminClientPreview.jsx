import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, EmptyState } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Logo from '../../components/ui/Logo';
import Sparkline from '../../components/charts/Sparkline';
import { PageHeader, PrototypeNote, Section } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { portalUserRoles } from '../data';
import { fileClass } from '../lib/adminFormat';
import { formatNumber } from '../../lib/format';

/** Portal-user role name -> the role record in Roles & Permissions. */
const ROLE_IDS = {
  Owner: 'owner',
  'Practice Administrator': 'practice-admin',
  'Outside Advisor': 'outside-advisor',
};

/**
 * PREVIEW AS CLIENT — read-only.
 *
 * This is an admin-owned simulation of the client portal, rendered from the
 * client's own visibility settings. It deliberately does NOT sign anybody into
 * the real client portal and changes nothing: it exists so staff can confirm
 * what a given role will and will not see before a visibility change goes out.
 */
export default function AdminClientPreview() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const state = useAdminState();
  const client = state.clientById(clientId);
  const [role, setRole] = useState('Owner');

  const users = useMemo(() => (client ? state.usersForClient(client.id) : []), [client, state]);
  const documents = useMemo(() => (client ? state.documentsForClient(client.id) : []), [client, state]);
  const requests = useMemo(() => (client ? state.requestsForClient(client.id) : []), [client, state]);
  const listing = useMemo(() => (client ? state.listingForClient(client.id) : null), [client, state]);

  if (!client) {
    return (
      <Section>
        <EmptyState icon="building" title="Client not found" />
      </Section>
    );
  }

  const vis = client.visibility;

  /* Capabilities come from the live Roles & Permissions matrix, so a change
     there is reflected here immediately — that is the whole point of the
     preview. ROLE_IDS maps the user-facing role name to its role record. */
  const roleRecord = state.roles.find((r) => r.id === ROLE_IDS[role]);
  const perms = roleRecord?.permissions ?? {};
  const can = {
    overview: perms['view-overview'],
    financials: perms['view-financials'],
    dealTerms: perms['view-deal-terms'],
    buyers: perms['view-buyer-activity'],
    identities: perms['view-buyer-identities'],
    marketing: perms['view-marketing'],
    documents: perms['view-documents'],
    download: perms['download-documents'],
    requests: perms['view-requests'],
  };

  const showBuyers = vis.buyerActivity && can.buyers && vis.buyerIdentities !== 'Hidden';
  const showMarketing = vis.marketingActivity && can.marketing && Boolean(listing);

  const visibleDocs = !can.documents
    ? []
    : documents.filter((d) => {
        if (d.archived) return false;
        if (d.visibility === 'Internal only') return false;
        if (vis.documentCategories[d.category] === false) return false;
        if (d.visibility === 'Restricted by role' && !d.restrictedRoles.includes(role)) return false;
        if (d.category === 'Financials' && !can.financials) return false;
        if (d.category === 'Valuation' && !can.financials) return false;
        return true;
      });

  const visibleRequests = can.requests
    ? requests.filter((r) => r.status !== 'Completed' || r.completedOn)
    : [];

  /* Named buyers need BOTH the client's setting and the role's permission. */
  const namedBuyers = vis.buyerIdentities === 'Named' && can.identities;
  const buyerLabel = (i) => (namedBuyers ? `Buyer ${i + 1} — named group` : `Buyer #${i + 1}`);

  const hiddenCount = documents.length - visibleDocs.length;

  return (
    <>
      <PageHeader
        back={
          <button
            type="button"
            className="ad-back"
            onClick={() => navigate(`/admin/clients/${client.id}`)}
            aria-label="Back to Client 360"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
        }
        eyebrow="Preview as client"
        title={client.practice.name}
        sub="A read-only rendering of what this client's portal shows, built from their visibility settings. Nothing here signs in as the client and nothing is changed."
        actions={
          <Button variant="secondary" icon="settings" onClick={() => navigate(`/admin/clients/${client.id}`)}>
            Edit visibility
          </Button>
        }
      />

      <div className="ad-preview-bar">
        <div className="ad-preview-bar-copy">
          <Icon name="eye" size={20} />
          <div style={{ minWidth: 0 }}>
            <p className="ad-preview-bar-title">Previewing as {role}</p>
            <p className="ad-preview-bar-text">
              Read-only · {visibleDocs.length} of {documents.length} documents visible
              {hiddenCount > 0 ? ` · ${hiddenCount} hidden by visibility rules` : ''}
            </p>
          </div>
        </div>
        <div className="chip-row">
          {portalUserRoles.map((r) => (
            <button key={r} type="button" className="chip" aria-pressed={role === r} onClick={() => setRole(r)}>
              {r}
              <span className="chip-count">{users.filter((u) => u.role === r).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ad-preview-frame">
        <div className="ad-preview-chrome">
          <span className="ad-preview-dot" />
          <span className="ad-preview-dot" />
          <span className="ad-preview-dot" />
          <span className="ad-preview-url">
            https://portal.strategicmedicalbrokers.com/overview — {client.owner}
          </span>
          <Badge tone="neutral">Read-only preview</Badge>
        </div>

        <div className="ad-preview-body">
          {/* ---------------------------------------------- client hero */}
          <div className="engagement">
            <div className="eng-top">
              <div style={{ minWidth: 0 }}>
                <Logo height={30} />
                <h3 className="eng-practice">{client.practice.name}</h3>
                <p className="eng-meta">
                  <span>{client.owner}</span>
                  <span className="eng-meta-sep" aria-hidden="true" />
                  <span>{client.engagementRef}</span>
                  <span className="eng-meta-sep" aria-hidden="true" />
                  <span>{client.practice.location}</span>
                </p>
              </div>
              {vis.overviewFields.nextMilestone && (
                <div className="eng-next">
                  <p className="eng-next-label">Next milestone</p>
                  <p className="eng-next-value">{client.nextMilestone}</p>
                  {vis.overviewFields.targetDate && <p className="eng-next-date">{client.targetDate}</p>}
                </div>
              )}
            </div>

            {vis.overviewFields.engagementStage && (
              <div className="stepper">
                <div className="stepper-foot" style={{ marginTop: 0 }}>
                  <span>
                    Current stage: <span className="stepper-progress-num">{client.crmStage}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------- overview fields */}
          <Section title="Engagement overview" sub="Fields the client can see on their overview screen.">
            <dl className="ad-details ad-details-2">
              {vis.overviewFields.engagementStage && (
                <div className="ad-detail">
                  <dt>Engagement stage</dt>
                  <dd>{client.crmStage}</dd>
                </div>
              )}
              {vis.overviewFields.nextMilestone && (
                <div className="ad-detail">
                  <dt>Next milestone</dt>
                  <dd>{client.nextMilestone}</dd>
                </div>
              )}
              {vis.overviewFields.targetDate && (
                <div className="ad-detail">
                  <dt>Target date</dt>
                  <dd>{client.targetDate}</dd>
                </div>
              )}
              {vis.overviewFields.advisorContact && (
                <div className="ad-detail">
                  <dt>Your deal team</dt>
                  <dd>Strategic Medical Brokers · (602) 555-0100</dd>
                </div>
              )}
              {vis.overviewFields.valuationRange && can.financials && (
                <div className="ad-detail">
                  <dt>Valuation range</dt>
                  <dd>Available in the valuation report</dd>
                </div>
              )}
              {vis.overviewFields.dealTerms && can.dealTerms && (
                <div className="ad-detail">
                  <dt>Headline deal terms</dt>
                  <dd>Under negotiation</dd>
                </div>
              )}
            </dl>

            {Object.values(vis.overviewFields).every((v) => !v) && (
              <div className="ad-hidden-note">
                <Icon name="eyeOff" size={18} />
                Every overview field is currently hidden for this client.
              </div>
            )}
          </Section>

          {/* ---------------------------------------------- buyer activity */}
          <Section title="Buyer activity">
            {showBuyers ? (
              <>
                <div className="ad-kv-strip" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
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
                </div>
                <div className="ad-chip-list" style={{ marginTop: 'var(--sp-4)' }}>
                  {Array.from({ length: Math.min(client.buyerActivity.activeDiligence + 2, 6) }).map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span className="ad-tag" key={i}>
                      <Icon name="briefcase" size={13} />
                      {buyerLabel(i)}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="ad-hidden-note">
                <Icon name="eyeOff" size={18} />
                {!can.buyers
                  ? `Buyer activity is not available to the ${role} role.`
                  : 'Buyer activity is hidden for this client.'}
              </div>
            )}
          </Section>

          {/* ---------------------------------------------- marketing */}
          <Section title="Marketing activity">
            {showMarketing ? (
              <>
                <div className="ad-kv-strip">
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
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <Sparkline values={listing.trend} height={48} />
                </div>
              </>
            ) : (
              <div className="ad-hidden-note">
                <Icon name="eyeOff" size={18} />
                {!can.marketing
                  ? `Marketing activity is not available to the ${role} role.`
                  : listing
                    ? 'Marketing activity is hidden for this client.'
                    : 'No listing is assigned to this engagement.'}
              </div>
            )}
          </Section>

          {/* ---------------------------------------------- documents */}
          <Section title="Documents" sub={`${visibleDocs.length} visible to the ${role} role.`} flush>
            {visibleDocs.length === 0 ? (
              <div style={{ padding: 'var(--sp-5)' }}>
                <div className="ad-hidden-note">
                  <Icon name="eyeOff" size={18} />
                  {can.documents
                    ? 'No documents are visible to this role under the current settings.'
                    : `Documents are not available to the ${role} role.`}
                </div>
              </div>
            ) : (
              visibleDocs.map((d) => (
                <div className="ad-mini-row" key={d.id}>
                  <span className={`file-icon ${fileClass(d.type)}`} aria-hidden="true">
                    {d.type}
                  </span>
                  <div className="ad-mini-body">
                    <p className="ad-mini-title">{d.name}</p>
                    <p className="ad-mini-meta">
                      {d.category} · {d.uploadedOn} · {d.size}
                    </p>
                  </div>
                  {!can.download ? (
                    <Badge tone="neutral">View only</Badge>
                  ) : (
                    d.watermark && (
                      <Badge tone="info">
                        <Icon name="droplet" size={12} /> Watermarked
                      </Badge>
                    )
                  )}
                </div>
              ))
            )}
          </Section>

          {/* ---------------------------------------------- requests */}
          <Section title="Requests" sub="What this client is being asked for." flush>
            {visibleRequests.length === 0 ? (
              <div style={{ padding: 'var(--sp-5)' }}>
                <div className="ad-hidden-note">
                  <Icon name="eyeOff" size={18} />
                  {can.requests ? 'No requests to show.' : `Requests are not available to the ${role} role.`}
                </div>
              </div>
            ) : (
              visibleRequests.map((r) => (
                <div className="ad-mini-row" key={r.id}>
                  <div className="ad-mini-body">
                    <p className="ad-mini-title">{r.title}</p>
                    <p className="ad-mini-meta">
                      {r.category} · Due {r.dueDate}
                    </p>
                  </div>
                  <Badge tone="neutral">{r.status}</Badge>
                </div>
              ))
            )}
          </Section>
        </div>
      </div>

      <PrototypeNote icon="shield">
        This preview is a faithful rendering of the visibility rules, not a live session. It does not sign anybody
        in, does not appear in the client's activity log, and changes nothing. The production build will offer the
        same preview plus an audited “view as” session for support cases.
      </PrototypeNote>
    </>
  );
}
