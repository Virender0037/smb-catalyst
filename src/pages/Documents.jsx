import { useMemo, useState } from 'react';
import { Badge, Button, Card, EmptyState, Field, Icon, Select } from '../components/ui';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { documentCategories } from '../data/documents';
import { usePortalState } from '../lib/portalState';
import { useIsMobile } from '../lib/hooks';
import { statusTone } from '../lib/format';

const FileIcon = ({ type }) => (
  <span className={`file-icon file-${type}`} aria-hidden="true">
    {type}
  </span>
);

function UploadModal({ open, onClose, onUploaded }) {
  const [category, setCategory] = useState(documentCategories[2]);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setFile(null);
    setNote('');
    setBusy(false);
  };

  const submit = () => {
    setBusy(true);
    // UI only — nothing is transmitted or stored.
    setTimeout(() => {
      onUploaded({ name: file?.name ?? 'Untitled document.pdf', category });
      reset();
      onClose();
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Upload a document"
      description="Files are encrypted in transit and visible only to your SMB deal team."
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" icon="upload" onClick={submit} loading={busy} disabled={!file || busy}>
            {busy ? 'Uploading…' : 'Upload document'}
          </Button>
        </>
      }
    >
      <label className={`dropzone ${file ? 'dropzone-file' : ''}`} htmlFor="doc-file">
        <Icon name={file ? 'checkCircle' : 'upload'} size={26} style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>
          {file ? file.name : 'Choose a file or drag it here'}
        </span>
        <span className="field-hint">
          {file ? `${(file.size / 1024).toFixed(0)} KB — ready to upload` : 'PDF, Word, Excel or image up to 50 MB'}
        </span>
        <input
          id="doc-file"
          type="file"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {documentCategories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Field
        label="Note for your team (optional)"
        placeholder="e.g. Final signed copy from our accountant"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Modal>
  );
}

export default function Documents() {
  const isMobile = useIsMobile();
  const { notify } = useToast();

  const { documents: docs, setDocuments: setDocs } = usePortalState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter(
      (d) =>
        (category === 'all' || d.category === category) &&
        (!q || d.name.toLowerCase().includes(q) || d.uploadedBy.toLowerCase().includes(q)),
    );
  }, [docs, query, category]);

  const handleUploaded = ({ name, category: cat }) => {
    setDocs((prev) => [
      {
        id: `doc-new-${prev.length + 1}`,
        name,
        category: cat,
        type: /\.(xlsx|xls|csv)$/i.test(name) ? 'xlsx' : /\.(docx?|rtf)$/i.test(name) ? 'docx' : 'pdf',
        size: '—',
        uploadedOn: 'Sep 15, 2026',
        uploadedBy: 'Dr. Michael Carter',
        uploadedByRole: 'Client',
        status: 'In review',
      },
      ...prev,
    ]);
    notify(`${name} uploaded and sent to your deal team for review.`);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <div className="stack stack-5">
      <div className="page-head">
        <div>
          <h2>Documents</h2>
          <p className="page-head-sub">
            Every document exchanged during your engagement, organised by category and retained for your records.
          </p>
        </div>
        <div className="page-head-actions">
          <Button variant="primary" icon="upload" onClick={() => setUploadOpen(true)}>
            Upload document
          </Button>
        </div>
      </div>

      <Card>
        <div className="toolbar">
          <div className="toolbar-search">
            <div className="input-wrap">
              <span className="input-affix input-affix-l">
                <Icon name="search" size={17} />
              </span>
              <input
                className="input"
                type="search"
                placeholder="Search documents or people"
                aria-label="Search documents"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <label className="sr-only" htmlFor="doc-category">
            Filter by category
          </label>
          <select
            id="doc-category"
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {documentCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="muted-3" style={{ fontSize: 'var(--fs-xs)', marginLeft: 'auto' }}>
            {filtered.length} of {docs.length} documents
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ borderTop: '1px solid var(--smb-line)' }}>
            <EmptyState
              icon="search"
              title="No documents match your filters"
              text="Try a different search term, or clear the filters to see the full library."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : isMobile ? (
          <div className="doc-cards">
            {filtered.map((d) => (
              <article className="doc-card" key={d.id}>
                <FileIcon type={d.type} />
                <div className="doc-card-body">
                  <h3 className="doc-card-title">{d.name}</h3>
                  <p className="doc-card-meta">
                    <span>{d.category}</span>
                    <span className="eng-meta-sep" style={{ background: 'var(--smb-line-strong)' }} aria-hidden="true" />
                    <span>{d.uploadedOn}</span>
                    <span className="eng-meta-sep" style={{ background: 'var(--smb-line-strong)' }} aria-hidden="true" />
                    <span>{d.size}</span>
                  </p>
                  <p className="doc-card-meta">Uploaded by {d.uploadedBy}</p>
                  <div className="doc-card-foot">
                    <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                    <Button variant="secondary" size="sm" icon="download">
                      Download
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <caption className="sr-only">Documents in your engagement library</caption>
              <thead>
                <tr>
                  <th scope="col" className="col-main">
                    Document
                  </th>
                  <th scope="col">Category</th>
                  <th scope="col">Uploaded</th>
                  <th scope="col">Uploaded by</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="td-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="doc-name-cell">
                        <FileIcon type={d.type} />
                        <div style={{ minWidth: 0 }}>
                          <div className="doc-name">{d.name}</div>
                          <div className="doc-sub">
                            {d.type.toUpperCase()} · {d.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-nowrap">{d.category}</td>
                    <td className="num td-nowrap">{d.uploadedOn}</td>
                    <td className="td-nowrap">
                      {d.uploadedBy}
                      {d.uploadedByRole && <div className="doc-sub">{d.uploadedByRole}</div>}
                    </td>
                    <td>
                      <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                    </td>
                    <td className="td-right">
                      <Button variant="ghost" size="sm" icon="download" aria-label={`Download ${d.name}`}>
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />
    </div>
  );
}
