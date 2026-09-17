import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../../components/ui';
import { Section } from '../components/controls';

export default function AdminNotFound() {
  const navigate = useNavigate();
  return (
    <Section>
      <EmptyState
        icon="search"
        title="That admin screen does not exist"
        text="The link may be out of date, or the screen may not be part of this phase."
        action={
          <Button variant="primary" icon="overview" onClick={() => navigate('/admin/dashboard')}>
            Back to the dashboard
          </Button>
        }
      />
    </Section>
  );
}
