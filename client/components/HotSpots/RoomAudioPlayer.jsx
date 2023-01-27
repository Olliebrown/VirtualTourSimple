import React from 'react'

import { hotspotDataState, roomAudioState } from '../../state/globalState.js'
import { useRecoilValue, useRecoilState } from 'recoil'

import { Card, CardHeader, CardContent, Slide, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

import AudioPlayer from './AudioPlayer.jsx'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function RoomAudioPlayer () {
  // Subscribe to pieces of global state
  const hotspotData = useRecoilValue(hotspotDataState)
  const [roomAudio, setRoomAudio] = useRecoilState(roomAudioState)

  // Note: may be null until retrieved
  const hotspotContent = useHotspotContent(hotspotData?.jsonFilename, hotspotData?.type)
  const enableRoomAudio = hotspotContent && hotspotData?.type === 'audio'

  return (
    <Slide direction="up" in={!!enableRoomAudio && roomAudio} mountOnEnter unmountOnExit>
      <Card sx={{ position: 'absolute', bottom: 16, right: '10vw', width: '60vw' }}>
        <CardHeader
          title={hotspotData?.title || 'Unknown Info'}
          sx={{ borderBottom: '1px solid grey', p: 1 }}
          action={
            <IconButton aria-label="close" sx={{ marginRight: 2 }} onClick={() => setRoomAudio(false)}>
              <CloseIcon />
            </IconButton>
          }
        />

        <CardContent aria-label="Audio Info">
          <AudioPlayer hotspotAudio={hotspotContent?.audio} autoplay />
        </CardContent>
      </Card>
    </Slide>
  )
}
