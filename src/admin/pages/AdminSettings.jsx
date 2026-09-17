import { useState } from 'react';
import { Badge, Button, Field, Select } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Logo from '../../components/ui/Logo';
import { DetailList, PageHeader, PrototypeNote, Section, Toggle } from '../components/controls';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';

const TABS = [
  { id: 'portal', label: 'Portal' },
  { id: 'experience', label: 'Client Experience' },
  { id: 'documents', label: 'Documents' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'security', label: 'Security' },
];

export default function AdminSettings() {
  const state = useAdminState();
  const { notify } = useToast();
  const [tab, setTab] = useState('portal');
  const s = state.settings;

  const save = () => notify('Settings saved to prototype state. Nothing is published.');

  const setPortal = (patch) => state.updateSettings('portal', patch);
  const setExperience = (patch) => state.updateSettings('clientExperience', patch);
  const setDocuments = (patch) => state.updateSettings('documents', patch);
  const setSecurity = (patch) => state.updateSettings('security', patch);

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        sub="Portal-wide defaults. Anything set here can be overridden for an individual client from Client 360 → Portal Visibility."
        actions={
          <Button variant="primary" icon="check" onClick={save}>
            Save settings
          </Button>
        }
      />

      <div className="card" style={{ overflow: 'hidden' }}>
        <nav className="ad-tabs" role="tablist" aria-label="Settings sections">
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
            </button>
          ))}
        </nav>
      </div>

      {/* ==================================================== PORTAL */}
      {tab === 'portal' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section title="Portal identity" sub="How the client portal names and addresses itself.">
              <div className="ad-form-grid">
                <Field
                  className="ad-form-full"
                  label="Portal name"
                  value={s.portal.name}
                  onChange={(e) => setPortal({ name: e.target.value })}
                />
                <Field label="Short name" value={s.portal.shortName} onChange={(e) => setPortal({ shortName: e.target.value })} />
                <Field
                  label="Subdomain"
                  value={s.portal.subdomain}
                  onChange={(e) => setPortal({ subdomain: e.target.value })}
                  hint={`https://${s.portal.subdomain}.${s.portal.domain}`}
                />
                <Field label="Client care line" value={s.portal.supportLine} onChange={(e) => setPortal({ supportLine: e.target.value })} />
                <Field label="Support hours" value={s.portal.supportHours} onChange={(e) => setPortal({ supportHours: e.target.value })} />
                <Field
                  className="ad-form-full"
                  label="Footer text"
                  value={s.portal.footerText}
                  onChange={(e) => setPortal({ footerText: e.target.value })}
                />
              </div>
            </Section>

            <Section title="Branding" sub="Colour and type are taken from the public website and the official logo artwork.">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-4)',
                  padding: 'var(--sp-4)',
                  border: '1px solid var(--smb-line)',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--smb-surface-2)',
                  flexWrap: 'wrap',
                }}
              >
                <Logo height={44} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 'var(--fs-base)', fontWeight: 600 }}>{s.portal.logoFile}</p>
                  <p className="ad-cell-sub">{s.portal.logoNote}</p>
                </div>
                <Button variant="secondary" size="sm" icon="upload" disabled title="Uploads are not available in this prototype">
                  Replace logo
                </Button>
              </div>

              <div className="ad-form-grid" style={{ marginTop: 'var(--sp-4)' }}>
                <div className="field">
                  <span className="field-label">Primary colour</span>
                  <div className="row">
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--r-sm)',
                        background: s.portal.primaryColor,
                        border: '1px solid var(--smb-line)',
                        flex: 'none',
                      }}
                    />
                    <span className="num">{s.portal.primaryColor}</span>
                  </div>
                </div>
                <div className="field">
                  <span className="field-label">Accent colour</span>
                  <div className="row">
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--r-sm)',
                        background: s.portal.accentColor,
                        border: '1px solid var(--smb-line)',
                        flex: 'none',
                      }}
                    />
                    <span className="num">{s.portal.accentColor}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <DetailList
                  columns={2}
                  items={[
                    { label: 'Heading typeface', value: s.portal.headingFont },
                    { label: 'Body typeface', value: s.portal.bodyFont },
                  ]}
                />
              </div>
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Addressing" sub="Where clients reach the portal.">
              <DetailList
                items={[
                  { label: 'Client portal', value: `https://${s.portal.subdomain}.${s.portal.domain}` },
                  { label: 'Admin console', value: `https://${s.portal.subdomain}.${s.portal.domain}/admin` },
                  { label: 'Hosting', value: 'Zoho Catalyst client hosting (static bundle)' },
                  { label: 'Certificate', value: 'Managed by the host' },
                ]}
              />
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote>
                  Subdomain and DNS are not configured by this screen. The values above describe the intended
                  production addressing for confirmation.
                </PrototypeNote>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ==================================================== EXPERIENCE */}
      {tab === 'experience' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section
              title="Overview fields"
              sub="The default set of fields every client sees on their overview screen."
            >
              {s.clientExperience.overviewFields.map((f) => (
                <Toggle
                  key={f.id}
                  label={f.label}
                  hint={f.locked ? 'Always shown — the portal is not useful without it.' : undefined}
                  disabled={f.locked}
                  checked={f.enabled}
                  onChange={(v) =>
                    setExperience((prev) => ({
                      ...prev,
                      overviewFields: prev.overviewFields.map((x) => (x.id === f.id ? { ...x, enabled: v } : x)),
                    }))
                  }
                />
              ))}
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Status & milestone visibility">
              <Select
                label="Engagement status"
                value={s.clientExperience.statusVisibility}
                onChange={(e) => setExperience({ statusVisibility: e.target.value })}
              >
                {s.clientExperience.statusVisibilityOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Select
                  label="Milestones"
                  value={s.clientExperience.milestoneVisibility}
                  onChange={(e) => setExperience({ milestoneVisibility: e.target.value })}
                >
                  {s.clientExperience.milestoneVisibilityOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Select
                  label="Buyer identities"
                  value={s.clientExperience.buyerIdentityVisibility}
                  onChange={(e) => setExperience({ buyerIdentityVisibility: e.target.value })}
                  hint="Named buyers should only be the default if SMB has agreed it across the board."
                >
                  {s.clientExperience.buyerIdentityOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote icon="info">{s.clientExperience.defaultNote}</PrototypeNote>
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ==================================================== DOCUMENTS */}
      {tab === 'documents' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section title="Categories" sub="The filing structure and the visibility each category defaults to.">
              <div className="ad-table-scroll">
                <table className="table ad-table" style={{ minWidth: 520 }}>
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Default visibility</th>
                      <th scope="col" className="td-right">
                        Documents
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.documents.categories.map((c) => (
                      <tr key={c.id}>
                        <td className="td-strong">
                          {c.label}
                          {c.locked && (
                            <span className="ad-cell-sub">
                              <Icon name="lock" size={11} /> required category
                            </span>
                          )}
                        </td>
                        <td>
                          <select
                            className="select ad-select"
                            aria-label={`Default visibility for ${c.label}`}
                            value={c.defaultVisibility}
                            onChange={(e) =>
                              setDocuments((prev) => ({
                                ...prev,
                                categories: prev.categories.map((x) =>
                                  x.id === c.id ? { ...x, defaultVisibility: e.target.value } : x,
                                ),
                              }))
                            }
                          >
                            <option>Client visible</option>
                            <option>Internal only</option>
                            <option>Restricted by role</option>
                          </select>
                        </td>
                        <td className="td-right num">
                          {state.documents.filter((d) => d.category === c.label).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Watermarking" sub="Applied when a client downloads a document.">
              <Toggle
                label="Watermark client downloads"
                hint="Not implemented in this prototype — these controls define the intended production behaviour."
                checked={s.documents.watermark.enabled}
                onChange={(v) =>
                  setDocuments((prev) => ({ ...prev, watermark: { ...prev.watermark, enabled: v } }))
                }
              />

              <div className="ad-form-grid" style={{ marginTop: 'var(--sp-4)' }}>
                <Select
                  label="Applies to"
                  value={s.documents.watermark.appliesTo}
                  onChange={(e) =>
                    setDocuments((prev) => ({ ...prev, watermark: { ...prev.watermark, appliesTo: e.target.value } }))
                  }
                >
                  {s.documents.watermark.appliesToOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Watermark content"
                  value={s.documents.watermark.content}
                  onChange={(e) =>
                    setDocuments((prev) => ({ ...prev, watermark: { ...prev.watermark, content: e.target.value } }))
                  }
                >
                  {s.documents.watermark.contentOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Visual indication of the planned watermark */}
              <div
                style={{
                  marginTop: 'var(--sp-4)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid var(--smb-line)',
                  borderRadius: 'var(--r-lg)',
                  background: '#fff',
                  padding: 'var(--sp-7) var(--sp-5)',
                  textAlign: 'center',
                }}
              >
                <p className="eyebrow">Preview</p>
                <p style={{ fontSize: 'var(--fs-md)', fontWeight: 600, marginTop: 6 }}>
                  Practice Valuation Report.pdf
                </p>
                <p className="ad-cell-sub">Page 1 of 24</p>
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    transform: 'rotate(-18deg)',
                    color: 'rgba(24, 112, 184, 0.16)',
                    fontSize: 'var(--fs-md)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  m.carter@westphoenixpc.com · 17 Sep 2026 09:14 MST
                </span>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote icon="droplet">{s.documents.watermark.note}</PrototypeNote>
              </div>
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Uploads" sub="What clients and staff are allowed to send.">
              <div className="field">
                <span className="field-label">Allowed file types</span>
                <div className="ad-chip-list" style={{ marginTop: 6 }}>
                  {s.documents.allowedFileTypes.map((t) => (
                    <span className="ad-tag" key={t}>
                      <Icon name="check" size={12} /> {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="field" style={{ marginTop: 'var(--sp-4)' }}>
                <span className="field-label">Blocked file types</span>
                <div className="ad-chip-list" style={{ marginTop: 6 }}>
                  {s.documents.blockedFileTypes.map((t) => (
                    <span className="ad-tag" key={t} style={{ color: 'var(--smb-danger)' }}>
                      <Icon name="slash" size={12} /> {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ad-form-grid" style={{ marginTop: 'var(--sp-4)' }}>
                <Field
                  label="Maximum file size (MB)"
                  type="number"
                  value={s.documents.maxFileSizeMb}
                  onChange={(e) => setDocuments({ maxFileSizeMb: Number(e.target.value) })}
                />
                <Field
                  label="Files per upload"
                  type="number"
                  value={s.documents.maxFilesPerUpload}
                  onChange={(e) => setDocuments({ maxFilesPerUpload: Number(e.target.value) })}
                />
                <Field
                  label="Retention (years)"
                  type="number"
                  value={s.documents.retentionYears}
                  onChange={(e) => setDocuments({ retentionYears: Number(e.target.value) })}
                />
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Toggle
                  label="Keep previous versions"
                  hint="Replacing a document creates a new version rather than overwriting it."
                  checked={s.documents.versioning}
                  onChange={(v) => setDocuments({ versioning: v })}
                />
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ==================================================== INTEGRATIONS */}
      {tab === 'integrations' && (
        <>
          <PrototypeNote icon="alert">
            <strong>No integration below is connected.</strong> Every status reads “Not connected” because this
            phase is UI only — there is no Zoho CRM sync, no document service, no BizBuySell feed and no email
            delivery anywhere in this build.
          </PrototypeNote>

          <div className="ad-grid ad-grid-2">
            {s.integrations.map((i) => (
              <Section
                key={i.id}
                title={
                  <span className="row" style={{ gap: 10 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--brand-light)',
                        color: 'var(--brand-primary)',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <Icon name={i.icon} size={17} />
                    </span>
                    {i.name}
                  </span>
                }
                sub={i.description}
                actions={<Badge tone="neutral">{i.status}</Badge>}
              >
                <DetailList items={i.fields.map((f) => ({ label: f.label, value: f.value }))} />
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <PrototypeNote>{i.detail}</PrototypeNote>
                </div>
                <div style={{ marginTop: 'var(--sp-4)' }} className="ad-quick">
                  <Button variant="secondary" size="sm" icon="link" disabled title="Not available in this prototype">
                    Connect
                  </Button>
                  <Button variant="ghost" size="sm" icon="settings" disabled title="Not available in this prototype">
                    Configure
                  </Button>
                </div>
              </Section>
            ))}
          </div>
        </>
      )}

      {/* ==================================================== SECURITY */}
      {tab === 'security' && (
        <div className="ad-grid ad-grid-main">
          <div className="ad-col">
            <Section title="Multi-factor authentication" sub="Applied to client portal accounts.">
              <Toggle
                label="Require MFA"
                hint="Enrolment is completed by the client during activation."
                checked={s.security.mfa.required}
                onChange={(v) => setSecurity((prev) => ({ ...prev, mfa: { ...prev.mfa, required: v } }))}
              />

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Select
                  label="Required for"
                  value={s.security.mfa.requiredFor}
                  onChange={(e) => setSecurity((prev) => ({ ...prev, mfa: { ...prev.mfa, requiredFor: e.target.value } }))}
                >
                  {s.security.mfa.requiredForOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <p className="field-label" style={{ marginBottom: 4 }}>
                  Available methods
                </p>
                {s.security.mfa.methods.map((m) => (
                  <Toggle
                    key={m.id}
                    label={m.label}
                    checked={m.enabled}
                    onChange={(v) =>
                      setSecurity((prev) => ({
                        ...prev,
                        mfa: { ...prev.mfa, methods: prev.mfa.methods.map((x) => (x.id === m.id ? { ...x, enabled: v } : x)) },
                      }))
                    }
                  />
                ))}
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <Field
                  label="Remember this device (days)"
                  type="number"
                  value={s.security.mfa.rememberDeviceDays}
                  onChange={(e) =>
                    setSecurity((prev) => ({ ...prev, mfa: { ...prev.mfa, rememberDeviceDays: Number(e.target.value) } }))
                  }
                  hint="Set to 0 to challenge on every sign-in."
                />
              </div>
            </Section>

            <Section title="Password policy" sub="Enforced when a client creates or changes their own password.">
              <div className="ad-form-grid">
                <Field
                  label="Minimum length"
                  type="number"
                  value={s.security.password.minLength}
                  onChange={(e) =>
                    setSecurity((prev) => ({ ...prev, password: { ...prev.password, minLength: Number(e.target.value) } }))
                  }
                />
                <Field
                  label="Password history"
                  type="number"
                  value={s.security.password.historyCount}
                  onChange={(e) =>
                    setSecurity((prev) => ({ ...prev, password: { ...prev.password, historyCount: Number(e.target.value) } }))
                  }
                  hint="Number of previous passwords that cannot be reused."
                />
              </div>

              <div style={{ marginTop: 'var(--sp-3)' }}>
                {[
                  ['requireUppercase', 'Require an uppercase letter'],
                  ['requireNumber', 'Require a number'],
                  ['requireSymbol', 'Require a symbol'],
                  ['blockCommon', 'Block commonly breached passwords'],
                ].map(([key, label]) => (
                  <Toggle
                    key={key}
                    label={label}
                    checked={s.security.password[key]}
                    onChange={(v) => setSecurity((prev) => ({ ...prev, password: { ...prev.password, [key]: v } }))}
                  />
                ))}
              </div>

              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote icon="lock">{s.security.password.note}</PrototypeNote>
              </div>
            </Section>
          </div>

          <div className="ad-col">
            <Section title="Sessions" sub="How long a client stays signed in.">
              <div className="ad-form-grid">
                <Field
                  label="Idle timeout (minutes)"
                  type="number"
                  value={s.security.session.idleTimeoutMinutes}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      session: { ...prev.session, idleTimeoutMinutes: Number(e.target.value) },
                    }))
                  }
                />
                <Field
                  label="Absolute timeout (hours)"
                  type="number"
                  value={s.security.session.absoluteTimeoutHours}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      session: { ...prev.session, absoluteTimeoutHours: Number(e.target.value) },
                    }))
                  }
                />
                <Field
                  label="Concurrent sessions"
                  type="number"
                  value={s.security.session.concurrentSessions}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      session: { ...prev.session, concurrentSessions: Number(e.target.value) },
                    }))
                  }
                />
              </div>
              <div style={{ marginTop: 'var(--sp-3)' }}>
                <Toggle
                  label="Sign users out when their role changes"
                  hint="Guarantees a permission change takes effect immediately."
                  checked={s.security.session.forceLogoutOnRoleChange}
                  onChange={(v) =>
                    setSecurity((prev) => ({ ...prev, session: { ...prev.session, forceLogoutOnRoleChange: v } }))
                  }
                />
              </div>
            </Section>

            <Section title="Invitations">
              <div className="ad-form-grid">
                <Field
                  label="Invitation validity (days)"
                  type="number"
                  value={s.security.invitations.expiryDays}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      invitations: { ...prev.invitations, expiryDays: Number(e.target.value) },
                    }))
                  }
                />
                <Field
                  label="Resend limit"
                  type="number"
                  value={s.security.invitations.resendLimit}
                  onChange={(e) =>
                    setSecurity((prev) => ({
                      ...prev,
                      invitations: { ...prev.invitations, resendLimit: Number(e.target.value) },
                    }))
                  }
                />
              </div>
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <PrototypeNote>{s.security.invitations.allowedDomainsNote}</PrototypeNote>
              </div>
            </Section>
          </div>
        </div>
      )}
    </>
  );
}
