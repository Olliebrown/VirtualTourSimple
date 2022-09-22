import React from 'react'
import Axios from 'axios'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import useStore from '../../state/useStore.js'

import HotSpotContent from './HotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

export default function InfoModal (props) {
  // Subscribe to pieces of global state
  const { lastHotSpotTitle, lastHotSpotHref, hotSpotModalOpen, setHotSpotModalOpen } = useStore(state => ({
    lastHotSpotTitle: state.lastHotSpotTitle,
    lastHotSpotHref: state.lastHotSpotHref,
    hotSpotModalOpen: state.hotSpotModalOpen,
    setHotSpotModalOpen: state.setHotSpotModalOpen
  }))

  const requestClose = () => { setHotSpotModalOpen(false) }

  const [hotSpotInfo, setHotSpotInfo] = React.useState(null)
  React.useEffect(() => {
    // Async process to retrieve the JSON info
    const retrieveInfo = async () => {
      const response = await Axios.get(lastHotSpotHref)
      if (response?.data) {
        setHotSpotInfo(response.data)
      }
    }

    // Clear any previous info and start the async process
    setHotSpotInfo(null)
    retrieveInfo()
  }, [lastHotSpotHref])

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={hotSpotModalOpen}>
      <DialogTitle>{lastHotSpotTitle || 'Info'}</DialogTitle>
      <DialogContent dividers>
        <HotSpotContent hotSpotImages={hotSpotInfo?.images} />
      </DialogContent>
      <DialogActions>
        <AudioPlayer hotSpotAudio={hotSpotInfo?.audio} />
        <Button onClick={requestClose}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}
