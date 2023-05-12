import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'
import Transform, { TransformData } from '../Utility/Transform.jsx'

export default function FlowArrow (props) {
  // Destructure props
  const { longitude, latitude, radius, scale, alignment, color, hidden, onClick, ...rest } = props
  const transform = new TransformData({
    longitude, latitude, radius, scale, alignment, isHotSpot: true
  })

  // Track hovering and enabled state
  const [hovering, setHovering] = React.useState(false)

  // Animated values
  const hoverSpring = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1 : 0.75
  })

  // If hidden, be sure to set hovering to false
  React.useEffect(() => { if (hidden) { setHovering(false) } }, [hidden])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/FlowArrowTexture.png`)

  // Pack in groups to position in the scene
  return (
    hidden ||
      <Transform transform={transform}>
        <animated.mesh scale={hoverSpring.scale} {...rest}>
          <circleGeometry args={[1, 24]} />
          <animated.meshBasicMaterial
            opacity={hoverSpring.opacity}
            color={color}
            map={texture}
            transparent
          />
        </animated.mesh>
      </Transform>
  )
}

FlowArrow.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number,
  alignment: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.number,
  hidden: PropTypes.bool,
  onClick: PropTypes.func
}

FlowArrow.defaultProps = {
  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 1,
  alignment: [0, 0, 0],
  color: 0xFFFFFF,
  hidden: false,
  onClick: null
}
