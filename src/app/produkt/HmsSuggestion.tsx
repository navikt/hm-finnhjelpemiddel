'use client'
import { getProductWithVariantsSuggestions } from '@/utils/api-util'
import { HMSSuggestionWheelChair, Product, wheelchairFilters } from '@/utils/product-util'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons'
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  CopyButton,
  HStack,
  Heading,
  Loader,
  TextField,
  VStack,
} from '@navikt/ds-react'
import { useState } from 'react'
import useSWR from 'swr'
import { logActionEvent } from '@/utils/amplitude'

interface Props {
  product: Product
}

const HmsSuggestion = ({ product }: Props) => {
  const [setebreddeInput, setSetebreddeInput] = useState('')
  const [setedybdeInput, setSetedybdeInput] = useState('')
  const [key, setKey] = useState<string | null>(null)

  async function handleFetchHMSSuggestion() {
    if (setebreddeInput || setedybdeInput) {
      setKey(`hms_suggestion_${Date.now()}`)
    }
  }

  const {
    data: suggestedVariants,
    error,
    isLoading,
  } = useSWR<HMSSuggestionWheelChair[]>(
    key,
    () => getProductWithVariantsSuggestions(product.id, setebreddeInput, setedybdeInput),
    {}
  )

  const numberOfVariantsText = `${product.title} finnes i ${product.variantCount} varianter. Vet du ønsket bredde og dybde på setet til rullestolen du er ute etter?`

  return (
    <Box paddingInline="6" paddingBlock="10" className="suggestion-container" shadow="xsmall" borderRadius="large">
      <VStack gap="8">
        <VStack gap="2">
          <Heading level="1" size="small">
            Finn HMS-nummer
          </Heading>
          <BodyLong>{numberOfVariantsText}</BodyLong>
        </VStack>
        <VStack gap="4">
          <HStack align="end" gap="2">
            <TextField label="Ønsket setebredde" onChange={(event) => setSetebreddeInput(event.currentTarget.value)} />
            <BodyShort>cm</BodyShort>
          </HStack>
          <HStack align="end" gap="2">
            <TextField label="Ønsket setedybde" onChange={(event) => setSetedybdeInput(event.currentTarget.value)} />
            <BodyShort>cm</BodyShort>
          </HStack>
        </VStack>
        <Button
          variant="secondary-neutral"
          iconPosition="right"
          icon={<MagnifyingGlassIcon aria-hidden title="søk" fontSize="1.5rem" />}
          size="medium"
          onClick={handleFetchHMSSuggestion}
          className="fetch-button"
        >
          Vis forslag til HMS-nummer
        </Button>
      </VStack>

      {error && (
        <>
          <div className="divider" />
          <HStack justify="center">
            <BodyLong>Det skjedde en feil. Vennligst prøv igjen senere</BodyLong>
          </HStack>
        </>
      )}

      {isLoading && (
        <>
          <div className="divider" />
          <HStack justify="center">
            <Loader size="xlarge" />
          </HStack>
        </>
      )}

      {suggestedVariants && suggestedVariants.length === 0 && (
        <>
          <div className="divider" />
          <VStack gap="2" className="suggestion">
            <Alert variant="info" className="no-match-info">
              Ingen treff for dine oppgitte mål. Se tabell med tilgjengelige varianter
            </Alert>
          </VStack>
        </>
      )}

      {suggestedVariants && suggestedVariants.length > 0 && <Suggestion suggestedVariants={suggestedVariants} />}
    </Box>
  )
}

export default HmsSuggestion

const Suggestion = ({ suggestedVariants }: { suggestedVariants: HMSSuggestionWheelChair[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    if (activeIndex >= suggestedVariants.length - 1) return
    else setActiveIndex(activeIndex + 1)
  }

  const handlePrev = () => {
    if (activeIndex === 0) return
    setActiveIndex(activeIndex - 1)
  }

  const showNextButton = activeIndex < suggestedVariants.length - 1
  const showPrevButoon = activeIndex > 0

  return (
    <>
      <div className="divider" />
      <VStack align="center">
        <Heading spacing size="small" level="2">
          {activeIndex + 1} av {suggestedVariants.length}
        </Heading>
        <HStack align="center" gap="4" justify="space-between">
          {showPrevButoon ? (
            <Button
              title="Neste forslag"
              variant="tertiary-neutral"
              className="button-prev-next"
              icon={<ChevronLeftIcon fontSize="2rem" />}
              onClick={handlePrev}
            />
          ) : (
            <div className="button-prev-next"></div>
          )}

          <VStack gap="1" className="suggestion">
            <HStack gap="2" align="center">
              <Heading size="xsmall" level="3">
                HMS-nummer
              </Heading>

              <CopyButton
                className="copy-button"
                iconPosition="right"
                copyText={suggestedVariants[activeIndex].hmsNumber || ''}
                text={suggestedVariants[activeIndex].hmsNumber || ''}
                onClick={() => logActionEvent('kopier')}
              />
            </HStack>
            {wheelchairFilters
              .filter((key) => key in suggestedVariants[activeIndex])
              .map((key) => (
                <HStack gap="2" key={key}>
                  <BodyShort>{key}: </BodyShort>
                  <BodyShort>{suggestedVariants[activeIndex][key]}cm</BodyShort>
                </HStack>
              ))}
          </VStack>
          {showNextButton ? (
            <Button
              title="Forrige forslag"
              variant="tertiary-neutral"
              className="button-prev-next"
              icon={<ChevronRightIcon fontSize="2rem" />}
              onClick={handleNext}
            />
          ) : (
            <div className="button-prev-next"></div>
          )}
        </HStack>
      </VStack>
    </>
  )
}
