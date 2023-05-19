import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { nextPanoKeyState } from '../../state/fullTourState.js'
import { hotspotHoverState, panoMediaPlayingState, roomAudioState, flowOverlayActiveState } from '../../state/globalState.js'
import { transitionStartedState } from '../../state/transitionState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'
import HotSpot from '../Utility/HotSpot.js'
import Transform from '../Utility/Transform.jsx'

export default function HotSpotIndicator (props) {
  // Destructure props
  const { hotSpotBase, hidden, onClick, ...rest } = props

  // Subscribe to changes in global state
  const nextPanoKey = useRecoilValue(nextPanoKeyState)
  const transitionStarted = useRecoilValue(transitionStartedState)
  const setHotspotHover = useSetRecoilState(hotspotHoverState)

  // State that affects hotspot visibility
  const flowOverlayActive = useRecoilValue(flowOverlayActiveState)
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const roomAudio = useRecoilValue(roomAudioState)

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
      setHotspotHover({
        hovering,
        type: hotSpotBase.type,
        title: hotSpotBase.title,
        jsonFilename: hotSpotBase.jsonFilename()
      })
    }
    return () => { document.body.style.cursor = 'auto' }
  }, [hovering, enabled, setHotspotHover, hotSpotBase])

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

  // If hidden, be sure to set hovering to false
  React.useEffect(() => {
    if (hidden || flowOverlayActive || panoMediaPlaying || roomAudio) {
      setHovering(false)
    }
  }, [flowOverlayActive, hidden, panoMediaPlaying, roomAudio])

  // Load texture for the hotspot
  const texture = useTexture(`${CONFIG().TEXTURE_IMAGE_PATH}/${hotSpotBase.textureName()}`)

  // Don't render if hidden or if any of these states are true
  if (hidden || flowOverlayActive || panoMediaPlaying || roomAudio) {
    return null
  }

  // Pack in groups to position in the scene
  return (
    <Transform
      transform={hotSpotBase.transform}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      {...rest}
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
    </Transform>
  )
}

HotSpotIndicator.propTypes = {
  hotSpotBase: PropTypes.instanceOf(HotSpot).isRequired,

  hidden: PropTypes.bool,
  onClick: PropTypes.func,

  hovering: PropTypes.bool,
  onHover: PropTypes.func
}

HotSpotIndicator.defaultProps = {
  hidden: false,
  onClick: null,
  hovering: false,
  onHover: null
}
