import { useId, useState } from 'react';
import { useMeasure } from '../../lib/hooks';
import { formatCompact, formatNumber } from '../../lib/format';
import { labelStride, linePath, niceScale } from './scale';

/** Responsive SVG line + area chart with the same interaction model as BarChart. */
export default function LineChart({
  data = [],
  color = 'var(--viz-3)',
  height = 240,
  valueLabel = 'Value',
  ariaLabel,
}) {
  const [ref, { width }] = useMeasure();
  const [active, setActive] = useState(null);
  const gradId = useId().replace(/[:]/g, '');

  const w = Math.max(width, 240);
  const isNarrow = w < 460;
  const pad = { top: 14, right: 10, bottom: isNarrow ? 30 : 28, left: isNarrow ? 30 : 40 };
  const h = isNarrow ? Math.max(190, height - 30) : height;
  const innerW = Math.max(10, w - pad.left - pad.right);
  const innerH = Math.max(10, h - pad.top - pad.bottom);

  const values = data.map((d) => d.value);
  const allIntegers = values.every(Number.isInteger);
  const { max, ticks } = niceScale(Math.max(...values, 1), isNarrow ? 3 : 5, allIntegers);
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const xOf = (i) => pad.left + step * i;
  const yOf = (v) => pad.top + innerH - (v / max) * innerH;

  const points = data.map((d, i) => ({ x: xOf(i), y: yOf(d.value) }));
  const line = linePath(points);
  const area = points.length
    ? `${line} L${points[points.length - 1].x},${pad.top + innerH} L${points[0].x},${pad.top + innerH} Z`
    : '';
  const stride = labelStride(data.length, innerW, isNarrow ? 40 : 56);
  const activeDatum = active != null ? data[active] : null;
  const tipLeft = active != null ? Math.min(Math.max(xOf(active), 62), w - 62) : 0;

  return (
    <div className="chart" ref={ref} style={{ position: 'relative' }}>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={ariaLabel ?? `${valueLabel} trend`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActive((i) => Math.min((i ?? -1) + 1, data.length - 1));
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActive((i) => Math.max((i ?? data.length) - 1, 0));
          } else if (e.key === 'Escape') setActive(null);
        }}
        onBlur={() => setActive(null)}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`g${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={pad.left + innerW} y1={yOf(t)} y2={yOf(t)} stroke="var(--viz-grid)" />
            <text
              x={pad.left - 8}
              y={yOf(t) + 4}
              textAnchor="end"
              fontSize={isNarrow ? 9.5 : 10.5}
              fill="var(--viz-axis)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatCompact(t)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#g${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle
            key={`pt-${data[i].label}`}
            cx={p.x}
            cy={p.y}
            r={active === i ? 5 : 3.2}
            fill="#fff"
            stroke={color}
            strokeWidth="2"
            style={{ transition: 'r 120ms ease' }}
          />
        ))}

        {active != null && (
          <line
            x1={xOf(active)}
            x2={xOf(active)}
            y1={pad.top}
            y2={pad.top + innerH}
            stroke="var(--smb-line-strong)"
            strokeDasharray="3 3"
          />
        )}

        <line
          x1={pad.left}
          x2={pad.left + innerW}
          y1={pad.top + innerH}
          y2={pad.top + innerH}
          stroke="var(--smb-line-strong)"
        />

        {data.map((d, i) =>
          i % stride === 0 || i === data.length - 1 ? (
            <text
              key={`l-${d.label}`}
              x={Math.min(Math.max(xOf(i), pad.left + 10), pad.left + innerW - 10)}
              y={h - 9}
              textAnchor="middle"
              fontSize={isNarrow ? 9.5 : 10.5}
              fill="var(--viz-axis)"
            >
              {d.label}
              {d.partial ? '*' : ''}
            </text>
          ) : null,
        )}

        {/* hit areas */}
        {data.map((d, i) => (
          <rect
            key={`hit-${d.label}`}
            x={xOf(i) - step / 2}
            y={pad.top}
            width={Math.max(step, 12)}
            height={innerH}
            fill="transparent"
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive((cur) => (cur === i ? null : cur))}
          />
        ))}
      </svg>

      {activeDatum && (
        <div className="chart-tip" style={{ left: tipLeft, top: Math.max(4, yOf(activeDatum.value) - 54) }} aria-hidden="true">
          <span className="chart-tip-label">
            {activeDatum.label}
            {activeDatum.partial ? ' (partial)' : ''}
          </span>
          <span className="chart-tip-value">
            {formatNumber(activeDatum.value)} <em>{valueLabel}</em>
          </span>
        </div>
      )}

      <table className="sr-only">
        <caption>{ariaLabel ?? `${valueLabel} trend`}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={`sr-${d.label}`}>
              <th scope="row">{d.label}</th>
              <td>{formatNumber(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
