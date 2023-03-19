import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { nextPanoKeyState } from '../../state/fullTourState.js'
import { hotspotDataState } from '../../state/globalState.js'
import { transitionStartedState } from '../../state/transitionState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { MathUtils } from 'three'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'

export default function HotSpotIndicator (props) {
  // Destructure props
  const { id, type, title, modal, hidden, longitude, latitude, radius, scale, onClick, texName, ...rest } = props

  // Subscribe to changes in global state
  const setHotspotData = useSetRecoilState(hotspotDataState)
  const nextPanoKey = useRecoilValue(nextPanoKeyState)
  const transitionStarted = useRecoilValue(transitionStartedState)

  // Track first render
  const [firstRender, setFirstRender] = React.useState(true)
  React.useEffect(() => { setFirstRender(false) }, [])

  // Track hovering and enabled state
  const [hovering, setHovering] = React.useState(false)
  const [enabled, setEnabled] = React.useState(!transitionStarted)

  // Show pointer cursor when hovered and enabled
  React.useEffect(() => {
    if (enabled) {
      document.body.style.cursor = hovering ? 'pointer' : 'auto'
    }
    return () => { document.body.style.cursor = 'auto' }
  }, [hovering, enabled])

  // Animated values
  const hoverSpring = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering && enabled ? 1 : 0.75
  })

  const fadeSpring = useSpring({
    opacity: firstRender || nextPanoKey !== '' ? 0 : 0.75,
    onStart: () => { setEnabled(false) },
    onRest: () => { setEnabled(!transitionStarted) }
  }) // test

  // Track hovering state and modal state
  React.useEffect(() => {
    const useJSON = type === 'info' || type === 'audio' || type === 'placard'

    // Synchronize hotspot data
    setHotspotData({
      jsonFilename: useJSON && id ? `${type}/${id}.json` : undefined,
      title,
      type,
      showAlways: !modal,
      hovering
    })

    // Update cursor to indicate this can be clicked
    document.body.style.cursor = hovering && type !== 'placard' ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [id, title, type, hovering, modal, setHotspotData])

  // If hidden, be sure to set hovering to false
  React.useEffect(() => { if (hidden) { setHovering(false) } }, [hidden])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/${texName}`)

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
            <animated.mesh scale={hoverSpring.scale} {...rest}>
              <circleGeometry args={[1, 24]} />
              <animated.meshBasicMaterial
                opacity={fadeSpring.opacity.get() < 0.75 ? fadeSpring.opacity : hoverSpring.opacity}
                color={0xFFFFFF}
                map={texture}
                transparent
              />
            </animated.mesh>
          </group>
        </group>
      </group>
  )
}

HotSpotIndicator.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.oneOf(['info', 'media', 'audio', 'placard', 'zoom', 'unknown']),
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
