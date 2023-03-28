import React from 'react'

import { hotspotModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { currentRoomPriorityState } from '../../state/fullTourState.js'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import InfoHotspotContent from './InfoHotSpotContent.jsx'
import ZoomHotspotContent from './ZoomHotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function InfoZoomModal () {
  // Subscribe to changes in global state
  const [hotspotModalOpen, setHotspotModalOpen] = useRecoilState(hotspotModalOpenState)
  const hotspotData = useRecoilValue(hotspotDataState)
  const updateRoomTaskCompletion = useSetRecoilState(currentRoomPriorityState)

  // Track the slideshow state as [slide, build]
  const [slideIndex, setSlideIndex] = React.useState([0, 0])

  // Close the modal
  const requestClose = () => {
    setHotspotModalOpen('')
    updateRoomTaskCompletion(hotspotData.title)
    setSlideIndex([0, 0])
  }

  // Note: may be null until retrieved
  const hotspotContent = useHotspotContent(hotspotData?.jsonFilename, hotspotData?.type)
  const enableModal = hotspotContent && hotspotData?.type === 'info'

  let modalContent = null
  if (hotspotModalOpen === 'info') {
    modalContent = <InfoHotspotContent
      hotspotImages={hotspotContent?.images}
      defaultHeight={hotspotContent?.height > 0 ? hotspotContent?.height : undefined}
      slideIndex={slideIndex}
    />
  } else if (hotspotModalOpen === 'zoom') {
    modalContent = <ZoomHotspotContent image={hotspotContent?.image} />
  }

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={!!enableModal && hotspotModalOpen !== ''}>
      <DialogTitle>{hotspotData?.title || 'Info'}</DialogTitle>
      <DialogContent dividers>
        {modalContent}
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
