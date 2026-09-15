import logoUrl from '../../assets/smb-logo.png';
import markUrl from '../../assets/smb-mark.png';

/**
 * Official Strategic Medical Brokers logo.
 *
 * Source: the header asset served by strategicmedicalbrokers.com
 * (wp-content/uploads/2023/12/png-new-02-01.png), copied into the
 * project rather than hot-linked. Colours and aspect ratio are the
 * originals — the asset is never recoloured or stretched.
 *
 * The published brand has no reverse/white variant, so every surface
 * the logo sits on in this portal is a light one.
 */
export default function Logo({ height = 40, compact = false, className = '' }) {
  const src = compact ? markUrl : logoUrl;
  return (
    <img
      src={src}
      alt="Strategic Medical Brokers"
      className={`logo ${className}`}
      style={{ height, width: 'auto' }}
      decoding="async"
    />
  );
}

/** Square monogram crop of the same official asset (tight spaces, favicons). */
export function LogoMark({ size = 34, className = '' }) {
  return (
    <img
      src={markUrl}
      alt=""
      aria-hidden="true"
      className={`logo-mark ${className}`}
      style={{ height: size, width: 'auto' }}
      decoding="async"
    />
  );
}
