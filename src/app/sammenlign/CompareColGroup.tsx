/**
 * Felles kolonnebredder for alle tabellene i sammenligningen. Tabellene er separate elementer,
 * så uten faste kolonner regner nettleseren ut bredder hver for seg, og kolonnene liner ikke opp.
 */
export const CompareColGroup = ({ columnCount }: { columnCount: number }) => (
  <colgroup>
    <col className="compare-col--label" />
    {Array.from({ length: columnCount }, (_, index) => (
      <col key={index} className="compare-col--value" />
    ))}
  </colgroup>
)
