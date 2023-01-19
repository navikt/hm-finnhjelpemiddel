'use client'
import { Heading } from '@navikt/ds-react/esm/typography'
import { Product, TechData2 } from '../../utils/product-util'
import { useHydratedPCStore } from '../../utils/state-util'
import '../../styles/comparing-table.scss'

export default function ComparePage({ params }: any) {
  const { productsToCompare, removeProduct } = useHydratedPCStore()
  // const productsToCompare = []

  const allDataKeys = productsToCompare.flatMap((prod) => prod.techData.map((td) => td.key))

  return (
    <div className="main-wrapper compare-page">
      <Heading level="1" size="large">
        Sammenlign produkter
      </Heading>
      <Heading level="2" size="medium">
        Tekniske egenskaper
      </Heading>
      <div className="comparing-table">
        <table>
          <thead className="column">
            <tr>
              <th>
                <Heading level="2" size="medium">
                  Produkter
                </Heading>
              </th>
              {allDataKeys.length > 0 && allDataKeys.map((key, i) => <th key={key + i}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {productsToCompare.length > 0 &&
              productsToCompare.map((product, i) => (
                <ProductView key={product.id} product={product} dataKeys={allDataKeys} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ProductView = ({ product, dataKeys }: { product: Product; dataKeys: string[] }) => {
  console.log(product.techDataDict)
  console.log(dataKeys)
  return (
    <tr className="column">
      <th>{product.title}</th>
      {product.techData.length > 0 &&
        dataKeys.map((dataKey, i) => (
          <td key={product.id + dataKey + i}>
            {product.techDataDict[dataKey] !== undefined
              ? product.techDataDict[dataKey].value + product.techDataDict[dataKey].unit
              : '-'}
          </td>
        ))}
    </tr>
  )
}
