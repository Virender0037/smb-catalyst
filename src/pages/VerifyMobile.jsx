import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Button, Icon } from '../components/ui';
import Modal from '../components/ui/Modal';
import { Field } from '../components/ui';
import { mockClient } from '../data/client';
import { useSession } from '../lib/session';
import MfaSteps from '../components/layout/MfaSteps';

export default function VerifyMobile() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [sending, setSending] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [newNumber, setNewNumber] = useState('');

  if (!session) return <Navigate to="/login" replace />;

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      navigate('/verify/code');
    }, 800);
  };

  return (
    <AuthLayout
      headline="A quick security check."
      sub="We confirm the device before releasing access to confidential transaction materials."
    >
      <MfaSteps current={1} />

      <h2 className="auth-title">Verify your mobile number</h2>
      <p className="auth-title-sub">
        We do not recognise this device. Send a one-time code to the mobile number on your engagement to continue.
      </p>

      <div className="auth-form">
        <div className="mfa-phone-box">
          <div>
            <p className="mfa-phone-label">Mobile number on file</p>
            <p className="mfa-phone-value">{mockClient.phoneMasked}</p>
          </div>
          <Button variant="link" onClick={() => setChangeOpen(true)}>
            Change number
          </Button>
        </div>

        <Button variant="primary" size="lg" block loading={sending} disabled={sending} onClick={send}>
          {sending ? 'Sending code…' : 'Send verification code'}
        </Button>

        <div className="auth-alert auth-alert-info">
          <Icon name="info" size={16} />
          <span>Standard message and data rates may apply. The code expires after 10 minutes.</span>
        </div>
      </div>

      <div className="auth-secure-note">
        <Icon name="lock" size={16} />
        <span>
          Never got a code? Call client care on <strong>888-970-1210</strong> and we will verify you directly.
        </span>
      </div>

      <Modal
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        title="Change verification number"
        description="Your advisor confirms any change to the number on file before it takes effect."
        footer={
          <>
            <Button variant="secondary" onClick={() => setChangeOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setChangeOpen(false)}>
              Request change
            </Button>
          </>
        }
      >
        <Field
          label="New mobile number"
          type="tel"
          placeholder="(602) 555-0123"
          leadingIcon="phone"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          hint="Sarah Mitchell will call the number currently on file to confirm this change."
        />
      </Modal>
    </AuthLayout>
  );
}
