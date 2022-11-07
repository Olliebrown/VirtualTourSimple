import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { preloadPanoKeyState } from '../../state/fullTourState.js'
import { LOADING_STATUS, textureStatusState } from '../../state/textureLoadingState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useLoader, useGraph } from '@react-three/fiber'
import { MathUtils } from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'

// Different object parameters
const OBJ_DATA = {
  arrow: {
    filename: 'geom/arrow.obj',
    rotation: [Math.PI / 2.0, 0, Math.PI]
  },
  teleport: {
    filename: 'geom/teleport.obj',
    rotation: [0, 0, 0]
  },
  door: {
    filename: 'geom/door.obj',
    rotation: [0, 0, 0]
  },
  stairsUp: {
    filename: 'geom/stairsUp.obj',
    rotation: [0, 0, 0]
  },
  stairsDown: {
    filename: 'geom/stairsDown.obj',
    rotation: [0, 0, 0]
  }
}

// Various colors for the texture loading state
// const LOADING_COLOR = 0x777777 (not currently in use)
const LOADED_COLOR = 0x156289
const FAILED_COLOR = 0x883333

export default function ExitIndicator (props) {
  // Destructure props
  const { type, shift, height, distance, direction, alignment, destination, ...rest } = props

  const setPreloadPanoKey = useSetRecoilState(preloadPanoKeyState)

  // Create array of texture filenames
  const textureFiles = React.useMemo(() => ([
    `${CONFIG.PANO_IMAGE_PATH}/${destination || CONFIG.START_KEY}_Left.ktx2`,
    `${CONFIG.PANO_IMAGE_PATH}/${destination || CONFIG.START_KEY}_Right.ktx2`
  ]), [destination])

  // Track hovering state
  const [hovering, setHovering] = React.useState(false)

  // Click callback function
  const onClick = () => {
    if (destination) {
      setPreloadPanoKey(destination)
    }
  }

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.75,
    opacity: hovering ? 1.0 : 0.333
  })

  // Pick the geometry
  const objInfo = OBJ_DATA[type]

  // Load the geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, objInfo.filename)
  const { nodes } = useGraph(loadedObj.clone())

  // Global texture loader status
  const loadingStatus = useRecoilValue(textureStatusState)

  // Color derived from loading status
  const [exitColor, setExitColor] = React.useState(LOADED_COLOR)
  React.useEffect(() => {
    // Determine overall loading status
    const imageLoadingStatus = textureFiles.reduce(
      (prev, filename) => {
        // Failed status always prevails
        if (prev === LOADING_STATUS.FAILED) {
          return prev
        }

        // If this one is not DONE, use its status
        if (loadingStatus[filename] !== LOADING_STATUS.DONE) {
          return loadingStatus[filename]
        }

        // Otherwise, stick with previous status
        return prev
      },
      LOADING_STATUS.DONE
    )

    // Change color based on status
    switch (imageLoadingStatus) {
      case LOADING_STATUS.DONE: setExitColor(LOADED_COLOR); break
      case LOADING_STATUS.FAILED: setExitColor(FAILED_COLOR); break
    }
  }, [loadingStatus, textureFiles])

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <animated.mesh scale={springs.scale} key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={exitColor} />
    </animated.mesh>
  ))

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(direction)}
      {...rest}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <group
        position={[shift, height, distance]}
        rotation-x={objInfo.rotation[0] + (alignment[0] / 180 * Math.PI)}
        rotation-y={objInfo.rotation[1] + (alignment[1] / 180 * Math.PI)}
        rotation-z={objInfo.rotation[2] + (alignment[2] / 180 * Math.PI)}
      >
        {meshes}
      </group>
    </group>
  )
}

ExitIndicator.propTypes = {
  type: PropTypes.oneOf(['arrow', 'teleport', 'door', 'stairsUp', 'stairsDown']),
  shift: PropTypes.number,
  height: PropTypes.number,
  distance: PropTypes.number,
  direction: PropTypes.number,
  alignment: PropTypes.arrayOf(PropTypes.number),
  destination: PropTypes.string
}

ExitIndicator.defaultProps = {
  type: 'arrow',
  shift: 0,
  height: -2.5,
  distance: 5,
  direction: 0,
  alignment: [0, 0, 0],
  destination: ''
}
