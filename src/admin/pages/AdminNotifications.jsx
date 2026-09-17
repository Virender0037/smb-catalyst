import { useState } from 'react';
import { Badge, Button, EmptyState, Field, Select } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';
import {
  ActionMenu,
  DetailList,
  PageHeader,
  PrototypeNote,
  Section,
  StatTile,
  Toggle,
} from '../components/controls';
import { useToast } from '../../components/ui/Toast';
import { useAdminState } from '../lib/adminState';
import { notificationChannels } from '../data';

export default function AdminNotifications() {
  const state = useAdminState();
  const { notify } = useToast();
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const openEdit = (n) => {
    setEditing(n);
    setDraft({ subject: n.subject, body: n.body, channel: n.channel, recipient: n.recipient, enabled: n.enabled });
  };

  const save = () => {
    state.updateNotification(editing.id, draft);
    notify(`${editing.template} template updated.`);
    setEditing(null);
  };

  const enabledCount = state.notifications.filter((n) => n.enabled).length;
  const sent30d = state.notifications.reduce((a, n) => a + n.sent30d, 0);

  const columns = [
    {
      key: 'template',
      header: 'Template',
      width: '20%',
      primary: true,
      cell: (n) => (
        <div style={{ minWidth: 0 }}>
          <div className="ad-cell-title">{n.template}</div>
          <div className="ad-cell-sub">{n.subject}</div>
        </div>
      ),
    },
    { key: 'trigger', header: 'Trigger', width: '24%', cell: (n) => <span className="ad-cell-sub">{n.trigger}</span> },
    { key: 'recipient', header: 'Recipient', width: '17%', cell: (n) => n.recipient },
    { key: 'channel', header: 'Channel', width: '10%', cell: (n) => n.channel },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      cardBadge: true,
      cell: (n) => <Badge tone={n.enabled ? 'success' : 'neutral'}>{n.enabled ? 'Enabled' : 'Disabled'}</Badge>,
    },
    {
      key: 'lastSent',
      header: 'Last sent',
      width: '14%',
      nowrap: true,
      cell: (n) => (
        <div className="ad-cell-stack">
          <span>{n.lastSent}</span>
          <span className="ad-cell-sub">{n.sent30d} in the last 30 days</span>
        </div>
      ),
    },
    {
      key: 'toggle',
      header: 'Enabled',
      width: '80px',
      align: 'right',
      stopClick: true,
      cardFooter: true,
      cell: (n) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            role="switch"
            aria-checked={n.enabled}
            aria-label={`${n.enabled ? 'Disable' : 'Enable'} ${n.template}`}
            className="ad-switch ad-switch-sm"
            onClick={() => {
              state.updateNotification(n.id, { enabled: !n.enabled });
              notify(`${n.template} ${n.enabled ? 'disabled' : 'enabled'}.`);
            }}
          >
            <span className="ad-switch-knob" />
          </button>
          <ActionMenu
            label={`Actions for ${n.template}`}
            items={[
              { label: 'Preview', icon: 'eye', onClick: () => setPreview(n) },
              { label: 'Edit template', icon: 'edit', onClick: () => openEdit(n) },
              { separator: true },
              {
                label: n.enabled ? 'Disable' : 'Enable',
                icon: n.enabled ? 'slash' : 'check',
                danger: n.enabled,
                onClick: () => state.updateNotification(n.id, { enabled: !n.enabled }),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Client communications"
        title="Notifications"
        sub="The eight transactional messages the portal sends, what triggers each one, and who receives it."
      />

      <PrototypeNote icon="mail">
        <strong>No email is sent from this prototype.</strong> “Preview” renders the template in a dialog; enabling
        or disabling a template changes local state only. Delivery will be wired to a mail service in a later phase.
      </PrototypeNote>

      <div className="ad-stat-grid ad-stat-grid-3">
        <StatTile label="Templates" value={state.notifications.length} icon="mail" tone="info" />
        <StatTile label="Enabled" value={enabledCount} icon="checkCircle" tone="success" note={`${state.notifications.length - enabledCount} disabled`} />
        <StatTile label="Simulated sends" value={sent30d} icon="send" tone="neutral" note="Last 30 days, mock data" />
      </div>

      <Section flush>
        <DataTable
          columns={columns}
          rows={state.notifications}
          minWidth={1040}
          caption="Notification templates"
          onRowClick={setPreview}
          empty={<EmptyState icon="mail" title="No templates defined" />}
        />
      </Section>

      {/* -------------------------------------------------- preview */}
      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview ? `${preview.template} — preview` : ''}
        description="Rendered with sample merge values. Nothing is sent."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon="edit"
              onClick={() => {
                openEdit(preview);
                setPreview(null);
              }}
            >
              Edit template
            </Button>
          </>
        }
      >
        {preview && (
          <>
            <DetailList
              items={[
                { label: 'Trigger', value: preview.trigger },
                { label: 'Recipient', value: preview.recipient },
                { label: 'Channel', value: preview.channel },
              ]}
            />
            <div
              style={{
                border: '1px solid var(--smb-line)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--smb-line)', background: 'var(--smb-surface-2)' }}>
                <p className="eyebrow">Subject</p>
                <p style={{ fontWeight: 600, marginTop: 4 }}>{preview.subject}</p>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: 'var(--sp-5)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--fs-base)',
                  lineHeight: 1.6,
                  color: 'var(--smb-text-2)',
                }}
              >
                {preview.body}
              </pre>
              <div
                style={{
                  padding: 'var(--sp-3) var(--sp-5)',
                  borderTop: '1px solid var(--smb-line)',
                  background: 'var(--smb-surface-2)',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--smb-text-3)',
                }}
              >
                Strategic Medical Brokers · Confidential — for the named recipient only.
              </div>
            </div>
            <PrototypeNote>
              Merge fields shown in double braces are placeholders. Branding, footer and unsubscribe handling will
              be finalised with the mail provider.
            </PrototypeNote>
          </>
        )}
      </Modal>

      {/* -------------------------------------------------- edit */}
      <Drawer
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        eyebrow="Notification template"
        title={editing?.template ?? ''}
        subtitle={editing?.trigger}
        width={560}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button variant="primary" icon="check" onClick={save}>
              Save template
            </Button>
          </>
        }
      >
        {editing && draft && (
          <>
            <Toggle
              label="Template enabled"
              hint="Disabled templates are never triggered."
              checked={draft.enabled}
              onChange={(v) => setDraft({ ...draft, enabled: v })}
            />

            <Field label="Subject" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />

            <div className="field">
              <label className="field-label" htmlFor="ntf-body">
                Body
              </label>
              <textarea
                id="ntf-body"
                className="textarea"
                rows={14}
                style={{ minHeight: 260 }}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
              <p className="field-hint">
                Merge fields available: recipient_name, practice_name, request_title, request_due_date,
                document_name, milestone_name, engagement_stage, support_phone.
              </p>
            </div>

            <div className="ad-form-grid">
              <Select label="Channel" value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value })}>
                {notificationChannels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Field label="Recipient" value={draft.recipient} onChange={(e) => setDraft({ ...draft, recipient: e.target.value })} />
            </div>

            <PrototypeNote icon="slash">
              Editing here changes prototype state only. Templates will move to the mail provider once the
              integration is agreed.
            </PrototypeNote>
          </>
        )}
      </Drawer>
    </>
  );
}
