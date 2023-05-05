import React from 'react'
import classNames from 'classnames'
import { AnimatePresence, motion, Variants } from 'framer-motion'

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

const Modal = ({ open, children }: { open: boolean; children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial="closed"
        animate={open ? 'open' : 'closed'}
        exit="closed"
        variants={modalVariants}
        className={classNames('modal', { 'modal--open': open })}
        onAnimationComplete={() => window.scrollTo({ top: 0 })} // Prevents jumping when content changes
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal__header">{children}</div>
}

const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal__content">{children}</div>
}

const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="modal__footer">{children}</div>
}

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal
