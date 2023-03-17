import React from 'react'
import PropTypes from 'prop-types'

import { infoModalOpenState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function InfoHotspot (props) {
  // Subscribe to pieces of global state
  const setInfoModalOpen = useSetRecoilState(infoModalOpenState)

  // Click callback function
  const onClick = React.useCallback(() => {
    setInfoModalOpen(true)
  }, [setInfoModalOpen])

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
