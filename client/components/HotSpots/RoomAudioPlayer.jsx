import React from 'react'

import { hotspotDataState, roomAudioState } from '../../state/globalState.js'
import { useRecoilValue, useRecoilState } from 'recoil'

import { Card, CardHeader, CardContent, Slide, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import AudioPlayer from './AudioPlayer.jsx'

export default function RoomAudioPlayer () {
  // Subscribe to pieces of global state
  const hotspotData = useRecoilValue(hotspotDataState)
  const [roomAudio, setRoomAudio] = useRecoilState(roomAudioState)

  return (
    <Slide direction="up" in={roomAudio} mountOnEnter unmountOnExit>
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
          <AudioPlayer hotspotAudio={hotspotData?.id ? { src: hotspotData.id } : undefined} autoplay />
        </CardContent>
      </Card>
    </Slide>
  )
}
