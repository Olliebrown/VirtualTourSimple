import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'
import Transform, { TransformData } from '../Utility/Transform.jsx'

export default function FlowLabel (props) {
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
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/FlowLabelTexture.png`)

  // Pack in groups to position in the scene
  return (
    hidden ||
      <Transform transform={transform}>
        <animated.mesh scale={hoverSpring.scale} {...rest}>
          <planeGeometry args={[1, 1]} />
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

FlowLabel.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number,
  alignment: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.number,
  text: PropTypes.string,
  hidden: PropTypes.bool,
  onClick: PropTypes.func
}

FlowLabel.defaultProps = {
  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 1,
  alignment: [0, 0, 0],
  color: 0xFFFFFF,
  text: '',
  hidden: false,
  onClick: null
}
