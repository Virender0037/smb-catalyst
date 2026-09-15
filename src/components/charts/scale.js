/** Axis helpers shared by every chart. */

/** Rounds a raw max up to a readable 1 / 2 / 2.5 / 5 x 10^n step. */
export function niceScale(max, tickCount = 4, forceInteger = false) {
  if (!Number.isFinite(max) || max <= 0) return { max: 1, ticks: [0, 1] };
  const rough = max / tickCount;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const norm = rough / mag;
  let step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  // Counts (leads, NDAs) must never produce fractional axis labels.
  if (forceInteger) step = Math.max(1, Math.round(step));
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return { max: niceMax, ticks };
}

/** Keeps x-axis labels legible by showing every nth one. */
export function labelStride(count, innerWidth, minPx = 46) {
  if (count <= 1) return 1;
  const fit = Math.max(1, Math.floor(innerWidth / minPx));
  return Math.ceil(count / fit);
}

/** Catmull-Rom style smoothing kept subtle — data first, flourish second. */
export function linePath(points) {
  if (!points.length) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}
