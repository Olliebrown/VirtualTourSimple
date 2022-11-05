import React from 'react'

import { hotspotContentEditJSONState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import JSONCodeEditor from '../Utility/JSONCodeEditor.jsx'
import config from '../../config.js'

export default function EditHotspotContentModal (props) {
  // Subscribe to changes in global state
  const [hotspotContentInfo, setHotspotContentInfo] = useRecoilState(hotspotContentEditJSONState)

  // Close the modal
  const requestClose = (saveChanges) => {
    if (saveChanges) {
      // TODO: send changes back to server
    }

    // Close the modal
    setHotspotContentInfo({ ...hotspotContentInfo, modalOpen: false })
  }

  return (
    <Dialog fullWidth maxWidth='lg' onClose={requestClose} open={hotspotContentInfo?.modalOpen}>
      <DialogTitle>{'Hotspot Content Editor'}</DialogTitle>
      <DialogContent dividers>
        <JSONCodeEditor serverPath={config.HOTSPOT_INFO_PATH} filename={hotspotContentInfo?.jsonFilename} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => requestClose(false)}>{'Discard'}</Button>
        <Button onClick={() => requestClose(true)}>{'Save'}</Button>
      </DialogActions>
    </Dialog>
  )
}
