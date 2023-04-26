import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import type { FC } from 'react'
import React, { useState } from 'react'
import { reportEvent } from 'src/utils/ga'

type Props = {
  title: string
  link: string
}

export const ShareLinkModal: FC<Props> = ({ title, link }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reportEvent('button_click', {
      page_title: 'Training History',
      button_name: 'Share Link',
    })
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setCopied(false)
  }
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        {title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6" component="h2">
          {title}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="modal-description"
            fullWidth
            margin="normal"
            variant="outlined"
            value={link}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button fullWidth variant="outlined" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
