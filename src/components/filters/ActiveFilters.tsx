// import { FilterFormState } from '@/utils/filter-util'
// import { SearchData } from '@/utils/search-state-util'
// import { Entries } from '@/utils/type-util'
// import { Chips, HStack, Heading, VStack } from '@navikt/ds-react'
// import { useFormContext } from 'react-hook-form'

// interface Props {
//   selectedFilters: FilterFormState
// }

// const ActiveFilters = ({ selectedFilters }: Props) => {
//   const formMethods = useFormContext<FilterFormStateProductPage>()
//   const filterChips = (Object.entries(selectedFilters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
//     key,
//     values,
//     label: FilterCategories[key],
//   }))
//   const filterValues = Object.values(selectedFilters)
//     .flat()
//     .filter((val) => val)

//   const FilterChips = () => {
//     return (
//       <HStack gap="12">
//         <Chips>
//           {filterChips.map(({ key, label, values }) => {
//             return values
//               .filter((v) => v)
//               .map((value) => {
//                 return (
//                   <Chips.Removable
//                     key={key + value}
//                     onClick={(e) => {
//                       formMethods.setValue(
//                         `filters.${key}`,
//                         values.filter((val) => val !== value)
//                       )
//                       event.currentTarget?.form?.requestSubmit()
//                     }}
//                   >
//                     {label === FilterCategories.produktkategori ? value : `${label}: ${value}`}
//                   </Chips.Removable>
//                 )
//               })
//           })}
//         </Chips>
//       </HStack>
//     )
//   }

//   if (withoutHeading) {
//     return <FilterChips />
//   }
//   return (
//     <>
//       {filterValues.length > 0 && (
//         <VStack className="search__active-filter-container" gap="4">
//           <Heading level="2" size="small">
//             Valgte filtre
//           </Heading>
//           <FilterChips />
//         </VStack>
//       )}
//     </>
//   )
// }

// export default ActiveFilters
