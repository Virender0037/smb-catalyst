import { Link } from 'react-router-dom';
import Icon from './ui/Icon';

const ICONS = {
  document: 'document',
  buyer: 'userCheck',
  marketing: 'chart',
  milestone: 'flag',
  request: 'request',
};

/** One entry in any activity timeline. Shared by the dashboard and Activity page. */
export default function ActivityItem({ item, showDate = true }) {
  return (
    <li className="tl-item">
      <div className="tl-rail" aria-hidden="true">
        <span className={`tl-dot tl-dot-${item.type}`}>
          <Icon name={ICONS[item.type] ?? 'activity'} size={15} />
        </span>
      </div>
      <div className="tl-body">
        <p className="tl-title">{item.title}</p>
        {item.detail && <p className="tl-text">{item.detail}</p>}
        <p className="tl-meta">
          {showDate && (
            <>
              <span>{item.date}</span>
              <span className="eng-meta-sep" style={{ background: 'var(--smb-line-strong)' }} aria-hidden="true" />
            </>
          )}
          <span>{item.time}</span>
          <span className="eng-meta-sep" style={{ background: 'var(--smb-line-strong)' }} aria-hidden="true" />
          <span>{item.actor}</span>
          {item.link && (
            <Link to={item.link} className="btn btn-link" style={{ fontSize: 'var(--fs-xs)' }}>
              {item.linkLabel} <Icon name="chevronRight" size={12} />
            </Link>
          )}
        </p>
      </div>
    </li>
  );
}
