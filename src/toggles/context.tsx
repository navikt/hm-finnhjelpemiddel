import { createContext, PropsWithChildren, ReactElement, useContext } from "react";

import { ExpectedToggles } from "./toggles";

const FlagContext = createContext<{ toggles: IToggle[] }>({ toggles: [] });

export function FlagProvider({ toggles, children }: PropsWithChildren<{ toggles: IToggle[] }>): ReactElement {
  return <FlagContext.Provider value={{ toggles: toggles ?? [] }}>{children}</FlagContext.Provider>;
}

export function useFlag(name: ExpectedToggles): IToggle {
  const context = useContext(FlagContext);
  const toggle = context?.toggles.find((toggle) => toggle.name === name);

  if (toggle == null) {
    return { name, enabled: false };
  }

  return toggle;
}

export interface IToggle {
  name: string;
  enabled: boolean;
}
