import React from 'react'
import Axios from 'axios'

import { useRecoilState, useRecoilValue } from 'recoil'
import { hotSpotModalOpenState, lastHotSpotTitleState, lastHotSpotHrefState } from '../../state/globalState.js'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import HotSpotContent from './HotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

export default function InfoModal (props) {
  const lastHotSpotHref = useRecoilValue(lastHotSpotHrefState)
  const lastHotSpotTitle = useRecoilValue(lastHotSpotTitleState)
  const [hotSpotModalOpen, setHotSpotModalOpen] = useRecoilState(hotSpotModalOpenState)

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
