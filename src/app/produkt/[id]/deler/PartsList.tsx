'use client'

import useSWR from "swr";
import { fetchCompatibleProducts } from "@/utils/api-util";
import { Box, HGrid, Loader, Search, Tabs } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductVariant } from "@/utils/product-util";
import { PackageIcon, WrenchIcon } from "@navikt/aksel-icons";
import { PartsAccessoriesList } from "@/app/produkt/[id]/deler/PartsAccessoriesList";

interface Props {
  seriesId: string
}

export const PartsList = ({ seriesId }: Props) => {
  const searchParams = useSearchParams()
  const searchTermValue = searchParams.get('searchTerm') || ''
  const [inputValue, setInputValue] = useState(searchTermValue)
  const router = useRouter()
  const pathname = usePathname()

  const [selectedFilterOption, setSelectedFilterOption] = useState<ProductFilterOption>(
    searchParams.get("filter") as ProductFilterOption || ProductFilterOption.ACCESSORIES,
  );

  const handleFilterChange = (filter: ProductFilterOption) => {
    setSelectedFilterOption(filter);
    router.replace(`${pathname}?filter=${filter}`, { scroll: false })
  };

  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>([])

  const onSearch = () => {
    router.replace(`${pathname}?searchTerm=${inputValue}`, { scroll: false })
    setFilteredProducts(data?.filter(product =>
      product.articleName.toLowerCase().includes(inputValue.toLowerCase())
    ) ?? [])
  }

  const onClear = () => {
    router.replace(`${pathname}`, { scroll: false })
    setFilteredProducts(data ?? [])
  }

  const { data, isLoading } = useSWR(seriesId, fetchCompatibleProducts, { keepPreviousData: true })

  useEffect(() => {
    if (data) setFilteredProducts(data);
  }, [data]);

  const filteredData = filteredProducts.filter(product =>
    selectedFilterOption === ProductFilterOption.ACCESSORIES ? product.accessory :
      selectedFilterOption === ProductFilterOption.SPAREPART ? product.sparePart : true
  )

  if (isLoading) return <Loader />

  return (
    <div>
      <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} maxWidth={{ md: '600px' }} marginBlock="7 3"
             align="end">
        <Search
          defaultValue={inputValue}
          label="Søk"
          hideLabel={false}
          variant="simple"
          onChange={setInputValue}
          onKeyUp={onSearch}
          onClear={() => {
            setInputValue('')
            onClear()
          }}
        />
      </HGrid>

      {inputValue && filteredProducts.length > 0 ? (
        <Box paddingBlock="4">
          <PartsAccessoriesList products={filteredProducts} />
        </Box>
      ) : inputValue && filteredProducts.length === 0 ? (
        <p>Ingen treff</p>
      ) : (
        <Box paddingBlock="4">
          <Tabs value={selectedFilterOption} onChange={value => handleFilterChange(value as ProductFilterOption)}>
            <Tabs.List>
              <Tabs.Tab value="ACCESSORIES" label="Tilbehør"
                        icon={<PackageIcon color="#005b82" fontSize="1.5rem" aria-hidden />} />
              <Tabs.Tab value="SPAREPART" label="Reservedeler"
                        icon={<WrenchIcon color="#005b82" fontSize="1.5rem" aria-hidden />} />
            </Tabs.List>
            <Tabs.Panel value="ACCESSORIES" className="h-24 w-full bg-gray-50 p-4">
              <Box paddingBlock="4">
                <PartsAccessoriesList products={filteredData} />
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="SPAREPART" className="h-24 w-full bg-gray-50 p-4">
              <Box paddingBlock="4">
                <PartsAccessoriesList products={filteredData} />
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Box>
      )}
    </div>
  )
}

export enum ProductFilterOption {
  ALL = "ALL",
  ACCESSORIES = "ACCESSORIES",
  SPAREPART = "SPAREPART",
}
