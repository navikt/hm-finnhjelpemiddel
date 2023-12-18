'use client'

import { PropsWithChildren, ReactElement, useState } from 'react'
import { IToggle } from '@unleash/nextjs'
import { FlagProvider } from "@/toggles/context";

type Props = {
    toggles: IToggle[]
}

function Providers({ children, toggles }: PropsWithChildren<Props>): ReactElement {
    return (
            <FlagProvider toggles={toggles}>{children}</FlagProvider>
    )
}

export default Providers
