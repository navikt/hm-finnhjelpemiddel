/* import { MetadataRoute } from 'next'

import { getProductWithVariants, FetchResponse, fetchSuggestions } from '@/utils/api-util'

const SearchDataQuery = {
 searchTerm: '',
 isoCode: '',
 hasAgreementsOnly: false,
 filters: {
   beregnetBarn: [],
   breddeCM: [null, null],
   brukervektMaksKG: [null, null],
   brukervektMinKG: [null, null],
   fyllmateriale: [],
   lengdeCM: [null, null],
   materialeTrekk: [],
   setebreddeMaksCM: [null, null],
   setebreddeMinCM: [null, null],
   setedybdeMaksCM: [null, null],
   setehoydeMaksCM: [null, null],
   setehoydeMinCM: [null, null],
   setedybdeMinCM: [null, null],
   totalVektKG: [null, null],
   leverandor: [],
   produktkategori: [],
   rammeavtale: [],
 },
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const someProducts= fetchSuggestions("")

 const SiteURL = 'https://finnhjelpemiddel.nav.no'

 const restUrls = [
   {
     url: `${SiteURL}/`,
     lastModified: new Date(),
     changeFrequency: 'monthly',
     priority: 1,
   },
   {
     url: `${SiteURL}/om-nettstedet`,
     lastModified: new Date(),
     changeFrequency: 'yearly',
     priority: 0.2,
   },
   {
     url: `${SiteURL}/produkt`,
     lastModified: new Date(),
     changeFrequency: 'monthly',
     priority: 0.6,
   },
   {
     url: `${SiteURL}/rammeavtale`,
     lastModified: new Date(),
     changeFrequency: 'monthly',
     priority: 0.7,
   },
   {
     url: `${SiteURL}/sammenlign`,
     lastModified: new Date(),
     changeFrequency: 'monthly',
     priority: 0.3,
   },
   {
     url: `${SiteURL}/sok`,
     lastModified: new Date(),
     changeFrequency: 'weekly',
     priority: 0.5,
   },
 ]
 const productsSitemap = someProducts.map(({ slugAsParams, date }) => {
   return {
     url: `${URL}/products/${slugAsParams}`,
     lastModified: new Date(date),
     priority: 0.64,
     changeFrequency: 'daily',
   }
 })

 return [...restUrls, ...productsSitemap]*/
}
