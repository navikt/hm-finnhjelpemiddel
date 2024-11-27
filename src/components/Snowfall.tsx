import Snowfall from "react-snowfall";

export const SnowfallComponent = () => {
  return (
    <Snowfall
      style={{
        zIndex: 1,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
      }} />
  )
}
