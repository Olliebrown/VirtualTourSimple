import React from 'react'
import PropTypes from 'prop-types'

import { hotspotModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function InfoHotspot (props) {
  const { id, title } = props

  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotData({
      type: 'info',
      jsonFilename: id ? `info/${id}.json` : undefined,
      title
    })
    setHotspotModalOpen('info')
  }, [id, title, setHotspotData, setHotspotModalOpen])

  // Render the appropriate indicator
  return (
    <HotSpotIndicator
      texName='InfoIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}

InfoHotspot.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string
}
