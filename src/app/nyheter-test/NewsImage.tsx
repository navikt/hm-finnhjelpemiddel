import { Box } from '@navikt/ds-react'
import { NewspaperIcon } from '@navikt/aksel-icons'
import Image from 'next/image'
type NewsImageProps = {
  imageUrl?: string
  fontSize?: string
  alt?: string
}

export default function NewsImage({fontSize= '5rem', alt, imageUrl}: NewsImageProps) {
    if(imageUrl) {
      return (
        <Box style={{ position: 'relative', width: '100%', height: '100%' }}>                                                                                        ┃
          <Image src={imageUrl} alt={alt ?? ''} fill style={{ objectFit: 'cover' }} />                                                                                     ┃
        </Box>
      )
    }
    return(
    <Box style={{
      backgroundColor: 'var(--ax-bg-neutral-soft)',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <NewspaperIcon fontSize={fontSize} aria-hidden opacity={"5%"}/>
    </Box>
    )
}
