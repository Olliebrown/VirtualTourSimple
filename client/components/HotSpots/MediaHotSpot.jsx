import React from 'react'

import { panoMediaPlayingState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function MediaHotspot (props) {
  const [panoMediaPlaying, setPanoMediaPlaying] = useRecoilState(panoMediaPlayingState)

  // Click callback function
  const onClick = React.useCallback(() => {
    if (!panoMediaPlaying) {
      setPanoMediaPlaying(true)
    }
  }, [panoMediaPlaying, setPanoMediaPlaying])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      hidden={panoMediaPlaying}
      texName='MediaIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}
