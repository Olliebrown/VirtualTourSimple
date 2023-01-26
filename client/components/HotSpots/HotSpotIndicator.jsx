import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import { MathUtils } from 'three'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'

export default function HotSpotIndicator (props) {
  // Destructure props
  const { id, type, title, modal, hidden, longitude, latitude, radius, scale, onClick, texName, ...rest } = props

  const setHotspotData = useSetRecoilState(hotspotDataState)

  // Track hovering state and modal state
  const [hovering, setHovering] = React.useState(false)
  React.useEffect(() => {
    // Synchronize hotspot data
    setHotspotData({
      jsonFilename: `${id}.json`,
      title,
      type,
      showAlways: !modal,
      hovering
    })

    // Update cursor to indicate this can be clicked
    document.body.style.cursor = hovering ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [id, title, type, hovering, modal, setHotspotData])

  // If hidden, be sure to set hovering to false
  React.useEffect(() => { if (hidden) { setHovering(false) } }, [hidden])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG.TEXTURE_IMAGE_PATH}/${texName}`)

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1.0 : 0.333
  })

  // Pack in groups to position in the scene
  return (
    hidden ||
      <group
        rotation-y={MathUtils.degToRad(longitude)}
        {...rest}
        onClick={onClick}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
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
  title: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.oneOf(['info', 'media', 'audio', 'unknown']),
  modal: PropTypes.bool,
  hidden: PropTypes.bool,

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
  id: '',
  title: 'N/A',
  type: 'unknown',
  modal: false,
  hidden: false,

  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 0.5,

  onClick: null,
  hovering: false,
  onHover: null
}
