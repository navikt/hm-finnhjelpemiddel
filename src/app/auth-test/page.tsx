import { headers } from 'next/headers'
import { validateToken } from '@navikt/oasis'
import { decodeJwt } from 'jose'
import { BodyShort } from '@navikt/ds-react'
import { redirect as redirectNext } from 'next/navigation'

async function getData() {
  const authHeader = (await headers()).get('authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')

    const result = await validateToken(token)

    if (result.ok) {
      const payload = decodeJwt(token)
      return {
        props: { sub: payload.sub as string, groups: payload.groups as string },
      }
    } else {
      return {
        redirect: {
          destination: '/oauth2/login',
        },
      }
    }
  } else {
    return {
      redirect: {
        destination: '/oauth2/login',
      },
    }
  }
}
export default async function Page() {
  const { props, redirect } = await getData()

  if (redirect) {
    redirectNext(redirect.destination)
  }
  console.log(props)
  return props ? <BodyShort>Data = {props.groups}</BodyShort> : <BodyShort>Ikke no props</BodyShort>
}
