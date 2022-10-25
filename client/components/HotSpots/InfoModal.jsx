import React from 'react'
import Axios from 'axios'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import HotSpotContent from './HotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

export default function InfoModal (props) {
  // Subscribe to changes in global state
  const lastHotSpotHref = useLiveQuery(() => localDB.settings.get('lastHotSpotHref'))?.value || ''
  const lastHotSpotTitle = useLiveQuery(() => localDB.settings.get('lastHotSpotTitle'))?.value || ''
  const hotSpotModalOpen = useLiveQuery(() => localDB.settings.get('hotSpotModalOpen'))?.value || false

  // Close the modal
  const requestClose = () => { updateSetting('hotSpotModalOpen', false) }

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
