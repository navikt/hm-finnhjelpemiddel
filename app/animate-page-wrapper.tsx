'use client'

import { motion, AnimatePresence } from 'framer-motion'

export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      {children}
    </motion.div>
  </AnimatePresence>
)
