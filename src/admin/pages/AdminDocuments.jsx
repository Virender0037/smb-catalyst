import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, EmptyState, Select } from '../../components/ui';
import Icon from '../components/AdminIcon';
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
import UploadDocumentDialog from '../dialogs/UploadDocumentDialog';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { documentCategories, documentStatuses, documentVisibilities, portalUserRoles } from '../data';
import { docStatusTone, fileClass, visibilityTone } from '../lib/adminFormat';

/* ================================================================ LIBRARY */
function Library() {
  const state = useAdminState();
  const { notify } = useToast();

  const [query, setQuery] = useState('');
  const [client, setClient] = useState('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [status, setStatus] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.documents.filter(
      (d) =>
        (showArchived || !d.archived) &&
        (client === 'all' || d.clientId === client) &&
        (category === 'all' || d.category === category) &&
        (visibility === 'all' || d.visibility === visibility) &&
        (status === 'all' || d.status === status) &&
        (!q || d.name.toLowerCase().includes(q) || d.uploadedBy.toLowerCase().includes(q)),
    );
  }, [state.documents, query, client, category, visibility, status, showArchived]);

  const open = (d) => {
    setDetail(d);
    setDraft({
      category: d.category,
      visibility: d.visibility,
      restrictedRoles: [...d.restrictedRoles],
      status: d.status,
      watermark: d.watermark,
    });
  };

  const save = () => {
    state.updateDocument(detail.id, draft);
    notify(`${detail.name} updated.`);
    setDetail(null);
  };

  const menuFor = (d) => [
    { label: 'View details', icon: 'eye', onClick: () => open(d) },
    {
      label: 'Download (watermarked)',
      icon: 'download',
      onClick: () => notify('Downloads are not implemented in this prototype.'),
    },
    { separator: true },
    { label: 'Change category / visibility', icon: 'edit', onClick: () => open(d) },
    {
      label: 'Replace — new version',
      icon: 'layers',
      onClick: () => {
        state.replaceDocument(d.id);
        notify(`${d.name} is now version ${d.version + 1}.`);
      },
    },
    { separator: true },
    {
      label: d.archived ? 'Restore from archive' : 'Archive document',
      icon: 'archive',
      danger: !d.archived,
      onClick: () => {
        state.updateDocument(d.id, { archived: !d.archived, status: d.archived ? 'Final' : 'Archived' });
        notify(d.archived ? `${d.name} restored.` : `${d.name} archived.`);
      },
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Document',
      width: '26%',
      primary: true,
      cell: (d) => (
        <div className="ad-cell-main">
          <span className={`file-icon ${fileClass(d.type)}`} aria-hidden="true">
            {d.type}
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="ad-cell-title">{d.name}</div>
            <div className="ad-cell-sub">
              {d.type.toUpperCase()} · {d.size} · v{d.version}
              {d.watermark ? ' · watermarked' : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      width: '15%',
      stopClick: true,
      cell: (d) => (
        <Link className="ad-linkish" to={`/admin/clients/${d.clientId}`}>
          {state.clientName(d.clientId)}
        </Link>
      ),
    },
    { key: 'category', header: 'Category', width: '12%', cell: (d) => d.category },
    {
      key: 'by',
      header: 'Uploaded by',
      width: '15%',
      cell: (d) => (
        <div className="ad-cell-stack">
          <span>{d.uploadedBy}</span>
          <span className="ad-cell-sub">{d.uploadedByType}</span>
        </div>
      ),
    },
    { key: 'on', header: 'Uploaded', width: '10%', nowrap: true, cell: (d) => d.uploadedOn },
    {
      key: 'visibility',
      header: 'Visibility',
      width: '13%',
      cardBadge: true,
      cell: (d) => (
        <div className="ad-cell-stack">
          <Badge tone={visibilityTone(d.visibility)}>{d.visibility}</Badge>
          {d.visibility === 'Restricted by role' && (
            <span className="ad-cell-sub">{d.restrictedRoles.join(', ') || 'No roles selected'}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '9%',
      cell: (d) => <Badge tone={docStatusTone(d.status)}>{d.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      width: '56px',
      align: 'right',
      cardFooter: true,
      stopClick: true,
      cell: (d) => <ActionMenu items={menuFor(d)} label={`Actions for ${d.name}`} />,
    },
  ];

  return (
    <>
      <Section flush>
        <Toolbar
          meta={
            <>
              {rows.length} of {state.documents.length} documents
            </>
          }
        >
          <SearchInput value={query} onChange={setQuery} placeholder="Search document or uploader" label="Search documents" />
          <FilterSelect
            label="Client"
            value={client}
            onChange={setClient}
            allLabel="All clients"
            options={state.clients.map((c) => ({ value: c.id, label: c.practice.name }))}
          />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={documentCategories} allLabel="All categories" />
          <FilterSelect
            label="Visibility"
            value={visibility}
            onChange={setVisibility}
            options={documentVisibilities}
            allLabel="All visibility"
          />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={documentStatuses} allLabel="All statuses" />
          <label className="checkbox">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            <span className="checkbox-box" aria-hidden="true">
              <Icon name="check" size={12} strokeWidth={3} />
            </span>
            <span className="checkbox-label">Show archived</span>
          </label>
        </Toolbar>

        <DataTable
          columns={columns}
          rows={rows}
          minWidth={1160}
          caption="Document library"
          onRowClick={open}
          empty={
            <EmptyState
              icon="document"
              title="No documents match these filters"
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setClient('all');
                    setCategory('all');
                    setVisibility('all');
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

      <Drawer
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        eyebrow="Document"
        title={detail?.name ?? ''}
        subtitle={detail ? `${state.clientName(detail.clientId)} · v${detail.version}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDetail(null)}>
              Cancel
            </Button>
            <Button variant="primary" icon="check" onClick={save}>
              Save changes
            </Button>
          </>
        }
      >
        {detail && draft && (
          <>
            <DetailList
              columns={2}
              items={[
                { label: 'File type', value: detail.type.toUpperCase() },
                { label: 'Size', value: detail.size },
                { label: 'Uploaded by', value: `${detail.uploadedBy} (${detail.uploadedByType})` },
                { label: 'Uploaded on', value: detail.uploadedOn },
                { label: 'Version', value: `v${detail.version}` },
                { label: 'Archived', value: detail.archived ? 'Yes' : 'No' },
              ]}
            />

            <Select label="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {documentCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Visibility"
              value={draft.visibility}
              onChange={(e) => setDraft({ ...draft, visibility: e.target.value })}
              hint="Client visible documents still respect the client's category visibility settings."
            >
              {documentVisibilities.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            {draft.visibility === 'Restricted by role' && (
              <div>
                <p className="field-label" style={{ marginBottom: 8 }}>
                  Visible to these roles only
                </p>
                <div className="chip-row">
                  {portalUserRoles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="chip"
                      aria-pressed={draft.restrictedRoles.includes(r)}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          restrictedRoles: draft.restrictedRoles.includes(r)
                            ? draft.restrictedRoles.filter((x) => x !== r)
                            : [...draft.restrictedRoles, r],
                        })
                      }
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Select label="Status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              {documentStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <Toggle
              label="Watermark client downloads"
              hint="Planned: viewer email address and download timestamp stamped across every page."
              checked={draft.watermark}
              onChange={(v) => setDraft({ ...draft, watermark: v })}
            />

            <div className="ad-quick">
              <Button
                variant="secondary"
                size="sm"
                icon="layers"
                onClick={() => {
                  state.replaceDocument(detail.id);
                  notify(`${detail.name} is now version ${detail.version + 1}.`);
                  setDetail(null);
                }}
              >
                Replace — new version
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon="archive"
                onClick={() => {
                  state.updateDocument(detail.id, { archived: !detail.archived });
                  notify(detail.archived ? 'Restored from archive.' : 'Document archived.');
                  setDetail(null);
                }}
              >
                {detail.archived ? 'Restore' : 'Archive'}
              </Button>
            </div>

            <PrototypeNote icon="droplet">
              Viewing, downloading, versioning and watermarking are not implemented. These controls capture the
              intended behaviour for sign-off.
            </PrototypeNote>
          </>
        )}
      </Drawer>
    </>
  );
}

/* =============================================================== INCOMING */
function Incoming() {
  const state = useAdminState();
  const { notify } = useToast();
  const [item, setItem] = useState(null);
  const [draft, setDraft] = useState({ category: 'Financials', visibility: 'Internal only', status: 'In review' });

  const open = (i) => {
    setItem(i);
    setDraft({ category: 'Financials', visibility: 'Internal only', status: 'In review' });
  };

  const file = () => {
    state.fileIncoming(item.id, draft);
    notify(`${item.name} filed under ${draft.category}.`);
    setItem(null);
  };

  const columns = [
    {
      key: 'name',
      header: 'File',
      width: '30%',
      primary: true,
      cell: (d) => (
        <div className="ad-cell-main">
          <span className={`file-icon ${fileClass(d.type)}`} aria-hidden="true">
            {d.type}
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="ad-cell-title">{d.name}</div>
            <div className="ad-cell-sub">
              {d.type.toUpperCase()} · {d.size}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      width: '18%',
      stopClick: true,
      cell: (d) => (
        <Link className="ad-linkish" to={`/admin/clients/${d.clientId}`}>
          {state.clientName(d.clientId)}
        </Link>
      ),
    },
    {
      key: 'by',
      header: 'Uploaded by',
      width: '18%',
      cell: (d) => (
        <div className="ad-cell-stack">
          <span>{d.uploadedBy}</span>
          <span className="ad-cell-sub">{d.uploadedByRole}</span>
        </div>
      ),
    },
    { key: 'on', header: 'Received', width: '16%', nowrap: true, cell: (d) => d.receivedOn },
    {
      key: 'request',
      header: 'Related request',
      width: '18%',
      cell: (d) => {
        const req = state.requests.find((r) => r.id === d.relatedRequestId);
        return req ? <span className="ad-cell-sub">{req.title}</span> : <span className="muted-3">None</span>;
      },
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      align: 'right',
      cardFooter: true,
      stopClick: true,
      cell: (d) => (
        <Button variant="secondary" size="sm" icon="folder" onClick={() => open(d)}>
          Categorise
        </Button>
      ),
    },
  ];

  return (
    <>
      <Section
        title="Incoming documents"
        sub="Files clients have uploaded that SMB has not yet filed. Categorising a file moves it into the library and applies its visibility."
        flush
      >
        <DataTable
          columns={columns}
          rows={state.incoming}
          minWidth={1080}
          caption="Incoming client uploads"
          onRowClick={open}
          empty={
            <EmptyState
              icon="inbox"
              title="Inbox is clear"
              text="Every document a client has sent has been categorised and filed."
            />
          }
        />
      </Section>

      <Drawer
        open={Boolean(item)}
        onClose={() => setItem(null)}
        eyebrow="Incoming document"
        title={item?.name ?? ''}
        subtitle={item ? `${state.clientName(item.clientId)} · received ${item.receivedOn}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setItem(null)}>
              Cancel
            </Button>
            <Button variant="primary" icon="check" onClick={file}>
              File document
            </Button>
          </>
        }
      >
        {item && (
          <>
            <DetailList
              columns={2}
              items={[
                { label: 'Uploaded by', value: `${item.uploadedBy} (${item.uploadedByRole})` },
                { label: 'Received', value: item.receivedOn },
                { label: 'File type', value: item.type.toUpperCase() },
                { label: 'Size', value: item.size },
                {
                  label: 'Related request',
                  value: state.requests.find((r) => r.id === item.relatedRequestId)?.title ?? 'None',
                  full: true,
                },
                item.note && { label: 'Client note', value: item.note, full: true },
              ]}
            />

            <Select label="File under category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {documentCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Visibility once filed"
              value={draft.visibility}
              onChange={(e) => setDraft({ ...draft, visibility: e.target.value })}
              hint="Client uploads default to internal only until reviewed."
            >
              {documentVisibilities.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>

            <Select label="Status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
              {documentStatuses
                .filter((s) => s !== 'Needs categorisation')
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </Select>

            <PrototypeNote>
              Filing moves the record from the inbox into the library in local prototype state. No file is read,
              stored or scanned.
            </PrototypeNote>
          </>
        )}
      </Drawer>
    </>
  );
}

/* ================================================================== PAGE */
export default function AdminDocuments() {
  const state = useAdminState();
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tab, setTab] = useState(location.pathname.endsWith('/incoming') ? 'incoming' : 'library');

  useEffect(() => {
    setTab(location.pathname.endsWith('/incoming') ? 'incoming' : 'library');
  }, [location.pathname]);

  const clientVisible = state.documents.filter((d) => d.visibility === 'Client visible' && !d.archived).length;
  const restricted = state.documents.filter((d) => d.visibility === 'Restricted by role').length;

  return (
    <>
      <PageHeader
        eyebrow="Document control"
        title="Documents"
        sub="Every document exchanged during an engagement, with the category, visibility and version SMB has assigned to it."
        actions={
          <Button variant="primary" icon="upload" onClick={() => setUploadOpen(true)}>
            Upload document
          </Button>
        }
      />

      <div className="ad-stat-grid ad-stat-grid-4">
        <StatTile label="Filed documents" value={state.documents.length} icon="document" tone="info" />
        <StatTile
          label="Awaiting filing"
          value={state.incoming.length}
          icon="inbox"
          tone={state.incoming.length ? 'warn' : 'neutral'}
          note="In the incoming inbox"
        />
        <StatTile label="Client visible" value={clientVisible} icon="eye" tone="success" note="Reach a client portal" />
        <StatTile label="Role restricted" value={restricted} icon="shield" tone="warn" note="Limited to specific roles" />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <nav className="ad-tabs" role="tablist" aria-label="Document views">
          <button
            type="button"
            role="tab"
            className="ad-tab"
            aria-selected={tab === 'library'}
            onClick={() => navigate('/admin/documents')}
          >
            Library
            <span className="ad-tab-count">{state.documents.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            className="ad-tab"
            aria-selected={tab === 'incoming'}
            onClick={() => navigate('/admin/documents/incoming')}
          >
            Incoming / Inbox
            <span className="ad-tab-count">{state.incoming.length}</span>
          </button>
        </nav>
      </div>

      {tab === 'library' ? <Library /> : <Incoming />}

      <PrototypeNote icon="droplet">
        Watermarking is planned, not implemented: client downloads will carry the viewer's email address and the
        download timestamp. Configure the default in Settings → Documents.
      </PrototypeNote>

      <UploadDocumentDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
