import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, EmptyState } from '../../components/ui';
import DataTable from '../components/DataTable';
import { FilterSelect, PageHeader, SearchInput, Section, Toolbar } from '../components/controls';
import AddClientDialog from '../dialogs/AddClientDialog';
import { useAdminState } from '../lib/adminState';
import { engagementStages, marketingStatuses, portalStatuses } from '../data';
import {
  crmStatusTone,
  dayOf,
  marketingStatusTone,
  portalStatusTone,
  stageTone,
} from '../lib/adminFormat';

export default function AdminClients() {
  const state = useAdminState();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [stage, setStage] = useState('all');
  const [portal, setPortal] = useState('all');
  const [marketing, setMarketing] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.clients.filter(
      (c) =>
        (stage === 'all' || c.crmStage === stage) &&
        (portal === 'all' || c.portalStatus === portal) &&
        (marketing === 'all' || c.marketingStatus === marketing) &&
        (!q ||
          c.practice.name.toLowerCase().includes(q) ||
          c.owner.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.engagementRef.toLowerCase().includes(q) ||
          c.practice.location.toLowerCase().includes(q)),
    );
  }, [state.clients, query, stage, portal, marketing]);

  const columns = [
    {
      key: 'client',
      header: 'Client / Practice',
      width: '24%',
      primary: true,
      cell: (c) => (
        <div className="ad-cell-main">
          <Avatar name={c.owner} initials={c.initials} size="sm" tone="soft" />
          <div style={{ minWidth: 0 }}>
            <div className="ad-cell-title">{c.practice.name}</div>
            <div className="ad-cell-sub">
              {c.owner} · {c.practice.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'engagement',
      header: 'Engagement',
      width: '12%',
      nowrap: true,
      cell: (c) => (
        <div className="ad-cell-stack">
          <span className="td-strong">{c.engagementRef}</span>
          <span className="ad-cell-sub">Engaged {c.engagedOn}</span>
        </div>
      ),
    },
    {
      key: 'stage',
      header: 'CRM stage',
      width: '17%',
      cell: (c) => (
        <div className="ad-cell-stack">
          <Badge tone={stageTone(c.crmStage)}>{c.crmStage}</Badge>
          <Badge tone={crmStatusTone(c.crmStatus)} dot>
            {c.crmStatus}
          </Badge>
        </div>
      ),
    },
    {
      key: 'portal',
      header: 'Portal',
      width: '9%',
      cardBadge: true,
      cell: (c) => <Badge tone={portalStatusTone(c.portalStatus)}>{c.portalStatus}</Badge>,
    },
    {
      key: 'users',
      header: 'Users',
      width: '6%',
      align: 'right',
      cell: (c) => {
        const users = state.usersForClient(c.id);
        const active = users.filter((u) => u.accountStatus === 'Active').length;
        return (
          <span className="num">
            {active}
            <span className="muted-3"> / {users.length}</span>
          </span>
        );
      },
    },
    {
      key: 'requests',
      header: 'Open',
      width: '11%',
      align: 'right',
      cell: (c) => {
        const open = state.openRequestCount(c.id);
        const overdue = state.requests.filter((r) => r.clientId === c.id && r.status === 'Overdue').length;
        return (
          <div className="ad-cell-stack">
            <span className="num">{open}</span>
            {overdue > 0 && <Badge tone="danger">{overdue} overdue</Badge>}
          </div>
        );
      },
    },
    {
      key: 'marketing',
      header: 'Marketing',
      width: '10%',
      cell: (c) => <Badge tone={marketingStatusTone(c.marketingStatus)}>{c.marketingStatus}</Badge>,
    },
    {
      key: 'activity',
      header: 'Last activity',
      width: '11%',
      cell: (c) => (
        <div className="ad-cell-stack">
          <span>{dayOf(c.lastActivity)}</span>
          <span className="ad-cell-sub">{c.lastActivity.split('·')[1]?.trim() ?? ''}</span>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Clients & engagements"
        title="Clients"
        sub="Every practice SMB represents, with the state of its engagement, portal access and marketing at a glance. Select a client to open Client 360."
        actions={
          <Button variant="primary" icon="plus" onClick={() => setAddOpen(true)}>
            Add client
          </Button>
        }
      />

      <Section flush>
        <Toolbar
          meta={
            <>
              {rows.length} of {state.clients.length} clients
            </>
          }
        >
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search practice, owner, reference or location"
            label="Search clients"
          />
          <FilterSelect label="Stage" value={stage} onChange={setStage} options={engagementStages} allLabel="All stages" />
          <FilterSelect
            label="Portal status"
            value={portal}
            onChange={setPortal}
            options={portalStatuses}
            allLabel="All portal statuses"
          />
          <FilterSelect
            label="Marketing"
            value={marketing}
            onChange={setMarketing}
            options={marketingStatuses}
            allLabel="All marketing"
          />
        </Toolbar>

        <DataTable
          columns={columns}
          rows={rows}
          minWidth={1120}
          caption="Clients and engagements"
          onRowClick={(c) => navigate(`/admin/clients/${c.id}`)}
          empty={
            <EmptyState
              icon="search"
              title="No clients match these filters"
              text="Try a different search term, or clear the filters to see the whole portfolio."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setStage('all');
                    setPortal('all');
                    setMarketing('all');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          }
        />
      </Section>

      <AddClientDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
