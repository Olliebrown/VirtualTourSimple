import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { infoHotspotState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import { useLoader, useGraph } from '@react-three/fiber'

import { MathUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'

// Various colors for the different types of hot spots
const INFO_COLOR = 0xCC7178
// const VIDEO_COLOR = 0x648646

export default function InfoHotspot (props) {
  // Destructure props
  const { title, id, modal, longitude, latitude, radius, scale, ...rest } = props

  // Track hovering state
  const [hovering, setHovering] = React.useState(false)

  // Subscribe to pieces of global state
  const setInfoHotspot = useSetRecoilState(infoHotspotState)

  // Always synchronize the global info hotspot state
  React.useEffect(() => {
    console.log('Setting hotspot info')
    console.log({ modalOpen: false, showAlways: !modal, jsonFilename: `${id}.json`, title })
    setInfoHotspot({ modalOpen: false, showAlways: !modal, jsonFilename: `${id}.json`, title })
  }, [id, modal, setInfoHotspot, title])

  // Click callback function
  const onClick = React.useCallback(() => {
    console.log(`Hot-spot "${title}" clicked`)
    console.log({ modalOpen: modal, showAlways: !modal, jsonFilename: `${id}.json`, title })
    setInfoHotspot({ modalOpen: modal, showAlways: !modal, jsonFilename: `${id}.json`, title })
  }, [id, modal, setInfoHotspot, title])

  // Load the hot spot geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, `${CONFIG.GEOMETRY_FILE_PATH}/icoSphere.obj`)
  const { nodes } = useGraph(loadedObj.clone())

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.5,
    opacity: hovering ? 1.0 : 0.333
  })

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <animated.mesh scale={springs.scale} key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={INFO_COLOR} opacity={springs.opacity} />
    </animated.mesh>
  ))

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
          {meshes}
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
