import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { infoModalOpenState, infoHotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import { MathUtils } from 'three'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'

export default function InfoHotspot (props) {
  // Destructure props
  const { title, id, modal, longitude, latitude, radius, scale, ...rest } = props

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

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG.TEXTURE_IMAGE_PATH}/InfoIconTexture.png`)

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1.0 : 0.333
  })

  // When it is a non-modal, don't render the hotspot clicker
  if (!modal) {
    return null
  }

  // Pack in groups to position in the scene
  return (
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

InfoHotspot.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  modal: PropTypes.bool,

  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number
}

InfoHotspot.defaultProps = {
  id: '',
  title: 'N/A',
  modal: false,

  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 0.5
}
