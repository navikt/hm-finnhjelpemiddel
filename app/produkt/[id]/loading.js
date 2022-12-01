import LoaderUseClient from '../../../utils/wrapped-in-use-client/Loader'

export default function Loading() {
  return (
    <div className="main-wrapper">
      <LoaderUseClient size={'3xlarge'} title={'Laster produkt informasjon'} />
    </div>
  )
}
