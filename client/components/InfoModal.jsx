import React from 'react'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import useStore from '../state/useStore.js'

export default function InfoModal (props) {
  // Subscribe to pieces of global state
  const { lastHotSpotHref, hotSpotModalOpen, setHotSpotModalOpen } = useStore(state => ({
    lastHotSpotHref: state.lastHotSpotHref,
    hotSpotModalOpen: state.hotSpotModalOpen,
    setHotSpotModalOpen: state.setHotSpotModalOpen
  }))

  const requestClose = () => { setHotSpotModalOpen(false) }

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={hotSpotModalOpen}>
      <DialogTitle>{'Modal Info'}</DialogTitle>
      <DialogContent dividers>
        <iframe
          style={{ width: '100%', height: '100%' }}
          sandbox="allow-same-origin allow-scripts"
          src={lastHotSpotHref}
          title="Hot-Spot Info"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={requestClose}>{'Done'}</Button>
      </DialogActions>
    </Dialog>
  )
}
