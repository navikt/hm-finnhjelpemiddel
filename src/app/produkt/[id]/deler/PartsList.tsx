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
  const [inputValue, setInputValue] = useState(searchTermValue ?? '')
  const router = useRouter()
  const pathname = usePathname()

  const [selectedFilterOption, setSelectedFilterOption] = useState<ProductFilterOption>(
    searchParams.get("filter") ? (searchParams.get("filter") as ProductFilterOption) : ProductFilterOption.SPAREPART,
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
      </HGrid>

      {inputValue && inputValue.length > 0 && filteredProducts.length > 0 ? (
        <Box paddingBlock="4">
          <PartsAccessoriesList products={filteredProducts} />
        </Box>
      ) : inputValue && inputValue.length > 0 && filteredProducts.length === 0 ? (
        <p>Ingen treff</p>
      ) : (
        <Box paddingBlock="4">
          <Tabs value={selectedFilterOption} onChange={(value) => handeFilterChange(value as ProductFilterOption)}>
            <Tabs.List>
              <Tabs.Tab
                value="SPAREPART"
                label="Reservedeler"
                icon={<WrenchIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}
              />
              <Tabs.Tab
                value="ACCESSORIES"
                label="Tilbehør"
                icon={<PackageIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}
              />
            </Tabs.List>
            <Tabs.Panel value="SPAREPART" className="h-24 w-full bg-gray-50 p-4">
              <PartsAccessoriesList products={filteredData} />
            </Tabs.Panel>
            <Tabs.Panel value="ACCESSORIES" className="h-24 w-full bg-gray-50 p-4">
              <PartsAccessoriesList products={filteredData} />
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


