import Image from "next/image";
import React, { createContext, useContext } from "react";
import Snowfall from "react-snowfall";
import styled from "styled-components";

interface props {
  onClick: () => void;
}

const PepperkakeToggle = (props: props) => {

  const snowfallEnabled = useContext(SnowfallContext);

  return (
    <NakedButton aria-pressed={snowfallEnabled} aria-label="La det snø!" $snowing={snowfallEnabled}
                 onClick={props.onClick}>
      <Image src="/pepperkake.svg" width="65" height="41" alt="" aria-hidden={true} />

      {snowfallEnabled && (
        <Snowfall />
      )}

    </NakedButton>
  )
}

export default PepperkakeToggle

const NakedButton = styled.button<{ $snowing?: boolean; }>`

  text-decoration: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem 0.5rem;
  height: 72px;
  border: none;
  border-bottom: ${props => props.$snowing ? "1px solid rgba(256, 23, 51, 1);" : "4px solid rgba(256, 23, 51, 0);"};

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  &:hover {
    outline: none;
    border-bottom: 1px solid rgba(256, 23, 51, 0.34);
  }
`

export const SnowfallContext = createContext(false);
