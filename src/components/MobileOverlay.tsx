import React from 'react'

import classNames from 'classnames'
import { AnimatePresence, Variants, motion } from 'framer-motion'

import { XMarkIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

const modalVariants: Variants = {
  closed: {
    height: 0,
    transition: {
      ease: 'easeIn',
      duration: 0.2,
    },
  },
  open: {
    height: '100%',
    transition: {
      ease: 'easeOut',
      duration: 0.4,
    },
  },
}

const MobileOverlay = ({ open, children }: { open: boolean; children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial="closed"
        animate={open ? 'open' : 'closed'}
        exit="closed"
        variants={modalVariants}
        className={classNames('mobile-overlay', { 'mobile-overlay--open': open })}
        onAnimationComplete={() => window.scrollTo({ top: 0 })} // Prevents jumping when content changes
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

const Header = ({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) => {
  return (
    <div className="mobile-overlay__header">
      {children}
      {onClose && <Button icon={<XMarkIcon title="Lukk visningen" />} variant="tertiary" onClick={onClose} />}
    </div>
  )
}

const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className="mobile-overlay__content">{children}</div>
}

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="mobile-overlay__footer">{children}</div>
}

MobileOverlay.Header = Header
MobileOverlay.Content = Content
MobileOverlay.Footer = Footer

export default MobileOverlay
