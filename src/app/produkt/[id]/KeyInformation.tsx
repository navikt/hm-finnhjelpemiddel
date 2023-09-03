import { Product } from '@/utils/product-util'

import { Heading } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'

type KeyInformationProps = {
  product: Product
  supplierName: string | null
  agreementTitle: string | null
}

const KeyInformation = ({ product, supplierName, agreementTitle }: KeyInformationProps) => (
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

export default KeyInformation
