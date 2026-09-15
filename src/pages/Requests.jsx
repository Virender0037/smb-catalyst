import { useMemo, useState } from 'react';
import { Badge, Button, Card, EmptyState, Icon } from '../components/ui';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { usePortalState } from '../lib/portalState';
import { statusTone } from '../lib/format';

const FILTERS = [
  { id: 'open', label: 'Open' },
  { id: 'all', label: 'All' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Overdue', label: 'Overdue' },
  { id: 'Received', label: 'Received' },
  { id: 'Completed', label: 'Completed' },
];

const MARK_TONE = {
  Pending: { bg: 'var(--smb-warn-bg)', color: 'var(--smb-warn)', icon: 'clock' },
  Overdue: { bg: 'var(--smb-danger-bg)', color: 'var(--smb-danger)', icon: 'alert' },
  Received: { bg: 'var(--smb-info-bg)', color: 'var(--smb-info)', icon: 'inbox' },
  Completed: { bg: 'var(--smb-success-bg)', color: 'var(--smb-success)', icon: 'checkCircle' },
};

const ACTION_LABEL = { upload: 'Upload', complete: 'Complete form', view: 'View' };

export default function Requests() {
  const { notify } = useToast();
  const { requests, setRequests } = usePortalState();
  const [filter, setFilter] = useState('open');
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState(false);

  const counts = useMemo(
    () =>
      requests.reduce(
        (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
        { Pending: 0, Overdue: 0, Received: 0, Completed: 0 },
      ),
    [requests],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return requests;
    if (filter === 'open') return requests.filter((r) => r.status === 'Pending' || r.status === 'Overdue');
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const countFor = (id) => {
    if (id === 'all') return requests.length;
    if (id === 'open') return counts.Pending + counts.Overdue;
    return counts[id] ?? 0;
  };

  const submitActive = () => {
    setBusy(true);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) => (r.id === active.id ? { ...r, status: 'Received', receivedOn: 'Sep 15, 2026' } : r)),
      );
      notify(`"${active.title}" sent to your deal team.`);
      setBusy(false);
      setActive(null);
    }, 900);
  };

  return (
    <div className="stack stack-5">
      <div className="page-head">
        <div>
          <h2>Requests</h2>
          <p className="page-head-sub">
            Information your SMB team needs to keep the transaction moving. Completing these on time protects your
            timeline.
          </p>
        </div>
      </div>

      <Card>
        <div className="request-summary">
          {['Pending', 'Overdue', 'Received', 'Completed'].map((status) => (
            <div className="request-summary-cell" key={status}>
              <p className="stat-label">{status}</p>
              <p
                className="request-summary-num"
                style={{
                  color:
                    status === 'Overdue' && counts[status] > 0
                      ? 'var(--smb-danger)'
                      : status === 'Pending' && counts[status] > 0
                        ? 'var(--smb-warn)'
                        : 'var(--smb-text)',
                }}
              >
                {counts[status]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="chip-row" role="group" aria-label="Filter requests by status">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="chip-count">{countFor(f.id)}</span>
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon="checkCircle"
            title="Nothing outstanding here"
            text="You are all caught up. Your advisory team will let you know as soon as anything else is needed."
            action={
              <Button variant="secondary" size="sm" onClick={() => setFilter('all')}>
                View all requests
              </Button>
            }
          />
        ) : (
          <div>
            {filtered.map((r) => {
              const mark = MARK_TONE[r.status];
              const done = r.status === 'Completed' || r.status === 'Received';
              return (
                <article className="request" key={r.id}>
                  <span
                    className="request-mark"
                    style={{ background: mark.bg, color: mark.color }}
                    aria-hidden="true"
                  >
                    <Icon name={mark.icon} size={18} />
                  </span>

                  <div className="request-body">
                    <div className="row row-wrap" style={{ gap: 10 }}>
                      <h3 className="request-title">{r.title}</h3>
                      <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      {r.priority === 'High' && !done && <Badge tone="neutral">High priority</Badge>}
                    </div>
                    <p className="request-desc">{r.description}</p>
                    <div className="request-meta">
                      <span className="request-meta-item">
                        <Icon name="folder" size={13} /> {r.category}
                      </span>
                      <span className="request-meta-item">
                        <Icon name="calendar" size={13} />
                        {r.status === 'Completed'
                          ? `Completed ${r.completedOn}`
                          : r.status === 'Received'
                            ? `Received ${r.receivedOn}`
                            : `Due ${r.dueDate}`}
                      </span>
                      <span className="request-meta-item">
                        <Icon name="team" size={13} /> Requested by {r.requestedBy}
                      </span>
                    </div>
                  </div>

                  <div className="request-actions">
                    {done ? (
                      <Button variant="secondary" size="sm" icon="eye" disabled={r.status === 'Completed' && !r.completedOn}>
                        View
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={r.action === 'complete' ? 'request' : 'upload'}
                        onClick={() => setActive(r)}
                      >
                        {ACTION_LABEL[r.action]}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.action === 'complete' ? 'Complete this form' : 'Upload requested document'}
        description={active?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setActive(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitActive} loading={busy} disabled={busy}>
              {busy ? 'Sending…' : 'Send to my team'}
            </Button>
          </>
        }
      >
        <p className="request-desc" style={{ marginTop: 0 }}>
          {active?.description}
        </p>
        <label className="dropzone" htmlFor="req-file">
          <Icon name="upload" size={24} style={{ color: 'var(--brand-primary)' }} />
          <span style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>Choose a file or drag it here</span>
          <span className="field-hint">PDF, Word, Excel or image up to 50 MB</span>
          <input id="req-file" type="file" className="sr-only" />
        </label>
        <div className="auth-alert auth-alert-info" style={{ animation: 'none' }}>
          <Icon name="lock" size={16} />
          <span>Only your assigned Strategic Medical Brokers deal team can open what you send here.</span>
        </div>
      </Modal>
    </div>
  );
}
