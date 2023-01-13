import React from 'react'

import { infoHotspotState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

import HotspotContent from './HotSpotContent.jsx'
import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function InfoModal () {
  // Subscribe to changes in global state
  const [infoHotspot, setInfoHotspotState] = useRecoilState(infoHotspotState)

  // Close the modal
  const requestClose = () => { setInfoHotspotState({ ...infoHotspot, modalOpen: false }) }

  // Note: may be null until retrieved
  const hotspotContent = useHotspotContent(infoHotspot?.jsonFilename)
  if (hotspotContent === null) {
    return null
  }
  console.log(hotspotContent)

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={infoHotspot?.modalOpen}>
      <DialogTitle>{infoHotspot?.title || 'Info'}</DialogTitle>
      <DialogContent dividers>
        <HotspotContent
          hotspotImages={hotspotContent?.images}
          defaultHeight={hotspotContent?.height > 0 ? hotspotContent?.height : undefined}
        />
      </DialogContent>
      <DialogActions>
        <AudioPlayer hotspotAudio={hotspotContent?.audio} />
        <Button onClick={requestClose}>{'Close'}</Button>
      </DialogActions>
    </Dialog>
  )
}
