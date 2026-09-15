import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EngagementPanel from '../components/dashboard/EngagementPanel';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import ActivityItem from '../components/ActivityItem';
import Sparkline from '../components/charts/Sparkline';
import { Avatar, Badge, Card, CardHead, Delta, Icon } from '../components/ui';
import { mockActivity } from '../data/activity';
import { mockEngagement, mockMilestones } from '../data/engagement';
import { defaultRangeId, getMarketingTotals, marketingRanges, mockListing } from '../data/marketing';
import { usePortalState } from '../lib/portalState';
import { mockTeam } from '../data/team';
import { formatNumber, statusTone } from '../lib/format';

const LOAD_FLAG = 'smb.demo.overviewLoaded';

const MARKETING_TILES = [
  { key: 'impressions', label: 'Impressions', note: 'Times your listing appeared in search' },
  { key: 'views', label: 'Detail Views', note: 'Buyers who opened the listing' },
  { key: 'leads', label: 'Leads', note: 'Direct buyer enquiries' },
  { key: 'favorites', label: 'Favorites', note: 'Buyers tracking your listing' },
];

export default function Overview() {
  // First visit of the session shows the loading design; later visits are instant.
  const [loading, setLoading] = useState(() => {
    try {
      return sessionStorage.getItem(LOAD_FLAG) !== '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!loading) return undefined;
    const t = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem(LOAD_FLAG, '1');
      } catch {
        /* ignore */
      }
    }, 700);
    return () => clearTimeout(t);
  }, [loading]);

  const { openRequests: open, pendingCount, overdueCount } = usePortalState();
  const totals = getMarketingTotals(defaultRangeId);
  const rangeLabel = marketingRanges.find((r) => r.id === defaultRangeId)?.label ?? '';
  const recent = mockActivity.slice(0, 5);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="dash">
      <EngagementPanel openRequests={open.length} />

      <div className="dash-grid">
        {/* ---------------------------------------- primary column */}
        <div className="dash-col">
          {/* What we need from you — highest-priority action on the page */}
          <Card className="attention" aria-labelledby="attention-heading">
            <CardHead
              id="attention-heading"
              title="What we need from you"
              sub={
                overdueCount > 0
                  ? `${pendingCount} pending · ${overdueCount} overdue`
                  : `${pendingCount} pending`
              }
              icon={
                <span className="attention-icon" aria-hidden="true">
                  <Icon name="request" size={18} />
                </span>
              }
              action={
                <Link to="/requests" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                  View all
                </Link>
              }
            />
            <div style={{ marginTop: 16 }}>
              {open.map((r) => (
                <div className="req-line" key={r.id}>
                  <span className="req-line-icon" aria-hidden="true">
                    <Icon name={r.action === 'complete' ? 'request' : 'upload'} size={16} />
                  </span>
                  <div className="req-line-body">
                    <p className="req-line-title">{r.title}</p>
                    <p className="req-line-meta">
                      {r.category} · Due {r.dueDate} · Requested by {r.requestedBy}
                    </p>
                  </div>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  <Link to="/requests" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                    {r.action === 'complete' ? 'Complete' : 'Upload'}
                  </Link>
                </div>
              ))}
            </div>
            <div className="card-foot">
              <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
                Providing these keeps the {mockEngagement.nextMilestone} on track for{' '}
                {mockEngagement.nextMilestoneDate}.
              </span>
            </div>
          </Card>

          {/* Buyer activity */}
          <Card aria-labelledby="buyer-heading">
            <CardHead
              id="buyer-heading"
              title="Buyer activity"
              sub="Confidential buyer engagement to date"
              action={<Badge tone="accent">Live</Badge>}
            />
            <div className="stat-grid stat-grid-3" style={{ marginTop: 20, borderTop: '1px solid var(--smb-line)' }}>
              {mockEngagement.buyerActivity.map((s) => (
                <div className="stat-cell" key={s.id}>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{formatNumber(s.value)}</p>
                  <div className="stat-foot">
                    <Delta value={s.delta.value} direction={s.delta.direction} label={s.delta.period} />
                  </div>
                  <div className="stat-spark">
                    <Sparkline values={s.trend} color="var(--viz-2)" height={26} />
                  </div>
                  <p className="stat-note" style={{ marginTop: 10 }}>
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
            <div className="card-foot">
              <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
                {mockEngagement.buyerTypes.map((b) => `${b.value} ${b.label.toLowerCase()}`).join(' · ')}
              </span>
            </div>
          </Card>

          {/* Marketing performance */}
          <Card aria-labelledby="marketing-heading">
            <CardHead
              id="marketing-heading"
              title="Marketing performance"
              sub={`${mockListing.name} · ${rangeLabel}`}
              action={
                <Link to="/marketing" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                  Full report <Icon name="arrowRight" size={14} />
                </Link>
              }
            />
            <div className="stat-grid stat-grid-4" style={{ marginTop: 20, borderTop: '1px solid var(--smb-line)' }}>
              {MARKETING_TILES.map((tile) => (
                <div className="stat-cell" key={tile.key}>
                  <p className="stat-label">{tile.label}</p>
                  <p className="stat-value stat-value-sm">{formatNumber(totals[tile.key])}</p>
                  <p className="stat-note" style={{ marginTop: 8 }}>
                    {tile.note}
                  </p>
                </div>
              ))}
            </div>
            <div className="card-foot">
              <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
                Last updated {mockListing.lastUpdated}
              </span>
              <Badge tone={statusTone(mockListing.status)} dot>
                Listing {mockListing.status}
              </Badge>
            </div>
          </Card>

          {/* Forward view — what the client should expect, and when */}
          <Card aria-labelledby="milestones-heading">
            <CardHead id="milestones-heading" title="What happens next" sub="Planned milestones for this engagement" />
            <div className="card-body" style={{ paddingBottom: 8 }}>
              <p className="tl-text" style={{ marginTop: 0 }}>
                {mockEngagement.nextMilestoneNote}
              </p>
            </div>
            <div>
              {mockMilestones.map((ms, i) => (
                <div className="req-line" key={ms.id}>
                  <span
                    className="req-line-icon"
                    aria-hidden="true"
                    style={
                      i === 0
                        ? {
                            background: 'var(--brand-light)',
                            color: 'var(--brand-primary-hover)',
                            borderColor: 'var(--brand-light-strong)',
                          }
                        : undefined
                    }
                  >
                    <Icon name={i === 0 ? 'target' : 'calendar'} size={16} />
                  </span>
                  <div className="req-line-body">
                    <p className="req-line-title">{ms.label}</p>
                    <p className="req-line-meta">{ms.date}</p>
                  </div>
                  {i === 0 && <Badge tone="accent">Next up</Badge>}
                </div>
              ))}
            </div>
            <div className="card-foot">
              <span className="muted-3" style={{ fontSize: 'var(--fs-xs)' }}>
                Dates are indicative and confirmed with you before each step.
              </span>
              <Link to="/messages" className="btn btn-link" style={{ fontSize: 'var(--fs-sm)' }}>
                Ask Sarah <Icon name="arrowRight" size={14} />
              </Link>
            </div>
          </Card>
        </div>

        {/* ---------------------------------------- rail */}
        <div className="dash-col">
          <Card aria-labelledby="recent-heading">
            <CardHead
              id="recent-heading"
              title="Recent activity"
              sub="Last 7 days"
              action={
                <Link to="/activity" className="btn btn-link" style={{ fontSize: 'var(--fs-sm)' }}>
                  See all
                </Link>
              }
            />
            <div className="card-body">
              <ul className="timeline">
                {recent.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          </Card>

          <Card aria-labelledby="team-heading">
            <CardHead id="team-heading" title="Your SMB team" sub="Assigned to this engagement" />
            <div style={{ marginTop: 16 }}>
              {mockTeam.slice(0, 3).map((m) => (
                <div className="team-row" key={m.id}>
                  <Avatar name={m.name} initials={m.initials} tone={m.lead ? 'accent' : ''} />
                  <div className="team-row-body">
                    <p className="team-row-name truncate">{m.name}</p>
                    <p className="team-row-role truncate">{m.role}</p>
                  </div>
                  <Link to="/messages" className="btn btn-icon" aria-label={`Message ${m.name}`}>
                    <Icon name="message" size={17} />
                  </Link>
                </div>
              ))}
            </div>
            <div className="card-foot">
              <Link to="/team" className="btn btn-link" style={{ fontSize: 'var(--fs-sm)' }}>
                View full team <Icon name="arrowRight" size={14} />
              </Link>
              <Link to="/messages" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                <Icon name="message" size={14} /> Message
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
