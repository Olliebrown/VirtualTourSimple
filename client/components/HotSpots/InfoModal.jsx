import React from 'react'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import useStore from '../../state/useStore.js'

import HotSpotContent from './HotSpotContent.jsx'

export default function InfoModal (props) {
  // Subscribe to pieces of global state
  const { hotSpotModalOpen, setHotSpotModalOpen } = useStore(state => ({
    hotSpotModalOpen: state.hotSpotModalOpen,
    setHotSpotModalOpen: state.setHotSpotModalOpen
  }))

  const requestClose = () => { setHotSpotModalOpen(false) }

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={hotSpotModalOpen}>
      <DialogTitle>{'Modal Info'}</DialogTitle>
      <DialogContent dividers>
        <HotSpotContent />
      </DialogContent>
      <DialogActions>
        <Button onClick={requestClose}>{'Done'}</Button>
      </DialogActions>
    </Dialog>
  )
}
