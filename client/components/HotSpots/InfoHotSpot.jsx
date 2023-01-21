import React from 'react'
import PropTypes from 'prop-types'

import { infoModalOpenState, infoHotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function InfoHotspot (props) {
  // Destructure props
  const { title, id, modal, ...rest } = props

  // Subscribe to pieces of global state
  const setInfoModalOpen = useSetRecoilState(infoModalOpenState)
  const setInfoHotspotData = useSetRecoilState(infoHotspotDataState)

  // Track hovering state and modal state
  const [hovering, setHovering] = React.useState(false)

  // Show pointer cursor when hovered
  React.useEffect(() => {
    setInfoHotspotData({ jsonFilename: `${id}.json`, title, showAlways: !modal, hovering })
    document.body.style.cursor = hovering ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [id, title, hovering, modal, setInfoHotspotData])

  // Click callback function
  const onClick = React.useCallback(() => {
    setInfoModalOpen(true)
  }, [setInfoModalOpen])

  // When it is a non-modal, don't render the hotspot clicker
  if (!modal) {
    return null
  }

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      texName='InfoIconTexture.png'
      hovering={hovering}
      onHover={setHovering}
      onClick={onClick}
      {...rest}
    />
  )
}

InfoHotspot.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  modal: PropTypes.bool
}

InfoHotspot.defaultProps = {
  id: '',
  title: 'N/A',
  modal: false
}
