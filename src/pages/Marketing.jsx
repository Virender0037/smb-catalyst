import { useEffect, useState } from 'react';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import { Badge, Card, CardHead, Delta, Icon, Meter, Skeleton } from '../components/ui';
import {
  defaultRangeId,
  getMarketingTotals,
  marketingRanges,
  mockClickThrough,
  mockLeadSources,
  mockListing,
  mockMarketingStats,
} from '../data/marketing';
import { deltaDirection, formatNumber, formatPercent, statusTone } from '../lib/format';

const KPIS = [
  {
    key: 'impressions',
    label: 'Listing Ad Impressions',
    icon: 'eyeChart',
    color: 'var(--viz-1)',
    bg: 'var(--brand-light)',
    desc: 'Number of times your listing appeared in buyer search results.',
  },
  {
    key: 'views',
    label: 'Listing Detail Views',
    icon: 'eye',
    color: '#0C7FA8',
    bg: 'var(--brand-light)',
    desc: 'Number of times a buyer opened your full listing page.',
  },
  {
    key: 'leads',
    label: 'Leads',
    icon: 'inbox',
    color: 'var(--viz-3)',
    bg: '#EEEFF7',
    desc: 'Direct buyer enquiries received and screened by your team.',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    icon: 'star',
    color: 'var(--viz-4)',
    bg: '#F1F2F7',
    desc: 'Buyers who saved your listing to track it.',
  },
];

function ChartSkeleton({ height = 260 }) {
  return (
    <div className="card-body" aria-hidden="true">
      <Skeleton w="100%" h={height} r="8px" />
    </div>
  );
}

