import React from 'react'
import PropTypes from 'prop-types'

import { useLoader, useGraph } from '@react-three/fiber'

import { MathUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'

import useStore from '../state/useStore.js'

// Various colors for the different types of hot spots
const INFO_COLOR = 0xCC7178
const VIDEO_COLOR = 0x648646

export default function InfoHotSpot (props) {
  // Destructure props
  const { name, href, playButton, longitude, latitude, radius, scale, ...rest } = props

  // Track hovering state
  const [hovering, setHovering] = React.useState(false)

  // Subscribe to pieces of global state
  const { setLastHotSpotHref, setHotSpotModalOpen, setMediaPlaying, videoPlaying } = useStore(state => ({
    setLastHotSpotHref: state.setLastHotSpotHref,
    setHotSpotModalOpen: state.setHotSpotModalOpen,
    setMediaPlaying: state.setMediaPlaying,
    videoPlaying: state.videoPlaying
  }))

  // Click callback function
  const onClick = () => {
    console.log(`Hot-spot "${name}" clicked`)
    if (playButton) {
      setMediaPlaying(true)
    } else {
      setLastHotSpotHref(href)
      setHotSpotModalOpen(true)
    }
  }

  // Load the hot spot geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, 'geom/icoSphere.obj')
  const { nodes } = useGraph(loadedObj.clone())

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1.0 : 0.333
  })

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <animated.mesh scale={springs.scale} key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={playButton ? VIDEO_COLOR : INFO_COLOR} opacity={springs.opacity} />
    </animated.mesh>
  ))

  // Don't render while the video is playing
  if (playButton && videoPlaying) {
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
          {meshes}
        </group>
      </group>
    </group>
  )
}

InfoHotSpot.propTypes = {
  name: PropTypes.string,
  href: PropTypes.string,
  playButton: PropTypes.bool,

  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number
}

InfoHotSpot.defaultProps = {
  href: '',
  name: 'N/A',
  playButton: false,

  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 0.5
}
