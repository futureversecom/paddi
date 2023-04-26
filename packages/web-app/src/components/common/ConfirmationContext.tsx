// ConfirmationDialogContext.tsx
import type { ReactNode } from 'react'
import React, { createContext, useContext, useState } from 'react'

import ConfirmationModal from './ConfirmationModal'

interface DialogConfig {
  open: boolean
  title: string
  content: string
  onConfirm: () => void
}

type ShowDialogFunction = (config: Omit<DialogConfig, 'open'>) => void

const ConfirmationDialogContext = createContext<ShowDialogFunction | null>(null)

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext)
  if (!context) {
    throw new Error(
      'useConfirmationDialog must be used within a ConfirmationDialogProvider',
    )
  }
  return context
}

interface ConfirmationDialogProviderProps {
  children: ReactNode
}

export const ConfirmationDialogProvider: React.FC<
  ConfirmationDialogProviderProps
> = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    open: false,
    title: '',
    content: '',
    onConfirm: () => null,
  })

  const showDialog: ShowDialogFunction = config => {
    setDialogConfig({ ...config, open: true })
  }

  const handleClose = () => {
    setDialogConfig(prevConfig => ({ ...prevConfig, open: false }))
  }

  const handleConfirm = () => {
    dialogConfig.onConfirm()
    handleClose()
  }

  return (
    <ConfirmationDialogContext.Provider value={showDialog}>
      {children}
      <ConfirmationModal
        open={dialogConfig.open}
        title={dialogConfig.title}
        content={dialogConfig.content}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ConfirmationDialogContext.Provider>
  )
}
