import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { useSpring, animated } from '@react-spring/three'
import { Text, useTexture } from '@react-three/drei'
import Transform, { TransformData } from '../Utility/Transform.jsx'
import { useFrame } from '@react-three/fiber'
import { RepeatWrapping } from 'three'

function isWholeNumber (value) {
  return Math.abs(parseFloat(value.toFixed(2)) % 1) < 0.01
}
export default function FlowArrow (props) {
  // Destructure props
  const { longitude, latitude, width, height, radius, scale, alignment, text, fontSize, color, textColor, textOutlineColor, outlineSize, animateU, animateV, hidden, onClick, ...rest } = props
  const transform = new TransformData({
    longitude, latitude, width, height, radius, scale, alignment, isHotSpot: true
  })

  // Track hovering and enabled state
  const [hovering, setHovering] = React.useState(false)

  // Animated values
  const hoverSpring = useSpring({
    scale: hovering ? 1 : 0.75,
    opacity: hovering ? 1 : 0.0
  })

  // If hidden, be sure to set hovering to false
  React.useEffect(() => { if (hidden) { setHovering(false) } }, [hidden])

  const [animate, setAnimate] = React.useState(false)
  React.useEffect(() => {
    setAnimate((animateU !== 0 || animateV !== 0) && !hovering)
  }, [animateU, animateV, hovering])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/FlowArrowTexture.png`)
  texture.anisotropy = 16
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  const materialRef = React.useRef()
  useFrame((state, delta) => {
    if (animate ||
      !isWholeNumber(materialRef.current.map.offset.x) ||
      !isWholeNumber(materialRef.current.map.offset.y)) {
      materialRef.current.map.offset.x += animateU * delta
      materialRef.current.map.offset.y += animateV * delta
    }
  })

  // Pack in groups to position in the scene
  return (
    hidden ||
      <Transform
        transform={transform}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <animated.mesh {...rest}>
          <planeGeometry args={[1, 1]} />
          <animated.meshBasicMaterial
            ref={materialRef}
            opacity={1.0}
            color={color}
            map={texture}
            transparent
          />
        </animated.mesh>
        {text !== '' &&
          <animated.group scale={hoverSpring.scale}>
            <Text
              position={[-0.03, -0.02, 0.01]}
              scale={[0.033 / width, 0.033 / height, 0.033]}
              color={textColor}
              fontSize={fontSize}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={'center'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={outlineSize}
              outlineColor={textOutlineColor}
            >
              <animated.meshBasicMaterial
                attach="material"
                opacity={hoverSpring.opacity}
                transparent
              />
              {text}
            </Text>
          </animated.group>}
      </Transform>
  )
}

FlowArrow.propTypes = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number,
  alignment: PropTypes.arrayOf(PropTypes.number),
  text: PropTypes.string,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  textColor: PropTypes.string,
  textOutlineColor: PropTypes.string,
  outlineSize: PropTypes.number,
  animateU: PropTypes.number,
  animateV: PropTypes.number,
  hidden: PropTypes.bool,
  onClick: PropTypes.func
}

FlowArrow.defaultProps = {
  longitude: 0,
  latitude: 0,
  width: 1,
  height: 1,
  radius: 5,
  scale: 1,
  alignment: [0, 0, 0],
  text: '',
  fontSize: 12,
  color: '#ffffff',
  textColor: '#000000',
  textOutlineColor: '#ffffff',
  outlineSize: 0.5,
  animateU: 0,
  animateV: 0,
  hidden: false,
  onClick: null
}
