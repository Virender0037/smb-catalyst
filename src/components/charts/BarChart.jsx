import { useState } from 'react';
import { useMeasure } from '../../lib/hooks';
import { formatCompact, formatNumber } from '../../lib/format';
import { labelStride, niceScale } from './scale';

/**
 * Responsive SVG bar chart.
 * Resizes with its container, thins x labels when space is tight,
 * supports pointer + keyboard inspection, and exposes an accessible table.
 */
export default function BarChart({
  data = [],
  color = 'var(--viz-1)',
  height = 260,
  valueLabel = 'Value',
  ariaLabel,
}) {
  const [ref, { width }] = useMeasure();
  const [active, setActive] = useState(null);

  const w = Math.max(width, 240);
  const isNarrow = w < 460;
  const pad = {
    top: 14,
    right: 8,
    bottom: isNarrow ? 30 : 28,
    left: isNarrow ? 34 : 46,
  };
  const h = isNarrow ? Math.max(200, height - 40) : height;
  const innerW = Math.max(10, w - pad.left - pad.right);
  const innerH = Math.max(10, h - pad.top - pad.bottom);

  const values = data.map((d) => d.value);
  const { max, ticks } = niceScale(Math.max(...values, 1), isNarrow ? 3 : 5, values.every(Number.isInteger));
  const slot = innerW / Math.max(data.length, 1);
  const barW = Math.max(6, Math.min(64, slot * 0.6));
  const stride = labelStride(data.length, innerW, isNarrow ? 40 : 52);

  const xOf = (i) => pad.left + slot * i + slot / 2;
  const yOf = (v) => pad.top + innerH - (v / max) * innerH;

  const activeDatum = active != null ? data[active] : null;
  const tipLeft = active != null ? Math.min(Math.max(xOf(active), 66), w - 66) : 0;

  return (
    <div className="chart" ref={ref} style={{ position: 'relative' }}>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={ariaLabel ?? `${valueLabel} by period`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActive((i) => Math.min((i ?? -1) + 1, data.length - 1));
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActive((i) => Math.max((i ?? data.length) - 1, 0));
          } else if (e.key === 'Escape') {
            setActive(null);
          }
        }}
        onBlur={() => setActive(null)}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* gridlines + y ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={pad.left + innerW}
              y1={yOf(t)}
              y2={yOf(t)}
              stroke="var(--viz-grid)"
              strokeWidth="1"
            />
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

        {/* bars */}
        {data.map((d, i) => {
          const barH = Math.max(d.value > 0 ? 2 : 0, innerH - (yOf(d.value) - pad.top));
          const isActive = active === i;
          return (
            <g key={d.label}>
              <rect
                x={xOf(i) - barW / 2}
                y={yOf(d.value)}
                width={barW}
                height={barH}
                rx={Math.min(3, barW / 3)}
                fill={color}
                opacity={d.partial ? 0.45 : isActive ? 1 : 0.86}
                style={{ transition: 'opacity 120ms ease' }}
              />
              {/* hit area */}
              <rect
                x={pad.left + slot * i}
                y={pad.top}
                width={slot}
                height={innerH}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive((cur) => (cur === i ? null : cur))}
              />
            </g>
          );
        })}

        {/* baseline */}
        <line
          x1={pad.left}
          x2={pad.left + innerW}
          y1={pad.top + innerH}
          y2={pad.top + innerH}
          stroke="var(--smb-line-strong)"
          strokeWidth="1"
        />

        {/* x labels */}
        {data.map((d, i) =>
          i % stride === 0 || i === data.length - 1 ? (
            <text
              key={`l-${d.label}`}
              x={xOf(i)}
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
      </svg>

      {activeDatum && (
        <div
          className="chart-tip"
          style={{ left: tipLeft, top: Math.max(4, yOf(activeDatum.value) - 54) }}
          aria-hidden="true"
        >
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
        <caption>{ariaLabel ?? `${valueLabel} by period`}</caption>
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
