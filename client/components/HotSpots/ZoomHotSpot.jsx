import React from 'react'

import { zoomModalOpenState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function ZoomHotspot (props) {
  // Subscribe to pieces of global state
  const setZoomModalOpen = useSetRecoilState(zoomModalOpenState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setZoomModalOpen(true)
  }, [setZoomModalOpen])

  return (
    <HotSpotIndicator
      texName='ZoomIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}
