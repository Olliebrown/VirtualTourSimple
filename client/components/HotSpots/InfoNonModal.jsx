import React from 'react'

import { infoHotspotState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Card, CardHeader, CardContent, Slide } from '@mui/material'
import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function InfoNonModal () {
  // Subscribe to pieces of global state
  const infoHotspot = useRecoilValue(infoHotspotState)

  // Read hotspot json data into local state
  const [hotspotContent, setHotspotContent] = React.useState(null)
  useHotspotContent(infoHotspot?.jsonFilename, setHotspotContent)

  console.log('Rendering with', infoHotspot)
  console.log('Content is', hotspotContent)
  return (
    <Slide direction="up" in={infoHotspot?.showAlways} mountOnEnter unmountOnExit>
      <Card sx={{ position: 'absolute', bottom: 16, right: '10vw', width: '60vw' }}>
        <CardHeader
          title={infoHotspot?.title || 'Unknown Info'}
          sx={{ borderBottom: '1px solid grey', p: 1 }}
        />

        <CardContent aria-label="Audio Info">
          <AudioPlayer hotspotAudio={hotspotContent?.audio} />
        </CardContent>
      </Card>
    </Slide>
  )
}
