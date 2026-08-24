import { fetcherGET } from '@/utils/api-util'
import { TechLabelDTO } from '@/utils/techlabel-util'
import useSWR from 'swr'

export const useTechLabels = (isoCategory: string) => {
  const { data, isLoading } = useSWR<TechLabelDTO[]>(
    isoCategory ? `/api/v1/techlabels/${isoCategory}` : null,
    fetcherGET,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    }
  )

  return { techLabels: data, isLoading }
}
