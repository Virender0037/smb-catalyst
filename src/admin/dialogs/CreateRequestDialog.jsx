import { useEffect, useMemo, useState } from 'react';
import { Button, Field, Select } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { PrototypeNote } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { requestCategories, requestPriorities } from '../data';

const EMPTY = {
  clientId: '',
  title: '',
  description: '',
  category: 'Financials',
  priority: 'Normal',
  dueDate: '',
  assignedTo: '',
};

export default function CreateRequestDialog({ open, onClose, clientId, initial }) {
  const state = useAdminState();
  const { notify } = useToast();
  const [form, setForm] = useState({ ...EMPTY, clientId: clientId ?? '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY, ...(initial ?? {}), clientId: clientId ?? initial?.clientId ?? '' });
  }, [open, clientId, initial]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const recipients = useMemo(
    () => (form.clientId ? state.usersForClient(form.clientId) : []),
    [form.clientId, state],
  );

  const valid = form.clientId && form.title.trim() && form.dueDate;
  const editing = Boolean(initial?.id);

  const close = () => {
    setBusy(false);
    onClose();
  };

  const submit = () => {
    setBusy(true);
    setTimeout(() => {
      if (editing) {
        state.updateRequest(initial.id, {
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          dueDate: form.dueDate,
          assignedTo: form.assignedTo,
        });
        notify('Request updated.');
      } else {
        state.createRequest(form);
        notify(`Request created for ${state.clientName(form.clientId)}. No notification is sent in this prototype.`);
      }
      close();
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={editing ? 'Edit request' : 'Create request'}
      description="Requests appear in the client portal and drive the reminder schedule."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" icon="request" loading={busy} disabled={!valid || busy} onClick={submit}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Create request'}
          </Button>
        </>
      }
    >
      <Select label="Client" value={form.clientId} onChange={set('clientId')} disabled={Boolean(clientId) || editing}>
        <option value="">Select a client…</option>
        {state.clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.practice.name}
          </option>
        ))}
      </Select>

      <Field
        label="Request title"
        placeholder="e.g. 2025 Financial Statements"
        value={form.title}
        onChange={set('title')}
      />

      <div className="field">
        <label className="field-label" htmlFor="req-desc">
          Description
        </label>
        <textarea
          id="req-desc"
          className="textarea"
          placeholder="Explain exactly what is needed and why, so the client does not have to ask."
          value={form.description}
          onChange={set('description')}
        />
      </div>

      <div className="ad-form-grid">
        <Select label="Category" value={form.category} onChange={set('category')}>
          {requestCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select label="Priority" value={form.priority} onChange={set('priority')}>
          {requestPriorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <Field label="Due date" type="date" value={form.dueDate} onChange={set('dueDate')} />
        <Select label="Assign to" value={form.assignedTo} onChange={set('assignedTo')}>
          <option value="">Any portal user</option>
          {recipients.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name} — {u.role}
            </option>
          ))}
        </Select>
      </div>

      <PrototypeNote>
        Creating a request writes to local prototype state only. The “New Request” notification template is not
        wired to any email service.
      </PrototypeNote>
    </Modal>
  );
}
