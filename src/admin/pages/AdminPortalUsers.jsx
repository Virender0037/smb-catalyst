import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, Badge, Button, EmptyState, Select } from '../../components/ui';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';
import {
  ActionMenu,
  DetailList,
  FilterSelect,
  PageHeader,
  PrototypeNote,
  SearchInput,
  Section,
  StatTile,
  Toolbar,
} from '../components/controls';
import InviteUserDialog from '../dialogs/InviteUserDialog';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { accountStatuses, invitationStatuses, portalUserRoles } from '../data';
import { accountStatusTone, invitationTone, mfaTone } from '../lib/adminFormat';

export default function AdminPortalUsers() {
  const state = useAdminState();
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [client, setClient] = useState('all');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  /* Deep-linkable, so the dashboard can send staff straight to expired invitations. */
  const [params, setParams] = useSearchParams();
  const invitation = params.get('invitation') ?? 'all';
  const setInvitation = (v) => setParams(v === 'all' ? {} : { invitation: v }, { replace: true });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [roleDraft, setRoleDraft] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.portalUsers.filter(
      (u) =>
        (client === 'all' || u.clientId === client) &&
        (role === 'all' || u.role === role) &&
        (status === 'all' || u.accountStatus === status) &&
        (invitation === 'all' || u.invitationStatus === invitation) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
  }, [state.portalUsers, query, client, role, status, invitation]);

  const counts = {
    active: state.portalUsers.filter((u) => u.accountStatus === 'Active').length,
    pending: state.portalUsers.filter((u) => u.accountStatus === 'Pending activation').length,
    expired: state.portalUsers.filter((u) => u.invitationStatus === 'Expired').length,
    noMfa: state.portalUsers.filter(
      (u) => u.accountStatus === 'Active' && (u.mfa === 'Not enrolled' || u.mfa === 'Reset required'),
    ).length,
  };

  const act = (user, patch, message, event) => {
    state.updateUser(user.id, patch, event);
    notify(message);
    setDetail((d) => (d && d.id === user.id ? { ...d, ...patch } : d));
  };

  const menuFor = (u) => [
    { label: 'View details', icon: 'eye', onClick: () => openDetail(u) },
    {
      label: 'Resend invitation',
      icon: 'send',
      disabled: u.invitationStatus === 'Accepted',
      onClick: () =>
        act(
          u,
          { invitationStatus: 'Resent', invitedOn: 'Sep 17, 2026' },
          `Invitation re-queued for ${u.email}. No email is sent in this prototype.`,
          {
            type: 'invitation',
            clientId: u.clientId,
            summary: `Portal invitation resent to ${u.email}`,
            detail: 'Invitation validity extended by 14 days.',
          },
        ),
    },
    { separator: true },
    {
      label: 'Activate account',
      icon: 'userCheck',
      disabled: u.accountStatus === 'Active',
      onClick: () =>
        act(u, { accountStatus: 'Active' }, `${u.name} activated.`, {
          type: 'access',
          clientId: u.clientId,
          summary: `Portal access activated for ${u.name}`,
        }),
    },
    {
      label: 'Deactivate account',
      icon: 'slash',
      disabled: u.accountStatus !== 'Active',
      onClick: () =>
        act(u, { accountStatus: 'Deactivated' }, `${u.name} deactivated.`, {
          type: 'access',
          clientId: u.clientId,
          summary: `Portal access deactivated for ${u.name}`,
        }),
    },
    {
      label: 'Reset MFA',
      icon: 'key',
      onClick: () =>
        act(u, { mfa: 'Reset required' }, `MFA reset requested for ${u.name}.`, {
          type: 'access',
          clientId: u.clientId,
          summary: `MFA reset for ${u.name}`,
          detail: 'The user will be asked to re-enrol at next sign-in.',
        }),
    },
    { separator: true },
    {
      label: 'Revoke access',
      icon: 'userMinus',
      danger: true,
      disabled: u.accountStatus === 'Revoked',
      onClick: () =>
        act(u, { accountStatus: 'Revoked' }, `Access revoked for ${u.name}.`, {
          type: 'access',
          clientId: u.clientId,
          summary: `Portal access revoked for ${u.name}`,
        }),
    },
  ];

  const openDetail = (u) => {
    setDetail(u);
    setRoleDraft(u.role);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      width: '22%',
      primary: true,
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
    {
      key: 'client',
      header: 'Client',
      width: '16%',
      stopClick: true,
      cell: (u) => (
        <Link className="ad-linkish" to={`/admin/clients/${u.clientId}`}>
          {state.clientName(u.clientId)}
        </Link>
      ),
    },
    { key: 'role', header: 'Role', width: '14%', cell: (u) => u.role },
    {
      key: 'account',
      header: 'Account',
      width: '11%',
      cardBadge: true,
      cell: (u) => <Badge tone={accountStatusTone(u.accountStatus)}>{u.accountStatus}</Badge>,
    },
    {
      key: 'invitation',
      header: 'Invitation',
      width: '11%',
      cell: (u) => (
        <div className="ad-cell-stack">
          <Badge tone={invitationTone(u.invitationStatus)}>{u.invitationStatus}</Badge>
          {u.invitedOn && <span className="ad-cell-sub">{u.invitedOn}</span>}
        </div>
      ),
    },
    {
      key: 'login',
      header: 'Last login',
      width: '13%',
      nowrap: true,
      cell: (u) => (
        <div className="ad-cell-stack">
          <span>{u.lastLogin ?? 'Never'}</span>
          {u.logins90d > 0 && <span className="ad-cell-sub">{u.logins90d} sign-ins / 90 days</span>}
        </div>
      ),
    },
    {
      key: 'mfa',
      header: 'MFA',
      width: '10%',
      cell: (u) => <Badge tone={mfaTone(u.mfa)}>{u.mfa.replace('Enrolled — ', '')}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      width: '56px',
      align: 'right',
      cardFooter: true,
      stopClick: true,
      cell: (u) => <ActionMenu items={menuFor(u)} label={`Actions for ${u.name}`} />,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Access control"
        title="Portal Users"
        sub="Everyone who can reach a client portal, and the state of their invitation, account and multi-factor enrolment."
        actions={
          <Button variant="primary" icon="mail" onClick={() => setInviteOpen(true)}>
            Invite user
          </Button>
        }
      />

      <div className="ad-stat-grid ad-stat-grid-4">
        <StatTile label="Active accounts" value={counts.active} icon="userCheck" tone="success" />
        <StatTile label="Pending activation" value={counts.pending} icon="clock" tone="warn" note="Invited, not yet activated" />
        <StatTile label="Expired invitations" value={counts.expired} icon="mail" tone="danger" note="Need resending" />
        <StatTile label="MFA gaps" value={counts.noMfa} icon="shield" tone="warn" note="Active users without working MFA" />
      </div>

      <Section flush>
        <Toolbar
          meta={
            <>
              {rows.length} of {state.portalUsers.length} users
            </>
          }
        >
          <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" label="Search users" />
          <FilterSelect
            label="Client"
            value={client}
            onChange={setClient}
            allLabel="All clients"
            options={state.clients.map((c) => ({ value: c.id, label: c.practice.name }))}
          />
          <FilterSelect label="Role" value={role} onChange={setRole} options={portalUserRoles} allLabel="All roles" />
          <FilterSelect label="Account status" value={status} onChange={setStatus} options={accountStatuses} allLabel="All accounts" />
          <FilterSelect
            label="Invitation"
            value={invitation}
            onChange={setInvitation}
            options={invitationStatuses}
            allLabel="All invitations"
          />
        </Toolbar>

        <DataTable
          columns={columns}
          rows={rows}
          minWidth={1160}
          caption="Portal users"
          onRowClick={openDetail}
          empty={
            <EmptyState
              icon="team"
              title="No users match these filters"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setClient('all');
                    setRole('all');
                    setStatus('all');
                    setInvitation('all');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          }
        />
      </Section>

      <PrototypeNote icon="shield">
        SMB staff never create or view a client password. The production flow is: invitation → the client activates
        → the client sets their own password → MFA enrolment. Nothing on this screen sends an email or changes a
        real account.
      </PrototypeNote>

      {/* -------------------------------------------------- detail drawer */}
      <Drawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow="Portal user"
        title={detail?.name ?? ''}
        subtitle={detail ? `${detail.email} · ${state.clientName(detail.clientId)}` : ''}
        footer={
          detail && (
            <>
              <Button variant="secondary" onClick={() => setDetail(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon="check"
                disabled={roleDraft === detail.role}
                onClick={() =>
                  act(detail, { role: roleDraft }, `${detail.name} is now a ${roleDraft}.`, {
                    type: 'access',
                    clientId: detail.clientId,
                    summary: `Role changed for ${detail.name}`,
                    detail: `${detail.role} → ${roleDraft}.`,
                  })
                }
              >
                Save role
              </Button>
            </>
          )
        }
      >
        {detail && (
          <>
            <div className="ad-cell-inline">
              <Badge tone={accountStatusTone(detail.accountStatus)}>{detail.accountStatus}</Badge>
              <Badge tone={invitationTone(detail.invitationStatus)}>{detail.invitationStatus}</Badge>
              <Badge tone={mfaTone(detail.mfa)}>{detail.mfa}</Badge>
            </div>

            <Select
              label="Role"
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value)}
              hint="Permissions are defined once, in Roles & Permissions."
            >
              {portalUserRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>

            <DetailList
              items={[
                { label: 'Client', value: state.clientName(detail.clientId) },
                { label: 'Invited on', value: detail.invitedOn ?? 'Not yet invited' },
                { label: 'Activated on', value: detail.activatedOn ?? 'Not activated' },
                { label: 'Last login', value: detail.lastLogin ?? 'Never' },
                { label: 'Sign-ins (90 days)', value: detail.logins90d },
                { label: 'MFA', value: detail.mfa },
                {
                  label: 'Access expires',
                  value: detail.accessExpiresOn ?? 'No expiry — permanent access',
                },
              ]}
            />

            <Section title="Actions" className="ad-section-plain">
              <div className="ad-quick">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="send"
                  disabled={detail.invitationStatus === 'Accepted'}
                  onClick={() =>
                    act(detail, { invitationStatus: 'Resent' }, `Invitation re-queued for ${detail.email}.`)
                  }
                >
                  Resend invitation
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="key"
                  onClick={() => act(detail, { mfa: 'Reset required' }, `MFA reset requested for ${detail.name}.`)}
                >
                  Reset MFA
                </Button>
                {detail.accountStatus === 'Active' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="slash"
                    onClick={() => act(detail, { accountStatus: 'Deactivated' }, `${detail.name} deactivated.`)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="userCheck"
                    onClick={() => act(detail, { accountStatus: 'Active' }, `${detail.name} activated.`)}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  icon="userMinus"
                  disabled={detail.accountStatus === 'Revoked'}
                  onClick={() => act(detail, { accountStatus: 'Revoked' }, `Access revoked for ${detail.name}.`)}
                >
                  Revoke access
                </Button>
              </div>
            </Section>

            <PrototypeNote icon="lock">
              There is no “set password” action by design. If this user cannot sign in, resend the invitation or
              trigger the password-recovery template — the client always sets their own credentials.
            </PrototypeNote>
          </>
        )}
      </Drawer>

      <InviteUserDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
