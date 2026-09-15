import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, Card, Icon } from '../components/ui';
import { mockSupport, mockTeam } from '../data/team';
import { mockClient } from '../data/client';

export default function Team() {
  return (
    <div className="stack stack-5">
      <div className="page-head">
        <div>
          <h2>Your SMB Team</h2>
          <p className="page-head-sub">
            The professionals assigned to {mockClient.practice.name}. Reach any of them directly — there is no call
            centre between you and your advisors.
          </p>
        </div>
        <div className="page-head-actions">
          <Link to="/messages" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Icon name="message" size={16} /> Message your team
          </Link>
        </div>
      </div>

      <div className="team-grid">
        {mockTeam.map((m) => (
          <Card className="team-card" as="article" key={m.id} interactive>
            <Avatar name={m.name} initials={m.initials} size="xl" tone={m.lead ? 'accent' : 'soft'} />
            <h3 className="team-card-name">{m.name}</h3>
            <p className="team-card-role">{m.role}</p>
            {m.lead && (
              <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
                <Badge tone="accent">Engagement lead</Badge>
              </div>
            )}
            <p className="team-card-bio">{m.bio}</p>

            <div className="team-card-contact">
              <a className="team-contact-line" href={`mailto:${m.email}`}>
                <Icon name="mail" size={15} />
                <span>{m.email}</span>
              </a>
              <a className="team-contact-line" href={`tel:${m.phone.replace(/\D/g, '')}`}>
                <Icon name="phone" size={15} />
                <span>{m.phone}</span>
              </a>
              <p className="team-contact-line muted-3">
                <Icon name="building" size={15} />
                <span>{m.location}</span>
              </p>
            </div>

            <div className="team-card-actions">
              <Link to="/messages" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Message
              </Link>
              <a href={`mailto:${m.email}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                Email
              </a>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="card-body row row-wrap" style={{ gap: 20, justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 14, minWidth: 0 }}>
            <span className="state-icon" aria-hidden="true">
              <Icon name="help" size={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <h3 className="card-title">Client care</h3>
              <p className="card-sub">
                {mockSupport.hours} · {mockSupport.email}
              </p>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <a href={`tel:${mockSupport.line.replace(/\D/g, '')}`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              <Icon name="phone" size={16} /> {mockSupport.line}
            </a>
            <Button variant="ghost" icon="mail">
              Email us
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
