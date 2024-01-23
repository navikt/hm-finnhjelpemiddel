import { fetchSerieId } from '@/utils/api-util'
import { mapSeriesId } from '@/utils/product-util'

/*export default async function sitemap(): Promise<any> {
  const products = fetchSerieId(true)
  console.log(typeof products)
  console.log(products.toString())
  /!*  console.log(products.hits.hits.length)
    const urlArray = products.hits.hits.flatMap((value) => "https://finnhjelpemiddel.nav.no/produkt/" + value._source.seriesId)
    console.log(urlArray.length)
    console.log(typeof urlArray)
    console.log(urlArray[0])*!/
}*/

export default async function sitemap() {
  const allProducts = mapSeriesId(await fetchSerieId(true))
  /*            const productsOnPost = mapProductsFromCollapse(await getProductsInPost(agreement.id, agreement.postNr))
              .filter((postProduct) => postProduct.id !== product.id)*/
  const SiteURL = 'https://finnhjelpemiddel.nav.no'

  /*  console.log(typeof allProducts)
    console.log(allProducts.toString())
    console.log(allProducts.length)*/
  console.log(allProducts.map((allProducts) => allProducts.seriesId))
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
  /*const productsWithAgreement = allProducts.map((allProducts) => {
    allProducts. ((value) => "https://finnhjelpemiddel.nav.no/produkt/"+value._source.seriesId),
      date })
    return {
      url: `${URL}/blog/${slugAsParams}`,
      lastModified: new Date(date),
      priority: 0.64,
      changeFrequency: "daily",
    };
  });*/
  /* const productsSitemap = fetchSerieId( true)
    console.log(typeof productsSitemap)
    console.log(productsSitemap)
  /!*  productsSitemap.hits.hits.flatMap((value) => "https://finnhjelpemiddel.nav.no/produkt/"+value._source.seriesId)*!/
  
  /!*   return {
       url: `${URL}/products/${slugAsParams}`,
       lastModified: new Date(date),
       priority: 0.64,
       changeFrequency: 'daily',
     }*!/
  
    return {
      SiteURL,
      lastModified: new Date(date),
      priority: 0.64,
      changeFrequency: 'daily',]*/

  /* return [...restUrls, ...productsWithAgreement]*/
  // return [...restUrls]
}

/*
    console.log(typeof products)
    // console.log(products.hits.hits.toString())
    console.log(products.hits.hits.length)
const urlArray = products.hits.hits.flatMap((value) => "https://finnhjelpemiddel.nav.no/produkt/"+value._source.seriesId)
    console.log(urlArray.length)
    console.log(typeof urlArray)
    console.log(urlArray[0])
* */