export default function Marketing() {
  const [rangeId, setRangeId] = useState(defaultRangeId);
  const [viewsMode, setViewsMode] = useState('detail');
  const [loading, setLoading] = useState(false);

  // Range changes re-query in the real build; here we show the loading design.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(t);
  }, [rangeId]);

  const range = marketingRanges.find((r) => r.id === rangeId);
  const stats = mockMarketingStats[rangeId];
  const totals = getMarketingTotals(rangeId);

  const impressionSeries = stats.series.map((r) => ({ label: r.label, value: r.impressions, partial: r.partial }));
  const detailSeries = stats.series.map((r, i) => ({
    label: r.label,
    value: viewsMode === 'detail' ? r.views : mockClickThrough[rangeId][i],
    partial: r.partial,
  }));
  const leadSeries = stats.series.map((r) => ({ label: r.label, value: r.leads, partial: r.partial }));
  const hasPartial = stats.series.some((r) => r.partial);
  const leadTotal = mockLeadSources.reduce((n, s) => n + s.value, 0);

  return (
    <div className="stack stack-5">
      <div className="page-head">
        <div>
          <h2>Marketing Activity</h2>
          <p className="page-head-sub">
            How your confidential listing is performing across the buyer marketplace and the SMB buyer network.
          </p>
        </div>
      </div>

      {/* Listing header + controls */}
      <Card>
        <div className="mk-listing">
          <div style={{ minWidth: 0 }}>
            <div className="row row-wrap" style={{ gap: 10 }}>
              <h3 className="mk-listing-title">{mockListing.name}</h3>
              <Badge tone={statusTone(mockListing.status)} dot>
                {mockListing.status}
              </Badge>
            </div>
            <p className="mk-listing-meta">
              <span>{mockListing.headline}</span>
            </p>
            <p className="mk-listing-meta">
              <span>Ref {mockListing.reference}</span>
              <span className="eng-meta-sep" style={{ background: 'var(--smb-line-strong)' }} aria-hidden="true" />
              <span>Published {mockListing.publishedOn}</span>
            </p>
          </div>

          <div className="mk-controls">
            <div className="mk-range">
              <label htmlFor="mk-range-select" className="field-label" style={{ whiteSpace: 'nowrap' }}>
                Date range
              </label>
              <select
                id="mk-range-select"
                className="select"
                value={rangeId}
                onChange={(e) => setRangeId(e.target.value)}
              >
                {marketingRanges.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-foot">
          <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
            Reporting period: {range.period}
          </span>
          <span className="row" style={{ gap: 6, fontSize: 'var(--fs-xs)', color: 'var(--smb-text-3)' }}>
            <Icon name="refresh" size={13} /> Last updated {mockListing.lastUpdated}
          </span>
        </div>
      </Card>

      {/* KPIs */}
      <section aria-label="Key marketing metrics">
        <div className="kpi-grid">
          {KPIS.map((kpi) => {
            const delta = stats.deltas[kpi.key];
            return (
              <article className="kpi" key={kpi.key}>
                <div className="kpi-top">
                  <p className="kpi-label">{kpi.label}</p>
                  <span className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }} aria-hidden="true">
                    <Icon name={kpi.icon} size={16} />
                  </span>
                </div>
                {loading ? (
                  <Skeleton w="60%" h={38} style={{ marginTop: 8 }} />
                ) : (
                  <p className="kpi-value" style={{ color: 'var(--smb-text)' }}>
                    {formatNumber(totals[kpi.key])}
                  </p>
                )}
                <div className="stat-foot">
                  <Delta value={formatPercent(delta)} direction={deltaDirection(delta)} label="vs. prior" />
                </div>
                <p className="kpi-desc">{kpi.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Impressions */}
      <Card aria-labelledby="impressions-heading">
        <div className="chart-card-head">
          <div>
            <h3 className="card-title" id="impressions-heading">
              Listing Ad Impressions
            </h3>
            <p className="card-sub">How often your listing surfaced in buyer searches.</p>
          </div>
          <p className="stat-value stat-value-sm" style={{ marginTop: 0 }}>
            {formatNumber(totals.impressions)}
          </p>
        </div>
        {loading ? (
          <ChartSkeleton height={260} />
        ) : (
          <div className="card-body" style={{ paddingTop: 0 }}>
            <BarChart
              data={impressionSeries}
              color="var(--viz-1)"
              valueLabel="impressions"
              ariaLabel={`Listing ad impressions, ${range.label}`}
            />
          </div>
        )}
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: 'var(--viz-1)' }} aria-hidden="true" />
            Impressions
          </span>
          {hasPartial && <span className="muted-3">* Partial {range.granularity} in progress</span>}
        </div>
      </Card>

      {/* Detail views + leads */}
      <div className="chart-grid">
        <Card aria-labelledby="views-heading">
          <div className="chart-card-head">
            <div>
              <h3 className="card-title" id="views-heading">
                Listing Detail Views
              </h3>
              <p className="card-sub">Buyers who opened your full listing.</p>
            </div>
            <div className="segmented" role="group" aria-label="Detail view metric">
              <button type="button" aria-pressed={viewsMode === 'detail'} onClick={() => setViewsMode('detail')}>
                Detail views
              </button>
              <button type="button" aria-pressed={viewsMode === 'click'} onClick={() => setViewsMode('click')}>
                Click-through
              </button>
            </div>
          </div>
          {loading ? (
            <ChartSkeleton height={220} />
          ) : (
            <div className="card-body" style={{ paddingTop: 0 }}>
              <BarChart
                data={detailSeries}
                color="var(--viz-2)"
                height={220}
                valueLabel={viewsMode === 'detail' ? 'detail views' : 'click-throughs'}
                ariaLabel={`${viewsMode === 'detail' ? 'Listing detail views' : 'Click-throughs'}, ${range.label}`}
              />
            </div>
          )}
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--viz-2)' }} aria-hidden="true" />
              {viewsMode === 'detail' ? 'Detail views' : 'Click-through'}
            </span>
            {hasPartial && <span className="muted-3">* Partial {range.granularity} in progress</span>}
          </div>
        </Card>

        <Card aria-labelledby="leads-heading">
          <div className="chart-card-head">
            <div>
              <h3 className="card-title" id="leads-heading">
                Buyer Leads
              </h3>
              <p className="card-sub">Enquiries received and screened by your team.</p>
            </div>
            <p className="stat-value stat-value-sm" style={{ marginTop: 0 }}>
              {formatNumber(totals.leads)}
            </p>
          </div>
          {loading ? (
            <ChartSkeleton height={220} />
          ) : (
            <div className="card-body" style={{ paddingTop: 0 }}>
              <LineChart
                data={leadSeries}
                color="var(--viz-3)"
                height={220}
                valueLabel="leads"
                ariaLabel={`Buyer leads, ${range.label}`}
              />
            </div>
          )}
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: 'var(--viz-3)' }} aria-hidden="true" />
              Leads
            </span>
          </div>
        </Card>
      </div>

      {/* Lead sources */}
      <Card aria-labelledby="sources-heading">
        <CardHead
          id="sources-heading"
          title="Where leads came from"
          sub={`All ${leadTotal} enquiries since the listing was published on ${mockListing.publishedOn}`}
        />
        <div style={{ marginTop: 16 }}>
          {mockLeadSources.map((s) => (
            <div className="mk-source-row" key={s.label}>
              <span className="mk-source-name">{s.label}</span>
              <span className="mk-source-bar">
                <Meter value={s.value / leadTotal} label={`${s.label}: ${s.value} leads`} />
              </span>
              <span className="mk-source-val num">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="card-foot">
          <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
            Every enquiry is screened and qualified by your SMB team before your details are released.
          </span>
        </div>
      </Card>

      <p className="muted-3" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center' }}>
        Marketing figures are refreshed daily. Channels: {mockListing.channels.join(' · ')}.
      </p>
    </div>
  );
}
