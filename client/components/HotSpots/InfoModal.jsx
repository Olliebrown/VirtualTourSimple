import React from 'react'

import { infoModalOpenState, infoHotspotDataState } from '../../state/globalState.js'
import { currentRoomPriorityState } from '../../state/fullTourState.js'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import HotspotContent from './HotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function InfoModal () {
  // Subscribe to changes in global state
  const [modalOpen, setInfoModalOpen] = useRecoilState(infoModalOpenState)
  const infoHotspotData = useRecoilValue(infoHotspotDataState)
  const updateRoomTaskCompletion = useSetRecoilState(currentRoomPriorityState)

  // Track the slideshow state as [slide, build]
  const [slideIndex, setSlideIndex] = React.useState([0, 0])

  // Close the modal
  const requestClose = () => {
    setInfoModalOpen(false)
    updateRoomTaskCompletion(infoHotspotData.title)
    setSlideIndex([0, 0])
  }

  // Note: may be null until retrieved
  const hotspotContent = useHotspotContent(infoHotspotData?.jsonFilename)
  if (hotspotContent === null) {
    return null
  }

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={modalOpen}>
      <DialogTitle>{infoHotspotData?.title || 'Info'}</DialogTitle>
      <DialogContent dividers>
        <HotspotContent
          hotspotImages={hotspotContent?.images}
          defaultHeight={hotspotContent?.height > 0 ? hotspotContent?.height : undefined}
          slideIndex={slideIndex}
        />
      </DialogContent>
      <DialogActions>
        <AudioPlayer
          hotspotAudio={hotspotContent?.audio}
          setSlideIndex={setSlideIndex}
        />
        <Button onClick={requestClose}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}
