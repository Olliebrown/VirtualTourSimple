import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { MathUtils } from 'three'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'

export default function HotSpotIndicator (props) {
  // Destructure props
  const { longitude, latitude, radius, scale, hovering, onClick, onHover, texName, ...rest } = props

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG.TEXTURE_IMAGE_PATH}/${texName}`)

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1.0 : 0.333
  })

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(longitude)}
      {...rest}
      onClick={onClick}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
    >
      <group rotation-x={MathUtils.degToRad(latitude)}>
        <group
          position={[0, 0, -radius]}
          scale={[scale, scale, scale]}
        >
          <animated.mesh scale={springs.scale} {...rest}>
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial color={0xFFFFFF} map={texture} />
          </animated.mesh>
        </group>
      </group>
    </group>
  )
}

HotSpotIndicator.propTypes = {
  texName: PropTypes.string.isRequired,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number,

  onClick: PropTypes.func,

  hovering: PropTypes.bool,
  onHover: PropTypes.func
}

HotSpotIndicator.defaultProps = {
  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 0.5,
  onClick: null,
  hovering: false,
  onHover: null
}
