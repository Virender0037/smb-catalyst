import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, EmptyState, Field } from '../../components/ui';
import Icon from '../components/AdminIcon';
import DataTable from '../components/DataTable';
import { PageHeader, PrototypeNote, Section, StatTile, Toggle } from '../components/controls';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { mockTimeLimitedGrants, permissionGroups } from '../data';

export default function AdminRoles() {
  const state = useAdminState();
  const { notify } = useToast();
  const [dirty, setDirty] = useState(false);

  const roles = state.roles;
  const assignable = roles.filter((r) => !r.placeholder);

  const toggle = (roleId, permissionId) => {
    state.togglePermission(roleId, permissionId);
    setDirty(true);
  };

  const assignedCount = (roleId) => {
    const name = roles.find((r) => r.id === roleId)?.name ?? '';
    const match = name.startsWith('Outside Advisor') ? 'Outside Advisor' : name;
    return state.portalUsers.filter((u) => u.role === match).length;
  };

  return (
    <>
      <PageHeader
        eyebrow="Access model"
        title="Roles & Permissions"
        sub="What each client-side role can see and do inside the portal. These are portal-wide defaults; individual documents and clients can still be restricted further."
        actions={
          <Button
            variant={dirty ? 'primary' : 'secondary'}
            icon="check"
            disabled={!dirty}
            onClick={() => {
              setDirty(false);
              notify('Permission matrix saved to prototype state.');
            }}
          >
            {dirty ? 'Save changes' : 'Saved'}
          </Button>
        }
      />

      <div className="ad-stat-grid ad-stat-grid-4">
        {roles.map((r) => (
          <StatTile
            key={r.id}
            label={r.name}
            value={r.placeholder ? '—' : assignedCount(r.id)}
            icon={r.placeholder ? 'plus' : 'team'}
            tone={r.placeholder ? 'neutral' : 'info'}
            note={
              r.placeholder
                ? 'Reserved for a future role'
                : `${Object.values(r.permissions).filter(Boolean).length} of ${
                    permissionGroups.flatMap((g) => g.permissions).length
                  } permissions`
            }
          />
        ))}
      </div>

      {/* -------------------------------------------------- role cards */}
      <Section title="Roles" sub="Three client-side roles are defined today, with a fourth slot held for a future need.">
        <div className="ad-role-cards">
          {roles.map((r) => (
            <div className={`ad-role-card ${r.placeholder ? 'ad-role-card-placeholder' : ''}`} key={r.id}>
              <div className="row-between">
                <p className="ad-role-name">{r.name}</p>
                {r.placeholder ? (
                  <Badge tone="neutral">Reserved</Badge>
                ) : (
                  <Badge tone={r.timeLimited ? 'warn' : 'success'}>{r.timeLimited ? 'Time-limited' : 'Standing'}</Badge>
                )}
              </div>
              <p className="ad-role-desc">{r.description}</p>
              {!r.placeholder && (
                <p className="ad-cell-sub" style={{ marginTop: 'auto', paddingTop: 8 }}>
                  {assignedCount(r.id)} user{assignedCount(r.id) === 1 ? '' : 's'} assigned
                  {r.defaultExpiryDays ? ` · default ${r.defaultExpiryDays}-day access` : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------- matrix */}
      <Section
        title="Permission matrix"
        sub="Tick a cell to grant that capability to the role. The reserved column stays inert until a fourth role is defined."
        flush
      >
        <div className="ad-matrix-scroll">
          <table className="ad-matrix">
            <caption className="sr-only">Client role permission matrix</caption>
            <thead>
              <tr>
                <th scope="col" style={{ minWidth: 240 }}>
                  <span className="ad-matrix-role-name">Permission</span>
                  <span className="ad-matrix-role-meta">Applies inside the client portal</span>
                </th>
                {roles.map((r) => (
                  <th scope="col" key={r.id} style={{ minWidth: 150 }}>
                    <span className="ad-matrix-role-name">{r.name}</span>
                    <span className="ad-matrix-role-meta">
                      {r.placeholder ? 'Not yet defined' : `${assignedCount(r.id)} assigned`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionGroups.map((group) => (
                <Fragment key={group.id}>
                  <tr className="ad-matrix-group">
                    <td colSpan={roles.length + 1}>{group.label}</td>
                  </tr>
                  {group.permissions.map((p) => (
                    <tr key={p.id}>
                      <th scope="row" className="ad-matrix-perm" style={{ textAlign: 'left', fontWeight: 400 }}>
                        <span className="ad-matrix-perm-label">{p.label}</span>
                        <span className="ad-matrix-perm-hint">{p.hint}</span>
                      </th>
                      {roles.map((r) => (
                        <td
                          key={r.id}
                          className={`ad-matrix-cell ${r.placeholder ? 'ad-matrix-cell-placeholder' : ''}`}
                        >
                          <button
                            type="button"
                            className="ad-check"
                            aria-pressed={Boolean(r.permissions[p.id])}
                            aria-label={`${p.label} for ${r.name}`}
                            disabled={r.placeholder}
                            onClick={() => toggle(r.id, p.id)}
                          >
                            <Icon name="check" size={16} strokeWidth={3} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* -------------------------------------------------- time-limited */}
      <div className="ad-grid ad-grid-main">
        <div className="ad-col">
          <Section
            title="Time-limited access"
            sub="Outside advisors receive access for a fixed window. Expiry is enforced at sign-in and the grant appears in the audit trail."
            flush
          >
            <DataTable
              minWidth={700}
              caption="Active time-limited access grants"
              rows={mockTimeLimitedGrants}
              columns={[
                {
                  key: 'user',
                  header: 'Advisor',
                  width: '24%',
                  primary: true,
                  cell: (g) => (
                    <div style={{ minWidth: 0 }}>
                      <div className="ad-cell-title">{g.userName}</div>
                      <div className="ad-cell-sub">{g.role}</div>
                    </div>
                  ),
                },
                {
                  key: 'client',
                  header: 'Client',
                  width: '20%',
                  stopClick: true,
                  cell: (g) => (
                    <Link className="ad-linkish" to={`/admin/clients/${g.clientId}`}>
                      {state.clientName(g.clientId)}
                    </Link>
                  ),
                },
                { key: 'scope', header: 'Scope', width: '18%', cell: (g) => g.scope },
                { key: 'granted', header: 'Granted', width: '16%', nowrap: true, cell: (g) => g.grantedOn },
                {
                  key: 'expires',
                  header: 'Expires',
                  width: '22%',
                  cardBadge: true,
                  cell: (g) => (
                    <div className="ad-cell-stack">
                      <span>{g.expiresOn}</span>
                      <Badge tone={g.daysRemaining <= 14 ? 'warn' : 'neutral'}>{g.daysRemaining} days remaining</Badge>
                    </div>
                  ),
                },
              ]}
              empty={<EmptyState icon="clock" title="No time-limited grants" />}
            />
          </Section>
        </div>

        <div className="ad-col">
          {assignable
            .filter((r) => r.timeLimited)
            .map((r) => (
              <Section key={r.id} title={`${r.name} defaults`} sub="Applied whenever this role is invited.">
                <Toggle
                  label="Time-limited by default"
                  hint="New invitations carry an expiry date unless a staff member removes it."
                  checked={r.timeLimited}
                  onChange={(v) => state.updateRole(r.id, { timeLimited: v })}
                />
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <Field
                    label="Default access window (days)"
                    type="number"
                    min="1"
                    value={r.defaultExpiryDays ?? ''}
                    onChange={(e) => state.updateRole(r.id, { defaultExpiryDays: Number(e.target.value) || null })}
                    hint="Staff can shorten or extend this per invitation."
                  />
                </div>
              </Section>
            ))}

          <Section title="How the rules combine" sub="Read top to bottom — the strictest setting always wins.">
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                'Role permissions — this matrix decides what a role can ever see.',
                'Client visibility — Client 360 → Portal Visibility can hide fields or whole categories for one engagement.',
                'Document visibility — a single document can be internal only, or restricted to named roles.',
                'Time limits — an expired grant overrides everything above it.',
              ].map((line, i) => (
                <li className="row" key={line} style={{ alignItems: 'flex-start', gap: 10 }}>
                  <span
                    style={{
                      flex: 'none',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--brand-light)',
                      color: 'var(--brand-primary)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--smb-text-2)', lineHeight: 1.5 }}>{line}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>

      <PrototypeNote icon="shield">
        This matrix is a design artefact for sign-off. Nothing here is enforced by a backend in this build — in
        production every rule will be applied server-side on every request, not in the browser.
      </PrototypeNote>
    </>
  );
}
