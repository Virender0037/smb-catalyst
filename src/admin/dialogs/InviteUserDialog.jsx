import { useEffect, useState } from 'react';
import { Button, Field, Select } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { PrototypeNote } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { portalUserRoles } from '../data';

export default function InviteUserDialog({ open, onClose, clientId }) {
  const state = useAdminState();
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    clientId: clientId ?? '',
    role: 'Practice Administrator',
    accessExpiresOn: '',
    message: '',
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, clientId: clientId ?? f.clientId ?? '' }));
  }, [open, clientId]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim() && form.email.trim() && form.clientId;
  const isAdvisor = form.role === 'Outside Advisor';

  const close = () => {
    setForm((f) => ({ ...f, name: '', email: '', accessExpiresOn: '', message: '' }));
    setBusy(false);
    onClose();
  };

  const submit = () => {
    setBusy(true);
    // UI only — no invitation email leaves this prototype.
    setTimeout(() => {
      state.inviteUser(form);
      notify(`Invitation queued for ${form.email}. No email is sent in this prototype.`);
      close();
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Invite portal user"
      description="The invited person activates their own account and sets their own password."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" icon="send" loading={busy} disabled={!valid || busy} onClick={submit}>
            {busy ? 'Sending…' : 'Send invitation'}
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

      <div className="ad-form-grid">
        <Field label="Full name" placeholder="Jane Doe" value={form.name} onChange={set('name')} />
        <Field
          label="Email address"
          type="email"
          placeholder="name@practice.com"
          value={form.email}
          onChange={set('email')}
        />
      </div>

      <Select label="Role" value={form.role} onChange={set('role')} hint="Permissions come from Roles & Permissions.">
        {portalUserRoles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

      {isAdvisor && (
        <Field
          label="Access expires on"
          type="date"
          value={form.accessExpiresOn}
          onChange={set('accessExpiresOn')}
          hint="Outside advisors are given time-limited access by default."
        />
      )}

      <Field
        label="Message to include (optional)"
        placeholder="e.g. Tom, this is the portal we discussed for the diligence file."
        value={form.message}
        onChange={set('message')}
      />

      <PrototypeNote icon="shield">
        SMB staff never create or see a client password. The invitation link lets the recipient set their own
        password and enrol in MFA. Nothing is transmitted from this prototype.
      </PrototypeNote>
    </Modal>
  );
}
