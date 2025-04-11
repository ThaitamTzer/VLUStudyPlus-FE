'use client'

import type { ReactNode } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedTableRowProps {
  children: ReactNode
  isVisible?: boolean
  isEditing?: boolean
}

const AnimatedTableRow: React.FC<AnimatedTableRowProps> = ({ children, isVisible = true, isEditing = false }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.tr
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            height: 'auto',
            scale: 1,
            transition: {
              height: { duration: 0.3 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }
          }}
          exit={{
            opacity: 0,
            height: 0,
            scale: 0.95,
            transition: {
              height: { duration: 0.2 },
              opacity: { duration: 0.1 },
              scale: { duration: 0.1 }
            }
          }}
          style={{
            display: 'table-row',
            position: 'relative',
            zIndex: isEditing ? 1 : 0
          }}
        >
          {children}
        </motion.tr>
      )}
    </AnimatePresence>
  )
}

export default AnimatedTableRow
