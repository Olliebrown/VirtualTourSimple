import React from 'react'
import PropTypes from 'prop-types'

import { hotspotModalOpenState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function InfoHotspot (props) {
  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotModalOpen('info')
  }, [setHotspotModalOpen])

  // Render the appropriate indicator
  return (
    <HotSpotIndicator
      hidden={!props.modal}
      texName='InfoIconTexture.png'
      onClick={onClick}
      {...props}
    />
  )
}

InfoHotspot.propTypes = {
  modal: PropTypes.bool
}

InfoHotspot.defaultProps = {
  modal: false
}
