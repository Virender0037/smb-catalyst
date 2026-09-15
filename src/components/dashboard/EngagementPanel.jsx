import { Link } from 'react-router-dom';
import { Badge, Icon } from '../ui';
import { mockClient } from '../../data/client';
import { mockEngagement } from '../../data/engagement';

const iconForStage = (state) => (state === 'done' ? 'check' : null);

/**
 * The single most important block on the dashboard: where the engagement is,
 * what happens next, and when. Everything else supports this.
 */
export default function EngagementPanel({ openRequests }) {
  const { stages, currentStageId } = mockEngagement;
  const currentIndex = stages.findIndex((s) => s.id === currentStageId);
  const completed = stages.filter((s) => s.state === 'done').length;
  const overallPct = Math.round(((completed + (stages[currentIndex]?.progress ?? 0)) / stages.length) * 100);

  return (
    <section className="engagement on-dark" aria-labelledby="engagement-heading">
      <div className="eng-top">
        <div style={{ minWidth: 0 }}>
          <Badge tone="on-dark" dot>
            {mockEngagement.status}
          </Badge>
          <h2 className="eng-practice" id="engagement-heading">
            {mockClient.practice.name}
          </h2>
          <p className="eng-meta">
            <span>{mockClient.name}</span>
            <span className="eng-meta-sep" aria-hidden="true" />
            <span>{mockClient.practice.specialty}</span>
            <span className="eng-meta-sep" aria-hidden="true" />
            <span>{mockClient.practice.location}</span>
            <span className="eng-meta-sep" aria-hidden="true" />
            <span>Ref {mockClient.engagementRef}</span>
          </p>
        </div>

        <div className="eng-next">
          <p className="eng-next-label">Next milestone</p>
          <p className="eng-next-value">{mockEngagement.nextMilestone}</p>
          <p className="eng-next-date">
            <Icon name="calendar" size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
            {mockEngagement.nextMilestoneDate}
          </p>
        </div>
      </div>

      <div className="stepper">
        <ol className="stepper-track">
          {stages.map((stage, i) => {
            const isCurrent = stage.id === currentStageId;
            const pct = stage.state === 'done' ? 1 : isCurrent ? stage.progress ?? 0 : 0;
            return (
              <li
                key={stage.id}
                className={`stepper-seg ${stage.state === 'done' ? 'stepper-seg-done' : ''} ${
                  isCurrent ? 'stepper-seg-current' : ''
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="stepper-bar">
                  <span className="stepper-bar-fill" style={{ width: `${pct * 100}%` }} />
                </span>
                <span className="stepper-label" title={stage.label}>
                  {iconForStage(stage.state) && (
                    <Icon
                      name="check"
                      size={10}
                      strokeWidth={3}
                      style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }}
                    />
                  )}
                  {stage.label}
                </span>
                <span className="sr-only">
                  Stage {i + 1} of {stages.length}: {stage.label} — {stage.state}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="stepper-foot">
          <span>
            <span className="stepper-progress-num">{overallPct}% complete</span> · Stage {currentIndex + 1} of{' '}
            {stages.length} · Engaged {mockEngagement.engagedOn}
          </span>
          <span className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            {openRequests > 0 && (
              <Link
                to="/requests"
                className="badge badge-warn"
                style={{ textDecoration: 'none' }}
              >
                <Icon name="alert" size={12} /> {openRequests} open {openRequests === 1 ? 'request' : 'requests'}
              </Link>
            )}
            <Link to="/activity" className="btn btn-link" style={{ color: 'var(--brand-accent)' }}>
              View full timeline <Icon name="arrowRight" size={14} />
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
