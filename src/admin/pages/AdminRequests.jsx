import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Button, EmptyState, Select } from '../../components/ui';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';
import {
  ActionMenu,
  ChipFilter,
  DetailList,
  FilterSelect,
  PageHeader,
  PrototypeNote,
  SearchInput,
  Section,
  StatTile,
  Toolbar,
} from '../components/controls';
import CreateRequestDialog from '../dialogs/CreateRequestDialog';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { requestCategories, requestPriorities, requestStatuses, staffName } from '../data';
import { dueLabel, priorityTone, requestStatusTone } from '../lib/adminFormat';

export default function AdminRequests() {
  const state = useAdminState();
  const { notify } = useToast();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [client, setClient] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const status = params.get('status') ?? 'all';
  const setStatus = (v) => setParams(v === 'all' ? {} : { status: v }, { replace: true });

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);

  const counts = useMemo(
    () =>
      requestStatuses.reduce(
        (acc, s) => ({ ...acc, [s]: state.requests.filter((r) => r.status === s).length }),
        {},
      ),
    [state.requests],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.requests.filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (client === 'all' || r.clientId === client) &&
        (category === 'all' || r.category === category) &&
        (priority === 'all' || r.priority === priority) &&
        (!q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)),
    );
  }, [state.requests, status, client, category, priority, query]);

  const sync = (id, patch) => setDetail((d) => (d && d.id === id ? { ...d, ...patch } : d));

  const markReceived = (r) => {
    const patch = { status: 'Received', receivedOn: 'Sep 17, 2026' };
    state.updateRequest(r.id, patch, {
      type: 'request-completed',
      clientId: r.clientId,
      summary: `Response received — ${r.title}`,
    });
    sync(r.id, patch);
    notify(`${r.title} marked as received.`);
  };

  const markCompleted = (r) => {
    const patch = { status: 'Completed', completedOn: 'Sep 17, 2026', receivedOn: r.receivedOn ?? 'Sep 17, 2026' };
    state.updateRequest(r.id, patch, {
      type: 'request-completed',
      clientId: r.clientId,
      summary: `Request completed — ${r.title}`,
    });
    sync(r.id, patch);
    notify(`${r.title} completed.`);
  };

  const reopen = (r) => {
    const patch = { status: 'Pending', completedOn: null, receivedOn: null };
    state.updateRequest(r.id, patch, {
      type: 'request-created',
      clientId: r.clientId,
      summary: `Request reopened — ${r.title}`,
    });
    sync(r.id, patch);
    notify(`${r.title} reopened.`);
  };

  const remind = (r) => {
    state.sendReminder(r.id);
    notify(`Reminder queued for ${r.assignedTo || 'the client'}. No email is sent in this prototype.`);
  };

  const menuFor = (r) => [
    { label: 'Review response', icon: 'eye', onClick: () => setDetail(r) },
    { label: 'Edit request', icon: 'edit', onClick: () => setEditing(r) },
    { separator: true },
    { label: 'Mark received', icon: 'inbox', disabled: r.status === 'Received' || r.status === 'Completed', onClick: () => markReceived(r) },
    { label: 'Mark completed', icon: 'checkCircle', disabled: r.status === 'Completed', onClick: () => markCompleted(r) },
    { label: 'Reopen', icon: 'refresh', disabled: r.status === 'Pending' || r.status === 'Overdue', onClick: () => reopen(r) },
    { separator: true },
    { label: 'Send reminder', icon: 'send', onClick: () => remind(r) },
  ];

  const columns = [
    {
      key: 'title',
      header: 'Request',
      width: '24%',
      primary: true,
      cell: (r) => (
        <div style={{ minWidth: 0 }}>
          <div className="ad-cell-title">{r.title}</div>
          <div className="ad-cell-sub">
            {r.category} · {r.assignedTo || 'Any portal user'}
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      width: '13%',
      stopClick: true,
      cell: (r) => (
        <Link className="ad-linkish" to={`/admin/clients/${r.clientId}`}>
          {state.clientName(r.clientId)}
        </Link>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '8%',
      cell: (r) => <Badge tone={priorityTone(r.priority)}>{r.priority}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '9%',
      cardBadge: true,
      cell: (r) => <Badge tone={requestStatusTone(r.status)}>{r.status}</Badge>,
    },
    { key: 'created', header: 'Created', width: '9%', nowrap: true, cell: (r) => r.createdOn },
    {
      key: 'due',
      header: 'Due date',
      width: '12%',
      nowrap: true,
      cell: (r) => {
        // The countdown only means something while the request is still open.
        const open = r.status === 'Pending' || r.status === 'Overdue';
        return (
          <div className="ad-cell-stack">
            <span>{r.dueDate}</span>
            {open && (
              <span
                className="ad-cell-sub"
                style={{ color: r.status === 'Overdue' ? 'var(--smb-danger)' : undefined }}
              >
                {dueLabel(r.dueDate)}
              </span>
            )}
          </div>
        );
      },
    },
    { key: 'completed', header: 'Completed', width: '9%', nowrap: true, cell: (r) => r.completedOn ?? '—' },
    {
      key: 'doc',
      header: 'Related document',
      width: '12%',
      cell: (r) => {
        if (!r.relatedDocumentId) return <span className="muted-3">None</span>;
        const doc =
          state.documents.find((d) => d.id === r.relatedDocumentId) ??
          state.incoming.find((d) => d.id === r.relatedDocumentId);
        return doc ? <span className="ad-cell-sub">{doc.name}</span> : <span className="muted-3">Removed</span>;
      },
    },
    {
      key: 'actions',
      header: '',
      width: '56px',
      align: 'right',
      cardFooter: true,
      stopClick: true,
      cell: (r) => <ActionMenu items={menuFor(r)} label={`Actions for ${r.title}`} />,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Client requests"
        title="Requests"
        sub="Everything SMB has asked clients to provide, with due dates, reminders and the response that closed it out."
        actions={
          <Button variant="primary" icon="plus" onClick={() => setCreateOpen(true)}>
            Create request
          </Button>
        }
      />

      <div className="ad-stat-grid ad-stat-grid-4">
        <StatTile label="Pending" value={counts.Pending ?? 0} icon="clock" tone="warn" onClick={() => setStatus('Pending')} />
        <StatTile
          label="Overdue"
          value={counts.Overdue ?? 0}
          icon="alert"
          tone="danger"
          note="Past the agreed due date"
          onClick={() => setStatus('Overdue')}
        />
        <StatTile
          label="Received"
          value={counts.Received ?? 0}
          icon="inbox"
          tone="info"
          note="Awaiting SMB review"
          onClick={() => setStatus('Received')}
        />
        <StatTile label="Completed" value={counts.Completed ?? 0} icon="checkCircle" tone="success" onClick={() => setStatus('Completed')} />
      </div>

      <Section flush>
        <Toolbar
          meta={
            <>
              {rows.length} of {state.requests.length} requests
            </>
          }
        >
          <SearchInput value={query} onChange={setQuery} placeholder="Search request title or description" label="Search requests" />
          <FilterSelect
            label="Client"
            value={client}
            onChange={setClient}
            allLabel="All clients"
            options={state.clients.map((c) => ({ value: c.id, label: c.practice.name }))}
          />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={requestCategories} allLabel="All categories" />
          <FilterSelect label="Priority" value={priority} onChange={setPriority} options={requestPriorities} allLabel="All priorities" />
        </Toolbar>

        <div style={{ padding: 'var(--sp-3) var(--sp-5)', borderBottom: '1px solid var(--smb-line)' }}>
          <ChipFilter
            ariaLabel="Filter by status"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All', count: state.requests.length },
              ...requestStatuses.map((s) => ({ value: s, label: s, count: counts[s] ?? 0 })),
            ]}
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          minWidth={1260}
          caption="Client requests"
          onRowClick={setDetail}
          empty={
            <EmptyState
              icon="request"
              title="No requests match these filters"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setClient('all');
                    setCategory('all');
                    setPriority('all');
                    setStatus('all');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          }
        />
      </Section>

      {/* -------------------------------------------------- review drawer */}
      <Drawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow="Request"
        title={detail?.title ?? ''}
        subtitle={detail ? state.clientName(detail.clientId) : ''}
        width={560}
        footer={
          detail && (
            <>
              <Button variant="secondary" icon="send" onClick={() => remind(detail)}>
                Send reminder
              </Button>
              {detail.status === 'Completed' ? (
                <Button variant="secondary" icon="refresh" onClick={() => reopen(detail)}>
                  Reopen
                </Button>
              ) : (
                <Button variant="primary" icon="checkCircle" onClick={() => markCompleted(detail)}>
                  Mark completed
                </Button>
              )}
            </>
          )
        }
      >
        {detail && (
          <>
            <div className="ad-cell-inline">
              <Badge tone={requestStatusTone(detail.status)}>{detail.status}</Badge>
              <Badge tone={priorityTone(detail.priority)}>{detail.priority} priority</Badge>
              <Badge tone="neutral">{detail.category}</Badge>
            </div>

            <p style={{ fontSize: 'var(--fs-base)', color: 'var(--smb-text-2)', lineHeight: 1.55 }}>
              {detail.description}
            </p>

            <DetailList
              columns={2}
              items={[
                { label: 'Assigned to', value: detail.assignedTo || 'Any portal user' },
                { label: 'Created by', value: staffName(detail.createdById) },
                { label: 'Created on', value: detail.createdOn },
                {
                  label: 'Due date',
                  value:
                    detail.status === 'Pending' || detail.status === 'Overdue'
                      ? `${detail.dueDate} — ${dueLabel(detail.dueDate)}`
                      : detail.dueDate,
                },
                { label: 'Received on', value: detail.receivedOn ?? 'Not yet received' },
                { label: 'Completed on', value: detail.completedOn ?? 'Not completed' },
                { label: 'Reminders sent', value: detail.remindersSent },
                { label: 'Last reminder', value: detail.lastReminder ?? 'None' },
              ]}
            />

            <Section title="Response" sub="What the client sent back against this request." flush>
              {(() => {
                const doc =
                  state.documents.find((d) => d.id === detail.relatedDocumentId) ??
                  state.incoming.find((d) => d.id === detail.relatedDocumentId);
                if (!doc) {
                  return (
                    <div style={{ padding: 'var(--sp-5)' }}>
                      <EmptyState icon="inbox" title="Nothing received yet" text="No document is linked to this request." />
                    </div>
                  );
                }
                return (
                  <div className="ad-mini-row">
                    <div className="ad-mini-body">
                      <p className="ad-mini-title">{doc.name}</p>
                      <p className="ad-mini-meta">
                        {doc.uploadedBy} · {doc.receivedOn ?? doc.uploadedOn}
                      </p>
                    </div>
                    <Badge tone="info">{doc.category ?? 'Needs categorisation'}</Badge>
                  </div>
                );
              })()}
            </Section>

            <div className="ad-form-grid">
              <Select
                label="Change priority"
                value={detail.priority}
                onChange={(e) => {
                  state.updateRequest(detail.id, { priority: e.target.value });
                  sync(detail.id, { priority: e.target.value });
                }}
              >
                {requestPriorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Select
                label="Change status"
                value={detail.status}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next === 'Received') markReceived(detail);
                  else if (next === 'Completed') markCompleted(detail);
                  else {
                    state.updateRequest(detail.id, { status: next });
                    sync(detail.id, { status: next });
                  }
                }}
              >
                {requestStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>

            <Button variant="secondary" icon="edit" block onClick={() => { setEditing(detail); setDetail(null); }}>
              Edit request details
            </Button>

            <PrototypeNote>
              Reminders, notifications and client responses are simulated locally. No email leaves this prototype.
            </PrototypeNote>
          </>
        )}
      </Drawer>

      <CreateRequestDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <CreateRequestDialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        clientId={editing?.clientId}
        initial={editing ?? undefined}
      />
    </>
  );
}
