import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Select } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { PrototypeNote } from '../components/controls';
import { useAdminState } from '../lib/adminState';
import { engagementStages, mockStaff } from '../data';

const EMPTY = {
  practiceName: '',
  owner: '',
  ownerEmail: '',
  ownerPhone: '',
  specialty: '',
  location: '',
  locations: '1',
  providers: '1',
  established: '',
  annualRevenue: '',
  ebitda: '',
  crmStage: 'Onboarding',
  leadAdvisorId: 'stf-1',
  notes: '',
};

export default function AddClientDialog({ open, onClose }) {
  const { addClient } = useAdminState();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.practiceName.trim() && form.owner.trim() && form.ownerEmail.trim();

  const close = () => {
    setForm(EMPTY);
    setBusy(false);
    onClose();
  };

  const submit = () => {
    setBusy(true);
    // UI only — the record is added to local prototype state and nothing else.
    setTimeout(() => {
      const record = addClient(form);
      notify(`${record.practice.name} added. Invite a portal user when you are ready.`);
      close();
      navigate(`/admin/clients/${record.id}`);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add client"
      description="Creates the practice, the owner contact and an engagement record."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" icon="plus" loading={busy} disabled={!valid || busy} onClick={submit}>
            {busy ? 'Adding…' : 'Add client'}
          </Button>
        </>
      }
    >
      <div className="ad-form-grid">
        <Field
          className="ad-form-full"
          label="Practice name"
          placeholder="e.g. Desert Ridge Family Medicine"
          value={form.practiceName}
          onChange={set('practiceName')}
        />
        <Field label="Owner name" placeholder="Dr. Jane Doe" value={form.owner} onChange={set('owner')} />
        <Field label="Owner title" placeholder="Owner & Medical Director" value={form.ownerTitle ?? ''} onChange={set('ownerTitle')} />
        <Field
          label="Owner email"
          type="email"
          placeholder="name@practice.com"
          value={form.ownerEmail}
          onChange={set('ownerEmail')}
        />
        <Field label="Owner phone" placeholder="(602) 555-0000" value={form.ownerPhone} onChange={set('ownerPhone')} />
        <Field label="Specialty" placeholder="Primary Care" value={form.specialty} onChange={set('specialty')} />
        <Field label="Location" placeholder="Phoenix, Arizona" value={form.location} onChange={set('location')} />
        <Field label="Locations" type="number" min="1" value={form.locations} onChange={set('locations')} />
        <Field label="Providers" type="number" min="1" value={form.providers} onChange={set('providers')} />
        <Field label="Annual revenue" placeholder="$4.9M" value={form.annualRevenue} onChange={set('annualRevenue')} />
        <Field label="EBITDA" placeholder="$1.1M" value={form.ebitda} onChange={set('ebitda')} />

        <Select label="Engagement stage" value={form.crmStage} onChange={set('crmStage')}>
          {engagementStages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select label="Lead advisor" value={form.leadAdvisorId} onChange={set('leadAdvisorId')}>
          {mockStaff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.role}
            </option>
          ))}
        </Select>
      </div>

      <PrototypeNote>
        Adding a client here does not create a CRM record or send anything. Portal access stays “Not invited”
        until a user is invited from Portal Users.
      </PrototypeNote>
    </Modal>
  );
}
