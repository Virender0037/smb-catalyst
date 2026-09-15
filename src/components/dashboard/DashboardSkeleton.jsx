import { Card, Skeleton } from '../ui';

const Block = ({ rows = 3 }) => (
  <Card>
    <div className="card-body sk-stack">
      <Skeleton w="42%" h={14} />
      <Skeleton w="100%" h={10} />
      {Array.from({ length: rows }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={i} w={`${92 - i * 11}%`} h={10} />
      ))}
    </div>
  </Card>
);

/** Shown while the engagement payload resolves. Mirrors the real layout. */
export default function DashboardSkeleton() {
  return (
    <div className="dash" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your engagement overview…</span>
      <div className="engagement" style={{ background: 'var(--brand-dark)' }}>
        <div className="sk-stack" style={{ opacity: 0.35 }}>
          <Skeleton w="120px" h={20} r="999px" />
          <Skeleton w="min(340px, 70%)" h={26} />
          <Skeleton w="min(480px, 90%)" h={12} />
          <Skeleton w="100%" h={4} style={{ marginTop: 22 }} />
        </div>
      </div>
      <div className="dash-grid">
        <div className="dash-col">
          <Block rows={3} />
          <Block rows={2} />
        </div>
        <div className="dash-col">
          <Block rows={4} />
          <Block rows={2} />
        </div>
      </div>
    </div>
  );
}
