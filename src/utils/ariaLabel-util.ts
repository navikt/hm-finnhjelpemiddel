import { SortColumns } from '@/app/forside/Agreements'

export const defaultAriaLabel: string = 'Trykk for å sortere stigende eller synkende'

export const getAriaLabel = ({ sortColumns, ariaLabelKey }: { sortColumns: SortColumns; ariaLabelKey: string }) => {
  return sortColumns.direction === 'ascending'
    ? `${ariaLabelKey} sortert stigende, trykk for å endre`
    : sortColumns.direction === 'descending'
      ? `${ariaLabelKey} sortert synkende, trykk for å endre`
      : defaultAriaLabel + ariaLabelKey
}
