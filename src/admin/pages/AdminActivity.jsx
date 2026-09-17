import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, EmptyState, Field } from '../../components/ui';
import Icon from '../components/AdminIcon';
import {
  ChipFilter,
  FilterSelect,
  PageHeader,
  PrototypeNote,
  SearchInput,
  Section,
  StatTile,
} from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { activityEventTypes } from '../data';

const markFor = (type) => activityEventTypes.find((t) => t.id === type) ?? { icon: 'activity', tone: 'neutral' };

const ACTOR_FILTERS = [
  { value: 'all', label: 'Everyone' },
  { value: 'Client', label: 'Client users' },
  { value: 'SMB', label: 'SMB staff' },
  { value: 'System', label: 'System' },
];

export default function AdminActivity() {
  const state = useAdminState();

  const [query, setQuery] = useState('');
  const [client, setClient] = useState('all');
  const [type, setType] = useState('all');
  const [actorType, setActorType] = useState('all');
  const [actor, setActor] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const actors = useMemo(
    () => Array.from(new Set(state.activity.map((e) => e.actor))).sort(),
    [state.activity],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.activity.filter(
      (e) =>
        (client === 'all' || e.clientId === client) &&
        (type === 'all' || e.type === type) &&
        (actorType === 'all' || e.actorType === actorType) &&
        (actor === 'all' || e.actor === actor) &&
        (!from || e.dateKey >= from) &&
        (!to || e.dateKey <= to) &&
        (!q || e.summary.toLowerCase().includes(q) || (e.detail ?? '').toLowerCase().includes(q)),
    );
  }, [state.activity, query, client, type, actorType, actor, from, to]);

  /* Group by display date so the timeline reads like a day book. */
  const groups = useMemo(() => {
    const map = new Map();
    rows.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    });
    return Array.from(map.entries());
  }, [rows]);

  const clear = () => {
    setQuery('');
    setClient('all');
    setType('all');
    setActorType('all');
    setActor('all');
    setFrom('');
    setTo('');
  };

  const todayCount = state.activity.filter((e) => e.dateKey === '2026-09-17').length;

  return (
    <>
      <PageHeader
        eyebrow="Audit trail"
        title="Activity"
        sub="Every recorded event across the portal — who did what, to which engagement, and when."
        actions={
          <Button variant="secondary" icon="download" disabled title="Export is not available in this prototype">
            Export
          </Button>
        }
      />

      <div className="ad-stat-grid ad-stat-grid-4">
        <StatTile label="Events today" value={todayCount} icon="activity" tone="info" />
        <StatTile
          label="Client events"
          value={state.activity.filter((e) => e.actorType === 'Client').length}
          icon="team"
          tone="neutral"
        />
        <StatTile
          label="Staff events"
          value={state.activity.filter((e) => e.actorType === 'SMB').length}
          icon="briefcase"
          tone="neutral"
        />
        <StatTile
          label="Access changes"
          value={state.activity.filter((e) => e.type === 'access').length}
          icon="shield"
          tone="warn"
          note="Permission or account changes"
        />
      </div>

      <Section flush>
        <div className="ad-toolbar">
          <div className="ad-toolbar-controls">
            <SearchInput value={query} onChange={setQuery} placeholder="Search event text" label="Search activity" />
            <FilterSelect
              label="Client"
              value={client}
              onChange={setClient}
              allLabel="All clients"
              options={state.clients.map((c) => ({ value: c.id, label: c.practice.name }))}
            />
            <FilterSelect
              label="Event type"
              value={type}
              onChange={setType}
              allLabel="All event types"
              options={activityEventTypes.map((t) => ({ value: t.id, label: t.label }))}
            />
            <FilterSelect
              label="User"
              value={actor}
              onChange={setActor}
              allLabel="All users"
              options={actors.map((a) => ({ value: a, label: a }))}
            />
          </div>
          <div className="ad-toolbar-meta">{rows.length} events</div>
        </div>

        <div className="ad-toolbar" style={{ paddingTop: 0 }}>
          <div className="ad-toolbar-controls">
            <ChipFilter ariaLabel="Filter by actor" options={ACTOR_FILTERS} value={actorType} onChange={setActorType} />
            <div className="ad-form-grid" style={{ flex: '1 1 320px', maxWidth: 380 }}>
              <Field label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Field label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button variant="ghost" size="sm" icon="close" onClick={clear}>
              Clear filters
            </Button>
          </div>
        </div>

        {groups.length === 0 ? (
          <EmptyState
            icon="activity"
            title="No events match these filters"
            text="Widen the date range or clear a filter to see more."
            action={
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear filters
              </Button>
            }
          />
        ) : (
          groups.map(([date, events]) => (
            <div key={date}>
              <div
                style={{
                  padding: '10px var(--sp-5)',
                  background: 'var(--smb-surface-2)',
                  borderTop: '1px solid var(--smb-line)',
                  borderBottom: '1px solid var(--smb-line)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 600,
                }}
              >
                {date}
                <span className="muted-3" style={{ fontWeight: 400 }}>
                  {' '}
                  · {events.length} event{events.length === 1 ? '' : 's'}
                </span>
              </div>
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
                          <Badge tone="neutral">{mark.label ?? e.type}</Badge>
                          {e.clientId && (
                            <Link className="ad-linkish" to={`/admin/clients/${e.clientId}`}>
                              {state.clientName(e.clientId)}
                            </Link>
                          )}
                          <span>·</span>
                          <span>
                            {e.actor} ({e.actorType})
                          </span>
                          {e.ip && e.ip !== '—' && (
                            <>
                              <span>·</span>
                              <span>IP {e.ip}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <span className="ad-event-time">{e.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </Section>

      <PrototypeNote icon="shield">
        This timeline is generated from prototype state. In production it will be an append-only audit log written
        by the API layer, retained for the period agreed with SMB and exportable for compliance requests.
      </PrototypeNote>
    </>
  );
}
