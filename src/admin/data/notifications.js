/**
 * ============================================================
 * Notification templates.
 *
 * MOCK DATA ONLY. NO EMAIL IS EVER SENT from this prototype —
 * "Preview" renders the template in a dialog and nothing more.
 *
 * Replacement path: Catalyst function -> Zoho ZeptoMail / Campaigns
 * template service.
 * ============================================================
 */

export const notificationChannels = ['Email', 'Email + SMS'];

export const mockNotifications = [
  {
    id: 'ntf-001',
    template: 'Portal Invitation',
    trigger: 'Staff invites a portal user',
    recipient: 'Invited user',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 14, 2026 · 9:31 AM',
    sent30d: 6,
    subject: 'Your Strategic Medical Brokers client portal invitation',
    body:
      'Dear {{recipient_name}},\n\n' +
      'Strategic Medical Brokers has created a secure portal account for {{practice_name}}.\n\n' +
      'Use the button below to activate your account. You will choose your own password and set up ' +
      'multi-factor authentication — Strategic Medical Brokers never sets or sees your password.\n\n' +
      '[ Activate my account ]\n\n' +
      'This invitation expires on {{invitation_expiry}}.\n\n' +
      'If you were not expecting this invitation, please contact your deal team on {{support_phone}}.',
  },
  {
    id: 'ntf-002',
    template: 'Password Recovery',
    trigger: 'User requests a password reset',
    recipient: 'Portal user',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 12, 2026 · 7:18 PM',
    sent30d: 3,
    subject: 'Reset your client portal password',
    body:
      'Dear {{recipient_name}},\n\n' +
      'We received a request to reset the password for {{user_email}}.\n\n' +
      '[ Reset my password ]\n\n' +
      'This link expires in 60 minutes and can be used once. If you did not request a reset, ' +
      'you can safely ignore this message — your password will not change.',
  },
  {
    id: 'ntf-003',
    template: 'New Request',
    trigger: 'Staff creates a client request',
    recipient: 'Assigned portal user',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 16, 2026 · 11:48 AM',
    sent30d: 14,
    subject: 'New request from your Strategic Medical Brokers deal team',
    body:
      'Dear {{recipient_name}},\n\n' +
      'Your deal team has requested the following for {{practice_name}}:\n\n' +
      '{{request_title}}\n{{request_description}}\n\n' +
      'Due by {{request_due_date}}.\n\n' +
      '[ Open the request in your portal ]',
  },
  {
    id: 'ntf-004',
    template: 'Request Reminder',
    trigger: '3 days before due date, and on the day a request becomes overdue',
    recipient: 'Assigned portal user',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 16, 2026 · 6:00 AM',
    sent30d: 11,
    subject: 'Reminder: {{request_title}} is due {{request_due_date}}',
    body:
      'Dear {{recipient_name}},\n\n' +
      'This is a reminder that the following is still outstanding for {{practice_name}}:\n\n' +
      '{{request_title}} — due {{request_due_date}}\n\n' +
      '[ Open the request in your portal ]\n\n' +
      'If this has already been sent another way, please let your deal team know so we can close it out.',
  },
  {
    id: 'ntf-005',
    template: 'Document Available',
    trigger: 'Staff publishes a document to the client portal',
    recipient: 'Portal users with document access',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 16, 2026 · 12:04 PM',
    sent30d: 9,
    subject: 'A new document is available in your portal',
    body:
      'Dear {{recipient_name}},\n\n' +
      '{{document_name}} has been added to the {{document_category}} section of your portal.\n\n' +
      '[ View the document ]\n\n' +
      'For confidentiality, downloaded copies are watermarked with your email address and the ' +
      'date and time of download.',
  },
  {
    id: 'ntf-006',
    template: 'Document Received',
    trigger: 'A client uploads a document',
    recipient: 'Lead advisor + client operations',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 17, 2026 · 8:14 AM',
    sent30d: 22,
    subject: '{{practice_name}} uploaded {{document_name}}',
    body:
      '{{uploader_name}} ({{uploader_role}}) uploaded {{document_name}} for {{practice_name}} ' +
      'at {{upload_time}}.\n\n' +
      'Related request: {{request_title}}\n\n' +
      '[ Review in the admin portal ]',
  },
  {
    id: 'ntf-007',
    template: 'Milestone Update',
    trigger: 'Staff updates a published milestone',
    recipient: 'All active portal users',
    channel: 'Email',
    enabled: false,
    lastSent: 'Sep 11, 2026 · 2:15 PM',
    sent30d: 2,
    subject: 'Your engagement milestone has been updated',
    body:
      'Dear {{recipient_name}},\n\n' +
      'The next milestone for {{practice_name}} is now:\n\n' +
      '{{milestone_name}} — {{milestone_date}}\n\n' +
      '[ View your engagement overview ]',
  },
  {
    id: 'ntf-008',
    template: 'Engagement Status Update',
    trigger: 'Engagement stage changes in the CRM',
    recipient: 'Owner only',
    channel: 'Email',
    enabled: true,
    lastSent: 'Sep 13, 2026 · 3:02 PM',
    sent30d: 4,
    subject: 'Your engagement has moved to {{engagement_stage}}',
    body:
      'Dear {{recipient_name}},\n\n' +
      'The engagement for {{practice_name}} has moved to {{engagement_stage}}.\n\n' +
      '{{stage_description}}\n\n' +
      '[ View your engagement overview ]\n\n' +
      'Your deal team will be in touch to talk through what happens next.',
  },
];
