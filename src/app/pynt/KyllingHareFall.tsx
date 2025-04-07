import Snowfall from 'react-snowfall'

export const KyllingHareFall = () => {
  let images
  if (typeof window !== 'undefined') {
    const kylling = document.createElement('img')
    kylling.src = './assets/chicken-svgrepo-com.svg'
    const hare = document.createElement('img')
    hare.src = './assets/easter-bunny-rabbit-svgrepo-com.svg'

    images = [kylling, hare]
  }

  return (
    <Snowfall
      style={{
        zIndex: 1,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
      }}
      radius={[30, 30]}
      images={images}
    />
  )
}
