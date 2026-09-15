import { useMemo, useState } from 'react';
import ActivityItem from '../components/ActivityItem';
import { Button, Card, EmptyState } from '../components/ui';
import { activityTypes, mockActivity } from '../data/activity';

/** Groups a flat feed into date sections, preserving feed order. */
function groupByDate(items) {
  const groups = [];
  items.forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && last.date === item.date) last.items.push(item);
    else groups.push({ date: item.date, items: [item] });
  });
  return groups;
}

const weekdayFor = (date) => {
  const parsed = new Date(`${date} 12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleDateString('en-US', { weekday: 'long' });
};

export default function Activity() {
  const [active, setActive] = useState('all');

  const filtered = useMemo(
    () => (active === 'all' ? mockActivity : mockActivity.filter((a) => a.type === active)),
    [active],
  );
  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const countFor = (id) => (id === 'all' ? mockActivity.length : mockActivity.filter((a) => a.type === id).length);

  return (
    <div className="stack stack-5">
      <div className="page-head">
        <div>
          <h2>Activity</h2>
          <p className="page-head-sub">
            A complete, time-stamped record of everything that has happened on your engagement.
          </p>
        </div>
      </div>

      <div className="chip-row" role="group" aria-label="Filter activity by type">
        <button type="button" className="chip" aria-pressed={active === 'all'} onClick={() => setActive('all')}>
          All activity
          <span className="chip-count">{countFor('all')}</span>
        </button>
        {activityTypes.map((t) => (
          <button key={t.id} type="button" className="chip" aria-pressed={active === t.id} onClick={() => setActive(t.id)}>
            {t.label}
            <span className="chip-count">{countFor(t.id)}</span>
          </button>
        ))}
      </div>

      <Card>
        {groups.length === 0 ? (
          <EmptyState
            icon="activity"
            title="No activity of this type yet"
            text="As your engagement progresses, events of this kind will appear here."
            action={
              <Button variant="secondary" size="sm" onClick={() => setActive('all')}>
                Show all activity
              </Button>
            }
          />
        ) : (
          <div className="card-body">
            {groups.map((group) => (
              <section className="tl-group" key={group.date} aria-label={group.date}>
                <h3 className="tl-group-date">
                  {group.date}
                  <span>{weekdayFor(group.date)}</span>
                </h3>
                <div className="tl-group-items">
                  <ul className="timeline">
                    {group.items.map((item) => (
                      <ActivityItem key={item.id} item={item} showDate={false} />
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        )}
      </Card>

      <p className="muted-3" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center' }}>
        Activity is retained for the life of your engagement and for seven years after closing.
      </p>
    </div>
  );
}
