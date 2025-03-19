'use client'

import useSWR from "swr";
import { fetchCompatibleProducts } from "@/utils/api-util";
import { HGrid, Loader, Search, Table, ToggleGroup } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductVariant } from "@/utils/product-util";
import { PackageIcon, WrenchIcon } from "@navikt/aksel-icons";

interface Props {
  seriesId: string
}

export const PartsList = ({ seriesId }: Props) => {
  const searchParams = useSearchParams()
  const searchTermValue = searchParams.get('searchTerm') || ''
  const [inputValue, setInputValue] = useState(searchTermValue ?? '')
  const router = useRouter()
  const pathname = usePathname()

  const [selectedFilterOption, setSelectedFilterOption] = useState<ProductFilterOption>(
    searchParams.get("filter") ? (searchParams.get("filter") as ProductFilterOption) : ProductFilterOption.ALL,
  );

  const handeFilterChange = (filter: ProductFilterOption) => {
    setSelectedFilterOption(filter);
    router.replace(`${pathname}?filter=${filter}`, {
      scroll: false,
    })
  };

  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>([])

  const onSearch = () => {
    router.replace(`${pathname}?searchTerm=${inputValue}`, {
      scroll: false,
    })
    if (inputValue.length > 0 && data) {
      setFilteredProducts(data.filter((product) => {
        return product.articleName.toLowerCase().includes(inputValue.toLowerCase())
      }))
    } else {
      setFilteredProducts(data ?? [])
    }
  }

  const onClear = () => {
    router.replace(`${pathname}`, {
      scroll: false,
    })

      setFilteredProducts(data ?? [])

  }

  const { data, isLoading } = useSWR(
    seriesId,
    fetchCompatibleProducts,
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (data) {
      setFilteredProducts(data);
    }
  }, [data]);

  const filteredData = filteredProducts.filter((product) => {
    if (selectedFilterOption === ProductFilterOption.ACCESSORIES) {
      return product.accessory
    } else if (selectedFilterOption === ProductFilterOption.SPAREPART) {
      return product.sparePart
    }
    return true
  })

  if (isLoading) {
    return (<div><Loader /></div>)
  }

  return (
    <div>
      <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} maxWidth={{ md: '600px' }} marginBlock="7 3"
             align="end">
        <Search
          defaultValue={inputValue}
          label="Søk"
          hideLabel={false}
          variant="simple"
          onChange={(value) => {
            setInputValue(value)
          }}
          onKeyUp={onSearch}
          onClear={() => {
            setInputValue('')
            onClear()
          }}
        />
        <ToggleGroup
          value={selectedFilterOption}
          onChange={(value) => handeFilterChange(value as ProductFilterOption)}
          fill>
          <ToggleGroup.Item value={ProductFilterOption.ALL} label="Alle" />
          <ToggleGroup.Item value={ProductFilterOption.ACCESSORIES} label="Tilbehør" />
          <ToggleGroup.Item value={ProductFilterOption.SPAREPART} label="Reservedeler" />
        </ToggleGroup>
      </HGrid>

      {(!inputValue || inputValue.length === 0) && data && data.length > 0 ? (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredData.map((product) => (
                <Table.Row key={product.id}>
                  <Table.DataCell>{product.hmsArtNr}</Table.DataCell>
                  <Table.DataCell>{product.articleName}</Table.DataCell>
                  <Table.DataCell>{product.supplierName}</Table.DataCell>
                  <Table.DataCell>{product.supplierRef}</Table.DataCell>
                  <Table.DataCell>{product.sparePart ?
                    <WrenchIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} /> :
                    <PackageIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}</Table.DataCell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      ) : inputValue && inputValue.length > 0 && filteredData.length > 0 ? (
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">HMS-nummer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Leverandørnavn</Table.HeaderCell>
              <Table.HeaderCell scope="col">Lev-artnr</Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredData.map((product) => (
                <Table.Row key={product.id}>
                  <Table.DataCell>{product.hmsArtNr}</Table.DataCell>
                  <Table.DataCell>{product.articleName}</Table.DataCell>
                  <Table.DataCell>{product.supplierName}</Table.DataCell>
                  <Table.DataCell>{product.supplierRef}</Table.DataCell>
                  <Table.DataCell>{product.sparePart ?
                    <WrenchIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} /> :
                    <PackageIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}</Table.DataCell>
                </Table.Row>
              )
            )}
          </Table.Body>
        </Table>
      ) : (
        <p>Ingen treff</p>
      )}
    </div>
  )
}

export enum ProductFilterOption {
  ALL = "ALL",
  ACCESSORIES = "ACCESSORIES",
  SPAREPART = "SPAREPART",
}
