import React from 'react'

import { hotspotDataState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Card, CardHeader, CardContent, Slide } from '@mui/material'
import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function InfoNonModal () {
  // Subscribe to pieces of global state
  const hotspotData = useRecoilValue(hotspotDataState)

  // Read hotspot json data into local state
  const hotspotContent = useHotspotContent(hotspotData?.jsonFilename)

  return (
    <Slide direction="up" in={!!hotspotContent && !!hotspotData?.showAlways} mountOnEnter unmountOnExit>
      <Card sx={{ position: 'absolute', bottom: 16, right: '10vw', width: '60vw' }}>
        <CardHeader
          title={hotspotData?.title || 'Unknown Info'}
          sx={{ borderBottom: '1px solid grey', p: 1 }}
        />

        <CardContent aria-label="Audio Info">
          <AudioPlayer hotspotAudio={hotspotContent?.audio} />
        </CardContent>
      </Card>
    </Slide>
  )
}
