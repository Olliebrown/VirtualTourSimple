import React from 'react'
import PropTypes from 'prop-types'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function InfoHotspot (props) {
  // Destructure props
  const { title, id, ...rest } = props

  // Track hovering state and modal state
  const [hovering, setHovering] = React.useState(false)

  // Click callback function
  const onClick = React.useCallback(() => {
  }, [])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      texName='MediaIconTexture.png'
      hovering={hovering}
      onHover={setHovering}
      onClick={onClick}
      {...rest}
    />
  )
}

InfoHotspot.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string
}

InfoHotspot.defaultProps = {
  id: '',
  title: 'N/A'
}
