import { mapAgreement } from '@/utils/agreement-util'
import { getAgreement, getProductWithVariants, getProductsInPost, getSupplier } from '@/utils/api-util'
import { Product, mapProductFromSeriesId, mapProductsFromCollapse } from '@/utils/product-util'
import { mapSupplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { BackButton } from '@/components/BackButton'
import { Alert, BodyShort, Heading } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { AgreementInfo } from './AgreementInfo'
import InformationTabs from './InformationTabs'
import PhotoSlider from './PhotoSlider'
import ProductVariants from './ProductVariants'
import './product-page.scss'

export default async function ProduktPage({ params: { id: seriesId } }: { params: { id: string } }) {
  const product = mapProductFromSeriesId(await getProductWithVariants(String(seriesId)))
  const supplier = mapSupplier((await getSupplier(product.supplierId))._source)
  const agreement =
    product.applicableAgreementInfo && mapAgreement((await getAgreement(product.applicableAgreementInfo.id))._source)

  const productsOnPost = product.applicableAgreementInfo?.postIdentifier
    ? mapProductsFromCollapse(await getProductsInPost(product.applicableAgreementInfo?.postIdentifier))
        .filter((postProduct) => postProduct.id !== product.id)
        .sort((productA, productB) =>
          productA.applicableAgreementInfo && productB.applicableAgreementInfo
            ? productA.applicableAgreementInfo?.rank - productB.applicableAgreementInfo?.rank
            : -1
        )
    : null

  return (
    <>
      <BackButton />
      <AnimateLayout>
        <article className="product-info">
          <section className="product-info__top" aria-label="Bilder og nøkkelinformasjon">
            <div className="product-info__top-content max-width">
              <div className="product-info__top-left">{product.photos && <PhotoSlider photos={product.photos} />}</div>
              <div className="product-info__top-right">
                <div className="product-info__heading-container">
                  <Heading level="1" size="large" spacing>
                    {product.title}
                  </Heading>
                </div>

                {product.applicableAgreementInfo && (
                  <div className="product-info__agreement-rank">
                    <AgreementIcon rank={product.applicableAgreementInfo.rank} />
                    <BodyShort>
                      {product.applicableAgreementInfo.rank === 99
                        ? 'Tilbehøret på avtale med NAV - ingen rangering'
                        : `Rangert som nr ${product.applicableAgreementInfo.rank} på avtale med Nav`}
                    </BodyShort>
                  </div>
                )}

                <div className="product-info__expired-propducts">
                  {/* TODO: check all expired dates */}
                  {new Date(product.variants[0].expired).getTime() <= Date.now() ? (
                    <Alert variant="warning">Dette produktet er utgått</Alert>
                  ) : (
                    ''
                  )}
                </div>
                <KeyInformation
                  product={product}
                  supplierName={supplier ? supplier.name : null}
                  agreementTitle={agreement ? agreement.title : null}
                />
              </div>
            </div>
          </section>

          <section className="product-info__tabs max-width" aria-label="Produktbeskrivelse og medfølgende dokumenter">
            <InformationTabs product={product} supplier={supplier} />
          </section>
          <section
            className="product-info__characteristics max-width"
            aria-label="Produktegenskaper som alle produktvariantene har til felles"
          >
            <Heading level="2" size="medium" spacing>
              Produktegenskaper
            </Heading>
            <TechnicalSpecifications product={product} />
            {/*test denne http://localhost:3000/produkt/9c68e99a-a730-4048-ad2c-2ba8ff466b8f */}
          </section>

          {product.variantCount > 1 && (
            <section
              className="product-info__product-variants max-width"
              aria-label="Tabell med informasjon på tvers av produktvarianter som finnes"
            >
              <ProductVariants product={product} />
            </section>
          )}

          {agreement && <AgreementInfo product={product} productsOnPost={productsOnPost} />}
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
  product: Product
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

const TechnicalSpecifications = ({ product }: { product: Product }) => {
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
