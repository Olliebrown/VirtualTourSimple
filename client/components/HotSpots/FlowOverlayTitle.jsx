import React from 'react'

import { flowOverlayActiveState, hotspotDataState } from '../../state/globalState.js'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Card, CardHeader, Slide, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

export default function FlowOverlayTitle () {
  // Subscribe to pieces of global state
  const hotspotData = useRecoilValue(hotspotDataState)
  const [flowOverlayActive, setFlowOverlayActive] = useRecoilState(flowOverlayActiveState)

  return (
    <Slide direction="up" in={flowOverlayActive} mountOnEnter unmountOnExit>
      <Card sx={{ position: 'absolute', bottom: 16, right: '10vw', width: '60vw' }}>
        <CardHeader
          title={`Flow of ${hotspotData?.title}`}
          sx={{ borderBottom: '1px solid grey', p: 1 }}
          action={
            <IconButton aria-label="close" sx={{ marginRight: 2 }} onClick={() => setFlowOverlayActive(false)}>
              <CloseIcon />
            </IconButton>
          }
        />
      </Card>
    </Slide>
  )
}
