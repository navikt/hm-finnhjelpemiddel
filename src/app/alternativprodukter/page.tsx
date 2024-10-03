import AlternativeProducts from '@/app/alternativprodukter/AlternativeProducts'

export default async function AlternativeProductsPage() {
  const hmsNumber = '292483'

  const res = await fetch(`${process.env.HM_OEBS_API_URL}/lager/alle-sentraler/${hmsNumber}`, { cache: 'no-store' })

  const storage = res.json()

  return <AlternativeProducts storage={`${res.status} ${res.statusText} ${res.url}`} />
}
