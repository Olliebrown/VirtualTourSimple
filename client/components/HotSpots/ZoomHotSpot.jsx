import React from 'react'
import PropTypes from 'prop-types'

import { hotspotModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function ZoomHotspot (props) {
  const { id, title } = props

  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotData({
      type: 'zoom',
      jsonFilename: id ? `zoom/${id}.json` : undefined,
      title
    })
    setHotspotModalOpen('zoom')
  }, [id, setHotspotData, setHotspotModalOpen, title])

  return (
    <HotSpotIndicator
      texName='ZoomIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}

ZoomHotspot.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string
}
