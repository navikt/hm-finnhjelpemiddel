import { mapAgreement } from '@/utils/agreement-util'
import { getAgreement, getProduct, getProductsInPost, getSeries, getSupplier } from '@/utils/api-util'
import { Product, mapProduct, mapProducts } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import { BackButton } from '@/components/BackButton'
import { Alert, Heading } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { AgreementInfo } from './AgreementInfo'
import { AgreementSummary } from './AgreementSummary'
import InformationTabs from './InformationTabs'
import PhotoSlider from './PhotoSlider'
import SimilarProducts from './SimilarProducts'
import './product-page.scss'

export default async function ProduktPage({ params: { id: productId } }: { params: { id: string } }) {
  const product = mapProduct((await getProduct(productId))._source)
  const supplier = mapSupplier((await getSupplier(String(product.supplierId)))._source)
  const seriesProducts = mapProducts(await getSeries(String(product.seriesId))).filter((prod) => prod.id !== product.id)

  const agreement =
    product.agreementInfo?.id && mapAgreement((await getAgreement(String(product.agreementInfo?.id)))._source)

  const productsOnPost =
    product.agreementInfo &&
    mapProducts(await getProductsInPost(String(product.agreementInfo?.postIdentifier)))
      .filter((postProduct) => postProduct.id !== product.id)
      .sort((productA, productB) =>
        productA.agreementInfo && productB.agreementInfo
          ? productA.agreementInfo?.rank - productB.agreementInfo?.rank
          : -1
      )

  return (
    <>
      <BackButton />
      <AnimateLayout>
        <article className="product-info">
          <section className="product-info__top">
            <div className="product-info__top-content max-width">
              <aside>{product.photos && <PhotoSlider photos={product.photos} />}</aside>
              <div className="product-info__top-right">
                <Heading level="1" size="large" spacing>
                  {product.attributes.series ? product.attributes.series : product.title}
                </Heading>
                <AgreementSummary product={product} />
                <div className="product-info__expired-propducts">
                  {new Date(product.expired).getTime() <= Date.now() && (
                    <Alert variant="warning">Dette produktet er utgått</Alert>
                  )}
                </div>
                <KeyInformation product={product} supplierName={supplier ? supplier.name : null} />
              </div>
            </div>
          </section>

          <section className="product-info__tabs max-width">
            <InformationTabs product={product} supplier={supplier} />
          </section>
          {seriesProducts.length > 0 && (
            <section className="product-info__similar-products max-width">
              <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
            </section>
          )}
          {agreement && <AgreementInfo product={product} agreement={agreement} productsOnPost={productsOnPost} />}
        </article>
      </AnimateLayout>
    </>
  )
}

const KeyInformation = ({ product, supplierName }: { product: Product; supplierName: string | null }) => (
  <div className="product-info__key-information">
    <Heading level="2" size="medium">
      Nøkkelinfo
    </Heading>
    <DefinitionList>
      <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
      <DefinitionList.Definition>{product.hmsArtNr ? product.hmsArtNr : '-'}</DefinitionList.Definition>
      <DefinitionList.Term>Leverandør</DefinitionList.Term>
      <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
      <DefinitionList.Term>Lev-artnr.</DefinitionList.Term>
      <DefinitionList.Definition>{product.supplierRef ? product.supplierRef : '-'}</DefinitionList.Definition>
      <DefinitionList.Term>ISO-klassifisering</DefinitionList.Term>
      <DefinitionList.Definition>
        {product.isoCategoryTitle + ' (' + product.isoCategory + ')'}
      </DefinitionList.Definition>
      <DefinitionList.Term>På bestillingsordning</DefinitionList.Term>
      <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
    </DefinitionList>
  </div>
)
