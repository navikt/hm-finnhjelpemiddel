import ClientLoader from '../../../utils/client-components/Loader'

export default function Loading() {
  return (
    <div className="main-wrapper">
      <ClientLoader size={'3xlarge'} title={'Laster produkt informasjon'} />
    </div>
  )
}
