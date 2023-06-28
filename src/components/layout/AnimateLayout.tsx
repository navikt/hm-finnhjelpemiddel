'use client'
import { AnimatePresence, motion } from 'framer-motion'

const AnimateLayout = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  </AnimatePresence>
)

export default AnimateLayout
