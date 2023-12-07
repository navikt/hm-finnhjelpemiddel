import { IToggle } from '@unleash/nextjs'
import { ReactElement, createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { logger } from '@navikt/next-logger'

import { ExpectedToggles } from './toggles'

const FlagContext = createContext<{ toggles: IToggle[] }>({ toggles: [] })

export function FlagProvider({ toggles, children }: PropsWithChildren<{ toggles: IToggle[] }>): ReactElement {
    useEffect(() => {
        if (toggles == null) {
            logger.error("Toggles are not SSR'd, falling back to default toggles.")
        }
    }, [toggles])

    return <FlagContext.Provider value={{ toggles: toggles ?? [] }}>{children}</FlagContext.Provider>
}

export function useToggle(name: ExpectedToggles): IToggle {
    const context = useContext(FlagContext)
    const toggle = context.toggles.find((toggle) => toggle.name === name)

    if (toggle == null) {
        return { name, enabled: false, impressionData: false, variant: { name: 'disabled', enabled: false } }
    }

    return toggle
}
