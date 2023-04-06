import React from 'react'

import { panoMediaPlayingState, roomAudioState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function PlacardHotspot (props) {
  // Subscribe to changes in global state
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const roomAudio = useRecoilValue(roomAudioState)

  return (
    <HotSpotIndicator
      hidden={panoMediaPlaying || roomAudio}
      texName='PlacardIconTexture.png'
      {...props}
    />
  )
}
