import { useEffect, useState } from 'react';
import { Button, Icon, Select } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { PrototypeNote, Toggle } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { documentCategories, documentVisibilities, portalUserRoles } from '../data';

const typeOf = (name = '') => {
  if (/\.(xlsx|xls|csv)$/i.test(name)) return 'xlsx';
  if (/\.(docx?|rtf)$/i.test(name)) return 'docx';
  if (/\.(zip|7z|rar)$/i.test(name)) return 'zip';
  if (/\.pdf$/i.test(name)) return 'pdf';
  return 'other';
};

export default function UploadDocumentDialog({ open, onClose, clientId }) {
  const state = useAdminState();
  const { notify } = useToast();
  const [form, setForm] = useState({
    clientId: clientId ?? '',
    category: 'Engagement',
    visibility: 'Internal only',
    restrictedRoles: ['Owner'],
    watermark: true,
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, clientId: clientId ?? f.clientId ?? '' }));
  }, [open, clientId]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.clientId && file;

  const close = () => {
    setFile(null);
    setBusy(false);
    onClose();
  };

  const toggleRole = (role) =>
    setForm((f) => ({
      ...f,
      restrictedRoles: f.restrictedRoles.includes(role)
        ? f.restrictedRoles.filter((r) => r !== role)
        : [...f.restrictedRoles, role],
    }));

  const submit = () => {
    setBusy(true);
    // UI only — nothing is transmitted, stored or watermarked.
    setTimeout(() => {
      state.addDocument({
        clientId: form.clientId,
        name: file.name,
        category: form.category,
        type: typeOf(file.name),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        visibility: form.visibility,
        restrictedRoles: form.visibility === 'Restricted by role' ? form.restrictedRoles : [],
        status: 'In review',
        watermark: form.watermark,
      });
      notify(`${file.name} filed under ${form.category}.`);
      close();
    }, 800);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Upload document"
      description="Files uploaded here are filed against a client and become visible according to the setting below."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" icon="upload" loading={busy} disabled={!valid || busy} onClick={submit}>
            {busy ? 'Uploading…' : 'Upload document'}
          </Button>
        </>
      }
    >
      <Select label="Client" value={form.clientId} onChange={set('clientId')} disabled={Boolean(clientId)}>
        <option value="">Select a client…</option>
        {state.clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.practice.name}
          </option>
        ))}
      </Select>

      <label className={`dropzone ${file ? 'dropzone-file' : ''}`} htmlFor="ad-doc-file">
        <Icon name={file ? 'checkCircle' : 'upload'} size={26} style={{ color: 'var(--brand-primary)' }} />
        <span style={{ fontWeight: 600, fontSize: 'var(--fs-base)' }}>
          {file ? file.name : 'Choose a file or drag it here'}
        </span>
        <span className="field-hint">
          {file
            ? `${(file.size / 1024).toFixed(0)} KB — ready to file`
            : 'PDF, Word, Excel, image or archive up to 50 MB'}
        </span>
        <input
          id="ad-doc-file"
          type="file"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="ad-form-grid">
        <Select label="Category" value={form.category} onChange={set('category')}>
          {documentCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select label="Visibility" value={form.visibility} onChange={set('visibility')}>
          {documentVisibilities.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      {form.visibility === 'Restricted by role' && (
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
                aria-pressed={form.restrictedRoles.includes(r)}
                onClick={() => toggleRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <Toggle
        checked={form.watermark}
        onChange={(v) => setForm((f) => ({ ...f, watermark: v }))}
        label="Watermark client downloads"
        hint="Planned behaviour: the viewer's email address and the download timestamp are stamped across each page. Not implemented in this prototype."
      />

      <PrototypeNote icon="droplet">
        No file leaves the browser. Watermarking, versioning and virus scanning are described here for sign-off
        and will be implemented server-side in a later phase.
      </PrototypeNote>
    </Modal>
  );
}
