import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { useSpring, animated } from '@react-spring/three'
import { Text, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RepeatWrapping } from 'three'

import Transform, { TransformData } from '../Utility/Transform.jsx'
import { FlowInfoDefaults, FlowInfoShape } from './FlowInfoShape.js'

function isWholeNumber (value) {
  return Math.abs(parseFloat(value.toFixed(2)) % 1) < 0.01
}

export default function FlowArrowLabel (props) {
  // Destructure props
  const { flowInfo, hidden, onClick, ...rest } = props
  const transform = new TransformData({ ...flowInfo, isHotSpot: true })

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
    setAnimate(flowInfo.type === 'arrow' && (flowInfo.animateU !== 0 || flowInfo.animateV !== 0) && !hovering)
  }, [flowInfo.animateU, flowInfo.animateV, flowInfo.type, hovering])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/Flow${flowInfo.type === 'arrow' ? 'Arrow' : 'Rectangle'}Texture.png`)
  texture.anisotropy = 16
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  React.useEffect(() => {
    texture.repeat.x = flowInfo.repeatU ?? 1
    texture.repeat.y = flowInfo.repeatV ?? 1
  }, [flowInfo.repeatU, flowInfo.repeatV, texture])

  const materialRef = React.useRef()
  useFrame((state, delta) => {
    if (animate ||
      !isWholeNumber(materialRef.current.map.offset.x) ||
      !isWholeNumber(materialRef.current.map.offset.y)) {
      materialRef.current.map.offset.x += (flowInfo?.animateU ?? 0) * delta
      materialRef.current.map.offset.y += (flowInfo?.animateV ?? 0) * delta
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
            color={flowInfo.color}
            map={texture}
            transparent
          />
        </animated.mesh>
        {flowInfo.text !== '' &&
          <animated.group scale={hoverSpring.scale}>
            <Text
              position={[-0.03, -0.02, 0.01]}
              scale={[0.033 / flowInfo.width, 0.033 / flowInfo.height, 0.033]}
              color={flowInfo.textColor}
              fontSize={flowInfo.fontSize}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={'center'}
              anchorX="center"
              anchorY="middle"
              outlineWidth={flowInfo.outlineSize}
              outlineColor={flowInfo.textOutlineColor}
            >
              <animated.meshBasicMaterial
                attach="material"
                opacity={hoverSpring.opacity}
                transparent
              />
              {flowInfo.text}
            </Text>
          </animated.group>}
      </Transform>
  )
}

FlowArrowLabel.propTypes = {
  flowInfo: PropTypes.shape(FlowInfoShape),
  hidden: PropTypes.bool,
  onClick: PropTypes.func
}

FlowArrowLabel.defaultProps = {
  flowInfo: FlowInfoDefaults,
  hidden: false,
  onClick: null
}
