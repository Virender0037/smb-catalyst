import { useIsMobile } from '../../lib/hooks';

/**
 * One responsive table used by every admin list screen.
 *
 * Desktop / tablet  — a real <table> inside a controlled horizontal scroller,
 *                     so dense operational columns stay readable.
 * Mobile (<768px)   — the same rows re-composed as stacked cards, because a
 *                     nine-column table is unusable on a 375px phone.
 *
 * Column options
 *   key         unique id
 *   header      column heading
 *   cell(row)   render function
 *   width       CSS width for the <col>
 *   align       'right' aligns header + cell
 *   nowrap      prevents wrapping in the cell
 *   primary     card title on mobile (exactly one column should set this)
 *   cardBadge   rendered top-right of the card instead of as a labelled row
 *   cardFooter  rendered in the card footer (use for the actions column)
 *   cardHide    omitted from the card entirely
 */
export default function DataTable({
  columns,
  rows,
  rowKey = (r) => r.id,
  onRowClick,
  minWidth = 960,
  caption,
  empty = null,
  dense = false,
}) {
  const isMobile = useIsMobile();

  if (!rows.length) return empty;

  if (isMobile) {
    const primary = columns.find((c) => c.primary) ?? columns[0];
    const badge = columns.find((c) => c.cardBadge);
    const footer = columns.filter((c) => c.cardFooter);
    const body = columns.filter(
      (c) => c !== primary && !c.cardBadge && !c.cardFooter && !c.cardHide,
    );

    return (
      <div className="ad-cards">
        {rows.map((row) => {
          const clickable = Boolean(onRowClick);
          return (
            <article
              className={`ad-card-row ${clickable ? 'is-clickable' : ''}`}
              key={rowKey(row)}
              onClick={clickable ? () => onRowClick(row) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? 'button' : undefined}
            >
              <div className="ad-card-top">
                <div className="ad-card-primary">{primary.cell(row)}</div>
                {badge && <div className="ad-card-badge">{badge.cell(row)}</div>}
              </div>

              {body.length > 0 && (
                <dl className="ad-card-fields">
                  {body.map((c) => (
                    <div className="ad-card-field" key={c.key}>
                      <dt>{c.header}</dt>
                      <dd>{c.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {footer.length > 0 && (
                <div className="ad-card-foot" onClick={(e) => e.stopPropagation()}>
                  {footer.map((c) => (
                    <span key={c.key}>{c.cell(row)}</span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="ad-table-scroll">
      <table className={`table ad-table ${dense ? 'ad-table-dense' : ''}`} style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.align === 'right' ? 'td-right' : ''}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const clickable = Boolean(onRowClick);
            return (
              <tr
                key={rowKey(row)}
                className={clickable ? 'ad-row-clickable' : ''}
                onClick={clickable ? () => onRowClick(row) : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter') onRowClick(row);
                      }
                    : undefined
                }
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[c.align === 'right' ? 'td-right' : '', c.nowrap ? 'td-nowrap' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={c.stopClick ? (e) => e.stopPropagation() : undefined}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
