import Logo from '../ui/Logo';
import Icon from '../ui/Icon';
import { mockSupport } from '../../data/team';

/**
 * Split-canvas authentication layout shared by sign-in and MFA.
 *
 * Left: the website's hero treatment — deep navy, the serif display face
 * and the company's own tagline. Right: the task at hand, on white, with
 * the official logo so the handover from the public site is seamless.
 */
const PORTAL_POINTS = [
  'Share practice and financial documents securely with your deal team',
  'Follow buyer activity and listing performance as the process moves',
  'See exactly what your advisors need from you, and by when',
];

export default function AuthLayout({ children, headline, sub }) {
  return (
    <div className="auth">
      <section className="auth-brand on-dark" aria-label="Strategic Medical Brokers">
        <div className="auth-brand-mid">
          <p className="auth-eyebrow">Client Portal</p>
          <h1 className="auth-headline display">{headline}</h1>
          <p className="auth-sub">{sub}</p>

          <ul className="auth-proof">
            {PORTAL_POINTS.map((line) => (
              <li className="auth-proof-item" key={line}>
                <span className="auth-proof-tick" aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={2.6} />
                </span>
                <span className="auth-proof-text">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="auth-brand-bottom">
          <p className="auth-tagline">Seamless Transitions, Lasting Success</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top">
          <Logo height={44} className="auth-logo" />
          <a href={`tel:${mockSupport.line.replace(/\D/g, '')}`} className="btn btn-secondary btn-sm">
            <Icon name="phone" size={15} /> {mockSupport.line}
          </a>
        </div>

        <div className="auth-panel-mid">
          <div className="auth-card">{children}</div>
        </div>

        <footer className="auth-foot">
          <a href="https://strategicmedicalbrokers.com/privacy-policy/" target="_blank" rel="noreferrer noopener">
            Privacy Policy
          </a>
          <a href="https://strategicmedicalbrokers.com/" target="_blank" rel="noreferrer noopener">
            strategicmedicalbrokers.com
          </a>
          <span>© 2026 Strategic Medical Brokers</span>
        </footer>
      </section>
    </div>
  );
}
