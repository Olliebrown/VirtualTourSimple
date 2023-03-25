import React from 'react'

import { hotspotModalOpenState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function ZoomHotspot (props) {
  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotModalOpen('zoom')
  }, [setHotspotModalOpen])

  return (
    <HotSpotIndicator
      texName='ZoomIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}
