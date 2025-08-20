import { headers } from 'next/headers'
import { validateToken } from '@navikt/oasis'
import { decodeJwt } from 'jose'
import { BodyShort } from '@navikt/ds-react'

async function getData() {
  const authHeader = (await headers()).get('authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')

    const result = await validateToken(token)

    if (result.ok) {
      const payload = decodeJwt(token)
      return {
        props: { sub: payload.sub as string },
      }
    } else {
      return {
        redirect: {
          destination: '/oauth2/login',
          permanent: false,
        },
      }
    }
  } else {
    return {
      redirect: {
        destination: '/oauth2/login',
        permanent: false,
      },
    }
  }
}
export default async function Page() {
  const { props } = await getData()
  return props ? <BodyShort>Data = {props.sub}</BodyShort> : <BodyShort>Ikke no props</BodyShort>
}
