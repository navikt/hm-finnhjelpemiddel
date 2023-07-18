import { mapAgreement } from '@/utils/agreement-util'
import { getAgreement, getProduct, getProductWithVariants, getProductsInPost, getSupplier } from '@/utils/api-util'
import { ProductWithVariants, mapProduct, mapProductWithVariants, mapProducts } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { BackButton } from '@/components/BackButton'
import { Alert, Heading } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { AgreementInfo } from './AgreementInfo'
import InformationTabs from './InformationTabs'
import PhotoSlider from './PhotoSlider'
import SimilarProducts from './SimilarProducts'
import './product-page.scss'

export default async function ProduktPage({ params: { id: productId } }: { params: { id: string } }) {
  const product = mapProduct((await getProduct(productId))._source)
  const supplier = mapSupplier((await getSupplier(String(product.supplierId)))._source)
  const productWithVariants = mapProductWithVariants(
    (await getProductWithVariants(String(product.seriesId))).hits.hits,
    product.seriesId
  )

  const agreement =
    productWithVariants.applicableAgreementInfo &&
    mapAgreement((await getAgreement(productWithVariants.applicableAgreementInfo.id))._source)

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
        <article className="product-info" aria-label="Produktinformasjon">
          <section className="product-info__top" aria-label="Bilder og nøkkelinformasjon">
            <div className="product-info__top-content max-width">
              <div>{productWithVariants.photos && <PhotoSlider photos={productWithVariants.photos} />}</div>
              <div className="product-info__top-right">
                <div className="product-info__heading-container">
                  <Heading level="1" size="large" spacing>
                    {productWithVariants.title}
                  </Heading>
                  {productWithVariants.applicableAgreementInfo && (
                    <AgreementIcon rank={productWithVariants.applicableAgreementInfo.rank} />
                  )}
                </div>
                <div className="product-info__expired-propducts">
                  {/* TODO: check all expired dates */}
                  {new Date(productWithVariants.variants[0].expired).getTime() <= Date.now() ? (
                    <Alert variant="warning">Dette produktet er utgått</Alert>
                  ) : (
                    ''
                  )}
                </div>
                <KeyInformation
                  product={productWithVariants}
                  supplierName={supplier ? supplier.name : null}
                  agreementTitle={agreement ? agreement.title : null}
                />
              </div>
            </div>
          </section>

          <section className="product-info__tabs max-width" aria-label="Produktbeskrivelse og medfølgende dokumenter">
            <InformationTabs product={productWithVariants} supplier={supplier} />
          </section>
          <section
            className="product-info__characteristics max-width"
            aria-label="Produktegenskaper som alle produktvariantene har til felles"
          >
            <Heading level="2" size="medium" spacing>
              Produktegenskaper
            </Heading>
            <TechnicalSpecifications product={productWithVariants} />
          </section>

          <section
            className="product-info__similar-products max-width"
            aria-label="Tabell med informasjon på tvers av produktvarianter som finnes"
          >
            <SimilarProducts product={productWithVariants} />
          </section>

          {agreement && <AgreementInfo product={product} agreement={agreement} productsOnPost={productsOnPost} />}
        </article>
      </AnimateLayout>
    </>
  )
}

const KeyInformation = ({
  product,
  supplierName,
  agreementTitle,
}: {
  product: ProductWithVariants
  supplierName: string | null
  agreementTitle: string | null
}) => (
  <div className="product-info__key-information">
    <Heading level="2" size="medium">
      Nøkkelinfo
    </Heading>
    <DefinitionList>
      {product.applicableAgreementInfo && <DefinitionList.Term>Rangering</DefinitionList.Term>}
      {product.applicableAgreementInfo && (
        <DefinitionList.Definition>{product.applicableAgreementInfo?.rank}</DefinitionList.Definition>
      )}
      {product.applicableAgreementInfo && <DefinitionList.Term>Delkontrakt</DefinitionList.Term>}
      {product.applicableAgreementInfo && (
        <DefinitionList.Definition>
          {'Nr ' + product.applicableAgreementInfo?.postNr + ': ' + product.applicableAgreementInfo?.postTitle ??
            product.attributes?.text}
        </DefinitionList.Definition>
      )}

      {agreementTitle && <DefinitionList.Term>Avtale</DefinitionList.Term>}
      {agreementTitle && <DefinitionList.Definition>{agreementTitle}</DefinitionList.Definition>}
      <DefinitionList.Term>Leverandør</DefinitionList.Term>
      <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
      <DefinitionList.Term>Bestillingsordning</DefinitionList.Term>
      <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
    </DefinitionList>
  </div>
)

const TechnicalSpecifications = ({ product }: { product: ProductWithVariants }) => {
  return (
    <DefinitionList>
      <DefinitionList.Term>ISO-kategori (kode)</DefinitionList.Term>
      <DefinitionList.Definition>
        {product.isoCategoryTitle + '(' + product.isoCategory + ')'}
      </DefinitionList.Definition>
      {product.attributes?.commonCharacteristics?.map((data) => (
        <>
          <DefinitionList.Term>{data.key}</DefinitionList.Term>
          <DefinitionList.Definition>{data.value}</DefinitionList.Definition>
        </>
      ))}
    </DefinitionList>
  )
}
