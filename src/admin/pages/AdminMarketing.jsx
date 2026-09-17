import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Delta, EmptyState, Select } from '../../components/ui';
import Icon from '../components/AdminIcon';
import Sparkline from '../../components/charts/Sparkline';
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
  Toggle,
  Toolbar,
} from '../components/controls';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { listingStatuses, marketingTotals, reportingPeriods, scaledMetrics } from '../data';
import { listingStatusTone } from '../lib/adminFormat';
import { formatNumber, formatPercent } from '../../lib/format';

export default function AdminMarketing() {
  const state = useAdminState();
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [period, setPeriod] = useState('all');
  const [detail, setDetail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.marketing.filter(
      (l) =>
        (status === 'all' || l.status === status) &&
        (period === 'all' || l.reportingPeriod === period) &&
        (!q ||
          l.name.toLowerCase().includes(q) ||
          l.listingId.toLowerCase().includes(q) ||
          state.clientName(l.clientId).toLowerCase().includes(q)),
    );
  }, [state.marketing, state, query, status, period]);

  const totals = useMemo(() => marketingTotals(state.marketing), [state.marketing]);

  const refreshAll = () => {
    setRefreshing(true);
    setTimeout(() => {
      state.marketing.forEach((l) => state.refreshListing(l.id));
      setRefreshing(false);
      notify('Refresh simulated. No BizBuySell integration exists in this build.');
    }, 900);
  };

  const sync = (id, patch) => setDetail((d) => (d && d.id === id ? { ...d, ...patch } : d));

  const menuFor = (l) => [
    { label: 'Review metrics', icon: 'eye', onClick: () => setDetail(l) },
    {
      label: l.clientVisible ? 'Hide from client portal' : 'Show in client portal',
      icon: l.clientVisible ? 'eyeOff' : 'eye',
      disabled: !l.clientId,
      onClick: () => {
        state.updateListing(l.id, { clientVisible: !l.clientVisible }, {
          type: 'access',
          clientId: l.clientId,
          summary: `Marketing visibility ${l.clientVisible ? 'disabled' : 'enabled'} for ${state.clientName(l.clientId)}`,
        });
        notify(l.clientVisible ? 'Hidden from the client portal.' : 'Now visible in the client portal.');
      },
    },
    { separator: true },
    {
      label: 'Refresh statistics',
      icon: 'refresh',
      onClick: () => {
        state.refreshListing(l.id);
        notify('Refresh simulated — mock data only.');
      },
    },
    { label: 'Correct client mapping', icon: 'link', onClick: () => setDetail(l) },
  ];

  const columns = [
    {
      key: 'listing',
      header: 'Listing',
      width: '19%',
      primary: true,
      cell: (l) => (
        <div style={{ minWidth: 0 }}>
          <div className="ad-cell-title">{l.name}</div>
          <div className="ad-cell-sub">{l.listingId}</div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      width: '12%',
      stopClick: true,
      cell: (l) =>
        l.clientId ? (
          <Link className="ad-linkish" to={`/admin/clients/${l.clientId}`}>
            {state.clientName(l.clientId)}
          </Link>
        ) : (
          <Badge tone="danger">Unassigned</Badge>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '8%',
      cardBadge: true,
      cell: (l) => <Badge tone={listingStatusTone(l.status)}>{l.status}</Badge>,
    },
    { key: 'period', header: 'Reporting period', width: '12%', cell: (l) => l.periodLabel },
    {
      key: 'impressions',
      header: 'Impressions',
      width: '8%',
      align: 'right',
      cell: (l) => <span className="num">{formatNumber(l.impressions)}</span>,
    },
    {
      key: 'views',
      header: 'Detail views',
      width: '8%',
      align: 'right',
      cell: (l) => <span className="num">{formatNumber(l.detailViews)}</span>,
    },
    { key: 'leads', header: 'Leads', width: '5%', align: 'right', cell: (l) => <span className="num">{l.leads}</span> },
    {
      key: 'favorites',
      header: 'Favourites',
      width: '6%',
      align: 'right',
      cell: (l) => <span className="num">{l.favorites}</span>,
    },
    {
      key: 'trend',
      header: 'Trend',
      width: '8%',
      cell: (l) => (
        <div className="ad-cell-stack">
          <Sparkline values={l.trend} height={22} />
          <Delta value={formatPercent(l.trendPct)} direction={l.trendDirection} />
        </div>
      ),
    },
    { key: 'sync', header: 'Last sync', width: '10%', nowrap: true, cell: (l) => l.lastSync },
    {
      key: 'visible',
      header: 'Client sees',
      width: '8%',
      cell: (l) => <Badge tone={l.clientVisible ? 'success' : 'neutral'}>{l.clientVisible ? 'Visible' : 'Hidden'}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      width: '56px',
      align: 'right',
      cardFooter: true,
      stopClick: true,
      cell: (l) => <ActionMenu items={menuFor(l)} label={`Actions for ${l.listingId}`} />,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Listing management"
        title="Marketing Activity"
        sub="Listing performance across the portfolio, the client each listing is mapped to, and whether the client can see it."
        actions={
          <Button variant="secondary" icon="refresh" loading={refreshing} onClick={refreshAll}>
            {refreshing ? 'Refreshing…' : 'Refresh all'}
          </Button>
        }
      />

      <PrototypeNote icon="alert">
        <strong>All figures on this screen are mock data.</strong> There is no BizBuySell integration, feed or
        scraping anywhere in this build, and the refresh control only updates a timestamp. The delivery method —
        API, export or manual entry — is still to be confirmed.
      </PrototypeNote>

      <div className="ad-stat-grid ad-stat-grid-4">
        <StatTile label="Impressions" value={formatNumber(totals.impressions)} icon="eye" tone="info" note="All listings, all periods" />
        <StatTile label="Detail views" value={formatNumber(totals.detailViews)} icon="eyeChart" tone="info" />
        <StatTile label="Leads" value={formatNumber(totals.leads)} icon="mail" tone="success" />
        <StatTile
          label="Live listings"
          value={totals.live}
          icon="chart"
          tone="neutral"
          note={`${state.marketing.filter((l) => !l.clientId).length} unassigned`}
        />
      </div>

      <Section flush>
        <Toolbar
          meta={
            <>
              {rows.length} of {state.marketing.length} listings
            </>
          }
        >
          <SearchInput value={query} onChange={setQuery} placeholder="Search listing, ID or client" label="Search listings" />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={listingStatuses} allLabel="All statuses" />
          <FilterSelect
            label="Reporting period"
            value={period}
            onChange={setPeriod}
            allLabel="All periods"
            options={reportingPeriods.map((p) => ({ value: p.id, label: p.label }))}
          />
        </Toolbar>

        <DataTable
          columns={columns}
          rows={rows}
          minWidth={1400}
          caption="Marketing listings"
          onRowClick={setDetail}
          empty={<EmptyState icon="chart" title="No listings match these filters" />}
        />
      </Section>

      {/* -------------------------------------------------- detail drawer */}
      <Drawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow="Listing"
        title={detail?.name ?? ''}
        subtitle={detail?.listingId}
        width={560}
        footer={
          detail && (
            <>
              <Button
                variant="secondary"
                icon="refresh"
                onClick={() => {
                  state.refreshListing(detail.id);
                  sync(detail.id, { lastSync: 'Sep 17, 2026 · Just now' });
                  notify('Refresh simulated — mock data only.');
                }}
              >
                Refresh
              </Button>
              <Button variant="primary" icon="check" onClick={() => setDetail(null)}>
                Done
              </Button>
            </>
          )
        }
      >
        {detail && (
          <>
            <div className="ad-cell-inline">
              <Badge tone={listingStatusTone(detail.status)}>{detail.status}</Badge>
              <Badge tone={detail.mappingConfirmed ? 'success' : 'danger'}>
                {detail.mappingConfirmed ? 'Mapping confirmed' : 'Mapping unconfirmed'}
              </Badge>
            </div>

            <Section title="Assign to client" sub="Correct the client/listing mapping if statistics are landing on the wrong engagement.">
              <Select
                label="Client"
                value={detail.clientId ?? ''}
                onChange={(e) => {
                  const clientId = e.target.value || null;
                  state.updateListing(detail.id, { clientId, mappingConfirmed: Boolean(clientId) });
                  sync(detail.id, { clientId, mappingConfirmed: Boolean(clientId) });
                  notify(clientId ? `Listing mapped to ${state.clientName(clientId)}.` : 'Listing unassigned.');
                }}
              >
                <option value="">Unassigned</option>
                {state.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.practice.name}
                  </option>
                ))}
              </Select>

              <div style={{ marginTop: 'var(--sp-3)' }}>
                <Toggle
                  label="Show marketing activity to this client"
                  hint="Turns the Marketing screen on or off inside the client's portal."
                  disabled={!detail.clientId}
                  checked={detail.clientVisible}
                  onChange={(v) => {
                    state.updateListing(detail.id, { clientVisible: v });
                    sync(detail.id, { clientVisible: v });
                  }}
                />
              </div>
            </Section>

            <Section title="Reporting period" sub="Changes the window the client's report covers.">
              <Select
                label="Period"
                value={detail.reportingPeriod}
                onChange={(e) => {
                  state.updateListing(detail.id, { reportingPeriod: e.target.value });
                  sync(detail.id, { reportingPeriod: e.target.value });
                }}
              >
                {reportingPeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>

              {(() => {
                const m = scaledMetrics(detail, detail.reportingPeriod);
                return (
                  <div className="ad-kv-strip" style={{ marginTop: 'var(--sp-4)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Impressions</p>
                      <p className="ad-kv-value">{formatNumber(m.impressions)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Detail views</p>
                      <p className="ad-kv-value">{formatNumber(m.detailViews)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Leads</p>
                      <p className="ad-kv-value">{formatNumber(m.leads)}</p>
                    </div>
                    <div className="ad-kv">
                      <p className="ad-kv-label">Favourites</p>
                      <p className="ad-kv-value">{formatNumber(m.favorites)}</p>
                    </div>
                  </div>
                );
              })()}
            </Section>

            <Section title="Performance trend">
              <Sparkline values={detail.trend} height={64} />
              <p className="ad-cell-sub" style={{ marginTop: 8 }}>
                <Delta value={formatPercent(detail.trendPct)} direction={detail.trendDirection} label="over the period" />
              </p>
            </Section>

            <DetailList
              columns={2}
              items={[
                { label: 'Listing ID', value: detail.listingId },
                { label: 'Source', value: detail.source },
                { label: 'Published', value: detail.publishedOn },
                { label: 'Last synchronised', value: detail.lastSync },
              ]}
            />

            <PrototypeNote icon="chart">
              <span>
                <Icon name="slash" size={13} /> No external service is contacted. When the integration is agreed,
                only this drawer and the sync timestamp change — the layout stays as signed off.
              </span>
            </PrototypeNote>
          </>
        )}
      </Drawer>
    </>
  );
}
